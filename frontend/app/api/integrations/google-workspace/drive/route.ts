import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { getIntegrationManager } from '@/lib/integrations/core/integrationmanager';
import { GoogleWorkspaceAdapter } from '@/lib/integrations/adapters/google-workspace';

// GET handler to list files and folders
export async function GET(request: NextRequest) {
  try {
    // Get the user using the recommended pattern
    const supabase = createRouteHandlerClient({ cookies });
    
    // Use getUser instead of getSession for better security
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError) {
      console.error('Error getting user:', userError.message);
      return NextResponse.json(
        { error: 'Authentication error: ' + userError.message },
        { status: 401 }
      );
    }
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized. You must be logged in to access drive files.' },
        { status: 401 }
      );
    }
    
    const userId = user.id;
    
    // Parse query parameters
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q');
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 100;
    const parentId = searchParams.get('parentId');
    const mimeType = searchParams.get('mimeType');
    const pageToken = searchParams.get('pageToken') || undefined;
    const orderBy = searchParams.get('orderBy') || undefined;
    
    // Build filters
    const filters: Record<string, any> = {};
    
    if (query) {
      filters.fullText = query;
    }
    
    if (parentId) {
      filters.parentId = parentId;
    }
    
    if (mimeType) {
      filters.mimeType = mimeType;
    }
    
    // Get the integration manager
    const integrationManager = getIntegrationManager();
    
    // Check if the adapter is already registered
    if (!integrationManager.hasAdapter('google-workspace')) {
      // If not, register it
      integrationManager.registerAdapter(new GoogleWorkspaceAdapter());
    }
    
    // Get the adapter
    const adapter = integrationManager.getAdapter<GoogleWorkspaceAdapter>('google-workspace');
    
    // Get drive files
    const files = await adapter.fetchResources('drive-file', {
      filters,
      limit,
      pageToken,
      orderBy
    });
    
    return NextResponse.json(files);
  } catch (error: any) {
    console.error('Error fetching drive files:', error);
    
    const statusCode = error.statusCode || 500;
    const message = error.message || 'An error occurred while fetching drive files';
    
    return NextResponse.json(
      { error: message },
      { status: statusCode }
    );
  }
}

// POST handler to create a file or folder
export async function POST(request: NextRequest) {
  try {
    // Get the user using the recommended pattern
    const supabase = createRouteHandlerClient({ cookies });
    
    // Use getUser instead of getSession for better security
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError) {
      console.error('Error getting user:', userError.message);
      return NextResponse.json(
        { error: 'Authentication error: ' + userError.message },
        { status: 401 }
      );
    }
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized. You must be logged in to create drive files.' },
        { status: 401 }
      );
    }
    
    // Check if this is a multipart form (file upload) or JSON (folder creation)
    const contentType = request.headers.get('content-type') || '';
    
    // Get the integration manager
    const integrationManager = getIntegrationManager();
    
    // Check if the adapter is already registered
    if (!integrationManager.hasAdapter('google-workspace')) {
      // If not, register it
      integrationManager.registerAdapter(new GoogleWorkspaceAdapter());
    }
    
    // Get the adapter
    const adapter = integrationManager.getAdapter<GoogleWorkspaceAdapter>('google-workspace');
    
    let result;
    
    if (contentType.includes('multipart/form-data')) {
      // Handle file upload
      const formData = await request.formData();
      const file = formData.get('file') as File;
      
      if (!file) {
        return NextResponse.json(
          { error: 'No file provided' },
          { status: 400 }
        );
      }
      
      // Get additional parameters
      const name = formData.get('name')?.toString() || file.name;
      const parentId = formData.get('parentId')?.toString();
      const mimeType = file.type || 'application/octet-stream';
      
      // Convert File to Buffer
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      
      // Create file
      result = await adapter.createResource('drive-file', {
        name,
        content: buffer,
        mimeType,
        parentId
      });
    } else {
      // Handle JSON payload (folder creation or empty file)
      const data = await request.json();
      
      // Check if this is a folder creation
      if (data.isFolder) {
        result = await adapter.createResource('drive-folder', {
          name: data.name,
          parentId: data.parentId
        });
      } else {
        // Create empty file
        result = await adapter.createResource('drive-file', {
          name: data.name,
          mimeType: data.mimeType || 'text/plain',
          parentId: data.parentId
        });
      }
    }
    
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error creating drive file:', error);
    
    const statusCode = error.statusCode || 500;
    const message = error.message || 'An error occurred while creating the drive file';
    
    return NextResponse.json(
      { error: message },
      { status: statusCode }
    );
  }
}
