'use client';

import { useEffect, useState } from 'react';
import { redirect, useRouter } from 'next/navigation';
import Link from 'next/link';
import { MockGoogleCalendarEvents } from '../google-workspace/MockGoogleCalendarEvents';
import GoogleConnectButton from '../google-workspace/GoogleConnectButton';

export default function GoogleCalendarPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  
  useEffect(() => {
    // Load user from localStorage
    const storedUser = localStorage.getItem('mockUser');
    if (!storedUser) {
      router.push('/auth/login');
      return;
    }
    
    const parsedUser = JSON.parse(storedUser);
    setUser(parsedUser);
    
    // Check if user is an employee or manager
    if (parsedUser.role !== 'employee' && parsedUser.role !== 'manager') {
      router.push('/dashboard');
      return;
    }
    
    // Check Google Workspace connection status from localStorage
    const authState = localStorage.getItem('googleWorkspaceAuthState');
    if (authState) {
      const parsed = JSON.parse(authState);
      setIsConnected(parsed.isAuthenticated);
      if (parsed.expiresAt) {
        setLastUpdated(new Date(parsed.expiresAt).toISOString());
      }
    }
    
    setLoading(false);
  }, [router]);
  
  if (loading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Google Calendar</h1>
        <div className="flex space-x-4">
          <Link 
            href="/dashboard/employee/google-drive" 
            className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50"
          >
            Google Drive
          </Link>
          <Link 
            href="/dashboard/employee/google-tasks" 
            className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50"
          >
            Google Tasks
          </Link>
          <Link 
            href="/dashboard/employee" 
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
            {isConnected && lastUpdated && (
              <p className="text-sm text-gray-600">
                Last updated: {new Date(lastUpdated).toLocaleString()}
              </p>
            )}
          </div>
          <GoogleConnectButton isConnected={isConnected} />
        </div>
      </div>

      {isConnected ? (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Upcoming Calendar Events</h2>
          <MockGoogleCalendarEvents />
        </div>
      ) : (
        <div className="bg-gray-50 rounded-lg border border-gray-200 p-8 text-center">
          <h3 className="text-xl font-medium mb-4">Connect Your Google Calendar</h3>
          <p className="text-gray-600 mb-6">
            Connect your Google account to access your calendar events directly in the employee portal.
          </p>
          <GoogleConnectButton isConnected={false} />
        </div>
      )}
    </div>
  );
}
