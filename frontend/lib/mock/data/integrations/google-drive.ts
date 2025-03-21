/**
 * Mock Google Drive data structures
 */
export interface GoogleDriveFile {
  id: string;
  name: string;
  mimeType: string;
  iconLink?: string;
  webViewLink: string;
  thumbnailLink?: string;
  createdTime: string;
  modifiedTime: string;
  size?: string;
  description?: string;
  starred?: boolean;
  owners: {
    displayName: string;
    emailAddress: string;
    photoLink?: string;
  }[];
  shared: boolean;
  parents?: string[];
  capabilities?: {
    canEdit: boolean;
    canComment: boolean;
    canShare: boolean;
    canDownload: boolean;
  };
  fileExtension?: string;
  md5Checksum?: string;
}

export interface GoogleDriveFolder {
  id: string;
  name: string;
  mimeType: 'application/vnd.google-apps.folder';
  webViewLink: string;
  createdTime: string;
  modifiedTime: string;
  description?: string;
  starred?: boolean;
  owners: {
    displayName: string;
    emailAddress: string;
    photoLink?: string;
  }[];
  shared: boolean;
  parents?: string[];
  capabilities?: {
    canEdit: boolean;
    canComment: boolean;
    canShare: boolean;
  };
  folderColorRgb?: string;
}

/**
 * Common mime types for files
 */
export const MIME_TYPES = {
  FOLDER: 'application/vnd.google-apps.folder',
  DOCUMENT: 'application/vnd.google-apps.document',
  SPREADSHEET: 'application/vnd.google-apps.spreadsheet',
  PRESENTATION: 'application/vnd.google-apps.presentation',
  PDF: 'application/pdf',
  IMAGE_JPEG: 'image/jpeg',
  IMAGE_PNG: 'image/png',
  TEXT: 'text/plain',
  ZIP: 'application/zip',
  AUDIO_MP3: 'audio/mpeg',
  VIDEO_MP4: 'video/mp4'
};

/**
 * Mock Google Drive folders
 */
export const mockGoogleDriveFolders: GoogleDriveFolder[] = [
  {
    id: 'folder-1',
    name: 'Event Production Files',
    mimeType: 'application/vnd.google-apps.folder',
    webViewLink: 'https://drive.google.com/drive/folders/mockFolder1',
    createdTime: '2023-01-15T10:00:00Z',
    modifiedTime: '2023-08-20T14:30:00Z',
    description: 'Main folder for all event production documents',
    starred: true,
    owners: [
      {
        displayName: 'Taylor Employee',
        emailAddress: 'employee@example.com',
        photoLink: 'https://i.pravatar.cc/150?u=employee'
      }
    ],
    shared: true,
    capabilities: {
      canEdit: true,
      canComment: true,
      canShare: true
    }
  },
  {
    id: 'folder-2',
    name: 'Client Contracts',
    mimeType: 'application/vnd.google-apps.folder',
    webViewLink: 'https://drive.google.com/drive/folders/mockFolder2',
    createdTime: '2023-02-10T15:30:00Z',
    modifiedTime: '2023-07-20T09:15:00Z',
    starred: false,
    owners: [
      {
        displayName: 'Jordan Manager',
        emailAddress: 'manager@example.com',
        photoLink: 'https://i.pravatar.cc/150?u=manager'
      }
    ],
    shared: true,
    parents: ['folder-1'],
    capabilities: {
      canEdit: true,
      canComment: true,
      canShare: true
    }
  },
  {
    id: 'folder-3',
    name: 'Equipment Manuals',
    mimeType: 'application/vnd.google-apps.folder',
    webViewLink: 'https://drive.google.com/drive/folders/mockFolder3',
    createdTime: '2023-03-05T08:45:00Z',
    modifiedTime: '2023-08-10T16:20:00Z',
    description: 'Technical documentation for all equipment',
    starred: false,
    owners: [
      {
        displayName: 'Taylor Employee',
        emailAddress: 'employee@example.com',
        photoLink: 'https://i.pravatar.cc/150?u=employee'
      }
    ],
    shared: true,
    parents: ['folder-1'],
    capabilities: {
      canEdit: true,
      canComment: true,
      canShare: true
    }
  },
  {
    id: 'folder-4',
    name: 'Event Photos',
    mimeType: 'application/vnd.google-apps.folder',
    webViewLink: 'https://drive.google.com/drive/folders/mockFolder4',
    createdTime: '2023-04-20T11:30:00Z',
    modifiedTime: '2023-08-15T10:45:00Z',
    description: 'Photos from past events',
    starred: true,
    owners: [
      {
        displayName: 'Taylor Employee',
        emailAddress: 'employee@example.com',
        photoLink: 'https://i.pravatar.cc/150?u=employee'
      }
    ],
    shared: true,
    parents: ['folder-1'],
    capabilities: {
      canEdit: true,
      canComment: true,
      canShare: true
    },
    folderColorRgb: '#4285F4'
  },
  {
    id: 'folder-5',
    name: 'Venue Layouts',
    mimeType: 'application/vnd.google-apps.folder',
    webViewLink: 'https://drive.google.com/drive/folders/mockFolder5',
    createdTime: '2023-05-12T09:15:00Z',
    modifiedTime: '2023-07-30T14:20:00Z',
    description: 'Floor plans and venue documentation',
    starred: false,
    owners: [
      {
        displayName: 'Taylor Employee',
        emailAddress: 'employee@example.com',
        photoLink: 'https://i.pravatar.cc/150?u=employee'
      }
    ],
    shared: true,
    parents: ['folder-1'],
    capabilities: {
      canEdit: true,
      canComment: true,
      canShare: true
    }
  }
];

