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
    // Get all form_status entries
    const { data: formStatuses, error: fetchError } = await supabase
      .from("form_status")
      .select("*");

    if (fetchError) {
      console.error("Error fetching form statuses:", fetchError);
      return NextResponse.json(
        { success: false, error: fetchError.message },
        { status: 500 }
      );
    }

    if (!formStatuses || formStatuses.length === 0) {
      return NextResponse.json({
        success: true,
        message: "No form status entries found to update",
      });
    }

    // Keep track of updated entries
    let updatedCount = 0;
    let errors = [];

    // Update each entry if needed
    for (const status of formStatuses) {
      // Skip if both title and description are already set
      if (status.title && status.description) continue;

      // Generate title and description based on form_type
      let title = status.title || "";
      let description = status.description || "";

      if (!title) {
        if (status.form_type === "campus-ambassador") {
          title = "Campus Ambassador";
          description =
            description || "Form for campus ambassador registrations";
        } else if (status.form_type === "formx1") {
          title = "FormX1";
          description =
            description || "First form type for general submissions";
        } else if (status.form_type === "formx4") {
          title = "FormX4";
          description =
            description || "Fourth form type for specialized submissions";
        } else {
          // Fallback for unknown form types
          title =
            status.form_type.charAt(0).toUpperCase() +
            status.form_type.slice(1).replace(/-/g, " ");
          description =
            description || `Form for ${status.form_type} submissions`;
        }
      }

      // Update the entry
      const { error: updateError } = await supabase
        .from("form_status")
        .update({ title, description })
        .eq("id", status.id);

      if (updateError) {
        console.error(
          `Error updating form status ${status.form_type}:`,
          updateError
        );
        errors.push({
          form_type: status.form_type,
          error: updateError.message,
        });
      } else {
        updatedCount++;
      }
    }

    return NextResponse.json({
      success: true,
      message: `Updated ${updatedCount} form status entries`,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error) {
    console.error("Unexpected error updating form statuses:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
