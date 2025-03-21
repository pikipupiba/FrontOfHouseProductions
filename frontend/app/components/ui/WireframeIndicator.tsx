'use client';

import React from 'react';

/**
 * Component that displays an indicator when the application is in wireframe/demo mode
 * This helps users understand they're viewing a demo version with mock data
 */
export default function WireframeIndicator() {
  return (
    <div className="fixed bottom-0 left-0 w-full bg-yellow-100 text-yellow-800 py-2 px-4 text-center text-sm z-50 shadow-md">
      <p className="font-medium">
        <span className="inline-block mr-2">💡</span>
        <span>Investor Demo Mode - Using Mock Data</span>
        <span className="inline-block ml-2">💡</span>
      </p>
    </div>
  );
}
