document.getElementById("mainScreen").hidden = false;
document.getElementById("charScreen").hidden = true;
document.getElementById("gameScreen").hidden = true;
document.getElementById("gameOverScreen").hidden = true;

currentPlayer = undefined;
//Game classes and constructors
//Items and objects
class Item {
     constructor(ItemName, weight, cost){
          this._ItemName = ItemName
          this._weight = weight 
          this._cost = cost  
     }
}

class Weapon extends Item{
     constructor(ItemName, weight, damage, damageType, cost){
          super(ItemName, weight, cost)
          this._damage = damage;
          this._damageType = damageType;
          this._type = "Weapon"
     }
}

class Armour extends Item{
     constructor(ItemName, weight, defense, cost,){
          super(ItemName, weight, cost)
          this._defense = defense;
          this._type = "Armour"
     }
}

class Potion extends Item{
     constructor(ItemName, weight, description, cost){
          super(ItemName, weight, cost)
          this._description = description
          this._type = "Potion"
     }
}

//Rooms
class Room {
     constructor(name, description){
          this._linkedRooms = []
          this._Img = ""
          this._name = name
          this._description = description
          
     }

     move(direction) {
          if (direction in this._linkedRooms) {
               return this._linkedRooms[direction];
          } 
          else {
               setImg("img/NotThatWay.png")
               return
          }
     }

     linkRoom(direction, roomToLink) {
          this._linkedRooms[direction] = roomToLink;
     }
}
class CaveEntrance extends Room{
     constructor(name, description){
          super(name, description)
          
     }
}
class DungeonRoom extends Room{
     constructor(name, description){
          super(name, description)
          this._itemsInRoom = [];
          this._enemiesInRoom = [];
          this._npcsInRoom = [];  
          this._combat = false;
     }

}
class shop extends Room{
     constructor(name, npc, type, wares, description){
          super(name, description)
          this.npc = npc;
          this.type = type;
          this.wares = wares;  
     }
}
class Town extends Room{
     constructor(name, description){
          super(name, description)
     }

     enterDungeon(){
          caveEntrance.createDungeon()
          currentRoom = caveEntrance
     }
}

//Enteties
class Entety{
     constructor(EntetyName, basehitPoints, stats, inventory, gold){
          this._EntetyName = EntetyName;
          this._basehitPoints = basehitPoints;
          this._stats = stats;
          this._inventory = inventory;
          this.level = 1;
          this._baseAC = 10;
          this._dead = false;
          this._armourClass = this.setArmourClass();
          this._gold = gold;
          
     }

     takeDamage(damageToTake){
          hitPoints -= damageToTake;
          if (hitPoints > 1){
               this.death()
          }
     }

     death(){
          this._dead = true;
     }
     
     setArmourClass(){
          if(this._armour == 0){
               return this._armourClass = (this._baseAC + this._stats.DexMod);
          }
          else{
               return this._armourClass = this._armour;
          }
     }
    
}

class NPC{
     constructor(inventory){
          this._inventory = inventory
          this._hitPoints = 4
          this._speach = []
     }
}

class Enemy extends Entety{
     constructor( Entetyname, hitPoints, damage){
          super(Entetyname, hitPoints)
          this._damage = damage
          this._armourClass = 4
          this._hitPoints = hitPoints
          this._exp = 20
     }

     attack(){
          let hit = (Math.random()*20)
          if(hit > currentPlayer._armourClass-1){
               if(this._EntetyName == "goblin"){setImg("img/GoblinDealdamage.png")}
               else if(this._EntetyName == "slime"){setImg("img/SlimeDealdamage.png")}
               currentPlayer.takeDamage(this._damage)
               setTimeout(() => {setImg(currentRoom._Img)}, 2000);
          }
     }

     death(){
          currentRoom._combat = false;
          this._dead = true;
          currentPlayer._level_exp += this._exp
          currentPlayer._gold += 5
          currentPlayer.levelUp();
          currentRoom._enemiesInRoom = [];
          changeRoomInfo()
          setUpScreen()
          if(this._EntetyName == "goblin"){setImg("img/GoblinDead.png")}
          else if(this._EntetyName == "slime"){setImg("img/SlimeDead.png")}
     }

     takeDamage(damageToTake){
          this._hitPoints -= damageToTake;
          if (this._hitPoints < 1){
               this.death()
          }
     }
}

class Player extends Entety{

     constructor(Entetyname, basehitPoints, stats, equipt, inventory, gold){
          super(Entetyname,basehitPoints, stats, inventory, gold)
          this._equipt = equipt
          this._level_exp = 0
          this.level = 1;
          this._deathSaves = 0;
          this._mana = 20 * this.level;
          this._maxWeight = (100+((this._stats.StrMod)*5))
          this._armourClass = this.setArmourClass()
          this._currentWeight = this.setWeight()
          this._maxHitPoints = (this._basehitPoints * this.level) + this._stats.ConsMod
          this._hitPoints = this._basehitPoints + this._stats.ConsMod
     }

     setmaxHitPoints(){
          this._maxHitPoints = (this._basehitPoints * this.level) + this._stats.ConsMod
     }
     buyItem(itemName){
          this.setWeight()
     }

     sellItem(itemName){
          this.setWeight()
     }

     death(){
          this._dead = true;
          gameOver()
     }
     takeDamage(damageToTake){
          
          this._hitPoints -= damageToTake
          if (this._hitPoints < 1)
          {
               this.death()
          }
          document.getElementById("HitPoints").innerText = "HitPoints: " + currentPlayer._hitPoints + "/" + currentPlayer._maxHitPoints;

          
     }
     
     rollToHit(enemy){
          let hitVal = Math.floor(Math.random()*20)
          if(this._equipt.WeaponEquipt._damageType == "magic")
               {if(this._mana - 3 <= 0){this._mana = 0}
               else{this._mana -= 3}
               }
          if(hitVal > enemy._armourClass-1)
          {
               if(enemy._EntetyName == "goblin"){setImg("img/GoblinHit.png")}
               else if(enemy._EntetyName == "slime"){setImg("img/SlimeHit.png")}
               let damageGiven = this._equipt.WeaponEquipt._damage
               if(this._equipt.WeaponEquipt._damageType == "magic")
               {
                    
                    if(this._mana > 0)
                    {
                         let damage_bonus = this._stats.InteMod
                         damageGiven += damage_bonus
                    }
               }
               else if(this._equipt.WeaponEquipt._damageType == "blunt"){
                    let damage_bonus = this._stats.StrMod
                    damageGiven += damage_bonus
               }
               else if(this._equipt.WeaponEquipt._damageType == "finness"){
                    let damage_bonus = this._stats.DexMod
                    damageGiven += damage_bonus
               }
               enemy.takeDamage(damageGiven)
          }
          
          else{
               setUpScreen()
               if(enemy._EntetyName == "goblin")
                    {return setImg("img/MissGoblin.png")}
               else if(enemy._EntetyName == "slime")
                    {return setImg("img/MissSlime.png")}
               }
          

     }

