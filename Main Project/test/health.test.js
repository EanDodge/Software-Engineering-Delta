const puppeteer = require('puppeteer');
const path = require('path');

describe('Player Health Collision Tests', () => {
    let browser;
    let page;

    beforeAll(async () => {
        browser = await puppeteer.launch();
        page = await browser.newPage();

        // Listen for console events and log them to the terminal
        page.on('console', msg => {
            // for (let i = 0; i < msg.args().length; ++i)
                //console.log(`${i}: ${msg.args()[i]}`);
        });
    });

    afterAll(async () => {
        await browser.close();
    });

    test('Player health does not decrease if collision cooldown is active', async () => {
        await page.goto('file://' + path.resolve(__dirname, '../index.html').replace(/\\/g, '/'));

        // Set initial player health and simulate collision with cooldown
        const playerHealth = await page.evaluate(() => {
            localStorage.setItem('playerCurrency', '100');
            const player = new Player(50, 50);
            player.health = 10;
            player.lastCollisionTime = Date.now();
            const enemies = [{ x: 50, y: 50, size: 10 }];
            player.checkCollisionEnemies(enemies);
            //console.log("Player health with cooldown: " + player.health);
            return player.health;
        });

        expect(playerHealth).toBe(10);
    });

    // test('Player navigates to gameover.html when health reaches 0', async () => {
    //     await page.goto('file://' + path.resolve(__dirname, '../index.html').replace(/\\/g, '/'));

    //     // Set player health to 1 and simulate collision to trigger game over
    //     await page.evaluate(() => {
    //         localStorage.setItem('playerCurrency', '100');
    //         const player = new Player(50, 50);
    //         player.health = 1;
    //         const enemies = [{ x: 50, y: 50, size: 10 }];
    //         player.checkCollisionEnemies(enemies);
    //         // console.log("Player health: " + player.health);
    //     });

    //     // Wait for navigation to gameover.html
    //     await page.waitForNavigation();

    //     const url = await page.url();
    //     const expectedUrl = 'file:///' + path.resolve(__dirname, '../gameover.html').replace(/\\/g, '/');
    //     expect(decodeURIComponent(url)).toBe(decodeURIComponent(expectedUrl));
    // });
});

describe('Player Health Bar Tests', () => {
    let browser;
    let page;

    beforeAll(async () => {
        browser = await puppeteer.launch();
        page = await browser.newPage();

        // Listen for console events and log them to the terminal
        page.on('console', msg => {
            // for (let i = 0; i < msg.args().length; ++i)
                // console.log(`${i}: ${msg.args()[i]}`);
        });
    });

    afterAll(async () => {
        await browser.close();
    });

    test('Health bar updates correctly when player takes damage', async () => {
        await page.goto('file://' + path.resolve(__dirname, '../index.html').replace(/\\/g, '/'));

        // Set initial player health and simulate taking damage
        const healthBarWidth = await page.evaluate(() => {
            const player = new Player(50, 50);
            player.health = 10;
            player.updateHealthBar(); // Ensure the health bar is initially full

            player.takeDamage(3); // Player takes 3 damage
            return document.getElementById('health-bar').style.width;
        });

        expect(healthBarWidth).toBe('70%'); // Health bar should be 70% full
    });

    test('Health bar is empty when player health is 0', async () => {
        await page.goto('file://' + path.resolve(__dirname, '../index.html').replace(/\\/g, '/'));

        // Set player health to 0 and update health bar
        const healthBarWidth = await page.evaluate(() => {
            const player = new Player(50, 50);
            player.health = 0;
            player.updateHealthBar();
            return document.getElementById('health-bar').style.width;
        });

        expect(healthBarWidth).toBe('0%'); // Health bar should be empty
    });

    test('Health bar is full when player health is 10', async () => {
        await page.goto('file://' + path.resolve(__dirname, '../index.html').replace(/\\/g, '/'));

        // Set player health to 10 and update health bar
        const healthBarWidth = await page.evaluate(() => {
            const player = new Player(50, 50);
            player.health = 10;
            player.updateHealthBar();
            return document.getElementById('health-bar').style.width;
        });

        expect(healthBarWidth).toBe('100%'); // Health bar should be full
    });
});