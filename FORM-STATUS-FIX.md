# Form Status Not-Null Constraint Error Fix

This guide addresses the error: `Failed to update form status: null value in column "title" of relation "form_status" violates not-null constraint`

## What Happened?

The error occurs when trying to toggle a form's active status on the admin dashboard. This is happening because:

1. The new `form_status` table schema now requires a `title` column that cannot be null
2. The existing code attempting to update form status doesn't include this required field

## How It Was Fixed

Two changes were made to fix this issue:

1. **Updated the `toggle-form-status` API endpoint** to:

   - Check for existing form data to preserve any title and description already set
   - Generate sensible defaults for title and description based on the form type
   - Include these fields in the database update operation

2. **Created a migration utility** to update any existing form status entries that might be missing the title or description.

## How to Run the Fix

### Immediate Fix for Toggle Functionality

The updated code in `app/api/admin/toggle-form-status/route.js` should resolve the issue for any new status changes. No action is needed beyond deploying the updated code.

### Update Existing Records

If you have existing records in the `form_status` table that are missing titles:

1. Run the update script from the command line:

```bash
# Navigate to the scripts directory
cd scripts

# Make sure dependencies are installed
npm install

# Run the script
node update-form-status.js
```

Alternatively, you can call the API endpoint directly:

```bash
curl -X POST http://localhost:3000/api/db-migration/update-form-status-titles \
  -H "Authorization: Bearer secure-migration-key" \
  -H "Content-Type: application/json"
```

Replace `secure-migration-key` with your actual migration API key if you've changed it.

## Verifying the Fix

You can verify the fix worked by:

1. Going to the admin dashboard
2. Attempting to toggle a form's status (it should work without errors)
3. Checking the database directly to see that title and description fields are populated:

```sql
SELECT form_type, title, description, is_active FROM form_status;
```

## Technical Details

The issue occurred because our database schema evolved to include additional metadata fields for forms. The `title` field was introduced to improve the admin interface, but the API endpoint wasn't updated to include this required information.

The fix ensures backward compatibility by generating appropriate titles and descriptions based on the form type when they're not provided.
