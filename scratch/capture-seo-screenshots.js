const path = require('path');
const { chromium } = require('C:/Users/Rajch/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright');

const ARTIFACT_DIR = 'C:/Users/Rajch/.gemini/antigravity-ide/brain/345efc58-12e0-40af-b311-3ebc76546adc';

async function capture() {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  
  // Desktop Context (1280x800)
  const desktopCtx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  await desktopCtx.addInitScript(() => sessionStorage.setItem('sattadarshan_disclaimer_ack', 'true'));
  const desktopPage = await desktopCtx.newPage();

  // 1. Om Birla Profile
  console.log('Capturing Om Birla desktop...');
  await desktopPage.goto('http://localhost:3000/politicians/shri-om-birla', { waitUntil: 'networkidle' });
  await desktopPage.screenshot({ path: path.join(ARTIFACT_DIR, 'seo_om_birla_desktop.png') });

  // 2. BJP Party Profile
  console.log('Capturing BJP party desktop...');
  await desktopPage.goto('http://localhost:3000/parties/bjp', { waitUntil: 'networkidle' });
  await desktopPage.screenshot({ path: path.join(ARTIFACT_DIR, 'seo_bjp_party_desktop.png') });

  // 3. West Bengal State Profile
  console.log('Capturing West Bengal state desktop...');
  await desktopPage.goto('http://localhost:3000/states/west-bengal', { waitUntil: 'networkidle' });
  await desktopPage.screenshot({ path: path.join(ARTIFACT_DIR, 'seo_west_bengal_state_desktop.png') });

  // 4. Lok Sabha Directory
  console.log('Capturing Lok Sabha desktop...');
  await desktopPage.goto('http://localhost:3000/parliament/lok-sabha', { waitUntil: 'networkidle' });
  await desktopPage.screenshot({ path: path.join(ARTIFACT_DIR, 'seo_lok_sabha_desktop.png') });

  // Mobile Context (390x844)
  const mobileCtx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true });
  await mobileCtx.addInitScript(() => sessionStorage.setItem('sattadarshan_disclaimer_ack', 'true'));
  const mobilePage = await mobileCtx.newPage();

  // 5. Om Birla Mobile
  console.log('Capturing Om Birla mobile...');
  await mobilePage.goto('http://localhost:3000/politicians/shri-om-birla', { waitUntil: 'networkidle' });
  await mobilePage.screenshot({ path: path.join(ARTIFACT_DIR, 'seo_om_birla_mobile.png') });

  await browser.close();
  console.log('All SEO screenshots captured successfully.');
  process.exit(0);
}

capture().catch(e => { console.error(e); process.exit(1); });
