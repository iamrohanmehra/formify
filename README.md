# Codekaro Forms

A powerful and flexible form management system built with Next.js and Supabase, designed to handle various types of form submissions with ease.

## Features

- **Multiple Form Types Support**

  - Demo Form: General purpose form for testing and demonstration
  - Campus Ambassador Application form
  - Extensible architecture for adding new form types

- **Admin Dashboard**

  - Secure admin login with Google authentication
  - View and manage form submissions
  - Toggle form status (active/inactive)
  - Search and filter submissions
  - Pagination support
  - Delete submissions
  - Export data functionality

- **Form Management**

  - Form status control (active/inactive)
  - Real-time form validation
  - Conditional questions
  - Customizable form fields
  - Responsive design

- **Data Storage**
  - PostgreSQL database with Supabase
  - Google Sheets integration for backup and easy access
  - JSONB storage for flexible form data
  - Efficient indexing for better performance
  - Data migration support

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/codekaro-forms.git
   cd codekaro-forms
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory with the following variables:

   ```
   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

   # Google Sheets Configuration
   GOOGLE_SERVICE_ACCOUNT_EMAIL=your_google_service_account_email
   GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nyour_private_key_content\n-----END PRIVATE KEY-----\n"
   GOOGLE_SHEET_ID=your_google_sheet_id
   ```

   Note: For the Google Sheets integration:

   - Create a Google Cloud Project and enable the Google Sheets API
   - Create a service account and download the private key
   - Create a Google Sheet and share it with the service account email
   - The Sheet ID can be found in the URL: `https://docs.google.com/spreadsheets/d/{SHEET_ID}/edit`

   ### Google Sheets Integration Troubleshooting

   If you encounter issues with the Google Sheets integration:

   1. **Service Account Permissions**

      - Open your Google Sheet
      - Click the "Share" button
      - Add your service account email (`GOOGLE_SERVICE_ACCOUNT_EMAIL` in your `.env` file) with "Editor" permissions
      - Make sure to save the changes

   2. **Private Key Format**

      - Ensure the private key includes proper line breaks
      - The key should start with `-----BEGIN PRIVATE KEY-----` and end with `-----END PRIVATE KEY-----`
      - When setting in `.env` file, use double quotes and include `\n` for line breaks:
        ```
        GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkq...\n-----END PRIVATE KEY-----\n"
        ```

   3. **Google Sheets API**

      - Go to the [Google Cloud Console](https://console.cloud.google.com/)
      - Select your project
      - Go to "APIs & Services" > "Library"
      - Search for "Google Sheets API"
      - Enable the API if it's not already enabled

   4. **Sheet ID Verification**

      - Verify that you're using the correct Sheet ID
      - The Sheet ID can be found in the URL of your Google Sheet: `https://docs.google.com/spreadsheets/d/{SHEET_ID}/edit`
      - Update the `GOOGLE_SHEET_ID` in your `.env` file

   5. **Network/Firewall Issues**
      - If you're running in an environment with a firewall, make sure outbound connections to Google's APIs are allowed

   To verify the integration is working:

   ```bash
   # Navigate to the scripts directory
   cd scripts

   # Run the verification script
   node verify-sheets-integration.js
   ```

   The script will:

   - Test the connection to Google Sheets
   - Verify service account permissions
   - Check sheet access and structure
   - Attempt a test write operation

4. Set up the database:

   - Create a new project in Supabase
   - Run the following SQL commands in the Supabase SQL editor to create the required database tables and indexes. These commands are mandatory for the application to function:

   ```sql
   -- Create the main table for storing form submissions
   CREATE TABLE IF NOT EXISTS form_submissions (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     form_type TEXT NOT NULL,
     email_address TEXT NOT NULL,
     full_name TEXT,
     whatsapp_number TEXT,
     form_data JSONB DEFAULT '{}'::jsonb,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Create the table for managing form status (active/inactive)
   CREATE TABLE IF NOT EXISTS form_status (
     id SERIAL PRIMARY KEY,
     form_type TEXT NOT NULL UNIQUE,
     is_active BOOLEAN NOT NULL DEFAULT true,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Create indexes for better query performance
   CREATE INDEX IF NOT EXISTS idx_form_submissions_form_type ON form_submissions (form_type);
   CREATE INDEX IF NOT EXISTS idx_form_submissions_created_at ON form_submissions (created_at);
   CREATE INDEX IF NOT EXISTS idx_form_submissions_form_data ON form_submissions USING GIN (form_data);
   ```

   These commands will:

   - Create the `form_submissions` table to store all form submissions
   - Create the `form_status` table to manage which forms are active/inactive
   - Set up necessary indexes for efficient querying

5. Run the development server:
   ```bash
   npm run dev
   ```

## Form Types

### Demo Form

- General purpose form for testing and demonstration
- Fields:
  - Full Name
  - Email Address
  - WhatsApp Number
  - Preference (Contact Method)
  - Occupation
  - Additional fields based on occupation

### Campus Ambassador Form

- Specialized form for campus ambassador applications
- Fields:
  - Full Name
  - Email Address
  - WhatsApp Number
  - College
  - Year of Study
  - Motivation
  - Strategy

## Database Schema

### form_submissions Table

```sql
CREATE TABLE form_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  form_type TEXT NOT NULL,
  email_address TEXT NOT NULL,
  full_name TEXT,
  whatsapp_number TEXT,
  form_data JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### form_status Table

```sql
CREATE TABLE form_status (
  id SERIAL PRIMARY KEY,
  form_type TEXT NOT NULL UNIQUE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## API Endpoints

### Form Submission

- `POST /api/form-submissions`
  - Submit a new form
  - Handles different form types
  - Validates form data
  - Stores in Supabase
  - Syncs with Google Sheets (backup)

### Admin API

- `GET /api/admin/forms`
  - List all available forms
  - Get submission counts
- `GET /api/admin/submissions`
  - Get form submissions with pagination
  - Support for filtering and sorting
- `POST /api/admin/toggle-form-status`
  - Toggle form active status
- `POST /api/admin/delete-submission`
  - Delete a submission

## Development

### Adding a New Form Type

1. Create a new form component in the `app` directory
2. Add form type to the `form_status` table
3. Update the `submitForm` function in `app/actions.js`
4. Add form-specific fields to the admin dashboard

### Database Migrations

Run the migration API to update the database schema:

```
GET /api/db-migration
```

Then migrate existing data:

```
GET /api/migrate-form-data
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
