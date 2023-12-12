//Game classes and constructors
//Items and objects
class Item {
     constructor(ItemName, weight){
          this._ItemName = ItemName
          this._weight = weight 
     }
}

class Weapon extends Item{
     constructor(ItemName, weight, damage, damageType){
          super(ItemName, weight)
          this._damage = damage;
          this._damageType = damageType;
     }
}

class Armour extends Item{
     constructor(ItemName, weight, defense){
          super(ItemName, weight)
          this._defense = defense;
     }
}

class Potion extends Item{
     constructor(ItemName, weight, description){
          super(ItemName, weight)
          this._description = description
     }
}

//Rooms
class Dungeon{
     constructor(DungeonRooms){
          DungeonRooms = DungeonRooms
     }

     newDungeon(newRooms){
          DungeonRooms = newRooms; 
     }
}
class DungeonRoom{
     constructor(){
          this._itemsInRoom = [];
          this._enemiesInRoom = [];
          this._npcsInRoom = [];
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

class NPC extends Entety{
     constructor(inventory){
          super(inventory)
          hitPoints = 4
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
     }
}

class Player extends Entety{

     constructor(Entetyname, hitPoints, stats, inventory, gold){
          super(Entetyname, hitPoints, stats, inventory, gold)
          this._level_exp = 0
          this.level = 1;
          this._deathSaves = 0;
          this._mana = 100;
          this._maxWeight = (100+((this._stats.StrMod)*5))
          this._armourClass = this.setArmourClass()
     }

     takeDamage(damageToTake){
          this._hitPoints -= damageToTake
          if (this.hitPoints < 1 && this._hitPoints > 0-this._hitPoints)
          {
               rollDeathSave()
               if (this._deathSaves == 3){
                    this.death()
               }
          }
          else(
               this.death()
          )
          
     }

     rollDeathSave(){
          if(hitPoints < 1 && hitPoints > 0 - hitPoints){
               TF = math.floor(math.randomRange(1,20))
               
               if (TF > 9){
                    hitPoints = 1
                    this.deathSaves = 0
               }
               else{
                    this.deathSaves ++
               }
          }
          else{
               return false
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

     changeArmour(armour){
          if(armour in this.inventory.armours){
               this.inventory.ArmourEquipt = armour
               this.setArmourClass()
          }
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
          let look = math.floor(math.randomRange(0,20))+this._stats.InteMod
          visableList = []
          for(i in room._itemsInRoom){
               hiddenvalue = math.floor(math.randomRange(0,20))
               if (look > hiddenvalue){
                    visableList.push(room._itemsInRoom[i])
               }
          }
          console.log(visableList)
     }
}

//create items

//weapons
//basic
const BasicWand = new Weapon("Basic Wand",5 ,4 ,"magic");
const BasicClub = new Weapon("Basic Club",9 ,5 , "blunt");
const BasicAxe = new Weapon("Basic Axe",4 ,5 , "finness");
const BasicDagger = new Weapon("Basic Dagger",3 ,4 , "finness");
//basic+1
const BasicWandPlus1 = new Weapon("Basic Wand +1", 5, 5, "magic");
const BasicClubPlus1 = new Weapon("Basic Club +1", 9, 6, "blunt");
const BasicAxePlus1 = new Weapon("Basic Axe +1", 4, 6, "finness");
const BasicDaggerPlus1 = new Weapon("Basic Dagger +1", 3, 5, "finness");
//normal
const NormalWand = new Weapon("Normal Wand", 5, 8,"magic");
const NormalClub = new Weapon("Normal Club", 9, 10, "blunt");
const NormalAxe = new Weapon("Normal Axe", 4, 10, "finness");
const NormalDagger = new Weapon("Normal Dagger", 3, 8, "finness");
//normal+1
const NormalWandPlus1 = new Weapon("Normal Wand +1", 5, 9,"magic");
const NormalClubPlus1 = new Weapon("Normal Club +1", 9, 11, "blunt");
const NormalAxePlus1 = new Weapon("Normal Axe +1", 4, 11, "finness");
const NormalDaggerPlus1 = new Weapon("Normal Dagger +1", 3, 9, "finness");
//advanced
const AdvancedWand = new Weapon("Advanced Wand", 5, 12,"magic");
const AdvancedClub = new Weapon("Advanced Club", 9, 15, "blunt");
const AdvancedAxe = new Weapon("Advanced Axe", 4, 15, "finness");
const AdvancedDagger = new Weapon("Advanced Dagger", 3, 12, "finness");
//advanced+1
const AdvancedWandPlus1 = new Weapon("Advanced Wand +1", 5, 12,"magic");
const AdvancedClubPlus1 = new Weapon("Advanced Club +1", 9, 15, "blunt");
const AdvancedAxePlus1 = new Weapon("Advanced Axe +1", 4, 15, "finness");
const AdvancedDaggerPlus1 = new Weapon("Advanced Dagger +1", 3, 12, "finness");

//Armour
const NoArmour = new Armour("NoArmour", 0, 0);
//basic
const BasicLether = new Armour("Basic Lether", 12, 13);
const BasicChain = new Armour("Basic Chain", 15, 14);
const BasicPlate = new Armour("Basic Plate", 20, 15);
//normal
const NormalLether = new Armour("Basic Lether", 14, 15);
const NormalChain = new Armour("Basic Chain", 17, 16);
const NormalPlate = new Armour("Basic Plate", 22, 17);
//advanced
const AdvancedLether = new Armour("Basic Lether", 15, 17);
const AdvancedChain = new Armour("Basic Chain", 19, 18);
const AdvancedPlate = new Armour("Basic Plate", 24, 19);

//Potions
const healingPot = new Potion("healing Pot", 0.5, "Small bottle containing funky smelling red liquid.")
const manaPot = new Potion("mana Pot", 0.5, "Small bottle containing funky smelling blue liquid.")
//Potions +1
const healingPotPlus1 = new Potion("healing Pot +1", 0.75, "medium bottle containing funky smelling red liquid.")
const manaPotPlus1 = new Potion("mana Pot +1", 0.75, "medium bottle containing funky smelling blue liquid.")
//Potions +2
const healingPotPlus2 = new Potion("healing Pot +2", 1, "large bottle containing funky smelling red liquid.")
const manaPotPlus2 = new Potion("mana Pot +2", 1, "lerge bottle containing funky smelling blue liquid.")

//create Chars and enemies
const WizardPlayer = 
new Player(
     //Name
     "",
     //base hp
     8,
     //stats
     {StrMod : -4, 
     DexMod : -3, 
     ConsMod : 2, 
     InteMod : 4, 
     WisMod : 3, 
     CharMod : -2},
     //inventory
     {WeaponEquipt : BasicWand,

     ArmourEquipt : BasicLether,

     Potions : [{healingPot : 2}, {manaPot : 4}],

     armours : NoArmour},

     15)
WizardPlayer._armour = WizardPlayer._inventory.ArmourEquipt._defense
WizardPlayer.setArmourClass()


const BarbarianPlayer = 
new Player(
     //name
     "",
     //base hp
     12,
     //stats
     {StrMod : 4, 
     DexMod : 3, 
     ConsMod : 2, 
     InteMod : -4, 
     WisMod : -2, 
     CharMod : -3},
     //inventory
     {WeaponEquipt : BasicClub,

     ArmourEquipt : NoArmour,

     Potions : [{healingPot : 4}, {manaPot : 0}],

     armours :[NoArmour]},
     
     15)
BarbarianPlayer._armour = BarbarianPlayer._inventory.ArmourEquipt._defense
BarbarianPlayer.setArmourClass()


const ClericPlayer = 
new Player(
     //name
     "",
     //base hp
     10,
     //stats
     {StrMod : -2, 
     DexMod : 2, 
     ConsMod : 3, 
     InteMod : -4, 
     WisMod : 4, 
     CharMod : -3},
     //inventory
     {WeaponEquipt : BasicAxe,

     ArmourEquipt : BasicLether,

     Potions : [{healingPot, total : 6}, {manaPot, total : 2}],

     armours :[NoArmour, BasicLether]},
     
     15)
ClericPlayer._armour = ClericPlayer._inventory.ArmourEquipt._defense
ClericPlayer.setArmourClass()


// const RoguePlayer = 
//      new Player()
// const village = new Town()
// let room1 = new DungeonRoom()

console.log(WizardPlayer.ArmourEquipt)
WizardPlayer.changeArmour(NoArmour)
console.log(WizardPlayer.ArmourEquipt)

