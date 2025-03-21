/**
 * Mock equipment data structure
 */
export interface EquipmentCategory {
  id: string;
  name: string;
  description?: string;
  icon?: string;
}

export interface Equipment {
  id: string;
  name: string;
  description: string;
  categoryId: string;
  price: number;
  priceUnit: 'day' | 'hour' | 'event';
  imageUrl?: string;
  specifications?: Record<string, string>;
  availableQuantity: number;
  created_at: string;
  updated_at?: string;
  manufacturer?: string;
  model?: string;
  condition?: 'new' | 'excellent' | 'good' | 'fair';
  weight?: number;
  dimensions?: {
    width: number;
    height: number;
    depth: number;
    unit: 'in' | 'cm' | 'ft';
  };
  powerRequirements?: string;
  featured?: boolean;
}

/**
 * Mock equipment categories
 */
export const mockEquipmentCategories: EquipmentCategory[] = [
  {
    id: 'cat-1',
    name: 'Audio Equipment',
    description: 'Professional sound systems and audio gear',
    icon: 'speaker'
  },
  {
    id: 'cat-2',
    name: 'Lighting',
    description: 'Professional stage and event lighting solutions',
    icon: 'lightbulb'
  },
  {
    id: 'cat-3',
    name: 'Video',
    description: 'Projectors, screens, and video equipment',
    icon: 'video'
  },
  {
    id: 'cat-4',
    name: 'Staging',
    description: 'Stages, risers, and structural elements',
    icon: 'stage'
  },
  {
    id: 'cat-5',
    name: 'Power & Distribution',
    description: 'Power generators, cables, and distribution systems',
    icon: 'power'
  },
  {
    id: 'cat-6',
    name: 'Special Effects',
    description: 'Fog machines, confetti cannons, and other effects',
    icon: 'sparkles'
  }
];

/**
 * Mock equipment data
 */
