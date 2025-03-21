// Script to update form_status entries that are missing title or description
import fetch from "node-fetch";

// Configure these values
const BASE_URL = process.env.MIGRATION_BASE_URL || "http://localhost:3000";
const MIGRATION_KEY = process.env.MIGRATION_KEY || "secure-migration-key";

async function updateFormStatusTitles() {
  try {
    console.log("Updating form status titles and descriptions...");

    const response = await fetch(
      `${BASE_URL}/api/db-migration/update-form-status-titles`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${MIGRATION_KEY}`,
        },
      }
    );

    const result = await response.json();

    if (response.ok && result.success) {
      console.log(`✅ Success: ${result.message}`);

      if (result.errors && result.errors.length > 0) {
        console.log("\nSome entries had errors:");
        result.errors.forEach((err) => {
          console.log(`- ${err.form_type}: ${err.error}`);
        });
      }
    } else {
      console.error(`❌ Error: ${result.error || "Unknown error"}`);
      process.exit(1);
    }
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1);
  }
}

// Run the update
updateFormStatusTitles();
