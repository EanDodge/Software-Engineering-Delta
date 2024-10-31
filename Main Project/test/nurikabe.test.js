const puppeteer = require('puppeteer');

jest.setTimeout(60000); // 60 seconds

describe('Nurikabe Puzzle Tests', () => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: false, // Set to true if you want it headless
      slowMo: 50 // Slows down Puppeteer actions for easier debugging
    });
    page = await browser.newPage();

    //Open nurikabe.hmtl in live server before doing this
    await page.goto('https://sopatz.github.io/SoftwareEngineering_PersonalFork/Main%20Project/nurikabe.html'); //run live server using default port value for VSC Live Server (until code is hosted, this is the only way I can figure out to test this sh*t with puppeteer)

    //Log console messages
    // page.on('console', msg => {
    //     for (let i = 0; i < msg.args().length; ++i)
    //         console.log(`${i}: ${msg.args()[i]}`);
    // });
  });

  beforeEach(async () => {
    // Ensure we navigate to the correct page before each test
    const currentUrl = page.url();
    if (currentUrl !== 'https://sopatz.github.io/SoftwareEngineering_PersonalFork/Main%20Project/nurikabe.html') {
      await page.goto('https://sopatz.github.io/SoftwareEngineering_PersonalFork/Main%20Project/nurikabe.html');
    }
  });

  afterAll(async () => {
    await browser.close();
  });

  // Helper function to click a button based on its inner text
  async function clickButtonByText(page, buttonText) {
    await page.evaluate((buttonText) => {
      const buttons = [...document.querySelectorAll('button')];
      const button = buttons.find(b => b.textContent.trim() === buttonText);
      if (button) {
        button.click();
      } else {
        throw new Error(`Button with text "${buttonText}" not found`);
      }
    }, buttonText);
  }

  test('should load the page', async () => {
    const title = await page.title();
    expect(title).toBe('Nurikabe');
  });

  test('should have a canvas element', async () => {
    // Wait for the canvas to be created
    await page.waitForSelector('canvas');

    // Check if the canvas exists
    const canvasExists = await page.$('canvas') !== null;
    expect(canvasExists).toBe(true);
  });

  test('should initialize the correct number of squares', async () => {
    // Reload the page to reset the puzzle state
    await page.reload();

    // Evaluate the page content to get the total number of squares initialized
    const numSquares = await page.evaluate(() => rows * cols);

    // Ensure that the expected number of squares is created
    expect(numSquares).toBe(81);
  });
  
  test('should display and close the rules pop-up', async () => {
    // Trigger the rules popup logic manually
    await page.evaluate(() => {
      showPopup();
    });
  
    // Check if the popup is visible after the manual trigger
    isPopupVisible = await page.evaluate(() => {
      const popup = document.getElementById('rulesPopup');
      return window.getComputedStyle(popup).display !== 'none';
    });
  
    expect(isPopupVisible).toBe(true);

    // Now, manually trigger the logic to close the popup
    await page.evaluate(() => {
        hidePopup();
    });
    
    // Check if the popup is hidden after the manual trigger
    isPopupVisible = await page.evaluate(() => {
      const popup = document.getElementById('rulesPopup'); //ID of the rules popup in js file
      return window.getComputedStyle(popup).display !== 'none';
    });
    
    expect(isPopupVisible).toBe(false); // Expect the popup to be hidden
  });

  test('should reset puzzle when Restart button is clicked', async () => {
    await clickButtonByText(page, 'Restart'); // Click the Restart button
    const colorState = await page.evaluate(() => colorState);
    const allBlue = colorState.every(state => state === 0); // Check if all squares are blue (reset state)
    expect(allBlue).toBe(true);
  });

  test('should solve the puzzle when Solve button is clicked', async () => {
    await clickButtonByText(page, 'Solve'); // Click the Solve button
    //console.log("Solve button clicked");
  
    // Manually trigger the solve logic (for debugging)
    await page.evaluate(() => {
      if (typeof solve === 'function') {
        solve(); // Manually invoke the solve function
      }
    });
  
    const currentState = await page.evaluate(() => colorState);
    const solutionState = await page.evaluate(() => solution_colors);
  
    //Console logs for solve debugging:
    //console.log('Current State after manual Solve:', currentState);
    //console.log('Solution State:', solutionState);
  
    expect(currentState).toEqual(solutionState); // Compare current state with the solution state
  });

  //Testing completion features manually:
  // test for unclickable squares after puzzle completion: complete a nurikabe (not using the solve button) and then try to click one of the green squares
  // test for completion text: solve nurikabe using solve button (and once without too) and see if completion text pops up on the screen
  
});
