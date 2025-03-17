import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export const metadata = {
  title: 'Equipment | Front of House Productions',
  description: 'Browse our extensive inventory of professional audio, lighting, video, and staging equipment available for rent.',
};

export default function EquipmentPage() {
  const categories = [
    { 
      id: 'audio', 
      name: 'Audio Equipment',
      description: 'Professional audio gear for events of all sizes',
      image: '/equipment/audio.jpg',
      items: [
        { name: 'L-Acoustics KARA Line Array System', description: 'Full-range line source system with 110° horizontal coverage' },
        { name: 'Avid S6L Digital Mixing Console', description: 'Professional live sound mixing system with 64 input channels' },
        { name: 'Shure Axient Digital Wireless System', description: 'Premium wireless microphone system with interference resistance' },
        { name: 'JBL SRX800 Series Powered Speakers', description: 'High-performance portable PA system with built-in DSP' },
        { name: 'Sennheiser EW IEM G4 In-Ear System', description: 'Professional wireless monitoring system for performers' },
      ]
    },
    { 
      id: 'lighting', 
      name: 'Lighting Equipment',
      description: 'Cutting-edge lighting solutions for stunning visual effects',
      image: '/equipment/lighting.jpg',
      items: [
        { name: 'Martin MAC Quantum Profile', description: 'Compact LED moving head fixture with superior brightness' },
        { name: 'Chauvet Professional Maverick MK3 Wash', description: 'RGBW LED moving head wash with wide zoom range' },
        { name: 'ETC Source Four LED Series 2', description: 'Professional LED ellipsoidal fixture with high CRI' },
        { name: 'Ayrton Mistral-TC', description: 'Compact and powerful LED spot luminaire with CMY mixing' },
        { name: 'GrandMA3 Lighting Console', description: 'Advanced lighting control system for professional productions' },
      ]
    },
    { 
      id: 'video', 
      name: 'Video Equipment',
      description: 'High-definition video systems for immersive experiences',
      image: '/equipment/video.jpg',
      items: [
        { name: 'Barco UDX-4K32 Projector', description: '32,000 lumens, 4K UHD laser phosphor projector' },
        { name: 'ROE Visual Carbon CB5 LED Panels', description: 'High-resolution 5.77mm pixel pitch LED video wall' },
        { name: 'Blackmagic ATEM 4 M/E Constellation HD', description: 'Professional live production switcher with 40 inputs' },
        { name: 'Sony PXW-FS7 II XDCAM Camera', description: 'Super 35mm 4K camera with enhanced ergonomics' },
        { name: 'Atomos Ninja V Monitor/Recorder', description: '5" HDR monitoring and recording solution' },
      ]
    },
    { 
      id: 'staging', 
      name: 'Staging & Rigging',
      description: 'Reliable structural elements for safe and impressive setups',
      image: '/equipment/staging.jpg',
      items: [
        { name: 'Prolyte Truss System', description: 'High-quality aluminum truss for lighting and video support' },
        { name: 'StageRight Portable Stage Decks', description: 'Modular staging system with various height options' },
        { name: 'CM Lodestar Chain Hoists', description: 'Industry-standard electric chain hoists for rigging' },
        { name: 'Genie SuperTower ST-24', description: 'Heavy-duty crank-up tower lift for elevated lighting' },
        { name: 'Wenger StageTek Crowd Barriers', description: 'Robust aluminum barricade system for venue safety' },
      ]
    },
  ];
  
  // For now, we'll use placeholder images (these would normally be real equipment images)
  const imagePlaceholder = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 400' fill='%23e2e8f0'%3E%3Crect width='600' height='400' /%3E%3Cpath d='M234.6 121.7c-17.4 0-31.5 14.1-31.5 31.5s14.1 31.5 31.5 31.5 31.5-14.1 31.5-31.5-14.1-31.5-31.5-31.5zm-97.6 59.9c-4.9 9.3-13.7 18.6-13.7 32.8v46.6c0 5.6 4.3 10.3 9.9 10.3h264.9c5.6 0 9.9-4.7 9.9-10.3v-46.6c0-14.2-8.8-23.5-13.7-32.8-9.3-17.4-15.5-28.1-50.9-28.1h-155.5c-35.4 0-41.6 10.7-50.9 28.1z' fill='%234f545c'/%3E%3C/svg%3E";

  return (
    <main className="bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
              Professional Event Production Equipment
            </h1>
            <p className="text-xl max-w-3xl mx-auto">
              Browse our extensive inventory of high-quality audio, lighting, video, and staging equipment available for rent.
            </p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white dark:from-gray-900 to-transparent"></div>
      </section>

      {/* Categories Overview */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Equipment Categories</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              We offer a comprehensive range of professional equipment to meet all your event production needs.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {categories.map((category) => (
              <div key={category.id} className="bg-gray-50 dark:bg-gray-800 rounded-lg overflow-hidden shadow-md transition-all hover:shadow-lg">
                <div className="h-48 w-full relative">
                  <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700">
                    {/* Placeholder for actual images */}
                    <Image 
                      src={imagePlaceholder}
                      alt={category.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{category.name}</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">{category.description}</p>
                  <a href={`#${category.id}`} className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium">
                    View equipment →
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Detailed Equipment Lists */}
      {categories.map((category) => (
        <section key={category.id} id={category.id} className="py-16 px-4 sm:px-6 lg:px-8 border-t border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">{category.name}</h2>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
              <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                {category.items.map((item, index) => (
                  <li key={index} className="p-6 flex flex-col sm:flex-row sm:items-center">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">{item.name}</h3>
                      <p className="text-gray-600 dark:text-gray-300">{item.description}</p>
                    </div>
                    <div className="mt-4 sm:mt-0">
                      <button className="px-4 py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-600 hover:text-white transition-colors">
                        Inquire
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      ))}

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-100 dark:bg-gray-800">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Need equipment for your next event?</h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Contact us to discuss your equipment needs and get a customized quote for your event.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              href="/contact" 
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Contact Us
            </Link>
            <button 
              className="inline-flex items-center px-6 py-3 border border-blue-600 text-base font-medium rounded-md text-blue-600 bg-transparent hover:bg-blue-50 dark:hover:bg-gray-700"
            >
              Download Catalog
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