     equipItem(itemname){

          let pathA = this._inventory._Armours
          let pathW = this._inventory._Weapons

          for(let i = 0; i < pathA.length; i+=2){
               if(itemname == pathA[i]._ItemName && pathA[i+1].total > 0){
                    this.collectItem(this._equipt.ArmourEquipt)
                    this._equipt.ArmourEquipt = pathA[i]
                    pathA[i+1].total -=1
                    this._armour = this._equipt.ArmourEquipt._defense
                    this.setArmourClass()
                    return setUpScreen()
               }
          }
          for(let i = 0; i < pathW.length; i+=2){
               if(itemname == pathW[i]._ItemName && pathW[i+1].total > 0){
                    this.collectItem(this._equipt.WeaponEquipt)
                    this._equipt.WeaponEquipt = pathW[i]
                    pathW[i+1].total -=1
                    this.setArmourClass()
                    return setUpScreen()
               }
          }
          
     }

     levelUp(){
          if (this._level_exp >= 100*this.level)
          {
               this.level ++
               this.setmaxHitPoints()
               this._hitPoints = this._maxHitPoints
               if(this.level > 4){
                    return gameWin()
               }
               setUpScreen()
               setImg("img/LevelUp.png");
          }
     }

     takePotion(potion){
          if(potion == "healing"){
               for(let i =0; i < this._inventory._Potions.length; i+=2){
                    console.log(this._inventory._Potions[i+1].total )
                    if((this._inventory._Potions[i]._ItemName == "healing Pot") && this._inventory._Potions[i+1].total > 0){
                         if(this._hitPoints != this._maxHitPoints){     
                              this._hitPoints += Math.floor((Math.random()*8)+4) 
                              this._hitPoints += this._stats.WisMod
                              this._inventory._Potions[i+1].total -= 1
                              if(this._hitPoints > this._maxHitPoints){
                                  this._hitPoints = this._maxHitPoints
                              }
                              this.setWeight()
                              setUpScreen()
                              setImg("img/PotionDrank.png")
                              
                         }
                         
                    }
                    else if((this._inventory._Potions[i]._ItemName == "healing Pot +1") && this._inventory._Potions[i+1].total > 0){
                         if(this._hitPoints != this._maxHitPoints){     
                              this._hitPoints += Math.floor((Math.random()*12)+4) 
                              this._hitPoints += this._stats.WisMod
                              this._inventory._Potions[i+1].total -= 1
                              if(this._hitPoints > this._maxHitPoints){
                                  this._hitPoints = this._maxHitPoints
                              }
                              this.setWeight()
                              setUpScreen()
                              setImg("img/PotionDrank.png")
                              
                         }   
                    }
                    else if((this._inventory._Potions[i]._ItemName == "healing Pot +2") && this._inventory._Potions[i+1].total > 0){
                         if(this._hitPoints != this._maxHitPoints){     
                              this._hitPoints += Math.floor((Math.random()*14)+4) 
                              this._hitPoints += this._stats.WisMod
                              this._inventory._Potions[i+1].total -= 1
                              if(this._hitPoints > this._maxHitPoints){
                                  this._hitPoints = this._maxHitPoints
                              }
                              this.setWeight() 
                              setUpScreen()
                              setImg("img/PotionDrank.png")
                              ;
                         }else {;
                             setImg("img/FullHP.png")
                             }
                         
                    }
                    else {setImg("img/EmptyPotion.png")}
                    return 
               }
               
          }    
          
          else if(potion == "mana"){
               for(let i = 0; i < this._inventory._Potions.length; i+=2){
                    if((this._inventory._Potions[i]._ItemName == "manaPot") && this._inventory._Potions[i+1].total > 0){
                         this._mana += 3
                         this._inventory._Potions[i+1].total -= 1
                         this.setWeight()
                         setUpScreen()
                         return setImg("img/PotionDrank.png");
                    }
                    else if((this._inventory._Potions[i]._ItemName == "manaPot+1") && this._inventory._Potions[i+1].total > 0){
                         this._mana += 6
                         this._inventory._Potions[i+1].total -= 1
                         this.setWeight()
                         setUpScreen()
                         return setImg("img/PotionDrank.png");
                    }
                    else if((this._inventory._Potions[i]._ItemName == "manaPot+2") && this._inventory._Potions[i+1].total > 0){
                         this._mana += 9
                         this._inventory._Potions[i+1].total -= 1
                         this.setWeight()
                         setUpScreen()
                         return setImg("img/PotionDrank.png");
                    }
                    
               }
               setImg("img/EmptyPotion.png") 
               return 
               
          }
          this.setWeight()
          setUpScreen()
          
     }
     
     collectItem(item){
          
          let pathP = this._inventory._Potions
          let pathA = this._inventory._Armours
          let pathW = this._inventory._Weapons

               if(this._currentWeight + item._weight < this._maxWeight+1){
                    for(let i = 0; i < (pathP).length; i+=2){
                    if(pathP[i]._ItemName == item._ItemName){
                         pathP[i+1].total += 1;
                         this.setWeight()
                         changeRoomInfo()
                         setUpScreen()
                         return setImg("img/NewPotion.png")
                    }
               }
               for(let i = 0; i < (pathA).length; i+=2){
                    if(pathA[i]._ItemName == item._ItemName){
                         pathA[i+1].total += 1 
                         this.setWeight()
                         changeRoomInfo()
                         setUpScreen()
                         return setImg("img/NewArmour.png")
                    }
               }
               for(let i = 0; i < (pathW).length; i+=2){
                    if(pathW[i]._ItemName == item._ItemName){
                         pathW[i+1].total += 1
                         this.setWeight()
                         changeRoomInfo()
                         setUpScreen()
                         return setImg("img/NewWeapon.png")
                    }
               }
               if (item._type == "Potion"){
                    pathP.push(item)
                    pathP.push({total : 1})
                    this.setWeight()
                    changeRoomInfo()
                    setUpScreen()
                    return setImg("img/NewPotion.png")
               }
               if (item._type == "Armour"){
                    pathA.push(item)
                    pathA.push({total : 1})
                    this.setWeight()
                    changeRoomInfo()
                    setUpScreen()
                    return setImg("img/NewArmour.png")
               }
               if (item._type == "Weapon"){
                    pathW.push(item) 
                    pathW.push({total : 1})
                    this.setWeight()
                    changeRoomInfo()
                    setUpScreen()
                    return setImg("img/NewWeapon.png")
               } 
          }
          else(alert("Too much weight"))
          
     }

     setWeight(){
          let total = 0
          for(let i = 0; i < this._inventory._Potions.length; i+=2){
               console.log(this._inventory._Potions[i] + " " + this._inventory._Potions[i]._weight)
               console.log(total)
               total += (this._inventory._Potions[i]._weight * this._inventory._Potions[i+1].total)
          }
          for(let i = 0; i < this._inventory._Armours.length; i+=2){
               console.log(this._inventory._Armours[i] + " " + this._inventory._Armours[i]._weight)
               console.log(total)
               total += (this._inventory._Armours[i]._weight * this._inventory._Armours[i+1].total)
          }
          for(let i = 0; i < this._inventory._Weapons.length; i+=2){
               console.log(this._inventory._Weapons[i] + " " + this._inventory._Weapons[i]._weight)
               console.log(total)
               total += (this._inventory._Weapons[i]._weight * this._inventory._Weapons[i+1].total)
          }
          total += this._equipt.WeaponEquipt._weight
          total += this._equipt.ArmourEquipt._weight
          return this._currentWeight = total
     }
     
