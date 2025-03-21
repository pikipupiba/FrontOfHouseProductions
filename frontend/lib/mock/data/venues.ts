/**
 * Mock venue data structure
 */
export interface Venue {
  id: string;
  name: string;
  description?: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  venueType: VenueType;
  capacity: {
    seated: number;
    standing: number;
    minGuests?: number;
    maxGuests: number;
  };
  specifications?: {
    totalSquareFeet: number;
    ceilingHeight: number;
    doorDimensions?: string;
    floorType?: string;
    elevatorAccess: boolean;
    accessibleEntrance: boolean;
  };
  technicalInfo: {
    powerAvailable: string;
    loadInInfo: string;
    riggingPoints?: number;
    internetAvailable: boolean;
    internetSpecs?: string;
    restrictedHours?: string;
  };
  amenities: string[];
  includedEquipment?: string[];
  restrictions?: string[];
  parkingInfo: string;
  availabilityExceptions?: string[];
  pricingTiers?: PricingTier[];
  contactInfo?: VenueContact[];
  images?: VenueImage[];
  created_at: string;
  updated_at?: string;
  featured?: boolean;
  averageRating?: number;
  reviewCount?: number;
}

export type VenueType = 'hotel' | 'conference-center' | 'theater' | 'outdoor' | 'restaurant' | 'studio' | 'historic' | 'warehouse' | 'gallery' | 'stadium' | 'other';

export interface PricingTier {
  name: string;
  description: string;
  price: number;
  unit: 'hourly' | 'half-day' | 'full-day' | 'week';
  minimumHours?: number;
  includesSetup?: boolean;
  includesTeardown?: boolean;
  notes?: string;
}

export interface VenueContact {
  name: string;
  title: string;
  phone?: string;
  email?: string;
  isPrimary: boolean;
}

export interface VenueImage {
  id: string;
  url: string;
  caption?: string;
  isPrimary?: boolean;
  order: number;
}

/**
 * Mock venues data
 */
