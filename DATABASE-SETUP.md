# Formify Database Setup Guide

This guide provides instructions for setting up the Formify database from scratch using Supabase. Follow these steps to create all necessary tables with the optimized structure.

## Overview

The Formify application uses two main tables:

1. **form_submissions** - Stores all form submissions
   - Uses a flexible schema with a JSONB column for form-specific data
   - Has dedicated columns for frequently accessed fields
2. **form_status** - Tracks which forms are active/inactive
   - Controls whether forms accept new submissions
   - Includes display metadata (title, description)

## Setup Options

You have several options to set up the database:

### Option 1: Using the Supabase Dashboard (Recommended for Beginners)

1. Log in to your Supabase dashboard
2. Navigate to the SQL Editor
3. Execute the following SQL scripts in order:
   - First: `supabase/create_exec_sql_function.sql` (creates the SQL execution function)
   - Second: `supabase/form_submissions_table.sql` (creates the main submission table)
   - Third: `supabase/form_status_table.sql` (creates the form status table)

### Option 2: Using the Setup Script (Recommended for Most Users)

Prerequisites:

- `curl` and `jq` installed on your system
- Supabase URL and service role key

Run the setup script:

```bash
# Set environment variables
export SUPABASE_URL=your_supabase_url
export SUPABASE_KEY=your_service_role_key

# Navigate to the supabase directory
cd supabase

# Run the setup script
./setup_db.sh
```

### Option 3: Using the Supabase CLI (Advanced Users)

If you have the Supabase CLI set up:

```bash
supabase db push
```

## Verifying the Setup

To verify that your tables were created successfully:

1. Go to the Supabase dashboard
2. Navigate to the Table Editor
3. You should see `form_submissions` and `form_status` tables
4. Check that the `form_status` table has entries for all form types:
   - formx1
   - formx4
   - campus-ambassador

## Troubleshooting

### Common Issues

1. **Missing exec_sql Function**

   - Ensure you've created the exec_sql function first
   - Check the Supabase logs for any errors

2. **Permission Issues**

   - Verify you're using the service role key (not the anon key)
   - Check that RLS policies are set up correctly

3. **Table Already Exists**
   - Our SQL uses `CREATE TABLE IF NOT EXISTS` so it's safe to run multiple times
   - Drop the tables first if you want to start completely fresh

### Manual Table Creation

If you encounter issues with the automated setup, you can create the tables manually in the Supabase SQL Editor:

```sql
-- Create the exec_sql function
CREATE OR REPLACE FUNCTION exec_sql(sql text)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  EXECUTE sql;
  RETURN json_build_object('success', true);
EXCEPTION
  WHEN OTHERS THEN
    RETURN json_build_object(
      'success', false,
      'error', SQLERRM,
      'detail', SQLSTATE
    );
END;
$$;

-- Secure the function
REVOKE ALL ON FUNCTION exec_sql(text) FROM public, anon, authenticated;
GRANT EXECUTE ON FUNCTION exec_sql(text) TO service_role;

-- Create form_submissions table
CREATE TABLE IF NOT EXISTS form_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  form_type TEXT NOT NULL,
  email TEXT,
  full_name TEXT,
  whatsapp TEXT,
  form_data JSONB DEFAULT '{}'::jsonb NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create form_status table
CREATE TABLE IF NOT EXISTS form_status (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  form_type TEXT UNIQUE NOT NULL,
  is_active BOOLEAN DEFAULT true NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Insert initial form types
INSERT INTO form_status (form_type, title, description, is_active)
VALUES
  ('formx1', 'FormX1', 'First form type for general submissions', true),
  ('formx4', 'FormX4', 'Fourth form type for specialized submissions', true),
  ('campus-ambassador', 'Campus Ambassador', 'Form for campus ambassador registrations', true)
ON CONFLICT (form_type) DO UPDATE
SET title = EXCLUDED.title,
    description = EXCLUDED.description;
```

## Next Steps

After setting up the database:

1. Ensure your environment variables are configured correctly in your application
2. Test form submissions to verify data is being stored correctly
3. Check the admin dashboard to confirm you can view and manage form submissions
