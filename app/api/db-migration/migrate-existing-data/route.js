import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    // For security, we should require an API key or other authentication
    const { headers } = request;
    const authHeader = headers.get("authorization");
    const expectedKey = process.env.MIGRATION_KEY || "secure-migration-key";

    if (!authHeader || authHeader !== `Bearer ${expectedKey}`) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get Supabase credentials
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing Supabase credentials",
        },
        { status: 500 }
      );
    }

    // Create Supabase client with service key
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // 1. Fetch all campus-ambassador submissions
    const { data: submissions, error: fetchError } = await supabase
      .from("form_submissions")
      .select("id, form_data")
      .eq("form_type", "campus-ambassador");

    if (fetchError) {
      return NextResponse.json(
        {
          success: false,
          error: `Failed to fetch submissions: ${fetchError.message}`,
        },
        { status: 500 }
      );
    }

    console.log(
      `Found ${submissions.length} campus ambassador submissions to migrate`
    );

    // 2. Process each submission and update the dedicated columns
    const updates = [];
    const errors = [];

    for (const submission of submissions) {
      try {
        // Parse form_data if it's a string
        let formData = submission.form_data;
        if (typeof formData === "string") {
          formData = JSON.parse(formData);
        }

        // Extract full_name and whatsapp from form_data
        const { full_name, whatsapp } = formData;

        // Update the submission with the extracted values
        const { error: updateError } = await supabase
          .from("form_submissions")
          .update({
            full_name: full_name || null,
            whatsapp: whatsapp || null,
          })
          .eq("id", submission.id);

        if (updateError) {
          console.error(
            `Error updating submission ${submission.id}:`,
            updateError
          );
          errors.push({ id: submission.id, error: updateError.message });
        } else {
          updates.push(submission.id);
        }
      } catch (error) {
        console.error(`Error processing submission ${submission.id}:`, error);
        errors.push({ id: submission.id, error: error.message });
      }
    }

    return NextResponse.json({
      success: true,
      message: `Migration completed: ${updates.length} submissions updated successfully, ${errors.length} errors`,
      updates,
      errors,
    });
  } catch (error) {
    console.error("Error during migration:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "An unexpected error occurred",
      },
      { status: 500 }
    );
  }
}
