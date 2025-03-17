'use client'

import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { createClient as createBrowserClient } from '@/lib/supabase/client'

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
      const { error } = await supabase
        .from('user_roles')
        .upsert({
          user_id: user.id,
          role: role,
          is_approved: true,
          updated_at: new Date().toISOString()
        })
      
      if (error) throw error
      setMessage(`Role updated to ${role} successfully!`)
      setFormData(prev => ({ ...prev, role }))
      setOriginalRole(role)
      router.refresh()
    } catch (error: any) {
      setMessage(`Error setting role: ${error.message}`)
    } finally {
      setLoading(false)
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
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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
          <p className="mt-1 text-xs text-gray-500">Email cannot be changed</p>
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
          onClick={() => router.push('/dashboard')}
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
