import { createServerClient } from '@supabase/ssr'
import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  const url = new URL(request.url)
  const code = url.searchParams.get('code')
  
  if (code) {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
          set(name: string, value: string, options: any) {
            cookieStore.set({ name, value, ...options })
          },
          remove(name: string, options: any) {
            cookieStore.set({ name, value: '', ...options })
          },
        },
      }
    )
    
    // Exchange the code for a session
    await supabase.auth.exchangeCodeForSession(code)
    
    // Determine the user's role to redirect them to the appropriate portal
    const { data: { user } } = await supabase.auth.getUser()
    
    if (user) {
      // Get user role from the user_roles table
      const { data: userRole } = await supabase
        .from('user_roles')
        .select('role, is_approved')
        .eq('user_id', user.id)
        .single()
      
      if (userRole) {
        // Redirect based on user role
        if (userRole.role === 'manager' && userRole.is_approved) {
          return NextResponse.redirect(new URL('/dashboard/manager', request.url))
        } else if ((userRole.role === 'employee' || userRole.role === 'manager') && userRole.is_approved) {
          return NextResponse.redirect(new URL('/dashboard/employee', request.url))
        } else {
          // Default to customer portal for customer role or unapproved roles
          return NextResponse.redirect(new URL('/dashboard/customer', request.url))
        }
      }
    }
  }
  
  // Default URL to redirect to if user role can't be determined
  return NextResponse.redirect(new URL('/dashboard', request.url))
}
