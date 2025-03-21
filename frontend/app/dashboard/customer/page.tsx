'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import DashboardCard from '../DashboardCard';
import SignOutButton from '../SignOutButton';
import PortalSelector from '../PortalSelector';
import { mockCustomers } from '@/lib/mock/data/customers';
import { mockRentals } from '@/lib/mock/data/rentals';
import wireframeConfig from '@/lib/mock/config';

export default function CustomerPortal() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [customerData, setCustomerData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [availableRoles, setAvailableRoles] = useState(['customer']);
  const [currentRole, setCurrentRole] = useState('customer');
  
  useEffect(() => {
    async function loadUserData() {
      try {
        // Simulate network delay
        await wireframeConfig.delay(600);
        
        // Get current user from localStorage (set during mock auth)
        const storedUser = localStorage.getItem('mockUser');
        
        // If no user data in localStorage, redirect to login
        if (!storedUser) {
          router.push('/auth/login');
          return;
        }
        
        // Parse the user data
        const userData = JSON.parse(storedUser);
        setUser(userData);
        
        // Get user role (in mock implementation, role is directly on the user object)
        const userRole = userData.role || 'customer';
        setCurrentRole(userRole);
        
        // Determine available roles for portal selector
        const roles = ['customer'];
        
        // Add roles based on user's highest role
        if (userRole === 'employee' || userRole === 'manager') {
          roles.push('employee');
        }
        
        if (userRole === 'manager') {
          roles.push('manager');
        }
        
        setAvailableRoles(roles);
        
        // Find customer data if user is a customer
        if (userData.id) {
          // Find the corresponding customer data
          const customer = mockCustomers.find(c => c.userId === userData.id);
          if (customer) {
            setCustomerData(customer);
            
            // Get related rentals
            await wireframeConfig.delay(300);
            const userRentals = mockRentals.filter(rental => 
              rental.customerId === userData.id
            );
            
            // We could store these rentals in state if needed for the UI
          }
        }
      } catch (error) {
        console.error('Error loading customer portal data:', error);
      } finally {
        setIsLoading(false);
      }
    }
    
    loadUserData();
  }, [router]);
  
  // Show a loading indicator while data is loading
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }
  
  // If user is not authenticated, this should not render (redirect happens in useEffect)
  if (!user) {
    return null;
  }
  
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-lg bg-white p-8 shadow-lg">
          <div className="pb-5 border-b border-gray-200 mb-8">
            <h1 className="text-3xl font-bold leading-tight text-gray-900">Customer Portal</h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage your rentals, events, and documents
            </p>
            {customerData && (
              <p className="mt-2 text-sm font-medium text-indigo-600">
                Welcome, {customerData.primaryContact.name} | {customerData.companyName}
              </p>
            )}
          </div>
          
          {/* Portal selector component */}
          {availableRoles.length > 1 && (
            <PortalSelector 
              availableRoles={availableRoles} 
              currentRole={currentRole}
            />
          )}
          
          <h2 className="text-xl font-semibold mb-4">Rentals & Events</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-8">
            <DashboardCard 
              title="My Rentals" 
              description="View and manage your current and past equipment rentals"
              link="#"
              icon="📋"
            />
            
            <DashboardCard 
              title="Schedule New Rental" 
              description="Browse equipment and book for your next event"
              link="#"
              icon="🗓️"
            />
            
            <DashboardCard 
              title="Event Timeline" 
              description="Track important dates and milestones for your events"
              link="#"
              icon="⏱️"
            />
          </div>
          
          <h2 className="text-xl font-semibold mb-4">Documents & Assets</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-8">
            <DashboardCard 
              title="Upload Files" 
              description="Share event photos, videos, and documents"
              link="#"
              icon="📁"
            />
            
            <DashboardCard 
              title="Stage Plots" 
              description="Manage your venue layouts and technical specifications"
              link="#"
              icon="📐"
            />
            
            <DashboardCard 
              title="Contracts & Forms" 
              description="Access and sign important documents"
              link="#"
              icon="📝"
            />
          </div>
          
          <h2 className="text-xl font-semibold mb-4">My Account</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-8">
            <DashboardCard 
              title="My Profile" 
              description="Update your account information and preferences"
              link="/dashboard/profile"
              icon="👤"
            />
            
            <DashboardCard 
              title="Billing Information" 
              description="Manage your payment methods and billing history"
              link="#"
              icon="💳"
            />
            
            <DashboardCard 
              title="Notifications" 
              description="Set up email and SMS alerts for your rentals"
              link="#"
              icon="🔔"
            />
          </div>
          
          <h2 className="text-xl font-semibold mb-4">Support</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-8">
            <DashboardCard 
              title="Contact Us" 
              description="Get in touch with an FOHP representative"
              link="/contact"
              icon="📞"
            />
            
            <DashboardCard 
              title="Equipment Catalog" 
              description="Browse our full inventory of available equipment"
              link="#"
              icon="🎛️"
            />
            
            <DashboardCard 
              title="Knowledge Base" 
              description="Find answers to common questions and issues"
              link="#"
              icon="📚"
            />
          </div>
          
          <div className="mt-8 flex justify-end">
            <SignOutButton />
          </div>
        </div>
      </div>
    </div>
  );
}
