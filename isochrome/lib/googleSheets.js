/**
 * Google Sheets Integration
 * Appends contact form submissions to a Google Sheet
 */

import { google } from "googleapis";

const sheets = google.sheets("v4");

/**
 * Get authenticated Google Sheets client
 */
function getAuthClient() {
  // Check for service account JSON first (recommended for production)
  if (process.env.GOOGLE_SERVICE_ACCOUNT_JSON) {
    try {
      const serviceAccount = JSON.parse(
        process.env.GOOGLE_SERVICE_ACCOUNT_JSON
      );
      return google.auth.getClient({
        credentials: serviceAccount,
        scopes: ["https://www.googleapis.com/auth/spreadsheets"],
      });
    } catch (error) {
      console.error("Error parsing service account JSON:", error);
      throw new Error(
        `Failed to parse GOOGLE_SERVICE_ACCOUNT_JSON: ${error.message}`
      );
    }
  }

  // Fallback to API key (if service account not available)
  const apiKey = process.env.GOOGLE_SHEETS_API_KEY;
  if (!apiKey) {
    throw new Error(
      "Neither GOOGLE_SERVICE_ACCOUNT_JSON nor GOOGLE_SHEETS_API_KEY environment variables are set"
    );
  }

  return google.auth.fromAPIKey(apiKey);
}

/**
 * Append data to Google Sheets
 * @param {Object} data - { name, email, timestamp }
 */
export async function appendToGoogleSheets(data) {
  try {
    const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID;
    if (!spreadsheetId) {
      throw new Error("GOOGLE_SPREADSHEET_ID environment variable not set");
    }

    const auth = await getAuthClient();

    const request = {
      spreadsheetId,
      range: "Sheet1!A:D", // Adjust range based on your sheet structure
      valueInputOption: "USER_ENTERED",
      resource: {
        values: [
          [
            data.name,
            data.email,
            data.timestamp,
            "New", // Status column
          ],
        ],
      },
      auth,
    };

    const response = await sheets.spreadsheets.values.append(request);
    console.log("Data appended to Google Sheets:", response.status);
    return response;
  } catch (error) {
    console.error("Error appending to Google Sheets:", error);
    throw new Error(
      `Failed to save data: ${error.message || "Unknown error"}`
    );
  }
}

/**
 * Get all subscriber data from Google Sheets (for admin purposes)
 */
export async function getSubscribers() {
  try {
    const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID;
    if (!spreadsheetId) {
      throw new Error("GOOGLE_SPREADSHEET_ID environment variable not set");
    }

    const auth = await getAuthClient();

    const request = {
      spreadsheetId,
      range: "Sheet1!A:D",
      auth,
    };

    const response = await sheets.spreadsheets.values.get(request);
    return response.data.values || [];
  } catch (error) {
    console.error("Error retrieving subscribers:", error);
    throw error;
  }
}
