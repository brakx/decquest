const DekQuestData={
 heroes(){return[
{id:"h1",side:"hero",name:"Steve",power:2,maxHp:4,hp:4,mana:0,xp:0,alive:true,tapped:false,keywords:[],spells:[{id:"shock",name:"Shock",cost:1,speed:"Instant",effect:"damage",amount:2}]},
{id:"h2",side:"hero",name:"Jim",power:1,maxHp:4,hp:4,mana:0,xp:0,alive:true,tapped:false,keywords:[],spells:[],abilities:[{id:"mindstone",name:"Mind Stone",effect:"giveMana",amount:1}]},
{id:"h3",side:"hero",name:"Kat",power:2,maxHp:3,hp:3,mana:0,xp:0,alive:true,tapped:false,keywords:["Vigilance"],spells:[{id:"counterspell",name:"Counterspell",cost:2,speed:"Instant",effect:"counter"}]},
{id:"h4",side:"hero",name:"Bill",power:1,maxHp:5,hp:5,mana:0,xp:0,alive:true,tapped:false,keywords:[],spells:[{id:"reanimate",name:"Reanimate",cost:2,speed:"Sorcery",effect:"reanimate"}],abilities:[{id:"elfmana",name:"Mana Dork",effect:"giveMana",amount:1}]}
]},
 enemies(){return[
{id:"e1",side:"enemy",name:"Goblin Arsonist",power:1,maxHp:2,hp:2,manaValue:1,alive:true},
{id:"e2",side:"enemy",name:"Goblin Piker",power:2,maxHp:2,hp:2,manaValue:2,alive:true},
{id:"e3",side:"enemy",name:"Goblin Shaman",power:1,maxHp:3,hp:3,manaValue:2,alive:true,spell:{name:"Ember Bolt",amount:2}}
]}
};
