// Migration script to add dedicated columns for full_name and whatsapp
// and migrate existing data from form_data to these columns

import fetch from "node-fetch";

// Configure these values as needed
const BASE_URL = process.env.MIGRATION_BASE_URL || "http://localhost:3000";
const MIGRATION_KEY = process.env.MIGRATION_KEY || "secure-migration-key";

// Function to run a migration endpoint
async function runMigration(endpoint) {
  try {
    console.log(`Running migration: ${endpoint}`);

    const response = await fetch(`${BASE_URL}/api/db-migration/${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${MIGRATION_KEY}`,
      },
    });

    const result = await response.json();

    if (response.ok && result.success) {
      console.log(`✅ Migration successful: ${result.message}`);
      return true;
    } else {
      console.error(`❌ Migration failed: ${result.error || "Unknown error"}`);
      return false;
    }
  } catch (error) {
    console.error(`❌ Error running migration: ${error.message}`);
    return false;
  }
}

// Main function to run migrations in sequence
async function runMigrations() {
  console.log("Starting database migrations...");

  // Step 1: Modify table structure to add columns
  const step1 = await runMigration("modify-form-submissions");
  if (!step1) {
    console.error("Failed to add columns to form_submissions table. Aborting.");
    process.exit(1);
  }

  // Step 2: Migrate existing data to the new columns
  const step2 = await runMigration("migrate-existing-data");
  if (!step2) {
    console.error("Failed to migrate existing data. Migration incomplete.");
    process.exit(1);
  }

  console.log("All migrations completed successfully!");
  console.log(
    "The form_submissions table now has dedicated columns for full_name and whatsapp."
  );
}

// Run the migrations
runMigrations().catch((error) => {
  console.error("Unhandled error during migration:", error);
  process.exit(1);
});
