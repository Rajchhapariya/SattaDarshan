const http = require('http');
const crypto = require('crypto');
const fs = require('fs');

const baseUrl = 'http://localhost:3000';

async function request(path, options = {}) {
  const url = `${baseUrl}${path}`;
  const res = await fetch(url, options);
  const contentType = res.headers.get('content-type') || '';
  let data;
  if (contentType.includes('application/json')) {
    try {
      data = await res.json();
    } catch {
      data = null;
    }
  } else {
    data = await res.text();
  }
  return { status: res.status, headers: res.headers, data };
}

async function runSecuritySuite() {
  console.log('=== SATTA DARSHAN PRODUCTION SECURITY VERIFICATION SUITE ===\n');
  let passCount = 0;
  let failCount = 0;

  function assert(name, condition, details = '') {
    if (condition) {
      console.log(`[PASS] ${name}`);
      passCount++;
    } else {
      console.error(`[FAIL] ${name} - Details: ${details}`);
      failCount++;
    }
  }

  try {
    // 1. HTTP Security Headers
    console.log('--- 1. HTTP SECURITY HEADERS ---');
    const rootRes = await request('/');
    assert('X-Powered-By is suppressed', !rootRes.headers.get('x-powered-by'));
    assert('X-Content-Type-Options is nosniff', rootRes.headers.get('x-content-type-options') === 'nosniff');
    assert('X-Frame-Options is DENY', rootRes.headers.get('x-frame-options') === 'DENY');
    assert('Referrer-Policy is strict-origin-when-cross-origin', rootRes.headers.get('referrer-policy') === 'strict-origin-when-cross-origin');
    assert('Strict-Transport-Security is present', !!rootRes.headers.get('strict-transport-security'));
    assert('Content-Security-Policy is present', !!rootRes.headers.get('content-security-policy'));
    assert('Permissions-Policy is present', !!rootRes.headers.get('permissions-policy'));

    // 2. Revalidate Endpoint Security
    console.log('\n--- 2. REVALIDATE ENDPOINT SECURITY ---');
    // 2a. Rejection without secret
    const rNoSecret = await request('/api/revalidate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path: '/' })
    });
    assert('Revalidate POST without token rejected (401)', rNoSecret.status === 401);

    // 2b. Rejection with old query parameter secret
    const rQuerySecret = await request('/api/revalidate?secret=satta_revalidate_civic_key', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path: '/' })
    });
    assert('Revalidate POST with query param rejected (401)', rQuerySecret.status === 401);

    // 2c. Rejection with invalid header token
    const rInvalidSecret = await request('/api/revalidate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-revalidate-secret': 'invalid_secret_token_123' },
      body: JSON.stringify({ path: '/' })
    });
    assert('Revalidate POST with invalid header rejected (401)', rInvalidSecret.status === 401);

    // 2d. Revalidate GET method rejection
    const rGetMethod = await request('/api/revalidate', { method: 'GET' });
    assert('Revalidate GET rejected with 405', rGetMethod.status === 405);

    // 2e. Revalidate oversized payload rejection (> 16KB)
    const bigString = 'A'.repeat(20000);
    const rOversized = await request('/api/revalidate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-revalidate-secret': 'test' },
      body: JSON.stringify({ path: bigString })
    });
    assert('Revalidate oversized payload rejected with 413', rOversized.status === 413);

    // 3. Contact Submission Privacy & Security
    console.log('\n--- 3. CONTACT SUBMISSION PRIVACY & SECURITY ---');
    // 3a. GET method rejection
    const cGet = await request('/api/contact', { method: 'GET' });
    assert('Contact GET rejected with 405', cGet.status === 405);

    // 3b. Malformed JSON rejection
    const cMalformed = await request('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: '{"unclosed_json: '
    });
    assert('Contact malformed JSON handled with 400', cMalformed.status === 400 && cMalformed.data.error === 'Invalid JSON format.');

    // 3c. Oversized payload rejection (> 64KB)
    const hugeMessage = 'X'.repeat(70000);
    const cOversized = await request('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subject: 'Big', message: hugeMessage })
    });
    assert('Contact oversized payload rejected with 413', cOversized.status === 413);

    // 3d. Honeypot silent rejection
    const cHoneypot = await request('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        subject: 'Bot submission',
        message: 'Spam content here',
        website_trap: 'bot_filled_trap'
      })
    });
    assert('Contact honeypot absorbed silently (200, no store)', cHoneypot.status === 200 && cHoneypot.data.success === true);

    // 4. Corrections Submission Privacy & Security
    console.log('\n--- 4. CORRECTIONS SUBMISSION PRIVACY & SECURITY ---');
    // 4a. GET method rejection
    const crGet = await request('/api/corrections', { method: 'GET' });
    assert('Corrections GET rejected with 405', crGet.status === 405);

    // 4b. Malformed JSON rejection
    const crMalformed = await request('/api/corrections', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: '{{malformed json'
    });
    assert('Corrections malformed JSON handled with 400', crMalformed.status === 400);

    // 4c. Oversized payload rejection (> 64KB)
    const crOversized = await request('/api/corrections', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ recordType: 'politician', description: hugeMessage })
    });
    assert('Corrections oversized payload rejected with 413', crOversized.status === 413);

    // 4d. Honeypot silent rejection
    const crHoneypot = await request('/api/corrections', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        recordType: 'politician',
        recordIdentifier: 'narendra-modi',
        issueType: 'outdated_info',
        description: 'Test spam correction',
        suggestedCorrection: 'Spam content',
        website_trap: 'bot_trap'
      })
    });
    assert('Corrections honeypot absorbed silently (200, no store)', crHoneypot.status === 200 && crHoneypot.data.success === true);

    // 5. Media Proxy Security
    console.log('\n--- 5. MEDIA PROXY SECURITY ---');
    // 5a. Missing URL
    const mMissing = await request('/api/media/avatar');
    assert('Media proxy missing URL rejected (400)', mMissing.status === 400);

    // 5b. Non-HTTPS protocol rejection (e.g. HTTP)
    const mHttp = await request('/api/media/avatar?url=http://sansad.in/avatar.jpg');
    assert('Media proxy HTTP protocol rejected (400)', mHttp.status === 400);

    // 5c. Unauthorized host rejection
    const mEvilHost = await request('/api/media/avatar?url=https://evil.com/image.jpg');
    assert('Media proxy unauthorized host rejected (403)', mEvilHost.status === 403);

    // 5d. Legitimate allowed host responds or handles safely with nosniff
    const mLegit = await request('/api/media/avatar?url=' + encodeURIComponent('https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e6/Mayawati_in_2016.jpg/330px-Mayawati_in_2016.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail'));
    assert('Media proxy legitimate host succeeds or proxies safely', [200, 304].includes(mLegit.status));
    assert('Media proxy injects X-Content-Type-Options: nosniff', mLegit.headers.get('x-content-type-options') === 'nosniff');

    // 6. Public Directory APIs Security & Clamping
    console.log('\n--- 6. PUBLIC DIRECTORY APIs SECURITY ---');
    // 6a. Search ReDoS injection
    const sRegex = await request('/api/search?q=(.*)+');
    assert('Search handles regex safely without crash', sRegex.status === 200 && Array.isArray(sRegex.data.items));

    // 6b. Pagination clamping
    const pClamp = await request('/api/politicians?limit=99999');
    assert('Politicians pagination clamped <= 250', pClamp.status === 200 && pClamp.data.politicians.length <= 250);

    // 6c. Negative page handling
    const pNeg = await request('/api/politicians?page=-10');
    assert('Politicians negative page clamped to 1', pNeg.status === 200 && pNeg.data.page === 1);

    // 6d. Mutation lockdowns
    const pPost = await request('/api/politicians', { method: 'POST', body: JSON.stringify({}) });
    assert('Politicians POST rejected with 405', pPost.status === 405);

    const paPost = await request('/api/parties', { method: 'POST', body: JSON.stringify({}) });
    assert('Parties POST rejected with 405', paPost.status === 405);

    const stPost = await request('/api/states', { method: 'POST', body: JSON.stringify({}) });
    assert('States POST rejected with 405', stPost.status === 405);

    // 7. Client Bundle & HTML Secret Leak Check
    console.log('\n--- 7. CLIENT BUNDLE & HTML SECRETS CHECK ---');
    const homeHtml = rootRes.data;
    assert('HTML does not leak MONGODB_URI', !homeHtml.includes('mongodb+srv://') && !homeHtml.includes('mongodb://'));
    assert('HTML does not leak REVALIDATE_SECRET', !homeHtml.includes('satta_revalidate_civic_key'));
    assert('HTML does not leak Google Apps Script URL', !homeHtml.includes('script.google.com'));

    console.log(`\n========================================`);
    console.log(`TEST RESULTS: ${passCount} PASSED, ${failCount} FAILED`);
    console.log(`========================================\n`);

    if (failCount > 0) process.exit(1);
  } catch (err) {
    console.error('Fatal error running security suite:', err);
    process.exit(1);
  }
}

runSecuritySuite();
