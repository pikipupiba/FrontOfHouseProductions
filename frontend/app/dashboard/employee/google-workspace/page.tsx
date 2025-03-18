import { Suspense } from 'react';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import GoogleConnectButton from './GoogleConnectButton';
import { GoogleCalendarEvents } from './GoogleCalendarEvents';
import { GoogleTaskLists } from './GoogleTaskLists';
import { GoogleDriveFiles } from './GoogleDriveFiles';

export const metadata = {
  title: 'Google Workspace Integration - Front of House Productions',
  description: 'Manage your Google Workspace integration with Front of House Productions',
};

export default async function GoogleWorkspacePage() {
  const supabase = createServerComponentClient({ cookies });
  const { data: { session } } = await supabase.auth.getSession();

  // Check if user is logged in
  if (!session) {
    redirect('/auth/login');
  }

  // Check if the user is an employee
  const { data: userRole } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', session.user.id)
    .single();

  if (!userRole || (userRole.role !== 'employee' && userRole.role !== 'manager')) {
    redirect('/dashboard');
  }

  // Check if user has Google Workspace connected
  const { data: oauthCredentials } = await supabase
    .from('integration_cache.oauth_credentials')
    .select('*')
    .eq('service_name', 'google-workspace')
    .eq('user_id', session.user.id)
    .maybeSingle();

  const isConnected = !!oauthCredentials;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Google Workspace Integration</h1>
      
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
                Last updated: {new Date(oauthCredentials.updated_at).toLocaleString()}
              </p>
            )}
          </div>
          <GoogleConnectButton isConnected={isConnected} />
        </div>
      </div>

      {isConnected ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calendar Events */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Upcoming Calendar Events</h2>
            <Suspense fallback={<div className="p-4 text-center">Loading calendar events...</div>}>
              <GoogleCalendarEvents />
            </Suspense>
          </div>

          {/* Task Lists */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Task Lists</h2>
            <Suspense fallback={<div className="p-4 text-center">Loading task lists...</div>}>
              <GoogleTaskLists />
            </Suspense>
          </div>

          {/* Drive Files */}
          <div className="lg:col-span-3 bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Recent Files</h2>
            <Suspense fallback={<div className="p-4 text-center">Loading drive files...</div>}>
              <GoogleDriveFiles />
            </Suspense>
          </div>
        </div>
      ) : (
        <div className="bg-gray-50 rounded-lg border border-gray-200 p-8 text-center">
          <h3 className="text-xl font-medium mb-4">Connect Your Google Workspace Account</h3>
          <p className="text-gray-600 mb-6">
            Connect your Google Workspace account to access your calendar events, tasks, and files directly in the employee portal.
          </p>
          <GoogleConnectButton isConnected={false} />
        </div>
      )}
    </div>
  );
}
