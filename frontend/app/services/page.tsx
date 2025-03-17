import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export const metadata = {
  title: 'Services | Front of House Productions',
  description: 'Explore our comprehensive range of event production services for concerts, corporate events, conferences, and more.',
};

export default function ServicesPage() {
  const services = [
    {
      id: 'audio',
      title: 'Audio Services',
      description: 'Professional sound systems for events of any size. From intimate gatherings to large-scale concerts, we deliver crystal-clear audio that reaches every corner of your venue.',
      features: [
        'Line array and point source PA systems',
        'Digital mixing consoles',
        'Wireless microphone systems',
        'In-ear monitoring',
        'Live recording capabilities',
        'Experienced audio engineers',
      ],
    },
    {
      id: 'lighting',
      title: 'Lighting Services',
      description: 'Transform your event with dynamic lighting design. Our state-of-the-art lighting equipment creates the perfect atmosphere for any occasion.',
      features: [
        'Intelligent moving fixtures',
        'LED lighting solutions',
        'Custom gobo projections',
        'Architectural lighting',
        'Truss and rigging systems',
        'DMX control systems',
      ],
    },
    {
      id: 'video',
      title: 'Video Services',
      description: 'Engage your audience with high-definition video. From projection mapping to IMAG, we enhance your event with cutting-edge visual technology.',
      features: [
        'HD projectors and screens',
        'LED video walls',
        'Multi-camera live switching',
        'Image magnification (IMAG)',
        'Content creation and playback',
        'Live streaming capabilities',
      ],
    },
    {
      id: 'staging',
      title: 'Staging & Production',
      description: 'Complete staging solutions for your event. We handle the technical aspects so you can focus on delivering an unforgettable experience.',
      features: [
        'Custom stage designs',
        'Modular staging systems',
        'Backdrop and drapery',
        'Crowd barriers and ADA ramps',
        'Tent and structure integration',
        'Full production management',
      ],
    },
  ];

  return (
    <main className="bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
              Professional Event Production Services
            </h1>
            <p className="text-xl max-w-3xl mx-auto">
              From corporate events to concert tours, we provide comprehensive production solutions to make your event shine.
            </p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white dark:from-gray-900 to-transparent"></div>
      </section>

      {/* Services List */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid gap-12 md:grid-cols-2">
            {services.map((service) => (
              <div key={service.id} className="bg-gray-50 dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg transition-all hover:shadow-xl">
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{service.title}</h2>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">{service.description}</p>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">What we offer:</h3>
                  <ul className="space-y-2">
                    {service.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <svg className="h-5 w-5 text-blue-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                        <span className="text-gray-600 dark:text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-100 dark:bg-gray-800">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Ready to elevate your next event?</h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Let's discuss how we can bring your vision to life with our professional production services.
          </p>
          <Link 
            href="/contact" 
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Contact Us
          </Link>
        </div>
      </section>
    </main>
  );
}
