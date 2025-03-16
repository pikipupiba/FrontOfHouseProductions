import React from 'react';
import Link from 'next/link';

// Feature items
const features = [
  {
    id: 1,
    title: 'Customer Portal',
    description: 'Access your event details, manage rentals, submit documents, and communicate with our team - all in one place.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
  },
  {
    id: 2,
    title: 'Event Planning',
    description: 'Create and share event timelines, floor plans, and technical specifications with our team and your venue.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    id: 3,
    title: 'Document Storage',
    description: 'Upload and access stage plots, photos, videos, and venue specifications in your secure online vault.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
      </svg>
    ),
  },
  {
    id: 4,
    title: 'Digital Contracts',
    description: 'Review and sign rental agreements electronically with our secure digital signature system.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    id: 5,
    title: 'Rental Management',
    description: 'Browse available equipment, schedule rentals, and view your rental history with automated tracking.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
    ),
  },
  {
    id: 6,
    title: 'Reward Program',
    description: 'Earn discounts when you upload event photos and videos showcasing our equipment in action.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
];

export default function FeaturesShowcase() {
  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Website Features</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Our online platform provides powerful tools to streamline your event production experience.
          </p>
          <div className="w-24 h-1 bg-blue-600 mx-auto mt-6"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => (
            <div key={feature.id} className="bg-white p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="h-12 w-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mb-5">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600 mb-4">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Feature highlight */}
        <div className="mt-16 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl overflow-hidden shadow-xl">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="p-8 md:p-12">
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">Employee Portal</h3>
              <p className="text-blue-100 mb-6 text-lg">
                For our team members, we offer a specialized portal with equipment tracking, task management, and event details.
              </p>
              <div className="space-y-4">
                <div className="flex items-start">
                  <svg className="w-6 h-6 text-blue-200 mr-3 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <p className="text-white">RFID tracking for equipment management</p>
                </div>
                <div className="flex items-start">
                  <svg className="w-6 h-6 text-blue-200 mr-3 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <p className="text-white">Task assignments and completion tracking</p>
                </div>
                <div className="flex items-start">
                  <svg className="w-6 h-6 text-blue-200 mr-3 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <p className="text-white">Integrated communication tools</p>
                </div>
              </div>
              <div className="mt-8">
                <Link href="/careers" className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-blue-700 bg-white hover:bg-blue-50 transition-colors">
                  Join Our Team
                </Link>
              </div>
            </div>
            <div className="relative h-64 md:h-full">
              {/* Placeholder for employee portal image */}
              <div className="absolute inset-0 bg-blue-800 bg-opacity-50 flex items-center justify-center md:rounded-l-2xl">
                <p className="text-white text-lg">Employee Portal Interface</p>
              </div>
              {/* Uncomment when you have real images 
              <Image
                src="/images/employee-portal.jpg"
                alt="FOHP Employee Portal Interface"
                fill
                className="object-cover md:rounded-l-2xl"
              />
              */}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
