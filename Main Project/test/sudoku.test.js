// node test for sudoku elements
const puppeteer = require('puppeteer');

describe('Sudoku Test', () => {
    let browser;
    let page;

    // Sudoku for testing
    //let test_sudoku = sudoku_samples[0];
    //let test_sudoku_solution = sudoku_answers[0];

    beforeAll(async () => {
        browser = await puppeteer.launch({
            headless: false,
            slowMo: 209,
        });
        page = await browser.newPage();
        await page.goto('http://cassini.cs.kent.edu:9024/Sudoku/sudoku.html');
    });

    afterAll(async () => {
        await browser.close();
    });

    // Fails if canvas obj is not deployed
    test('Testing that canvas is deployed.', async() => {
        await page.waitForSelector('canvas');
        const canvasIsDeployed = await page.$('canvas') !== null;
        expect(canvasIsDeployed).toBe(true);
    });

    // Fails if grid is not properly sized: should be 81 cells.
    test('Testing that Sudoku grid is properly sized.', async() =>{
        await page.reload();
        const gridSize = await page.evaluate(() => rows*cols);
        expect(gridSize).toBe(81);
    });

    // Fails if a pattern is not properly read into the cells.
    test('Testing that a Sudoku pattern is read correctly.', async() =>{
        await page.reload();
        await page.waitForSelector('canvas');
        // Gets needed arrays/vars
        const {sudoku, numberState, gridSize} = await page.evaluate(() => {
            gridSize = rows*cols;
            return {sudoku, numberState, gridSize}; 
        });
        // Parsing for correct type comparisons
        for (i = 0; i < gridSize; ++i)  expect(parseInt(sudoku[i])).toBe(parseInt(numberState[i]));
    });

    // Fails if entering number into grid results in incorrect behavior
    test('Testing that Sudoku grid is able to take in numbers.', async () => {
        await page.reload();
        await page.waitForSelector('canvas');
        const {startupDisplay, helpDisplay} = await page.evaluate(() => {
            return {startupDisplay, helpDisplay};
        });
        await page.evaluate(() => {
            startupDisplay = false;
            helpDisplay = false;
        });
        // Gets:
        // Coords Array of Cells
        // Editability Array
        // Position of Canvas
        // Size of grid, number of cells
        const {xpos, ypos, editable, canvasPos, gridSize} = await page.evaluate(() => {
           const canvasPos = { x: canvas.position().x, y: canvas.position().y };
           gridSize = rows*cols;
           return {xpos, ypos, editable, canvasPos, gridSize};
        });
        // Finds first editable cell in Sudoku
        let indexForTesting = -1;
        for (i = 0; i < gridSize; i++) { if (editable[i]) { indexForTesting = i; break; }}
        // Adjust the click position relative to the canvas position
        // Test clicks off canvas otherwise
        const clickX = xpos[indexForTesting] + canvasPos.x;
        const clickY = ypos[indexForTesting] + canvasPos.y;
        // Click the cell at adjusted position
        await page.mouse.click(clickX, clickY);
        // Enters the digit 4
        await page.keyboard.press('4');
        // Retrieves State of Numbers Array after entering has been done
        const numberState = await page.evaluate(() => numberState);
        // Parses to correct type comparison
        expect(parseInt(numberState[indexForTesting])).toBe(4);
     });

    // Fails if Fixed Number is given a new value.
    test('Testing that the Fixed Cells are ineditable.', async() =>{
        await page.reload();
        await page.waitForSelector('canvas');
        // Gets:
        // Coords Array of Cells
        // Editability Array
        // Position of Canvas
        // Size of grid, number of cells
        const {xpos, ypos, editable, canvasPos, gridSize} = await page.evaluate(() => {
           const canvasPos = { x: canvas.position().x, y: canvas.position().y };
           gridSize = rows*cols;
           return {xpos, ypos, editable, canvasPos, gridSize};
        });
        // Finds first ineditable cell in Sudoku
        let indexForTesting = -1;
        for (i = 0; i < gridSize; i++) { if (!editable[i]) { indexForTesting = i; break; }}
        // Retrieves State of Numbers Array before attempt to edit
        const numberStateBefore = await page.evaluate(() => numberState);
        // Adjust the click position relative to the canvas position
        // Test clicks off canvas otherwise
        const clickX = xpos[indexForTesting] + canvasPos.x;
        const clickY = ypos[indexForTesting] + canvasPos.y;
        // Click the cell at adjusted position
        await page.mouse.click(clickX, clickY);
        // Enters the digit 4
        await page.keyboard.press('4');
        // Retrieves State of Numbers Array after attempt to edit
        const numberStateAfter = await page.evaluate(() => numberState);
        // Parses to correct type comparison
        expect(parseInt(numberStateBefore[indexForTesting])).toBe(numberStateAfter[indexForTesting]);
    });

    // Testing for acknowledgement of finished game is correct.
    test('Testing game completion is acknowledged.', async() =>{
        await page.reload();
        await page.waitForSelector('canvas');
        // Gets needed arrays/vars
        await page.evaluate(() => autoComplete());
        await page.evaluate(() => check_sudoku());
        const gameComplete = await page.evaluate(() => incompletedGame);
        // Parsing for correct type comparisons
        expect(gameComplete).toBe(true);
    });
});