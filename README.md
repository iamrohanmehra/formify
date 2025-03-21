This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Environment Variables

The project uses several environment variables for configuration. A sample `.env.example` file is included with placeholder values.

To set up your environment:

1. Copy `.env.example` to `.env`:

   ```bash
   cp .env.example .env
   ```

2. Update the values in the `.env` file with your actual configuration:

   - **Supabase Configuration**:

     - `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Public anon key for your Supabase project
     - `SUPABASE_SERVICE_ROLE_KEY`: Service role key (keep this secret)

   - **Google Sheets API Configuration** (if using Google Sheets integration):

     - `GOOGLE_SERVICE_ACCOUNT_EMAIL`: Email of your Google service account
     - `GOOGLE_PRIVATE_KEY`: Private key for your Google service account
     - `GOOGLE_SHEET_ID`: ID of the Google Sheet to use
     - `CRON_SECRET_KEY`: Secret key for cron job authentication

   - **Application Configuration**:
     - `NEXT_PUBLIC_BASE_URL`: Base URL for your application
     - `NODE_ENV`: Environment (development, production, etc.)

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
