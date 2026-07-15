import { chromium } from 'playwright-core';

(async () => {
  const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome' }); // or whatever is available
  const context = await browser.newContext();
  const page = await context.newPage();
  
  page.on('console', msg => console.log('BROWSER CONSOLE:', msg.text()));
  page.on('request', request => {
    if (request.url().includes('/api/members/directory')) {
      console.log('API REQUEST:', request.url());
    }
  });

  await page.goto('http://localhost:3000/members/directory', { waitUntil: 'networkidle' });
  
  console.log('Clicking page 2');
  await page.click('button:has-text("2")');
  await page.waitForTimeout(2000);
  
  console.log('Current page UI state:', await page.locator('button:has-text("2")').getAttribute('class'));
  
  await browser.close();
})();
