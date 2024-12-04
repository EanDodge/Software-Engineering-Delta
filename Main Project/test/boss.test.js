const  Boss  = require('../boss');
const { Player } = require('../player.js');
const  Projectile  = require('../projectile');

// Mock localStorage
global.localStorage = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn()
};

// Mock document
global.document = {
    getElementById: jest.fn().mockReturnValue({
        innerText: '',
        style: {}
    })
};

// Mock implementation of loadImage
global.loadImage = jest.fn().mockImplementation((path) => {
    return {
        path: path,
        width: 100,
        height: 100,
    };
});

describe('Boss Class Tests', () => {
    let boss;
    let player;
    let projectiles;
    let mockHealthBarContainer;
    let mockHealthBar;
    let mockDefeatMessage;

    beforeEach(() => {
        mockHealthBarContainer = { style: { display: 'none' } };
        mockHealthBar = { style: { width: '100%' } };
        mockDefeatMessage = { classList: { remove: jest.fn(), add: jest.fn() } };

        boss = new Boss(0, 0, 100, mockHealthBarContainer, mockHealthBar, mockDefeatMessage);
        player = new Player(0, 0);
        player.currency = 0;
        projectiles = [new Projectile(0, 0, 0, 1, 0, 0, '../assets/cannon.png')];
    });

    test('Projectile collision with boss', () => {
        boss.checkCollisionProjectiles(projectiles, player);
        expect(boss.health).toBe(99);
        expect(projectiles.length).toBe(0);
    });

    test('Health bar updates correctly', () => {
        boss.takeDamage(10, player);
        expect(boss.health).toBe(90);
        expect(mockHealthBar.style.width).toBe('90%');
    });

    test('Boss death handling', () => {
        boss.takeDamage(100, player);
        expect(boss.health).toBe(0);
        expect(boss.isDead).toBe(true);
        setTimeout(() => {
            expect(boss.x).toBe(-9999);
            expect(boss.y).toBe(-9999);
            expect(mockDefeatMessage.classList.remove).toHaveBeenCalledWith('hidden');
        }, 1000);
    });

    /*test('Player receives currency on boss death', () => {
        boss.takeDamage(100, player);
        setTimeout(() => {
            expect(player.currency).toBe(50);
        }, 1000);
    });*/
});