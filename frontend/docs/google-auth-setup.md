# Setting Up Google Authentication for Front of House Productions

This guide explains how to set up Google OAuth authentication for the Front of House Productions application using Supabase.

## Prerequisites

- Access to the [Supabase dashboard](https://app.supabase.io)
- A Google account with access to [Google Cloud Console](https://console.cloud.google.com)
- Your application domain (for local development, use `localhost`)

## Steps

### 1. Create a Google Cloud Project

1. Go to the [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select an existing one
3. Navigate to "APIs & Services" > "OAuth consent screen"
4. Choose "External" user type and click "Create"
5. Fill in the required information:
   - App name: "Front of House Productions"
   - User support email: your email address
   - Developer contact information: your email address
6. Click "Save and Continue"
7. Add the following scopes:
   - `email`
   - `profile`
   - `openid`
8. Click "Save and Continue"
9. Add test users if you're in testing mode, then click "Save and Continue"
10. Review your settings and click "Back to Dashboard"

### 2. Create OAuth Credentials

1. Navigate to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth client ID"
3. For Application type, select "Web application"
4. Name: "Front of House Productions Web App"
5. Add Authorized JavaScript origins:
   - For production: `https://front-of-house-productions.vercel.app`
   - For local development: `http://localhost:3000`
6. Add Authorized redirect URIs:
   - For production: `https://front-of-house-productions.vercel.app/auth/callback`
   - For local development: `http://localhost:3000/auth/callback`
   - Add this Supabase URL: `https://lhwdfcbrvulotvjtyfjy.supabase.co/auth/v1/callback`
   (Replace [YOUR_SUPABASE_PROJECT_ID] with your actual Supabase project ID)
7. Click "Create"
8. Note down the **Client ID** and **Client Secret** as you'll need them for Supabase

### 3. Configure Supabase Authentication

1. Go to the [Supabase dashboard](https://app.supabase.io)
2. Select your project
3. Navigate to "Authentication" > "Providers"
4. Find Google in the list and toggle it on
5. Enter the **Client ID** and **Client Secret** from the previous step
6. Save the changes

7. Configure Redirect URLs:
   - Go to "Authentication" > "URL Configuration"
   - Under "Redirect URLs", add the following:
     - For production: `https://front-of-house-productions.vercel.app/auth/callback`
     - For local development: `http://localhost:3000/auth/callback`
   - Click "Save"

### 4. Update Environment Variables (if necessary)

The application is already configured to use Google authentication, but make sure the following environment variables are set in Vercel and in your local `.env.local` file:

```
NEXT_PUBLIC_SUPABASE_URL=https://[YOUR_SUPABASE_PROJECT_ID].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[YOUR_SUPABASE_ANON_KEY]
```

### 5. Test the Integration

1. Run your application locally or deploy to Vercel
2. Go to the login or signup page
3. Click the "Sign in with Google" button
4. You should be redirected to the Google OAuth consent screen
5. After granting permission, you should be redirected back to your application
6. The application should create a user role for new users and redirect to the appropriate dashboard

## Troubleshooting

1. **Error: "Invalid redirect_uri"**
   - Ensure your redirect URIs in Google Cloud Console include your Supabase callback URL
   - Check for typos in the URLs

2. **Error: "Error signing in with Google"**
   - Check browser console for specific error messages
   - Verify your Google OAuth credentials are correctly configured in Supabase

3. **User created but no role assigned**
   - The application should automatically create a user role, but if there's an issue:
   - Check the database trigger `on_auth_user_created` on the `auth.users` table
   - Manually insert a record in the `user_roles` table for the user

4. **"Access to this resource on the server is denied"**
   - Make sure your domains are correctly configured in both Google Cloud Console and Supabase

If issues persist, check the Supabase logs for authentication-related errors.
