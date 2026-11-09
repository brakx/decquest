const DekQuestData={
  heroes(){return[
    {id:"h1",side:"hero",name:"Steve",power:2,maxHp:4,hp:4,mana:0,xp:0,alive:true,tapped:false,keywords:[],spells:[{id:"shock",name:"Shock",cost:1,speed:"Instant",effect:"damage",amount:2}],abilities:[]},
    {id:"h2",side:"hero",name:"Jim",power:1,maxHp:4,hp:4,mana:0,xp:0,alive:true,tapped:false,keywords:[],spells:[],abilities:[{id:"mindstone",name:"Mind Stone",effect:"giveMana",amount:1}]},
    {id:"h3",side:"hero",name:"Kat",power:2,maxHp:3,hp:3,mana:0,xp:0,alive:true,tapped:false,keywords:["Vigilance"],spells:[{id:"counterspell",name:"Counterspell",cost:2,speed:"Instant",effect:"counter"}],abilities:[]},
    {id:"h4",side:"hero",name:"Bill",power:1,maxHp:5,hp:5,mana:0,xp:0,alive:true,tapped:false,keywords:[],spells:[{id:"reanimate",name:"Reanimate",cost:2,speed:"Sorcery",effect:"reanimate"}],abilities:[{id:"elfmana",name:"Mana Dork",effect:"giveMana",amount:1}]}
  ]},
  enemyTemplates:[
    {power:1,maxHp:2,manaValue:1},
    {power:2,maxHp:2,manaValue:2},
    {power:1,maxHp:3,manaValue:2,spell:{name:"Arcane Spark",amount:2}}
  ],
  themes:[
    {name:"Goblins",intro:"Smoke drifts through a narrow canyon. Distant shouting echoes between the rocks.",names:["Goblin Scout","Goblin Piker","Goblin Shaman"]},
    {name:"Elves",intro:"Ancient trees close around the path. You hear bowstrings tighten somewhere above.",names:["Elvish Mystic","Elven Archer","Elvish Warrior"]},
    {name:"Zombies",intro:"The air turns cold. Loose soil shifts beneath weathered gravestones.",names:["Walking Corpse","Diregraf Ghoul","Ghoulcaller"]},
    {name:"Knights",intro:"Banners snap over a ruined road. Armored figures lower their visors.",names:["Youthful Knight","Black Knight","Order Captain"]}
  ],
  portals:[
    {set:"Kamigawa: Neon Dynasty",text:"A neon city glitters beyond the rift while mechanical spirits cross the skyline."},
    {set:"Fallout",text:"A toxic wasteland stretches past faded Nuka-Cola signs and rusting machines."},
    {set:"Bloomburrow",text:"A bright valley of tiny villages winds through towering flowers and mossy paths."},
    {set:"Innistrad",text:"A moonlit village sits beneath crooked spires as wolves call from the forest."}
  ]
};