export const mockEquipment: Equipment[] = [
  // Audio Equipment
  {
    id: 'equip-1',
    name: 'Premium PA System',
    description: 'Complete professional PA system with speakers, amplifiers, and mixing console. Perfect for medium-sized events up to 500 attendees.',
    categoryId: 'cat-1',
    price: 750,
    priceUnit: 'day',
    imageUrl: 'https://images.unsplash.com/photo-1520170350707-b2da59970118?w=800&h=600&fit=crop&crop=edges',
    availableQuantity: 3,
    created_at: '2022-01-15T12:00:00Z',
    updated_at: '2023-05-20T15:30:00Z',
    manufacturer: 'JBL',
    model: 'PRX Complete',
    condition: 'excellent',
    specifications: {
      power: '4000W',
      speakers: '2 main, 2 subs',
      mixer: '16 channel',
      coverage: 'Up to 500 people'
    },
    powerRequirements: '20A/120V circuit',
    featured: true
  },
  {
    id: 'equip-2',
    name: 'Wireless Microphone Set',
    description: 'Professional wireless microphone set with 4 handheld mics and receiver.',
    categoryId: 'cat-1',
    price: 120,
    priceUnit: 'day',
    imageUrl: 'https://images.unsplash.com/photo-1546507318-dc206ad061c5?w=800&h=600&fit=crop&crop=edges',
    availableQuantity: 10,
    created_at: '2022-02-10T09:45:00Z',
    manufacturer: 'Shure',
    model: 'SLX-D Quad',
    condition: 'excellent',
    specifications: {
      frequency: 'UHF',
      range: '100m',
      batteryLife: '8 hours',
      channels: '4'
    }
  },
  {
    id: 'equip-3',
    name: 'DJ Equipment Package',
    description: 'Complete DJ setup with controller, mixer, speakers, and lighting effects.',
    categoryId: 'cat-1',
    price: 350,
    priceUnit: 'event',
    imageUrl: 'https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=800&h=600&fit=crop&crop=edges',
    availableQuantity: 2,
    created_at: '2022-03-20T14:20:00Z',
    specifications: {
      controller: 'Pioneer DDJ-800',
      software: 'Serato DJ Pro',
      speakers: '2x QSC K12.2',
      lighting: 'Included basic package'
    },
    featured: true
  },

  // Lighting
  {
    id: 'equip-4',
    name: 'LED Par Lights (Set of 8)',
    description: 'RGB LED par lights with DMX control, perfect for stage lighting or uplighting.',
    categoryId: 'cat-2',
    price: 180,
    priceUnit: 'day',
    imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&h=600&fit=crop&crop=edges',
    availableQuantity: 5,
    created_at: '2022-01-15T16:30:00Z',
    manufacturer: 'Chauvet',
    model: 'SlimPAR Pro',
    specifications: {
      type: 'RGBWA+UV LED',
      control: 'DMX 512',
      modes: 'Static, sound-activated, automated programs',
      power: '20W each'
    }
  },
  {
    id: 'equip-5',
    name: 'Moving Head Lights (Set of 4)',
    description: 'Professional moving head beam lights with various effects and DMX control.',
    categoryId: 'cat-2',
    price: 320,
    priceUnit: 'day',
    imageUrl: 'https://images.unsplash.com/photo-1504680177321-2e6a879aac86?w=800&h=600&fit=crop&crop=edges',
    availableQuantity: 3,
    created_at: '2022-04-10T11:15:00Z',
    manufacturer: 'Martin',
    model: 'MAC Quantum',
    condition: 'excellent',
    specifications: {
      beam: '2-60° zoom',
      control: 'DMX 512',
      movement: '540° pan, 270° tilt',
      features: 'Gobos, colors, prism effects'
    },
    powerRequirements: '15A/120V circuit',
    featured: true
  },

  // Video
  {
    id: 'equip-6',
    name: '4K Projector',
    description: 'High-brightness 4K projector ideal for presentations and video content.',
    categoryId: 'cat-3',
    price: 275,
    priceUnit: 'day',
    imageUrl: 'https://images.unsplash.com/photo-1598550476439-6847785fcea6?w=800&h=600&fit=crop&crop=edges',
    availableQuantity: 4,
    created_at: '2022-02-28T10:00:00Z',
    manufacturer: 'Epson',
    model: 'Pro G7905U',
    condition: 'excellent',
    specifications: {
      resolution: '4K UHD',
      brightness: '7000 lumens',
      inputs: 'HDMI, DisplayPort, SDI',
      throw: 'Standard and long throw lens options'
    }
  },
  {
    id: 'equip-7',
    name: 'LED Video Wall (10\'x6\')',
    description: 'Modular LED video wall with processor and content management system.',
    categoryId: 'cat-3',
    price: 1200,
    priceUnit: 'day',
    imageUrl: 'https://images.unsplash.com/photo-1533267773230-62f88d00ecf7?w=800&h=600&fit=crop&crop=edges',
    availableQuantity: 1,
    created_at: '2022-05-15T09:30:00Z',
    manufacturer: 'Absen',
    model: 'PL2.9 Pro',
    condition: 'excellent',
    specifications: {
      pitch: '2.9mm',
      brightness: '1200 nits',
      resolution: '1080p native',
      processor: 'Novastar VX4S'
    },
    powerRequirements: '30A/208V circuit',
    featured: true
  },

  // Staging
  {
    id: 'equip-8',
    name: 'Portable Stage (16\'x12\')',
    description: 'Modular portable staging system with adjustable legs and skirting.',
    categoryId: 'cat-4',
    price: 400,
    priceUnit: 'day',
    imageUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&h=600&fit=crop&crop=edges',
    availableQuantity: 3,
    created_at: '2022-03-12T13:45:00Z',
    specifications: {
      height: 'Adjustable 12-36"',
      capacity: '125 lbs per square foot',
      surface: 'Black non-slip',
      features: 'Includes steps and railings'
    }
  },
  {
    id: 'equip-9',
    name: 'Truss System (40\' Package)',
    description: 'Aluminum box truss with hardware and bases for lighting and decorative rigging.',
    categoryId: 'cat-4',
    price: 350,
    priceUnit: 'day',
    imageUrl: 'https://images.unsplash.com/photo-1493676304819-0d7a8d026dcf?w=800&h=600&fit=crop&crop=edges',
    availableQuantity: 2,
    created_at: '2022-06-20T14:20:00Z',
    manufacturer: 'Global Truss',
    model: 'F34 Square',
    specifications: {
      size: '12" square',
      material: 'Aluminum',
      load: 'Up to 2000 lbs distributed',
      includes: 'Corner blocks, base plates, and hardware'
    }
  },

  // Power & Distribution
  {
    id: 'equip-10',
    name: '25kW Generator',
    description: 'Quiet diesel generator for event power needs with distribution panel.',
    categoryId: 'cat-5',
    price: 450,
    priceUnit: 'day',
    imageUrl: 'https://images.unsplash.com/photo-1623961990059-28706ba6757c?w=800&h=600&fit=crop&crop=edges',
    availableQuantity: 2,
    created_at: '2022-04-25T08:15:00Z',
    manufacturer: 'Generac',
    model: 'QuietSource Series',
    condition: 'excellent',
    specifications: {
      power: '25kW',
      noise: '<70dB at 25ft',
      runtime: '24 hours at 50% load',
      outlets: 'Various 120V and 240V outlets'
    },
    featured: true
  },
  {
    id: 'equip-11',
    name: 'Power Distribution Box',
    description: 'Professional power distribution with cam locks in and Edison outlets.',
    categoryId: 'cat-5',
    price: 125,
    priceUnit: 'day',
    imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&h=600&fit=crop&crop=edges',
    availableQuantity: 5,
    created_at: '2022-01-30T11:10:00Z',
    manufacturer: 'Motion Laboratories',
    specifications: {
      input: '200A 3-phase cam lock',
      outputs: '12x 20A Edison, 4x 50A twist lock',
      protection: 'Circuit breakers and GFCI protection',
      features: 'Digital voltage and current monitoring'
    }
  },

  // Special Effects
  {
    id: 'equip-12',
    name: 'Fog Machine Package',
    description: 'Professional fog machine with controller and fluid.',
    categoryId: 'cat-6',
    price: 75,
    priceUnit: 'day',
    imageUrl: 'https://images.unsplash.com/photo-1541995235982-cdc9d9bbe5d7?w=800&h=600&fit=crop&crop=edges',
    availableQuantity: 4,
    created_at: '2022-07-05T09:30:00Z',
    manufacturer: 'Antari',
    model: 'Z-1500',
    specifications: {
      output: '1500W',
      tankSize: '1.5 gallon',
      control: 'DMX and manual',
      coverage: 'Up to 3500 cubic feet'
    }
  },
  {
    id: 'equip-13',
    name: 'Confetti Blaster Set',
    description: 'Electric confetti blasters with CO2 tanks and colorful confetti.',
    categoryId: 'cat-6',
    price: 250,
    priceUnit: 'event',
    imageUrl: 'https://images.unsplash.com/photo-1514525253161-87b9f384526e?w=800&h=600&fit=crop&crop=edges',
    availableQuantity: 2,
    created_at: '2022-05-12T16:20:00Z',
    specifications: {
      units: '2 blasters',
      range: 'Up to 50 feet',
      control: 'Remote control',
      includes: '4 CO2 tanks and 10lbs of confetti'
    }
  }
];

/**
 * Helper function to get equipment by category
 */
export function getEquipmentByCategory(categoryId: string): Equipment[] {
  return mockEquipment.filter(item => item.categoryId === categoryId);
}

/**
 * Helper function to get equipment by ID
 */
export function getEquipmentById(id: string): Equipment | undefined {
  return mockEquipment.find(item => item.id === id);
}

/**
 * Helper function to get featured equipment
 */
export function getFeaturedEquipment(): Equipment[] {
  return mockEquipment.filter(item => item.featured);
}

/**
 * Helper function to search equipment
 */
export function searchEquipment(query: string): Equipment[] {
  const lowerQuery = query.toLowerCase();
  return mockEquipment.filter(item => 
    item.name.toLowerCase().includes(lowerQuery) || 
    item.description.toLowerCase().includes(lowerQuery) ||
    item.manufacturer?.toLowerCase().includes(lowerQuery) ||
    item.model?.toLowerCase().includes(lowerQuery)
  );
}
