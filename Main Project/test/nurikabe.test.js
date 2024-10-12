// Run this in terminal to run tests (need node.js and npm installed)
// npm init -y # Initialize npm
// npm install jest puppeteer --save-dev # install required dependencies
// npm test

const puppeteer = require('puppeteer');

describe('p5.js sketch tests', () => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await puppeteer.launch();
    page = await browser.newPage();

    // Listen for browser console messages
    page.on('console', msg => console.log('PAGE LOG:', msg.text()));

    // Load p5.js nurikabe
    await page.goto('file://' + __dirname + '/../nurikabe.html');
  });

  afterAll(async () => {
    await browser.close();
  });

  test('should have a canvas element', async () => {
    // Wait for the canvas to be created
    await page.waitForSelector('canvas');

    // Check if the canvas exists
    const canvasExists = await page.$('canvas') !== null;
    expect(canvasExists).toBe(true);
  });

  it('should initialize the correct number of squares', async () => {
    // Reload the page to reset the puzzle state
    await page.reload();

    // Evaluate the page content to get the total number of squares initialized
    const numSquares = await page.evaluate(() => rows * cols);

    // Ensure that the expected number of squares is created
    expect(numSquares).toBe(81);
  });


  test('should change color on square click', async () => {
    await page.reload(); // Reload to ensure a fresh start
    const initialColor = await page.evaluate(() => {
      let square = document.querySelector('canvas');
      let ctx = square.getContext('2d');
      return ctx.getImageData(10, 10, 1, 1).data.join(','); // Get color of a pixel
    });

    await page.click('canvas', { button: 'left' }); // Click on canvas to change color

    const newColor = await page.evaluate(() => {
      let square = document.querySelector('canvas');
      let ctx = square.getContext('2d');
      return ctx.getImageData(10, 10, 1, 1).data.join(','); // Get new color of pixel
    });

    expect(initialColor).not.toBe(newColor); // The color should change
  });

  test('should not change color of unclickable squares', async () => {
    await page.reload();

    const unclickableIndex = 36; // Example index
    // Get xpos and ypos inside the browser context
    const { xpos, ypos } = await page.evaluate(() => {
      return { xpos, ypos }; // Retrieve xpos and ypos from the sketch
    });

    // Click on the canvas where the unclickable square is located
    await page.mouse.click(xpos[unclickableIndex], ypos[unclickableIndex]);

    // Check if the square's color state remains unchanged
    const unchanged = await page.evaluate((index) => {
      return colorState[index] === 0; // The color should still be the default one
    }, unclickableIndex);

    expect(unchanged).toBe(true);
  });

  test('should display puzzle solved message/visual cue', async () => {
    await page.reload();

    // Simulate solving the puzzle by setting the color states directly
    await page.evaluate(() => {
      // Force the colorState to match the solution (mocking a correct solution)
      for (let i = 0; i < puzzles[puzzle_index].solution_colors.length; i++) {
        colorState[i] = puzzles[puzzle_index].solution_colors[i];
      }
    });

    // Introduce a delay to give the sketch time to render the "solved" state
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Check for the "solved" indicator (a green square at the center of the canvas for now)
    const isSolved = await page.evaluate(() => {
      let canvas = document.querySelector('canvas');
      let ctx = canvas.getContext('2d');
      // Check for green color in the middle of the canvas
      return ctx.getImageData(canvas.width / 2, canvas.height / 2, 1, 1).data.join(',') === '0,250,200,255';
    });

    expect(isSolved).toBe(true);
  });

  it('should display a random puzzle on load', async () => {
    // Reload the page to reset and load a new random puzzle
    await page.reload();
  
    // Get the puzzle index chosen randomly in the sketch
    const chosenPuzzleIndex = await page.evaluate(() => puzzle_index);
  
    // Check that the randomly selected puzzle index is within the valid range
    const numPuzzles = await page.evaluate(() => puzzles.length);
    expect(chosenPuzzleIndex).toBeGreaterThanOrEqual(0);
    expect(chosenPuzzleIndex).toBeLessThan(numPuzzles);
  
    // Verify that at least one "unclickable" numbered square is present on the canvas
    const hasUnclickableSquares = await page.evaluate(() => {
      return puzzles[puzzle_index].cantClick.size > 0;
    });
    expect(hasUnclickableSquares).toBe(true);
  });

});