     dropItem(itemname){
          console.log(itemname)
          
          let item = {}
          for(let i = 0; i < this._inventory._Weapons.length; i+= 2){
               console.log(this._inventory._Weapons[i]._ItemName + " Name")
               console.log(this._inventory._Weapons[i+1].total + " value")
               if(this._inventory._Weapons[i]._ItemName == itemname && this._inventory._Weapons[i+1].total > 0){
                    this._inventory._Weapons[i+1].total -= 1
                    item = this._inventory._Weapons[i]
                    currentRoom._itemsInRoom.push(item)
                    this.setWeight()
                    return changeRoomInfo()
               }
          }
          for(let i = 0; i < this._inventory._Armours.length; i+= 2){
               console.log(this._inventory._Armours[i]._ItemName)
               console.log(this._inventory._Armours[i+1].total)
               if(this._inventory._Armours[i]._ItemName == itemname && this._inventory._Armours[i+1].total > 0){
                    this._inventory._Armours[i+1].total -= 1
                    item = this._inventory._Armours[i]
                    currentRoom._itemsInRoom.push(item)
                    this.setWeight()
                    setUpScreen()
                    return changeRoomInfo()
               }
          }
          for(let i = 0; i < this._inventory._Potions.length; i+= 2){
               console.log(this._inventory._Potions[i]._ItemName)
               console.log(this._inventory._Weapons[i+1].total)
               if(this._inventory._Potions[i]._ItemName == itemname && this._inventory._Potions[i+1].total > 0){
                    this._inventory._Potions[i+1].total -= 1
                    item = this._inventory._Potions[i]
                    currentRoom._itemsInRoom.push(item)
                    this.setWeight()
                    setUpScreen()
                    return changeRoomInfo()
               }
          }
     }
}

//create items
//weapons (name, weight, attack, type, cost) //basic
const BasicWand = new Weapon("BasicWand",5 ,4 ,"magic", 15);
const BasicClub = new Weapon("BasicClub",9 ,5 , "blunt", 15);
const BasicAxe = new Weapon("BasicAxe",4 ,5 , "finness", 15);
const BasicDagger = new Weapon("BasicDagger",3 ,4 , "finness", 15);
// BasicWand, BasicClub, BasicAxe, BasicDagger
//basic+1
const BasicWandPlus1 = new Weapon("BasicWand+1", 5, 5, "magic", 20);
const BasicClubPlus1 = new Weapon("BasicClub+1", 9, 6, "blunt", 20);
const BasicAxePlus1 = new Weapon("BasicAxe+1", 4, 6, "finness", 20);
const BasicDaggerPlus1 = new Weapon("BasicDagger+1", 3, 5, "finness", 20);
//normal
const NormalWand = new Weapon("NormalWand", 5, 8,"magic", 25);
const NormalClub = new Weapon("NormalClub", 9, 10, "blunt", 25);
const NormalAxe = new Weapon("NormalAxe", 4, 10, "finness", 25);
const NormalDagger = new Weapon("NormalDagger", 3, 8, "finness", 25);
//normal+1
const NormalWandPlus1 = new Weapon("NormalWand+1", 5, 9,"magic", 30);
const NormalClubPlus1 = new Weapon("NormalClub+1", 9, 11, "blunt", 30);
const NormalAxePlus1 = new Weapon("NormalAxe+1", 4, 11, "finness", 30);
const NormalDaggerPlus1 = new Weapon("NormalDagger+1", 3, 9, "finness", 30);
//advanced
const AdvancedWand = new Weapon("AdvancedWand", 5, 12,"magic", 35);
const AdvancedClub = new Weapon("AdvancedClub", 9, 15, "blunt", 35);
const AdvancedAxe = new Weapon("AdvancedAxe", 4, 15, "finness", 35);
const AdvancedDagger = new Weapon("AdvancedDagger", 3, 12, "finness", 35);
//advanced+1
const AdvancedWandPlus1 = new Weapon("AdvancedWand+1", 5, 12,"magic", 40);
const AdvancedClubPlus1 = new Weapon("AdvancedClub+1", 9, 15, "blunt", 40);
const AdvancedAxePlus1 = new Weapon("AdvancedAxe+1", 4, 15, "finness", 40);
const AdvancedDaggerPlus1 = new Weapon("AdvancedDagger+1", 3, 12, "finness", 40);

//Armour (name , weight , defense , cost)
const NoArmour = new Armour("NoArmour", 0, 0, 0);
//basic 
const BasicLeather = new Armour("BasicLeather", 12, 13, 20);
const BasicChain = new Armour("BasicChain", 15, 14, 22);
const BasicPlate = new Armour("BasicPlate", 20, 15, 24);
//normal
const NormalLeather = new Armour("BasicLeather", 14, 15, 25);
const NormalChain = new Armour("BasicChain", 17, 16, 27);
const NormalPlate = new Armour("BasicPlate", 22, 17, 29);
//advanced
const AdvancedLeather = new Armour("BasicLeather", 15, 17, 30);
const AdvancedChain = new Armour("BasicChain", 19, 18, 32);
const AdvancedPlate = new Armour("BasicPlate", 24, 19, 34);

//Potions (name weight desciption, cost)
const healingPot = new Potion("healingPot", 0.5, "Small bottle containing funky smelling red liquid.", 5)
const manaPot = new Potion("manaPot", 0.5, "Small bottle containing funky smelling blue liquid.", 5)
//Potions +1
const healingPotPlus1 = new Potion("healingPot+1", 0.75, "medium bottle containing funky smelling red liquid.", 7)
const manaPotPlus1 = new Potion("manaPot+1", 0.75, "medium bottle containing funky smelling blue liquid.", 7)
//Potions +2
const healingPotPlus2 = new Potion("healingPot+2", 1, "large bottle containing funky smelling red liquid.", 9)
const manaPotPlus2 = new Potion("manaPot+2", 1, "lerge bottle containing funky smelling blue liquid.", 9)


//create NPC
Alchemist = new NPC({_Potions : [{healingPot : 3}, {manaPot : 1}],
     _Armours : [NoArmour, NormalLeather],
     _Weapons : [NormalDagger]})

Blacksmith = new NPC({_Potions : [{healingPot : 3}, {manaPot : 1}],
     _Armours : [NoArmour, NormalPlate],
     _Weapons : [NormalClub]})

Adventurer = new NPC({_Potions : [{healingPot : 3}, {manaPot : 1}],
     _Armours : [NoArmour, NormalPlate],
     _Weapons : [NormalClub]})

//create enemies


//create rooms

//lists for rooms
potionList = [healingPot, healingPotPlus1, healingPotPlus2, manaPot, manaPotPlus1, manaPotPlus2]
//basic
basicWeaponList = [BasicWand, BasicClub, BasicAxe, BasicDagger, BasicWandPlus1, BasicClubPlus1, BasicAxePlus1, BasicDaggerPlus1]
basicArmourList = [BasicLeather, BasicChain, BasicPlate]
//normal
normalWeaponList = [NormalWand, NormalClub, NormalAxe, NormalDagger, NormalWandPlus1, NormalClubPlus1, NormalAxePlus1, NormalDaggerPlus1]
normalArmourList = [NormalLeather, NormalChain, NormalPlate]
//advanced
advancedWeaponList = [AdvancedWand, AdvancedClub, AdvancedAxe, AdvancedDagger, AdvancedWandPlus1, AdvancedClubPlus1, AdvancedAxePlus1, AdvancedDaggerPlus1]
advancedArmourList = [AdvancedLeather, AdvancedChain, AdvancedPlate]

