import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const body = await request.json();
    const { submissionId } = body;

    if (!submissionId) {
      return NextResponse.json(
        { success: false, error: "Missing submissionId parameter" },
        { status: 400 }
      );
    }

    // Get Supabase credentials
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json(
        { success: false, error: "Missing Supabase credentials" },
        { status: 500 }
      );
    }

    // Create Supabase client with service key for admin operations
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Delete the submission
    const { error } = await supabase
      .from("form_submissions")
      .delete()
      .eq("id", submissionId);

    if (error) {
      console.error("Error deleting submission:", error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Submission deleted successfully`,
    });
  } catch (error) {
    console.error("Error deleting submission:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to delete submission",
      },
      { status: 500 }
    );
  }
}
