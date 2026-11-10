let party=[],engine=null,screen="MENU",chapter=1,room=1,currentTheme=null,currentSet="",checkpoint=null,encounterSerial=0,levelQueue=[],levelHero=null,rewardPack=[],stickerChoices=[];
const app=document.getElementById("app"),esc=v=>String(v).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#039;"}[c]));

const SAVE_KEY="dekquest.autosave.v0.9";
let lastAutosave="Never";
function saveSnapshot(){
 return {version:"0.9",savedAt:new Date().toISOString(),screen,chapter,room,currentTheme,currentSet,checkpoint,encounterSerial,party};
}
function autosave(reason="state change"){
 try{
  const snapshot=saveSnapshot();
  localStorage.setItem(SAVE_KEY,JSON.stringify(snapshot));
  lastAutosave=new Date().toLocaleTimeString();
  console.log(`[DekQuest] Autosaved: ${reason}`,snapshot);
 }catch(error){console.error("Autosave failed",error)}
}
function hasAutosave(){return Boolean(localStorage.getItem(SAVE_KEY))}
function continueAutosave(){
 try{
  const raw=localStorage.getItem(SAVE_KEY);if(!raw)throw new Error("No autosave found");
  const saved=JSON.parse(raw);party=saved.party||[];chapter=saved.chapter||1;room=saved.room||1;currentTheme=saved.currentTheme||null;currentSet=saved.currentSet||"";checkpoint=saved.checkpoint||null;encounterSerial=saved.encounterSerial||0;
  restore();screen=(saved.screen==="SAVE"||saved.screen==="BOSS"||saved.screen==="ROOM"||saved.screen==="WIN")?saved.screen:"ROOM";
  lastAutosave=saved.savedAt?new Date(saved.savedAt).toLocaleTimeString():"Loaded";render();
 }catch(error){alert(`Could not load autosave: ${error.message}`)}
}
function clearAutosave(){localStorage.removeItem(SAVE_KEY);lastAutosave="Cleared";newRun()}
function clone(x){return JSON.parse(JSON.stringify(x))}
function unique(a){return [...new Set(a)]}
function sample(a,n){const c=[...a],o=[];while(c.length&&o.length<n)o.push(c.splice(Math.floor(Math.random()*c.length),1)[0]);return o}
function xpNeed(h){return h.level*3}
function updateHeroName(h){h.name=[...h.prefixes,h.baseName,...h.suffixes].join(" ")}
function restore(){party.forEach(h=>{h.alive=true;h.hp=h.maxHp;h.tapped=false;h.mana=0})}
function newRun(){party=DekQuestData.heroes();chapter=1;room=1;checkpoint=null;currentTheme=null;currentSet="";encounterSerial=0;screen="ROOM";autosave("new run");render()}
function debugPanel(){
 const theme=currentTheme?.name||"none";
 const combatState=engine?.state||"none";
 return `<aside class="debug-panel"><strong>DEBUG 0.9</strong><span>Screen: ${esc(screen)}</span><span>Chapter: ${chapter}</span><span>Room: ${room}/6</span><span>Encounter: ${encounterSerial}</span><span>Theme: ${esc(theme)}</span><span>Set: ${esc(currentSet||"none")}</span><span>Combat: ${esc(combatState)}</span><span>Autosave: ${esc(lastAutosave)}</span></aside>`;
}
function progress(){return `<div class="progress">${["Room 1","Room 2","Room 3","Room 4","Save","Boss"].map((x,i)=>`<span class="${i+1<room?'done':i+1===room?'here':''}">${x}</span>`).join("")}</div>`}
function partyView(){return party.map(h=>`<div class="unit"><div class="row"><strong class="hero-name">${esc(h.name)}</strong><span>${h.power}/${h.maxHp}</span></div><div class="meta">Level ${h.level} | XP ${h.xp}/${xpNeed(h)} | ${esc(h.colors.join('/'))}</div><div class="meta">Types: ${esc(h.types.join(' '))}</div><div class="meta">${esc(h.keywords.join(', ')||'No keywords')}</div></div>`).join('')}
function renderMenu(){app.innerHTML=`<section class="panel"><h2>DekQuest Alpha 0.9</h2><p>Autosave stores progress in this browser after rooms, rewards, save points, and bosses.</p><div class="actions"><button onclick="newRun()">Start New Run</button>${hasAutosave()?'<button onclick="continueAutosave()">Continue Autosave</button>':''}<button class="secondary" onclick="clearAutosave()">Clear Autosave</button></div><p class="meta">Last autosave: ${esc(lastAutosave)}</p></section>`}
function renderRoom(){if(room===5){screen="SAVE";return renderSave()}if(room===6){screen="BOSS";return renderBoss()}if(room===2||room===4)return renderPortals();currentTheme=DekQuestData.themes[Math.floor(Math.random()*DekQuestData.themes.length)];currentSet="";app.innerHTML=`<section class="panel"><h2>Chapter ${chapter}, Room ${room}</h2>${progress()}<p>${esc(currentTheme.intro)}</p><button onclick="startCombat(false)">Enter Room</button></section><section class="panel"><h2>Party</h2>${partyView()}</section>`}
function renderPortals(){const picks=[...DekQuestData.portals].sort(()=>Math.random()-.5).slice(0,2);app.innerHTML=`<section class="panel"><h2>Choose a Portal</h2>${progress()}<div class="room-grid">${picks.map((p,i)=>`<article class="room-card portal-${i?'b':'a'}"><h3>${esc(p.set)}</h3><p>${esc(p.text)}</p><button onclick='choosePortal(${JSON.stringify(p.set)})'>Enter</button></article>`).join('')}</div></section>`}
function choosePortal(s){currentSet=s;currentTheme=null;autosave("portal selected");startCombat(false)}
function makeEnemies(boss){if(boss)return[{id:"boss",side:"enemy",name:"Mythic Chimera",power:4,maxHp:10,hp:10,manaValue:7,alive:true,spell:{name:"Arcane Blast",amount:3}}];const names=currentSet?[`${currentSet} Scout`,`${currentSet} Warrior`,`${currentSet} Adept`]:currentTheme.names;return DekQuestData.enemyTemplates.map((t,i)=>({id:`e${i+1}`,side:"enemy",name:names[i],power:t.power,maxHp:t.maxHp,hp:t.maxHp,manaValue:t.manaValue,alive:true,spell:t.spell?clone(t.spell):undefined}))}
function startCombat(boss){restore();encounterSerial++;screen="COMBAT";engine=new CombatEngine(party,makeEnemies(boss),render);engine.start()}
function continueAfterFight(){
 restore();
 levelQueue=party.filter(h=>h.xp>=xpNeed(h));
 if(levelQueue.length){beginNextLevel();return}
 advanceRoom();
}
function advanceRoom(){
 const previousRoom=room;
 if(room===6){chapter++;room=1;screen="WIN"}else{room=room+1;screen="ROOM"}
 console.log(`[DekQuest] Advanced from room ${previousRoom} to room ${room}; screen=${screen}; chapter=${chapter}`);
 autosave("room advanced");
 render();
}
function beginNextLevel(){levelHero=levelQueue.shift();rewardPack=sample(DekQuestData.cards,3);screen="LEVEL_CARD";render()}
function chooseReward(index){
 const h=levelHero,c=rewardPack[index],need=xpNeed(h);
 h.xp-=need;h.level++;h.power+=c.power;h.maxHp+=c.toughness;h.hp=h.maxHp;
 h.colors=unique([...h.colors,...c.colors]);if(c.kind==="Creature")h.types=unique([...h.types,...c.types]);h.keywords=unique([...h.keywords,...c.keywords]);h.cards.push(c.name);
 stickerChoices=sample(h.level%2===0?DekQuestData.prefixes:DekQuestData.suffixes,3);screen="LEVEL_STICKER";render();
}
function chooseSticker(index){
 const h=levelHero,s=stickerChoices[index];if(h.level%2===0)h.prefixes.push(s);else h.suffixes.push(s);updateHeroName(h);
 if(h.xp>=xpNeed(h))levelQueue.unshift(h);
 autosave("level reward and sticker chosen");
 if(levelQueue.length)beginNextLevel();else advanceRoom();
}
function renderLevelCard(){app.innerHTML=`<section class="panel"><h2 class="good">${esc(levelHero.name)} Levels Up</h2><p>Choose one card. All listed stats and keywords are added permanently.</p><div class="room-grid">${rewardPack.map((c,i)=>`<article class="room-card"><h3>${esc(c.name)}</h3><p>${esc(c.kind)} | +${c.power}/+${c.toughness}</p><p>${esc(c.colors.join('/'))} ${esc(c.types.join(' '))}</p><p>${esc(c.keywords.join(', ')||'No keywords')}</p><button onclick="chooseReward(${i})">Choose</button></article>`).join('')}</div></section>`}
function renderLevelSticker(){const mode=levelHero.level%2===0?'Prefix':'Suffix';app.innerHTML=`<section class="panel"><h2>Choose a ${mode} Sticker</h2><p>Current name: <strong>${esc(levelHero.name)}</strong></p><div class="room-grid">${stickerChoices.map((x,i)=>`<article class="room-card"><h3>${esc(x)}</h3><button onclick="chooseSticker(${i})">Choose</button></article>`).join('')}</div></section>`}
function renderSave(){restore();checkpoint=clone({chapter,party});autosave("save point reached");app.innerHTML=`<section class="panel"><h2>Save Point</h2>${progress()}<p>Party restored. Boss retries return here.</p><div class="actions"><button onclick="room=6;screen='ROOM';render()">Continue</button><button class="secondary" onclick="exportSave()">Export XML</button></div></section><section class="panel">${partyView()}</section>`}
function exportSave(){const hs=party.map(h=>`  <Hero name="${h.name}" power="${h.power}" health="${h.maxHp}" xp="${h.xp||0}" />`).join('\n'),xml=`<DekQuestSave version="0.7">\n <Chapter>${chapter}</Chapter>\n${hs}\n</DekQuestSave>`,a=document.createElement('a');a.href=URL.createObjectURL(new Blob([xml],{type:'text/plain'}));a.download='DekQuest_Save.xml.txt';a.click();URL.revokeObjectURL(a.href)}
function renderBoss(){app.innerHTML=`<section class="panel"><h2>Boss Room</h2>${progress()}<p>A rare or mythic enemy waits beyond the gate.</p><button onclick="startCombat(true)">Challenge Boss</button></section>`}
function retryBoss(){if(checkpoint){chapter=checkpoint.chapter;party=clone(checkpoint.party);room=6;screen="BOSS";autosave("boss checkpoint restored");render()}else startCombat(true)}
function renderWin(){app.innerHTML=`<section class="panel"><h2 class="good">Boss Defeated</h2><p>Chapter ${chapter-1} complete.</p><button onclick="screen='ROOM';render()">Begin Chapter ${chapter}</button></section>`}
function unit(u,c){return `<div class="unit ${u.alive?'':'dead'} ${c?'current':''} ${u.tapped?'tapped':''}"><div class="row"><strong class="${u.side==='hero'?'hero-name':'enemy-name'}">${esc(u.name)}</strong><span>${u.alive?`${u.hp}/${u.maxHp}`:'Defeated'}</span></div><div class="meta">Power ${u.power}${u.side==='hero'?` | Mana ${u.mana} | ${u.tapped?'Tapped':'Untapped'}`:` | MV ${u.manaValue}`}</div></div>`}
function targets(items,title){return `<h2>${title}</h2><div class="target-list">${items.map(x=>`<button class="target-button" onclick="engine.selectTarget('${x.id}')"><span>${esc(x.name)}</span><span>${x.hp}/${x.maxHp}</span></button>`).join('')}</div><button class="secondary" onclick="engine.cancel()">Cancel</button>`}
function actionPanel(){const u=engine.current();if(engine.state==='PLAYER_TURN'){const s=(u.spells||[]).map(x=>`<button ${u.mana<x.cost?'disabled':''} onclick="engine.chooseSpell('${x.id}')">${esc(x.name)} (${x.cost})</button>`).join(''),a=(u.abilities||[]).map(x=>`<button onclick="engine.chooseAbility('${x.id}')">${esc(x.name)}</button>`).join('');return `<h2>${esc(u.name)}'s Turn</h2><div class="actions"><button onclick="engine.chooseAttack()">Attack (${u.power})</button>${s}${a}<button onclick="engine.pass()">Pass</button></div>`}if(engine.state==='TARGET_ENEMY')return targets(engine.living('enemy'),'Choose an enemy');if(engine.state==='TARGET_HERO')return targets(engine.living('hero'),'Choose a mana recipient');if(engine.state==='TARGET_GRAVE')return targets(engine.all().filter(x=>!x.alive),'Choose a dead target');if(engine.state==='RESPONSE'){const x=engine.responseAction;return `<h2>Instant Response</h2><p>${esc(x.enemy.name)} will use ${esc(x.name)} on ${esc(x.target.name)}.</p>${engine.availableResponses(x).map(r=>`<button onclick="handleInstantResponse(\'${r.hero.id}\',\'${r.spell.id}\')">${esc(r.hero.name)}: ${esc(r.spell.name)} (${r.spell.cost} mana)</button>`).join('')}<button class="secondary" onclick="handleNoResponse()">No Response</button>`}if(engine.state==='ENEMY_TURN')return `<h2>${esc(u.name)}'s Turn</h2><p class="warning">Enemy action resolving...</p>`;if(engine.state==='VICTORY')return `<h2 class="good">Victory</h2><button onclick="continueAfterFight()">Continue</button>`;if(engine.state==='DEFEAT')return `<h2 class="warning">Defeat</h2><button onclick="${room===6?'retryBoss()':'startCombat(false)'}">${room===6?'Reload Save Point':'Retry Room'}</button>`;return '<h2>Preparing...</h2>'}
function renderCombat(){const cur=engine.current(),id=cur?.id||'',init=engine.initiative.map((x,i)=>{const u=engine.getUnit(x.id),on=i===engine.turnIndex&&!['VICTORY','DEFEAT'].includes(engine.state);return `<span class="initiative-item ${x.side} ${on?'active':''}">${on?'▶ ':''}${esc(u.name)} (${x.roll})${u.alive?'':' ✕'}</span>`}).join('');app.innerHTML=`<section class="panel"><h2>${room===6?'Boss Battle':currentSet||currentTheme.name}</h2><div class="initiative">${init}</div></section><div class="grid"><section class="panel"><h2>Party</h2>${engine.heroes.map(h=>unit(h,h.id===id)).join('')}</section><section class="panel"><h2>Enemies</h2>${engine.enemies.map(e=>unit(e,e.id===id)).join('')}</section><section class="panel full">${actionPanel()}</section><section class="panel full"><h2>Combat Log</h2><div class="log">${engine.log.map(x=>`<div>${esc(x)}</div>`).join('')}</div></section></div>`}
function render(){if(screen==='MENU')renderMenu();else if(screen==='ROOM')renderRoom();else if(screen==='SAVE')renderSave();else if(screen==='BOSS')renderBoss();else if(screen==='COMBAT')renderCombat();else if(screen==='LEVEL_CARD')renderLevelCard();else if(screen==='LEVEL_STICKER')renderLevelSticker();else renderWin();app.insertAdjacentHTML('afterbegin',debugPanel())}
function handleInstantResponse(heroId,spellId){
 try{engine.useResponse(heroId,spellId)}catch(error){console.error(error);engine.addLog(`UI response error: ${error.message}`);engine.notify()}
}
function handleNoResponse(){
 try{engine.declineResponse()}catch(error){console.error(error);engine.addLog(`UI No Response error: ${error.message}`);engine.notify()}
}
window.addEventListener('beforeunload',()=>{if(party.length)autosave('page close')});
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden'&&party.length)autosave('page hidden')});
document.getElementById('newRunButton').addEventListener('click',newRun);render();
