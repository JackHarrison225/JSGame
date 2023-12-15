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
               alert("You can't go that way",);
               return this;
          }
     }

     linkRoom(direction, roomToLink) {
          this._linkedRooms[direction] = roomToLink;
     }
}
class DungeonEntrance extends Room{
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
          dungeonEntrance.createDungeon()
          currentRoom = dungeonEntrance
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
               currentPlayer.takeDamage(this._damage)
          }
     }

     death(){
          currentRoom._combat = false;
          this._dead = true;
          currentPlayer._level_exp += this._exp
          currentPlayer.levelUp();
          currentRoom._enemiesInRoom = [];
          changeRoomInfo()
          alert("Enemy Dead")
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
          this._mana = 100;
          this._maxWeight = (100+((this._stats.StrMod)*5))
          this._armourClass = this.setArmourClass()
          this._currentWeight = this.setWeight()
          this._maxHitPoints = (this._basehitPoints * this.level) + this._stats.ConsMod
          this._hitPoints = this._basehitPoints + this._stats.ConsMod
     }

     setmaxHitPoints(){
          this._maxHitPoints = (this._basehitPoints * this.level) + this._stats.ConsMod
     }
     buyItem(item){
          if(gold - item._cost < 0){
               console.log("Not enough gold. you have " + this.gold)
          }
     }

     sellItem(item){
          
          delete(this.inventory, item)
     }

     death(){
          this._dead = true;
          gameOver()
     }
     takeDamage(damageToTake){
          alert("You have been hit")
          this._hitPoints -= damageToTake
          if (this._hitPoints < 1)
          {
               this.death()
          }
          document.getElementById("HitPoints").innerText = "HitPoints: " + currentPlayer._hitPoints + "/" + currentPlayer._maxHitPoints;

 
     }
     
     rollToHit(enemy){
          let hitVal = Math.floor(Math.random()*20)
          if(hitVal > enemy._armourClass-1)
          {
               alert("You hit an enemy")
               let damageGiven = this._equipt.WeaponEquipt._damage
               if(this._equipt.WeaponEquipt.damgeType == "magic")
               {
                    if(this._mana > 0)
                    {
                         let damage_bonus = this._stats.InteMod
                         this._mana --
                         damageGiven += damage_bonus
                    }
               }
               else if(this._equipt.WeaponEquipt.damgeType == "blunt"){
                    let damage_bonus = this._stats.StrMod
                    damageGiven += damage_bonus
               }
               else if(this._equipt.WeaponEquipt.damgeType == "finness"){
                    let damage_bonus = this._stats.DexMod
                    damageGiven += damage_bonus
               }
               enemy.takeDamage(damageGiven)
          }
          else alert("miss")

     }

     changeArmour(armourName){
          
     }
     
     changeWeapon(WeaponName){

     }

     levelUp(){
          if (this._level_exp >= 100*this.level)
          {
               this.level ++
               this._level_exp = 0;
               this.setmaxHitPoints()
               this._hitPoints = this._maxHitPoints
               document.getElementById("HitPoints").innerText = "HitPoints: " + currentPlayer._hitPoints + "/" + currentPlayer._maxHitPoints;
               alert("LEVEL UP")
          }
     }

     takePotion(potion){
          if(potion == "healing"){
               if(this._inventory._Potions[1].total > 0){
                    if(this._hitPoints != this._maxHitPoints){     
                         this._hitPoints += Math.floor((Math.random()*8)+4) 
                         this._hitPoints += this._stats.WisMod
                         this._inventory._Potions[1].total -= 1
                         if(this._hitPoints > this._maxHitPoints){
                              this._hitPoints = this._maxHitPoints
                         }
                    }
                    else alert("You are at full health.")
               }
               else alert("Out Of healing potions")
          }    
          else if(potion == "mana"){
               if(this._inventory._Potions[3].total > 0){
                    this._mana += 3
                    this._inventory._Potions[3].total -= 1
               }
               else alert("Out of mana potions")
          }
          setUpScreen()
          
     }
     
     collectItem(item){
          
          let pathP = this._inventory._Potions
          let pathA = this._inventory._Armours
          let pathW = this._inventory._Weapons

          for(let i = 0; i < (pathP).length; i+=2){
               if(pathP[i]._ItemName == item._ItemName){
                    pathP[i+1].total += 1
                    setUpScreen()
                    currentRoom._itemsInRoom = []
                    return
               }
          }
          for(let i = 0; i < (pathA).length; i+=2){
               if(pathA[i]._ItemName == item._ItemName){
                    pathA[i+1].total += 1
                    setUpScreen()
                    currentRoom._itemsInRoom = []
                    return
               }
          }
          for(let i = 0; i < (pathW).length; i+=2){
               if(pathW[i]._ItemName == item._ItemName){
                    pathW[i+1].total += 1
                    setUpScreen()
                    currentRoom._itemsInRoom = []
                    return
               }
          }
          
     }

     setWeight(){

     }
}

