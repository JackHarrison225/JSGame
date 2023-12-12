document.getElementById("mainScreen").hidden = true
document.getElementById("charScreen").hidden = true

currentPlayer = undefined
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
class Dungeon{
     constructor(DungeonRooms){
          this._DungeonRooms = DungeonRooms
     }

     newDungeon(newRooms){
          DungeonRooms = newRooms; 
     }

     enetrTown(){
          if(currentRoom._enemiesInRoom == []){
               dungeonReset()
          }
     }

     dungeonReset(){
          this._DungeonRooms = []
          makeDungeon()
     }

     makeDungeon(){
          room1 = new DungeonRoom()
          room1._linkedRooms = [{room2:east},{room3:south}]
          

          room2 = new DungeonRoom()
          room2._linkedRooms = [{room1:west},{room4:south}]


          room3 = new DungeonRoom()
          room3._linkedRooms = [{room1:north},{room4:east}]


          room4 = new DungeonRoom()
          room4._linkedRooms = [{room2:north},{room3:west}]
     }
}
class DungeonRoom{
     constructor(){
          this._itemsInRoom = [];
          this._enemiesInRoom = [];
          this._npcsInRoom = [];
          this._linkedRooms = [];
     }

}
class shop{
     constructor(npc, type, wares, location){
          this.npc = npc;
          this.type = type;
          this.wares = wares;
          this.location = location
     }
}
class Town{
     constructor(shops){
          this._shops = shops
     }

     enterDungeon(){}
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
          this._maxHitPoints = this._basehitPoints + this._stats.ConsMod
          this._hitPoints = this._basehitPoints + this._stats.ConsMod
          
     }

     takeDamage(damageToTake){
          hitPoints -= damageToTake;
          if (hitPoints > 1){
               this.death()
          }
     }

     death(){
          this._dead = true;
          gameOver = true
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
     constructor(){
          super()
     }


     death(){
          this._dead = true;
          currentPlayer.level_exp += exp
          currentPlayer.levelup();
          currentRoom._enemiesInRoom = [];
     }
}

class Player extends Entety{

     constructor(Entetyname, hitPoints, stats, equipt, inventory, gold){
          super(Entetyname, hitPoints, stats, inventory, gold)
          this.inCombat = false;
          this._equipt = equipt
          this._level_exp = 0
          this.level = 1;
          this._deathSaves = 0;
          this._mana = 100;
          this._maxWeight = (100+((this._stats.StrMod)*5))
          this._armourClass = this.setArmourClass()
          this._currentWeight = this.setWeight()
     }

     showInvenroty(){
          document.getElementById("showInventory").innerText = this._inventory //fix at later date
     }
     buyItem(item){
          if(gold - item._cost < 0){
               console.log("Not enough gold. you have " + this.gold)
          }
     }
     sellItem(item){
          
          delete(this.inventory, item)
     }
     takeDamage(damageToTake){
          this._hitPoints -= damageToTake
          if (this.hitPoints < 1 && this._hitPoints > 0-this._hitPoints)
          {
               this.death()
          }
          
     }

     
     rollToHit(enemy){
          let hitVal = math.floor(math.randomRange(0,20))
          if(hitVal > enemy._armourClass-1)
          {
               damageGiven = this._inventory.WeaponEquipt.damge
               if(this._inventory.WeaponEquipt.damgeType == "magic")
               {
                    if(this._mana > 0)
                    {
                         let damage_bonus = this._stats.InteMod
                         this._mana --
                         damageGiven += damage_bonus
                    }
               }
               else if(this.inventory.WeaponEquipt.damgeType == "blunt"){
                    let damage_bonus = this._stats.StrMod
                    damageGiven += damage_bonus
               }
               else if(this.inventory.WeaponEquipt.damgeType == "finness"){
                    let damage_bonus = this._stats.DexMod
                    damageGiven += damage_bonus
               }
               enemy.takeDamage(damageGiven)
          }

     }

     changeArmour(armourName){
          
     }
     
     changeWeapon(WeaponName){

     }

     levelUp(){
          if (this._level_exp >= 300*this.level)
          {
               this.level ++
               this._level_exp = 0;
          }
     }

     takePotion(potion){
          if(this.inventory.Potions.potion > 0){
               if(potion == "healing"){
                    this._hitPoints += math.floor(math.randomRange(4,12))
                    this.hitPoints += this._stats._WisMod
                    this._inventory.Potions.potion --
               }
               else if(potion == "mana"){
                    this._mana += 3
                    this.inventory.Potions.potion --
               }
          }
     }

     lookAround(room){
          const entries = Object.entries(currentRoom._itemsInRoom);
          let details = []
          let list = []
          for (const [index, item] of entries) 
          {
               list.push(index)
               details = item;
               console.log(details)
          }
     }
     
     collectItem(){

     }

     setWeight(){

     }
}

//create items

//weapons (name, weight, attack, type, cost)
//basic
const BasicWand = new Weapon("Basic Wand",5 ,4 ,"magic", 15);
const BasicClub = new Weapon("Basic Club",9 ,5 , "blunt", 15);
const BasicAxe = new Weapon("Basic Axe",4 ,5 , "finness", 15);
const BasicDagger = new Weapon("Basic Dagger",3 ,4 , "finness", 15);
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
const BasicLether = new Armour("Basic Lether", 12, 13, 20);
const BasicChain = new Armour("Basic Chain", 15, 14, 22);
const BasicPlate = new Armour("Basic Plate", 20, 15, 24);
//normal
const NormalLether = new Armour("Basic Lether", 14, 15, 25);
const NormalChain = new Armour("Basic Chain", 17, 16, 27);
const NormalPlate = new Armour("Basic Plate", 22, 17, 29);
//advanced
const AdvancedLether = new Armour("Basic Lether", 15, 17, 30);
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
Alchemist = new NPC({_Potions : [healingPot, healingPot, healingPot, manaPot],
     _Armours : [NoArmour, NormalLether],
     _Weapons : [NormalDagger]})

Blacksmith = new NPC({_Potions : [healingPot, healingPot, healingPot, manaPot],
     _Armours : [NoArmour, NormalPlate],
     _Weapons : [NormalClub]})

Adventurer = new NPC({_Potions : [healingPot, healingPot, healingPot, manaPot],
     _Armours : [NoArmour, NormalPlate],
     _Weapons : [NormalClub]})

//create enemies


//create rooms

//lists for rooms
potionList = [healingPot, healingPotPlus1, healingPotPlus2, manaPot, manaPotPlus1, manaPotPlus2]
basicWeaponList = []
basicArmourList = []

//shops
const potionShop = new shop(Alchemist, "potions", potionList, "north")
const weaponShop = new shop(Blacksmith, "weapons", basicWeaponList, "east")
const armourShop = new shop(Adventurer, "armour", basicArmourList, "west")
//town

//dungeon rooms

//dungeon

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
          ArmourEquipt : BasicLether},
     
          //inventory
          {_Potions : [healingPot, healingPot, healingPot, manaPot, manaPot, manaPot],
          _Armours : [NoArmour, BasicLether],
          _Weapons : [BasicDagger]},
          //gold
          15)
     currentPlayer._armour = currentPlayer._equipt.ArmourEquipt._defense
     currentPlayer.setArmourClass()
}
