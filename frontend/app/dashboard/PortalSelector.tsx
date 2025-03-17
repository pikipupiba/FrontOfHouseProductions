'use client'

import Link from 'next/link'
import { useState } from 'react'

type PortalSelectorProps = {
  availableRoles: string[]
  currentRole: string
}

export default function PortalSelector({ availableRoles, currentRole }: PortalSelectorProps) {
  const [activeRole, setActiveRole] = useState(currentRole)
  
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
  
  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4">Switch Portal</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {availableRoles.map((role) => (
          <div 
            key={role}
            className={`flex border rounded-lg p-4 cursor-pointer transition-colors ${
              activeRole === role 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50/50'
            }`}
            onClick={() => setActiveRole(role)}
          >
            <div className="flex-shrink-0 text-2xl mr-3">
              {roleIcons[role]}
            </div>
            <div>
              <h3 className="font-medium">{roleLabels[role]}</h3>
              <p className="text-sm text-gray-500">{roleDescriptions[role]}</p>
              {activeRole === role ? (
                <span className="inline-flex items-center mt-2 text-xs text-blue-700 font-medium">
                  Currently active
                </span>
              ) : (
                <Link 
                  href={`/dashboard/${role}`} 
                  className="inline-flex items-center mt-2 text-xs text-blue-600 hover:text-blue-800 font-medium"
                >
                  Switch to this portal
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
