import { createClient as createServerClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import DashboardCard from '../DashboardCard'
import SignOutButton from '../SignOutButton'

export default async function CustomerPortal() {
  const supabase = await createServerClient()
  
  // Check if user is authenticated
  const { data: { session } } = await supabase.auth.getSession()
  
  // If no session, redirect to login
  if (!session) {
    redirect('/auth/login')
  }
  
  // Get user details
  const { data: { user } } = await supabase.auth.getUser()
  
  // Get profile details
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user?.id)
    .single()
  
  // Ensure user has customer role (all users have this by default)
  if (!profile) {
    redirect('/dashboard')
  }
  
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-lg bg-white p-8 shadow-lg">
          <div className="flex justify-between items-center pb-5 border-b border-gray-200 mb-8">
            <div>
              <h1 className="text-3xl font-bold leading-tight text-gray-900">Customer Portal</h1>
              <p className="mt-1 text-sm text-gray-500">
                Manage your rentals, events, and documents
              </p>
            </div>
            <a href="/dashboard" className="text-sm text-blue-600 hover:text-blue-800">
              Back to Dashboard
            </a>
          </div>
          
          <h2 className="text-xl font-semibold mb-4">Rentals & Events</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-8">
            <DashboardCard 
              title="My Rentals" 
              description="View and manage your current and past equipment rentals"
              link="#"
              icon="📋"
            />
            
            <DashboardCard 
              title="Schedule New Rental" 
              description="Browse equipment and book for your next event"
              link="#"
              icon="🗓️"
            />
            
            <DashboardCard 
              title="Event Timeline" 
              description="Track important dates and milestones for your events"
              link="#"
              icon="⏱️"
            />
          </div>
          
          <h2 className="text-xl font-semibold mb-4">Documents & Assets</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-8">
            <DashboardCard 
              title="Upload Files" 
              description="Share event photos, videos, and documents"
              link="#"
              icon="📁"
            />
            
            <DashboardCard 
              title="Stage Plots" 
              description="Manage your venue layouts and technical specifications"
              link="#"
              icon="📐"
            />
            
            <DashboardCard 
              title="Contracts & Forms" 
              description="Access and sign important documents"
              link="#"
              icon="📝"
            />
          </div>
          
          <h2 className="text-xl font-semibold mb-4">Support</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-8">
            <DashboardCard 
              title="Contact Us" 
              description="Get in touch with an FOHP representative"
              link="/contact"
              icon="📞"
            />
            
            <DashboardCard 
              title="Equipment Catalog" 
              description="Browse our full inventory of available equipment"
              link="#"
              icon="🎛️"
            />
            
            <DashboardCard 
              title="My Profile" 
              description="Update your account information and preferences"
              link="/dashboard/profile"
              icon="👤"
            />
          </div>
          
          <div className="mt-8 flex justify-between">
            <a 
              href="/dashboard" 
              className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Back to Dashboard
            </a>
            <SignOutButton />
          </div>
        </div>
      </div>
    </div>
  )
}
