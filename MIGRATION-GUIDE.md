# Formify Database Migration Guide

This guide details the process of adding dedicated columns for 'full_name' and 'whatsapp' to the form_submissions table and migrating existing data from the JSON data column.

## Overview

### Background

The Campus Ambassador form submissions currently store 'full_name' and 'whatsapp' inside the JSONB `form_data` column. This migration:

1. Adds dedicated columns `full_name` and `whatsapp` to the table
2. Migrates existing data from `form_data` to these dedicated columns
3. Updates the admin dashboard to use these dedicated columns for display

### Benefits

- Improved database performance for searches and filtering
- Better data organization and structure
- Easier data extraction for reporting

## Migration Steps

### Step 1: Environment Setup

1. Set up environment variables:

   - In your application's environment, set `MIGRATION_API_KEY` to a secure value
   - This same value will be used in the migration scripts

2. Install dependencies for migration scripts:

   ```
   cd scripts
   npm install
   ```

3. Create `.env` file in the `scripts` directory:
   ```
   cp .env.example .env
   ```
4. Update the values in `.env` to match your environment.

### Step 2: Run the Migration

Run the migration script:

```
cd scripts
npm run migrate
```

The script will:

1. Add the new columns to the form_submissions table
2. Migrate existing data from the form_data field to the dedicated columns

### Step 3: Manual Migration (if needed)

If the automatic migration fails, you can manually execute the SQL:

1. Log in to your Supabase dashboard
2. Go to the SQL Editor
3. Execute the following SQL:

```sql
-- Add the columns
ALTER TABLE form_submissions
ADD COLUMN IF NOT EXISTS full_name TEXT,
ADD COLUMN IF NOT EXISTS whatsapp TEXT;

-- Migrate the data for campus ambassador form type
UPDATE form_submissions
SET
  full_name = form_data->>'fullName',
  whatsapp = form_data->>'whatsapp'
WHERE
  form_type = 'campus-ambassador' AND
  form_data IS NOT NULL;
```

### Step 4: Verify the Migration

Verify the migration by checking the database:

```sql
SELECT id, form_type, full_name, whatsapp, form_data->>'fullName' as json_full_name
FROM form_submissions
WHERE form_type = 'campus-ambassador'
LIMIT 10;
```

Ensure the values in `full_name` and `whatsapp` match those in the JSON fields.

## Code Changes Completed

The following code changes have been made as part of this migration:

1. **API Endpoints**:

   - Created `/api/db-migration/modify-form-submissions` endpoint to add columns
   - Created `/api/db-migration/migrate-existing-data` endpoint to move data
   - Updated search functionality to include the new dedicated columns

2. **Admin Dashboard**:

   - Updated admin page to use the dedicated columns for campus ambassador forms
   - Enhanced display logic to fall back to JSON values if dedicated columns are empty

3. **Data Processing**:
   - Updated the form submission processing to populate both dedicated columns and JSON data

## Future Considerations

1. **New Forms**: All new Campus Ambassador form submissions will store data in both the dedicated columns and the JSON `form_data` column for backward compatibility.

2. **Further Migrations**: Consider adding more dedicated columns for frequently searched fields in the future.

3. **JSON Storage**: We still maintain the complete form data in the JSON column for flexibility, which allows adding new form fields without requiring schema changes.

## Troubleshooting

If you encounter issues during migration:

1. **Database Connection Errors**:

   - Verify your Supabase credentials in the application environment
   - Check network connectivity to your Supabase instance

2. **Permission Errors**:

   - Ensure your service role key has permission to modify table structure
   - Verify your migration API key matches in both application and script

3. **Data Inconsistencies**:
   - If data isn't migrated correctly, check the JSON field names in the source data
   - Run a custom SQL query to fix specific records

For additional assistance, contact the development team.
