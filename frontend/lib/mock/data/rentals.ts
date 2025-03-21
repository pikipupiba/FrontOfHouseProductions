/**
 * Mock rental data structure
 */
export interface Rental {
  id: string;
  customerId: string;
  eventName: string;
  eventDescription?: string;
  startDate: string;
  endDate: string;
  status: 'quoted' | 'booked' | 'in-progress' | 'completed' | 'cancelled';
  items: RentalItem[];
  venueName?: string;
  venueAddress?: string;
  totalCost: number;
  depositPaid: boolean;
  depositAmount?: number;
  paymentStatus: 'unpaid' | 'partially-paid' | 'paid';
  specialInstructions?: string;
  created_at: string;
  updated_at?: string;
  contactName?: string;
  contactPhone?: string;
  contactEmail?: string;
}

export interface RentalItem {
  equipmentId: string;
  quantity: number;
  dailyRate: number;
  subtotal: number;
  notes?: string;
}

/**
 * Mock rental data
 */
export const mockRentals: Rental[] = [
  {
    id: 'rent-1',
    customerId: 'user-3', // Alex Johnson
    eventName: 'Corporate Annual Meeting',
    eventDescription: 'Annual company meeting with presentations and evening reception.',
    startDate: '2025-04-10T08:00:00Z',
    endDate: '2025-04-10T22:00:00Z',
    status: 'booked',
    items: [
      {
        equipmentId: 'equip-1', // Premium PA System
        quantity: 1,
        dailyRate: 750,
        subtotal: 750
      },
      {
        equipmentId: 'equip-2', // Wireless Microphone Set
        quantity: 2,
        dailyRate: 120,
        subtotal: 240
      },
      {
        equipmentId: 'equip-6', // 4K Projector
        quantity: 1,
        dailyRate: 275,
        subtotal: 275
      }
    ],
    venueName: 'Grand Plaza Hotel',
    venueAddress: '123 Main Street, Chicago, IL 60611',
    totalCost: 1265,
    depositPaid: true,
    depositAmount: 500,
    paymentStatus: 'partially-paid',
    specialInstructions: 'Setup needs to be completed by 7:00 AM. Loading dock available at rear of venue.',
    created_at: '2025-01-15T10:30:00Z',
    updated_at: '2025-02-20T14:45:00Z',
    contactName: 'Sarah Miller',
    contactPhone: '(312) 555-1234',
    contactEmail: 'sarah.miller@example.com'
  },
  {
    id: 'rent-2',
    customerId: 'user-4', // Emily Wilson
    eventName: 'Summer Music Festival',
    eventDescription: 'Two-day outdoor music festival with multiple stages.',
    startDate: '2025-06-15T10:00:00Z',
    endDate: '2025-06-16T23:00:00Z',
    status: 'quoted',
    items: [
      {
        equipmentId: 'equip-1', // Premium PA System
        quantity: 2,
        dailyRate: 750,
        subtotal: 3000,
        notes: '2 days rental'
      },
      {
        equipmentId: 'equip-4', // LED Par Lights
        quantity: 3,
        dailyRate: 180,
        subtotal: 1080,
        notes: '2 days rental'
      },
      {
        equipmentId: 'equip-5', // Moving Head Lights
        quantity: 2,
        dailyRate: 320,
        subtotal: 1280,
        notes: '2 days rental'
      },
      {
        equipmentId: 'equip-8', // Portable Stage
        quantity: 2,
        dailyRate: 400,
        subtotal: 1600,
        notes: '2 days rental'
      },
      {
        equipmentId: 'equip-10', // 25kW Generator
        quantity: 2,
        dailyRate: 450,
        subtotal: 1800,
        notes: '2 days rental'
      }
    ],
    venueName: 'Riverside Park',
    venueAddress: '500 River Road, Chicago, IL 60607',
    totalCost: 8760,
    depositPaid: false,
    depositAmount: 3000,
    paymentStatus: 'unpaid',
    specialInstructions: 'Need site survey one week before event. Power requirements attached in separate document.',
    created_at: '2025-02-20T09:15:00Z',
    contactName: 'Mark Robinson',
    contactPhone: '(312) 555-8765',
    contactEmail: 'mark@summerfest.example.com'
  },
  {
    id: 'rent-3',
    customerId: 'user-5', // Michael Brown
    eventName: 'Wedding Reception',
    eventDescription: 'Evening wedding reception with DJ and dancing.',
    startDate: '2025-05-05T16:00:00Z',
    endDate: '2025-05-05T23:00:00Z',
    status: 'booked',
    items: [
      {
        equipmentId: 'equip-3', // DJ Equipment Package
        quantity: 1,
        dailyRate: 350,
        subtotal: 350
      },
      {
        equipmentId: 'equip-4', // LED Par Lights
        quantity: 1,
        dailyRate: 180,
        subtotal: 180
      },
      {
        equipmentId: 'equip-12', // Fog Machine Package
        quantity: 1,
        dailyRate: 75,
        subtotal: 75
      }
    ],
    venueName: 'Lakeside Reception Hall',
    venueAddress: '78 Shore Drive, Chicago, IL 60611',
    totalCost: 605,
    depositPaid: true,
    depositAmount: 300,
    paymentStatus: 'partially-paid',
    created_at: '2025-02-01T11:20:00Z',
    updated_at: '2025-03-12T16:30:00Z',
    contactName: 'Jessica Brown',
    contactPhone: '(312) 555-6543',
    contactEmail: 'jessica.b@example.com'
  },
  {
    id: 'rent-4',
    customerId: 'user-6', // Jennifer Davis
    eventName: 'Product Launch',
    eventDescription: 'Tech product launch with presentation and interactive displays.',
    startDate: '2025-03-25T13:00:00Z',
    endDate: '2025-03-25T20:00:00Z',
    status: 'completed',
    items: [
      {
        equipmentId: 'equip-6', // 4K Projector
        quantity: 2,
        dailyRate: 275,
        subtotal: 550
      },
      {
        equipmentId: 'equip-7', // LED Video Wall
        quantity: 1,
        dailyRate: 1200,
        subtotal: 1200
      },
      {
        equipmentId: 'equip-1', // Premium PA System
        quantity: 1,
        dailyRate: 750,
        subtotal: 750
      },
      {
        equipmentId: 'equip-2', // Wireless Microphone Set
        quantity: 1,
        dailyRate: 120,
        subtotal: 120
      }
    ],
    venueName: 'Innovation Hub',
    venueAddress: '42 Tech Parkway, Chicago, IL 60654',
    totalCost: 2620,
    depositPaid: true,
    depositAmount: 1000,
    paymentStatus: 'paid',
    specialInstructions: 'Early access required for setup. Additional power requirements for demo stations.',
    created_at: '2025-01-30T13:45:00Z',
    updated_at: '2025-03-26T09:30:00Z',
    contactName: 'David Wong',
    contactPhone: '(312) 555-9876',
    contactEmail: 'david@techcompany.example.com'
  },
  {
    id: 'rent-5',
    customerId: 'user-3', // Alex Johnson
    eventName: 'Charity Gala Dinner',
    eventDescription: 'Annual fundraising dinner with live entertainment and auction.',
    startDate: '2025-07-20T17:00:00Z',
    endDate: '2025-07-20T23:30:00Z',
    status: 'booked',
    items: [
      {
        equipmentId: 'equip-1', // Premium PA System
        quantity: 1,
        dailyRate: 750,
        subtotal: 750
      },
      {
        equipmentId: 'equip-2', // Wireless Microphone Set
        quantity: 1,
        dailyRate: 120,
        subtotal: 120
      },
      {
        equipmentId: 'equip-4', // LED Par Lights
        quantity: 2,
        dailyRate: 180,
        subtotal: 360
      },
      {
        equipmentId: 'equip-13', // Confetti Blaster Set
        quantity: 1,
        dailyRate: 250,
        subtotal: 250
      }
    ],
    venueName: 'Heritage Ballroom',
    venueAddress: '350 Elegant Avenue, Chicago, IL 60611',
    totalCost: 1480,
    depositPaid: true,
    depositAmount: 700,
    paymentStatus: 'partially-paid',
    specialInstructions: 'Stage must be set up by 2:00 PM for performer rehearsals.',
    created_at: '2025-03-10T10:15:00Z',
    updated_at: '2025-03-15T14:30:00Z',
    contactName: 'Patricia Garcia',
    contactPhone: '(312) 555-3456',
    contactEmail: 'patricia@charity.example.org'
  },
  {
    id: 'rent-6',
    customerId: 'user-7', // Robert Taylor
    eventName: 'University Graduation Ceremony',
    eventDescription: 'Annual graduation ceremony with sound reinforcement for large outdoor area.',
    startDate: '2025-05-25T08:00:00Z',
    endDate: '2025-05-25T14:00:00Z',
    status: 'booked',
    items: [
      {
        equipmentId: 'equip-1', // Premium PA System
        quantity: 3,
        dailyRate: 750,
        subtotal: 2250
      },
      {
        equipmentId: 'equip-2', // Wireless Microphone Set
        quantity: 2,
        dailyRate: 120,
        subtotal: 240
      },
      {
        equipmentId: 'equip-8', // Portable Stage
        quantity: 1,
        dailyRate: 400,
        subtotal: 400
      }
    ],
    venueName: 'University Main Quad',
    venueAddress: '100 University Drive, Chicago, IL 60637',
    totalCost: 2890,
    depositPaid: true,
    depositAmount: 1400,
    paymentStatus: 'partially-paid',
    specialInstructions: 'Setup must be completed the evening before. University security will be on site.',
    created_at: '2025-02-15T11:25:00Z',
    updated_at: '2025-03-01T16:45:00Z',
    contactName: 'Dean Williams',
    contactPhone: '(312) 555-7890',
    contactEmail: 'dean.williams@university.example.edu'
  },
  {
    id: 'rent-7',
    customerId: 'user-5', // Michael Brown
    eventName: 'Corporate Holiday Party',
    eventDescription: 'End-of-year celebration with DJ, dancing, and presentations.',
    startDate: '2025-12-15T18:00:00Z',
    endDate: '2025-12-15T23:00:00Z',
    status: 'quoted',
    items: [
      {
        equipmentId: 'equip-3', // DJ Equipment Package
        quantity: 1,
        dailyRate: 350,
        subtotal: 350
      },
      {
        equipmentId: 'equip-4', // LED Par Lights
        quantity: 2,
        dailyRate: 180,
        subtotal: 360
      },
      {
        equipmentId: 'equip-6', // 4K Projector
        quantity: 1,
        dailyRate: 275,
        subtotal: 275
      }
    ],
    venueName: 'Metropolitan Hotel',
    venueAddress: '233 Michigan Avenue, Chicago, IL 60601',
    totalCost: 985,
    depositPaid: false,
    depositAmount: 400,
    paymentStatus: 'unpaid',
    created_at: '2025-03-18T09:40:00Z',
    contactName: 'Rachel Thompson',
    contactPhone: '(312) 555-2468',
    contactEmail: 'rachel@corporation.example.com'
  }
];

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
 * Helper function to get rentals by status
 */
export function getRentalsByStatus(status: Rental['status']): Rental[] {
  return mockRentals.filter(rental => rental.status === status);
}

/**
 * Helper function to get rentals by date range
 */
export function getRentalsByDateRange(startDate: string, endDate: string): Rental[] {
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  return mockRentals.filter(rental => {
    const rentalStart = new Date(rental.startDate);
    const rentalEnd = new Date(rental.endDate);
    
    return (
      (rentalStart >= start && rentalStart <= end) ||
      (rentalEnd >= start && rentalEnd <= end) ||
      (rentalStart <= start && rentalEnd >= end)
    );
  });
}

/**
 * Helper function to search rentals
 */
export function searchRentals(query: string): Rental[] {
  const lowerQuery = query.toLowerCase();
  return mockRentals.filter(rental => 
    rental.eventName.toLowerCase().includes(lowerQuery) || 
    rental.eventDescription?.toLowerCase().includes(lowerQuery) ||
    rental.venueName?.toLowerCase().includes(lowerQuery) ||
    rental.contactName?.toLowerCase().includes(lowerQuery)
  );
}