//create items
//weapons (name, weight, attack, type, cost) //basic
const BasicWand = new Weapon("Basic Wand",5 ,4 ,"magic", 15);
const BasicClub = new Weapon("Basic Club",9 ,5 , "blunt", 15);
const BasicAxe = new Weapon("Basic Axe",4 ,5 , "finness", 15);
const BasicDagger = new Weapon("Basic Dagger",3 ,4 , "finness", 15);
// BasicWand, BasicClub, BasicAxe, BasicDagger
//basic+1
const BasicWandPlus1 = new Weapon("Basic Wand +1", 5, 5, "magic", 20);
const BasicClubPlus1 = new Weapon("Basic Club +1", 9, 6, "blunt", 20);
const BasicAxePlus1 = new Weapon("Basic Axe +1", 4, 6, "finness", 20);
const BasicDaggerPlus1 = new Weapon("Basic Dagger +1", 3, 5, "finness", 20);
//normal
const NormalWand = new Weapon("Normal Wand", 5, 8,"magic", 25);
const NormalClub = new Weapon("Normal Club", 9, 10, "blunt", 25);
const NormalAxe = new Weapon("Normal Axe", 4, 10, "finness", 25);
const NormalDagger = new Weapon("Normal Dagger", 3, 8, "finness", 25);
//normal+1
const NormalWandPlus1 = new Weapon("Normal Wand +1", 5, 9,"magic", 30);
const NormalClubPlus1 = new Weapon("Normal Club +1", 9, 11, "blunt", 30);
const NormalAxePlus1 = new Weapon("Normal Axe +1", 4, 11, "finness", 30);
const NormalDaggerPlus1 = new Weapon("Normal Dagger +1", 3, 9, "finness", 30);
//advanced
const AdvancedWand = new Weapon("Advanced Wand", 5, 12,"magic", 35);
const AdvancedClub = new Weapon("Advanced Club", 9, 15, "blunt", 35);
const AdvancedAxe = new Weapon("Advanced Axe", 4, 15, "finness", 35);
const AdvancedDagger = new Weapon("Advanced Dagger", 3, 12, "finness", 35);
//advanced+1
const AdvancedWandPlus1 = new Weapon("Advanced Wand +1", 5, 12,"magic", 40);
const AdvancedClubPlus1 = new Weapon("Advanced Club +1", 9, 15, "blunt", 40);
const AdvancedAxePlus1 = new Weapon("Advanced Axe +1", 4, 15, "finness", 40);
const AdvancedDaggerPlus1 = new Weapon("Advanced Dagger +1", 3, 12, "finness", 40);

//Armour (name , weight , defense , cost)
const NoArmour = new Armour("No Armour", 0, 0, 0);
//basic 
const BasicLeather = new Armour("Basic Leather", 12, 13, 20);
const BasicChain = new Armour("Basic Chain", 15, 14, 22);
const BasicPlate = new Armour("Basic Plate", 20, 15, 24);
//normal
const NormalLeather = new Armour("Basic Leather", 14, 15, 25);
const NormalChain = new Armour("Basic Chain", 17, 16, 27);
const NormalPlate = new Armour("Basic Plate", 22, 17, 29);
//advanced
const AdvancedLeather = new Armour("Basic Leather", 15, 17, 30);
const AdvancedChain = new Armour("Basic Chain", 19, 18, 32);
const AdvancedPlate = new Armour("Basic Plate", 24, 19, 34);

