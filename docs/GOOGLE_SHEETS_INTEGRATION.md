# Google Sheets Integration Troubleshooting Guide

This document provides guidance on troubleshooting and resolving issues with the Google Sheets integration for form submissions.

## Verifying the Integration

We've created a verification script you can use to check if the Google Sheets integration is working correctly:

```bash
node scripts/verify-sheets-integration.cjs
```

This script will connect to Google Sheets using your credentials and check if data is being properly stored.

## Common Issues and Solutions

### 1. Google Service Account Permissions

The most common issue is that the Google Service Account doesn't have proper permissions on the spreadsheet.

**Solution:**

1. Open your Google Sheet
2. Click the "Share" button
3. Add your service account email (`GOOGLE_SERVICE_ACCOUNT_EMAIL` in your `.env` file) with "Editor" permissions
4. Make sure to save the changes

### 2. Private Key Format Issues

The private key in your environment variables may be incorrectly formatted.

**Solution:**

- Make sure the private key includes proper line breaks
- The key should start with `-----BEGIN PRIVATE KEY-----` and end with `-----END PRIVATE KEY-----`
- When setting in `.env` file, use double quotes and include `\n` for line breaks:
  ```
  GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkq...\n-----END PRIVATE KEY-----\n"
  ```

### 3. Google Sheets API Not Enabled

Make sure the Google Sheets API is enabled for your Google Cloud project.

**Solution:**

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. Go to "APIs & Services" > "Library"
4. Search for "Google Sheets API"
5. Enable the API if it's not already enabled

### 4. Wrong Sheet ID

Verify that you're using the correct Sheet ID.

**Solution:**

- The Sheet ID can be found in the URL of your Google Sheet: `https://docs.google.com/spreadsheets/d/{SHEET_ID}/edit`
- Update the `GOOGLE_SHEET_ID` in your `.env` file

### 5. Network/Firewall Issues

If you're running in an environment with a firewall, make sure outbound connections to Google's APIs are allowed.

## Additional Debugging

We've added enhanced debugging to both the client-side form submission and the server API routes. Check your console logs and server logs for detailed information about:

- Form submission attempts
- Authentication status
- Google Sheets API responses
- Error details

## Need More Help?

If you're still experiencing issues after trying these solutions, try the following:

1. Check that all your environment variables are properly set
2. Verify that your Google service account has the necessary IAM permissions
3. Test the integration by making a direct API call:
   ```bash
   curl -X POST http://localhost:3000/api/submit-form -H "Content-Type: application/json" \
     -d '{"form_type": "campus-ambassador", "fullName": "Test User", "email": "test@example.com", "whatsapp": "1234567890", "college": "Test College", "yearOfStudy": "1st Year", "motivation": "Test motivation", "strategy": "Test strategy"}'
   ```
