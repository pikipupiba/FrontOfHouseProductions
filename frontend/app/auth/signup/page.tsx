'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import GoogleSignInButton from '@/app/components/ui/GoogleSignInButton'
import wireframeConfig from '@/lib/mock/config'

export default function SignUp() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  
  // Non-functional sign-up handler for wireframe demo
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    try {
      // Simulate network delay for realism
      await wireframeConfig.delay(500);
      
      // For wireframe version, just display a message that signup is disabled
      setError('Sign-up is disabled in this demo version. Please use one of the demo accounts on the login page.');
      
      // We don't redirect to login - stay on this page
    } catch (error: any) {
      setError('Sign-up is disabled in this demo version. Please use one of the demo accounts on the login page.');
    } finally {
      setLoading(false)
    }
  }
  
  // Handler to go back to login
  const handleBackToLogin = () => {
    router.push('/auth/login');
  }
  
  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-10 shadow-md relative">
        {/* Overlay to indicate the form is disabled */}
        <div className="absolute inset-0 bg-white bg-opacity-40 flex items-center justify-center rounded-lg z-10">
          <div className="bg-yellow-100 text-yellow-800 p-4 rounded-lg shadow-lg max-w-xs text-center">
            <p className="font-bold">Demo Mode</p>
            <p className="text-sm mt-1">Sign-up is disabled in this demo. Please use the provided test accounts on the login page.</p>
            <button
              onClick={handleBackToLogin}
              className="mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
            >
              Back to Login
            </button>
          </div>
        </div>
        
        <div>
          <h2 className="text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
        </div>
        
        <GoogleSignInButton mode="signup" className="mt-6" />
        
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white px-2 text-gray-500">OR</span>
          </div>
        </div>
        
        <form className="space-y-6" onSubmit={handleSignUp}>
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
              {loading ? 'Signing up...' : 'Sign up'}
            </button>
          </div>
        </form>
        
        <div className="text-center text-sm">
          Already have an account?{' '}
          <Link href="/auth/login" className="text-blue-600 hover:text-blue-500">
            Log in
          </Link>
        </div>
      </div>
      <div className="mt-4 text-center text-xs text-gray-500">
        <p>Investor Demo Version - Using Mock Authentication</p>
      </div>
    </div>
  )
}