//Potions (name weight desciption, cost)
const healingPot = new Potion("healing Pot", 0.5, "Small bottle containing funky smelling red liquid.", 5)
const manaPot = new Potion("mana Pot", 0.5, "Small bottle containing funky smelling blue liquid.", 5)
//Potions +1
const healingPotPlus1 = new Potion("healing Pot +1", 0.75, "medium bottle containing funky smelling red liquid.", 7)
const manaPotPlus1 = new Potion("mana Pot +1", 0.75, "medium bottle containing funky smelling blue liquid.", 7)
//Potions +2
const healingPotPlus2 = new Potion("healing Pot +2", 1, "large bottle containing funky smelling red liquid.", 9)
const manaPotPlus2 = new Potion("mana Pot +2", 1, "lerge bottle containing funky smelling blue liquid.", 9)

//create Chars and enemies
// const village = new Town()
// let room1 = new DungeonRoom()

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
const TownCenter = new Town("TownCenter" ,"Large Medieval style shops line the cobbled streets and men, women and children going about their business")
TownCenter._Img = "img/TownCenter.png"
//shops
const potionShop = new shop("potionShop", Alchemist, "potions", potionList, "black wooden shelves line the walls each teaming with clear glass bottles filled with red and blue liquid.")
potionShop._Img = ""
const weaponShop = new shop("weaponShop", Blacksmith, "weapons", basicWeaponList, "Metals hooks and racks fill the small space axes, daggers, swords and clubs fill every corner.")
weaponShop._Img = ""
const armourShop = new shop("armourShop", Adventurer, "armour", basicArmourList, "Metals hooks and racks fill the small space leather, chain and plate aroumr cover every surface.")
armourShop._Img = ""
//dungeon
const dungeonEntrance = new DungeonEntrance("dungeonEntrance", "A vast chasm of rock opens up before you. Vines and moss line each wall, inviting only the bravest to enter.")
dungeonEntrance._Img = ""
const dungeonExit = new DungeonEntrance("dungeonExit", "The light from the entrance still floods the cavern.")
dungeonExit._Img = ""
//dungeon rooms are created in create dungeon called on entry to dungeon
//link rooms
potionShop.linkRoom("west", TownCenter)
weaponShop.linkRoom("south", TownCenter)
armourShop.linkRoom("east", TownCenter)

TownCenter.linkRoom("east", potionShop)
TownCenter.linkRoom("north", weaponShop)
TownCenter.linkRoom("west", armourShop)
TownCenter.linkRoom("south", dungeonEntrance)

