'use client'

import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import wireframeConfig from '@/lib/mock/config'

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

export default function ProfileForm({ 
  user, 
  profile 
}: { 
  user: any
  profile: ProfileType | null
}) {
  const router = useRouter()
  
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [formData, setFormData] = useState({
    full_name: profile?.full_name || '',
    role: profile?.role || 'customer', // Default initialization
    phone: profile?.phone || '',
  })
  const [originalRole, setOriginalRole] = useState(profile?.role || 'customer')
  const [isRoleChangeRequested, setIsRoleChangeRequested] = useState(false)
  
  useEffect(() => {
    // Update formData if profile changes
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        role: profile.role || 'customer',
        phone: profile.phone || '',
      })
      setOriginalRole(profile.role || 'customer')
    }
  }, [profile])
  
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
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    
    try {
      // Simulate network delay
      await wireframeConfig.delay(800);
      
      // Get current user data
      const storedUser = localStorage.getItem('mockUser')
      if (!storedUser) {
        throw new Error('User session not found')
      }
      
      // Parse and update the user data
      const userData = JSON.parse(storedUser)
      
      // Split full name into first and last name (simplified)
      let firstName = userData.firstName
      let lastName = userData.lastName
      
      if (formData.full_name) {
        const nameParts = formData.full_name.trim().split(' ')
        firstName = nameParts[0] || ''
        lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : ''
      }
      
      // Update user data
      const updatedUser = {
        ...userData,
        firstName,
        lastName,
        phoneNumber: formData.phone,
      }
      
      // Handle role change if requested
      if (isRoleChangeRequested) {
        // In the wireframe version, we allow immediate role changes
        updatedUser.role = formData.role
        
        // Add success message
        setMessage(`Profile updated and role changed to ${formData.role} successfully!`)
        
        // Update original role to the new role
        setOriginalRole(formData.role)
        
        // Reset role change request flag
        setIsRoleChangeRequested(false)
      } else {
        setMessage('Profile updated successfully!')
      }
      
      // Save updated user data to localStorage
      localStorage.setItem('mockUser', JSON.stringify(updatedUser))
      
      // Refresh the page to show updates
      router.refresh()
    } catch (error: any) {
      setMessage(`Error updating profile: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }
  
  // Check if user is authenticated with Google (mock implementation)
  const isGoogleUser = user?.avatarUrl?.includes('pravatar') || false
  
  // Function to directly change role and navigate to appropriate dashboard
  const setRoleDirectly = async (role: string) => {
    setLoading(true)
    
    try {
      // Simulate network delay
      await wireframeConfig.delay(600);
      
      // Get current user data
      const storedUser = localStorage.getItem('mockUser')
      if (!storedUser) {
        throw new Error('User session not found')
      }
      
      // Parse and update the user data
      const userData = JSON.parse(storedUser)
      
      // Update role
      const updatedUser = {
        ...userData,
        role: role
      }
      
      // Save updated user data to localStorage
      localStorage.setItem('mockUser', JSON.stringify(updatedUser))
      
      // Set form data to reflect the new role
      setFormData(prev => ({ ...prev, role }))
      
      // Update original role
      setOriginalRole(role)
      
      // Show success message
      setMessage(`Role updated to ${role} successfully!`)
      
      // Redirect to the appropriate dashboard based on role
      if (role === 'employee') {
        router.push('/dashboard/employee')
      } else if (role === 'manager') {
        router.push('/dashboard/manager')
      } else {
        router.push('/dashboard/customer')
      }
    } catch (error: any) {
      setMessage(`Error setting role: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Profile Picture */}
      {user?.avatarUrl && (
        <div className="flex flex-col items-center mb-4">
          <div className="relative w-24 h-24 rounded-full overflow-hidden mb-2">
            <Image 
              src={user.avatarUrl} 
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
          {isRoleChangeRequested && (
            <p className="mt-1 text-xs text-amber-600">
              Changing your role will affect your dashboard view and permissions
            </p>
          )}
          {!isRoleChangeRequested && (
            <p className="mt-1 text-xs text-gray-500">
              Your account type determines what features you can access
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
      
      {/* Role Switcher Section */}
      <div className="mt-8 p-4 border border-gray-200 rounded-md bg-gray-50">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Quick Role Switcher</h3>
        <p className="text-sm text-gray-500 mb-4">
          For demo purposes, you can quickly switch between different portal views
        </p>
        <div className="grid grid-cols-3 gap-3">
          <button
            type="button"
            onClick={() => setRoleDirectly('customer')}
            className="px-3 py-2 bg-blue-100 text-blue-800 rounded hover:bg-blue-200 flex flex-col items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Customer Portal
          </button>
          <button
            type="button"
            onClick={() => setRoleDirectly('employee')}
            className="px-3 py-2 bg-green-100 text-green-800 rounded hover:bg-green-200 flex flex-col items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Employee Portal
          </button>
          <button
            type="button"
            onClick={() => setRoleDirectly('manager')}
            className="px-3 py-2 bg-purple-100 text-purple-800 rounded hover:bg-purple-200 flex flex-col items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            Manager Portal
          </button>
        </div>
      </div>
    </form>
  )
}
