'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface GoogleConnectButtonProps {
  isConnected: boolean;
}

export default function GoogleConnectButton({ isConnected }: GoogleConnectButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const connectGoogle = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Call the API to get the authorization URL
      const response = await fetch('/api/integrations/google-workspace/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to initiate Google authorization');
      }
      
      const data = await response.json();
      
      // Check if we need to redirect or if we reused existing credentials
      if (data.skipRedirect) {
        // No need to redirect, we're already authenticated via existing Google auth
        // Just refresh the page to update the connection status
        window.location.reload();
        return;
      }
      
      // Redirect to the Google authorization page
      window.location.href = data.authUrl;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error connecting to Google:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const disconnectGoogle = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Call the API to disconnect Google Workspace
      const response = await fetch('/api/integrations/google-workspace/auth', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to disconnect Google account');
      }
      
      // Refresh the page to update the UI
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error disconnecting from Google:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {error && (
        <div className="text-red-600 text-sm mb-2">
          {error}
        </div>
      )}
      
      <button
        onClick={isConnected ? disconnectGoogle : connectGoogle}
        disabled={isLoading}
        className={`px-4 py-2 rounded-md transition-colors font-medium flex items-center justify-center min-w-[160px] ${
          isConnected 
            ? 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200' 
            : 'bg-blue-600 text-white hover:bg-blue-700'
        } ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
      >
        {isLoading ? (
          <div className="flex items-center">
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {isConnected ? 'Disconnecting...' : 'Connecting...'}
          </div>
        ) : (
          <span className="flex items-center">
            {!isConnected && (
              <svg className="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            )}
            {isConnected ? 'Disconnect Google' : 'Connect Google'}
          </span>
        )}
      </button>
    </div>
  );
}