//town
const Tore = new Town("Tore" ,"Large Medieval style shops line the cobbled streets and men, women and children going about their business")
Tore._Img = "img/TownCenter.png"
//shops
const potionShop = new shop("potionShop", Alchemist, "potions", potionList, "black wooden shelves line the walls each teaming with clear glass bottles filled with red and blue liquid.")
potionShop._Img = ""
const weaponShop = new shop("weaponShop", Blacksmith, "weapons", basicWeaponList, "Metals hooks and racks fill the small space axes, daggers, swords and clubs fill every corner.")
weaponShop._Img = ""
const armourShop = new shop("armourShop", Adventurer, "armour", basicArmourList, "Metals hooks and racks fill the small space leather, chain and plate aroumr cover every surface.")
armourShop._Img = ""
//dungeon
const caveEntrance = new CaveEntrance("CaveEntrance", "A vast chasm of rock opens up before you. Vines and moss line each wall, inviting only the bravest to enter.")
caveEntrance._Img = "img/CaveEntrance.png"
const caveExit = new DungeonRoom("CaveExit", "The light from the entrance still floods the cavern.")
caveExit._Img ="img/CaveExit.png"
//dungeon rooms are created in create dungeon called on entry to dungeon
//link rooms
potionShop.linkRoom("west", Tore)
weaponShop.linkRoom("south", Tore)
armourShop.linkRoom("east", Tore)

Tore.linkRoom("east", potionShop)
Tore.linkRoom("north", weaponShop)
Tore.linkRoom("west", armourShop)
Tore.linkRoom("south", caveEntrance)

caveEntrance.linkRoom("north", Tore)


//functions for running and setting up game
function setWiz(){
     currentPlayer = new Player( "Wizard", 8,
          {StrMod : -4, 
          DexMod : -3, 
          ConsMod : 2, 
          InteMod : 4, 
          WisMod : 3, 
          CharMod : -2},
          //equipt
          {WeaponEquipt : BasicWand,
          ArmourEquipt : BasicLeather},
     
          //inventory
          {_Potions : [healingPot, {total : 3}, manaPot, {total : 3}],
          _Armours : [NoArmour,{total : 1}, BasicLeather, {total : 0}],
          _Weapons : [BasicWand, {total : 1}]},
          //gold
          15)
     currentPlayer._armour = currentPlayer._equipt.ArmourEquipt._defense
     currentPlayer.setArmourClass()
     currentPlayer.setWeight()
     
     showGame()
     gameStart()
}

function setBar(){
     currentPlayer = new Player( "Barbarian", 12,
          {StrMod : 4, 
          DexMod : -4, 
          ConsMod : 3, 
          InteMod : -3, 
          WisMod : -2, 
          CharMod : 2},
          //equipt
          {WeaponEquipt : BasicClub,
          ArmourEquipt : BasicPlate},
     
          //inventory
          {_Potions : [healingPot, { total : 6}, manaPot, {total : 0}],
          _Armours : [NoArmour, {total : 1}, BasicPlate, {total : 0}],
          _Weapons : [BasicClub, {total : 1}]},
          //gold
          15)
     currentPlayer._armour = currentPlayer._equipt.ArmourEquipt._defense
     currentPlayer.setArmourClass()
     currentPlayer.setWeight()

     showGame()
     gameStart()
}

function setCle(){
     currentPlayer = new Player( "Cleric", 10,
          {StrMod : -2, 
          DexMod : 2, 
          ConsMod : 3, 
          InteMod : -3, 
          WisMod : 4, 
          CharMod : -4},
          //equipt
          {WeaponEquipt : BasicAxe,
          ArmourEquipt : BasicChain},
     
          //inventory
          {_Potions : [healingPot, {total : 6}, manaPot, {total : 0}],
          _Armours : [NoArmour, {total : 1}, BasicChain, {total : 0}],
          _Weapons : [BasicAxe, {total : 1}]},
          //gold
          15)
     currentPlayer._armour = currentPlayer._equipt.ArmourEquipt._defense
     currentPlayer.setArmourClass()
     currentPlayer.setWeight()
     
     showGame()
     gameStart()
}

function setRog(){
     currentPlayer = new Player( "Rogue", 12,
          {StrMod : 2, 
          DexMod : 4, 
          ConsMod : -2, 
          InteMod : -3, 
          WisMod : 3, 
          CharMod : -4},
          //equipt
          {WeaponEquipt : BasicDagger,
          ArmourEquipt : NoArmour},
     
          //inventory
          {_Potions : [healingPot, {total : 6}, manaPot, {total : 0}],
          _Armours : [NoArmour, {total : 0}, BasicLeather, {total : 1}],
          _Weapons : [BasicDagger, {total : 1}]},
          //gold
          15)
     currentPlayer._armour = currentPlayer._equipt.ArmourEquipt._defense
     currentPlayer.setArmourClass()
     currentPlayer.setWeight()

     showGame()
     gameStart()
}

function pickCharShow(){
     document.getElementById("mainScreen").hidden = true
     document.getElementById("charScreen").hidden = false
     document.getElementById("gameScreen").hidden = true
     document.getElementById("gameOverScreen").hidden = true
}

function showGame(){
     document.getElementById("mainScreen").hidden = true
     document.getElementById("charScreen").hidden = true
     document.getElementById("gameScreen").hidden = false
     document.getElementById("gameOverScreen").hidden = true
}

