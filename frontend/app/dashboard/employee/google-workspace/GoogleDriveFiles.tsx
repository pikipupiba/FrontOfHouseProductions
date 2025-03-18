'use client';

import { useState, useEffect } from 'react';

interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  webViewLink: string;
  thumbnailLink?: string;
  createdTime?: string;
  modifiedTime?: string;
  size?: string;
}

export function GoogleDriveFiles() {
  const [files, setFiles] = useState<DriveFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchFiles() {
      try {
        setIsLoading(true);
        
        // Fetch recent files
        const response = await fetch(
          '/api/integrations/google-workspace/drive?limit=12'
        );

        if (!response.ok) {
          throw new Error('Failed to fetch drive files');
        }

        const data = await response.json();
        setFiles(data);
      } catch (err) {
        console.error('Error fetching drive files:', err);
        setError(err instanceof Error ? err.message : 'An error occurred while fetching files');
      } finally {
        setIsLoading(false);
      }
    }

    fetchFiles();
  }, []);

  // Get file icon based on mimetype
  const getFileIcon = (mimeType: string) => {
    if (mimeType === 'application/vnd.google-apps.folder') {
      return (
        <svg className="w-10 h-10 text-amber-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19.5 21a3 3 0 003-3v-4.5a3 3 0 00-3-3h-15a3 3 0 00-3 3V18a3 3 0 003 3h15zM1.5 10.146V6a3 3 0 013-3h5.379a2.25 2.25 0 011.59.659l2.122 2.121c.14.141.331.22.53.22H19.5a3 3 0 013 3v1.146A4.483 4.483 0 0019.5 9h-15a4.483 4.483 0 00-3 1.146z" />
        </svg>
      );
    }
    
    if (mimeType.includes('spreadsheet')) {
      return (
        <svg className="w-10 h-10 text-green-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path fillRule="evenodd" d="M5.625 1.5H9a3.75 3.75 0 013.75 3.75v1.875c0 1.036.84 1.875 1.875 1.875H16.5a3.75 3.75 0 013.75 3.75v7.875c0 1.035-.84 1.875-1.875 1.875H5.625a1.875 1.875 0 01-1.875-1.875V3.375c0-1.036.84-1.875 1.875-1.875zM9.75 17.25a.75.75 0 00-1.5 0V18a.75.75 0 001.5 0v-.75zm2.25-3a.75.75 0 01.75.75v3a.75.75 0 01-1.5 0v-3a.75.75 0 01.75-.75zm3.75-1.5a.75.75 0 00-1.5 0V18a.75.75 0 001.5 0v-5.25z" clipRule="evenodd" />
          <path d="M14.25 5.25a5.23 5.23 0 00-1.279-3.434 9.768 9.768 0 016.963 6.963A5.23 5.23 0 0016.5 7.5h-1.875a.375.375 0 01-.375-.375V5.25z" />
        </svg>
      );
    }
    
    if (mimeType.includes('document')) {
      return (
        <svg className="w-10 h-10 text-blue-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0016.5 9h-1.875a1.875 1.875 0 01-1.875-1.875V5.25A3.75 3.75 0 009 1.5H5.625z" />
          <path d="M12.971 1.816A5.23 5.23 0 0114.25 5.25v1.875c0 .207.168.375.375.375H16.5a5.23 5.23 0 013.434 1.279 9.768 9.768 0 00-6.963-6.963z" />
        </svg>
      );
    }
    
    if (mimeType.includes('presentation')) {
      return (
        <svg className="w-10 h-10 text-orange-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path fillRule="evenodd" d="M2.25 2.25a.75.75 0 000 1.5H3v10.5a3 3 0 003 3h1.21l-1.172 3.513a.75.75 0 001.424.474l.329-.987h8.418l.33.987a.75.75 0 001.422-.474l-1.17-3.513H18a3 3 0 003-3V3.75h.75a.75.75 0 000-1.5H2.25zm6.04 16.5l.5-1.5h6.42l.5 1.5H8.29zm7.46-12a.75.75 0 00-1.5 0v6a.75.75 0 001.5 0v-6zm-3 2.25a.75.75 0 00-1.5 0v3.75a.75.75 0 001.5 0V9zm-3 2.25a.75.75 0 00-1.5 0v1.5a.75.75 0 001.5 0v-1.5z" clipRule="evenodd" />
        </svg>
      );
    }
    
    if (mimeType.includes('image')) {
      return (
        <svg className="w-10 h-10 text-purple-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path fillRule="evenodd" d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z" clipRule="evenodd" />
        </svg>
      );
    }
    
    if (mimeType.includes('pdf')) {
      return (
        <svg className="w-10 h-10 text-red-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path d="M11.625 16.5a1.875 1.875 0 100-3.75 1.875 1.875 0 000 3.75z" />
          <path fillRule="evenodd" d="M5.625 1.5H9a3.75 3.75 0 013.75 3.75v1.875c0 1.036.84 1.875 1.875 1.875H16.5a3.75 3.75 0 013.75 3.75v7.875c0 1.035-.84 1.875-1.875 1.875H5.625a1.875 1.875 0 01-1.875-1.875V3.375c0-1.036.84-1.875 1.875-1.875zm6 16.5c.66 0 1.277-.19 1.797-.518l1.048 1.048a.75.75 0 001.06-1.06l-1.047-1.048A3.375 3.375 0 1011.625 18z" clipRule="evenodd" />
          <path d="M14.25 5.25a5.23 5.23 0 00-1.279-3.434 9.768 9.768 0 016.963 6.963A5.23 5.23 0 0016.5 7.5h-1.875a.375.375 0 01-.375-.375V5.25z" />
        </svg>
      );
    }
    
    // Default file icon
    return (
      <svg className="w-10 h-10 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0016.5 9h-1.875a1.875 1.875 0 01-1.875-1.875V5.25A3.75 3.75 0 009 1.5H5.625z" />
        <path d="M12.971 1.816A5.23 5.23 0 0114.25 5.25v1.875c0 .207.168.375.375.375H16.5a5.23 5.23 0 013.434 1.279 9.768 9.768 0 00-6.963-6.963z" />
      </svg>
    );
  };

  // Format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="p-4 text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
        <p className="mt-2 text-gray-600">Loading files...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center bg-red-50 rounded-lg">
        <p className="text-red-600">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-2 text-sm font-medium underline text-red-600"
        >
          Try again
        </button>
      </div>
    );
  }

  if (!files || files.length === 0) {
    return (
      <div className="p-6 text-center bg-gray-50 rounded-lg">
        <p className="text-gray-600">No files found in your Google Drive.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {files.map((file) => (
          <a
            key={file.id}
            href={file.webViewLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center bg-white border rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow duration-150"
          >
            <div className="mb-2">
              {getFileIcon(file.mimeType)}
            </div>
            <h3 className="text-sm font-medium text-center text-gray-900 truncate w-full">
              {file.name}
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              {formatDate(file.modifiedTime || file.createdTime)}
            </p>
          </a>
        ))}
      </div>
      
      <div className="text-center pt-4">
        <a 
          href="https://drive.google.com" 
          target="_blank"
          rel="noopener noreferrer" 
          className="text-sm text-blue-600 hover:text-blue-800 font-medium"
        >
          View All in Google Drive →
        </a>
      </div>
    </div>
  );
}