dungeonEntrance.linkRoom("north", TownCenter)


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
          _Armours : [NoArmour,{total : 1}, BasicLeather, {total : 1}],
          _Weapons : [BasicWand, {total : 1}]},
          //gold
          15)
     currentPlayer._armour = currentPlayer._equipt.ArmourEquipt._defense
     currentPlayer.setArmourClass()
     
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
          _Armours : [NoArmour, {total : 1}, BasicPlate, {total : 1}],
          _Weapons : [BasicClub, {total : 1}]},
          //gold
          15)
     currentPlayer._armour = currentPlayer._equipt.ArmourEquipt._defense
     currentPlayer.setArmourClass()

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
          _Armours : [NoArmour, {total : 1}, BasicChain, {total : 1}],
          _Weapons : [BasicAxe, {total : 1}]},
          //gold
          15)
     currentPlayer._armour = currentPlayer._equipt.ArmourEquipt._defense
     currentPlayer.setArmourClass()
     
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
          _Armours : [NoArmour, {total : 1}, BasicLeather, {total : 1}],
          _Weapons : [BasicDagger, {total : 1}]},
          //gold
          15)
     currentPlayer._armour = currentPlayer._equipt.ArmourEquipt._defense
     currentPlayer.setArmourClass()

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
     currentRoom = TownCenter
     document.getElementById("TextOutput").innerText = "info for game win stuff and such like" + "\n" + currentRoom._name + "\n"+ currentRoom._description + "\n" + currentRoom._linkedRooms
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


                    if(directions.includes(command.toLowerCase())){
                         currentRoom = currentRoom.move(command)
                         document.getElementById("CommandsInput").value = ""
                         changeRoomInfo()
                         console.log(currentRoom);
                    }

                    else if(enter.includes(command.toLowerCase())){

                         if(currentRoom._name == "dungeonEntrance")
                         {
                              buildDungeon()
                              currentRoom = dungeonExit
                              document.getElementById("CommandsInput").value = ""
                              changeRoomInfo()
                              
                         }
                         else {alert("Go to the dungeon entrance to enter")}
                    }

                    else if(exit.includes(command.toLowerCase())){
                         if(currentRoom._name == "dungeonExit")
                         {
                              currentRoom = dungeonEntrance
                              document.getElementById("CommandsInput").value = ""
                              changeRoomInfo()
                         }
                         else {alert("Go to the dungeon exit to exit")}
                    }
                    
                    else if(attackEnemny.includes(command.toLowerCase())){
                         if(currentRoom._enemiesInRoom.length > 0){
                              for(i in currentRoom._enemiesInRoom){
                                   currentPlayer.rollToHit(currentRoom._enemiesInRoom[i])
                              }
                         }
                         else alert("No enemy to attack")
                         document.getElementById("CommandsInput").value = ""
                    }
                    else if(heal.includes(command.toLowerCase())){
                         currentPlayer.takePotion("healing")
                         document.getElementById("CommandsInput").value = ""
                    }
                    else if(mana.includes(command.toLowerCase())){
                         currentPlayer.takePotion("mana")
                         document.getElementById("CommandsInput").value = ""
                    }

                    else if(collect.includes(command.toLowerCase())){
                         for(i in currentRoom._itemsInRoom){
                              currentPlayer.collectItem(currentRoom._itemsInRoom[i])
                         }
                         document.getElementById("CommandsInput").value = ""
                    }
                    
                    
                    else{alert("that is not a valid command please try again")}

                    if (currentRoom._combat == true){
                         for(i in currentRoom._enemiesInRoom){
                              currentRoom._enemiesInRoom[i].attack()
                         }
                    }

               }  
          })
     }
}