/**
 * Mock Google Drive files
 */
export const mockGoogleDriveFiles: GoogleDriveFile[] = [
  // Contract Files
  {
    id: 'file-1',
    name: 'Standard_Event_Contract_Template.docx',
    mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    webViewLink: 'https://drive.google.com/file/d/mockFile1/view',
    iconLink: 'https://drive-thirdparty.googleusercontent.com/16/type/application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    createdTime: '2023-02-15T13:45:00Z',
    modifiedTime: '2023-06-20T10:30:00Z',
    size: '235KB',
    owners: [
      {
        displayName: 'Jordan Manager',
        emailAddress: 'manager@example.com',
        photoLink: 'https://i.pravatar.cc/150?u=manager'
      }
    ],
    shared: true,
    parents: ['folder-2'],
    capabilities: {
      canEdit: true,
      canComment: true,
      canShare: true,
      canDownload: true
    },
    fileExtension: 'docx',
    md5Checksum: 'a1b2c3d4e5f6g7h8i9j'
  },
  {
    id: 'file-2',
    name: 'Annual_Tech_Conference_Contract_Signed.pdf',
    mimeType: 'application/pdf',
    webViewLink: 'https://drive.google.com/file/d/mockFile2/view',
    thumbnailLink: 'https://drive.google.com/thumbnail?id=mockFile2',
    iconLink: 'https://drive-thirdparty.googleusercontent.com/16/type/application/pdf',
    createdTime: '2023-04-15T15:20:00Z',
    modifiedTime: '2023-04-15T15:20:00Z',
    size: '1.2MB',
    description: 'Executed contract for the Annual Tech Conference',
    owners: [
      {
        displayName: 'Jordan Manager',
        emailAddress: 'manager@example.com',
        photoLink: 'https://i.pravatar.cc/150?u=manager'
      }
    ],
    shared: true,
    parents: ['folder-2'],
    capabilities: {
      canEdit: false,
      canComment: true,
      canShare: true,
      canDownload: true
    },
    fileExtension: 'pdf',
    md5Checksum: 'j9i8h7g6f5e4d3c2b1a'
  },
  {
    id: 'file-3',
    name: 'Smith_Johnson_Wedding_Contract.pdf',
    mimeType: 'application/pdf',
    webViewLink: 'https://drive.google.com/file/d/mockFile3/view',
    thumbnailLink: 'https://drive.google.com/thumbnail?id=mockFile3',
    iconLink: 'https://drive-thirdparty.googleusercontent.com/16/type/application/pdf',
    createdTime: '2023-05-21T11:00:00Z',
    modifiedTime: '2023-05-21T11:00:00Z',
    size: '950KB',
    description: 'Wedding event contract',
    owners: [
      {
        displayName: 'Jordan Manager',
        emailAddress: 'manager@example.com',
        photoLink: 'https://i.pravatar.cc/150?u=manager'
      }
    ],
    shared: true,
    parents: ['folder-2'],
    capabilities: {
      canEdit: false,
      canComment: true,
      canShare: true,
      canDownload: true
    },
    fileExtension: 'pdf',
    md5Checksum: 'z1x2c3v4b5n6m7k8j9h'
  },
  
  // Equipment Manuals
  {
    id: 'file-4',
    name: 'JBL_PRX_Speakers_Manual.pdf',
    mimeType: 'application/pdf',
    webViewLink: 'https://drive.google.com/file/d/mockFile4/view',
    iconLink: 'https://drive-thirdparty.googleusercontent.com/16/type/application/pdf',
    thumbnailLink: 'https://drive.google.com/thumbnail?id=mockFile4',
    createdTime: '2023-03-10T09:30:00Z',
    modifiedTime: '2023-03-10T09:30:00Z',
    size: '3.5MB',
    description: 'User manual for JBL PRX speaker series',
    owners: [
      {
        displayName: 'Taylor Employee',
        emailAddress: 'employee@example.com',
        photoLink: 'https://i.pravatar.cc/150?u=employee'
      }
    ],
    shared: true,
    parents: ['folder-3'],
    capabilities: {
      canEdit: false,
      canComment: true,
      canShare: true,
      canDownload: true
    },
    fileExtension: 'pdf',
    md5Checksum: 'q1w2e3r4t5y6u7i8o9p'
  },
  {
    id: 'file-5',
    name: 'Martin_Moving_Head_Lights_Guide.pdf',
    mimeType: 'application/pdf',
    webViewLink: 'https://drive.google.com/file/d/mockFile5/view',
    iconLink: 'https://drive-thirdparty.googleusercontent.com/16/type/application/pdf',
    thumbnailLink: 'https://drive.google.com/thumbnail?id=mockFile5',
    createdTime: '2023-03-15T14:45:00Z',
    modifiedTime: '2023-03-15T14:45:00Z',
    size: '4.2MB',
    description: 'Technical guide for Martin moving head lights',
    owners: [
      {
        displayName: 'Taylor Employee',
        emailAddress: 'employee@example.com',
        photoLink: 'https://i.pravatar.cc/150?u=employee'
      }
    ],
    shared: true,
    parents: ['folder-3'],
    capabilities: {
      canEdit: false,
      canComment: true,
      canShare: true,
      canDownload: true
    },
    fileExtension: 'pdf',
    md5Checksum: 'a9s8d7f6g5h4j3k2l1'
  },
  {
    id: 'file-6',
    name: 'Equipment_Maintenance_Schedule.xlsx',
    mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    webViewLink: 'https://drive.google.com/file/d/mockFile6/view',
    iconLink: 'https://drive-thirdparty.googleusercontent.com/16/type/application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    createdTime: '2023-06-05T10:15:00Z',
    modifiedTime: '2023-08-10T16:20:00Z',
    size: '175KB',
    description: 'Maintenance tracking for all equipment',
    starred: true,
    owners: [
      {
        displayName: 'Taylor Employee',
        emailAddress: 'employee@example.com',
        photoLink: 'https://i.pravatar.cc/150?u=employee'
      }
    ],
    shared: true,
    parents: ['folder-3'],
    capabilities: {
      canEdit: true,
      canComment: true,
      canShare: true,
      canDownload: true
    },
    fileExtension: 'xlsx',
    md5Checksum: 'z9x8c7v6b5n4m3l2k1j'
  },
  
  // Event Photos
  {
    id: 'file-7',
    name: 'Lakeshore_Music_Festival_Stage.jpg',
    mimeType: 'image/jpeg',
    webViewLink: 'https://drive.google.com/file/d/mockFile7/view',
    thumbnailLink: 'https://drive.google.com/thumbnail?id=mockFile7',
    iconLink: 'https://drive-thirdparty.googleusercontent.com/16/type/image/jpeg',
    createdTime: '2023-08-07T09:30:00Z',
    modifiedTime: '2023-08-07T09:30:00Z',
    size: '3.8MB',
    description: 'Main stage setup at Lakeshore Music Festival',
    owners: [
      {
        displayName: 'Casey Technician',
        emailAddress: 'employee2@example.com',
        photoLink: 'https://i.pravatar.cc/150?u=employee2'
      }
    ],
    shared: true,
    parents: ['folder-4'],
    capabilities: {
      canEdit: true,
      canComment: true,
      canShare: true,
      canDownload: true
    },
    fileExtension: 'jpg',
    md5Checksum: 'p9o8i7u6y5t4r3e2w1q'
  },
  {
    id: 'file-8',
    name: 'Corporate_Event_Lighting.jpg',
    mimeType: 'image/jpeg',
    webViewLink: 'https://drive.google.com/file/d/mockFile8/view',
    thumbnailLink: 'https://drive.google.com/thumbnail?id=mockFile8',
    iconLink: 'https://drive-thirdparty.googleusercontent.com/16/type/image/jpeg',
    createdTime: '2023-05-20T21:15:00Z',
    modifiedTime: '2023-05-20T21:15:00Z',
    size: '2.7MB',
    description: 'Lighting setup for corporate gala',
    owners: [
      {
        displayName: 'Taylor Employee',
        emailAddress: 'employee@example.com',
        photoLink: 'https://i.pravatar.cc/150?u=employee'
      }
    ],
    shared: true,
    parents: ['folder-4'],
    capabilities: {
      canEdit: true,
      canComment: true,
      canShare: true,
      canDownload: true
    },
    fileExtension: 'jpg',
    md5Checksum: 'l9k8j7h6g5f4d3s2a1'
  },
  {
    id: 'file-9',
    name: 'Wedding_Reception_Setup.jpg',
    mimeType: 'image/jpeg',
    webViewLink: 'https://drive.google.com/file/d/mockFile9/view',
    thumbnailLink: 'https://drive.google.com/thumbnail?id=mockFile9',
    iconLink: 'https://drive-thirdparty.googleusercontent.com/16/type/image/jpeg',
    createdTime: '2023-06-12T20:30:00Z',
    modifiedTime: '2023-06-12T20:30:00Z',
    size: '4.1MB',
    description: 'DJ booth and dance floor setup for Smith wedding',
    owners: [
      {
        displayName: 'Casey Technician',
        emailAddress: 'employee2@example.com',
        photoLink: 'https://i.pravatar.cc/150?u=employee2'
      }
    ],
    shared: true,
    parents: ['folder-4'],
    capabilities: {
      canEdit: true,
      canComment: true,
      canShare: true,
      canDownload: true
    },
    fileExtension: 'jpg',
    md5Checksum: 'm9n8b7v6c5x4z3a2s1'
  },
  
  // Venue Layouts
  {
    id: 'file-10',
    name: 'Grand_Convention_Center_Floor_Plan.pdf',
    mimeType: 'application/pdf',
    webViewLink: 'https://drive.google.com/file/d/mockFile10/view',
    thumbnailLink: 'https://drive.google.com/thumbnail?id=mockFile10',
    iconLink: 'https://drive-thirdparty.googleusercontent.com/16/type/application/pdf',
    createdTime: '2023-05-15T11:30:00Z',
    modifiedTime: '2023-05-15T11:30:00Z',
    size: '2.1MB',
    description: 'Detailed floor plan with dimensions',
    owners: [
      {
        displayName: 'Taylor Employee',
        emailAddress: 'employee@example.com',
        photoLink: 'https://i.pravatar.cc/150?u=employee'
      }
    ],
    shared: true,
    parents: ['folder-5'],
    capabilities: {
      canEdit: false,
      canComment: true,
      canShare: true,
      canDownload: true
    },
    fileExtension: 'pdf',
    md5Checksum: 'd9f8g7h6j5k4l3z2x1'
  },
  {
    id: 'file-11',
    name: 'Millennium_Park_Site_Map.pdf',
    mimeType: 'application/pdf',
    webViewLink: 'https://drive.google.com/file/d/mockFile11/view',
    thumbnailLink: 'https://drive.google.com/thumbnail?id=mockFile11',
    iconLink: 'https://drive-thirdparty.googleusercontent.com/16/type/application/pdf',
    createdTime: '2023-07-01T14:45:00Z',
    modifiedTime: '2023-07-01T14:45:00Z',
    size: '1.8MB',
    description: 'Site map with stage locations for music festival',
    owners: [
      {
        displayName: 'Taylor Employee',
        emailAddress: 'employee@example.com',
        photoLink: 'https://i.pravatar.cc/150?u=employee'
      }
    ],
    shared: true,
    parents: ['folder-5'],
    capabilities: {
      canEdit: false,
      canComment: true,
      canShare: true,
      canDownload: true
    },
    fileExtension: 'pdf',
    md5Checksum: 'c9v8b7n6m5l4k3j2h1'
  },
  {
    id: 'file-12',
    name: 'Riverside_Hotel_Ballroom_Layout.dwg',
    mimeType: 'application/x-autocad',
    webViewLink: 'https://drive.google.com/file/d/mockFile12/view',
    iconLink: 'https://drive-thirdparty.googleusercontent.com/16/type/application/x-autocad',
    createdTime: '2023-09-05T10:15:00Z',
    modifiedTime: '2023-09-05T10:15:00Z',
    size: '950KB',
    description: 'AutoCAD drawing of the ballroom layout',
    owners: [
      {
        displayName: 'Taylor Employee',
        emailAddress: 'employee@example.com',
        photoLink: 'https://i.pravatar.cc/150?u=employee'
      }
    ],
    shared: true,
    parents: ['folder-5'],
    capabilities: {
      canEdit: false,
      canComment: true,
      canShare: true,
      canDownload: true
    },
    fileExtension: 'dwg',
    md5Checksum: 'r9t8y7u6i5o4p3a2s1'
  }
];

