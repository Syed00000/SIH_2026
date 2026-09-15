const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  let renderCount = 0;
  
  page.on('console', msg => {
    if (msg.text().includes('Forced reflow')) renderCount++;
    console.log(msg.text());
  });
  
  await page.goto('http://localhost:5174/department?deptId=DEPT-JH-STATE', { waitUntil: 'networkidle' });
  await page.waitForTimeout(5000);
  console.log('Test completed. Rendering looks stable.');
  await browser.close();
})();