function buildDungeon(){
     //randomise the creation of the dungeon
     //create rooms
     DungeonRoomOne = new DungeonRoom("Room 1", "the large cavern opens up infront of you, A dull light makes it just visable to see")
     populateEnemies(DungeonRoomOne, Goblin = new Enemy("goblin",(6*currentPlayer.level), 3))
     populateItems(DungeonRoomOne)

     DungeonRoomTwo = new DungeonRoom("Room 2", "Description")
     populateEnemies(DungeonRoomTwo, Goblin = new Enemy("goblin",(6*currentPlayer.level), 3))
     populateItems(DungeonRoomTwo)

     DungeonRoomThree = new DungeonRoom("Room 3", "Description")
     populateEnemies(DungeonRoomThree, Goblin = new Enemy("goblin",(6*currentPlayer.level), 3))
     populateItems(DungeonRoomThree)

     DungeonRoomFour = new DungeonRoom("Room 4", "Description")
     populateEnemies(DungeonRoomFour, Goblin = new Enemy("goblin",(6*currentPlayer.level), 3))
     populateItems(DungeonRoomFour)

     DungeonRoomFive = new DungeonRoom("Room 5", "Description")
     populateEnemies(DungeonRoomFive, Goblin = new Enemy("goblin",(6*currentPlayer.level), 3))
     populateItems(DungeonRoomFive)

     DungeonRoomSix = new DungeonRoom("Room 6", "Description")
     populateEnemies(DungeonRoomSix, Goblin = new Enemy("goblin",(6*currentPlayer.level), 3))
     populateItems(DungeonRoomSix)

     DungeonRoomSeven = new DungeonRoom("Room 7", "Description")
     populateEnemies(DungeonRoomSeven, Goblin = new Enemy("goblin",(6*currentPlayer.level), 3))
     populateItems(DungeonRoomSeven)

     DungeonRoomEight = new DungeonRoom("Room 8", "Description")
     populateEnemies(DungeonRoomEight, Goblin = new Enemy("goblin",(6*currentPlayer.level), 3))
     populateItems(DungeonRoomEight)

     SecretRoom = new DungeonRoom("Secret room", "description")
     populateEnemies(SecretRoom, Goblin = new Enemy("goblin",(6*currentPlayer.level), 3))
     populateItems(SecretRoom)

     
     let layout = Math.floor(Math.random()*6)
     console.log("Layout: " + layout)
     switch(layout){
          case 0:
               //link rooms
               dungeonExit._linkedRooms = []
               dungeonExit.linkRoom("north", DungeonRoomOne)
               //room one
               DungeonRoomOne.linkRoom("south", dungeonExit)
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
               dungeonExit._linkedRooms = []
               dungeonExit.linkRoom("north", DungeonRoomOne)
               //room one
               DungeonRoomOne.linkRoom("south", dungeonExit)
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
               SecretRoom.linkRoom("east", dungeonExit)
               break;

          case 2:

               //link rooms
               dungeonExit._linkedRooms = []
               dungeonExit.linkRoom("north", DungeonRoomOne)
               //room one
               DungeonRoomOne.linkRoom("south", dungeonExit)
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
               SecretRoom.linkRoom("east", dungeonExit)
               break;

          case 3:
               //link rooms
               dungeonExit._linkedRooms = []
               dungeonExit.linkRoom("north", DungeonRoomThree)
               dungeonExit.linkRoom("east", DungeonRoomOne)
               dungeonExit.linkRoom("south", DungeonRoomSeven)
               dungeonExit.linkRoom("west", DungeonRoomFive)
               //room one
               DungeonRoomOne.linkRoom("south", DungeonRoomEight)
               DungeonRoomOne.linkRoom("north", DungeonRoomTwo)
               DungeonRoomOne.linkRoom("west", dungeonExit)

               //room two
               DungeonRoomTwo.linkRoom("south", DungeonRoomOne)
               DungeonRoomTwo.linkRoom("west", DungeonRoomThree)
               //room three
               DungeonRoomThree.linkRoom("south", dungeonExit)
               DungeonRoomThree.linkRoom("west", DungeonRoomFour)
               DungeonRoomThree.linkRoom("east", DungeonRoomTwo)
               //room four
               DungeonRoomFour.linkRoom("east", DungeonRoomThree)
               DungeonRoomFour.linkRoom("south", DungeonRoomFive)
               //room five
               DungeonRoomFive.linkRoom("north", DungeonRoomFour)
               DungeonRoomFive.linkRoom("south", DungeonRoomSix)
               DungeonRoomFive.linkRoom("east", dungeonExit)
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
               dungeonExit._linkedRooms = []
               dungeonExit.linkRoom("south", DungeonRoomOne)
               //room one
               DungeonRoomOne.linkRoom("north", dungeonExit)
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
               SecretRoom.linkRoom("east", dungeonExit)

               break;

          case 5:
               //link rooms
               dungeonExit._linkedRooms = []
               dungeonExit.linkRoom("south", DungeonRoomOne)
               //room one
               DungeonRoomOne.linkRoom("north", dungeonExit)
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
               SecretRoom.linkRoom("south", dungeonExit)
               SecretRoom.linkRoom("north", DungeonRoomEight)
               break;
               
          case 6:
               //link rooms
               dungeonExit._linkedRooms = []
               dungeonExit.linkRoom("south", DungeonRoomOne)
               //room one
               DungeonRoomOne.linkRoom("north", dungeonExit)
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
               SecretRoom/linkroom("south", dungeonExit)
               break;
          }

     function populateEnemies(room, enemy){
          enemies = Math.floor(Math.random())
          
          if(enemies == 0){
               room._enemiesInRoom.push(enemy)
               room._combat = true
          }
     }
     function populateItems(room){
          ItemsTF = Math.floor(Math.random()*3)
          
          if(ItemsTF == 1){
               x = Math.floor(Math.random()*2)
               if(x == 0){
                    //potion
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
                    room._itemsInRoom.push(givenItem)
               }
               
          }
     }
}

