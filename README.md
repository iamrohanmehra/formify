# Formify

A comprehensive form management system built with Next.js and Supabase, designed for creating, submitting, and administering multiple form types with robust data handling capabilities.

## Features

### Form Submission

- **Multiple Form Types**: Support for different form types (formx1, formx4, campus-ambassador) with unique fields for each
- **Flexible Data Structure**: JSONB storage for form-specific fields allowing easy extension
- **Dual Storage**: Submissions saved to both Supabase database and Google Sheets
- **Fallback Mechanism**: Queue system for Google Sheets failures to ensure data is never lost
- **Form Status Control**: Forms can be toggled active/inactive by administrators

### Admin Dashboard

- **Authentication**: Google OAuth integration with role-based access control
- **Form Management**: Toggle forms active/inactive status
- **Submission Viewing**: View, filter, and sort form submissions
- **Statistics**: Real-time analytics on form submissions
- **Optimized Performance**: Materialized views for efficient statistics

### Security

- **Role-Based Access**: Only authorized admin emails can access the admin dashboard
- **Secure Authentication**: Using Supabase Auth with JWT
- **Environment Variable Protection**: Sensitive credentials protected from client exposure

### User Experience

- **Responsive Design**: Mobile-friendly interface for all pages
- **Form Validation**: Client-side validation for form submissions
- **Loading States**: Visual feedback during asynchronous operations
- **Error Handling**: Comprehensive error handling with user-friendly messages

## API Endpoints

### Public Endpoints

#### Form Status

- **GET /api/form-status**
  - Query Params: `form_type` (required)
  - Description: Check if a specific form is currently active
  - Response: `{success: boolean, is_active: boolean}`

#### Submit Form

- **POST /api/submit-form**
  - Body: Form submission data
  - Description: Submit form data to Google Sheets
  - Response: `{success: boolean, error?: string}`

#### Form Submission Queue

- **POST /api/queue-form-submission**
  - Body: Form submission data
  - Description: Queue a form submission for later processing
  - Response: `{success: boolean, error?: string}`

### Admin Endpoints

#### Forms List

- **GET /api/admin/forms**
  - Description: Get all available form types and their status
  - Response: `{success: boolean, forms: Array, submissionCounts: Object}`

#### Form Submissions

- **GET /api/admin/submissions**
  - Query Params: `form_type` (required), `page`, `pageSize`, etc.
  - Description: Get paginated form submissions for a specific form type
  - Response: `{success: boolean, submissions: Array, pagination: Object}`

#### Toggle Form Status

- **POST /api/admin/toggle-form-status**
  - Body: `{form_type: string, active: boolean}`
  - Description: Toggle whether a form is accepting submissions
  - Response: `{success: boolean, error?: string}`

#### Auth Callback

- **GET /api/auth/callback**
  - Description: OAuth callback handler for authentication
  - Response: Redirects to admin dashboard or login page

### System Endpoints

#### Process Queued Submissions

- **POST /api/process-queued-submissions**
  - Description: Process any queued form submissions (for cron jobs)
  - Response: `{success: boolean, processed: number, errors: Array}`

## Environment Variables

The project requires several environment variables to function properly:

### Supabase Configuration

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### Google Sheets API Configuration

```
GOOGLE_SERVICE_ACCOUNT_EMAIL=your_google_service_account_email
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nyour_private_key_content\n-----END PRIVATE KEY-----\n"
GOOGLE_SHEET_ID=your_google_sheet_id
```

### Application Configuration

```
NEXT_PUBLIC_BASE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_URL=https://your-production-url.com
NODE_ENV=development|production
```

## Getting Started

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/formify.git
   cd formify
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   # or
   bun install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Run the development server**

   ```bash
   npm run dev
   # or
   yarn dev
   # or
   bun dev
   ```

5. **Open [http://localhost:3000](http://localhost:3000) with your browser**

## Database Setup

See the [DATABASE-SETUP.md](DATABASE-SETUP.md) file for instructions on setting up the Supabase database schema.

## Deployment

This project is configured for deployment on Vercel:

1. **Connect your repository to Vercel**
2. **Configure environment variables in the Vercel dashboard**
3. **Deploy!**

## Authentication

The admin dashboard is protected with Supabase Auth and Google OAuth. Only authorized email addresses can access the admin dashboard.

To add or modify authorized admin emails:

1. Update the `AUTHORIZED_ADMINS` array in these files:
   - `app/admin/login/page.jsx`
   - `app/admin/page.jsx`
   - `app/api/auth/callback/route.js`
   - `middleware.js`

## Form Types

### Formx1 (`/formx1`)

Basic form with essential fields including:

- Name
- Email
- WhatsApp
- Preference
- Occupation
- Additional fields based on occupation

### Formx4 (`/formx4`)

Extended form with additional fields for more detailed information.

### Campus Ambassador (`/campus-ambassador`)

Specialized form for campus ambassador applications including:

- Full Name
- Email
- WhatsApp
- College
- Year of Study
- Motivation
- Strategy

## License

See the [LICENSE](LICENSE) file for details.
