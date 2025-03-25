# Formify Database Migration Scripts

This directory contains scripts to migrate the Formify database schema and data. The current migration adds dedicated columns for `full_name` and `whatsapp` in the `form_submissions` table, and migrates existing data from the JSONB `form_data` column to these new columns.

## Prerequisites

- Node.js 16+
- npm or yarn
- Access to the Formify application and Supabase database

## Setup

1. Install dependencies:

   ```
   npm install
   ```

2. Set environment variables (create a `.env` file in this directory):
   ```
   MIGRATION_BASE_URL=http://localhost:3000 # or your deployed app URL
   MIGRATION_KEY=secure-migration-key # match this with the value in your app
   ```

## Running the Migration

Execute the migration script:

```
npm run migrate
```

This will:

1. Add the new columns to the `form_submissions` table
2. Migrate existing data from the `form_data` JSONB column to the dedicated columns

## Manual Migration (if needed)

If the automated migration fails, you can perform the migration manually:

1. Log in to your Supabase dashboard
2. Go to the SQL Editor
3. Execute the following SQL:

```sql
-- Add the columns
ALTER TABLE form_submissions
ADD COLUMN IF NOT EXISTS full_name TEXT,
ADD COLUMN IF NOT EXISTS whatsapp TEXT;

-- Migrate the data (for campus ambassador form type)
UPDATE form_submissions
SET
  full_name = form_data->>'fullName',
  whatsapp = form_data->>'whatsapp'
WHERE
  form_type = 'campus-ambassador' AND
  form_data IS NOT NULL;

-- For other form types, adjust the field names as needed
```

## Verification

After migration, verify that the data has been correctly migrated by querying the database:

```sql
SELECT id, form_type, full_name, whatsapp, form_data->>'fullName' as json_full_name, form_data->>'whatsapp' as json_whatsapp
FROM form_submissions
WHERE form_type = 'campus-ambassador'
LIMIT 10;
```

The values in `full_name` and `whatsapp` columns should match the corresponding values in the JSONB fields.
