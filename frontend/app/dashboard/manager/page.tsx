import { createClient as createServerClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import DashboardCard from '../DashboardCard'
import SignOutButton from '../SignOutButton'

export default async function ManagerPortal() {
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
  
  // Ensure user has manager role
  if (!profile || profile.role !== 'manager') {
    redirect('/dashboard')
  }
  
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-lg bg-white p-8 shadow-lg">
          <div className="flex justify-between items-center pb-5 border-b border-gray-200 mb-8">
            <div>
              <h1 className="text-3xl font-bold leading-tight text-gray-900">Management Portal</h1>
              <p className="mt-1 text-sm text-gray-500">
                Oversee operations, approve requests, and manage staff
              </p>
            </div>
            <a href="/dashboard" className="text-sm text-blue-600 hover:text-blue-800">
              Back to Dashboard
            </a>
          </div>
          
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
              title="Google Workspace" 
              description="Access company calendar and documents"
              link="#"
              icon="🔄"
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
