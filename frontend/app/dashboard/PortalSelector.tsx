'use client'

import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'

type PortalSelectorProps = {
  availableRoles: string[]
  currentRole: string
}

export default function PortalSelector({ availableRoles, currentRole }: PortalSelectorProps) {
  const router = useRouter()
  const pathname = usePathname()
  
  // Extract the current role from the URL path to ensure correct active state after navigation
  const pathRole = pathname.split('/').pop()
  const effectiveCurrentRole = availableRoles.includes(pathRole as string) 
    ? pathRole as string 
    : currentRole
  
  const roleLabels: Record<string, string> = {
    customer: 'Customer Portal',
    employee: 'Employee Portal',
    manager: 'Management Portal'
  }
  
  const roleIcons: Record<string, string> = {
    customer: '🧑‍💼',
    employee: '👷‍♂️',
    manager: '👨‍💼'
  }
  
  const roleDescriptions: Record<string, string> = {
    customer: 'Manage your rentals, documents, and events',
    employee: 'Track equipment, manage events, and access tools',
    manager: 'Oversee operations, approve requests, and manage staff'
  }
  
  if (availableRoles.length <= 1) {
    return null
  }
  
  const handlePortalSwitch = (role: string) => {
    if (role !== effectiveCurrentRole) {
      router.push(`/dashboard/${role}`)
    }
  }
  
  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4">Switch Portal</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {availableRoles.map((role) => (
          <div 
            key={role}
            className={`flex border rounded-lg p-4 cursor-pointer transition-colors ${
              effectiveCurrentRole === role 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50/50'
            }`}
            onClick={() => handlePortalSwitch(role)}
            role="button"
            tabIndex={0}
            aria-label={`Switch to ${roleLabels[role]}`}
          >
            <div className="flex-shrink-0 text-2xl mr-3">
              {roleIcons[role]}
            </div>
            <div>
              <h3 className="font-medium">{roleLabels[role]}</h3>
              <p className="text-sm text-gray-500">{roleDescriptions[role]}</p>
              {effectiveCurrentRole === role ? (
                <span className="inline-flex items-center mt-2 text-xs text-blue-700 font-medium">
                  Currently active
                </span>
              ) : (
                <span className="inline-flex items-center mt-2 text-xs text-blue-600 font-medium">
                  Click to switch
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
