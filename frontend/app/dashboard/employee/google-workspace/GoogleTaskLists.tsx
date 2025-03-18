'use client';

export function GoogleTaskLists() {
  return (
    <div className="space-y-4">
      <div className="p-6 text-center bg-gray-50 rounded-lg">
        <div className="mb-4">
          <span className="inline-flex items-center rounded-md bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-800 ring-1 ring-inset ring-yellow-600/20">
            Coming Soon
          </span>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Tasks Integration</h3>
        <p className="text-gray-600 max-w-md mx-auto">
          Our Google Tasks integration is temporarily unavailable while we improve its reliability.
          The Drive integration remains fully functional.
        </p>
        
        {/* Placeholder task lists */}
        <div className="mt-6 bg-white border border-gray-200 rounded-lg shadow-sm max-w-md mx-auto">
          <div className="p-4">
            <div className="h-5 bg-gray-200 rounded w-1/2 mb-3 animate-pulse"></div>
            
            <div className="space-y-3">
              <div className="flex items-center">
                <div className="h-4 w-4 rounded-full border border-gray-300 mr-3"></div>
                <div className="h-4 bg-gray-100 rounded w-3/4 animate-pulse"></div>
              </div>
              <div className="flex items-center">
                <div className="h-4 w-4 rounded-full border border-gray-300 mr-3"></div>
                <div className="h-4 bg-gray-100 rounded w-2/3 animate-pulse"></div>
              </div>
              <div className="flex items-center">
                <div className="h-4 w-4 rounded-full border border-gray-300 mr-3"></div>
                <div className="h-4 bg-gray-100 rounded w-1/2 animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="text-center pt-2">
        <a 
          href="https://tasks.google.com/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-sm text-blue-600 hover:text-blue-800 font-medium"
        >
          View Tasks in Google →
        </a>
      </div>
    </div>
  );
}
