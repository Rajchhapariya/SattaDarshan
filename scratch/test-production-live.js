// scratch/test-production-live.js
// Production smoke test against the live SattaDarshan deployment

const PROD_URL = "https://satta-darshan-7jgo.vercel.app";

async function runLiveSmokeTests() {
  console.log(`Starting Production Smoke Tests on: ${PROD_URL}\n`);
  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  [PASS] ${message}`);
      passed++;
    } else {
      console.error(`  [FAIL] ${message}`);
      failed++;
    }
  }

  // 1. Homepage & Headers
  console.log("1. Testing Homepage & Security Headers...");
  const t0 = Date.now();
  const homeRes = await fetch(`${PROD_URL}/`, {
    headers: { "User-Agent": "ProductionSmokeTest/1.0" }
  });
  const homeDuration = Date.now() - t0;
  const homeText = await homeRes.text();

  assert(homeRes.status === 200, `Homepage HTTP 200 (status: ${homeRes.status})`);
  assert(homeDuration < 3000, `Homepage loads quickly (${homeDuration}ms)`);
  assert(homeRes.headers.get("x-content-type-options") === "nosniff", "X-Content-Type-Options: nosniff present");
  assert(homeRes.headers.get("x-frame-options") === "DENY", "X-Frame-Options: DENY present");
  assert(!homeRes.headers.get("x-powered-by"), "No X-Powered-By header leaked");
  assert(homeRes.headers.has("content-security-policy"), "Content-Security-Policy header present");
  assert(homeRes.headers.has("strict-transport-security"), "HSTS header present");
  assert(!homeText.includes("MONGO") && !homeText.includes("SHEET_ID") && !homeText.includes("REVALIDATE_SECRET"), "Zero secrets in HTML");
  assert(!homeText.includes("node_modules") && !homeText.includes("webpack://"), "No stack traces or source paths");

  // 2. Global Search API
  console.log("\n2. Testing Global Search API...");
  const searchRes = await fetch(`${PROD_URL}/api/search?q=modi`);
  assert(searchRes.status === 200, `Search API HTTP 200 (status: ${searchRes.status})`);
  const searchData = await searchRes.json();
  const items = searchData.items || [];
  assert(Array.isArray(items) && items.length > 0, `Search API returns results (count: ${items.length})`);
  const foundModi = items.some(p => (p.href && p.href.includes("narendra-modi")) || (p.label && p.label.includes("Modi")));
  assert(foundModi, "Search API successfully finds Narendra Modi");

  // 3. Politician Page
  console.log("\n3. Testing Politician Profile Page...");
  const polRes = await fetch(`${PROD_URL}/politicians/narendra-modi`);
  const polText = await polRes.text();
  assert(polRes.status === 200, `Politician page HTTP 200 (status: ${polRes.status})`);
  assert(polText.includes("Narendra Modi"), "Politician page contains politician name");
  assert(polText.includes("Varanasi"), "Politician page contains constituency");
  assert(!polText.includes("Internal Server Error") && !polText.includes("MongooseError"), "No internal errors on politician page");

  // 4. Political Party Page
  console.log("\n4. Testing Political Party Page...");
  const partyRes = await fetch(`${PROD_URL}/parties/bjp`);
  const partyText = await partyRes.text();
  assert(partyRes.status === 200, `Party page HTTP 200 (status: ${partyRes.status})`);
  assert(partyText.includes("Bharatiya Janata Party"), "Party page contains full party name");
  assert(!partyText.includes("Internal Server Error"), "No internal errors on party page");

  // 5. State Page
  console.log("\n5. Testing State Page...");
  const stateRes = await fetch(`${PROD_URL}/states/west-bengal`);
  const stateText = await stateRes.text();
  assert(stateRes.status === 200, `State page HTTP 200 (status: ${stateRes.status})`);
  assert(stateText.includes("West Bengal"), "State page contains state name");
  assert(!stateText.includes("Internal Server Error"), "No internal errors on state page");

  // 6. Lok Sabha & Rajya Sabha Pages
  console.log("\n6. Testing Parliamentary Pages...");
  const lsRes = await fetch(`${PROD_URL}/parliament/lok-sabha`);
  const lsText = await lsRes.text();
  assert(lsRes.status === 200, `Lok Sabha page HTTP 200 (status: ${lsRes.status})`);
  assert(lsText.includes("Lok Sabha"), "Lok Sabha page contains heading");

  const rsRes = await fetch(`${PROD_URL}/parliament/rajya-sabha`);
  const rsText = await rsRes.text();
  assert(rsRes.status === 200, `Rajya Sabha page HTTP 200 (status: ${rsRes.status})`);
  assert(rsText.includes("Rajya Sabha"), "Rajya Sabha page contains heading");

  // 7. 3D Chamber Data API
  console.log("\n7. Testing 3D Parliament Chamber Data API...");
  const seatsRes = await fetch(`${PROD_URL}/api/parliament/seats?chamber=Lok+Sabha`);
  assert(seatsRes.status === 200, `Chamber seats API HTTP 200 (status: ${seatsRes.status})`);
  const seatsData = await seatsRes.json();
  assert(seatsData.totalSeats === 543, `Chamber seats API totalSeats is 543 (actual: ${seatsData.totalSeats})`);
  assert(seatsData.activeSeats === 540, `Chamber seats API activeSeats is 540 (actual: ${seatsData.activeSeats})`);
  assert(Array.isArray(seatsData.seats) && seatsData.seats.length === 540, `Chamber seats array has 540 seats`);

  // 8. Contact & Correction Pages
  console.log("\n8. Testing Contact & Correction Pages...");
  const contactPage = await fetch(`${PROD_URL}/contact`);
  assert(contactPage.status === 200, `Contact page HTTP 200 (status: ${contactPage.status})`);

  const corrPage = await fetch(`${PROD_URL}/corrections`);
  assert(corrPage.status === 200, `Corrections page HTTP 200 (status: ${corrPage.status})`);

  // 9. Contact & Correction API Endpoint Security / Validation
  console.log("\n9. Testing Form Submission Security & Method Rejection...");
  const contactGet = await fetch(`${PROD_URL}/api/contact`);
  assert(contactGet.status === 405, `GET /api/contact rejected with 405 Method Not Allowed (status: ${contactGet.status})`);

  const corrGet = await fetch(`${PROD_URL}/api/corrections`);
  assert(corrGet.status === 405, `GET /api/corrections rejected with 405 Method Not Allowed (status: ${corrGet.status})`);

  // Validation failure test: Empty payload
  const contactPostBad = await fetch(`${PROD_URL}/api/contact`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({}),
  });
  assert(contactPostBad.status === 400, `Empty contact submission correctly rejected with 400 (status: ${contactPostBad.status})`);
  const contactBadJson = await contactPostBad.json();
  assert(!JSON.stringify(contactBadJson).includes("SHEET") && !JSON.stringify(contactBadJson).includes("credentials"), "No internal details leaked on 400 response");

  // Honeypot spam test: Spam trap field filled
  const contactHoneypot = await fetch(`${PROD_URL}/api/contact`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      subject: "Test Subject",
      message: "Testing honeypot protection",
      website_trap: "automated_spam_bot", // honeypot trap field
    }),
  });
  // Honeypot returns simulated 200 success without storing or writing to sheets
  assert(contactHoneypot.status === 200, `Honeypot spam test handled silently with HTTP 200 (status: ${contactHoneypot.status})`);

  // 10. Revalidate API Security
  console.log("\n10. Testing Admin Revalidate API Security...");
  const revNoAuth = await fetch(`${PROD_URL}/api/revalidate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ path: "/" }),
  });
  assert(revNoAuth.status === 401, `Unauthenticated revalidate request rejected with 401 (status: ${revNoAuth.status})`);

  const revGet = await fetch(`${PROD_URL}/api/revalidate`);
  assert(revGet.status === 405, `GET /api/revalidate rejected with 405 (status: ${revGet.status})`);

  // 11. Media Proxy Security & Cache
  console.log("\n11. Testing Media Avatar Proxy Security & Cache Headers...");
  const badMediaProto = await fetch(`${PROD_URL}/api/media/avatar?url=http://example.com/test.jpg`);
  assert(badMediaProto.status === 400, `Non-HTTPS avatar URL rejected with 400 (status: ${badMediaProto.status})`);

  const disallowHost = await fetch(`${PROD_URL}/api/media/avatar?url=https://malicious-site.com/evil.jpg`);
  assert(disallowHost.status === 403, `Non-whitelisted host rejected with 403 (status: ${disallowHost.status})`);

  const samplePhotoUrl = "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Mayawati_in_2016.jpg/330px-Mayawati_in_2016.jpg";
  const validMedia = await fetch(`${PROD_URL}/api/media/avatar?url=${encodeURIComponent(samplePhotoUrl)}`);
  assert(validMedia.status === 200, `Whitelisted media fetched with 200 (status: ${validMedia.status})`);
  const mediaCache = validMedia.headers.get("cache-control") || "";
  assert(mediaCache.includes("max-age=86400"), `Media proxy Cache-Control includes max-age=86400 (header: ${mediaCache})`);
  assert(validMedia.headers.get("x-content-type-options") === "nosniff", "Media proxy nosniff present");

  // 12. Robots.txt & Sitemap.xml
  console.log("\n12. Testing Robots.txt and Sitemap.xml...");
  const robotsRes = await fetch(`${PROD_URL}/robots.txt`);
  const robotsText = await robotsRes.text();
  assert(robotsRes.status === 200, `Robots.txt HTTP 200 (status: ${robotsRes.status})`);
  assert(robotsText.includes("Disallow: /api/"), "Robots.txt blocks private API routes");
  assert(robotsText.includes("Allow: /api/og/"), "Robots.txt permits OG social images");
  assert(robotsText.includes("sitemap.xml"), "Robots.txt points to sitemap");

  const sitemapRes = await fetch(`${PROD_URL}/sitemap.xml`);
  const sitemapText = await sitemapRes.text();
  assert(sitemapRes.status === 200, `Sitemap.xml HTTP 200 (status: ${sitemapRes.status})`);
  assert(sitemapText.includes("<urlset") && sitemapText.includes("<loc>"), "Sitemap is valid XML URL set");
  assert(sitemapText.includes("/politicians/narendra-modi"), "Sitemap includes dynamic politician route");

  console.log(`\n========================================`);
  console.log(`LIVE PRODUCTION SMOKE TEST SUMMARY`);
  console.log(`Total Passed: ${passed}`);
  console.log(`Total Failed: ${failed}`);
  console.log(`========================================`);

  if (failed > 0) {
    process.exit(1);
  }
}

runLiveSmokeTests().catch(err => {
  console.error("Fatal smoke test error:", err);
  process.exit(1);
});