function gameStart(){
     currentRoom = Tore
     currentPlayer._dead = false;
     document.getElementById("TextOutput").innerText = "You are a " + currentPlayer._EntetyName + ". Your home town of " + currentRoom._name + " is a small town. Monsters have taken over the nearby mines cutting off the path for outsiders and merchants. your goal is to kill all the monsters within the mines (Reach level 5). This will alow your town to grow possibly even allowing you to become the mayor of town. " + "\n" + currentRoom._name + "\n"+ currentRoom._description + "\nDirection: " + showdirectionsArea()
     setUpScreen()

     if (currentPlayer._hitPoints > 0){
          document.addEventListener("keydown", function (event) {
               if (event.key === "Enter") {
                    command = document.getElementById("CommandsInput").value;
                    const directions = ["north", "south", "east", "west"]
                    const exit = ["exit"]
                    const enter = ["enter"]
                    const attackEnemny = ["attack"]
                    const heal = ["heal"]
                    const mana = ["mana"]
                    const collect = ["collect"]
                    const drop = ["drop"]
                    const equip = ["equip"]
                    const buy = ["buy"]
                    const sell = ["sell"]


                    if(directions.includes(command.toLowerCase())){
                         currentRoom = currentRoom.move(command)
                         document.getElementById("CommandsInput").value = ""
                         changeRoomInfo()
                         console.log(currentRoom);
                         setTimeout(() => {setImg(currentRoom._Img)}, 2000);
                    }

                    else if(enter.includes(command.toLowerCase())){

                         if(currentRoom._name == "CaveEntrance")
                         {
                              buildDungeon()
                              currentRoom = caveExit
                              document.getElementById("CommandsInput").value = ""
                              changeRoomInfo()
                              
                         }
                         else {alert("Go to the dungeon entrance to enter")}
                         setTimeout(() => {setImg(currentRoom._Img)}, 2000);
                    }

                    else if(exit.includes(command.toLowerCase())){
                         if(currentRoom._name == "CaveExit")
                         {
                              currentRoom = caveEntrance
                              document.getElementById("CommandsInput").value = ""
                              changeRoomInfo()
                         }
                         else {alert("Go to the dungeon exit to exit")}
                         setTimeout(() => {setImg(currentRoom._Img)}, 2000);
                    }
                    
                    else if(attackEnemny.includes(command.toLowerCase())){
                         document.getElementById("CommandsInput").value = ""
                         if(currentRoom._enemiesInRoom.length > 0){
                              for(i in currentRoom._enemiesInRoom){
                                   currentPlayer.rollToHit(currentRoom._enemiesInRoom[i])
                              }
                         }
                         else {setImg("img/NoEnemy.png")}
                         return setTimeout(() => {setImg(currentRoom._Img)}, 2000);
                         
                    }
                    else if(heal.includes(command.toLowerCase())){
                         currentPlayer.takePotion("healing")
                         document.getElementById("CommandsInput").value = ""
                         setTimeout(() => {setImg(currentRoom._Img)}, 2000);
                         return 
                    }
                    else if(mana.includes(command.toLowerCase())){
                         currentPlayer.takePotion("mana")
                         document.getElementById("CommandsInput").value = ""
                         setTimeout(() => {setImg(currentRoom._Img)}, 2000);
                         return 
                    }

                    else if(collect.includes(command.toLowerCase())){
                         for(let i = 0; i < currentRoom._itemsInRoom.length; i+=1){
                              currentPlayer.collectItem(currentRoom._itemsInRoom[i])
                         }
                         currentRoom._itemsInRoom = []
                         changeRoomInfo()
                         document.getElementById("CommandsInput").value = ""
                         setTimeout(() => {setImg(currentRoom._Img)}, 2000);
                         return 
                    }
                    else if((command.toLowerCase()).includes(drop)){
                         words = command.split(' ')
                         currentPlayer.dropItem(words[1])
                         changeRoomInfo()
                         document.getElementById("CommandsInput").value = ""
                    }
                    else if((command.toLowerCase()).includes(buy)){
                         words = command.split(' ')
                         currentPlayer.buyItem(words[1])
                         changeRoomInfo()
                         document.getElementById("CommandsInput").value = ""
                    }
                    else if((command.toLowerCase()).includes(sell)){
                         words = command.split(' ')
                         currentPlayer.sellItem(words[1])
                         changeRoomInfo()
                         document.getElementById("CommandsInput").value = ""
                    }
                    else if((command.toLowerCase()).includes(equip)){
                         words = command.split(' ')
                         currentPlayer.equipItem(words[1])
                         changeRoomInfo()
                         document.getElementById("CommandsInput").value = ""
                    }


                    
                    else{alert("that is not a valid command please try again")}

                    if (currentRoom._combat == true){
                         for(i in currentRoom._enemiesInRoom){
                              currentRoom._enemiesInRoom[i].attack()
                         }
                         setTimeout(() => {setImg(currentRoom._Img)}, 2000);
                         return  
                    }

               }  
          })
     }
}

