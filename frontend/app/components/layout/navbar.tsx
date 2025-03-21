'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import wireframeConfig from '@/lib/mock/config';

export default function Navbar() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  
  // Reference to dropdown container for click-outside handling
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    
    // Add event listener
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      // Clean up the event listener
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Load user data from localStorage
  useEffect(() => {
    const loadUserFromLocalStorage = () => {
      setLoading(true);
      
      try {
        // Get user from localStorage
        const storedUser = localStorage.getItem('mockUser');
        
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          setUser(userData);
          setUserRole(userData.role);
        }
      } catch (error) {
        console.error('Error loading user from localStorage:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadUserFromLocalStorage();
    
    // Add event listener for storage changes (for cross-tab synchronization)
    window.addEventListener('storage', loadUserFromLocalStorage);
    return () => {
      window.removeEventListener('storage', loadUserFromLocalStorage);
    };
  }, []);
  
  // Handle sign out 
  const handleSignOut = async () => {
    // Simulate network delay
    await wireframeConfig.delay(300);
    
    // Clear user from localStorage
    localStorage.removeItem('mockUser');
    
    // Update state
    setUser(null);
    setUserRole(null);
    setDropdownOpen(false);
    
    // Redirect to home page
    router.push('/');
  };
  
  // Handle switch account
  const handleSwitchAccount = () => {
    // Close dropdown
    setDropdownOpen(false);
    
    // Redirect to login page
    router.push('/auth/login');
  };

  return (
    <nav className="bg-white shadow dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              {/* Replace with your logo */}
              <span className="text-xl font-bold text-gray-800 dark:text-white">FOHP</span>
            </Link>
          </div>
          
          {/* Desktop menu */}
          <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-8">
            <Link href="/services" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
              Services
            </Link>
            <Link href="/equipment" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
              Equipment
            </Link>
            <Link href="/portfolio" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
              Portfolio
            </Link>
            <Link href="/about" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
              About
            </Link>
            <Link href="/contact" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
              Contact
            </Link>
          </div>
          
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {!loading && (
              <>
                {user ? (
                  <div className="relative" ref={dropdownRef}>
                    <button 
                      onClick={() => setDropdownOpen(!dropdownOpen)}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                      aria-expanded={dropdownOpen}
                      aria-haspopup="true"
                    >
                      <span>Account</span>
                      <svg className="ml-1 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                    
                    {dropdownOpen && (
                      <div 
                        className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10"
                        role="menu"
                        aria-orientation="vertical"
                        aria-labelledby="user-menu-button"
                      >
                        {/* User info */}
                        <div className="px-4 py-2 border-b">
                          <p className="text-sm font-medium text-gray-700">{user.email}</p>
                          {userRole && (
                            <p className="text-xs text-gray-500 capitalize">
                              {userRole.charAt(0).toUpperCase() + userRole.slice(1)} Portal
                            </p>
                          )}
                        </div>
                        
                        {/* Menu items */}
                        <Link 
                          href={userRole ? `/dashboard/${userRole}` : "/dashboard"} 
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" 
                          role="menuitem"
                          onClick={() => setDropdownOpen(false)}
                        >
                          My Dashboard
                        </Link>
                        <Link 
                          href="/dashboard/profile" 
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" 
                          role="menuitem"
                          onClick={() => setDropdownOpen(false)}
                        >
                          Edit Profile
                        </Link>
                        
                        {/* New "Switch Account" button */}
                        <button 
                          onClick={handleSwitchAccount}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          role="menuitem"
                        >
                          Switch Account
                        </button>
                        
                        <button 
                          onClick={handleSignOut}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          role="menuitem"
                        >
                          Logout
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link 
                    href="/auth/login" 
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                  >
                    Login
                  </Link>
                )}
              </>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
              aria-controls="mobile-menu"
              aria-expanded="false"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              {/* Menu icons */}
              {isMenuOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      {isMenuOpen && (
        <div className="sm:hidden" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link href="/services" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700">
              Services
            </Link>
            <Link href="/equipment" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700">
              Equipment
            </Link>
            <Link href="/portfolio" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700">
              Portfolio
            </Link>
            <Link href="/about" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700">
              About
            </Link>
            <Link href="/contact" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700">
              Contact
            </Link>
            {!loading && user ? (
              <>
                <div className="px-3 py-2 font-medium text-gray-700">
                  <span className="block text-sm font-medium">{user.email}</span>
                  {userRole && <span className="block text-xs text-gray-500 capitalize">{userRole.charAt(0).toUpperCase() + userRole.slice(1)} Portal</span>}
                </div>
                
                <Link 
                  href={userRole ? `/dashboard/${userRole}` : "/dashboard"} 
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700"
                  onClick={() => setIsMenuOpen(false)}
                >
                  My Dashboard
                </Link>
                <Link 
                  href="/dashboard/profile" 
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Edit Profile
                </Link>
                
                {/* New "Switch Account" button for mobile */}
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    handleSwitchAccount();
                  }}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700"
                >
                  Switch Account
                </button>
                
                <button
                  onClick={() => {
                    handleSignOut();
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link 
                href="/auth/login" 
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700"
                onClick={() => setIsMenuOpen(false)}
              >
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
