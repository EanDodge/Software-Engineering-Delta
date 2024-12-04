const puppeteer = require('puppeteer');

jest.setTimeout(60000); // 60 seconds

describe('Nurikabe Puzzle Tests', () => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: true, // Use headless mode for CI environments like GitHub Actions
      args: ['--no-sandbox', '--disable-setuid-sandbox'], // Add these args to avoid permission issues in GitHub Actions
      slowMo: 50
    });
    page = await browser.newPage();

    await page.goto('http://cassini.cs.kent.edu/pirate/nurikabe/nurikabe.html'); //run live server using default port value for VSC Live Server (until code is hosted, this is the only way I can figure out to test this sh*t with puppeteer)

    //Log console messages
    // page.on('console', msg => {
    //     for (let i = 0; i < msg.args().length; ++i)
    //         console.log(`${i}: ${msg.args()[i]}`);
    // });
  });

  beforeEach(async () => {
    // Ensure we navigate to the correct page before each test
    const currentUrl = page.url();
    if (currentUrl !== 'http://cassini.cs.kent.edu/pirate/nurikabe/nurikabe.html') {
      await page.goto('http://cassini.cs.kent.edu/pirate/nurikabe/nurikabe.html');
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
  
  // test('should display and close the rules pop-up', async () => {
  //   // Ensure the pop-up is initially hidden
  //   const isPopupHiddenInitially = await page.evaluate(() => {
  //     const popup = document.querySelector('rulesPopup'); // Use the actual selector
  //     return popup && popup.style.display === 'none'; // Adjust based on actual hiding logic
  //   });
  //   expect(isPopupHiddenInitially).toBe(true);

  //   // Click the Rules button
  //   await page.click('rulesButton'); // Update with the actual selector for the "Rules" button

  //   // Wait for the pop-up to appear
  //   await page.waitForSelector('rulesPopup', { visible: true });

  //   // Ensure the pop-up is displayed
  //   const isPopupVisible = await page.evaluate(() => {
  //     const popup = document.querySelector('rulesPopup');
  //     return popup && popup.style.display !== 'none';
  //   });
  //   expect(isPopupVisible).toBe(true);

  //   // Click the Close button inside the pop-up
  //   await page.click('#close-popup-button'); // Update with the actual selector for the close button

  //   // Wait for the pop-up to hide
  //   await page.waitForSelector('#rules-popup', { hidden: true });

  //   // Ensure the pop-up is hidden again
  //   const isPopupHiddenAfterClose = await page.evaluate(() => {
  //     const popup = document.querySelector('#rules-popup');
  //     return popup && popup.style.display === 'none';
  //   });
  //   expect(isPopupHiddenAfterClose).toBe(true);
  // });

  // test('should reset puzzle when Restart button is clicked', async () => {
  //   await clickButtonByText(page, 'Restart'); // Click the Restart button
  //   const colorState = await page.evaluate(() => colorState);
  //   const allBlue = colorState.every(state => state === 0); // Check if all squares are blue (reset state)
  //   expect(allBlue).toBe(true);
  // });

  // test('should solve the puzzle when Solve button is clicked', async () => {
  //   await clickButtonByText(page, 'Solve'); // Click the Solve button
  //   //console.log("Solve button clicked");
  
  //   // Manually trigger the solve logic (for debugging)
  //   await page.evaluate(() => {
  //     if (typeof solve === 'function') {
  //       solve(); // Manually invoke the solve function
  //     }
  //   });
  
  //   const currentState = await page.evaluate(() => colorState);
  //   const solutionState = await page.evaluate(() => solution_colors);
  
  //   //Console logs for solve debugging:
  //   //console.log('Current State after manual Solve:', currentState);
  //   //console.log('Solution State:', solutionState);
  
  //   expect(currentState).toEqual(solutionState); // Compare current state with the solution state
  // });

  //Testing completion features manually:
  // test for unclickable squares after puzzle completion: complete a nurikabe (not using the solve button) and then try to click one of the green squares
  // test for completion text: solve nurikabe using solve button (and once without too) and see if completion text pops up on the screen
  
});