function buildDungeon(){
     //randomise the creation of the dungeon
     //create rooms
     DungeonRoomOne = new DungeonRoom("Room 1", "the large cavern opens up infront of you, A dull light makes it just visable to see")
     populateEnemies(DungeonRoomOne)
     populateItems(DungeonRoomOne)

     DungeonRoomTwo = new DungeonRoom("Room 2", "Description")
     populateEnemies(DungeonRoomTwo)
     populateItems(DungeonRoomTwo)

     DungeonRoomThree = new DungeonRoom("Room 3", "Description")
     populateEnemies(DungeonRoomThree)
     populateItems(DungeonRoomThree)

     DungeonRoomFour = new DungeonRoom("Room 4", "Description")
     populateEnemies(DungeonRoomFour)
     populateItems(DungeonRoomFour)

     DungeonRoomFive = new DungeonRoom("Room 5", "Description")
     populateEnemies(DungeonRoomFive)
     populateItems(DungeonRoomFive)

     DungeonRoomSix = new DungeonRoom("Room 6", "Description")
     populateEnemies(DungeonRoomSix)
     populateItems(DungeonRoomSix)

     DungeonRoomSeven = new DungeonRoom("Room 7", "Description")
     populateEnemies(DungeonRoomSeven)
     populateItems(DungeonRoomSeven)

     DungeonRoomEight = new DungeonRoom("Room 8", "Description")
     populateEnemies(DungeonRoomEight)
     populateItems(DungeonRoomEight)

     SecretRoom = new DungeonRoom("Secret room", "description")
     populateEnemies(SecretRoom)
     populateItems(SecretRoom)

     //cave layout
     let layout = Math.floor(Math.random()*6)
     console.log("Layout: " + layout)
     switch(layout){
          case 0:
               //link rooms
               caveExit._linkedRooms = []
               caveExit.linkRoom("north", DungeonRoomOne)
               //room one
               DungeonRoomOne.linkRoom("south", caveExit)
               DungeonRoomOne.linkRoom("north", DungeonRoomTwo)
               DungeonRoomOne.linkRoom("west", DungeonRoomThree)
               DungeonRoomOne.linkRoom("east", DungeonRoomFour)
               //room two
               DungeonRoomTwo.linkRoom("south", DungeonRoomOne)
               DungeonRoomTwo.linkRoom("east", DungeonRoomFive)
               DungeonRoomTwo.linkRoom("west", SecretRoom)
               //room three
               DungeonRoomThree.linkRoom("east", DungeonRoomOne)
               //room four
               DungeonRoomFour.linkRoom("west", DungeonRoomOne)
               DungeonRoomFour.linkRoom("north", DungeonRoomFive)
               //room five
               DungeonRoomFive.linkRoom("west", DungeonRoomTwo)
               DungeonRoomFive.linkRoom("south", DungeonRoomFour)
               DungeonRoomFive.linkRoom("east", DungeonRoomSix)
               //room six
               DungeonRoomSix.linkRoom("west", DungeonRoomFive)
               DungeonRoomSix.linkRoom("east", DungeonRoomEight)
               DungeonRoomSix.linkRoom("north", DungeonRoomSeven)
               //room seven
               DungeonRoomSeven.linkRoom("south", DungeonRoomSix)
               //room eight
               DungeonRoomEight.linkRoom("west", DungeonRoomSix)
               //secret room
               SecretRoom.linkRoom("east", DungeonRoomTwo)
               break;

          case 1:
               //link rooms
               caveExit._linkedRooms = []
               caveExit.linkRoom("north", DungeonRoomOne)
               //room one
               DungeonRoomOne.linkRoom("south", caveExit)
               DungeonRoomOne.linkRoom("west", DungeonRoomTwo)
               DungeonRoomOne.linkRoom("east", SecretRoom)
               //room two
               DungeonRoomTwo.linkRoom("east", DungeonRoomOne)
               DungeonRoomTwo.linkRoom("north", DungeonRoomThree)
               //room three
               DungeonRoomThree.linkRoom("north", DungeonRoomFour)
               DungeonRoomThree.linkRoom("south", DungeonRoomTwo)
               //room four
               DungeonRoomFour.linkRoom("east", DungeonRoomFive)
               DungeonRoomFour.linkRoom("south", DungeonRoomThree)
               //room five
               DungeonRoomFive.linkRoom("west", DungeonRoomFour)
               DungeonRoomFive.linkRoom("east", DungeonRoomSix)
               //room six
               DungeonRoomSix.linkRoom("west", DungeonRoomFive)
               DungeonRoomSix.linkRoom("south", DungeonRoomSeven)
               //room seven
               DungeonRoomSeven.linkRoom("north", DungeonRoomSix)
               DungeonRoomSeven.linkRoom("east", DungeonRoomEight)
               DungeonRoomSeven.linkRoom("south", SecretRoom)
               //room eight
               DungeonRoomEight.linkRoom("west", DungeonRoomSeven)
               //secrate room
               SecretRoom.linkRoom("north", DungeonRoomSeven)
               SecretRoom.linkRoom("east", caveExit)
               break;

          case 2:

               //link rooms
               caveExit._linkedRooms = []
               caveExit.linkRoom("north", DungeonRoomOne)
               //room one
               DungeonRoomOne.linkRoom("south", caveExit)
               DungeonRoomOne.linkRoom("north", DungeonRoomTwo)
               DungeonRoomOne.linkRoom("west", DungeonRoomThree)
               DungeonRoomOne.linkRoom("east", DungeonRoomFour)
               //room two
               DungeonRoomTwo.linkRoom("south", DungeonRoomOne)
               DungeonRoomTwo.linkRoom("east", DungeonRoomFive)
               //room three
               DungeonRoomThree.linkRoom("east", DungeonRoomOne)
               //room four
               DungeonRoomFour.linkRoom("west", DungeonRoomOne)
               DungeonRoomFour.linkRoom("north", DungeonRoomFive)
               //room five
               DungeonRoomFive.linkRoom("west", DungeonRoomTwo)
               DungeonRoomFive.linkRoom("south", DungeonRoomFour)
               DungeonRoomFive.linkRoom("east", DungeonRoomSix)
               //room six
               DungeonRoomSix.linkRoom("west", DungeonRoomFive)
               DungeonRoomSix.linkRoom("east", DungeonRoomEight)
               DungeonRoomSix.linkRoom("north", DungeonRoomSeven)
               //room seven
               DungeonRoomSeven.linkRoom("south", DungeonRoomSix)
               //room eight
               DungeonRoomEight.linkRoom("west", DungeonRoomSix)
               DungeonRoomEight.linkRoom("east", SecretRoom)
               //secrate room
               SecretRoom.linkRoom("west", DungeonRoomEight)
               SecretRoom.linkRoom("east", caveExit)
               break;

          case 3:
               //link rooms
               caveExit._linkedRooms = []
               caveExit.linkRoom("north", DungeonRoomThree)
               caveExit.linkRoom("east", DungeonRoomOne)
               caveExit.linkRoom("south", DungeonRoomSeven)
               caveExit.linkRoom("west", DungeonRoomFive)
               //room one
               DungeonRoomOne.linkRoom("south", DungeonRoomEight)
               DungeonRoomOne.linkRoom("north", DungeonRoomTwo)
               DungeonRoomOne.linkRoom("west", caveExit)

               //room two
               DungeonRoomTwo.linkRoom("south", DungeonRoomOne)
               DungeonRoomTwo.linkRoom("west", DungeonRoomThree)
               //room three
               DungeonRoomThree.linkRoom("south", caveExit)
               DungeonRoomThree.linkRoom("west", DungeonRoomFour)
               DungeonRoomThree.linkRoom("east", DungeonRoomTwo)
               //room four
               DungeonRoomFour.linkRoom("east", DungeonRoomThree)
               DungeonRoomFour.linkRoom("south", DungeonRoomFive)
               //room five
               DungeonRoomFive.linkRoom("north", DungeonRoomFour)
               DungeonRoomFive.linkRoom("south", DungeonRoomSix)
               DungeonRoomFive.linkRoom("east", caveExit)
               //room six
               DungeonRoomSix.linkRoom("east", DungeonRoomSeven)
               DungeonRoomSix.linkRoom("north", DungeonRoomFive)
               //room seven
               DungeonRoomSeven.linkRoom("west", DungeonRoomSix)
               DungeonRoomSeven.linkRoom("north", DungeonRoomEight)
               DungeonRoomSeven.linkRoom("east", DungeonRoomEight)
               //room eight
               DungeonRoomEight.linkRoom("west", DungeonRoomSeven)
               DungeonRoomEight.linkRoom("north", DungeonRoomOne)
               break;

          case 4:
               //link rooms
               caveExit._linkedRooms = []
               caveExit.linkRoom("south", DungeonRoomOne)
               //room one
               DungeonRoomOne.linkRoom("north", caveExit)
               DungeonRoomOne.linkRoom("east", DungeonRoomTwo)
               //room two
               DungeonRoomTwo.linkRoom("south", DungeonRoomEight)
               DungeonRoomTwo.linkRoom("east", DungeonRoomFive)
               DungeonRoomTwo.linkRoom("north", DungeonRoomThree)
               DungeonRoomTwo.linkRoom("west", DungeonRoomOne)
               //room three
               DungeonRoomThree.linkRoom("east", DungeonRoomFour)
               DungeonRoomThree.linkRoom("south", DungeonRoomTwo)
               //room four
               DungeonRoomFour.linkRoom("west", DungeonRoomThree)
               DungeonRoomFour.linkRoom("east", DungeonRoomSix)
               DungeonRoomFour.linkRoom("south", DungeonRoomFive)
               //room five
               DungeonRoomFive.linkRoom("west", DungeonRoomTwo)
               DungeonRoomFive.linkRoom("north", DungeonRoomFour)
               DungeonRoomFive.linkRoom("east", DungeonRoomSeven)
               //room six
               DungeonRoomSix.linkRoom("west", DungeonRoomFour)
               DungeonRoomSix.linkRoom("south", DungeonRoomSeven)
               //room seven
               DungeonRoomSeven.linkRoom("north", DungeonRoomSix)
               DungeonRoomSeven.linkRoom("west", DungeonRoomFive)
               DungeonRoomSeven.linkRoom("east", SecretRoom)
               //room eight
               DungeonRoomEight.linkRoom("north", DungeonRoomTwo)
               //secrate room
               SecretRoom.linkRoom("west", DungeonRoomSeven)
               SecretRoom.linkRoom("east", caveExit)

               break;

          case 5:
               //link rooms
               caveExit._linkedRooms = []
               caveExit.linkRoom("south", DungeonRoomOne)
               //room one
               DungeonRoomOne.linkRoom("north", caveExit)
               DungeonRoomOne.linkRoom("south", DungeonRoomTwo)
               //room two
               DungeonRoomTwo.linkRoom("north", DungeonRoomOne)
               DungeonRoomTwo.linkRoom("south", DungeonRoomThree)
               //room three
               DungeonRoomThree.linkRoom("north", DungeonRoomTwo)
               DungeonRoomThree.linkRoom("south", DungeonRoomFour)
               //room four
               DungeonRoomFour.linkRoom("north", DungeonRoomThree)
               DungeonRoomFour.linkRoom("east", DungeonRoomFive)
               //room five
               DungeonRoomFive.linkRoom("west", DungeonRoomFour)
               DungeonRoomFive.linkRoom("east", DungeonRoomSix)
               //room six
               DungeonRoomSix.linkRoom("west", DungeonRoomFive)
               DungeonRoomSix.linkRoom("south", DungeonRoomSeven)
               //room seven
               DungeonRoomSeven.linkRoom("north", DungeonRoomSix)
               DungeonRoomSeven.linkRoom("south", DungeonRoomEight)
               //room eight
               DungeonRoomEight.linkRoom("north", DungeonRoomSeven)
               DungeonRoomEight.linkRoom("south", SecretRoom)
               //secret room
               SecretRoom.linkRoom("south", caveExit)
               SecretRoom.linkRoom("north", DungeonRoomEight)
               break;
               
          case 6:
               //link rooms
               caveExit._linkedRooms = []
               caveExit.linkRoom("south", DungeonRoomOne)
               //room one
               DungeonRoomOne.linkRoom("north", caveExit)
               DungeonRoomOne.linkRoom("west", DungeonRoomTwo)
               //room two
               DungeonRoomTwo.linkRoom("south", DungeonRoomThree)
               DungeonRoomTwo.linkRoom("east", DungeonRoomOne)
               //room three
               DungeonRoomThree.linkRoom("north", DungeonRoomTwo)
               DungeonRoomThree.linkRoom("south", DungeonRoomFour)
               //room four
               DungeonRoomFour.linkRoom("east", DungeonRoomFive)
               DungeonRoomFour.linkRoom("north", DungeonRoomThree)
               //room five
               DungeonRoomFive.linkRoom("west", DungeonRoomFour)
               DungeonRoomFive.linkRoom("north", DungeonRoomSix)
               //room six
               DungeonRoomSix.linkRoom("south", DungeonRoomFive)
               DungeonRoomSix.linkRoom("east", DungeonRoomSeven)
               //room seven
               DungeonRoomSeven.linkRoom("west", DungeonRoomSix)
               DungeonRoomSeven.linkRoom("south", DungeonRoomEight)
               //room eight
               DungeonRoomEight.linkRoom("north", DungeonRoomSeven)
               DungeonRoomEight.linkRoom("south", SecretRoom)

               SecretRoom.linkRoom("north", DungeonRoomEight)
               SecretRoom/linkroom("south", caveExit)
               break;
          }

     //spawn Enemies
     function populateEnemies(room){
          enemies = Math.floor(Math.random()*3)
          if(currentPlayer.level < 3)
          {
               if(enemies == 0){
                    room._enemiesInRoom.push(Goblin = new Enemy("goblin",(12*currentPlayer.level), 3))
                    room._combat = true
               }
               else if(enemies == 1 || enemies == 2){
                    room._enemiesInRoom.push(slime = new Enemy("slime",(6*currentPlayer.level), 1))
                    room._combat = true
               }
               else{
                    room._enemiesInRoom = []
                    room._combat = false
               }
          }

          else if(currentPlayer.level > 2 || currentPlayer.level < 5)
          {
               if(enemies == 0 || enemies == 1){
                    room._enemiesInRoom.push(Goblin = new Enemy("goblin",(6*currentPlayer.level), 3))
                    room._combat = true
               }
               else if(enemies == 2){
                    room._enemiesInRoom.push(slime = new Enemy("slime",(3*currentPlayer.level), 1))
                    room._combat = true
               }
               else{
                    room._enemiesInRoom = []
                    room._combat = false
               }
          }
     }

     //spawn items
     function populateItems(room){
          ItemsTF = Math.floor(Math.random()*3)
          
          if(ItemsTF == 1){
               //choose item
               x = Math.floor(Math.random()*2)
               //potion
               if(x == 0){
                    
                    givenItem = Math.floor(Math.random()*11)
                    if(givenItem == 0 || givenItem == 1 || givenItem == 2){
                         givenItem = healingPot
                    }
                    else if(givenItem == 3 || givenItem == 4 || givenItem == 5){
                         givenItem = manaPot
                    }
                    else if(givenItem == 6 || givenItem == 7){
                         givenItem = healingPotPlus1
                    }
                    else if(givenItem == 8 || givenItem == 9){
                         givenItem = manaPotPlus1
                    }
                    else if(givenItem == 10){
                         givenItem = healingPotPlus2
                    }
                    else if(givenItem == 11){
                         givenItem = manaPotPlus2
                    }
                    
               }
               //weapon
               if(x == 1){
                    givenItem = Math.floor(Math.random()*11)
                    //basic
                    if(givenItem == 0 || givenItem == 1 || givenItem == 2 || givenItem == 3){
                         choice = Math.floor(Math.random()*3)
                         switch (choice){
                              case 0:
                                   givenItem = BasicAxe
                                   break;
                              case 1:
                                   givenItem = BasicClub
                                   break;
                              case 2:
                                   givenItem = BasicDagger
                                   break;
                              case 3:
                                   givenItem = BasicWand
                                   break;
                         }
                    }
                    if(givenItem == 4 || givenItem == 5 || givenItem == 6){
                         choice = Math.floor(Math.random()*3)
                         switch (choice){
                              case 0:
                                   givenItem = BasicAxePlus1
                                   break;
                              case 1:
                                   givenItem = BasicClubPlus1
                                   break;
                              case 2:
                                   givenItem = BasicDaggerPlus1
                                   break;
                              case 3:
                                   givenItem = BasicWandPlus1
                                   break;
                         }
                    }
                    //normal
                    if(givenItem == 7 || givenItem == 8){
                         choice = Math.floor(Math.random()*3)
                         switch (choice){
                              case 0:
                                   givenItem = NormalAxe
                                   break;
                              case 1:
                                   givenItem = NormalClub
                                   break;
                              case 2:
                                   givenItem = NormalDagger
                                   break;
                              case 3:
                                   givenItem = NormalWand
                                   break;
                         }
                    }
                    if(givenItem == 9){
                         choice = Math.floor(Math.random()*3)
                         switch (choice){
                              case 0:
                                   givenItem = NormalAxePlus1
                                   break;
                              case 1:
                                   givenItem = NormalClubPlus1
                                   break;
                              case 2:
                                   givenItem = NormalDaggerPlus1
                                   break;
                              case 3:
                                   givenItem = NormalWandPlus1
                                   break;
                         }
                    }
                    //advanced
                    if(givenItem == 10){
                         choice = Math.floor(Math.random()*3)
                         switch (choice){
                              case 0:
                                   givenItem = AdvancedAxe
                                   break;
                              case 1:
                                   givenItem = AdvancedClub
                                   break;
                              case 2:
                                   givenItem = AdvancedDagger
                                   break;
                              case 3:
                                   givenItem = AdvancedWand
                                   break;
                         }
                    }
                    if(givenItem == 11){
                         choice = Math.floor(Math.random()*3)
                         switch (choice){
                              case 0:
                                   givenItem = AdvancedAxePlus1
                                   break;
                              case 1:
                                   givenItem = AdvancedClubPlus1
                                   break;
                              case 2:
                                   givenItem = AdvancedDaggerPlus1
                                   break;
                              case 3:
                                   givenItem = AdvancedWandPlus1
                                   break;
                         }
                    }
                    
               }
               //armour
               if(x == 2){
                    givenItem = Math.floor(Math.random()*11)
                    //basic
                    if(givenItem == 0 || givenItem == 1 || givenItem == 2 || givenItem == 3){
                         choice = Math.floor(Math.random()*2)
                         switch (choice){
                              case 0:
                                   givenItem = BasicPlate
                                   break;
                              case 1:
                                   givenItem = BasicChain
                                   break;
                              case 2:
                                   givenItem = BasicLeather
                                   break;

                         }
                    }
                    //normal
                    if(givenItem == 7 || givenItem == 8){
                         choice = Math.floor(Math.random()*2)
                         switch (choice){
                              case 0:
                                   givenItem = NormalPlate
                                   break;
                              case 1:
                                   givenItem = NormalChain
                                   break;
                              case 2:
                                   givenItem = NormalLeather
                                   break;;
                         }
                    }
                    //advanced
                    if(givenItem == 10){
                         choice = Math.floor(Math.random()*2)
                         switch (choice){
                              case 0:
                                   givenItem = AdvancedPlate
                                   break;
                              case 1:
                                   givenItem = AdvancedChain
                                   break;
                              case 2:
                                   givenItem = AdvancedLeather
                                   break;
                         }
                    }     
               }
               room._itemsInRoom.push(givenItem)
          }
     }
}

