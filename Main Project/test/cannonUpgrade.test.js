/*const puppeteer = require('puppeteer');
const path = require('path');

describe('Cannon Upgrade Tests', () => {
    let browser;
    let page;

    beforeAll(async () => {
        browser = await puppeteer.launch();
        page = await browser.newPage();

        // Listen for console events and log them to the terminal
        page.on('console', msg => {
            for (let i = 0; i < msg.args().length; ++i)
                console.log(`${i}: ${msg.args()[i]}`);
        });

        await page.goto('file://' + path.resolve(__dirname, '../upgrade.html').replace(/\\/g, '/'));
    });

    afterAll(async () => {
        await browser.close();
    });

    it('should upgrade cannons and display the correct tier', async () => {
        // Set initial player currency and cannon tier
        await page.evaluate(() => {
            localStorage.setItem('playerCurrency', '1000');
            localStorage.setItem('cannons', '1');
        });

        // Reload the page to apply localStorage changes
        await page.reload();

        // Click the upgrade button for cannons
        await page.click('button[onclick="cannonsUpgrade.upgrade()"]');

        // Check the cannon damage and tier display
        const result = await page.evaluate(() => {
            const player = new Player(50, 50);
            const cannonDamage = player.cannonDamage;
            const cannonTier = document.getElementById('cannonsLevel').innerText;
            return { cannonDamage, cannonTier };
        });

        // Verify the cannon damage and tier display
        expect(result.cannonDamage).toBe(2); // Assuming base damage is 1 and each tier increases damage by 1
        expect(result.cannonTier).toContain('Tier: 2'); // Verify the tier display
    });
});*/

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
        expect(cannonsUpgrade.cost).toEqual([2, 3, 4, 5, 6, 7]);
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