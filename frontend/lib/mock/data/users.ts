import { UserRoleType } from '@/lib/types/auth';

/**
 * Mock user data structure
 */
export interface MockUser {
  id: string;
  email: string;
  password: string; // In a real app, never store plaintext passwords
  firstName?: string;
  lastName?: string;
  role: UserRoleType;
  avatarUrl?: string;
  created_at: string;
  phoneNumber?: string;
  companyName?: string;
}

/**
 * Mock session structure
 */
export interface MockSession {
  access_token: string;
  expires_at: number;
  user: Omit<MockUser, 'password'>;
}

/**
 * Predefined mock users for testing different roles
 * Each user has the same password for simplicity
 */
export const mockUsers: MockUser[] = [
  // Customer user
  {
    id: 'cust-1',
    email: 'customer@example.com',
    password: 'password123',
    firstName: 'Alex',
    lastName: 'Customer',
    role: 'customer',
    avatarUrl: 'https://i.pravatar.cc/150?u=customer',
    created_at: '2023-01-15T12:00:00Z',
    phoneNumber: '555-123-4567',
    companyName: 'ABC Events'
  },
  
  // Employee user
  {
    id: 'emp-1',
    email: 'employee@example.com',
    password: 'password123',
    firstName: 'Taylor',
    lastName: 'Employee',
    role: 'employee',
    avatarUrl: 'https://i.pravatar.cc/150?u=employee',
    created_at: '2022-08-10T09:30:00Z',
    phoneNumber: '555-987-6543'
  },
  
  // Manager user
  {
    id: 'mgr-1',
    email: 'manager@example.com',
    password: 'password123',
    firstName: 'Jordan',
    lastName: 'Manager',
    role: 'manager',
    avatarUrl: 'https://i.pravatar.cc/150?u=manager',
    created_at: '2021-11-05T15:45:00Z',
    phoneNumber: '555-789-0123'
  },
  
  // Additional customer for variety
  {
    id: 'cust-2',
    email: 'customer2@example.com',
    password: 'password123',
    firstName: 'Riley',
    lastName: 'Client',
    role: 'customer',
    created_at: '2023-03-20T08:15:00Z',
    phoneNumber: '555-234-5678',
    companyName: 'XYZ Productions'
  },
  
  // Additional employee
  {
    id: 'emp-2',
    email: 'employee2@example.com',
    password: 'password123',
    firstName: 'Casey',
    lastName: 'Technician',
    role: 'employee',
    created_at: '2022-12-12T11:20:00Z',
    phoneNumber: '555-345-6789'
  }
];

/**
 * Helper function to get a mock user by email (excluding password)
 */
export function getMockUserByEmail(email: string): Omit<MockUser, 'password'> | null {
  const user = mockUsers.find(u => u.email === email);
  if (!user) return null;
  
  // Return user without password
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
}

/**
 * Helper function to verify mock user credentials
 */
export function verifyMockCredentials(email: string, password: string): Omit<MockUser, 'password'> | null {
  const user = mockUsers.find(u => u.email === email && u.password === password);
  if (!user) return null;
  
  // Return user without password
  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
}