/**
 * Helper functions for working with mock Drive data
 */

/**
 * Get all root folders (those without parents or with parents outside our mock data)
 */
export function getRootFolders(): GoogleDriveFolder[] {
  return mockGoogleDriveFolders.filter(folder => !folder.parents || folder.parents.length === 0);
}

/**
 * Get folders that are children of the specified parent folder
 */
export function getChildFolders(parentId: string): GoogleDriveFolder[] {
  return mockGoogleDriveFolders.filter(folder => 
    folder.parents && folder.parents.includes(parentId)
  );
}

/**
 * Get files that are children of the specified parent folder
 */
export function getFilesInFolder(folderId: string): GoogleDriveFile[] {
  return mockGoogleDriveFiles.filter(file => 
    file.parents && file.parents.includes(folderId)
  );
}

/**
 * Get a folder by ID
 */
export function getFolderById(folderId: string): GoogleDriveFolder | undefined {
  return mockGoogleDriveFolders.find(folder => folder.id === folderId);
}

/**
 * Get a file by ID
 */
export function getFileById(fileId: string): GoogleDriveFile | undefined {
  return mockGoogleDriveFiles.find(file => file.id === fileId);
}

/**
 * Search for files and folders by name
 */
export function searchDriveItems(query: string): (GoogleDriveFile | GoogleDriveFolder)[] {
  const lowerQuery = query.toLowerCase();
  
  const matchingFiles = mockGoogleDriveFiles.filter(file => 
    file.name.toLowerCase().includes(lowerQuery) || 
    (file.description && file.description.toLowerCase().includes(lowerQuery))
  );
  
  const matchingFolders = mockGoogleDriveFolders.filter(folder => 
    folder.name.toLowerCase().includes(lowerQuery) || 
    (folder.description && folder.description.toLowerCase().includes(lowerQuery))
  );
  
  return [...matchingFolders, ...matchingFiles];
}
