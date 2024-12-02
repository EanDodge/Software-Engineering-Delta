class Upgrade {
    constructor(name, cost, tierNames) {
        this.name = name;
        this.cost = cost;
        this.tierNames = tierNames;
        this.value = parseInt(localStorage.getItem(name)) || 1;
    }

    upgrade() {
        if (this.value < 6) { // Maximum tier is 6
            let cost = this.cost[this.value - 1];
            console.log(cost);
            if (pirate.buyUpgrade(cost)) {
                this.value++;
                localStorage.setItem(this.name, this.value);
                pirate.updateCoinCount();
                let tier = this.value;
                document.getElementById(this.name + 'Level').innerText = 'Tier: ' + tier + ' - ' + this.tierNames[tier - 1];
                this.applyUpgradeEffect(tier);
            } else {
                alert('Not enough coins!');
            }
        } else {
            alert(this.name.charAt(0).toUpperCase() + this.name.slice(1) + ' is already at maximum tier!');
        }
    }

    applyUpgradeEffect(tier) {
        // This method can be overridden by subclasses to apply specific effects
    }
}

class ArmorUpgrade extends Upgrade {
    constructor() {
        super('armor', [1, 2, 3, 4, 5, 6], ["a", "b", "c", "d", "e", "f"]);
    }

    applyUpgradeEffect(tier) {
        // Specific effect for armor upgrade
        console.log('Armor upgraded to tier:', tier);
    }
}

class CannonsUpgrade extends Upgrade {
    constructor() {
        super('cannons', [2, 3, 4, 5, 6, 7], ["a", "b", "c", "d", "e", "f"]);
    }

    applyUpgradeEffect(tier) {
        // Specific effect for cannons upgrade
		console.log('Cannons upgraded to tier:', tier);
        this.increaseProjectileDamage(tier);
		console.log('Cannon damage:', tier);
    }

	increaseProjectileDamage(tier) {
		// Assuming base damage is 1 and each tier increases damage by 1
		const baseDamage = 1;
		const damageIncreasePerTier = 1;
		const newDamage = baseDamage + (tier - 1) * damageIncreasePerTier;
		
		// Update the projectile damage
		//player.cannonDamage = newDamage;
		localStorage.setItem('cannons', newDamage); // Save to localStorage
		console.log('New projectile damage:', newDamage);
	}
}

class AmmoCapacityUpgrade extends Upgrade {
    constructor() {
        super('ammo', [4, 5, 6, 7, 8, 9], ["a", "b", "c", "d", "e", "f"]);
    }

    applyUpgradeEffect(tier) {
        // Specific effect for ammo capacity upgrade
        console.log('Ammo capacity upgraded to tier:', tier);
    }
}

class SpeedUpgrade extends Upgrade {
    constructor() {
        super('speed', [3, 4, 5, 6, 7, 8], ["a", "b", "c", "d", "e", "f"]);
    }

    applyUpgradeEffect(tier) {
        // Specific effect for speed upgrade
        console.log('Speed upgraded to tier:', tier);
         localStorage.setItem('speed', tier)
    }
}



class ErrorUpgrade extends Upgrade{
    constructor() {
        super('error', [25, 50, 100], ["a", "b", "c"]);
    }

    upgrade() {
        if (this.value < 3) { // Maximum tier is 3
            let cost = this.cost[this.value - 1];
            console.log(cost);
            if (pirate.buyUpgrade(cost)) {
                this.value++;
                localStorage.setItem(this.name, this.value);
                pirate.updateCoinCount();
                let tier = this.value;
                document.getElementById(this.name + 'Level').innerText = 'Tier: ' + tier + ' - ' + this.tierNames[tier - 1];
                this.applyUpgradeEffect(tier);
            } else {
                alert('Not enough coins!');
            }
        } else {
            alert(this.name.charAt(0).toUpperCase() + this.name.slice(1) + ' is already at maximum tier!');
        }
    }

    applyUpgradeEffect(tier) {
        // Specific effect for hints upgrade
        console.log('Sudoku Errors increased to tier:', tier);
        let currentError = parseInt(localStorage.getItem('errorNum')) || 3;
        localStorage.setItem('errorNum', ++currentError);
class HintsUpgrade extends Upgrade {
    constructor() {
        super('hints', [], []); // No tier costs or names needed
        this.coinCost = 10; // Cost per hint
        this.hints = parseInt(localStorage.getItem('hints')) || 0; // Initialize hint count
    }

    upgrade() {
        const coins = pirate.currency; // Assuming pirate manages coins
        if (coins >= this.coinCost) {
            pirate.buyUpgrade(this.coinCost); // Deduct the coin cost
            this.hints++;
            localStorage.setItem('hints', this.hints); // Save updated hint count
            this.updateHintDisplay();
            pirate.updateCoinCount(); // Update displayed coins
        } else {
            alert('Not enough coins!');
        }
    }

    updateHintDisplay() {
        document.getElementById(this.name + 'Level').innerText = `Current Amount of Hints: ${this.hints}`;
    }

    applyUpgradeEffect() {
        // Update display after a purchase
        this.updateHintDisplay();
    }
}

/* class hintPurchase extends Upgrade{
    constructor() {
        super('error', [25, 50, 100], ["a", "b", "c"]);
    }

    upgrade() {
        if (this.value < 3) { // Maximum tier is 3
            let cost = this.cost[this.value - 1];
            console.log(cost);
            if (pirate.buyUpgrade(cost)) {
                this.value++;
                localStorage.setItem(this.name, this.value);
                pirate.updateCoinCount();
                let tier = this.value;
                document.getElementById(this.name + 'Level').innerText = 'Tier: ' + tier + ' - ' + this.tierNames[tier - 1];
                this.applyUpgradeEffect(tier);
            } else {
                alert('Not enough coins!');
            }
        } else {
            alert(this.name.charAt(0).toUpperCase() + this.name.slice(1) + ' is already at maximum tier!');
        }
    }

    applyUpgradeEffect(tier) {
        // Specific effect for hints upgrade
        console.log('Sudoku Errors increased to tier:', tier);
        let currentError = parseInt(localStorage.getItem('errorNum')) || 3;
        localStorage.setItem('errorNum', ++currentError);
    }
} */


// Create instances for each upgrade type
const armorUpgrade = new ArmorUpgrade();
const cannonsUpgrade = new CannonsUpgrade();
const speedUpgrade = new SpeedUpgrade();
const ammoCapacityUpgrade = new AmmoCapacityUpgrade();
const errorUpgrade = new ErrorUpgrade();


// Function to initialize upgrade values from localStorage
function initializeUpgrades() {
    const upgrades = [armorUpgrade, cannonsUpgrade, speedUpgrade, ammoCapacityUpgrade, errorUpgrade];
    upgrades.forEach(upgrade => {
        let tier = upgrade.value;
        document.getElementById(upgrade.name + 'Level').innerText = 'Tier: ' + tier + ' - ' + upgrade.tierNames[tier - 1];
    });
}

function defeatSeaMonster() {
    console.log('defeatSeaMonster called');
    coins += 5;
    console.log('New coin count:', coins);
    document.getElementById('coinCount').innerText = coins;
}

// Function to handle completing a level
function completeLevel() {
    coins += 999999;
    document.getElementById('coinCount').innerText = coins;
}


document.addEventListener('DOMContentLoaded', () => {
    initializeUpgrades();
    hintsUpgrade.updateHintDisplay(); // Initialize hints display separately
});