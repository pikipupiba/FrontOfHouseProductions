import { createClient as createServerClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import DashboardCard from '../DashboardCard'
import SignOutButton from '../SignOutButton'

export default async function EmployeePortal() {
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
  
  // Ensure user has employee role
  if (!profile || (profile.role !== 'employee' && profile.role !== 'manager')) {
    redirect('/dashboard')
  }
  
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-lg bg-white p-8 shadow-lg">
          <div className="flex justify-between items-center pb-5 border-b border-gray-200 mb-8">
            <div>
              <h1 className="text-3xl font-bold leading-tight text-gray-900">Employee Portal</h1>
              <p className="mt-1 text-sm text-gray-500">
                Access event information, track equipment, and manage tasks
              </p>
            </div>
            <a href="/dashboard" className="text-sm text-blue-600 hover:text-blue-800">
              Back to Dashboard
            </a>
          </div>
          
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