export const mockVenues: Venue[] = [
  // Convention Center
  {
    id: 'venue-1',
    name: 'Grand Convention Center',
    description: 'A premier event space in downtown Chicago with multiple versatile halls and meeting rooms.',
    address: '123 Main Street',
    city: 'Chicago',
    state: 'IL',
    zipCode: '60611',
    country: 'USA',
    coordinates: {
      lat: 41.8881,
      lng: -87.6298
    },
    venueType: 'conference-center',
    capacity: {
      seated: 1500,
      standing: 2500,
      maxGuests: 2500
    },
    specifications: {
      totalSquareFeet: 25000,
      ceilingHeight: 30,
      doorDimensions: '10ft x 12ft loading doors',
      floorType: 'Concrete with carpet overlay',
      elevatorAccess: true,
      accessibleEntrance: true
    },
    technicalInfo: {
      powerAvailable: '200A three-phase power available at multiple points',
      loadInInfo: 'Loading dock accessible from rear entrance with direct hall access',
      riggingPoints: 120,
      internetAvailable: true,
      internetSpecs: 'High-speed fiber with dedicated event options available',
      restrictedHours: 'Loading dock closed 12AM-5AM'
    },
    amenities: [
      'Green rooms',
      'Catering kitchen',
      'Box office',
      'In-house AV available',
      'Breakout rooms',
      'On-site security',
      'High-speed Wi-Fi'
    ],
    includedEquipment: [
      'Basic lighting',
      'Tables and chairs',
      'Podium'
    ],
    restrictions: [
      'No open flames',
      'No tape on walls',
      'No overnight storage without approval'
    ],
    parkingInfo: 'Underground parking available for 300 vehicles, loading dock for 5 trucks',
    availabilityExceptions: [
      'Annual Home Show (March 15-20)',
      'Tech Conference (September 5-10)'
    ],
    pricingTiers: [
      {
        name: 'Main Exhibition Hall',
        description: 'Full 25,000 sq ft main hall with all amenities',
        price: 15000,
        unit: 'full-day',
        includesSetup: false,
        includesTeardown: false,
        notes: 'Setup/teardown days at 50% rate'
      },
      {
        name: 'Meeting Room',
        description: 'Individual meeting rooms, 1,000-2,000 sq ft',
        price: 1500,
        unit: 'full-day',
        includesSetup: true,
        includesTeardown: true
      }
    ],
    contactInfo: [
      {
        name: 'Morgan Williams',
        title: 'Venue Manager',
        phone: '555-987-6543',
        email: 'morgan@venue.com',
        isPrimary: true
      },
      {
        name: 'Alex Gonzalez',
        title: 'Technical Director',
        phone: '555-123-7890',
        email: 'alex@venue.com',
        isPrimary: false
      }
    ],
    images: [
      {
        id: 'img-v1-1',
        url: '/mock-files/venues/grand-convention-main.jpg',
        caption: 'Main exhibition hall',
        isPrimary: true,
        order: 1
      },
      {
        id: 'img-v1-2',
        url: '/mock-files/venues/grand-convention-stage.jpg',
        caption: 'Stage setup for keynote',
        order: 2
      },
      {
        id: 'img-v1-3',
        url: '/mock-files/venues/grand-convention-exterior.jpg',
        caption: 'Building exterior',
        order: 3
      }
    ],
    created_at: '2022-05-10T14:30:00Z',
    updated_at: '2023-06-20T10:15:00Z',
    featured: true,
    averageRating: 4.7,
    reviewCount: 142
  },
  
  // Hotel Venue
  {
    id: 'venue-2',
    name: 'Riverside Hotel',
    description: 'Elegant hotel venue with magnificent river views and versatile ballrooms for events of all sizes.',
    address: '789 River Road',
    city: 'Chicago',
    state: 'IL',
    zipCode: '60607',
    country: 'USA',
    coordinates: {
      lat: 41.8785,
      lng: -87.6359
    },
    venueType: 'hotel',
    capacity: {
      seated: 350,
      standing: 500,
      minGuests: 50,
      maxGuests: 500
    },
    specifications: {
      totalSquareFeet: 8000,
      ceilingHeight: 14,
      doorDimensions: 'Standard double doors',
      floorType: 'Carpet',
      elevatorAccess: true,
      accessibleEntrance: true
    },
    technicalInfo: {
      powerAvailable: 'Standard wall outlets with limited 30A circuits',
      loadInInfo: 'Service elevator from loading area, restricted hours',
      riggingPoints: 24,
      internetAvailable: true,
      internetSpecs: 'Hotel Wi-Fi with premium options for events',
      restrictedHours: 'Load-in must conclude by 5PM on weekdays'
    },
    amenities: [
      'On-site catering required',
      'Changing rooms',
      'Coat check',
      'On-site parking',
      'Bridal suite',
      'Audio equipment',
      'Full bar service'
    ],
    includedEquipment: [
      'Tables and chairs',
      'Basic linen',
      'Basic audio system',
      'Podium',
      'Dance floor'
    ],
    restrictions: [
      'Outside catering not permitted',
      'Music ends at 11PM',
      'No confetti or glitter'
    ],
    parkingInfo: 'Valet parking available, $25 per vehicle. Limited self-parking nearby.',
    pricingTiers: [
      {
        name: 'Grand Ballroom',
        description: 'Our largest ballroom with river views',
        price: 7500,
        unit: 'full-day',
        includesSetup: true,
        includesTeardown: true,
        notes: 'Food & beverage minimum applies'
      },
      {
        name: 'River Room',
        description: 'Intimate space with floor-to-ceiling windows',
        price: 3500,
        unit: 'full-day',
        includesSetup: true,
        includesTeardown: true,
        notes: 'Food & beverage minimum applies'
      }
    ],
    contactInfo: [
      {
        name: 'Jordan Taylor',
        title: 'Events Manager',
        phone: '555-234-5678',
        email: 'jtaylor@riversidehotel.com',
        isPrimary: true
      }
    ],
    images: [
      {
        id: 'img-v2-1',
        url: '/mock-files/venues/riverside-ballroom.jpg',
        caption: 'Grand Ballroom with river view',
        isPrimary: true,
        order: 1
      },
      {
        id: 'img-v2-2',
        url: '/mock-files/venues/riverside-reception.jpg',
        caption: 'Reception setup',
        order: 2
      }
    ],
    created_at: '2022-08-15T11:20:00Z',
    updated_at: '2023-04-10T15:45:00Z',
    featured: true,
    averageRating: 4.5,
    reviewCount: 86
  },
  
  // Outdoor Venue
  {
    id: 'venue-3',
    name: 'Millennium Park',
    description: 'Iconic urban park featuring beautiful outdoor spaces for festivals, concerts, and public events.',
    address: '201 E Randolph St',
    city: 'Chicago',
    state: 'IL',
    zipCode: '60602',
    country: 'USA',
    coordinates: {
      lat: 41.8826,
      lng: -87.6227
    },
    venueType: 'outdoor',
    capacity: {
      seated: 3000,
      standing: 10000,
      maxGuests: 10000
    },
    specifications: {
      totalSquareFeet: 250000,
      ceilingHeight: 0, // Outdoor venue
      elevatorAccess: false, // Outdoor venue has no elevators
      accessibleEntrance: true
    },
    technicalInfo: {
      powerAvailable: 'Limited permanent power, generator hookups available',
      loadInInfo: 'Multiple load-in points, vehicle access requires permits',
      internetAvailable: false,
      restrictedHours: 'Park closes at 11PM, setup must begin after 5AM'
    },
    amenities: [
      'Public restrooms',
      'Landmark location',
      'Central location',
      'Natural setting',
      'Iconic backdrop',
      'Public transit access'
    ],
    restrictions: [
      'Noise ordinances apply',
      'Alcohol requires special permits',
      'No staking into ground',
      'No vehicle access during event hours'
    ],
    parkingInfo: 'Limited nearby garages, public transportation recommended',
    availabilityExceptions: [
      'Public holidays',
      'City festivals (check calendar)',
      'Winter closure for some areas (Nov-Mar)'
    ],
    pricingTiers: [
      {
        name: 'Great Lawn',
        description: 'Main event space',
        price: 25000,
        unit: 'full-day',
        includesSetup: false,
        includesTeardown: false,
        notes: 'Additional city permits required'
      },
      {
        name: 'Pritzker Pavilion',
        description: 'Bandshell and seating area',
        price: 15000,
        unit: 'full-day',
        includesSetup: false,
        includesTeardown: false,
        notes: 'Sound system available for additional fee'
      }
    ],
    contactInfo: [
      {
        name: 'City Parks Department',
        title: 'Events Division',
        phone: '555-888-7777',
        email: 'events@cityparks.gov',
        isPrimary: true
      }
    ],
    images: [
      {
        id: 'img-v3-1',
        url: '/mock-files/venues/millennium-park-aerial.jpg',
        caption: 'Aerial view of event space',
        isPrimary: true,
        order: 1
      },
      {
        id: 'img-v3-2',
        url: '/mock-files/venues/millennium-park-stage.jpg',
        caption: 'Main stage during concert',
        order: 2
      },
      {
        id: 'img-v3-3',
        url: '/mock-files/venues/millennium-park-night.jpg',
        caption: 'Night event with city backdrop',
        order: 3
      }
    ],
    created_at: '2022-02-15T09:30:00Z',
    updated_at: '2023-05-05T16:20:00Z',
    featured: true,
    averageRating: 4.8,
    reviewCount: 210
  },
  
  // Wedding Venue
  {
    id: 'venue-4',
    name: 'Lakeside Manor',
    description: 'Elegant estate with indoor and outdoor ceremony spaces overlooking Lake Michigan.',
    address: '456 Lake Drive',
    city: 'Highland Park',
    state: 'IL',
    zipCode: '60035',
    country: 'USA',
    coordinates: {
      lat: 42.1856,
      lng: -87.7845
    },
    venueType: 'historic',
    capacity: {
      seated: 200,
      standing: 250,
      minGuests: 50,
      maxGuests: 250
    },
    specifications: {
      totalSquareFeet: 5000,
      ceilingHeight: 16,
      floorType: 'Hardwood and stone',
      elevatorAccess: false,
      accessibleEntrance: true
    },
    technicalInfo: {
      powerAvailable: 'Limited power capacity, additional power needs require generators',
      loadInInfo: 'All equipment must be brought through side entrance, no large truck access',
      internetAvailable: true,
      internetSpecs: 'Basic Wi-Fi available',
      restrictedHours: 'Events must end by 11PM, teardown by 1AM'
    },
    amenities: [
      'Bridal suite',
      'Groom\'s room',
      'Garden ceremony space',
      'Indoor reception hall',
      'Outdoor patio',
      'Lake view',
      'On-site parking'
    ],
    includedEquipment: [
      'Tables and chairs',
      'Basic white linen',
      'Ceremony chairs',
      'Cake table',
      'Gift table'
    ],
    restrictions: [
      'Music volume restrictions after 10PM',
      'No open flames outdoors',
      'Approved vendor list for catering',
      'No rice or confetti'
    ],
    parkingInfo: 'On-site parking for 100 vehicles, overflow street parking available',
    availabilityExceptions: [
      'Closed January',
      'Limited winter availability (Nov-Mar)'
    ],
    pricingTiers: [
      {
        name: 'Full Estate',
        description: 'Exclusive use of entire property',
        price: 8500,
        unit: 'full-day',
        includesSetup: true,
        includesTeardown: false,
        notes: 'Saturday premium applies in peak season'
      },
      {
        name: 'Garden Ceremony',
        description: 'Ceremony only without reception',
        price: 3500,
        unit: 'half-day',
        includesSetup: true,
        includesTeardown: true,
        notes: '4-hour rental'
      }
    ],
    contactInfo: [
      {
        name: 'Claire Bennett',
        title: 'Wedding Coordinator',
        phone: '555-456-7890',
        email: 'claire@lakesidemanor.com',
        isPrimary: true
      }
    ],
    images: [
      {
        id: 'img-v4-1',
        url: '/mock-files/venues/lakeside-garden.jpg',
        caption: 'Garden ceremony setup',
        isPrimary: true,
        order: 1
      },
      {
        id: 'img-v4-2',
        url: '/mock-files/venues/lakeside-reception.jpg',
        caption: 'Indoor reception hall',
        order: 2
      },
      {
        id: 'img-v4-3',
        url: '/mock-files/venues/lakeside-sunset.jpg',
        caption: 'Sunset view over the lake',
        order: 3
      }
    ],
    created_at: '2022-10-05T13:40:00Z',
    updated_at: '2023-03-12T11:35:00Z',
    featured: false,
    averageRating: 4.9,
    reviewCount: 112
  },
  
  // Theater Venue
  {
    id: 'venue-5',
    name: 'Heritage Theater',
    description: 'Historic theater with ornate architecture, perfect for performances, film screenings, and special events.',
    address: '567 Broadway Ave',
    city: 'Chicago',
    state: 'IL',
    zipCode: '60614',
    country: 'USA',
    coordinates: {
      lat: 41.9270,
      lng: -87.6385
    },
    venueType: 'theater',
    capacity: {
      seated: 800,
      standing: 0, // Theater is seated only
      maxGuests: 800
    },
    specifications: {
      totalSquareFeet: 15000,
      ceilingHeight: 45,
      doorDimensions: 'Loading door 8ft x 10ft',
      floorType: 'Sloped theater floor, wooden stage',
      elevatorAccess: true,
      accessibleEntrance: true
    },
    technicalInfo: {
      powerAvailable: '200A three-phase power, distributed stage power',
      loadInInfo: 'Loading dock at rear of building, direct stage access',
      riggingPoints: 75,
      internetAvailable: true,
      internetSpecs: 'Fiber connection available for streaming',
      restrictedHours: 'Load-in available 8AM-12PM on event days'
    },
    amenities: [
      'Professional sound system',
      'Lighting rig',
      'Orchestra pit',
      'Fly system',
      'Dressing rooms',
      'Box office',
      'Marquee signage',
      'Concessions area'
    ],
    includedEquipment: [
      'Basic stage lighting',
      'House sound system',
      'Projection system',
      'Stage curtains'
    ],
    restrictions: [
      'Union labor requirements',
      'No food or drink in theater',
      'No pyrotechnics',
      'No alterations to historic fixtures'
    ],
    parkingInfo: 'Street parking and nearby public garages, no dedicated lot',
    availabilityExceptions: [
      'Annual maintenance (August 1-15)',
      'Resident company performances (check calendar)'
    ],
    pricingTiers: [
      {
        name: 'Full Theater',
        description: 'Exclusive use of entire theater',
        price: 6500,
        unit: 'full-day',
        includesSetup: false,
        includesTeardown: false,
        notes: 'Technical director required (additional fee)'
      },
      {
        name: 'Performance Only',
        description: '4-hour block for performance without rehearsal',
        price: 3500,
        unit: 'half-day',
        minimumHours: 4,
        includesSetup: false,
        includesTeardown: false,
        notes: 'House manager and technician required'
      }
    ],
    contactInfo: [
      {
        name: 'Marcus Johnson',
        title: 'Venue Director',
        phone: '555-789-4561',
        email: 'mjohnson@heritagetheatre.com',
        isPrimary: true
      },
      {
        name: 'Sophia Lee',
        title: 'Technical Director',
        phone: '555-789-4562',
        email: 'slee@heritagetheatre.com',
        isPrimary: false
      }
    ],
    images: [
      {
        id: 'img-v5-1',
        url: '/mock-files/venues/heritage-auditorium.jpg',
        caption: 'Main auditorium',
        isPrimary: true,
        order: 1
      },
      {
        id: 'img-v5-2',
        url: '/mock-files/venues/heritage-exterior.jpg',
        caption: 'Historic facade',
        order: 2
      },
      {
        id: 'img-v5-3',
        url: '/mock-files/venues/heritage-stage.jpg',
        caption: 'Stage view',
        order: 3
      }
    ],
    created_at: '2022-06-30T16:15:00Z',
    updated_at: '2023-02-10T09:20:00Z',
    featured: false,
    averageRating: 4.6,
    reviewCount: 78
  },
  
  // Studio/Warehouse Space
  {
    id: 'venue-6',
    name: 'Industrial Arts Studio',
    description: 'Converted warehouse space with industrial character and flexible layouts for creative events and productions.',
    address: '890 Factory Street',
    city: 'Chicago',
    state: 'IL',
    zipCode: '60622',
    country: 'USA',
    coordinates: {
      lat: 41.8912,
      lng: -87.6692
    },
    venueType: 'warehouse',
    capacity: {
      seated: 250,
      standing: 400,
      maxGuests: 400
    },
    specifications: {
      totalSquareFeet: 12000,
      ceilingHeight: 18,
      doorDimensions: 'Roll-up door 14ft x 16ft',
      floorType: 'Polished concrete',
      elevatorAccess: false,
      accessibleEntrance: true
    },
    technicalInfo: {
      powerAvailable: '200A three-phase power, distributed throughout space',
      loadInInfo: 'Ground-level loading, roll-up door access',
      riggingPoints: 30,
      internetAvailable: true,
      internetSpecs: 'Gigabit fiber available',
      restrictedHours: '24-hour access available'
    },
    amenities: [
      'Industrial kitchen',
      'Freight elevator',
      'Breakout rooms',
      'Production office',
      'Green screen wall',
      'Rooftop access',
      'Photo cyc wall'
    ],
    includedEquipment: [
      'Basic lighting grid',
      'Sound system available',
      'Portable AC units',
      'Portable heaters',
      'Modular furniture'
    ],
    restrictions: [
      'Sound restrictions after midnight',
      'No overnight public events',
      'No alterations to structure'
    ],
    parkingInfo: 'Limited street parking, small private lot (15 spaces)',
    pricingTiers: [
      {
        name: 'Main Studio',
        description: 'Full warehouse space',
        price: 4500,
        unit: 'full-day',
        includesSetup: true,
        includesTeardown: true,
        notes: 'Minimum 8-hour rental'
      },
      {
        name: 'Hourly Rate',
        description: 'Flexible hourly rental',
        price: 650,
        unit: 'hourly',
        minimumHours: 4,
        includesSetup: true,
        includesTeardown: true
      }
    ],
    contactInfo: [
      {
        name: 'Ryan Zhang',
        title: 'Studio Manager',
        phone: '555-321-9876',
        email: 'ryan@industrialartsstudio.com',
        isPrimary: true
      }
    ],
    images: [
      {
        id: 'img-v6-1',
        url: '/mock-files/venues/industrial-main.jpg',
        caption: 'Main studio space',
        isPrimary: true,
        order: 1
      },
      {
        id: 'img-v6-2',
        url: '/mock-files/venues/industrial-event.jpg',
        caption: 'Event setup',
        order: 2
      },
      {
        id: 'img-v6-3',
        url: '/mock-files/venues/industrial-kitchen.jpg',
        caption: 'Industrial kitchen',
        order: 3
      }
    ],
    created_at: '2022-09-15T10:10:00Z',
    updated_at: '2023-07-01T14:25:00Z',
    featured: true,
    averageRating: 4.5,
    reviewCount: 92
  }
];

/**
 * Helper function to get venue by ID
 */
export function getVenueById(id: string): Venue | undefined {
  return mockVenues.find(venue => venue.id === id);
}

/**
 * Helper function to get venues by type
 */
export function getVenuesByType(type: VenueType): Venue[] {
  return mockVenues.filter(venue => venue.venueType === type);
}

/**
 * Helper function to get venues by capacity
 */
export function getVenuesByCapacity(minCapacity: number): Venue[] {
  return mockVenues.filter(venue => venue.capacity.seated >= minCapacity);
}

/**
 * Helper function to get featured venues
 */
export function getFeaturedVenues(): Venue[] {
  return mockVenues.filter(venue => venue.featured);
}

/**
 * Helper function to search venues
 */
export function searchVenues(query: string): Venue[] {
  const lowerQuery = query.toLowerCase();
  return mockVenues.filter(venue => 
    venue.name.toLowerCase().includes(lowerQuery) || 
    venue.description?.toLowerCase().includes(lowerQuery) ||
    venue.address.toLowerCase().includes(lowerQuery) ||
    venue.city.toLowerCase().includes(lowerQuery) ||
    venue.state.toLowerCase().includes(lowerQuery)
  );
}
