import { createClient as createServerClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function Dashboard() {
  const supabase = await createServerClient()
  
  // Check if user is authenticated
  const { data: { session } } = await supabase.auth.getSession()
  
  // If no session, redirect to login
  if (!session) {
    redirect('/auth/login')
  }
  
  // Get user details
  const { data: user } = await supabase.auth.getUser()
  
  // Sign out function will be called from a client component
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-lg bg-white p-8 shadow-lg">
          <div className="pb-5 border-b border-gray-200 mb-8">
            <h1 className="text-3xl font-bold leading-tight text-gray-900">Dashboard</h1>
          </div>
          
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Welcome, {user.user?.email}!</h2>
            <p className="text-gray-600">
              You are now logged into the Front of House Productions portal. 
              From here, you can manage your rentals, view your events, and more.
            </p>
          </div>
          
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* These will be implemented later */}
            <DashboardCard 
              title="My Rentals" 
              description="View and manage your equipment rentals"
              link="#"
              icon="📋"
            />
            
            <DashboardCard 
              title="Upload Files" 
              description="Share event photos, videos, and documents"
              link="#"
              icon="📁"
            />
            
            <DashboardCard 
              title="Event Timeline" 
              description="Track important dates and milestones"
              link="#"
              icon="📅"
            />
          </div>
          
          <div className="mt-8">
            <SignOutButton />
          </div>
        </div>
      </div>
    </div>
  )
}

// Client component for sign out functionality
'use client'

import { useRouter } from 'next/navigation'
import { createClient as createBrowserClient } from '@/lib/supabase/client'

function SignOutButton() {
  const router = useRouter()
  
  const handleSignOut = async () => {
    const supabase = createBrowserClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }
  
  return (
    <button
      onClick={handleSignOut}
      className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
    >
      Sign Out
    </button>
  )
}

// Simple dashboard card component
function DashboardCard({ title, description, link, icon }: { 
  title: string;
  description: string;
  link: string;
  icon: string;
}) {
  return (
    <div className="overflow-hidden rounded-lg bg-white shadow">
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0 text-3xl">{icon}</div>
          <div className="ml-5">
            <h3 className="text-lg font-medium leading-6 text-gray-900">{title}</h3>
            <p className="mt-1 text-sm text-gray-500">{description}</p>
          </div>
        </div>
        <div className="mt-4">
          <Link href={link} className="text-sm font-medium text-blue-600 hover:text-blue-500">
            View details <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
