import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    // Extract query parameters
    const { searchParams } = new URL(request.url);
    const formType = searchParams.get("form_type");
    const limit = parseInt(searchParams.get("limit") || "100");
    const offset = parseInt(searchParams.get("offset") || "0");

    // Initialize Supabase client
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json(
        { success: false, error: "Supabase credentials not configured" },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Build the query
    let query = supabase
      .from("form_submissions")
      .select("*")
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    // Apply form type filter if provided
    if (formType) {
      query = query.eq("form_type", formType);
    }

    // Execute the query
    const { data, error /* count */ } = await query;

    if (error) {
      console.error("Error fetching form submissions:", error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    // Get total count separately
    const { count: _count, error: countError } = await supabase
      .from("form_submissions")
      .select("*", { count: "exact", head: true })
      .eq(formType ? "form_type" : "id", formType || data[0]?.id || "");

    if (countError) {
      console.error("Error counting form submissions:", countError);
    }

    return NextResponse.json({
      success: true,
      data,
      pagination: {
        total: _count || 0,
        offset,
        limit,
        hasMore: offset + limit < (_count || 0),
      },
    });
  } catch (error) {
    console.error("Unexpected error in form submissions API:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
