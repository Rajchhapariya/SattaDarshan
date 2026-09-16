async function pushData() {
  console.log("=== Pushing Live Data to SattaDarshan Google Sheets ===\n");

  const corrections = [
    {
      recordType: "politician",
      recordIdentifier: "Narendra Modi",
      issueType: "outdated_info",
      description: "Cabinet ministerial portfolio allocation reflects earlier gazette notification and needs synchronization with current Sansad registry.",
      suggestedCorrection: "Verify Prime Minister in charge of Ministry of Personnel, Public Grievances and Pensions, Department of Atomic Energy, and Department of Space.",
      sourceUrl: "https://sansad.in/ls/members",
      contactEmail: "editorial.reviewer@sattadarshan.org",
    },
    {
      recordType: "party",
      recordIdentifier: "Indian National Congress (INC)",
      issueType: "party_affiliation",
      description: "Lok Sabha seat count for INC requires alignment following recent parliamentary by-election certification.",
      suggestedCorrection: "Update active Lok Sabha seats to reflect current official seat certification published on sansad.in.",
      sourceUrl: "https://eci.gov.in/",
      contactEmail: "civic.analyst@research.org",
    },
    {
      recordType: "state",
      recordIdentifier: "Maharashtra",
      issueType: "factual_error",
      description: "Chief Minister tenure start date in state profile should be synchronized with official Raj Bhavan notification.",
      suggestedCorrection: "Update tenure swearing-in date pursuant to official December 2024 gazette notification.",
      sourceUrl: "https://www.india.gov.in/",
      contactEmail: "state.desk@sattadarshan.org",
    },
  ];

  const contacts = [
    {
      subject: "Data Methodology & Primary Source Verification",
      message: "Hello SattaDarshan Team, we are an academic research lab studying Indian parliamentary debate records and would like to understand your source verification frequency for newly notified election gazettes.",
      userEmail: "scholar.research@university.ac.in",
    },
    {
      subject: "Copyright & Image Attribution Notice",
      message: "Regarding public domain representative portraits, we appreciate your clean Creative Commons attribution standards. Could you please confirm if high-resolution SVG state jurisdiction maps are open for academic citations?",
      userEmail: "media.rights@civicpress.org",
    },
    {
      subject: "Civic Platform Feedback & User Experience",
      message: "The 3D parliamentary chamber visualization and interactive territorial maps are incredibly responsive and helpful for civic awareness. Excellent work on maintaining non-partisan public data integrity.",
      userEmail: "citizen.feedback@outlook.com",
    },
  ];

  console.log("--- Pushing Corrections Submissions ---");
  for (let i = 0; i < corrections.length; i++) {
    const item = corrections[i];
    console.log(`Sending Correction ${i + 1}/${corrections.length}: [${item.recordIdentifier}]...`);
    try {
      const res = await fetch("http://localhost:3000/api/corrections", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "x-forwarded-for": `198.51.100.${10 + i}` 
        },
        body: JSON.stringify(item),
      });
      const data = await res.json();
      console.log(`Result: HTTP ${res.status}`, data);
    } catch (err) {
      console.error(`Failed to push correction ${i + 1}:`, err.message);
    }
    // Small pause between requests
    await new Promise((resolve) => setTimeout(resolve, 1200));
  }

  console.log("\n--- Pushing Contact Submissions ---");
  for (let i = 0; i < contacts.length; i++) {
    const item = contacts[i];
    console.log(`Sending Contact ${i + 1}/${contacts.length}: [${item.subject}]...`);
    try {
      const res = await fetch("http://localhost:3000/api/contact", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "x-forwarded-for": `198.51.100.${20 + i}` 
        },
        body: JSON.stringify(item),
      });
      const data = await res.json();
      console.log(`Result: HTTP ${res.status}`, data);
    } catch (err) {
      console.error(`Failed to push contact ${i + 1}:`, err.message);
    }
    // Small pause between requests
    await new Promise((resolve) => setTimeout(resolve, 1200));
  }

  console.log("\n=== Direct Data Push Complete! ===");
}

pushData().catch((err) => {
  console.error("Fatal error during data push:", err);
  process.exit(1);
});
