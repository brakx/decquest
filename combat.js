class CombatEngine{
  constructor(heroes,enemies,onChange){this.heroes=heroes;this.enemies=enemies;this.onChange=onChange;this.state="INITIATIVE";this.round=1;this.turnIndex=0;this.initiative=[];this.log=[];this.pending=null;this.responseAction=null}
  rollD10(){return Math.floor(Math.random()*10)+1} all(){return[...this.heroes,...this.enemies]} living(side){return(side==="hero"?this.heroes:this.enemies).filter(x=>x.alive)} getUnit(id){return this.all().find(x=>x.id===id)} current(){const x=this.initiative[this.turnIndex];return x?this.getUnit(x.id):null} notify(){this.onChange?.()} addLog(x){this.log.unshift(x);this.log=this.log.slice(0,60)}
  start(){this.heroes.forEach(h=>{h.alive=true;h.hp=h.maxHp;h.tapped=false;h.mana=0});this.initiative=this.all().map((u,i)=>({id:u.id,side:u.side,roll:this.rollD10()+(u.keywords?.includes("Haste")?5:0),i})).sort((a,b)=>b.roll-a.roll||a.i-b.i);this.addLog("Initiative rolled.");this.beginTurn()}
  beginTurn(){if(this.checkEnd())return;if(this.turnIndex>=this.initiative.length){this.turnIndex=0;this.round++;this.addLog(`Round ${this.round} begins.`)}const u=this.current();if(!u||!u.alive){this.advance();return}if(u.side==="hero"){u.tapped=false;u.mana++;this.state="PLAYER_TURN";this.addLog(`${u.name} untaps and gains 1 mana.`);this.notify()}else{this.state="ENEMY_TURN";this.notify();setTimeout(()=>this.prepareEnemyAction(u),350)}}
  chooseAttack(){if(this.state!=="PLAYER_TURN"||this.current().tapped)return;this.pending={type:"attack"};this.state="TARGET_ENEMY";this.notify()}
  chooseSpell(id){const h=this.current(),s=h.spells.find(x=>x.id===id);if(this.state!=="PLAYER_TURN"||h.tapped||!s||h.mana<s.cost)return;this.pending={type:"spell",spell:s};this.state=s.effect==="reanimate"?"TARGET_GRAVE":"TARGET_ENEMY";this.notify()}
  chooseAbility(id){const h=this.current(),a=h.abilities.find(x=>x.id===id);if(this.state!=="PLAYER_TURN"||h.tapped||!a)return;this.pending={type:"ability",ability:a};this.state="TARGET_HERO";this.notify()}
  cancel(){this.pending=null;this.state="PLAYER_TURN";this.notify()}
  selectTarget(id){const a=this.current(),t=this.getUnit(id);if(!this.pending||!a||!t)return;if(this.pending.type==="attack"){this.damage(a,t,a.power);if(!a.keywords.includes("Vigilance"))a.tapped=true}else if(this.pending.type==="spell"){const s=this.pending.spell;a.mana-=s.cost;a.tapped=true;if(s.effect==="damage")this.damage(a,t,s.amount);else{t.alive=true;t.hp=t.maxHp;t.tapped=true;this.addLog(`${a.name} reanimates ${t.name}. It returns tapped.`)}}else{a.tapped=true;t.mana+=this.pending.ability.amount;this.addLog(`${a.name} adds ${this.pending.ability.amount} mana to ${t.name}.`)}this.pending=null;this.notify();if(!this.checkEnd())this.advance()}
  damage(a,t,n){t.hp=Math.max(0,t.hp-n);this.addLog(`${a.name} deals ${n} damage to ${t.name}.`);if(t.hp<=0){t.alive=false;this.addLog(`${t.name} is defeated.`);if(a.side==="hero"&&t.side==="enemy"){a.xp=(a.xp||0)+t.manaValue;this.addLog(`${a.name} gains ${t.manaValue} XP.`)}}}
  pass(){if(this.state!=="PLAYER_TURN")return;this.addLog(`${this.current().name} passes.`);this.advance()}
  prepareEnemyAction(e){const targets=this.living("hero"),weighted=[];targets.forEach(h=>{for(let i=0;i<(h.tapped?1:3);i++)weighted.push(h)});const t=weighted[Math.floor(Math.random()*weighted.length)],isSpell=e.spell&&Math.random()<.45;this.responseAction={enemy:e,target:t,type:isSpell?"spell":"attack",name:isSpell?e.spell.name:"Attack",damage:isSpell?e.spell.amount:e.power};if(this.availableResponses(this.responseAction).length){this.state="RESPONSE";this.notify()}else this.resolveEnemyAction()}
  availableResponses(a){const out=[];this.heroes.forEach(h=>{if(!h.alive||h.tapped)return;h.spells.forEach(s=>{if(h.mana<s.cost||s.speed!=="Instant")return;if(s.effect==="counter"&&a.type==="spell")out.push({hero:h,spell:s});if(s.effect==="damage")out.push({hero:h,spell:s})})});return out}
  finishResponseAdvance(){
    this.responseAction=null;
    this.state="TURN_START";
    this.notify();
    setTimeout(()=>{this.turnIndex++;this.beginTurn()},200);
  }
  useResponse(hid,sid){
    try{
      if(this.state!=="RESPONSE"||!this.responseAction)throw new Error("No active response window");
      const hero=this.getUnit(hid);
      if(!hero)throw new Error(`Hero ${hid} not found`);
      const spell=(hero.spells||[]).find(item=>item.id===sid);
      if(!spell)throw new Error(`Spell ${sid} not found`);
      if(!hero.alive)throw new Error(`${hero.name} is not alive`);
      if(hero.tapped)throw new Error(`${hero.name} is tapped`);
      if(hero.mana<spell.cost)throw new Error(`${hero.name} lacks mana`);
      const action=this.responseAction;
      hero.mana-=spell.cost;
      hero.tapped=true;
      if(spell.effect==="counter"){
        this.addLog(`${hero.name} casts ${spell.name}. ${action.name} is countered.`);
        this.finishResponseAdvance();
        return;
      }
      if(spell.effect==="damage"){
        this.addLog(`${hero.name} casts ${spell.name} in response.`);
        this.damage(hero,action.enemy,spell.amount);
        if(!action.enemy.alive){
          this.addLog(`${action.name} is removed because ${action.enemy.name} was defeated.`);
          this.responseAction=null;
          if(this.checkEnd())return;
          this.state="TURN_START";
          this.notify();
          setTimeout(()=>{this.turnIndex++;this.beginTurn()},200);
          return;
        }
        this.addLog(`${action.enemy.name} survives. ${action.name} resolves next.`);
        this.state="ENEMY_TURN";
        this.notify();
        setTimeout(()=>this.resolveEnemyAction(),200);
        return;
      }
      throw new Error(`Unsupported response effect: ${spell.effect}`);
    }catch(error){
      this.addLog(`Response error: ${error.message}`);
      this.state="RESPONSE";
      this.notify();
    }
  }
  declineResponse(){
    try{
      if(this.state!=="RESPONSE"||!this.responseAction)throw new Error("No active response window");
      this.addLog("No response. The enemy action resolves.");
      this.state="ENEMY_TURN";
      this.notify();
      setTimeout(()=>this.resolveEnemyAction(),200);
    }catch(error){
      this.addLog(`No Response error: ${error.message}`);
      this.notify();
    }
  }
  resolveEnemyAction(){const a=this.responseAction;if(a&&a.enemy.alive&&a.target.alive){a.target.hp=Math.max(0,a.target.hp-a.damage);this.addLog(`${a.enemy.name} uses ${a.name} on ${a.target.name} for ${a.damage}.`);if(a.target.hp<=0){a.target.alive=false;this.addLog(`${a.target.name} falls.`)}}this.responseAction=null;this.notify();if(!this.checkEnd())setTimeout(()=>this.advance(),250)}
  advance(){if(this.checkEnd())return;this.turnIndex++;this.state="TURN_START";this.beginTurn()}
  checkEnd(){if(!this.living("enemy").length){this.state="VICTORY";this.heroes.forEach(h=>{h.alive=true;h.hp=h.maxHp;h.tapped=false});this.addLog("Victory. Heroes return at full health.");this.notify();return true}if(!this.living("hero").length){this.state="DEFEAT";this.addLog("Party defeated.");this.notify();return true}return false}
}
