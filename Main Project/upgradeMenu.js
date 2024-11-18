let coins = 100; // Initial coin count

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
            if (player.buyUpgrade(cost)) {
                this.value++;
                localStorage.setItem(this.name, this.value);
                player.updateCoinCount();
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
		console.log('Cannon damage:', player.cannonDamage);
    }

	increaseProjectileDamage(tier) {
		// Assuming base damage is 1 and each tier increases damage by 1
		const baseDamage = 1;
		const damageIncreasePerTier = 1;
		const newDamage = baseDamage + (tier - 1) * damageIncreasePerTier;
		
		// Update the projectile damage
		player.cannonDamage = newDamage;
		localStorage.setItem('cannonDamage', newDamage); // Save to localStorage
		console.log('New projectile damage:', newDamage);
	}
}

class AmmoCapacityUpgrade extends Upgrade {
    constructor() {
        super('AmmoCapacity', [4, 5, 6, 7, 8, 9], ["a", "b", "c", "d", "e", "f"]);
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
    }
}



class HintsUpgrade extends Upgrade {
    constructor() {
        super('Hints', [5, 6, 7, 8, 9, 10], ["a", "b", "c", "d", "e", "f"]);
    }

    applyUpgradeEffect(tier) {
        // Specific effect for hints upgrade
        console.log('Hints upgraded to tier:', tier);
    }
}

// Create instances for each upgrade type
const armorUpgrade = new ArmorUpgrade();
const cannonsUpgrade = new CannonsUpgrade();
const speedUpgrade = new SpeedUpgrade();
const ammoCapacityUpgrade = new AmmoCapacityUpgrade();
const hintsUpgrade = new HintsUpgrade();


// Function to initialize upgrade values from localStorage
function initializeUpgrades() {
    const upgrades = [armorUpgrade, cannonsUpgrade, speedUpgrade, ammoCapacityUpgrade, hintsUpgrade];
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