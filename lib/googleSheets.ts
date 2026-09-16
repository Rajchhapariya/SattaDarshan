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
  const scriptUrl = process.env.GOOGLE_APPS_SCRIPT_URL?.trim();

  // If secret token is configured, append it to prevent unauthorized direct POSTs to Apps Script
  const secretToken = process.env.APPS_SCRIPT_SECRET?.trim();
  if (secretToken) {
    payload.secretToken = secretToken;
  }

  // Graceful fallback for local development before the user deploys the Apps Script
  if (!scriptUrl) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        "[Google Sheets Integration] GOOGLE_APPS_SCRIPT_URL is not configured in .env.local.\n" +
        "Payload prepared for private Google Sheet:\n",
        JSON.stringify(payload, null, 2)
      );
      return {
        success: true,
        message: "Development mode: Submission verified and logged (GOOGLE_APPS_SCRIPT_URL not yet configured).",
        status: payload.status,
      };
    }

    console.error("[Google Sheets Integration] Error: GOOGLE_APPS_SCRIPT_URL is not set.");
    throw new Error("Submission service is currently being configured on the server.");
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    const res = await fetch(scriptUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
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
