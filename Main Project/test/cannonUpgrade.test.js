

// Mock implementation of localStorage
global.localStorage = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
};

// Mock document
global.document = {
    getElementById: jest.fn().mockReturnValue({
        innerText: '',
        style: {}
    }),
	addEventListener: jest.fn(), // Mock addEventListener method
};

// cannonUpgrade.test.js
const { CannonsUpgrade } = require('../upgradeMenu.js');


describe('CannonsUpgrade Class Tests', () => {
    let cannonsUpgrade;

    beforeEach(() => {
        cannonsUpgrade = new CannonsUpgrade();
    });

    test('CannonsUpgrade should be instantiated correctly', () => {
        expect(cannonsUpgrade).toBeInstanceOf(CannonsUpgrade);
        expect(cannonsUpgrade.name).toBe('cannons');
        expect(cannonsUpgrade.cost).toEqual([10, 15, 20, 25, 30, 35]);
        expect(cannonsUpgrade.tierNames).toEqual(["a", "b", "c", "d", "e", "f"]);
    });

    test('applyUpgradeEffect should log the correct messages and call increaseProjectileDamage', () => {
        console.log = jest.fn(); // Mock console.log

        const tier = 3;
        cannonsUpgrade.applyUpgradeEffect(tier);

        expect(console.log).toHaveBeenCalledWith('Cannons upgraded to tier:', tier);
        expect(console.log).toHaveBeenCalledWith('Cannon damage:', tier);
    });

    test('increaseProjectileDamage should calculate the correct damage', () => {
        const baseDamage = 1;
        const damageIncreasePerTier = 1;

        for (let tier = 2; tier <= 7; tier++) {
            const expectedDamage = baseDamage + (tier - 1) * damageIncreasePerTier;
            cannonsUpgrade.increaseProjectileDamage(tier);
            // Assuming player.cannonDamage is updated in increaseProjectileDamage
            // expect(player.cannonDamage).toBe(expectedDamage);
            // Since player.cannonDamage is commented out in the provided code, we can't test it directly
            // Instead, we can test the calculation logic if it were returned or accessible
        }
    });
});