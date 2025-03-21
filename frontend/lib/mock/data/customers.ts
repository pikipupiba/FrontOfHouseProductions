/**
 * Mock customer data structure
 * Extends basic user information with detailed customer-specific fields
 */
export interface Customer {
  id: string;
  userId: string; // References user ID from users.ts
  companyName: string;
  companyType: CompanyType;
  industry?: string;
  website?: string;
  billingAddress: Address;
  shippingAddress?: Address;
  primaryContact: Contact;
  additionalContacts?: Contact[];
  billing: BillingInfo;
  eventPreferences?: EventPreferences;
  notes?: string;
  status: CustomerStatus;
  customerSince: string;
  lastEventDate?: string;
  totalEventsHosted: number;
  totalSpent: number;
  tags?: string[];
  communicationPreferences: CommunicationPreferences;
  attachments?: Attachment[];
  created_at: string;
  updated_at?: string;
  assignedRepId?: string; // ID of the employee/manager assigned to this customer
}

export type CompanyType = 'corporate' | 'non-profit' | 'government' | 'educational' | 'individual' | 'small-business' | 'other';
export type CustomerStatus = 'active' | 'inactive' | 'lead' | 'prospect' | 'former';

export interface Address {
  street1: string;
  street2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isVerified?: boolean;
}

export interface Contact {
  name: string;
  title?: string;
  email: string;
  phone?: string;
  mobile?: string;
  isPrimary: boolean;
  preferredContactMethod?: 'email' | 'phone' | 'mobile';
  notes?: string;
}

export interface BillingInfo {
  paymentTerms: PaymentTerms;
  currency: string;
  taxExempt: boolean;
  taxId?: string;
  preferredPaymentMethod?: 'credit-card' | 'bank-transfer' | 'check' | 'cash' | 'invoice';
  creditLimit?: number;
  accountManager?: string;
  invoiceDeliveryMethod: 'email' | 'mail' | 'both';
}

export type PaymentTerms = 'net-15' | 'net-30' | 'net-60' | 'due-on-receipt' | 'custom';

export interface EventPreferences {
  preferredVenueTypes?: string[];
  typicalEventSize?: 'small' | 'medium' | 'large' | 'extra-large';
  typicalBudgetRange?: 'economy' | 'standard' | 'premium' | 'luxury';
  equipmentPreferences?: string[];
  specialRequirements?: string[];
  preferredDays?: ('monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday')[];
  seasonalPreferences?: ('spring' | 'summer' | 'fall' | 'winter')[];
}

export interface CommunicationPreferences {
  emailOptIn: boolean;
  smsOptIn: boolean;
  promotionalOptIn: boolean;
  newsletterOptIn: boolean;
  preferredCommunicationTime?: 'morning' | 'afternoon' | 'evening';
  communicationFrequency?: 'weekly' | 'biweekly' | 'monthly' | 'quarterly';
  doNotContact: boolean;
}

export interface Attachment {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
  uploadedAt: string;
  uploadedBy: string;
}

/**
 * Mock customers data
 */
