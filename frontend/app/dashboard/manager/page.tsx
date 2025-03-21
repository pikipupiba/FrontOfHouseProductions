'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import DashboardCard from '../DashboardCard'
import SignOutButton from '../SignOutButton'
import PortalSelector from '../PortalSelector'
import wireframeConfig from '@/lib/mock/config'

export default function ManagerPortal() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [user, setUser] = useState<any>(null)
  const [availableRoles, setAvailableRoles] = useState<string[]>(['customer'])
  const [currentRole, setCurrentRole] = useState<string>('manager')
  
  useEffect(() => {
    async function loadUserData() {
      try {
        console.log('Manager Dashboard initializing...') // Debug logging
        
        // Test localStorage capability
        try {
          const testKey = `test_storage_${Date.now()}`
          localStorage.setItem(testKey, 'test')
          const testResult = localStorage.getItem(testKey)
          localStorage.removeItem(testKey)
          
          if (testResult !== 'test') {
            throw new Error('localStorage test failed')
          }
        } catch (storageError) {
          console.error('localStorage access error in manager dashboard:', storageError)
          throw new Error('Your browser seems to be blocking storage access. Please ensure cookies and site data are enabled.')
        }
        
        // Simulate network delay
        await wireframeConfig.delay(300)
        
        // Get current user from localStorage (set during mock auth)
        console.log('Checking for stored user data...') // Debug logging
        const storedUser = localStorage.getItem('mockUser')
        
        // If no user data in localStorage, redirect to login
        if (!storedUser) {
          console.log('No user data found, redirecting to login...') // Debug logging
          setErrorMsg('No user session found. Please log in again.')
          window.location.href = '/auth/login'
          return
        }
        
        // Parse the user data
        let userData
        try {
          userData = JSON.parse(storedUser)
          console.log('Found user data:', userData.email, 'Role:', userData.role) // Debug logging
          setUser(userData)
          
          // Get user role (in mock implementation, role is directly on the user object)
          const userRole = userData.role || 'customer'
          setCurrentRole(userRole)
          
          // In the mock wireframe, all roles are approved
          const isRoleApproved = true
          
          // Determine available roles for portal selector
          const roles = ['customer']
          
          // Only show roles that are approved (in the wireframe, all are approved)
          if (isRoleApproved) {
            if (userRole === 'employee' || userRole === 'manager') {
              roles.push('employee')
            }
            
            if (userRole === 'manager') {
              roles.push('manager')
            }
          }
          
          setAvailableRoles(roles)
          
          // Verify the current user is allowed to access this page (managers only)
          if (userRole !== 'manager') {
            console.log('User does not have permission to access manager dashboard, redirecting...') // Debug logging
            window.location.href = '/dashboard'
            return
          }
          
        } catch (parseError) {
          console.error('Error parsing user data:', parseError)
          localStorage.removeItem('mockUser') // Clean up invalid data
          setErrorMsg('Invalid user data. Please log in again.')
          window.location.href = '/auth/login'
          return
        }
        
      } catch (error: any) {
        console.error('Error in manager dashboard initialization:', error)
        setErrorMsg(error?.message || 'Error loading dashboard. Please try again.')
      } finally {
        setIsLoading(false)
      }
    }
    
    loadUserData()
  }, [router])
  
  // Show a loading indicator while initializing
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading manager dashboard...</p>
          
          {/* Display error message if any */}
          {errorMsg && (
            <div className="mt-6 rounded-md bg-red-50 p-4 max-w-md mx-auto">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Authentication Error</h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>{errorMsg}</p>
                  </div>
                  <div className="mt-4">
                    <button
                      type="button"
                      onClick={() => window.location.href = '/auth/login'}
                      className="inline-flex items-center rounded-md border border-transparent bg-red-100 px-3 py-2 text-sm font-medium leading-4 text-red-700 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                    >
                      Return to login
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }
  
  // If there's an error but we're not in loading state
  if (!isLoading && errorMsg) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="rounded-md bg-red-50 p-4 max-w-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Authentication Error</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{errorMsg}</p>
              </div>
              <div className="mt-4">
                <button
                  type="button"
                  onClick={() => window.location.href = '/auth/login'}
                  className="inline-flex items-center rounded-md border border-transparent bg-red-100 px-3 py-2 text-sm font-medium leading-4 text-red-700 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                >
                  Return to login
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
  
  // Main dashboard content when authenticated
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-lg bg-white p-8 shadow-lg">
          <div className="pb-5 border-b border-gray-200 mb-8">
            <h1 className="text-3xl font-bold leading-tight text-gray-900">Management Portal</h1>
            <p className="mt-1 text-sm text-gray-500">
              Oversee operations, approve requests, and manage staff
            </p>
          </div>
          
          {/* Portal selector component */}
          {availableRoles.length > 1 && (
            <PortalSelector 
              availableRoles={availableRoles} 
              currentRole={currentRole}
            />
          )}
          
          <div className="bg-yellow-50 rounded-lg p-4 mb-8">
            <h3 className="font-medium text-yellow-800">Pending Approvals</h3>
            <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4 mt-2">
              <button className="bg-white border border-gray-300 px-3 py-1 rounded text-sm font-medium hover:bg-gray-50 flex items-center">
                <span className="text-red-500 mr-1">3</span> Purchase Requests
              </button>
              <button className="bg-white border border-gray-300 px-3 py-1 rounded text-sm font-medium hover:bg-gray-50 flex items-center">
                <span className="text-red-500 mr-1">1</span> Reimbursements
              </button>
              <button className="bg-white border border-gray-300 px-3 py-1 rounded text-sm font-medium hover:bg-gray-50 flex items-center">
                <span className="text-red-500 mr-1">2</span> Role Change Requests
              </button>
            </div>
          </div>
          
          <h2 className="text-xl font-semibold mb-4">Staff Management</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-8">
            <DashboardCard 
              title="Team Directory" 
              description="View and edit staff information and assignments"
              link="#"
              icon="👥"
            />
            
            <DashboardCard 
              title="Job Assignments" 
              description="Create and manage staff event assignments"
              link="#"
              icon="📅"
            />
            
            <DashboardCard 
              title="Performance Tracking" 
              description="Monitor staff metrics and achievements"
              link="#"
              icon="📊"
            />
          </div>
          
          <h2 className="text-xl font-semibold mb-4">Event Operations</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-8">
            <DashboardCard 
              title="All Events" 
              description="View and manage all upcoming and past events"
              link="#"
              icon="🗓️"
            />
            
            <DashboardCard 
              title="Task Management" 
              description="Create, assign, and monitor tasks across events"
              link="#"
              icon="✅"
            />
            
            <DashboardCard 
              title="Resource Allocation" 
              description="Manage equipment allocation across events"
              link="#"
              icon="📋"
            />
          </div>
          
          <h2 className="text-xl font-semibold mb-4">Equipment & Inventory</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-8">
            <DashboardCard 
              title="Inventory Management" 
              description="Manage complete equipment inventory"
              link="#"
              icon="📦"
            />
            
            <DashboardCard 
              title="Purchase Approvals" 
              description="Review and approve purchase requests"
              link="#"
              icon="💲"
            />
            
            <DashboardCard 
              title="Maintenance Schedule" 
              description="Track equipment maintenance and repairs"
              link="#"
              icon="🔧"
            />
          </div>
          
          <h2 className="text-xl font-semibold mb-4">Administration</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-8">
            <DashboardCard 
              title="Financial Overview" 
              description="View financial reports and metrics"
              link="#"
              icon="💰"
            />
            
            <DashboardCard 
              title="Customer Management" 
              description="Manage customer accounts and relationships"
              link="#"
              icon="🧑‍💼"
            />
            
            <DashboardCard 
              title="Google Calendar" 
              description="View and manage team calendar events"
              link="/dashboard/manager/google-calendar"
              icon="📅"
            />
            
            <DashboardCard 
              title="Google Drive" 
              description="Access company documents and files"
              link="/dashboard/manager/google-drive"
              icon="📁"
            />
            
            <DashboardCard 
              title="Google Tasks" 
              description="Manage team tasks and to-dos"
              link="/dashboard/manager/google-tasks"
              icon="✓"
            />
            
            <DashboardCard 
              title="System Settings" 
              description="Configure system preferences and access controls"
              link="#"
              icon="⚙️"
            />
            
            <DashboardCard 
              title="Reports" 
              description="Generate and view operational reports"
              link="#"
              icon="📈"
            />
            
            <DashboardCard 
              title="User Roles" 
              description="Manage user permissions and role assignments"
              link="#"
              icon="🔐"
            />
            
            <DashboardCard 
              title="My Profile" 
              description="Update your account information and preferences"
              link="/dashboard/profile"
              icon="👤"
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
