/*	To start the game we need an adventurer
	this adventurer need a Name and a HP bar, and a attack power
*/

//Equipaments Sector
//constructor for the weapons
var weapon = function(name, cost, fa, bonus){
	this.name =  name;
	this.cost = cost;
	this.fa = fa;
	this.bonus = bonus;
};
//armor constructor
var armor = function(name, cost, fd, bonus){
	this.name =  name;
	this.cost = cost;
	this.fd = fd;
	this.bonus = bonus;
};

//List of weapons
var weaponList = [];
weaponList.push(new weapon("Unarmed",0,1,0));
weaponList.push(new weapon("Acid",10,1,2));
weaponList.push(new weapon("Dagger",2,1,1));
weaponList.push(new weapon("Holy Water",25,2,-1));
weaponList.push(new weapon("Stick",2,1,2));
weaponList.push(new weapon("Crosbow",35,2,-2));
weaponList.push(new weapon("Crosbow Arrow (10)",1,0,0));
weaponList.push(new weapon("Club",0,1,2));
weaponList.push(new weapon("Alchemist Fire",20,1,2));
weaponList.push(new weapon("Sling",0,1,1));
weaponList.push(new weapon("Sling Bullets(10)",5,0,0));
weaponList.push(new weapon("Spear",2,1,2));
weaponList.push(new weapon("Light Mace",5,1,2));
weaponList.push(new weapon("Halberd",10,2,0));
weaponList.push(new weapon("Short Bow",30,1,2));
weaponList.push(new weapon("Long Bow",75,2,-2));
weaponList.push(new weapon("Arrows(10)",1,0,0));
weaponList.push(new weapon("Scimitar",15,1,2));
weaponList.push(new weapon("Short Sword",10,1,2));
weaponList.push(new weapon("Large Sword",50,2,2));
weaponList.push(new weapon("Long Sword",15,2,-2));
weaponList.push(new weapon("Sickle",18,2,-1));
weaponList.push(new weapon("Battle Axe",10,2,-2));
weaponList.push(new weapon("War Hammer",12,2,-2));
weaponList.push(new weapon("Trident",15,2,-2));
weaponList.push(new weapon("Whip",1,1,0));
weaponList.push(new weapon("Bastard Sword",35,2));

//List of Armors
var armorList = [];
armorList.push(new armor("No Armor", 0, 1, 0));
armorList.push(new armor("Padded Armor", 5, 1, 1));
armorList.push(new armor("Leather Armor", 10, 1,2));
armorList.push(new armor("Buckler", 15, 0, 1));
armorList.push(new armor("Scale Mail", 50, 2,-1));
armorList.push(new armor("Chain Mail", 50, 2, 0));
armorList.push(new armor("Medium Wooden Shield", 7, 0, 2));
armorList.push(new armor("Splint Mail", 200, 2, 1));
armorList.push(new armor("Full Plate", 1500, 3,3));
armorList.push(new armor("Large Wooden Shield", 30, 0, 3));

var player = {
	name: "Mulestia",
	ability: 3,
	health: 10,
	strenght: 2,
	defence: 2,
	weapon: weaponList[18],
	armor: armorList[4],
	initiative: null,
	attackPower: 0,
	defencePower: 0,
};

var monster = {
	name: "Hob Goblin",
	ability: 2,
	health: 20,
	strenght: 4,
	defence: 3,
	weapon: weaponList[7],
	armor: armorList[0],
	initiative: null,
	attackPower: 0,
	defencePower: 0,
};

/*	We need a battle system
	to determine if they hit someone, we need a dice system.
*/
//Dice System
var rollDice = function(sizes, qtt) {
	var totalRoll = 0;
	var thisRoll = 0;
	if (qtt === undefined) qtt=1;
	if (sizes !== 0) {
		var i = 1;
		do {
			thisRoll = Math.floor((Math.random()*sizes+1));
			console.log("Dice roll number "+ i + " was: "+ thisRoll);
			totalRoll += thisRoll;
			i++;

		} while (i <= qtt);
	}
	return totalRoll;
};

/*
Let's make the combat better:
Initiative: 1d + ability.value + weapon.bonus + Aceleration or teleport
attackPower: Strenght + Ability + 1d + weapon.damage
defencePower: Armor + Ability + 1d + armor.protection
DoubleDamage: higher value on dices doubles the Strenght or Armor
*/

var initiative = function(entity) {
	var roll = rollDice(6);
	entity.initiative = (roll + entity.ability);
	console.log("You Roll: " + roll +" and sum " + entity.ability + " from your ability. Total: " + entity.initiative);
	return entity.initiative;
};

