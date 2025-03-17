import { createClient as createServerClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import SignOutButton from './SignOutButton'
import DashboardCard from './DashboardCard'
import PortalSelector from './PortalSelector'

export default async function Dashboard() {
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
    
  // Get user role from the user_roles table
  const { data: userRole } = await supabase
    .from('user_roles')
    .select('*')
    .eq('user_id', user?.id)
    .single()
  
  // If profile doesn't exist yet, create one
  if (!profile) {
    await supabase.from('profiles').insert({
      id: user?.id,
      email: user?.email,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
  }
  
  // If user_role doesn't exist, create one with default customer role
  if (!userRole) {
    await supabase.from('user_roles').insert({
      user_id: user?.id,
      role: 'customer',
      is_approved: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
  }
  
  // Determine available roles based on user_roles table
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
            <h1 className="text-3xl font-bold leading-tight text-gray-900">Dashboard</h1>
          </div>
          
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Welcome, {profile?.full_name || user?.email}!</h2>
            <p className="text-gray-600">
              You are now logged into the Front of House Productions portal. 
              From here, you can manage your rentals, view your events, and more.
            </p>
            {!isRoleApproved && userRole && userRole.role !== 'customer' && (
              <div className="mt-2 bg-amber-50 border border-amber-200 text-amber-800 px-4 py-2 rounded-md">
                Your {userRole.role} role is pending approval. Some features may be limited until approval.
              </div>
            )}
          </div>
          
          {/* Portal selector component */}
          {availableRoles.length > 1 && (
            <PortalSelector 
              availableRoles={availableRoles} 
              currentRole={currentRole}
            />
          )}
          
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {/* Profile card - implemented */}
            <DashboardCard 
              title="My Profile" 
              description="View and update your account information"
              link="/dashboard/profile"
              icon="👤"
            />
            
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
