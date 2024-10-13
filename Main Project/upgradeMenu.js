let coins = 100;// Initial coin count and upgrade levels

let upgrades = {
    armor: 1,
    cannons: 1,
    speed: parseInt(localStorage.getItem('speed')) || 1,
    AmmoCapacity: 1,
    Hints: 1
};

// Cost per tier of upgrade
const upgradeCost = {
    armor: [1, 2, 3, 4, 5, 6],
    cannons: [2, 3, 4, 5, 6, 7],
    speed: [3, 4, 5, 6, 7, 8],
    AmmoCapacity: [4, 5, 6, 7, 8, 9],
    Hints: [5, 6, 7, 8, 9, 10]
};

const tierNames = {
    armor: ["a", "b", "c", "d", "e", "f"],
    cannons: ["a", "b", "c", "d", "e", "f"],
    speed: ["a", "b", "c", "d", "e", "f"],
    AmmoCapacity: ["a", "b", "c", "d", "e", "f"],
    Hints: ["a", "b", "c", "d", "e", "f"]
}

// Function to upgrade a specific attribute
function upgrade(attribute) {
    if (upgrades[attribute] < 6) { // Maximum tier is 4
        let cost = upgradeCost[attribute][upgrades[attribute] - 1] ;
		console.log(cost);
        if (player.buyUpgrade(cost)) {
            upgrades[attribute]++;
            localStorage.setItem(attribute, upgrades[attribute]);
            player.updateCoinCount();
            let tier = upgrades[attribute];
            document.getElementById(attribute + 'Level').innerText = 'Tier: ' + tier + ' - ' + tierNames[attribute][tier - 1];
			//document.getElementById('coinCount').innerText = coins;
        } else {
            alert('Not enough coins!');
        }
    } else {
        alert(attribute.charAt(0).toUpperCase() + attribute.slice(1) + ' is already at maximum tier!');
    }
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
