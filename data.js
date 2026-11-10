const DQ={
 standard:[
  {name:'Savannah Lions',power:2,hp:1,mv:1,colors:['White'],types:['Cat'],keywords:[]},
  {name:'Storm Crow',power:1,hp:2,mv:2,colors:['Blue'],types:['Bird'],keywords:['Flying']},
  {name:'Goblin Piker',power:2,hp:1,mv:2,colors:['Red'],types:['Goblin','Warrior'],keywords:[]},
  {name:'Llanowar Elves',power:1,hp:1,mv:1,colors:['Green'],types:['Elf','Druid'],keywords:[],ability:'Mana Dork'},
  {name:'Typhoid Rats',power:1,hp:1,mv:1,colors:['Black'],types:['Rat'],keywords:['Deathtouch']},
  {name:'Runeclaw Bear',power:2,hp:2,mv:2,colors:['Green'],types:['Bear'],keywords:[]}
 ],
 keyword:[
  {name:'Sky Tester',power:2,hp:2,mv:2,colors:['Blue'],types:['Bird'],keywords:['Flying']},
  {name:'Tower Tester',power:2,hp:3,mv:3,colors:['Green'],types:['Archer'],keywords:['Reach']},
  {name:'Twinblade Tester',power:2,hp:2,mv:3,colors:['White'],types:['Knight'],keywords:['Double Strike']},
  {name:'Watchful Tester',power:2,hp:3,mv:3,colors:['White'],types:['Soldier'],keywords:['Vigilance']},
  {name:'Swift Tester',power:2,hp:2,mv:2,colors:['Red'],types:['Warrior'],keywords:['Haste']},
  {name:'Venom Tester',power:1,hp:1,mv:1,colors:['Black'],types:['Snake'],keywords:['Deathtouch']},
  {name:'Blood Tester',power:2,hp:2,mv:2,colors:['Black'],types:['Vampire'],keywords:['Lifelink']},
  {name:'Hidden Tester',power:2,hp:2,mv:2,colors:['Blue'],types:['Rogue'],keywords:['Hexproof']},
  {name:'Immortal Tester',power:2,hp:2,mv:3,colors:['Colorless'],types:['Construct'],keywords:['Indestructible']},
  {name:'Protected Tester',power:2,hp:2,mv:2,colors:['White'],types:['Cleric'],keywords:['Protection from Red']},
  {name:'Crushing Tester',power:4,hp:2,mv:4,colors:['Green'],types:['Beast'],keywords:['Trample']},
  {name:'Venomous Charger',power:5,hp:3,mv:5,colors:['Black','Green'],types:['Beast'],keywords:['Deathtouch','Trample']},
  {name:'Sunblade Tester',power:2,hp:3,mv:4,colors:['White'],types:['Knight'],keywords:['Double Strike','Lifelink']},
  {name:'Skyguard Tester',power:2,hp:3,mv:4,colors:['White','Blue'],types:['Bird','Soldier'],keywords:['Flying','Vigilance']}
 ],
 enemyPool:[
  {name:'Test Rat',power:1,hp:1,mv:1,colors:['Black'],keywords:['Deathtouch']},
  {name:'Test Goblin',power:1,hp:2,mv:1,colors:['Red'],keywords:[]},
  {name:'Test Drake',power:2,hp:2,mv:2,colors:['Blue'],keywords:['Flying']},
  {name:'Test Archer',power:2,hp:3,mv:3,colors:['Green'],keywords:['Reach']},
  {name:'Test Knight',power:3,hp:3,mv:3,colors:['White'],keywords:['Vigilance']},
  {name:'Test Angel',power:4,hp:4,mv:4,colors:['White'],keywords:['Flying','Vigilance']}
 ]
};
DQ.rewards=[
 {name:'Wind Drake',kind:'Creature',power:2,hp:2,colors:['Blue'],types:['Drake'],keywords:['Flying']},
 {name:'Deadly Recluse',kind:'Creature',power:1,hp:2,colors:['Green'],types:['Spider'],keywords:['Reach','Deathtouch']},
 {name:'Swiftblade',kind:'Creature',power:1,hp:2,colors:['White','Red'],types:['Soldier'],keywords:['Double Strike']},
 {name:'Serra Angel',kind:'Creature',power:4,hp:4,colors:['White'],types:['Angel'],keywords:['Flying','Vigilance']},
 {name:'Shadowspear',kind:'Equipment',power:1,hp:1,colors:['Colorless'],types:[],keywords:['Trample','Lifelink']},
 {name:'Swiftfoot Boots',kind:'Equipment',power:0,hp:0,colors:['Colorless'],types:[],keywords:['Haste','Hexproof']},
 {name:'Darksteel Plate',kind:'Equipment',power:0,hp:1,colors:['Colorless'],types:[],keywords:['Indestructible']},
 {name:'Rancor',kind:'Aura',power:2,hp:0,colors:['Green'],types:[],keywords:['Trample']}
];
DQ.prefixes=['Caffeinated','Mindless','Daft','Questionably Legal','Overclocked','Slightly Moist'];
DQ.suffixes=['the Swift','of Mild Concern','from Accounting','the Adequate','of Regret','the Unlicensed'];
DQ.portals=[['Kamigawa: Neon Dynasty','A neon city glitters beyond the rift.'],['Fallout','A toxic wasteland stretches past faded signs.'],['Bloomburrow','Tiny villages wind through towering flowers.'],['Innistrad','A moonlit village waits beneath crooked spires.']];
DQ.cardPools={
 Standard:{description:'A smaller modern-style pool with straightforward creatures and evergreen mechanics.',allowed:['Savannah Lions','Storm Crow','Goblin Piker','Llanowar Elves','Typhoid Rats','Runeclaw Bear']},
 Pauper:{description:'Commons-focused gameplay with efficient creatures, fewer bombs, and tighter resource decisions.',allowed:['Storm Crow','Goblin Piker','Llanowar Elves','Typhoid Rats','Runeclaw Bear']},
 Legacy:{description:'A broad, high-powered pool with old and new mechanics available together.',allowed:null},
 Vintage:{description:'The broadest experimental pool with the strongest test cards and combinations.',allowed:null}
};
