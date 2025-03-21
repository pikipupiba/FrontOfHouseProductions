'use client';

import Link from 'next/link';
import MockEquipmentList from '../components/equipment/MockEquipmentList';

export default function EquipmentPage() {
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

      {/* Equipment List Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Our Equipment Inventory</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              We offer a comprehensive range of professional equipment to meet all your event production needs.
            </p>
          </div>

          {/* Mock Equipment List component */}
          <MockEquipmentList />
        </div>
      </section>

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