function setUpScreen(){
     document.getElementById("Equipt").innerText = "Current Armour: " + currentPlayer._equipt.ArmourEquipt._ItemName + "\n" + "Current Weapon: " + currentPlayer._equipt.WeaponEquipt._ItemName 
     document.getElementById("Potions").innerText = "Owned Potions: \n" + setItems(currentPlayer._inventory._Potions);
     document.getElementById("Armour").innerText = "Owned Armours: \n" + setItems(currentPlayer._inventory._Armours);
     document.getElementById("Weapons").innerText = "Owned Weapons: \n" + setItems(currentPlayer._inventory._Weapons);
     document.getElementById("AC").innerText = "Armour Class: " + currentPlayer._armourClass
     document.getElementById("BaseDamage").innerText = "Damage: " + BaseDamge()

     document.getElementById("ImgOfRoom").src = currentRoom._Img
     document.getElementById("Name").innerText = currentPlayer._EntetyName;
     document.getElementById("Level").innerText = "Level: " + currentPlayer.level;
     document.getElementById("HitPoints").innerText = "HitPoints: " + currentPlayer._hitPoints + "/" + currentPlayer._maxHitPoints;
     document.getElementById("Weight").innerText = "Weight: " + currentPlayer._currentWeight + "/" + currentPlayer._maxWeight;
     document.getElementById("Mana").innerText = "Mana: " + currentPlayer._mana;
     document.getElementById("Gold").innerText = "Gold: " + currentPlayer._gold;
     document.getElementById("StrMod").innerText = "Strength: " + currentPlayer._stats.StrMod;
     document.getElementById("DexMod").innerText = "Dexterity: " + currentPlayer._stats.DexMod;
     document.getElementById("ConsMod").innerText = "Consitution: " + currentPlayer._stats.ConsMod;
     document.getElementById("InteMod").innerText = "Inteligance: " + currentPlayer._stats.InteMod;
     document.getElementById("WisMod").innerText = "Wisdom: " + currentPlayer._stats.WisMod;
     document.getElementById("CharMod").innerText = "Charisma: " + currentPlayer._stats.CharMod;
}

