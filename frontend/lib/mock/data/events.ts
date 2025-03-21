import { mockUsers } from './users';

/**
 * Mock event data structures
 */
export interface Event {
  id: string;
  name: string;
  description?: string;
  status: EventStatus;
  customerId: string;
  startDate: string;
  endDate: string;
  location: Location;
  attendees?: number;
  budget?: number;
  equipmentIds: string[];
  notes?: string;
  created_at: string;
  updated_at?: string;
  primaryContact?: Contact;
  venueContacts?: Contact[];
  timeline?: TimelineItem[];
  documents?: Document[];
  isPublic: boolean;
}

export type EventStatus = 'inquiry' | 'quoted' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled';

export interface Location {
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  venueNotes?: string;
  parkingInfo?: string;
  loadInInfo?: string;
  powerInfo?: string;
}

export interface Contact {
  name: string;
  role?: string;
  email?: string;
  phone?: string;
  notes?: string;
}

export interface TimelineItem {
  id: string;
  title: string;
  startTime: string;
  endTime?: string;
  description?: string;
  status: 'pending' | 'in-progress' | 'completed' | 'issue';
  assignedTo?: string[];
}

export interface Document {
  id: string;
  name: string;
  type: 'contract' | 'invoice' | 'proposal' | 'venue' | 'other';
  url: string;
  uploadedBy: string;
  uploadedAt: string;
  size?: number;
  status?: 'draft' | 'sent' | 'signed' | 'approved' | 'rejected';
}

/**
 * Mock rental data structure
 */
export interface Rental {
  id: string;
  eventId: string;
  customerId: string;
  status: RentalStatus;
  equipmentItems: RentalItem[];
  startDate: string;
  endDate: string;
  subtotal: number;
  tax: number;
  total: number;
  deposit?: number;
  depositPaid?: boolean;
  paymentStatus: 'unpaid' | 'partial' | 'paid';
  created_at: string;
  updated_at?: string;
  notes?: string;
  deliveryMethod: 'pickup' | 'delivery';
  deliveryAddress?: Location;
  deliveryFee?: number;
  discount?: {
    amount: number;
    reason?: string;
  };
}

export type RentalStatus = 'draft' | 'quoted' | 'confirmed' | 'picked-up' | 'delivered' | 'returned' | 'closed' | 'cancelled';

export interface RentalItem {
  equipmentId: string;
  quantity: number;
  pricePerUnit: number;
  name: string;
  subtotal: number;
  notes?: string;
}

/**
 * Mock events data
 */
