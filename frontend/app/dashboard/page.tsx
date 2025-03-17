import { createClient as createServerClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

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
    
    // Redirect to customer portal for new users
    redirect('/dashboard/customer')
  }
  
  // Determine the appropriate portal to redirect to based on user role
  const currentRole = userRole?.role || 'customer'
  const isRoleApproved = userRole?.is_approved !== false
  
  // Redirect based on user role
  if (currentRole === 'manager' && isRoleApproved) {
    redirect('/dashboard/manager')
  } else if ((currentRole === 'employee' || currentRole === 'manager') && isRoleApproved) {
    redirect('/dashboard/employee')
  } else {
    // Default to customer portal for customer role or unapproved roles
    redirect('/dashboard/customer')
  }
}
