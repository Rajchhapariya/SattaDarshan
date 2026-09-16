/**
 * SattaDarshan - Google Sheets Integration Helper
 * 
 * Routes user Contact messages and Correction reports to a private Google Sheet
 * via a secure Google Apps Script Web App endpoint.
 * 
 * Note: Submissions are NEVER written to MongoDB or local storage.
 */

export type CorrectionPayload = {
  action: "correction";
  submittedAt: string;
  correctionType: string;
  entityType: string;
  entitySlug: string;
  description: string;
  proposedCorrection: string;
  sourceUrl?: string;
  userEmail?: string;
  status: "Pending";
  secretToken?: string;
};

export type ContactPayload = {
  action: "contact";
  submittedAt: string;
  subject: string;
  message: string;
  userEmail?: string;
  status: "Unread";
  secretToken?: string;
};

export type AppsScriptResponse = {
  success: boolean;
  message?: string;
  error?: string;
  status?: string;
};

export async function sendToGoogleAppsScript(
  payload: CorrectionPayload | ContactPayload
): Promise<AppsScriptResponse> {
  // Use environment variable if set, with verified working Apps Script Web App endpoint fallback
  const scriptUrl =
    process.env.GOOGLE_APPS_SCRIPT_URL?.trim() ||
    "https://script.google.com/macros/s/AKfycbznsKqh8wPvMtwwVeqInwlEQCzK8kuXkAueDm93p5RGn83PheOwlH3qCOvzHO_omiJ5/exec";

  // If secret token is configured, append it to prevent unauthorized direct POSTs to Apps Script
  const secretToken = process.env.APPS_SCRIPT_SECRET?.trim();
  if (secretToken) {
    payload.secretToken = secretToken;
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    // Google Apps Script Web Apps reliably parse incoming JSON payloads when sent with text/plain;charset=utf-8,
    // avoiding Google Drive CORS/411 redirect proxy hangs.
    const res = await fetch(scriptUrl, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain;charset=utf-8",
      },
      body: JSON.stringify(payload),
      redirect: "follow", // Crucial for Google Apps Script 302 echo redirect
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const text = await res.text();
    let data: any;

    try {
      data = JSON.parse(text);
    } catch {
      console.error("[Google Sheets Integration] Non-JSON response from Google Apps Script:", text.slice(0, 300));
      throw new Error("Received an invalid response from the spreadsheet service.");
    }

    if (!res.ok || data.success === false) {
      throw new Error(data.error || "Failed to record submission in Google Sheet.");
    }

    return data;
  } catch (err: any) {
    if (err.name === "AbortError") {
      console.error("[Google Sheets Integration] Request timed out after 15 seconds.");
      throw new Error("Submission service timed out. Please check your connection and try again.");
    }
    console.error("[Google Sheets Integration] Error forwarding to Google Apps Script:", err.message);
    throw err;
  }
}
