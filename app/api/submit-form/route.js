import { GoogleSpreadsheet } from "google-spreadsheet";
import { JWT } from "google-auth-library";
import { NextResponse } from "next/server";

export async function POST(request) {
  console.log("Google Sheets API route called");

  try {
    // Check for required environment variables
    const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
    const key = process.env.GOOGLE_PRIVATE_KEY;
    const sheetId = process.env.GOOGLE_SHEET_ID;

    console.log("Google Service Account Email:", email);
    console.log(
      "Google Private Key (first 20 chars):",
      key ? key.substring(0, 20) + "..." : "undefined"
    );
    console.log("Google Sheet ID:", sheetId);

    if (!email || !key || !sheetId) {
      console.error("Missing Google Sheets credentials");
      return NextResponse.json(
        {
          success: false,
          error: "Server configuration error",
          details: {
            email: !email
              ? "Missing GOOGLE_SERVICE_ACCOUNT_EMAIL"
              : "Available",
            key: !key ? "Missing GOOGLE_PRIVATE_KEY" : "Available",
            sheetId: !sheetId ? "Missing GOOGLE_SHEET_ID" : "Available",
          },
        },
        { status: 500 }
      );
    }

    // Parse the form data early to ensure it's valid
    let formData;
    try {
      formData = await request.json();
      console.log(
        "Form data received in API route:",
        JSON.stringify(formData, null, 2)
      );
    } catch (parseError) {
      console.error("Error parsing request body:", parseError);
      return NextResponse.json(
        { success: false, error: "Invalid request body" },
        { status: 400 }
      );
    }

    // Initialize auth with service account credentials
    let serviceAccountAuth;
    try {
      // Add more detailed logging
      console.log("Initializing JWT with email:", email);

      // Fix the key format - this is the critical part
      let cleanedKey = key;

      // Display the first few and last few characters of the key for debugging
      if (key) {
        console.log("Key format check:");
        console.log(
          "- Starts with BEGIN PRIVATE KEY:",
          key.includes("-----BEGIN PRIVATE KEY-----")
        );
        console.log(
          "- Ends with END PRIVATE KEY:",
          key.includes("-----END PRIVATE KEY-----")
        );
        console.log("- Contains \\n:", key.includes("\\n"));
      }

      // Properly format the key regardless of its current format
      // This handles multiple possible formats of the key
      if (key.includes("\\n")) {
        // Key has escaped newlines - common in environment variables
        cleanedKey = key.replace(/\\n/g, "\n");
      } else if (!key.includes("BEGIN PRIVATE KEY")) {
        // Key is probably base64 encoded without proper PEM format
        cleanedKey =
          "-----BEGIN PRIVATE KEY-----\n" +
          key +
          "\n-----END PRIVATE KEY-----\n";
      }

      // Double-check the formatting
      if (!cleanedKey.startsWith("-----BEGIN PRIVATE KEY-----")) {
        cleanedKey = "-----BEGIN PRIVATE KEY-----\n" + cleanedKey;
      }
      if (!cleanedKey.endsWith("-----END PRIVATE KEY-----")) {
        cleanedKey = cleanedKey + "\n-----END PRIVATE KEY-----";
      }

      console.log("JWT key formatted successfully");

      // Create the JWT with the cleaned key
      serviceAccountAuth = new JWT({
        email: email,
        key: cleanedKey,
        scopes: ["https://www.googleapis.com/auth/spreadsheets"],
      });

      console.log("JWT authentication initialized successfully");
    } catch (authError) {
      console.error("Error initializing JWT auth:", authError);
      return NextResponse.json(
        {
          success: false,
          error: `Authentication error: ${authError.message}`,
          details:
            "There was an issue with the service account credentials. Please check the format of your GOOGLE_PRIVATE_KEY.",
        },
        { status: 500 }
      );
    }

    // Initialize the sheet
    const doc = new GoogleSpreadsheet(sheetId, serviceAccountAuth);

    // Load document with a simple try/catch
    try {
      console.log("Loading Google Sheet with ID:", sheetId);
      await doc.loadInfo();
      console.log("Sheet loaded successfully. Title:", doc.title);
      console.log("Sheet details:", {
        title: doc.title,
        sheetCount: doc.sheetCount,
        availableSheets: Object.keys(doc.sheetsByTitle),
      });
    } catch (loadError) {
      console.error("Error loading Google Sheet:", loadError);
      console.error("Error details:", JSON.stringify(loadError, null, 2));

      // Check for specific error types
      if (loadError.message && loadError.message.includes("invalid_grant")) {
        return NextResponse.json(
          {
            success: false,
            error: `Failed to load sheet: Invalid grant. This is usually due to incorrect credentials or clock skew.`,
            details: loadError.message,
          },
          { status: 500 }
        );
      }

      if (loadError.message && loadError.message.includes("permission")) {
        return NextResponse.json(
          {
            success: false,
            error: `Permission denied. Make sure the service account has access to the spreadsheet.`,
            details: loadError.message,
          },
          { status: 403 }
        );
      }

      return NextResponse.json(
        {
          success: false,
          error: `Failed to load sheet: ${loadError.message}`,
          details:
            "There was an issue accessing the Google Sheet. Please verify the sheet ID and service account permissions.",
        },
        { status: 500 }
      );
    }

    // Get the first sheet
    let sheet;
    try {
      // Try to find a sheet with the form type name first
      const formType = formData.form_type || "formx1";
      console.log(`Looking for sheet with title: ${formType}`);

      // Look for a sheet with the form type name, or create one if it doesn't exist
      sheet = doc.sheetsByTitle[formType];

      if (!sheet) {
        // If no sheet exists for this form type, create a new one
        console.log(
          `No sheet found for form type ${formType}, creating new sheet...`
        );

        if (formType === "campus-ambassador") {
          // Create sheet with appropriate headers for campus ambassador form
          console.log("Creating campus-ambassador sheet with specific headers");
          sheet = await doc.addSheet({
            title: formType,
            headerValues: [
              "timestamp",
              "full_name",
              "email",
              "whatsapp",
              "college",
              "year_of_study",
              "motivation",
              "strategy",
              "form_type",
            ],
          });
        } else {
          // Create sheet with headers for formx1/formx4 forms
          console.log(`Creating ${formType} sheet with standard headers`);
          sheet = await doc.addSheet({
            title: formType,
            headerValues: [
              "timestamp",
              "first_name",
              "email",
              "whatsapp",
              "preference",
              "occupation",
              "form_type",
              "recommendation",
              "income",
              "frontend_interest",
              "form_data",
            ],
          });
        }

        console.log(`Created new sheet: ${sheet.title}`);
      } else {
        console.log(`Using existing sheet: ${sheet.title}`);

        try {
          const headers = await sheet.headerValues;
          console.log(`Sheet headers: ${headers.join(", ")}`);
        } catch (headerError) {
          console.error("Error getting sheet headers:", headerError);
        }
      }
    } catch (sheetError) {
      console.error("Error accessing or creating sheet:", sheetError);
      console.error("Error details:", JSON.stringify(sheetError, null, 2));

      // Return more specific error message
      if (sheetError.message && sheetError.message.includes("permission")) {
        return NextResponse.json(
          {
            success: false,
            error: `Permission denied. Make sure the service account has edit access to the spreadsheet.`,
            details: sheetError.message,
          },
          { status: 403 }
        );
      }

      // Fallback to the first sheet if we can't find or create a specific sheet
      try {
        console.log("Attempting to fall back to first sheet");
        sheet = doc.sheetsByIndex[0];
        if (!sheet) {
          throw new Error("No sheets found in the document");
        }
        console.log("Falling back to first sheet:", sheet.title);
      } catch (fallbackError) {
        console.error("Error accessing fallback sheet:", fallbackError);
        return NextResponse.json(
          {
            success: false,
            error: `Sheet access error: ${fallbackError.message}`,
          },
          { status: 500 }
        );
      }
    }

    // Add a row with the form data
    try {
      console.log("Preparing to add row to sheet...");

      // Handle different form types
      if (formData.form_type === "campus-ambassador") {
        // Campus Ambassador form has different field structure
        const rowData = {
          timestamp: new Date().toISOString(),
          full_name: formData.fullName || "",
          email: formData.email || "",
          whatsapp: formData.whatsapp || "",
          college: formData.college || "",
          year_of_study: formData.yearOfStudy || "",
          motivation: formData.motivation || "",
          strategy: formData.strategy || "",
          form_type: formData.form_type || "campus-ambassador",
        };

        console.log(
          "Adding campus-ambassador row:",
          JSON.stringify(rowData, null, 2)
        );
        await sheet.addRow(rowData);
      } else {
        // Original formx1 and formx4 forms
        // Prepare form-specific fields
        const formSpecificData = {};

        // Add form-specific fields based on what's available
        if (formData.recommendation !== undefined) {
          formSpecificData.recommendation = formData.recommendation;
        }

        if (formData.income !== undefined) {
          formSpecificData.income = formData.income;
        }

        if (formData.frontendInterest !== undefined) {
          formSpecificData.frontend_interest = formData.frontendInterest;
        }

        const rowData = {
          timestamp: new Date().toISOString(),
          first_name: formData.firstName || "",
          email: formData.email || "",
          whatsapp: formData.whatsapp || "",
          preference: formData.preference || "",
          occupation: formData.occupation || "",
          form_type: formData.form_type || "formx1",
          // Add form-specific fields
          recommendation: formSpecificData.recommendation || "",
          income: formSpecificData.income || "",
          frontend_interest: formSpecificData.frontend_interest || "",
          // Add a JSON string of all form-specific data for future reference
          form_data: JSON.stringify(formSpecificData),
        };

        console.log(
          `Adding ${formData.form_type} row:`,
          JSON.stringify(rowData, null, 2)
        );
        await sheet.addRow(rowData);
      }

      console.log("Row added successfully to sheet");
    } catch (rowError) {
      console.error("Error adding row to sheet:", rowError);
      console.error("Error details:", JSON.stringify(rowError, null, 2));

      // Check for specific error types
      if (rowError.message && rowError.message.includes("permission")) {
        return NextResponse.json(
          {
            success: false,
            error: `Permission denied when adding row. Make sure the service account has edit access.`,
            details: rowError.message,
          },
          { status: 403 }
        );
      }

      return NextResponse.json(
        { success: false, error: `Failed to add row: ${rowError.message}` },
        { status: 500 }
      );
    }

    console.log("Google Sheets submission completed successfully");
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error adding data to Google Sheet:", error);
    console.error("Error details:", JSON.stringify(error, null, 2));
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
