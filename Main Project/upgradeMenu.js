let coins = 10000;// Initial coin count and upgrade levels
let upgrades = {
    armor: 1,
    cannons: 1,
    speed: 1
};

// Cost per tier of upgrade
const upgradeCost = {
    armor: [200, 500, 1000, 2000, 4000, 8000],
    cannons: [150, 400, 700, 1500, 2200, 4000],
    speed: [150, 300, 600, 1000, 3000, 6000]
};

const tierNames = {
    armor: ["", "", "", "", "", ""],
    cannons: ["", "", "", "", "", ""],
    speed: ["", "", "", "", "", ""]
}

// Function to upgrade a specific attribute
function upgrade(attribute) {
    if (upgrades[attribute] < 6) { // Maximum tier is 4
        let cost = upgradeCost[attribute][upgrades[attribute] - 1];
        if (coins >= cost) {
            coins -= cost;
            upgrades[attribute]++;
            document.getElementById(attribute + 'Level').innerText = 'Tier: ' + upgrades[attribute];
            document.getElementById('coinCount').innerText = coins;
        } else {
            alert('Not enough coins!');
        }
    } else {
        alert(attribute.charAt(0).toUpperCase() + attribute.slice(1) + ' is already at maximum tier!');
    }
}
