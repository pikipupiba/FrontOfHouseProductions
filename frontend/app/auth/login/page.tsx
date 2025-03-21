'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import GoogleSignInButton from '@/app/components/ui/GoogleSignInButton'
import { verifyMockCredentials } from '@/lib/mock/data/users'
import wireframeConfig from '@/lib/mock/config'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  
  // Function to handle login with provided credentials
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    try {
      console.log(`Login attempt with email: ${email.substring(0, 3)}...`); // Debug logging (partial email for privacy)
      
      // Simulate network delay for realism
      await wireframeConfig.delay(500);
      
      // Verify credentials using our mock function
      const user = verifyMockCredentials(email, password);
      
      if (!user) {
        throw new Error('Invalid login credentials');
      }
      
      // Test localStorage capability before attempting to store
      try {
        const testKey = `test_storage_${Date.now()}`;
        localStorage.setItem(testKey, 'test');
        const testResult = localStorage.getItem(testKey);
        localStorage.removeItem(testKey);
        
        if (testResult !== 'test') {
          throw new Error('localStorage test failed');
        }
      } catch (storageError) {
        console.error('localStorage access error:', storageError);
        throw new Error('Your browser seems to be blocking storage access. Please ensure cookies and site data are enabled.');
      }
      
      // Store user in localStorage for persistence
      const userJson = JSON.stringify(user);
      localStorage.setItem('mockUser', userJson);
      
      // Verify the data was saved correctly
      const savedUser = localStorage.getItem('mockUser');
      if (!savedUser) {
        throw new Error('Failed to save user data. Storage may be restricted.');
      }
      
      console.log('Login successful, redirecting to dashboard...'); // Debug logging
      
      // Add a small delay to ensure storage is complete before navigation
      await wireframeConfig.delay(100);
      
      // Redirect to dashboard - use window.location for more reliable navigation
      window.location.href = '/dashboard';
    } catch (error: any) {
      console.error('Login error:', error); // Debug logging
      setError(error?.message || 'Error logging in. Please try again.')
    } finally {
      setLoading(false)
    }
  }
  
  // Function to log in with a demo account
  const handleDemoLogin = async (accountType: 'manager' | 'employee' | 'customer') => {
    setLoading(true)
    setError(null)
    
    try {
      console.log(`Demo login attempt: ${accountType}`); // Debug logging
      
      // Simulate network delay for realism
      await wireframeConfig.delay(600);
      
      // Set demo credentials based on account type
      let demoUser;
      let email = '';
      let password = 'password123';
      
      switch (accountType) {
        case 'manager':
          email = 'manager@example.com';
          break;
        case 'employee': 
          email = 'employee@example.com';
          break;
        case 'customer':
          email = 'customer@example.com';
          break;
      }
      
      console.log(`Verifying credentials for: ${email}`); // Debug logging
      demoUser = verifyMockCredentials(email, password);
      
      if (!demoUser) {
        throw new Error(`Demo account login failed for ${accountType}`);
      }
      
      // Test localStorage capability before attempting to store
      try {
        const testKey = `test_storage_${Date.now()}`;
        localStorage.setItem(testKey, 'test');
        const testResult = localStorage.getItem(testKey);
        localStorage.removeItem(testKey);
        
        if (testResult !== 'test') {
          throw new Error('localStorage test failed');
        }
      } catch (storageError) {
        console.error('localStorage access error:', storageError);
        throw new Error('Your browser seems to be blocking storage access. Please ensure cookies and site data are enabled.');
      }
      
      // Store user in localStorage for persistence
      const userJson = JSON.stringify(demoUser);
      localStorage.setItem('mockUser', userJson);
      
      // Verify the data was saved correctly
      const savedUser = localStorage.getItem('mockUser');
      if (!savedUser) {
        throw new Error('Failed to save user data. Storage may be restricted.');
      }
      
      console.log(`Login successful for ${accountType}, redirecting...`); // Debug logging
      
      // Add a small delay to ensure storage is complete before navigation
      await wireframeConfig.delay(100);
      
      // Redirect to dashboard - use window.location for more reliable navigation
      window.location.href = '/dashboard';
    } catch (error: any) {
      console.error('Demo login error:', error); // Debug logging
      setError(error?.message || 'Error logging in with demo account. Please try again.');
    } finally {
      setLoading(false)
    }
  }
  
  // Non-functional signup link handler
  const handleSignupClick = (e: React.MouseEvent) => {
    e.preventDefault();
    // Do nothing - link is disabled for wireframe version
  }
  
  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-10 shadow-md">
        <div>
          <h2 className="text-center text-3xl font-extrabold text-gray-900">
            Log in to your account
          </h2>
        </div>
        
        {/* Demo Account Buttons */}
        <div className="space-y-3">
          <h3 className="text-center text-sm font-medium text-gray-700">Quick Login with Demo Accounts</h3>
          
          <div className="grid grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => handleDemoLogin('manager')}
              disabled={loading}
              className="flex flex-col items-center justify-center rounded-md border border-transparent bg-indigo-100 px-4 py-3 text-sm font-medium text-indigo-700 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-70"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mb-1">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
              </svg>
              Manager
            </button>
            
            <button
              type="button"
              onClick={() => handleDemoLogin('employee')}
              disabled={loading}
              className="flex flex-col items-center justify-center rounded-md border border-transparent bg-green-100 px-4 py-3 text-sm font-medium text-green-700 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-70"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mb-1">
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z" />
              </svg>
              Employee
            </button>
            
            <button
              type="button"
              onClick={() => handleDemoLogin('customer')}
              disabled={loading}
              className="flex flex-col items-center justify-center rounded-md border border-transparent bg-blue-100 px-4 py-3 text-sm font-medium text-blue-700 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-70"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mb-1">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
              Customer
            </button>
          </div>
        </div>
        
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white px-2 text-gray-500">OR SIGN IN WITH</span>
          </div>
        </div>
        
        {/* Integration login buttons */}
        <div className="space-y-3">
          <GoogleSignInButton mode="login" className="mt-0" />
          
          <button
            type="button"
            disabled={true}
            className="flex w-full items-center justify-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none disabled:opacity-70 cursor-not-allowed"
            title="DocuSign login disabled in demo mode"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="#2B5796">
              <path d="M12 0C5.383 0 0 5.383 0 12s5.383 12 12 12 12-5.383 12-12S18.617 0 12 0zm0 21.6c-5.3 0-9.6-4.3-9.6-9.6S6.7 2.4 12 2.4s9.6 4.3 9.6 9.6-4.3 9.6-9.6 9.6z"/>
              <path d="M15.5 7H9c-1.1 0-2 .9-2 2v6c0 1.1.9 2 2 2h6.5c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2zm-7 2.5h6.5v5H8.5v-5zm5.5 3.5c.6 0 1-.4 1-1s-.4-1-1-1-1 .4-1 1 .4 1 1 1z"/>
            </svg>
            Sign in with DocuSign (Disabled in Demo)
          </button>
          
          <button
            type="button"
            disabled={true}
            className="flex w-full items-center justify-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none disabled:opacity-70 cursor-not-allowed"
            title="Facebook login disabled in demo mode"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="#1877F2">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            Sign in with Facebook (Disabled in Demo)
          </button>
          
          <button
            type="button"
            disabled={true}
            className="flex w-full items-center justify-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none disabled:opacity-70 cursor-not-allowed"
            title="Apple login disabled in demo mode"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="#000000">
              <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.05-.41C2.33 14.85 3.09 6.4 8.85 6.04c1.4.05 2.35.57 3.08.59.93-.36 2.96-1.09 4.49-.28 1.65.89 2.37 2.48 2.37 2.48s-1.39.74-1.37 2.38c.01 1.9 1.64 2.5 1.64 2.5-.15 1.79-1.09 3.69-2.01 4.57zM12.03 5.28C13.42 3.41 15.88 3.85 15.88 3.85s.3 2.37-1.07 4.14c-1.48 1.9-3.61 1.53-3.61 1.53s-.27-2.04.83-4.24z"/>
            </svg>
            Sign in with Apple (Disabled in Demo)
          </button>
        </div>
        
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white px-2 text-gray-500">OR USE EMAIL</span>
          </div>
        </div>
        
        <form className="space-y-6" onSubmit={handleLogin}>
          <div className="space-y-4 rounded-md shadow-sm">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                placeholder="Email address"
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                placeholder="Password"
              />
            </div>
          </div>
          
          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="text-sm text-red-700">{error}</div>
            </div>
          )}
          
          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400"
            >
              {loading ? 'Logging in...' : 'Log in'}
            </button>
          </div>
        </form>
        
        <div className="text-center text-sm">
          Don't have an account?{' '}
          <a 
            href="#" 
            onClick={handleSignupClick}
            className="text-blue-600 hover:text-blue-500 cursor-not-allowed opacity-70"
            title="Sign-up disabled in demo mode"
          >
            Sign up (disabled in demo)
          </a>
        </div>
      </div>
      <div className="mt-4 text-center text-xs text-gray-500">
        <p>Investor Demo Version - Using Mock Authentication</p>
      </div>
    </div>
  )
}
