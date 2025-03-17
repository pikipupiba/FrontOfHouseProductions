import { createClient as createServerClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import DashboardCard from '../DashboardCard'
import SignOutButton from '../SignOutButton'
import PortalSelector from '../PortalSelector'

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
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user?.id)
    .single()
  
  // In development, we don't enforce role-based access to allow testing
  // For production, uncomment the following block to enforce role-based access
  
  // Get user role from the user_roles table
  const { data: userRole, error: roleError } = await supabase
    .from('user_roles')
    .select('role, is_approved')
    .eq('user_id', user?.id)
    .single()
  
  // Debug what's happening with the profile and role fetches
  console.log("Debug - User ID:", user?.id);
  console.log("Debug - Profile:", profile ? "Found" : "Not Found");
  console.log("Debug - Profile Error:", profileError?.message || "None");
  console.log("Debug - User Role:", userRole?.role || "Not Found");
  console.log("Debug - Role Error:", roleError?.message || "None");
  
  // TEMPORARILY REMOVE ALL REDIRECTS FOR TESTING
  /* 
  if (!profile) {
    redirect('/dashboard')
  }
  */
  
  // Just log the actual role for debugging purposes
  console.log("User actual role:", userRole?.role);
  
  // Determine available roles for portal selector
  const currentRole = userRole?.role || 'customer'
  const isRoleApproved = userRole?.is_approved !== false
  const availableRoles = ['customer']
  
  // Only show roles that are approved
  if (isRoleApproved) {
    if (currentRole === 'employee' || currentRole === 'manager') {
      availableRoles.push('employee')
    }
    
    if (currentRole === 'manager') {
      availableRoles.push('manager')
    }
  }
  
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-lg bg-white p-8 shadow-lg">
          <div className="pb-5 border-b border-gray-200 mb-8">
            <h1 className="text-3xl font-bold leading-tight text-gray-900">Customer Portal</h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage your rentals, events, and documents
            </p>
          </div>
          
          {/* Portal selector component */}
          {availableRoles.length > 1 && (
            <PortalSelector 
              availableRoles={availableRoles} 
              currentRole={currentRole}
            />
          )}
          
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
          
          <h2 className="text-xl font-semibold mb-4">My Account</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-8">
            <DashboardCard 
              title="My Profile" 
              description="Update your account information and preferences"
              link="/dashboard/profile"
              icon="👤"
            />
            
            <DashboardCard 
              title="Billing Information" 
              description="Manage your payment methods and billing history"
              link="#"
              icon="💳"
            />
            
            <DashboardCard 
              title="Notifications" 
              description="Set up email and SMS alerts for your rentals"
              link="#"
              icon="🔔"
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
              title="Knowledge Base" 
              description="Find answers to common questions and issues"
              link="#"
              icon="📚"
            />
          </div>
          
          <div className="mt-8 flex justify-end">
            <SignOutButton />
          </div>
        </div>
      </div>
    </div>
  )
}
