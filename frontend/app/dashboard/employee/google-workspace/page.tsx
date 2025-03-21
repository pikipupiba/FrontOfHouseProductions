'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createGoogleWorkspaceAdapter } from '@/lib/mock/integrations'
import type { IntegrationError } from '@/lib/integrations/core/types'
import wireframeConfig from '@/lib/mock/config'

// Component to display calendar events
interface CalendarEvent {
  id: string
  summary: string
  description?: string
  location?: string
  start: { dateTime: string; timeZone: string }
  end: { dateTime: string; timeZone: string }
  status: 'confirmed' | 'tentative' | 'cancelled'
}

// Component to display tasks
interface Task {
  id: string
  title: string
  notes?: string
  due?: string
  completed?: string
  status: 'needsAction' | 'completed'
}

export default function GoogleWorkspacePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [authenticating, setAuthenticating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  
  // Create adapter instance
  const adapter = createGoogleWorkspaceAdapter()
  
  // Check authentication status on load
  useEffect(() => {
    const checkAuth = async () => {
      setLoading(true)
      
      try {
        const authStatus = await adapter.checkAuthStatus()
        setIsAuthenticated(authStatus.isAuthenticated)
        
        if (authStatus.isAuthenticated) {
          // Load data if authenticated
          await fetchData()
        }
      } catch (err) {
        console.error('Error checking authentication:', err)
        setError('Failed to check authentication status')
      } finally {
        setLoading(false)
      }
    }
    
    checkAuth()
  }, [])
  
  // Authenticate with Google Workspace
  const handleAuthenticate = async () => {
    setAuthenticating(true)
    setError(null)
    
    try {
      await adapter.authenticate()
      setIsAuthenticated(true)
      
      // Load data after authentication
      await fetchData()
    } catch (err) {
      const integrationError = err as IntegrationError
      setError(`Authentication failed: ${integrationError.message || 'Unknown error'}`)
    } finally {
      setAuthenticating(false)
    }
  }
  
  // Fetch calendar events and tasks
  const fetchData = async () => {
    setLoading(true)
    setError(null)
    
    try {
      // Fetch calendar events
      const events = await adapter.fetchResources<CalendarEvent>('calendarEvents', {
        sort: [{ field: 'start.dateTime', direction: 'asc' }],
        filters: {
          status: 'confirmed'
        }
      })
      
      setCalendarEvents(events)
      
      // Fetch tasks
      const tasksList = await adapter.fetchResources<Task>('tasks', {
        sort: [{ field: 'due', direction: 'asc' }],
        filters: {
          status: 'needsAction',
          hidden: false,
          deleted: false
        }
      })
      
      setTasks(tasksList)
    } catch (err) {
      const integrationError = err as IntegrationError
      setError(`Failed to load data: ${integrationError.message || 'Unknown error'}`)
    } finally {
      setLoading(false)
    }
  }
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    }).format(date)
  }
  
  // Mark a task as completed
  const markTaskComplete = async (taskId: string) => {
    try {
      await adapter.updateResource('tasks', taskId, {
        status: 'completed',
        completed: new Date().toISOString()
      })
      
      // Refresh tasks
      const tasksList = await adapter.fetchResources<Task>('tasks', {
        sort: [{ field: 'due', direction: 'asc' }],
        filters: {
          status: 'needsAction',
          hidden: false,
          deleted: false
        }
      })
      
      setTasks(tasksList)
    } catch (err) {
      const integrationError = err as IntegrationError
      setError(`Failed to update task: ${integrationError.message || 'Unknown error'}`)
    }
  }
  
  // Not authenticated state
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Google Workspace Integration</h1>
            <p className="mt-2 text-sm text-gray-600">Connect to Google Workspace to access your calendar, files, and tasks</p>
          </div>
          
          <div className="bg-white shadow rounded-lg p-6 max-w-md mx-auto">
            <div className="text-center space-y-6">
              <div className="rounded-full h-20 w-20 bg-blue-100 mx-auto flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="48" height="48">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
              </div>
              
              <h2 className="text-xl font-medium text-gray-900">Connect to Google Workspace</h2>
              
              <p className="text-sm text-gray-600">
                Connect your Google Workspace account to see your calendar events, access files, and manage tasks.
              </p>
              
              <div className="pt-4">
                <button
                  type="button"
                  onClick={handleAuthenticate}
                  disabled={authenticating}
                  className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-6 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-70"
                >
                  {authenticating ? 'Connecting...' : 'Connect Google Workspace'}
                </button>
              </div>
              
              {error && (
                <div className="rounded-md bg-red-50 p-4 mt-4">
                  <div className="text-sm text-red-700">{error}</div>
                </div>
              )}
              
              <div className="text-xs text-gray-500 pt-4">
                <p>This integration is simulated for the wireframe demonstration.</p>
                <p>No actual authentication or API calls are made to Google services.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
  
  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }
  
  // Main dashboard content when authenticated
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="pb-5 border-b border-gray-200 mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Google Workspace</h1>
            <p className="mt-2 text-sm text-gray-600">Access your integrated Google Workspace services</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link 
              href="/dashboard/employee/google-calendar" 
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none"
            >
              Calendar
            </Link>
            <Link 
              href="/dashboard/employee/google-drive" 
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-green-700 bg-green-100 hover:bg-green-200 focus:outline-none"
            >
              Drive
            </Link>
            <Link 
              href="/dashboard/employee/google-tasks" 
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-purple-700 bg-purple-100 hover:bg-purple-200 focus:outline-none"
            >
              Tasks
            </Link>
          </div>
        </div>
        
        {error && (
          <div className="rounded-md bg-red-50 p-4 mb-6">
            <div className="text-sm text-red-700">{error}</div>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Calendar Events Section */}
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-lg font-medium text-gray-900">Upcoming Events</h2>
                <p className="text-sm text-gray-600">Your scheduled calendar events</p>
              </div>
              <button
                onClick={fetchData}
                className="p-1 rounded-md hover:bg-gray-100"
                title="Refresh events"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            </div>
            
            {calendarEvents.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p>No upcoming events found</p>
              </div>
            ) : (
              <ul className="divide-y divide-gray-200">
                {calendarEvents.map((event) => (
                  <li key={event.id} className="py-4">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-md flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">{event.summary}</p>
                        {event.location && (
                          <p className="text-xs text-gray-500 mt-1 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            {event.location}
                          </p>
                        )}
                        <p className="text-xs text-gray-500 mt-1 flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {formatDate(event.start.dateTime)}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
          
          {/* Tasks Section */}
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-lg font-medium text-gray-900">Tasks</h2>
                <p className="text-sm text-gray-600">Your pending tasks</p>
              </div>
              <button
                onClick={fetchData}
                className="p-1 rounded-md hover:bg-gray-100"
                title="Refresh tasks"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            </div>
            
            {tasks.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
                <p>No pending tasks</p>
              </div>
            ) : (
              <ul className="divide-y divide-gray-200">
                {tasks.map((task) => (
                  <li key={task.id} className="py-4">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 pt-1">
                        <button
                          onClick={() => markTaskComplete(task.id)}
                          className="h-5 w-5 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 focus:outline-none"
                        >
                          <span className="sr-only">Mark as complete</span>
                        </button>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">{task.title}</p>
                        {task.notes && (
                          <p className="text-xs text-gray-500 mt-1">{task.notes}</p>
                        )}
                        {task.due && (
                          <p className="text-xs text-gray-500 mt-1 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            Due: {formatDate(task.due)}
                          </p>
                        )}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        
        <div className="mt-8 text-center text-xs text-gray-500">
          <p>All data shown is simulated for demonstration purposes.</p>
          <p>No actual Google Workspace data is being accessed.</p>
        </div>
      </div>
    </div>
  )
}
