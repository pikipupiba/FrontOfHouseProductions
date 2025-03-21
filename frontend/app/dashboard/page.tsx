'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { mockUsers } from '@/lib/mock/data/users';
import { mockCustomers } from '@/lib/mock/data/customers';
import wireframeConfig from '@/lib/mock/config';

export default function Dashboard() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  useEffect(() => {
    async function initializeDashboard() {
      try {
        console.log('Dashboard initializing...'); // Debug logging
        
        // Simulate network delay
        await wireframeConfig.delay(800);
        
        // Test localStorage capability
        try {
          const testKey = `test_storage_${Date.now()}`;
          localStorage.setItem(testKey, 'test');
          const testResult = localStorage.getItem(testKey);
          localStorage.removeItem(testKey);
          
          if (testResult !== 'test') {
            throw new Error('localStorage test failed');
          }
        } catch (storageError) {
          console.error('localStorage access error in dashboard:', storageError);
          throw new Error('Your browser seems to be blocking storage access. Please ensure cookies and site data are enabled.');
        }
        
        // Get current user from localStorage (set during mock auth)
        console.log('Checking for stored user data...'); // Debug logging
        const storedUser = localStorage.getItem('mockUser');
        
        // If no user data in localStorage, redirect to login
        if (!storedUser) {
          console.log('No user data found, redirecting to login...'); // Debug logging
          setErrorMsg('No user session found. Please log in again.');
          // Use window.location for more reliable navigation
          window.location.href = '/auth/login';
          return;
        }
        
        // Parse the user data
        let user;
        try {
          user = JSON.parse(storedUser);
          console.log('Found user data:', user.email, 'Role:', user.role); // Debug logging
        } catch (parseError) {
          console.error('Error parsing user data:', parseError);
          localStorage.removeItem('mockUser'); // Clean up invalid data
          setErrorMsg('Invalid user data. Please log in again.');
          window.location.href = '/auth/login';
          return;
        }
        
        // Get user role (in mock implementation, role is directly on the user object)
        const currentRole = user.role || 'customer';
        const isRoleApproved = true; // In wireframe, all roles are approved
        console.log(`User role: ${currentRole} (Approved: ${isRoleApproved})`); // Debug logging
        
        // Simulate loading customer profile data if needed
        if (currentRole === 'customer') {
          // Find the corresponding customer data
          const customerData = mockCustomers.find(customer => customer.userId === user.id);
          
          // If no customer record exists, we'd create one in a real implementation
          // For the wireframe, we just simulate this delay
          if (!customerData) {
            console.log('No customer profile found, simulating profile creation...'); // Debug logging
            await wireframeConfig.delay(300);
          } else {
            console.log('Found customer profile data'); // Debug logging
          }
        }
        
        // Determine the appropriate portal to redirect to based on user role
        const targetPath = getRedirectPath(currentRole, isRoleApproved);
        console.log(`Redirecting to: ${targetPath}`); // Debug logging
        
        // Add a small delay to ensure everything is ready before navigation
        await wireframeConfig.delay(100);
        
        // Use window.location.href for more reliable navigation
        window.location.href = targetPath;
        
      } catch (error: any) {
        console.error('Error in dashboard initialization:', error);
        // Set error message for display
        setErrorMsg(error?.message || 'Error loading dashboard. Please try again.');
        setIsLoading(false);
      }
    }
    
    initializeDashboard();
  }, [router]);
  
  // Helper function to determine redirect path based on role
  function getRedirectPath(role: string, isApproved: boolean): string {
    if (role === 'manager' && isApproved) {
      return '/dashboard/manager';
    } else if ((role === 'employee' || role === 'manager') && isApproved) {
      return '/dashboard/employee';
    } else {
      // Default to customer portal for customer role or unapproved roles
      return '/dashboard/customer';
    }
  }
  
  // Show a loading indicator while redirecting
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
          
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
    );
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
    );
  }
  
  // This shouldn't render as we always redirect
  return null;
}
