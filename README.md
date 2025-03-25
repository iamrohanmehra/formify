# Codekaro Forms

A powerful and flexible form management system built with Next.js and Supabase, designed to handle various types of form submissions with ease.

## Features

- **Multiple Form Types Support**

  - FormX1: General registration form
  - FormX4: Advanced registration form with conditional questions
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
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   ```

4. Set up the database:

   - Create a new project in Supabase
   - Run the database migration commands in the Supabase SQL editor:

   ```sql
   -- Add form_data column if it doesn't exist
   ALTER TABLE form_submissions ADD COLUMN IF NOT EXISTS form_data JSONB DEFAULT '{}'::jsonb;

   -- Create indexes for better performance
   CREATE INDEX IF NOT EXISTS idx_form_submissions_form_type ON form_submissions (form_type);
   CREATE INDEX IF NOT EXISTS idx_form_submissions_created_at ON form_submissions (created_at);
   CREATE INDEX IF NOT EXISTS idx_form_submissions_form_data ON form_submissions USING GIN (form_data);

   -- Create form_status table
   CREATE TABLE IF NOT EXISTS public.form_status (
     id SERIAL PRIMARY KEY,
     form_type TEXT NOT NULL UNIQUE,
     is_active BOOLEAN NOT NULL DEFAULT true,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );
   ```

5. Run the development server:
   ```bash
   npm run dev
   ```

## Form Types

### FormX1 (General Registration Form)

- Basic registration form for general use cases
- Fields:
  - Full Name
  - Email Address
  - WhatsApp Number
  - Preference (Contact Method)
  - Occupation
  - Recommendation

### FormX4 (Advanced Registration Form)

- Comprehensive registration form with additional fields
- Fields:
  - Full Name
  - Email Address
  - WhatsApp Number
  - Preference (Contact Method)
  - Occupation
  - Frontend Interest
  - Income Range

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
