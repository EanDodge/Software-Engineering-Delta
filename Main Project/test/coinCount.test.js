const puppeteer = require('puppeteer');

describe('Coin Count Display Test', () => {
    let browser;
    let page;

    beforeAll(async () => {
        browser = await puppeteer.launch();
        page = await browser.newPage();
    });

    afterAll(async () => {
        await browser.close();
    });

    test('Coin count in index.html matches player currency', async () => {
        await page.goto('file://' + __dirname + '/../index.html');
        const coinCount = await page.$eval('#coinCount', el => el.innerText);
        const playerCurrency = await page.evaluate(() => {
            return localStorage.getItem('playerCurrency');
        });
        expect(coinCount).toBe(playerCurrency);
    });

    test('Coin count in upgrade.html matches player currency', async () => {
        await page.goto('file://' + __dirname + '/../upgrade.html');
        const coinCount = await page.$eval('#coinCount', el => el.innerText);
        const playerCurrency = await page.evaluate(() => {
            return localStorage.getItem('playerCurrency');
        });
        expect(coinCount).toBe(playerCurrency);
    });
});