export const mockCustomers: Customer[] = [
  // Corporate Customer - Alex
  {
    id: 'customer-1',
    userId: 'cust-1',
    companyName: 'ABC Events',
    companyType: 'corporate',
    industry: 'Technology',
    website: 'https://abcevents.example.com',
    billingAddress: {
      street1: '123 Tech Boulevard',
      street2: 'Suite 500',
      city: 'Chicago',
      state: 'IL',
      zipCode: '60601',
      country: 'USA',
      isVerified: true
    },
    primaryContact: {
      name: 'Alex Customer',
      title: 'Events Director',
      email: 'customer@example.com',
      phone: '555-123-4567',
      mobile: '555-987-6543',
      isPrimary: true,
      preferredContactMethod: 'email'
    },
    additionalContacts: [
      {
        name: 'Sam Johnson',
        title: 'Procurement Manager',
        email: 'sam@abcevents.example.com',
        phone: '555-123-7890',
        isPrimary: false,
        preferredContactMethod: 'phone'
      }
    ],
    billing: {
      paymentTerms: 'net-30',
      currency: 'USD',
      taxExempt: false,
      preferredPaymentMethod: 'credit-card',
      creditLimit: 50000,
      accountManager: 'Jordan Manager',
      invoiceDeliveryMethod: 'email'
    },
    eventPreferences: {
      preferredVenueTypes: ['conference-center', 'hotel'],
      typicalEventSize: 'large',
      typicalBudgetRange: 'premium',
      equipmentPreferences: ['Premium PA System', 'LED Video Wall', 'Moving Head Lights'],
      preferredDays: ['thursday', 'friday']
    },
    notes: 'Major corporate client with quarterly events. Prefers high-end venues and premium production values.',
    status: 'active',
    customerSince: '2023-01-15T12:00:00Z',
    lastEventDate: '2023-09-17T18:00:00Z',
    totalEventsHosted: 4,
    totalSpent: 82500,
    tags: ['VIP', 'tech-industry', 'repeat-client'],
    communicationPreferences: {
      emailOptIn: true,
      smsOptIn: true,
      promotionalOptIn: false,
      newsletterOptIn: true,
      preferredCommunicationTime: 'morning',
      communicationFrequency: 'monthly',
      doNotContact: false
    },
    attachments: [
      {
        id: 'att-1',
        name: 'Master Service Agreement',
        url: '/mock-files/documents/abc-msa.pdf',
        type: 'application/pdf',
        size: 1250000,
        uploadedAt: '2023-01-20T10:30:00Z',
        uploadedBy: 'mgr-1'
      }
    ],
    created_at: '2023-01-15T12:00:00Z',
    updated_at: '2023-09-20T09:15:00Z',
    assignedRepId: 'mgr-1'
  },
  
  // Production Company - Riley
  {
    id: 'customer-2',
    userId: 'cust-2',
    companyName: 'XYZ Productions',
    companyType: 'small-business',
    industry: 'Entertainment',
    website: 'https://xyzproductions.example.com',
    billingAddress: {
      street1: '456 Entertainment Row',
      city: 'Chicago',
      state: 'IL',
      zipCode: '60607',
      country: 'USA',
      isVerified: true
    },
    shippingAddress: {
      street1: '789 Studio Avenue',
      city: 'Chicago',
      state: 'IL',
      zipCode: '60607',
      country: 'USA'
    },
    primaryContact: {
      name: 'Riley Client',
      title: 'Production Manager',
      email: 'customer2@example.com',
      phone: '555-234-5678',
      isPrimary: true,
      preferredContactMethod: 'email'
    },
    billing: {
      paymentTerms: 'net-15',
      currency: 'USD',
      taxExempt: false,
      taxId: '12-3456789',
      preferredPaymentMethod: 'bank-transfer',
      invoiceDeliveryMethod: 'email'
    },
    eventPreferences: {
      preferredVenueTypes: ['theater', 'outdoor'],
      typicalEventSize: 'medium',
      typicalBudgetRange: 'standard',
      equipmentPreferences: ['Wireless Microphone Set', 'Portable Stage', 'LED Par Lights'],
      specialRequirements: ['Multiple dressing rooms', 'Green room']
    },
    notes: 'Produces theatrical shows and small festivals. Usually has tight budgets but great at logistics and planning.',
    status: 'active',
    customerSince: '2023-03-20T08:15:00Z',
    lastEventDate: '2023-10-22T01:00:00Z',
    totalEventsHosted: 2,
    totalSpent: 15250,
    tags: ['entertainment', 'theatrical', 'flexible-scheduling'],
    communicationPreferences: {
      emailOptIn: true,
      smsOptIn: true,
      promotionalOptIn: true,
      newsletterOptIn: true,
      preferredCommunicationTime: 'afternoon',
      communicationFrequency: 'biweekly',
      doNotContact: false
    },
    created_at: '2023-03-20T08:15:00Z',
    updated_at: '2023-10-25T14:30:00Z',
    assignedRepId: 'emp-1'
  },
  
  // Non-profit Organization
  {
    id: 'customer-3',
    userId: 'user-3', // Referencing an ID that would exist in users.ts
    companyName: 'Community Foundation',
    companyType: 'non-profit',
    industry: 'Charity',
    website: 'https://communityfoundation.example.org',
    billingAddress: {
      street1: '789 Charity Lane',
      city: 'Chicago',
      state: 'IL',
      zipCode: '60614',
      country: 'USA',
      isVerified: true
    },
    primaryContact: {
      name: 'Robin Goodheart',
      title: 'Executive Director',
      email: 'robin@communityfoundation.example.org',
      phone: '555-345-6789',
      isPrimary: true
    },
    additionalContacts: [
      {
        name: 'Avery Smith',
        title: 'Event Coordinator',
        email: 'avery@communityfoundation.example.org',
        phone: '555-345-9876',
        isPrimary: false
      }
    ],
    billing: {
      paymentTerms: 'net-30',
      currency: 'USD',
      taxExempt: true,
      taxId: '98-7654321',
      preferredPaymentMethod: 'check',
      invoiceDeliveryMethod: 'email'
    },
    eventPreferences: {
      preferredVenueTypes: ['hotel', 'historic'],
      typicalEventSize: 'medium',
      typicalBudgetRange: 'economy',
      specialRequirements: ['Accessibility features', 'Donor recognition capabilities']
    },
    notes: 'Non-profit focused on community development. Price-sensitive but hosts regular fundraising galas.',
    status: 'active',
    customerSince: '2023-02-10T14:20:00Z',
    lastEventDate: '2023-07-20T23:30:00Z',
    totalEventsHosted: 2,
    totalSpent: 8900,
    tags: ['non-profit', 'tax-exempt', 'fundraising'],
    communicationPreferences: {
      emailOptIn: true,
      smsOptIn: false,
      promotionalOptIn: false,
      newsletterOptIn: true,
      communicationFrequency: 'monthly',
      doNotContact: false
    },
    created_at: '2023-02-10T14:20:00Z',
    updated_at: '2023-08-01T11:15:00Z',
    assignedRepId: 'mgr-1'
  },
  
  // Educational Institution
  {
    id: 'customer-4',
    userId: 'user-4', // Referencing an ID that would exist in users.ts
    companyName: 'University of Example',
    companyType: 'educational',
    industry: 'Higher Education',
    website: 'https://www.universityofexample.edu',
    billingAddress: {
      street1: '1000 University Drive',
      street2: 'Procurement Office',
      city: 'Chicago',
      state: 'IL',
      zipCode: '60637',
      country: 'USA',
      isVerified: true
    },
    primaryContact: {
      name: 'Dr. Morgan Williams',
      title: 'Events Director',
      email: 'morgan.williams@universityofexample.edu',
      phone: '555-789-0123',
      isPrimary: true,
      preferredContactMethod: 'email'
    },
    additionalContacts: [
      {
        name: 'Pat Johnson',
        title: 'Procurement Manager',
        email: 'pat.johnson@universityofexample.edu',
        phone: '555-789-4567',
        isPrimary: false
      }
    ],
    billing: {
      paymentTerms: 'net-60',
      currency: 'USD',
      taxExempt: true,
      taxId: '45-6789012',
      preferredPaymentMethod: 'invoice',
      invoiceDeliveryMethod: 'both'
    },
    eventPreferences: {
      preferredVenueTypes: ['conference-center', 'on-campus'],
      typicalEventSize: 'large',
      typicalBudgetRange: 'standard',
      equipmentPreferences: ['Premium PA System', '4K Projector', 'Wireless Microphone Set'],
      specialRequirements: ['Accessibility features', 'Recording capabilities']
    },
    notes: 'Hosts multiple types of events including graduation ceremonies, conferences, and lecture series.',
    status: 'active',
    customerSince: '2022-08-05T09:30:00Z',
    lastEventDate: '2023-05-25T14:00:00Z',
    totalEventsHosted: 5,
    totalSpent: 32000,
    tags: ['education', 'recurring-events', 'formal-procurement'],
    communicationPreferences: {
      emailOptIn: true,
      smsOptIn: false,
      promotionalOptIn: false,
      newsletterOptIn: true,
      preferredCommunicationTime: 'morning',
      communicationFrequency: 'monthly',
      doNotContact: false
    },
    attachments: [
      {
        id: 'att-2',
        name: 'University Vendor Agreement',
        url: '/mock-files/documents/university-vendor-agreement.pdf',
        type: 'application/pdf',
        size: 1500000,
        uploadedAt: '2022-08-10T11:20:00Z',
        uploadedBy: 'mgr-1'
      }
    ],
    created_at: '2022-08-05T09:30:00Z',
    updated_at: '2023-06-01T10:45:00Z',
    assignedRepId: 'emp-2'
  },
  
  // Government Agency
  {
    id: 'customer-5',
    userId: 'user-5', // Referencing an ID that would exist in users.ts
    companyName: 'City Department of Cultural Affairs',
    companyType: 'government',
    industry: 'Government',
    website: 'https://city.gov/culture',
    billingAddress: {
      street1: '250 City Hall Plaza',
      street2: 'Suite 300',
      city: 'Chicago',
      state: 'IL',
      zipCode: '60602',
      country: 'USA',
      isVerified: true
    },
    primaryContact: {
      name: 'Jordan Michaels',
      title: 'Cultural Events Director',
      email: 'j.michaels@city.gov',
      phone: '555-456-7890',
      isPrimary: true,
      preferredContactMethod: 'phone'
    },
    billing: {
      paymentTerms: 'net-60',
      currency: 'USD',
      taxExempt: true,
      taxId: '34-5678901',
      preferredPaymentMethod: 'check',
      invoiceDeliveryMethod: 'both'
    },
    eventPreferences: {
      preferredVenueTypes: ['outdoor', 'theater', 'historic'],
      typicalEventSize: 'extra-large',
      typicalBudgetRange: 'standard',
      specialRequirements: ['Accessibility features', 'Public safety considerations', 'Permit coordination']
    },
    notes: 'Requires extensive documentation and adherence to public procurement rules. Plan for long lead times on contracts.',
    status: 'active',
    customerSince: '2022-05-15T13:45:00Z',
    lastEventDate: '2023-08-06T23:00:00Z',
    totalEventsHosted: 3,
    totalSpent: 95000,
    tags: ['government', 'public-events', 'lengthy-contracting'],
    communicationPreferences: {
      emailOptIn: true,
      smsOptIn: false,
      promotionalOptIn: false,
      newsletterOptIn: false,
      preferredCommunicationTime: 'morning',
      communicationFrequency: 'monthly',
      doNotContact: false
    },
    attachments: [
      {
        id: 'att-3',
        name: 'Government Purchasing Terms',
        url: '/mock-files/documents/gov-purchasing-terms.pdf',
        type: 'application/pdf',
        size: 2200000,
        uploadedAt: '2022-05-20T09:15:00Z',
        uploadedBy: 'mgr-1'
      }
    ],
    created_at: '2022-05-15T13:45:00Z',
    updated_at: '2023-08-10T15:30:00Z',
    assignedRepId: 'mgr-1'
  },
  
  // Individual/Private Client
  {
    id: 'customer-6',
    userId: 'user-6', // Referencing an ID that would exist in users.ts
    companyName: 'Private Client',
    companyType: 'individual',
    billingAddress: {
      street1: '123 Lakeshore Drive',
      street2: 'Apt 1501',
      city: 'Chicago',
      state: 'IL',
      zipCode: '60611',
      country: 'USA',
      isVerified: true
    },
    primaryContact: {
      name: 'Jamie Wilson',
      email: 'jamie.wilson@example.com',
      phone: '555-567-8901',
      mobile: '555-567-8902',
      isPrimary: true,
      preferredContactMethod: 'mobile'
    },
    billing: {
      paymentTerms: 'due-on-receipt',
      currency: 'USD',
      taxExempt: false,
      preferredPaymentMethod: 'credit-card',
      invoiceDeliveryMethod: 'email'
    },
    eventPreferences: {
      preferredVenueTypes: ['hotel', 'historic', 'restaurant'],
      typicalEventSize: 'small',
      typicalBudgetRange: 'luxury',
      equipmentPreferences: ['DJ Equipment Package', 'LED Par Lights', 'Confetti Blaster Set'],
      specialRequirements: ['High-end decorative elements', 'Premium food and beverage']
    },
    notes: 'High-profile individual client who hosts private celebrations. Values privacy and premium service.',
    status: 'active',
    customerSince: '2023-05-01T16:30:00Z',
    lastEventDate: '2023-10-15T02:00:00Z',
    totalEventsHosted: 1,
    totalSpent: 15000,
    tags: ['vip', 'private-events', 'high-budget'],
    communicationPreferences: {
      emailOptIn: true,
      smsOptIn: true,
      promotionalOptIn: false,
      newsletterOptIn: false,
      preferredCommunicationTime: 'evening',
      communicationFrequency: 'biweekly',
      doNotContact: false
    },
    created_at: '2023-05-01T16:30:00Z',
    updated_at: '2023-10-17T11:45:00Z',
    assignedRepId: 'emp-1'
  },
  
  // Corporate - Lead Status
  {
    id: 'customer-7',
    userId: 'user-7', // Referencing an ID that would exist in users.ts
    companyName: 'Future Client LLC',
    companyType: 'corporate',
    industry: 'Finance',
    website: 'https://futureclient.example.com',
    billingAddress: {
      street1: '800 Financial Place',
      city: 'Chicago',
      state: 'IL',
      zipCode: '60603',
      country: 'USA',
      isVerified: false
    },
    primaryContact: {
      name: 'Alex Thompson',
      title: 'Director of Operations',
      email: 'athompson@futureclient.example.com',
      phone: '555-678-9012',
      isPrimary: true,
      preferredContactMethod: 'email'
    },
    billing: {
      paymentTerms: 'net-30',
      currency: 'USD',
      taxExempt: false,
      preferredPaymentMethod: 'credit-card',
      invoiceDeliveryMethod: 'email'
    },
    eventPreferences: {
      preferredVenueTypes: ['hotel', 'conference-center'],
      typicalEventSize: 'medium',
      typicalBudgetRange: 'premium'
    },
    notes: 'Initial meeting held on 2023-11-15. Interested in Annual Investor Meeting in Q2 2024.',
    status: 'lead',
    customerSince: '2023-11-15T10:00:00Z',
    totalEventsHosted: 0,
    totalSpent: 0,
    tags: ['lead', 'finance-industry', 'q2-potential'],
    communicationPreferences: {
      emailOptIn: true,
      smsOptIn: false,
      promotionalOptIn: true,
      newsletterOptIn: true,
      communicationFrequency: 'biweekly',
      doNotContact: false
    },
    created_at: '2023-11-15T10:00:00Z',
    assignedRepId: 'mgr-1'
  }
];

