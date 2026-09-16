async function testAll() {
  console.log("=== Running End-to-End HTTP Submissions Tests ===\n");

  // 1. Valid Correction Test
  const r1 = await fetch("http://localhost:3000/api/corrections", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      recordType: "politician",
      recordIdentifier: "narendra-modi",
      issueType: "outdated_info",
      description: "Cabinet portfolio ministerial list requires update following recent gazette notification.",
      suggestedCorrection: "Verify updated parliamentary committee assignments from sansad.in registry.",
      sourceUrl: "https://sansad.in/ls/members",
      contactEmail: "citizen.researcher@example.org",
    }),
  });
  const d1 = await r1.json();
  console.log("1. Valid Correction Test:", r1.status, d1);
  if (r1.status !== 200 || !d1.success) {
    throw new Error("Test 1 failed: Expected 200 with success: true");
  }

  // 2. Invalid Record Type
  const r2 = await fetch("http://localhost:3000/api/corrections", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      recordType: "invalid_type",
      recordIdentifier: "narendra-modi",
      issueType: "outdated_info",
      description: "Cabinet portfolio ministerial list requires update.",
      suggestedCorrection: "Verify updated assignments.",
    }),
  });
  const d2 = await r2.json();
  console.log("2. Invalid Record Category Test:", r2.status, d2);
  if (r2.status !== 400 || !d2.error) {
    throw new Error("Test 2 failed: Expected 400");
  }

  // 3. Description Too Short
  const r3 = await fetch("http://localhost:3000/api/corrections", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      recordType: "politician",
      recordIdentifier: "narendra-modi",
      issueType: "outdated_info",
      description: "Too short",
      suggestedCorrection: "Verify updated assignments.",
    }),
  });
  const d3 = await r3.json();
  console.log("3. Description Too Short Test:", r3.status, d3);
  if (r3.status !== 400 || !d3.error) {
    throw new Error("Test 3 failed: Expected 400");
  }

  // 4. Invalid Email Format
  const r4 = await fetch("http://localhost:3000/api/corrections", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      recordType: "politician",
      recordIdentifier: "narendra-modi",
      issueType: "outdated_info",
      description: "A comprehensive description of the inaccuracy in the public gazette.",
      suggestedCorrection: "Verify updated assignments.",
      contactEmail: "invalid-email-address",
    }),
  });
  const d4 = await r4.json();
  console.log("4. Invalid Email Format Test:", r4.status, d4);
  if (r4.status !== 400 || !d4.error) {
    throw new Error("Test 4 failed: Expected 400");
  }

  // 5. Anti-Spam Honeypot
  const r5 = await fetch("http://localhost:3000/api/corrections", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      recordType: "politician",
      recordIdentifier: "narendra-modi",
      issueType: "outdated_info",
      description: "Spam bot description.",
      suggestedCorrection: "Spam bot correction.",
      website_trap: "automated bot text",
    }),
  });
  const d5 = await r5.json();
  console.log("5. Honeypot Silent Success Test:", r5.status, d5);
  if (r5.status !== 200 || !d5.success) {
    throw new Error("Test 5 failed: Expected 200 with success: true");
  }

  // 6. Valid Contact Message
  const r6 = await fetch("http://localhost:3000/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      subject: "Data Methodology & Sources Question",
      message: "We are an academic research initiative studying legislative performance and would like to understand the primary gazette verification frequency.",
      userEmail: "researcher@university.edu",
    }),
  });
  const d6 = await r6.json();
  console.log("6. Valid Contact Submission Test:", r6.status, d6);
  if (r6.status !== 200 || !d6.success) {
    throw new Error("Test 6 failed: Expected 200 with success: true");
  }

  // 7. Contact Message Too Short
  const r7 = await fetch("http://localhost:3000/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      subject: "Hello",
      message: "Hi",
    }),
  });
  const d7 = await r7.json();
  console.log("7. Contact Message Too Short Test:", r7.status, d7);
  if (r7.status !== 400 || !d7.error) {
    throw new Error("Test 7 failed: Expected 400");
  }

  // 8. Contact Invalid Email
  const r8 = await fetch("http://localhost:3000/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      subject: "General Civic Feedback",
      message: "Great civic platform for parliamentary transparency. Keep up the good work!",
      userEmail: "bademail",
    }),
  });
  const d8 = await r8.json();
  console.log("8. Contact Invalid Email Test:", r8.status, d8);
  if (r8.status !== 400 || !d8.error) {
    throw new Error("Test 8 failed: Expected 400");
  }

  console.log("\n>>> ALL 8 HTTP VALIDATION & SUBMISSION TESTS PASSED! <<<");
}

testAll().catch((e) => {
  console.error("Test execution failed:", e.message);
  process.exit(1);
});
