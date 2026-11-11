class Combat{
 constructor(party,enemies,draw){this.party=party;this.enemies=enemies;this.draw=draw;this.order=[];this.turn=0;this.round=1;this.state='START';this.pending=null;this.log=[];this.debug={};this.exileWarning=null;this.trampleContext=null}
 all(){return[...this.party,...this.enemies]}
 live(side){const list=side==='party'?this.party:this.enemies;return list.filter(x=>x.alive&&!x.exiled)}
 unit(id){return this.all().find(x=>x.id===id)}
 current(){return this.unit(this.order[this.turn]?.id)}
 say(x){this.log.unshift(x)}
 show(){this.draw()}
 start(){this.party.forEach(x=>{x.hp=x.maxHp;x.alive=true;x.tapped=false;x.mana=0;x.exiled=false});this.order=this.all().map((x,n)=>({id:x.id,roll:1+Math.floor(Math.random()*10)+(x.keywords.includes('Haste')?5:0),n})).sort((a,b)=>b.roll-a.roll||a.n-b.n);this.begin()}
 begin(){if(this.end())return;if(this.turn>=this.order.length){this.turn=0;this.round++}const u=this.current();if(!u||!u.alive||u.exiled){this.next();return}if(u.side==='hero'){u.tapped=false;u.mana++;this.state='HERO';this.say(`${u.name} gains 1 mana.`);this.show()}else{this.state='ENEMY';this.show();setTimeout(()=>this.enemy(u),250)}}
 next(){this.turn++;this.begin()}
 has(u,k){return(u.keywords||[]).includes(k)}
 canAttack(a,t){return !this.has(t,'Flying')||this.has(a,'Flying')||this.has(a,'Reach')}
 protectionKeyword(t){return(t.keywords||[]).find(k=>k.startsWith('Protection from '))}
 protectedFrom(a,t){const k=this.protectionKeyword(t);return Boolean(k&&(a.colors||[]).includes(k.replace('Protection from ','')))}
 targetLegal(a,t,kind='attack'){if(!t||!t.alive||t.exiled)return false;if(kind==='attack'&&!this.canAttack(a,t))return false;if(this.protectedFrom(a,t))return false;if(kind!=='attack'&&a.side!==t.side&&this.has(t,'Hexproof'))return false;return true}
 chooseAttack(){this.pending={kind:'attack',actor:this.current()};this.state='GROUP';this.show()}
 chooseGroup(g){this.pending.group=g;this.state='TARGET';this.show()}
 cancel(){this.pending=null;this.state='HERO';this.show()}
 targets(){if(!this.pending)return[];return this.live(this.pending.group).filter(t=>this.targetLegal(this.pending.actor,t,this.pending.kind))}
 target(id){const p=this.pending,a=p?.actor,t=this.unit(id),group=p?.group;if(!a||!t||!this.targets().some(x=>x.id===id)){this.say('That target is not legal.');this.cancel();return}this.pending=null;this.resolveAttack(a,t,group)}
 resolveAttack(a,t,group){
  this.debug={attacker:(a.keywords||[]).join(', ')||'none',target:(t.keywords||[]).join(', ')||'none',attempt:0,prevented:0,dealt:0,deathtouch:false,trample:0,lifelink:0,events:[]};
  if(!this.has(a,'Vigilance'))a.tapped=true;
  const strikes=this.has(a,'Double Strike')?2:1;
  for(let strike=1;strike<=strikes;strike++){
   if(!t.alive||t.exiled)break;
   this.resolveDamageEvent(a,t,a.power,`Strike ${strike}`,group,true);
  }
  if(this.trampleContext?.remaining>0){
   const valid=this.validTrampleTargets();
   this.trampleContext.validTargetIds=valid.map(x=>x.id);
   this.debug.trample=this.trampleContext.remaining;
   if(valid.length){this.state='TRAMPLE';this.show();return}
   this.say(`No valid spillover targets. ${this.trampleContext.remaining} trample damage is discarded.`);
   this.trampleContext=null;
  }
  if(!this.end())this.next();
 }
 lethalRequired(a,t){const remaining=Math.max(0,t.hp);if(this.has(a,'Deathtouch')&&!this.has(t,'Indestructible'))return Math.min(1,remaining);return remaining}
 resolveDamageEvent(a,t,amount,label,group,allowTrample){
  const required=this.lethalRequired(a,t),trample=allowTrample&&this.has(a,'Trample');
  const assigned=trample?Math.min(amount,required):amount,excess=trample?Math.max(0,amount-assigned):0;
  let damage=assigned,prevented=0;
  if(this.protectedFrom(a,t)){prevented=damage;damage=0}
  const indestructible=this.has(t,'Indestructible');
  t.hp=Math.max(0,t.hp-damage);
  const deathtouch=damage>0&&this.has(a,'Deathtouch')&&!indestructible;
  if((t.hp<=0||deathtouch)&&!indestructible)t.alive=false;
  const heal=this.has(a,'Lifelink')&&damage>0?Math.min(damage,a.maxHp-a.hp):0;
  if(heal>0)a.hp+=heal;
  this.debug.attempt+=amount;this.debug.prevented+=prevented;this.debug.dealt+=damage;this.debug.deathtouch=this.debug.deathtouch||deathtouch;this.debug.lifelink+=heal;
  this.debug.events.push({label,attempted:amount,required,assigned,dealt:damage,prevented,deathtouch,lifelink:heal,excess});
  this.say(`${a.name} ${label.toLowerCase()} deals ${damage} to ${t.name}.`);
  if(deathtouch)this.say('Deathtouch is lethal.');
  if(indestructible&&(t.hp<=0||this.has(a,'Deathtouch')))this.say(`${t.name} survives because it is Indestructible.`);
  if(!t.alive){this.say(`${t.name} is defeated.`);if(a.side==='hero')a.xp=(a.xp||0)+(t.mv||0)}
  if(excess>0){
   if(!this.trampleContext)this.trampleContext={attackerId:a.id,originalTargetId:t.id,targetGroup:group,remaining:0,validTargetIds:[]};
   this.trampleContext.remaining+=excess;
  }
 }
 validTrampleTargets(){const c=this.trampleContext;if(!c)return[];return this.live(c.targetGroup).filter(x=>x.id!==c.originalTargetId)}
 trampleTarget(id){
  const c=this.trampleContext;if(!c)return;
  const valid=this.validTrampleTargets();c.validTargetIds=valid.map(x=>x.id);
  if(!c.validTargetIds.includes(id)){
   this.say('Trample targets changed. The target list was rebuilt.');
   if(!valid.length){this.say(`No valid spillover targets. ${c.remaining} trample damage is discarded.`);this.trampleContext=null;if(!this.end())this.next()}else this.show();
   return;
  }
  const a=this.unit(c.attackerId),t=this.unit(id),damage=c.remaining,group=c.targetGroup;
  this.trampleContext=null;
  this.resolveDamageEvent(a,t,damage,'trample spillover',group,false);
  this.say(`${a.name} assigns ${damage} trample damage to ${t.name}.`);
  if(!this.end())this.next();
 }
 pass(){this.next()}
 enemy(a){
  if(a.bossExile&&this.round%3===0&&!a.exileUsed){const targets=this.live('party');const t=targets[Math.floor(Math.random()*targets.length)];a.exileUsed=true;this.exileWarning={source:a,target:t};this.state='EXILE_WARNING';this.say(`${a.name} prepares Void Judgment to exile ${t.name}.`);this.show();return}
  const targets=this.live('party').filter(t=>this.targetLegal(a,t,'attack'));
  if(!targets.length){this.say(`${a.name} has no legal attack target.`);this.next();return}
  const t=targets[Math.floor(Math.random()*targets.length)],strikes=this.has(a,'Double Strike')?2:1;
  for(let strike=1;strike<=strikes;strike++){
   if(!t.alive||t.exiled)break;
   const damage=a.power,indestructible=this.has(t,'Indestructible');
   t.hp=Math.max(0,t.hp-damage);
   const deathtouch=damage>0&&this.has(a,'Deathtouch')&&!indestructible;
   if((t.hp<=0||deathtouch)&&!indestructible)t.alive=false;
   const heal=this.has(a,'Lifelink')?Math.min(damage,a.maxHp-a.hp):0;if(heal>0)a.hp+=heal;
   this.say(`${a.name} strike ${strike} deals ${damage} to ${t.name}.`);
   if(indestructible&&(t.hp<=0||this.has(a,'Deathtouch')))this.say(`${t.name} survives because it is Indestructible.`);
  }
  if(!this.end())this.next();
 }
 resolveBossExile(counter=false){const w=this.exileWarning;if(!w)return;if(counter)this.say('Void Judgment is countered.');else{w.target.exiled=true;w.target.alive=false;this.say(`${w.target.name} is exiled for the rest of the room. Indestructible does not stop exile.`)}this.exileWarning=null;if(!this.end())this.next()}
 end(){if(!this.live('enemy').length){this.state='WIN';this.show();return true}if(!this.live('party').length){this.state='LOSE';this.show();return true}return false}
}
