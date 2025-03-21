import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Migration API key for security
const MIGRATION_API_KEY =
  process.env.MIGRATION_API_KEY || "secure-migration-key";

export async function POST(request) {
  // Verify API key
  const authHeader = request.headers.get("authorization");
  const token = authHeader && authHeader.split(" ")[1];

  if (token !== MIGRATION_API_KEY) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    // Execute SQL to add columns to form_submissions table directly
    const sqlCommand = `
      ALTER TABLE form_submissions 
      ADD COLUMN IF NOT EXISTS full_name TEXT,
      ADD COLUMN IF NOT EXISTS whatsapp TEXT;
    `;

    // With service role key, we can execute raw SQL
    const { error } = await supabase
      .from("form_submissions")
      .select("id")
      .limit(1)
      .then(async () => {
        // This first query just ensures the connection works
        // Now execute the actual SQL using PostgreSQL extension
        return await supabase.rpc("exec_sql", {
          sql: sqlCommand,
        });
      });

    if (error) {
      console.error("Error modifying table:", error);

      // If direct execution fails, provide SQL for manual execution
      return NextResponse.json(
        {
          success: false,
          error: error.message,
          manualInstructions: {
            message: "Please execute this SQL in the Supabase SQL editor:",
            sql: sqlCommand,
          },
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message:
        "Successfully added full_name and whatsapp columns to form_submissions table",
    });
  } catch (error) {
    console.error("Unexpected error during migration:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        suggestion:
          "You may need to run the SQL manually in the Supabase dashboard SQL editor.",
      },
      { status: 500 }
    );
  }
}