//Calculate Attack Power and Defence Power
var calcPower = function(entity, type) {
	var roll; 
	var resultPower;
	var bonus;
	if (type === "AP") {
		type = "Attack Power";
		calcType = entity.strenght;	
		times = entity.weapon.fa;
		roll = rollDice(6,times);
		bonus = entity.weapon.bonus;
	} else {
		type = "Defence Power";
		calcType = entity.defence;
		times = entity.armor.fd;
		roll = rollDice(6,times);
		bonus = entity.armor.bonus;
	}
	if ( roll === (6 * times) ) { //calculates CriticalStrike
		resultPower = (calcType * 2);
	} else {
		resultPower = calcType;
	}
	if (type === "Attack Power") {
		entity.attackPower = (resultPower + entity.ability + roll + bonus);
		entity.defencePower = 0;
	} else {
		entity.defencePower = (resultPower + entity.ability + roll + bonus);
		entity.attackPower = 0;
	}

	return "Your "+type+" is " + (resultPower + entity.ability + roll + bonus);
};

//console.log(calcPower(player, "AP"));

//console.log(calcPower(monster, "DP"));

//Display things 
//global Variables
var killed = false;

var Attack = function(attacker, defender) {
	//calculate FA and FD
	calcPower(attacker,"AP");
	calcPower(defender,"DP");
	var result = null;
	if (defender.health < 1) {
		result = "<p class='attacker'><strong> Congratulations " + attacker.name + " you defeat " + deffender.name;
	} else {
		if (attacker.attackPower > defender.defencePower) {
			var damage = attacker.attackPower - defender.defencePower;
			
			defender.health -= damage;
			if (defender.health < 1) {
				result = "<p class='attacker'><strong>" + attacker.name + " is attacking " + defender.name + " using his " + attacker.weapon.name + " and he hits him dealing "+ damage+" damage, and killing his Enemy</strong></p>" ;
				$(function() {
					$('#Atk').fadeOut(1500, function() {
						$('#logAttack').html("<p class='description'>Game Over</p>").fadeIn(2000);
					});

				});
			}else {
				result = "<p class='attacker'><strong>" + attacker.name + " is attacking " + defender.name + " using his " + attacker.weapon.name + " and he hits him dealing "+ damage+" damage</strong></p>";
			}
		} else {
			result = "<p class='attacker'><strong>" + attacker.name + " is attacking " + defender.name + " using his " + attacker.weapon.name + " but he blocked his attack</strong></p>";
		}
	}
	
	return result;
};


//Show the rounds of battle
var rounds = function() {
	$(function() {
		var PInit = initiative(player);
		var MInit = initiative(monster);



		$('#logAttack').fadeIn(100);
		$("<p class='description'>lets roll the initiative</p>").hide().appendTo('#logAttack').fadeIn(2000);
		$("<p class='description'> The Hero Initiative is: "+PInit+"</p>").hide().appendTo('#logAttack').fadeIn(2000);
		$("<p class='description'> The Monster Initiative is: "+MInit+"</p>").appendTo('#logAttack').fadeIn(2000);
		if (PInit > MInit) {
			EntityStart = "Hero";
			attacker=player;
			defender=monster;
		} else if(PInit < MInit) {
			EntityStart = "Monster";
			attacker=monster;
			defender=player;
		} else {
			EntityStart = "Both";
		}
		if (EntityStart !== "Both") {
			$('#logAttack').append("<p class='description'>"+ EntityStart +" Starting the attack!!</p>");
			$('#Atk').fadeIn(5000)
			.click(function (){	
				$('#logAttack').html(Attack(attacker,defender)).append("<p class='description'>Now is the "+defender.name+"'s Turn to Attack!!</p>");
				var change = attacker;
				attacker = defender;
				defender = change;
				updateStats();
			});
		} else {
			$('#logAttack').html("<p class='description'>"+ EntityStart +" Starting the attack at the same time... lets re-roll!!</p>");
			setTimeout(rounds(),5000);
		}	
	});	
};


//when start the game, don't show this stuff
$(function() {
	$('#hero').hide();
	$('#monster').hide();
	$('#logAttack').hide();
	$('#Atk').hide();
	$('#Run').hide();
	$('#Src').hide();
});



function updateStats() {
	$(function() {
		$('#hero').fadeIn(2500);
		$('#hero').html('<p class="stats">Hero: '+ player.name + '<br /> HP: <strong>'+player.health+'</strong><br />Use: '+player.weapon.name+'<br /> Attack Power: '+ player.attackPower+'<br /> Defence Power: '+ player.defencePower+'</p>');
	});
	$(function() {
		$('#monster').fadeIn(2500);
		$('#monster').html('<p class="stats">Monster: '+monster.name+ '<br /> HP: <strong>'+monster.health+'</strong><br />Use: '+monster.weapon.name+'<br /> Attack Power: '+ monster.attackPower+'<br /> Defence Power: '+ monster.defencePower+'</p>');
	});
}

rounds();
//console.log(rollDice(20, 5));
//updateStats();