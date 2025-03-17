# Supabase Setup Guide for Front of House Productions

This guide outlines the steps to set up Supabase as the backend for the Front of House Productions web application and connect it to your Vercel deployment.

## 1. Create a Supabase Project

1. Sign up or log in to [Supabase](https://supabase.com)
2. Create a new project:
   - Enter a name (e.g., "front-of-house-productions")
   - Create a secure database password
   - Select the region closest to your users
   - Wait for your project to be provisioned (this may take a few minutes)

## 2. Get Your API Keys

Once your project is created:

1. Go to Project Settings > API
2. You will need two keys:
   - **URL**: `https://[your-project-id].supabase.co`
   - **anon public key**: The public API key that starts with `eyJhbGciOiJIUzI1NiIs...`

## 3. Set Up Environment Variables in Vercel

1. Go to your project on Vercel
2. Navigate to Settings > Environment Variables
3. Add the following environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anon key

Alternatively, you can add these values to your `vercel.json` file (already created) or add them via CLI:

```bash
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
```

## 4. Install Supabase Client in Your Next.js Project

```bash
npm install @supabase/supabase-js @supabase/auth-helpers-nextjs
```

## 5. Set Up Supabase Client

Create a file at `frontend/lib/supabase.ts`:

```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
```

## 6. Set Up Authentication (Optional for Initial Setup)

To implement authentication, you'll need to:

1. Configure auth providers in Supabase dashboard
2. Set up auth routes in your Next.js app
3. Create signup/login components

## 7. Create Initial Database Schema

Use Supabase's SQL editor to create your initial tables:

Example for creating a users table with RLS (Row Level Security):

```sql
-- Create users table
CREATE TABLE users (
  id UUID REFERENCES auth.users NOT NULL PRIMARY KEY,
  email TEXT UNIQUE,
  full_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Set up Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own data" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own data" ON users
  FOR UPDATE USING (auth.uid() = id);
```

## 8. Access Supabase from Your Components

Example of how to fetch data from Supabase:

```typescript
import supabase from '@/lib/supabase';
import { useEffect, useState } from 'react';

export default function UserProfile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getProfile() {
      try {
        const { data: session } = await supabase.auth.getSession();
        
        if (session?.user) {
          const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single();
            
          if (error) throw error;
          setUser(data);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    }
    
    getProfile();
  }, []);

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          <h1>Welcome, {user?.full_name}</h1>
          <p>Email: {user?.email}</p>
        </div>
      )}
    </div>
  );
}
```

## 9. Storage Setup (for User Files, Images, etc.)

To set up storage buckets:

1. Go to Storage in your Supabase dashboard
2. Create buckets for different types of files (e.g., "profile-images", "documents", "event-photos")
3. Configure bucket permissions

## Next Steps

After completing the initial setup:

1. Implement authentication flows
2. Create database migrations for your schema
3. Set up storage policies for file uploads
4. Implement real-time subscriptions for collaborative features

Remember to follow best practices for security, such as validating user input and setting up proper row-level security policies.
