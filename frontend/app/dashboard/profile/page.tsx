import { createClient as createServerClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import ProfileForm from './ProfileForm'

export default async function ProfilePage() {
  const supabase = await createServerClient()
  
  // Check if user is authenticated
  const { data: { session } } = await supabase.auth.getSession()
  
  // If no session, redirect to login
  if (!session) {
    redirect('/auth/login')
  }
  
  // Get user details
  const { data: { user } } = await supabase.auth.getUser()
  
  // Get profile details from the database
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
  
  // If profile exists but doesn't have a role from the user_roles table,
  // update it with the role from user_roles
  if (profile && userRole && profile.role !== userRole.role) {
    // This is just for display purposes in the UI, not for actual permissions
    profile.role = userRole.role
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-lg bg-white p-8 shadow-lg">
          <div className="pb-5 border-b border-gray-200 mb-8">
            <h1 className="text-3xl font-bold leading-tight text-gray-900">My Profile</h1>
          </div>
          
          <ProfileForm user={user} profile={profile} />
        </div>
      </div>
    </div>
  )
}
