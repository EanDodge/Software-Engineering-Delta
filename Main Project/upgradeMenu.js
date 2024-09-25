let coins = 0;// Initial coin count and upgrade levels
let upgrades = {
    armor: 1,
    cannons: 1,
    speed: 1,
    AmmoCapacity: 1,
    Hints: 1
};

// Cost per tier of upgrade
const upgradeCost = {
    armor: [0, 0, 0, 0, 0, 0],
    cannons: [0, 0, 0, 0, 0, 0],
    speed: [0, 0, 0, 0, 0, 0],
    AmmoCapacity: [0, 0, 0, 0, 0, 0],
    Hints: [0, 0, 0, 0, 0, 0]
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
        let cost = upgradeCost[attribute][upgrades[attribute] - 1];
        if (coins >= cost) {
            coins -= cost;
            upgrades[attribute]++;
            let tier = upgrades[attribute];
            document.getElementById(attribute + 'Level').innerText = 'Tier: ' + tier + ' - ' + tierNames[attribute][tier - 1];
            document.getElementById('coinCount').innerText = coins;
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