function BaseDamge(){
     let damageGiven = currentPlayer._equipt.WeaponEquipt._damage
     if(currentPlayer._equipt.WeaponEquipt._damageType == "magic")
     {
          if(currentPlayer._mana > 0)
          {
               let damage_bonus = currentPlayer._stats.InteMod
               damageGiven += damage_bonus
          }
     }
     else if(currentPlayer._equipt.WeaponEquipt._damageType == "blunt"){
          let damage_bonus = currentPlayer._stats.StrMod
          damageGiven += damage_bonus
     }
     else if(currentPlayer._equipt.WeaponEquipt._damageType == "finness"){
          let damage_bonus = currentPlayer._stats.DexMod
          damageGiven += damage_bonus
     }
     return(damageGiven)
}
function setItems(path){
     let List = []
     for(let i = 0; i < (path).length; i += 2){
          List.push(path[i]._ItemName + ": " + path[i+1].total)
     }

     return (List.join(", "))
}

function setImg(imagepath){
     document.getElementById("ImgOfRoom").src = imagepath
}
function changeRoomInfo(){
     if(currentRoom._name == "Room 1" || currentRoom._name == "Room 2" || currentRoom._name == "Room 3" || currentRoom._name == "Room 4" || currentRoom._name == "Room 5" || currentRoom._name == "Room 6" || currentRoom._name == "Room 7" || currentRoom._name == "Room 8" || currentRoom._name == "Secret room"){
          document.getElementById("TextOutput").innerText = currentRoom._name + "\n" + currentRoom._description + "\nEnemy: " + showEnemy()+ "\nItem: " + showItems() + "\nopenings:\n" + showdirections()
          document.getElementById("ImgOfRoom").src = currentRoom._Img    
     }
     else if(currentRoom._name == "CaveExit"){
          document.getElementById("TextOutput").innerText = currentRoom._name + "\n" + currentRoom._description + "\nopenings: " + showdirections()
          document.getElementById("ImgOfRoom").src = currentRoom._Img
     }
     else{
          document.getElementById("TextOutput").innerText = currentRoom._name + "\n" + currentRoom._description + "\ndirection: " + showdirectionsArea()
          document.getElementById("ImgOfRoom").src = currentRoom._Img
     }
}

function showEnemy(){
     let text = []
     for(i in currentRoom._enemiesInRoom){
          text.push(currentRoom._enemiesInRoom[i]._EntetyName)
     }   
     return text
}
function showItems(){
     let text = []
     for(i in currentRoom._itemsInRoom){
          text.push(currentRoom._itemsInRoom[i]._ItemName)
     }
     return text
}
function showdirections(){
   
     const entries = Object.entries(currentRoom._linkedRooms);
     let details = []
     for (const [direction, room] of entries) {
          text = direction
          details.push(text);
     }
     details.join(" ")
     return details;
     
}
function showdirectionsArea(){
   
     const entries = Object.entries(currentRoom._linkedRooms);
     let details = []
     for (const [direction, room] of entries) {
          text =  "\n" + room._name + ": " + direction  ;
          details.push(text);
     }
     details.join(" ")
     return details;
     
}

function gameOver(){
     document.getElementById("mainScreen").hidden = true
     document.getElementById("charScreen").hidden = true
     document.getElementById("gameScreen").hidden = true
     document.getElementById("gameOverScreen").hidden = false
     document.getElementById("GameOver").innerText = "Game Over"

}
function gameWin(){
     document.getElementById("mainScreen").hidden = true
     document.getElementById("charScreen").hidden = true
     document.getElementById("gameScreen").hidden = true
     document.getElementById("gameOverScreen").hidden = false
     document.getElementById("GameOver").innerText = "You Win"
}