export const mockEvents: Event[] = [
  // Corporate Event
  {
    id: 'evt-1',
    name: 'Annual Tech Conference',
    description: 'Three-day technology conference with keynote speakers, breakout sessions, and networking events.',
    status: 'confirmed',
    customerId: 'cust-1',
    startDate: '2023-09-15T08:00:00Z',
    endDate: '2023-09-17T18:00:00Z',
    location: {
      name: 'Grand Convention Center',
      address: '123 Main Street',
      city: 'Chicago',
      state: 'IL',
      zipCode: '60611',
      country: 'USA',
      venueNotes: 'Main exhibition hall with 30ft ceilings',
      parkingInfo: 'Underground parking available for vendors',
      loadInInfo: 'Loading dock accessible from rear entrance',
      powerInfo: '200A three-phase power available at multiple points'
    },
    attendees: 1200,
    budget: 75000,
    equipmentIds: ['equip-1', 'equip-4', 'equip-5', 'equip-6', 'equip-7'],
    created_at: '2023-04-10T14:30:00Z',
    updated_at: '2023-08-20T10:15:00Z',
    primaryContact: {
      name: 'Alex Johnson',
      role: 'Event Director',
      email: 'alex@example.com',
      phone: '555-123-4567'
    },
    venueContacts: [
      {
        name: 'Morgan Williams',
        role: 'Venue Manager',
        email: 'morgan@venue.com',
        phone: '555-987-6543'
      }
    ],
    timeline: [
      {
        id: 'tl-1',
        title: 'Vendor Setup',
        startTime: '2023-09-14T14:00:00Z',
        endTime: '2023-09-14T22:00:00Z',
        description: 'All vendors and equipment setup',
        status: 'pending',
        assignedTo: ['emp-1', 'emp-2']
      },
      {
        id: 'tl-2',
        title: 'Day 1 - Conference',
        startTime: '2023-09-15T08:00:00Z',
        endTime: '2023-09-15T18:00:00Z',
        description: 'Opening keynote and sessions',
        status: 'pending',
        assignedTo: ['emp-1']
      },
      {
        id: 'tl-3',
        title: 'Evening Reception',
        startTime: '2023-09-15T19:00:00Z',
        endTime: '2023-09-15T22:00:00Z',
        description: 'Networking reception with entertainment',
        status: 'pending',
        assignedTo: ['emp-2']
      }
    ],
    isPublic: false
  },
  
  // Wedding
  {
    id: 'evt-2',
    name: 'Smith-Johnson Wedding',
    description: 'Evening wedding ceremony and reception with live band and dancing.',
    status: 'confirmed',
    customerId: 'cust-2',
    startDate: '2023-10-21T16:00:00Z',
    endDate: '2023-10-22T01:00:00Z',
    location: {
      name: 'Lakeside Manor',
      address: '456 Lake Drive',
      city: 'Highland Park',
      state: 'IL',
      zipCode: '60035',
      country: 'USA',
      venueNotes: 'Outdoor ceremony, indoor reception',
      loadInInfo: 'All equipment must be brought through side entrance',
      powerInfo: 'Limited power outdoors, indoor has adequate outlets'
    },
    attendees: 175,
    budget: 15000,
    equipmentIds: ['equip-1', 'equip-2', 'equip-4', 'equip-12', 'equip-13'],
    created_at: '2023-05-15T11:00:00Z',
    updated_at: '2023-09-30T15:45:00Z',
    primaryContact: {
      name: 'Riley Smith',
      email: 'riley@example.com',
      phone: '555-234-5678'
    },
    timeline: [
      {
        id: 'tl-4',
        title: 'Setup',
        startTime: '2023-10-21T10:00:00Z',
        endTime: '2023-10-21T15:00:00Z',
        description: 'Setup all equipment and test sound',
        status: 'pending',
        assignedTo: ['emp-1', 'emp-2']
      },
      {
        id: 'tl-5',
        title: 'Ceremony',
        startTime: '2023-10-21T16:00:00Z',
        endTime: '2023-10-21T17:00:00Z',
        description: 'Wedding ceremony with microphones for officiant and music',
        status: 'pending',
        assignedTo: ['emp-1']
      },
      {
        id: 'tl-6',
        title: 'Reception',
        startTime: '2023-10-21T18:00:00Z',
        endTime: '2023-10-22T01:00:00Z',
        description: 'Dinner and dancing with DJ',
        status: 'pending',
        assignedTo: ['emp-1', 'emp-2']
      }
    ],
    isPublic: false
  },
  
  // Music Festival
  {
    id: 'evt-3',
    name: 'Lakeshore Music Festival',
    description: 'Two-day outdoor music festival with multiple stages and food vendors.',
    status: 'in-progress',
    customerId: 'cust-1',
    startDate: '2023-08-05T12:00:00Z',
    endDate: '2023-08-06T23:00:00Z',
    location: {
      name: 'Millennium Park',
      address: '201 E Randolph St',
      city: 'Chicago',
      state: 'IL',
      zipCode: '60602',
      country: 'USA',
      coordinates: {
        lat: 41.8826,
        lng: -87.6227
      },
      venueNotes: 'Multiple stage locations throughout the park',
      parkingInfo: 'Limited vendor parking, use underground garages',
      loadInInfo: 'Multiple load-in points, see detailed map',
      powerInfo: 'Generator power at each stage location'
    },
    attendees: 5000,
    budget: 120000,
    equipmentIds: ['equip-1', 'equip-2', 'equip-3', 'equip-4', 'equip-5', 'equip-8', 'equip-9', 'equip-10', 'equip-11', 'equip-12'],
    created_at: '2023-01-20T09:00:00Z',
    updated_at: '2023-08-01T11:30:00Z',
    primaryContact: {
      name: 'Jamie Wilson',
      role: 'Festival Director',
      email: 'jamie@example.com',
      phone: '555-555-1234'
    },
    venueContacts: [
      {
        name: 'City Parks Department',
        role: 'Venue Management',
        email: 'parks@city.gov',
        phone: '555-888-7777'
      },
      {
        name: 'Safety Coordinator',
        email: 'safety@city.gov',
        phone: '555-888-9999'
      }
    ],
    timeline: [
      {
        id: 'tl-7',
        title: 'Stage Construction',
        startTime: '2023-08-03T08:00:00Z',
        endTime: '2023-08-04T20:00:00Z',
        description: 'Build and secure all stages and structures',
        status: 'completed',
        assignedTo: ['emp-1', 'emp-2']
      },
      {
        id: 'tl-8',
        title: 'Sound & Lighting Setup',
        startTime: '2023-08-04T08:00:00Z',
        endTime: '2023-08-04T20:00:00Z',
        description: 'Install and test all audio and lighting equipment',
        status: 'completed',
        assignedTo: ['emp-1', 'emp-2']
      },
      {
        id: 'tl-9',
        title: 'Festival Day 1',
        startTime: '2023-08-05T12:00:00Z',
        endTime: '2023-08-05T23:00:00Z',
        description: 'Main event day 1',
        status: 'in-progress',
        assignedTo: ['emp-1', 'emp-2']
      },
      {
        id: 'tl-10',
        title: 'Festival Day 2',
        startTime: '2023-08-06T12:00:00Z',
        endTime: '2023-08-06T23:00:00Z',
        description: 'Main event day 2',
        status: 'pending',
        assignedTo: ['emp-1', 'emp-2']
      }
    ],
    documents: [
      {
        id: 'doc-1',
        name: 'Site Plan',
        type: 'venue',
        url: '/mock-files/documents/festival-site-plan.pdf',
        uploadedBy: 'cust-1',
        uploadedAt: '2023-02-15T14:20:00Z',
        status: 'approved'
      },
      {
        id: 'doc-2',
        name: 'Safety Plan',
        type: 'other',
        url: '/mock-files/documents/festival-safety-plan.pdf',
        uploadedBy: 'cust-1',
        uploadedAt: '2023-03-10T09:45:00Z',
        status: 'approved'
      },
      {
        id: 'doc-3',
        name: 'Event Contract',
        type: 'contract',
        url: '/mock-files/documents/festival-contract.pdf',
        uploadedBy: 'mgr-1',
        uploadedAt: '2023-01-25T11:30:00Z',
        status: 'signed'
      }
    ],
    isPublic: true
  },
  
  // Corporate Party
  {
    id: 'evt-4',
    name: 'End of Year Celebration',
    description: 'Corporate holiday party with dinner, awards, and dancing.',
    status: 'inquiry',
    customerId: 'cust-2',
    startDate: '2023-12-15T18:00:00Z',
    endDate: '2023-12-15T23:00:00Z',
    location: {
      name: 'Riverside Hotel',
      address: '789 River Road',
      city: 'Chicago',
      state: 'IL',
      zipCode: '60607',
      country: 'USA',
      venueNotes: 'Ballroom on the 3rd floor',
      loadInInfo: 'Service elevator available',
      powerInfo: 'Standard wall outlets only'
    },
    attendees: 150,
    budget: 25000,
    equipmentIds: ['equip-1', 'equip-2', 'equip-4', 'equip-5', 'equip-12'],
    created_at: '2023-09-01T13:15:00Z',
    primaryContact: {
      name: 'Casey Martinez',
      role: 'HR Director',
      email: 'casey@example.com',
      phone: '555-345-6789'
    },
    timeline: [
      {
        id: 'tl-11',
        title: 'Setup',
        startTime: '2023-12-15T13:00:00Z',
        endTime: '2023-12-15T17:00:00Z',
        description: 'Setup all equipment and test sound',
        status: 'pending'
      },
      {
        id: 'tl-12',
        title: 'Event',
        startTime: '2023-12-15T18:00:00Z',
        endTime: '2023-12-15T23:00:00Z',
        description: 'Full event',
        status: 'pending'
      }
    ],
    isPublic: false
  }
];

