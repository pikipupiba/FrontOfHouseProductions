import { createClient as createServerClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import SignOutButton from './SignOutButton'
import DashboardCard from './DashboardCard'

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
