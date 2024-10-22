const puppeteer = require('puppeteer');
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
});