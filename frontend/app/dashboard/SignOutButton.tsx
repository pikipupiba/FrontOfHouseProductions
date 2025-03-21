'use client'

import { useRouter } from 'next/navigation'

export default function SignOutButton() {
  const router = useRouter()
  
  const handleSignOut = async () => {
    // For the wireframe version, just clear localStorage and navigate away
    localStorage.removeItem('mockUser')
    
    // Add a small delay to simulate auth process
    await new Promise(resolve => setTimeout(resolve, 300))
    
    router.push('/')
    router.refresh()
  }
  
  return (
    <button
      onClick={handleSignOut}
      className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
    >
      Sign Out
    </button>
  )
}
