'use client';

import { useState } from 'react';
import { createGoogleWorkspaceAdapter } from '@/lib/mock/integrations';
import wireframeConfig from '@/lib/mock/config';

interface GoogleConnectButtonProps {
  isConnected: boolean;
}

export default function GoogleConnectButton({ isConnected }: GoogleConnectButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [connectStatus, setConnectStatus] = useState(isConnected);
  
  // Get the Google Workspace adapter
  const adapter = createGoogleWorkspaceAdapter();
  
  const handleConnect = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('Connecting to Google Workspace...');
      
      // Authenticate with the adapter
      await adapter.authenticate();
      
      // Save connection state to localStorage
      localStorage.setItem('googleWorkspaceConnected', 'true');
      
      // Update state
      setConnectStatus(true);
      
      // Reload page to show connected state
      await wireframeConfig.delay(500);
      window.location.reload();
    } catch (err: any) {
      console.error('Error connecting to Google Workspace:', err);
      setError(err?.message || 'Failed to connect to Google Workspace');
    } finally {
      setLoading(false);
    }
  };
  
  const handleDisconnect = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('Disconnecting from Google Workspace...');
      
      // Simulate disconnection delay
      await wireframeConfig.delay(300);
      
      // Remove connection state from localStorage
      localStorage.removeItem('googleWorkspaceConnected');
      localStorage.removeItem('googleWorkspaceAuthState');
      
      // Update state
      setConnectStatus(false);
      
      // Reload page to show disconnected state
      await wireframeConfig.delay(300);
      window.location.reload();
    } catch (err: any) {
      console.error('Error disconnecting from Google Workspace:', err);
      setError(err?.message || 'Failed to disconnect from Google Workspace');
    } finally {
      setLoading(false);
    }
  };
  
  if (connectStatus) {
    return (
      <div>
        <button
          onClick={handleDisconnect}
          disabled={loading}
          className="inline-flex items-center rounded-md bg-red-50 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-red-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Disconnecting...
            </>
          ) : (
            'Disconnect from Google'
          )}
        </button>
        
        {error && (
          <p className="mt-2 text-sm text-red-600">{error}</p>
        )}
      </div>
    );
  }
  
  return (
    <div>
      <button
        onClick={handleConnect}
        disabled={loading}
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        {loading ? (
          <>
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Connecting...
          </>
        ) : (
          <>
            <svg className="mr-2 -ml-1 w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.383 0 0 5.383 0 12s5.383 12 12 12 12-5.383 12-12S18.617 0 12 0z" fill="#4285F4" />
              <path d="M12 24c6.617 0 12-5.383 12-12S18.617 0 12 0z" fill="#EA4335" />
              <path d="M12 24c6.617 0 12-5.383 12-12S18.617 0 12 0z" fill="#FBBC05" />
              <path d="M12 24c6.617 0 12-5.383 12-12S18.617 0 12 0z" fill="#34A853" />
              <path d="M12 10.875v2.25h5.143A5.36 5.36 0 0 1 16.5 16.5A4.486 4.486 0 0 1 12 18a4.5 4.5 0 0 1 0-9 4.457 4.457 0 0 1 3.152 1.223l1.642-1.642A7.5 7.5 0 1 0 19.5 12c0-.54-.043-1.043-.13-1.5H12v.375z" fill="#F5F5F5" />
            </svg>
            Connect Google Workspace
          </>
        )}
      </button>
      
      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}
