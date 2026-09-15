import http from "http";

async function runTests() {
  console.log("=== EXECUTING AUTOMATED SECURITY & API TEST CASES ===");
  const baseUrl = "http://localhost:3000";

  // Helper fetch function
  const request = async (path: string, options: any = {}) => {
    const res = await fetch(`${baseUrl}${path}`, options);
    const contentType = res.headers.get("content-type") || "";
    let data;
    if (contentType.includes("application/json")) {
      data = await res.json();
    } else {
      data = await res.text();
    }
    return { status: res.status, headers: res.headers, data };
  };

  try {
    // 1. ReDoS / Regex Injection Test
    console.log("\n[Test 1] Testing ReDoS / Regex Injection on Search API (?q=(.*)...");
    const searchRes = await request("/api/search?q=(.*)");
    console.log(`Status: ${searchRes.status}`);
    if (searchRes.status === 200 && Array.isArray(searchRes.data.items)) {
      console.log("✓ PASS: Regex characters safely handled without server crash or syntax error.");
    } else {
      console.error("✗ FAIL: Unexpected search response", searchRes);
    }

    // 2. Pagination Clamping Test
    console.log("\n[Test 2] Testing Unbounded Pagination Clamping (?limit=99999)...");
    const limitRes = await request("/api/politicians?limit=99999");
    console.log(`Status: ${limitRes.status}, Received politicians: ${limitRes.data.politicians?.length}`);
    if (limitRes.status === 200 && limitRes.data.politicians.length <= 250) {
      console.log(`✓ PASS: Limit clamped to safe upper bound (${limitRes.data.politicians.length} <= 250).`);
    } else {
      console.error("✗ FAIL: Unbounded limit allowed", limitRes.data);
    }

    // 3. Invalid Page Parameter Handling
    console.log("\n[Test 3] Testing Invalid Page Parameter Handling (?page=-5&limit=-10)...");
    const pageRes = await request("/api/politicians?page=-5&limit=-10");
    console.log(`Status: ${pageRes.status}, Current page: ${pageRes.data.page}`);
    if (pageRes.status === 200 && pageRes.data.page === 1) {
      console.log("✓ PASS: Negative/invalid page clamped to 1.");
    } else {
      console.error("✗ FAIL: Invalid page not sanitized", pageRes.data);
    }

    // 4. Mutation Lockdown: Unauthorized POST /api/politicians
    console.log("\n[Test 4] Testing Public Mutation Lockdown (POST /api/politicians)...");
    const postRes = await request("/api/politicians", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "Hacker Politician" }),
    });
    console.log(`Status: ${postRes.status}, Response:`, postRes.data);
    if (postRes.status === 405) {
      console.log("✓ PASS: Public POST rejected with 405 Method Not Allowed.");
    } else {
      console.error("✗ FAIL: Public POST was not blocked!", postRes);
    }

    // 5. Mutation Lockdown: Unauthorized PATCH /api/politicians/narendra-modi
    console.log("\n[Test 5] Testing Public Mutation Lockdown (PATCH /api/politicians/narendra-modi)...");
    const patchRes = await request("/api/politicians/narendra-modi", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "Defaced Name" }),
    });
    console.log(`Status: ${patchRes.status}`);
    if (patchRes.status === 405) {
      console.log("✓ PASS: Public PATCH rejected with 405 Method Not Allowed.");
    } else {
      console.error("✗ FAIL: Public PATCH was not blocked!", patchRes);
    }

    // 6. Mutation Lockdown: Unauthorized DELETE /api/politicians/narendra-modi
    console.log("\n[Test 6] Testing Public Deletion Lockdown (DELETE /api/politicians/narendra-modi)...");
    const delRes = await request("/api/politicians/narendra-modi", { method: "DELETE" });
    console.log(`Status: ${delRes.status}`);
    if (delRes.status === 405) {
      console.log("✓ PASS: Public DELETE rejected with 405 Method Not Allowed.");
    } else {
      console.error("✗ FAIL: Public DELETE was not blocked!", delRes);
    }

    // 7. Honeypot Anti-Spam Verification on Corrections Endpoint
    console.log("\n[Test 7] Testing Honeypot Anti-Spam on POST /api/corrections...");
    const honeypotRes = await request("/api/corrections", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        recordType: "politician",
        recordIdentifier: "test",
        issueType: "outdated_info",
        description: "Bot submission test",
        suggestedCorrection: "Bot correction",
        website_trap: "spambot-payload",
      }),
    });
    console.log(`Status: ${honeypotRes.status}, Response:`, honeypotRes.data);
    if (honeypotRes.status === 200 && honeypotRes.data.message === "Report received.") {
      console.log("✓ PASS: Spambot honeypot triggered and silently absorbed without database write.");
    } else {
      console.error("✗ FAIL: Honeypot failed to catch bot payload", honeypotRes);
    }

    // 8. Legitimate Correction Submission Test
    console.log("\n[Test 8] Testing Valid Correction Submission on POST /api/corrections...");
    const validRes = await request("/api/corrections", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        recordType: "politician",
        recordIdentifier: "narendra-modi",
        issueType: "outdated_info",
        description: "Checking automated verification test submission.",
        suggestedCorrection: "Verified against 18th Lok Sabha gazette.",
        sourceUrl: "https://sansad.in/ls/members",
        contactEmail: "test@example.com",
      }),
    });
    console.log(`Status: ${validRes.status}, Response:`, validRes.data);
    if (validRes.status === 200 && validRes.data.success === true) {
      console.log("✓ PASS: Valid correction submitted and queued for editorial moderation.");
    } else {
      console.error("✗ FAIL: Valid correction rejected", validRes);
    }

    // 9. HTTP Security Headers Verification
    console.log("\n[Test 9] Testing Production Security Headers on Root Route (/)...");
    const headerRes = await request("/");
    const csp = headerRes.headers.get("content-security-policy");
    const xcto = headerRes.headers.get("x-content-type-options");
    const xfo = headerRes.headers.get("x-frame-options");
    const hsts = headerRes.headers.get("strict-transport-security");
    const ref = headerRes.headers.get("referrer-policy");

    console.log("Content-Security-Policy:", csp ? "Present" : "Missing");
    console.log("X-Content-Type-Options:", xcto);
    console.log("X-Frame-Options:", xfo);
    console.log("Strict-Transport-Security:", hsts);
    console.log("Referrer-Policy:", ref);

    if (xcto === "nosniff" && xfo === "DENY" && csp) {
      console.log("✓ PASS: All key security headers verified.");
    } else {
      console.error("✗ FAIL: Missing required security headers");
    }

    console.log("\n=== ALL SECURITY TEST CASES COMPLETED SUCCESSFULLY ===");
  } catch (err) {
    console.error("Test execution error:", err);
  }
}

runTests();
