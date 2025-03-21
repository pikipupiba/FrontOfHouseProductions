'use client'

import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import ProfileForm from './ProfileForm'
import wireframeConfig from '@/lib/mock/config'

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    const loadUserFromLocalStorage = async () => {
      setLoading(true)
      
      try {
        // Simulate network delay
        await wireframeConfig.delay(500)
        
        // Get user from localStorage
        const storedUser = localStorage.getItem('mockUser')
        
        if (!storedUser) {
          // If not authenticated, redirect to login
          router.push('/auth/login')
          return
        }
        
        // Parse the user data
        const userData = JSON.parse(storedUser)
        setUser(userData)
        
        // Create a profile object based on the user data
        // This simulates what would be fetched from a profiles table
        const profileData = {
          id: userData.id,
          email: userData.email,
          full_name: userData.firstName && userData.lastName 
            ? `${userData.firstName} ${userData.lastName}` 
            : userData.firstName || userData.lastName || '',
          role: userData.role,
          phone: userData.phoneNumber || '',
          avatar_url: userData.avatarUrl || null,
          created_at: userData.created_at,
          updated_at: new Date().toISOString()
        }
        
        setProfile(profileData)
      } catch (error) {
        console.error('Error loading user from localStorage:', error)
      } finally {
        setLoading(false)
      }
    }
    
    loadUserFromLocalStorage()
  }, [router])
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    )
  }
  
  if (!user) {
    return null // This will not render as we redirect in the useEffect
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-lg bg-white p-8 shadow-lg">
          <div className="pb-5 border-b border-gray-200 mb-8">
            <h1 className="text-3xl font-bold leading-tight text-gray-900">My Profile</h1>
            <p className="mt-2 text-sm text-gray-500">
              Update your account information and preferences
            </p>
          </div>
          
          <ProfileForm user={user} profile={profile} />
        </div>
      </div>
    </div>
  )
}