/**
 * Helper function to get customer by ID
 */
export function getCustomerById(id: string): Customer | undefined {
  return mockCustomers.find(customer => customer.id === id);
}

/**
 * Helper function to get customer by user ID
 */
export function getCustomerByUserId(userId: string): Customer | undefined {
  return mockCustomers.find(customer => customer.userId === userId);
}

/**
 * Helper function to get customers by status
 */
export function getCustomersByStatus(status: CustomerStatus): Customer[] {
  return mockCustomers.filter(customer => customer.status === status);
}

/**
 * Helper function to get customers by company type
 */
export function getCustomersByType(type: CompanyType): Customer[] {
  return mockCustomers.filter(customer => customer.companyType === type);
}

/**
 * Helper function to get customers by assigned rep
 */
export function getCustomersByAssignedRep(repId: string): Customer[] {
  return mockCustomers.filter(customer => customer.assignedRepId === repId);
}

/**
 * Helper function to search customers
 */
export function searchCustomers(query: string): Customer[] {
  const lowerQuery = query.toLowerCase();
  return mockCustomers.filter(customer => 
    customer.companyName.toLowerCase().includes(lowerQuery) ||
    customer.primaryContact.name.toLowerCase().includes(lowerQuery) ||
    customer.primaryContact.email.toLowerCase().includes(lowerQuery) ||
    customer.tags?.some(tag => tag.toLowerCase().includes(lowerQuery)) ||
    customer.industry?.toLowerCase().includes(lowerQuery) ||
    customer.billingAddress.city.toLowerCase().includes(lowerQuery) ||
    customer.billingAddress.state.toLowerCase().includes(lowerQuery)
  );
}