/**
 * Mock rentals data
 */
export const mockRentals: Rental[] = [
  // Corporate Event Rental
  {
    id: 'rent-1',
    eventId: 'evt-1',
    customerId: 'cust-1',
    status: 'confirmed',
    equipmentItems: [
      {
        equipmentId: 'equip-1',
        quantity: 2,
        pricePerUnit: 750,
        name: 'Premium PA System',
        subtotal: 1500
      },
      {
        equipmentId: 'equip-4',
        quantity: 3,
        pricePerUnit: 180,
        name: 'LED Par Lights (Set of 8)',
        subtotal: 540
      },
      {
        equipmentId: 'equip-5',
        quantity: 2,
        pricePerUnit: 320,
        name: 'Moving Head Lights (Set of 4)',
        subtotal: 640
      },
      {
        equipmentId: 'equip-6',
        quantity: 3,
        pricePerUnit: 275,
        name: '4K Projector',
        subtotal: 825
      },
      {
        equipmentId: 'equip-7',
        quantity: 1,
        pricePerUnit: 1200,
        name: 'LED Video Wall (10\'x6\')',
        subtotal: 1200
      }
    ],
    startDate: '2023-09-14T12:00:00Z',
    endDate: '2023-09-17T20:00:00Z',
    subtotal: 4705,
    tax: 423.45,
    total: 5128.45,
    deposit: 2564.23,
    depositPaid: true,
    paymentStatus: 'partial',
    created_at: '2023-04-15T16:30:00Z',
    updated_at: '2023-08-22T11:00:00Z',
    deliveryMethod: 'delivery',
    deliveryAddress: {
      name: 'Grand Convention Center',
      address: '123 Main Street',
      city: 'Chicago',
      state: 'IL',
      zipCode: '60611',
      country: 'USA'
    },
    deliveryFee: 250,
    notes: 'Equipment must be delivered to loading dock B'
  },
  
  // Wedding Rental
  {
    id: 'rent-2',
    eventId: 'evt-2',
    customerId: 'cust-2',
    status: 'confirmed',
    equipmentItems: [
      {
        equipmentId: 'equip-1',
        quantity: 1,
        pricePerUnit: 750,
        name: 'Premium PA System',
        subtotal: 750
      },
      {
        equipmentId: 'equip-2',
        quantity: 2,
        pricePerUnit: 120,
        name: 'Wireless Microphone Set',
        subtotal: 240
      },
      {
        equipmentId: 'equip-4',
        quantity: 2,
        pricePerUnit: 180,
        name: 'LED Par Lights (Set of 8)',
        subtotal: 360
      },
      {
        equipmentId: 'equip-12',
        quantity: 1,
        pricePerUnit: 75,
        name: 'Fog Machine Package',
        subtotal: 75
      },
      {
        equipmentId: 'equip-13',
        quantity: 1,
        pricePerUnit: 250,
        name: 'Confetti Blaster Set',
        subtotal: 250
      }
    ],
    startDate: '2023-10-21T08:00:00Z',
    endDate: '2023-10-22T02:00:00Z',
    subtotal: 1675,
    tax: 150.75,
    total: 1825.75,
    deposit: 912.88,
    depositPaid: true,
    paymentStatus: 'paid',
    created_at: '2023-05-20T10:15:00Z',
    updated_at: '2023-10-01T14:30:00Z',
    deliveryMethod: 'delivery',
    deliveryAddress: {
      name: 'Lakeside Manor',
      address: '456 Lake Drive',
      city: 'Highland Park',
      state: 'IL',
      zipCode: '60035',
      country: 'USA'
    },
    deliveryFee: 150,
    discount: {
      amount: 100,
      reason: 'Repeat customer discount'
    }
  },
  
  // Music Festival Rental
  {
    id: 'rent-3',
    eventId: 'evt-3',
    customerId: 'cust-1',
    status: 'picked-up',
    equipmentItems: [
      {
        equipmentId: 'equip-1',
        quantity: 4,
        pricePerUnit: 750,
        name: 'Premium PA System',
        subtotal: 3000
      },
      {
        equipmentId: 'equip-2',
        quantity: 5,
        pricePerUnit: 120,
        name: 'Wireless Microphone Set',
        subtotal: 600
      },
      {
        equipmentId: 'equip-3',
        quantity: 1,
        pricePerUnit: 350,
        name: 'DJ Equipment Package',
        subtotal: 350
      },
      {
        equipmentId: 'equip-4',
        quantity: 5,
        pricePerUnit: 180,
        name: 'LED Par Lights (Set of 8)',
        subtotal: 900
      },
      {
        equipmentId: 'equip-5',
        quantity: 3,
        pricePerUnit: 320,
        name: 'Moving Head Lights (Set of 4)',
        subtotal: 960
      },
      {
        equipmentId: 'equip-8',
        quantity: 3,
        pricePerUnit: 400,
        name: 'Portable Stage (16\'x12\')',
        subtotal: 1200
      },
      {
        equipmentId: 'equip-9',
        quantity: 2,
        pricePerUnit: 350,
        name: 'Truss System (40\' Package)',
        subtotal: 700
      },
      {
        equipmentId: 'equip-10',
        quantity: 2,
        pricePerUnit: 450,
        name: '25kW Generator',
        subtotal: 900
      },
      {
        equipmentId: 'equip-11',
        quantity: 3,
        pricePerUnit: 125,
        name: 'Power Distribution Box',
        subtotal: 375
      },
      {
        equipmentId: 'equip-12',
        quantity: 3,
        pricePerUnit: 75,
        name: 'Fog Machine Package',
        subtotal: 225
      }
    ],
    startDate: '2023-08-03T08:00:00Z',
    endDate: '2023-08-07T12:00:00Z',
    subtotal: 9210,
    tax: 828.90,
    total: 10038.90,
    deposit: 5019.45,
    depositPaid: true,
    paymentStatus: 'partial',
    created_at: '2023-02-01T13:45:00Z',
    updated_at: '2023-08-03T09:00:00Z',
    deliveryMethod: 'delivery',
    deliveryAddress: {
      name: 'Millennium Park',
      address: '201 E Randolph St',
      city: 'Chicago',
      state: 'IL',
      zipCode: '60602',
      country: 'USA'
    },
    deliveryFee: 500,
    notes: 'Multiple delivery locations within the park, see site map'
  },
  
  // Corporate Party Rental
  {
    id: 'rent-4',
    eventId: 'evt-4',
    customerId: 'cust-2',
    status: 'quoted',
    equipmentItems: [
      {
        equipmentId: 'equip-1',
        quantity: 1,
        pricePerUnit: 750,
        name: 'Premium PA System',
        subtotal: 750
      },
      {
        equipmentId: 'equip-2',
        quantity: 1,
        pricePerUnit: 120,
        name: 'Wireless Microphone Set',
        subtotal: 120
      },
      {
        equipmentId: 'equip-4',
        quantity: 2,
        pricePerUnit: 180,
        name: 'LED Par Lights (Set of 8)',
        subtotal: 360
      },
      {
        equipmentId: 'equip-5',
        quantity: 1,
        pricePerUnit: 320,
        name: 'Moving Head Lights (Set of 4)',
        subtotal: 320
      },
      {
        equipmentId: 'equip-12',
        quantity: 1,
        pricePerUnit: 75,
        name: 'Fog Machine Package',
        subtotal: 75
      }
    ],
    startDate: '2023-12-15T12:00:00Z',
    endDate: '2023-12-16T00:00:00Z',
    subtotal: 1625,
    tax: 146.25,
    total: 1771.25,
    paymentStatus: 'unpaid',
    created_at: '2023-09-05T16:00:00Z',
    deliveryMethod: 'delivery',
    deliveryAddress: {
      name: 'Riverside Hotel',
      address: '789 River Road',
      city: 'Chicago',
      state: 'IL',
      zipCode: '60607',
      country: 'USA'
    },
    deliveryFee: 150
  }
];

/**
 * Helper function to get events by customer ID
 */
export function getEventsByCustomerId(customerId: string): Event[] {
  return mockEvents.filter(event => event.customerId === customerId);
}

/**
 * Helper function to get event by ID
 */
export function getEventById(id: string): Event | undefined {
  return mockEvents.find(event => event.id === id);
}

/**
 * Helper function to get rentals by customer ID
 */
export function getRentalsByCustomerId(customerId: string): Rental[] {
  return mockRentals.filter(rental => rental.customerId === customerId);
}

/**
 * Helper function to get rental by ID
 */
export function getRentalById(id: string): Rental | undefined {
  return mockRentals.find(rental => rental.id === id);
}

/**
 * Helper function to get rentals by event ID
 */
export function getRentalsByEventId(eventId: string): Rental[] {
  return mockRentals.filter(rental => rental.eventId === eventId);
}

/**
 * Helper function to get upcoming events
 */
export function getUpcomingEvents(): Event[] {
  const now = new Date().toISOString();
  return mockEvents
    .filter(event => event.startDate > now && event.status !== 'cancelled')
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
}

/**
 * Helper function to get public events
 */
export function getPublicEvents(): Event[] {
  return mockEvents.filter(event => event.isPublic);
}
