'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

// Define types for equipment data
type EquipmentCategory = {
  id: 'audio' | 'lighting' | 'video' | 'staging';
  name: string;
};

type EquipmentItem = {
  id: number;
  name: string;
  description: string;
};

type EquipmentItems = {
  audio: EquipmentItem[];
  lighting: EquipmentItem[];
  video: EquipmentItem[];
  staging: EquipmentItem[];
};

// Mock equipment categories and items
const equipmentCategories: EquipmentCategory[] = [
  { id: 'audio', name: 'Audio' },
  { id: 'lighting', name: 'Lighting' },
  { id: 'video', name: 'Video' },
  { id: 'staging', name: 'Staging' },
];

const equipmentItems: EquipmentItems = {
  audio: [
    { id: 1, name: 'Line Array Systems', description: 'Professional line array speakers for medium to large venues and outdoor events.' },
    { id: 2, name: 'Digital Mixing Consoles', description: 'State-of-the-art digital mixers with advanced routing and processing capabilities.' },
    { id: 3, name: 'Wireless Microphone Systems', description: 'High-quality wireless microphones and in-ear monitoring solutions.' },
  ],
  lighting: [
    { id: 4, name: 'Moving Head Fixtures', description: 'Intelligent lighting fixtures with full pan/tilt capabilities and effect options.' },
    { id: 5, name: 'LED Wash Lights', description: 'Energy-efficient LED lighting for stage washes and architectural lighting.' },
    { id: 6, name: 'DMX Control Systems', description: 'Advanced lighting control consoles and software for complex productions.' },
  ],
  video: [
    { id: 7, name: 'LED Video Walls', description: 'Modular LED video walls for high-brightness, high-resolution displays.' },
    { id: 8, name: 'Projector Systems', description: 'High-lumen projectors and screens for presentations and large-format video.' },
    { id: 9, name: 'Media Servers', description: 'Video playback and processing systems for complex multi-display setups.' },
  ],
  staging: [
    { id: 10, name: 'Modular Stage Systems', description: 'Configurable staging platforms for indoor and outdoor events.' },
    { id: 11, name: 'Truss Systems', description: 'Structural truss for lighting, audio, and video equipment mounting.' },
    { id: 12, name: 'Crowd Barriers', description: 'Safety barriers and fencing for event audience management.' },
  ],
};

export default function EquipmentShowcase() {
  const [activeCategory, setActiveCategory] = useState<'audio' | 'lighting' | 'video' | 'staging'>('audio');

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Equipment</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We offer premium audio, lighting, video, and staging equipment to make your event shine.
          </p>
          <div className="w-24 h-1 bg-blue-600 mx-auto mt-6"></div>
        </div>

        {/* Category tabs */}
        <div className="flex flex-wrap justify-center mb-12 border-b border-gray-200">
          {equipmentCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-5 py-3 text-base font-medium transition-colors border-b-2 -mb-px ${
                activeCategory === category.id
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Equipment items */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {equipmentItems[activeCategory].map((item) => (
            <div key={item.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="h-40 bg-gray-100 rounded-md mb-6 flex items-center justify-center">
                {/* Placeholder for equipment images */}
                <div className="text-gray-400">{equipmentCategories.find(cat => cat.id === activeCategory)?.name} Equipment</div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{item.name}</h3>
              <p className="text-gray-600 mb-4">{item.description}</p>
              <Link href={`/equipment/${activeCategory}`} className="text-blue-600 font-medium hover:text-blue-800">
                Learn more →
              </Link>
            </div>
          ))}
        </div>

        {/* View all equipment button */}
        <div className="text-center mt-12">
          <Link
            href="/equipment"
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
          >
            View All Equipment
          </Link>
        </div>
      </div>
    </section>
  );
}
