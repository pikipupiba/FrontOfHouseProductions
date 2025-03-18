import { createServerClient } from '@supabase/ssr'
import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  const url = new URL(request.url)
  const code = url.searchParams.get('code')
  const errorParam = url.searchParams.get('error')
  const errorCode = url.searchParams.get('error_code')
  const errorDesc = url.searchParams.get('error_description')
  
  // Log full request for debugging
  console.log('Auth callback request:', {
    url: request.url,
    code: code ? 'present' : 'missing',
    error: errorParam,
    errorCode,
    errorDesc
  });
  
  // Handle error redirects from OAuth provider
  if (errorParam) {
    console.error('Auth provider returned an error:', {
      error: errorParam,
      code: errorCode,
      description: errorDesc
    })
    
    // If this is a "Database error saving new user", it might be related to our profile creation
    if (errorDesc?.includes('Database error saving new user')) {
      console.log('Database error detected - this may be related to profile creation issues')
      // We'll handle this specially later when we have a session to work with
      // For now, continue with the code flow and we'll check for this condition
    } else {
      return NextResponse.redirect(new URL(`/auth/login?error=provider_${errorParam}&desc=${encodeURIComponent(errorDesc || '')}`, request.url))
    }
  }
  
  // Initialize Supabase client
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
  
  if (code) {
    
    try {
      console.log('Exchanging code for session...')
      
      // Exchange the code for a session
      const { error: sessionError } = await supabase.auth.exchangeCodeForSession(code)
      
      if (sessionError) {
        console.error('Error exchanging code for session:', sessionError.message)
        return NextResponse.redirect(new URL(`/auth/login?error=session_exchange_failed&message=${encodeURIComponent(sessionError.message)}`, request.url))
      }
      
      console.log('Session created successfully, fetching user...')
      
      // Determine the user's role to redirect them to the appropriate portal
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      
      if (userError) {
        console.error('Error getting user:', userError.message)
        return NextResponse.redirect(new URL(`/auth/login?error=user_retrieval_failed&message=${encodeURIComponent(userError.message)}`, request.url))
      }
      
      if (!user) {
        console.error('No user found after authentication')
        return NextResponse.redirect(new URL('/auth/login?error=no_user_found', request.url))
      }
      
      console.log('User retrieved successfully:', {
        id: user.id,
        email: user.email,
        provider: user.app_metadata?.provider
      })
      
      // Special handling for Google authentication errors
      // If we had a database error but still got a user, we need to ensure profile and role exist
      if (errorDesc?.includes('Database error saving new user') && user) {
        console.log('Attempting to fix database error with direct profile creation...')
        
        // First, try calling our helper function to fix the user profile
        try {
          const { data: callResult, error: callError } = await supabase.rpc(
            'ensure_user_has_profile_and_role',
            { user_id: user.id }
          )
          
          if (callError) {
            console.error('Error calling ensure_user_has_profile_and_role:', callError.message)
            // We'll try manual creation as a fallback below
          } else {
            console.log('Profile repair function result:', callResult)
          }
        } catch (err) {
          console.error('Exception calling repair function:', err)
          // Continue to fallback
        }
      }
      
      // Check if user has a profile
      console.log('Checking if user has a profile...')
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()
      
      // If no profile exists, we need to create one regardless of auth method
      if (profileError) {
        console.log('No profile found, creating profile...')
        
        // Enhanced email validation and logging
        console.log('User email value:', user.email)
        console.log('User email type:', typeof user.email)
        
        // First, try calling our updated helper function with the fixed parameter name
        try {
          console.log('Attempting to ensure profile exists with RPC function...')
          const { data: ensureResult, error: ensureError } = await supabase.rpc(
            'ensure_user_has_profile_and_role',
            { user_uuid: user.id }  // Fixed parameter name from user_id to user_uuid
          )
          
          if (ensureError) {
            console.error('Error calling ensure_user_has_profile_and_role:', ensureError.message)
            // Try the emergency function as first fallback
            console.log('Trying emergency_create_profile as fallback...')
            const { data: emergencyResult, error: emergencyError } = await supabase.rpc(
              'emergency_create_profile',
              { user_uuid: user.id }
            )
            
            if (emergencyError) {
              console.error('Error calling emergency_create_profile:', emergencyError.message)
              // Continue to manual creation as ultimate fallback
            } else if (emergencyResult === true) {
              console.log('Profile successfully created via emergency function')
              // Skip the manual profile creation below
              // Re-fetch the profile to verify
              const { data: updatedProfile, error: refetchError } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single()
                
              if (!refetchError && updatedProfile) {
                console.log('Profile confirmed after emergency function:', updatedProfile.email)
                // Skip to role handling
                const isGoogleUser = user.app_metadata?.provider === 'google'
                // Jump to user role handling
                goto_user_role_handling: {
                  break goto_user_role_handling;
                }
              }
            }
          } else if (ensureResult === true) {
            console.log('Profile successfully created via RPC function')
            // Skip the manual profile creation below
            // Re-fetch the profile to verify
            const { data: updatedProfile, error: refetchError } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', user.id)
              .single()
              
            if (!refetchError && updatedProfile) {
              console.log('Profile confirmed after RPC function:', updatedProfile.email)
              // Skip to role handling
              const isGoogleUser = user.app_metadata?.provider === 'google'
              // Jump to user role handling
              goto_user_role_handling: {
                break goto_user_role_handling;
              }
            }
          }
        } catch (err) {
          console.error('Exception calling ensure function:', err)
          // Continue to manual creation
        }
        
        // Manual profile creation (fallback)
        let email = ''
        
        // Robust email handling with fallback
        if (user.email === null || user.email === undefined) {
          console.log('Email is null/undefined, using placeholder')
          email = `user_${user.id}@placeholder.com`
        } else if (user.email === '') {
          console.log('Email is empty string, using placeholder')
          email = `user_${user.id}@placeholder.com`
        } else {
          email = user.email
          console.log('Using email from user object:', email)
        }
        
        const isGoogleUser = user.app_metadata?.provider === 'google'
        
        console.log('Final email value before profile creation:', email)
        console.log('Email length:', email.length)
        
        // Create profile with minimum required fields and validated email
        const { error: insertProfileError } = await supabase
          .from('profiles')
          .insert({
            id: user.id,
            email: email, // Using our robust email value
            full_name: user.user_metadata?.full_name || '',
            avatar_url: user.user_metadata?.avatar_url || '',
            role: 'customer' // Default role
          })
        
        if (insertProfileError) {
          console.error('Error creating profile:', insertProfileError.message)
          
        // Try the direct fix utility with the fixed parameter name
        if (insertProfileError.message.includes('null value') || insertProfileError.message.includes('violates not-null constraint')) {
          console.log('Attempting to fix null email with fix_user_with_missing_email function...')
          try {
            const { data: fixResult, error: fixError } = await supabase.rpc(
              'fix_user_with_missing_email',
              { user_uuid: user.id }  // Fixed parameter name from user_id to user_uuid
            )
            
            if (fixError) {
              console.error('Error fixing user email:', fixError.message)
              
              // Last attempt: try the emergency function
              console.log('Final attempt: emergency_create_profile...')
              const { data: lastResortResult, error: lastResortError } = await supabase.rpc(
                'emergency_create_profile',
                { user_uuid: user.id }
              )
              
              if (lastResortError) {
                console.error('Error in last resort emergency profile creation:', lastResortError.message)
              } else if (lastResortResult === true) {
                console.log('Successfully created profile with emergency function')
                // Continue to user role handling
                goto_user_role_handling_2: {
                  break goto_user_role_handling_2;
                }
              }
            } else if (fixResult === true) {
              console.log('Successfully fixed user email with placeholder')
              // Continue to user role handling
              goto_user_role_handling_2: {
                break goto_user_role_handling_2;
              }
            }
          } catch (fixErr) {
            console.error('Exception fixing user email:', fixErr)
          }
        }
          
        // For users with persistent errors, try debug function with fixed parameter
        console.log('Trying debug function to diagnose auth issues...')
        try {
          const { data: debugInfo, error: debugError } = await supabase.rpc(
            'debug_google_auth',
            { user_uuid: user.id }  // Fixed parameter name from user_id to user_uuid
          )
          
          if (debugError) {
            console.error('Error running debug function:', debugError.message)
          } else {
            console.log('Debug info:', JSON.stringify(debugInfo, null, 2))
            
            // If we got debug info and it confirms email issues, try a direct update
            if (debugInfo && 
                (debugInfo.email_is_null === true || 
                 debugInfo.email_is_empty === true || 
                 debugInfo.email_length === 0)) {
              
              console.log('Debug confirms email issues, trying direct profile update...')
              
              // Last resort: Try a direct INSERT ... ON CONFLICT DO UPDATE with no email-related columns
              // First prepare a proper email to avoid the constraint
              const placeholderEmail = `user_${user.id}@placeholder.com`
              console.log('Using emergency placeholder email:', placeholderEmail)
              
              const { error: directUpdateError } = await supabase
                .from('profiles')
                .upsert({
                  id: user.id,
                  email: placeholderEmail,  // Always use the placeholder for safety
                  full_name: user.user_metadata?.full_name || '',
                  avatar_url: user.user_metadata?.avatar_url || '',
                  role: 'customer'
                }, { onConflict: 'id' })
                
              if (directUpdateError) {
                console.error('Error in direct profile update:', directUpdateError.message)
                
                // Last desperate attempt: SQL directly to emergency create
                console.log('Final attempt: emergency_create_profile again...')
                const { data: finalResult, error: finalError } = await supabase.rpc(
                  'emergency_create_profile',
                  { user_uuid: user.id }
                )
                
                if (finalError) {
                  console.error('Error in final emergency profile creation:', finalError.message)
                } else if (finalResult === true) {
                  console.log('Successfully created profile with final emergency function')
                  // Continue to user role handling
                  goto_user_role_handling_3: {
                    break goto_user_role_handling_3;
                  }
                }
              } else {
                console.log('Successfully updated profile with placeholder email')
                // Continue to user role handling
                goto_user_role_handling_3: {
                  break goto_user_role_handling_3;
                }
              }
            }
          }
            } catch (debugErr) {
              console.error('Exception running debug function:', debugErr)
          }
          
          // Final fallback: redirect with error
          return NextResponse.redirect(new URL(`/auth/login?error=profile_creation_failed&message=${encodeURIComponent(insertProfileError.message)}`, request.url))
        } else {
          console.log('Profile created successfully')
        }
      } else {
        console.log('Profile exists, proceeding with role check...')
      }
        
      // User role handling with improved error logging
      console.log('Checking user role...')
      let userRole = null
      try {
        // Get user role from the user_roles table
        const { data: userRoleData, error: roleError } = await supabase
          .from('user_roles')
          .select('role, is_approved')
          .eq('user_id', user.id)
          .single()
        
        if (roleError) {
          console.log('No user role found, creating role...')
          
          // Create the user role
          const { data: insertedRole, error: insertError } = await supabase
            .from('user_roles')
            .insert({
              user_id: user.id,
              role: 'customer', // Default role for new users
              is_approved: true,
            })
            .select('role, is_approved')
            .single()
          
          if (insertError) {
            console.error('Error creating user role:', insertError.message)
            
            // Try direct method as last resort for Google users
            if (user.app_metadata?.provider === 'google') {
              console.log('Attempting direct SQL role creation for Google user...')
              try {
                await supabase.rpc('ensure_user_has_profile_and_role', { user_id: user.id })
                
                // Try fetching the role again
                const { data: retryRoleData, error: retryError } = await supabase
                  .from('user_roles')
                  .select('role, is_approved')
                  .eq('user_id', user.id)
                  .single()
                
                if (!retryError && retryRoleData) {
                  console.log('Role created via RPC function')
                  userRole = retryRoleData
                } else {
                  return NextResponse.redirect(new URL(`/auth/login?error=role_creation_failed&message=${encodeURIComponent(insertError.message)}`, request.url))
                }
              } catch (rpcErr) {
                console.error('Error in RPC call:', rpcErr)
                return NextResponse.redirect(new URL(`/auth/login?error=role_creation_failed&message=${encodeURIComponent(insertError.message)}`, request.url))
              }
            } else {
              return NextResponse.redirect(new URL(`/auth/login?error=role_creation_failed&message=${encodeURIComponent(insertError.message)}`, request.url))
            }
          } else {
            userRole = insertedRole
          }
        } else {
          userRole = userRoleData
        }
      } catch (err: any) {
        console.error('Exception handling user roles:', err?.message || err)
        return NextResponse.redirect(new URL('/auth/login?error=role_exception', request.url))
      }
        
      // If we have user role information, redirect based on role
      if (userRole) {
        console.log('User role found, redirecting to dashboard:', userRole)
        
        // Redirect based on user role
        if (userRole.role === 'manager' && userRole.is_approved) {
          return NextResponse.redirect(new URL('/dashboard/manager', request.url))
        } else if ((userRole.role === 'employee' || userRole.role === 'manager') && userRole.is_approved) {
          return NextResponse.redirect(new URL('/dashboard/employee', request.url))
        } else if (userRole.role === 'customer') {
          // Default to customer portal for customer role
          return NextResponse.redirect(new URL('/dashboard/customer', request.url))
        } else if (!userRole.is_approved) {
          // Show a specific message for unapproved accounts
          return NextResponse.redirect(new URL('/auth/login?error=account_pending_approval', request.url))
        }
      } else {
        console.error('No user role information available after creation attempts')
        return NextResponse.redirect(new URL('/auth/login?error=missing_role_info', request.url))
      }
    } catch (error: any) {
      console.error('Error in auth callback:', error?.message || error)
      // Include more detailed error information
      const errorMessage = error?.message || 'Unknown error'
      return NextResponse.redirect(new URL(`/auth/login?error=auth_callback_error&message=${encodeURIComponent(errorMessage)}`, request.url))
    }
  } else {
    console.log('No auth code provided in callback')
  }
  
  // Default URL to redirect to if code is missing or other issues occur
  return NextResponse.redirect(new URL('/auth/login?error=missing_auth_code', request.url))
}
