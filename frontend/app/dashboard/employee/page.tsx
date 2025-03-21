'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import DashboardCard from '../DashboardCard'
import SignOutButton from '../SignOutButton'
import PortalSelector from '../PortalSelector'
import wireframeConfig from '@/lib/mock/config'

export default function EmployeePortal() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [user, setUser] = useState<any>(null)
  const [availableRoles, setAvailableRoles] = useState<string[]>(['customer'])
  const [currentRole, setCurrentRole] = useState<string>('employee')
  
  useEffect(() => {
    async function loadUserData() {
      try {
        console.log('Employee Dashboard initializing...') // Debug logging
        
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
          console.error('localStorage access error in employee dashboard:', storageError)
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
          
          // Verify the current user is allowed to access this page
          if (userRole !== 'employee' && userRole !== 'manager') {
            console.log('User does not have permission to access employee dashboard, redirecting...') // Debug logging
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
        console.error('Error in employee dashboard initialization:', error)
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
          <p className="mt-4 text-gray-600">Loading employee dashboard...</p>
          
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
            <h1 className="text-3xl font-bold leading-tight text-gray-900">Employee Portal</h1>
            <p className="mt-1 text-sm text-gray-500">
              Access event information, track equipment, and manage tasks
            </p>
          </div>
          
          {/* Portal selector component */}
          {availableRoles.length > 1 && (
            <PortalSelector 
              availableRoles={availableRoles} 
              currentRole={currentRole}
            />
          )}
          
          <div className="bg-blue-50 rounded-lg p-4 mb-8 flex items-center">
            <div className="text-2xl mr-4">⏰</div>
            <div>
              <h3 className="font-medium">Time Tracking</h3>
              <div className="flex space-x-2 mt-2">
                <button className="bg-green-600 text-white px-3 py-1 rounded text-sm font-medium hover:bg-green-700">
                  Clock In
                </button>
                <button className="bg-red-600 text-white px-3 py-1 rounded text-sm font-medium hover:bg-red-700">
                  Clock Out
                </button>
              </div>
            </div>
          </div>
          
          <h2 className="text-xl font-semibold mb-4">Current Events</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-8">
            <DashboardCard 
              title="Assigned Events" 
              description="View your upcoming and current event assignments"
              link="#"
              icon="📅"
            />
            
            <DashboardCard 
              title="Loading Lists" 
              description="Access equipment and loading information for events"
              link="#"
              icon="📦"
            />
            
            <DashboardCard 
              title="Event Information" 
              description="Access venue details, contacts, and timelines"
              link="#"
              icon="ℹ️"
            />
          </div>
          
          <h2 className="text-xl font-semibold mb-4">Equipment Management</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-8">
            <DashboardCard 
              title="Track Equipment" 
              description="Scan RFID tags to track equipment status and location"
              link="#"
              icon="📡"
            />
            
            <DashboardCard 
              title="Equipment Condition" 
              description="Report and document equipment issues or damage"
              link="#"
              icon="🔍"
            />
            
            <DashboardCard 
              title="Inventory" 
              description="View and search current inventory status"
              link="#"
              icon="📊"
            />
          </div>
          
          <h2 className="text-xl font-semibold mb-4">Tools & Resources</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-8">
            <DashboardCard 
              title="Google Calendar" 
              description="View and manage your calendar events"
              link="/dashboard/employee/google-calendar"
              icon="📅"
            />
            
            <DashboardCard 
              title="Google Drive" 
              description="Access your documents and files"
              link="/dashboard/employee/google-drive"
              icon="📁"
            />
            
            <DashboardCard 
              title="Google Tasks" 
              description="Manage your tasks and to-dos"
              link="/dashboard/employee/google-tasks"
              icon="✓"
            />
            
            <DashboardCard 
              title="Task Management" 
              description="View, update, and complete assigned tasks"
              link="#"
              icon="✅"
            />
            
            <DashboardCard 
              title="FOHP Contacts" 
              description="Quick access to company contact information"
              link="#"
              icon="👥"
            />
            
            <DashboardCard 
              title="Power Calculator" 
              description="Calculate power requirements for equipment setups"
              link="#"
              icon="⚡"
            />
            
            <DashboardCard 
              title="Training Documents" 
              description="Access training materials and equipment guides"
              link="#"
              icon="📚"
            />
            
            <DashboardCard 
              title="Emergency Plans" 
              description="View emergency procedures and action plans"
              link="#"
              icon="🚨"
            />
            
            <DashboardCard 
              title="My Profile" 
              description="Update your account information and preferences"
              link="/dashboard/profile"
              icon="👤"
            />
            
            <div className="overflow-hidden rounded-lg bg-red-50 shadow">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0 text-3xl">🆘</div>
                  <div className="ml-5">
                    <h3 className="text-lg font-medium leading-6 text-red-900">SOS Button</h3>
                    <p className="mt-1 text-sm text-red-700">Request immediate assistance in emergencies</p>
                  </div>
                </div>
                <div className="mt-4">
                  <button className="bg-red-600 text-sm font-medium text-white px-4 py-2 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">
                    Emergency Assistance
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <h2 className="text-xl font-semibold mb-4">Administration</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-8">
            <DashboardCard 
              title="Mileage Tracking" 
              description="Log and report travel for reimbursement"
              link="#"
              icon="🚗"
            />
            
            <DashboardCard 
              title="Purchase Requests" 
              description="Submit equipment purchase requests"
              link="#"
              icon="🛒"
            />
            
            <DashboardCard 
              title="Reimbursements" 
              description="Submit expense reimbursement requests"
              link="#"
              icon="💰"
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
