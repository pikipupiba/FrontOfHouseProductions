'use client'

import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { createClient as createBrowserClient } from '@/lib/supabase/client'
import Image from 'next/image'

type ProfileType = {
  id: string
  email: string
  full_name?: string
  role?: string
  phone?: string
  avatar_url?: string
  created_at: string
  updated_at: string
}

type UserRoleType = {
  id: string
  user_id: string
  role: string
  is_approved: boolean
  created_at: string
  updated_at: string
}

export default function ProfileForm({ 
  user, 
  profile 
}: { 
  user: any
  profile: ProfileType | null
}) {
  const router = useRouter()
  const supabase = createBrowserClient()
  
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [formData, setFormData] = useState({
    full_name: profile?.full_name || '',
    role: profile?.role || 'customer', // Default initialization
    phone: profile?.phone || '',
  })
  const [userRole, setUserRole] = useState<UserRoleType | null>(null)
  const [originalRole, setOriginalRole] = useState('customer')
  const [isRoleChangeRequested, setIsRoleChangeRequested] = useState(false)
  
  // Fetch user role from the user_roles table
  useEffect(() => {
    const fetchUserRole = async () => {
      if (!user?.id) return
      
      const { data, error } = await supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', user.id)
        .single()
      
      if (error) {
        console.error('Error fetching user role:', error)
        return
      }
      
      if (data) {
        setUserRole(data)
        setFormData(prev => ({ ...prev, role: data.role }))
        setOriginalRole(data.role)
      }
    }
    
    fetchUserRole()
  }, [user, supabase])
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    
    // Track if role is changing
    if (name === 'role' && value !== originalRole) {
      setIsRoleChangeRequested(true)
    } else if (name === 'role' && value === originalRole) {
      setIsRoleChangeRequested(false)
    }
    
    setFormData(prev => ({ ...prev, [name]: value }))
  }
  
  const createRoleChangeRequest = async () => {
    if (!userRole) return
    
    try {
      const { error } = await supabase
        .from('user_role_requests')
        .insert({
          user_id: user.id,
          requested_role: formData.role,
          previous_role: originalRole, // Changed from current_role to previous_role
          notes: `User requested role change from ${originalRole} to ${formData.role}`
        })
      
      if (error) throw error
      
      return true
    } catch (error: any) {
      console.error('Error creating role change request:', error)
      setMessage(`Error requesting role change: ${error.message}`)
      return false
    }
  }
  
  const setRoleDirectly = async (role: string) => {
    setLoading(true)
    try {
      // First check if a user_role record exists
      const { data } = await supabase
        .from('user_roles')
        .select('id')
        .eq('user_id', user.id)
        .single();
      
      let error;
      
      // If a record exists, update it
      if (data?.id) {
        const result = await supabase
          .from('user_roles')
          .update({
            role: role,
            is_approved: true,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', user.id);
          
        error = result.error;
      } else {
        // If no record exists, insert one
        const result = await supabase
          .from('user_roles')
          .insert({
            user_id: user.id,
            role: role,
            is_approved: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });
          
        error = result.error;
      }
      
      if (error) throw error;
      
      setMessage(`Role updated to ${role} successfully!`);
      setFormData(prev => ({ ...prev, role }));
      setOriginalRole(role);
      
      // Redirect to the appropriate dashboard based on role
      if (role === 'employee') {
        window.location.href = "/dashboard/employee";
      } else if (role === 'manager') {
        window.location.href = "/dashboard/manager";
      } else {
        window.location.href = "/dashboard/customer";
      }
    } catch (error: any) {
      setMessage(`Error setting role: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    
    try {
      // Always update profile information - REMOVED ROLE FIELD COMPLETELY
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          email: user.email,
          full_name: formData.full_name,
          phone: formData.phone,
          updated_at: new Date().toISOString(),
        })
      
      if (profileError) throw profileError
      
      // Handle role change if requested
      if (isRoleChangeRequested) {
        // If changing to a non-customer role, create a request
        if (formData.role !== 'customer') {
          const requestCreated = await createRoleChangeRequest()
          if (requestCreated) {
            setMessage('Profile updated successfully! Your role change request has been submitted for approval.')
          } else {
            setMessage('Profile updated successfully, but we encountered an issue with your role change request.')
          }
        } else {
          // If changing to customer role, update directly (this is always allowed)
          const { error: roleError } = await supabase
            .from('user_roles')
            .update({ 
              role: 'customer',
              is_approved: true,
              updated_at: new Date().toISOString() 
            })
            .eq('user_id', user.id)
          
          if (roleError) throw roleError
          setMessage('Profile updated successfully!')
        }
      } else {
        setMessage('Profile updated successfully!')
      }
      
      router.refresh()
    } catch (error: any) {
      setMessage(`Error updating profile: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }
  
  // Check if user is authenticated with Google
  const isGoogleUser = user?.app_metadata?.provider === 'google' || false

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Profile Picture */}
      {(user?.user_metadata?.avatar_url || profile?.avatar_url) && (
        <div className="flex flex-col items-center mb-4">
          <div className="relative w-24 h-24 rounded-full overflow-hidden mb-2">
            <Image 
              src={user?.user_metadata?.avatar_url || profile?.avatar_url || ''} 
              alt="Profile picture"
              fill
              className="object-cover"
            />
          </div>
          {isGoogleUser && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" className="mr-1">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Google Account
            </span>
          )}
        </div>
      )}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <div className="mt-1">
          <input
            id="email"
            name="email"
            type="email"
            disabled
            value={user?.email || ''}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm bg-gray-100"
          />
          <p className="mt-1 text-xs text-gray-500">
            {isGoogleUser 
              ? 'Email linked to your Google account' 
              : 'Email cannot be changed'}
          </p>
        </div>
      </div>
      
      <div>
        <label htmlFor="full_name" className="block text-sm font-medium text-gray-700">
          Full Name
        </label>
        <div className="mt-1">
          <input
            id="full_name"
            name="full_name"
            type="text"
            value={formData.full_name}
            onChange={handleChange}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>
      </div>
      
      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
          Phone Number
        </label>
        <div className="mt-1">
          <input
            id="phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>
      </div>
      
      <div>
        <label htmlFor="role" className="block text-sm font-medium text-gray-700">
          Account Type
        </label>
        <div className="mt-1">
          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            <option value="customer">Customer</option>
            <option value="employee">Employee</option>
            <option value="manager">Manager</option>
          </select>
          {isRoleChangeRequested && formData.role !== 'customer' && (
            <p className="mt-1 text-xs text-amber-600">
              Your request to change to {formData.role} role will require approval by administrators
            </p>
          )}
          {!isRoleChangeRequested && (
            <p className="mt-1 text-xs text-gray-500">
              Role changes may require approval by administrators
            </p>
          )}
        </div>
      </div>
      
      {message && (
        <div className={`p-4 rounded-md ${message.includes('Error') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
          {message}
        </div>
      )}
      
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => {
            // Go back to the appropriate dashboard based on originalRole
            if (originalRole === 'employee') {
              router.push('/dashboard/employee');
            } else if (originalRole === 'manager') {
              router.push('/dashboard/manager');
            } else {
              router.push('/dashboard/customer');
            }
          }}
          className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Saving...' : 'Save'}
        </button>
      </div>
      
      {/* Developer Tools Section - only for development */}
      <div className="mt-8 p-4 border border-gray-200 rounded-md bg-gray-50">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Developer Tools</h3>
        <p className="text-sm text-gray-500 mb-4">Set role directly for testing (bypasses approval)</p>
        <div className="flex space-x-2">
          <button
            type="button"
            onClick={() => setRoleDirectly('customer')}
            className="px-3 py-1 bg-blue-100 text-blue-800 rounded hover:bg-blue-200"
          >
            Set Customer
          </button>
          <button
            type="button"
            onClick={() => setRoleDirectly('employee')}
            className="px-3 py-1 bg-green-100 text-green-800 rounded hover:bg-green-200"
          >
            Set Employee
          </button>
          <button
            type="button"
            onClick={() => setRoleDirectly('manager')}
            className="px-3 py-1 bg-purple-100 text-purple-800 rounded hover:bg-purple-200"
          >
            Set Manager
          </button>
        </div>
      </div>
    </form>
  )
}
