const DQ={
 keyword:[
  ['Sky Tester',2,2,2,['Blue'],['Flying']],['Tower Tester',2,3,3,['Green'],['Reach']],['Twinblade Tester',2,2,3,['White'],['Double Strike']],['Watchful Tester',2,3,3,['White'],['Vigilance']],['Swift Tester',2,2,2,['Red'],['Haste']],['Venom Tester',1,1,1,['Black'],['Deathtouch']],['Blood Tester',2,4,2,['Black'],['Lifelink']],['Hidden Tester',2,2,2,['Blue'],['Hexproof']],['Immortal Tester',2,2,3,['Colorless'],['Indestructible']],['Protected Tester',2,2,2,['White'],['Protection from Red']],['Crushing Tester',4,2,4,['Green'],['Trample']],['Venomous Charger',5,3,5,['Black','Green'],['Deathtouch','Trample']],['Sunblade Tester',2,4,4,['White'],['Double Strike','Lifelink']]
 ],
 enemies:[
  ['Red Goblin',1,2,1,['Red'],[]],['Flying Drake',2,2,2,['Blue'],['Flying']],['Reach Archer',2,3,3,['Green'],['Reach']],['Indestructible Idol',2,2,3,['Colorless'],['Indestructible']],['Protected Cleric',2,2,2,['White'],['Protection from Red']],['Venom Rat',1,1,1,['Black'],['Deathtouch']],['Large Beast',3,5,4,['Green'],[]]
 ],
 pools:{Standard:'Modern-style test pool with evergreen mechanics.',Pauper:'Commons-focused test pool and lower-complexity cards.',Legacy:'Broad high-power pool with old and new mechanics.',Vintage:'Broadest experimental pool with the strongest combinations.'}
};
function makeUnit(row,id,side){return{id,side,name:row[0],power:row[1],maxHp:row[2],damage:0,hp:row[2],mv:row[3],colors:[...row[4]],keywords:[...row[5]],alive:true,exiled:false,tapped:false,mana:0,xp:0,level:1,spells:[],abilities:[]}}
