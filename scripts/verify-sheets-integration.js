const { GoogleSpreadsheet } = require("google-spreadsheet");
const { JWT } = require("google-auth-library");
require("dotenv").config();

async function verifyGoogleSheetsIntegration() {
  try {
    console.log("Verifying Google Sheets integration...");

    // Check for required environment variables
    const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
    const key = process.env.GOOGLE_PRIVATE_KEY;
    const sheetId = process.env.GOOGLE_SHEET_ID;

    console.log("Google Service Account Email:", email);
    console.log("Google Private Key available:", !!key);
    console.log("Google Sheet ID:", sheetId);

    if (!email || !key || !sheetId) {
      console.error("Missing Google Sheets credentials");
      return;
    }

    // Format the key properly
    let cleanedKey = key;
    if (key.includes("\\n")) {
      cleanedKey = key.replace(/\\n/g, "\n");
    }

    // Initialize auth with service account credentials
    const serviceAccountAuth = new JWT({
      email: email,
      key: cleanedKey,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    console.log("JWT authentication initialized successfully");

    // Initialize the sheet
    const doc = new GoogleSpreadsheet(sheetId, serviceAccountAuth);

    // Load document
    await doc.loadInfo();
    console.log("Sheet loaded successfully. Title:", doc.title);
    console.log("Available sheets:", Object.keys(doc.sheetsByTitle).join(", "));

    // Check if campus-ambassador sheet exists
    const campusAmbassadorSheet = doc.sheetsByTitle["campus-ambassador"];
    if (campusAmbassadorSheet) {
      console.log("Campus Ambassador sheet exists");

      // Get rows
      const rows = await campusAmbassadorSheet.getRows();
      console.log(`Found ${rows.length} rows in the Campus Ambassador sheet`);

      if (rows.length > 0) {
        console.log("Last row data:");
        const lastRow = rows[rows.length - 1];
        console.log("- Timestamp:", lastRow.timestamp);
        console.log("- Name:", lastRow.full_name);
        console.log("- Email:", lastRow.email);
        console.log("- WhatsApp:", lastRow.whatsapp);
      } else {
        console.log("No rows found in the Campus Ambassador sheet");
      }
    } else {
      console.log("Campus Ambassador sheet does not exist");
    }

    console.log("Verification complete");
  } catch (error) {
    console.error("Error verifying Google Sheets integration:", error);
  }
}

verifyGoogleSheetsIntegration();
