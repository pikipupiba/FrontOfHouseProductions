import { Suspense } from 'react';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { GoogleTaskLists } from '../../employee/google-workspace/GoogleTaskLists';
import GoogleConnectButton from '../../employee/google-workspace/GoogleConnectButton';

export const metadata = {
  title: 'Google Tasks - Front of House Productions',
  description: 'Manage your Google Tasks',
};

export default async function ManagerGoogleTasksPage() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();

  // Check if user is logged in
  if (!session) {
    redirect('/auth/login');
  }

  // Check if the user is a manager
  const { data: userRole } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', session.user.id)
    .single();

  if (!userRole || userRole.role !== 'manager') {
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
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Google Tasks</h1>
        <div className="flex space-x-4">
          <Link 
            href="/dashboard/manager/google-calendar" 
            className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50"
          >
            Google Calendar
          </Link>
          <Link 
            href="/dashboard/manager/google-drive" 
            className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50"
          >
            Google Drive
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
                Last updated: {new Date(oauthCredentials.updated_at).toLocaleString()}
              </p>
            )}
          </div>
          <GoogleConnectButton isConnected={isConnected} />
        </div>
      </div>

      {isConnected ? (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Team Task Management</h2>
          <Suspense fallback={<div className="p-4 text-center">Loading tasks...</div>}>
            <GoogleTaskLists />
          </Suspense>
        </div>
      ) : (
        <div className="bg-gray-50 rounded-lg border border-gray-200 p-8 text-center">
          <h3 className="text-xl font-medium mb-4">Connect Your Google Tasks</h3>
          <p className="text-gray-600 mb-6">
            Connect your Google account to access and manage your tasks directly in the manager portal.
          </p>
          <GoogleConnectButton isConnected={false} />
        </div>
      )}
    </div>
  );
}
