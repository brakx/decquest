const DQ={
 heroes:()=>[
  {id:'h1',side:'hero',name:'Steve',power:2,maxHp:4,hp:4,mana:0,xp:0,alive:true,tapped:false,temporary:false,keywords:[],spells:[{id:'shock',name:'Shock',cost:1,effect:'damage',amount:2,speed:'Instant',target:'anyLiving'}],abilities:[]},
  {id:'h2',side:'hero',name:'Jim',power:1,maxHp:4,hp:4,mana:0,xp:0,alive:true,tapped:false,temporary:false,keywords:[],spells:[],abilities:[{id:'rock',name:'Mind Stone',effect:'mana',amount:1,target:'anyLiving'}]},
  {id:'h3',side:'hero',name:'Kat',power:2,maxHp:3,hp:3,mana:0,xp:0,alive:true,tapped:false,temporary:false,keywords:['Vigilance'],spells:[{id:'counter',name:'Counterspell',cost:2,effect:'counter',speed:'Instant',target:'action'}],abilities:[]},
  {id:'h4',side:'hero',name:'Bill',power:1,maxHp:5,hp:5,mana:0,xp:0,alive:true,tapped:false,temporary:false,keywords:[],spells:[{id:'reanimate',name:'Reanimate',cost:2,effect:'reanimate',speed:'Sorcery',target:'anyDead'}],abilities:[{id:'dork',name:'Mana Dork',effect:'mana',amount:1,target:'anyLiving'}]}
 ],
 themes:[['Goblins','Smoke drifts through a canyon.',['Goblin Scout','Goblin Piker','Goblin Shaman']],['Elves','Ancient trees close around the path.',['Elvish Mystic','Elven Archer','Elvish Warrior']],['Zombies','Loose soil shifts beneath old graves.',['Walking Corpse','Diregraf Ghoul','Ghoulcaller']]],
 portals:[['Kamigawa: Neon Dynasty','A neon city glitters beyond the rift.'],['Fallout','A toxic wasteland stretches past faded signs.'],['Bloomburrow','Tiny villages wind through towering flowers.'],['Innistrad','A moonlit village waits beneath crooked spires.']]
};
