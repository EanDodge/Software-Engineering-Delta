const Player = require('../player');
const GameObject = require('../gameObject');
const Enemy = require('../enemy');
const puppeteer = require('puppeteer');

describe('player.js class tests', () => {
    let player;
    let browser;
    let page;

    beforeAll(async () => {
        browser = await puppeteer.launch();
        page = await browser.newPage();
        await page.goto('file://' + __dirname + '/../index.html');
    });

    afterAll(async () => {
        await browser.close();
    });

    
    beforeAll(() => {
        //Mock localStorage to allow player tests to run
        global.localStorage = {
            getItem: jest.fn().mockReturnValue('100'),
            setItem: jest.fn(),
        };

        //Mock sin and cos functions for jest to call
        global.sin = Math.sin;
        global.cos = Math.cos;

        //Mock map size
        global.mapXSize = 1000;
        global.mapYSize = 800;

        //lets player tests to get GameObject class
        global.GameObject = GameObject;

        //lets player tests use Enemy class
        global.Enemy = Enemy;

        
    });
    
    beforeEach(() => {
        // player = new Player();
    });

    test('Testing constructor, player should exist', () => {
       
        let player = new Player(100, 50);
		expect(player.testConstructor()).toBe("passed");
        expect(player.x).toBe(100);
        expect(player.y).toBe(50);
    });

     /*test('Testing movePlayer(), should return "passed"', () => {
         expect(player.testMovePlayer()).toBe("passed");
     });

     test('Testing checkCollisionIsland(), should return "passed"', () => {
         expect(player.testCheckCollisionIsland()).toBe("passed");
     });

	 test('Testing checkCollisionEnemies(), should return "passed"', () => {
         expect(player.testCheckCollisionEnemies()).toBe("passed");
     });*/
  });