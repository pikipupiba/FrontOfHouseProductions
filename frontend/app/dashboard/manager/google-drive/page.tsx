'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { MockGoogleDriveFiles } from '../../employee/google-workspace/MockGoogleDriveFiles';
import GoogleConnectButton from '../../employee/google-workspace/GoogleConnectButton';
import wireframeConfig from '@/lib/mock/config';

export default function ManagerGoogleDrivePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [isConnected, setIsConnected] = useState(false);
  
  useEffect(() => {
    async function loadUserData() {
      try {
        console.log('Manager Google Drive Page initializing...'); // Debug logging
        
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
          console.error('localStorage access error in Manager Google Drive page:', storageError);
          throw new Error('Your browser seems to be blocking storage access. Please ensure cookies and site data are enabled.');
        }
        
        // Simulate network delay
        await wireframeConfig.delay(300);
        
        // Get current user from localStorage (set during mock auth)
        console.log('Checking for stored user data...'); // Debug logging
        const storedUser = localStorage.getItem('mockUser');
        
        // If no user data in localStorage, redirect to login
        if (!storedUser) {
          console.log('No user data found, redirecting to login...'); // Debug logging
          setErrorMsg('No user session found. Please log in again.');
          window.location.href = '/auth/login';
          return;
        }
        
        // Parse the user data
        let userData;
        try {
          userData = JSON.parse(storedUser);
          console.log('Found user data:', userData.email, 'Role:', userData.role); // Debug logging
          setUser(userData);
          
          // Get user role (in mock implementation, role is directly on the user object)
          const userRole = userData.role || 'customer';
          
          // Verify the current user is allowed to access this page (manager only)
          if (userRole !== 'manager') {
            console.log('User does not have permission to access manager dashboard, redirecting...'); // Debug logging
            window.location.href = '/dashboard';
            return;
          }
          
          // Check if Google Workspace is connected
          const workspaceConnected = localStorage.getItem('googleWorkspaceConnected') === 'true';
          setIsConnected(workspaceConnected);
          console.log('Google Workspace connected:', workspaceConnected); // Debug logging
          
        } catch (parseError) {
          console.error('Error parsing user data:', parseError);
          localStorage.removeItem('mockUser'); // Clean up invalid data
          setErrorMsg('Invalid user data. Please log in again.');
          window.location.href = '/auth/login';
          return;
        }
        
      } catch (error: any) {
        console.error('Error in Google Drive page initialization:', error);
        setErrorMsg(error?.message || 'Error loading dashboard. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
    
    loadUserData();
  }, [router]);
  
  // Show a loading indicator while initializing
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading Google Drive...</p>
          
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
  
  // Main content when authenticated
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Google Drive</h1>
        <div className="flex space-x-4">
          <Link 
            href="/dashboard/manager/google-calendar" 
            className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50"
          >
            Google Calendar
          </Link>
          <Link 
            href="/dashboard/manager/google-tasks" 
            className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50"
          >
            Google Tasks
          </Link>
          <Link 
            href="/dashboard/manager" 
            className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Connection Status</h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="mb-2">
              Status: <span className={`font-semibold ${isConnected ? 'text-green-600' : 'text-red-600'}`}>
                {isConnected ? 'Connected' : 'Not Connected'}
              </span>
            </p>
            {isConnected && (
              <p className="text-sm text-gray-600">
                Last updated: {new Date().toLocaleString()}
              </p>
            )}
          </div>
          <GoogleConnectButton isConnected={isConnected} />
        </div>
      </div>

      {isConnected ? (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Company Files</h2>
          <div className="mb-4 p-3 bg-yellow-50 rounded-md">
            <p className="text-sm text-yellow-800">
              <strong>Manager view:</strong> You have access to all company files and team member documents.
            </p>
          </div>
          <Suspense fallback={<div className="p-4 text-center">Loading files...</div>}>
            <MockGoogleDriveFiles />
          </Suspense>
        </div>
      ) : (
        <div className="bg-gray-50 rounded-lg border border-gray-200 p-8 text-center">
          <h3 className="text-xl font-medium mb-4">Connect Your Google Drive</h3>
          <p className="text-gray-600 mb-6">
            Connect your Google account to access company files and documents directly in the manager portal.
          </p>
          <GoogleConnectButton isConnected={false} />
        </div>
      )}
    </div>
  );
}