function setUpScreen(){
     document.getElementById("Equipt").innerText = "Current Armour: " + currentPlayer._equipt.ArmourEquipt._ItemName + "\n" + "Current Weapon: " + currentPlayer._equipt.WeaponEquipt._ItemName 
     document.getElementById("Potions").innerText = "Owned Potions: \n" + setItems(currentPlayer._inventory._Potions);
     document.getElementById("Armour").innerText = "Owned Armours: \n" + setItems(currentPlayer._inventory._Armours);
     document.getElementById("Weapons").innerText = "Owned Weapons: \n" + setItems(currentPlayer._inventory._Weapons);

     document.getElementById("ImgOfRoom").src = currentRoom._Img
     document.getElementById("Name").innerText = currentPlayer._EntetyName;
     document.getElementById("HitPoints").innerText = "HitPoints: " + currentPlayer._hitPoints + "/" + currentPlayer._maxHitPoints;
     document.getElementById("Mana").innerText = "Mana: " + currentPlayer._mana;
     document.getElementById("Gold").innerText = "Gold: " + currentPlayer._gold;
     document.getElementById("StrMod").innerText = "Strength: " + currentPlayer._stats.StrMod;
     document.getElementById("DexMod").innerText = "Dexterity: " + currentPlayer._stats.DexMod;
     document.getElementById("ConsMod").innerText = "Consitution: " + currentPlayer._stats.ConsMod;
     document.getElementById("InteMod").innerText = "Inteligance: " + currentPlayer._stats.InteMod;
     document.getElementById("WisMod").innerText = "Wisdom: " + currentPlayer._stats.WisMod;
     document.getElementById("CharMod").innerText = "Charisma: " + currentPlayer._stats.CharMod;
}
function setItems(path){
     let List = []
     for(let i = 0; i < (path).length; i += 2){
          List.push(path[i]._ItemName + ": " + path[i+1].total)
     }

     return (List.join(", "))
}

function changeRoomInfo(){
     if(currentRoom._name == "Room 1" || currentRoom._name == "Room 2" || currentRoom._name == "Room 3" || currentRoom._name == "Room 4" || currentRoom._name == "Room 5" || currentRoom._name == "Room 6" || currentRoom._name == "Room 7" || currentRoom._name == "Room 8" || currentRoom._name == "Secret room"){
          document.getElementById("TextOutput").innerText = currentRoom._name + "\n" + currentRoom._description + "\nEnemy: " + showEnemy()+ "\nItem: " + showItems() + "\nopenings: " + showdirections()
     }
     else if(currentRoom._name == "dungeonExit"){
          document.getElementById("TextOutput").innerText = currentRoom._name + "\n" + currentRoom._description + "\nopenings: " + showdirections()
     }
     else{
          document.getElementById("TextOutput").innerText = currentRoom._name + "\n" + currentRoom._description;
          document.getElementById("ImgOfRoom").src = currentRoom._Img
     }
}

function showEnemy(){
     let text = []
     if(currentRoom._enemiesInRoom != []){
          for(i in currentRoom._enemiesInRoom){
               text.push(currentRoom._enemiesInRoom[i]._EntetyName)
          }
     }
     else text = ["None"]
     return text
}
function showItems(){
     let text = []
     if(currentRoom._itemsInRoom != []){
          for(i in currentRoom._itemsInRoom){
               text.push(currentRoom._itemsInRoom[i]._ItemName)
          }
     }
     else text = ["None"]
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

function gameOver(){
     document.getElementById("mainScreen").hidden = true
     document.getElementById("charScreen").hidden = true
     document.getElementById("gameScreen").hidden = true
     document.getElementById("gameOverScreen").hidden = false
}