import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export const metadata = {
  title: 'Portfolio | Front of House Productions',
  description: 'Explore our past event productions including concerts, corporate events, festivals, and more.',
};

export default function PortfolioPage() {
  // Portfolio project data
  const projects = [
    {
      id: 'project1',
      title: 'Downtown Music Festival',
      category: 'Music Festival',
      description: 'Complete production services for a 3-day outdoor music festival featuring 20+ artists across multiple stages.',
      services: ['Audio', 'Lighting', 'Video', 'Staging'],
      imagePlaceholder: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 400' fill='%23e2e8f0'%3E%3Crect width='600' height='400' /%3E%3Cpath d='M300 180 L380 240 L300 300 L220 240 Z' fill='%234f545c'/%3E%3C/svg%3E"
    },
    {
      id: 'project2',
      title: 'Tech Innovation Conference',
      category: 'Corporate Event',
      description: 'Full audiovisual support for a 2-day tech conference with keynote presentations, breakout sessions, and interactive displays.',
      services: ['Audio', 'Video', 'Lighting', 'Live Streaming'],
      imagePlaceholder: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 400' fill='%23e2e8f0'%3E%3Crect width='600' height='400' /%3E%3Cpath d='M300 180 L380 240 L300 300 L220 240 Z' fill='%234f545c'/%3E%3C/svg%3E"
    },
    {
      id: 'project3',
      title: 'Summer Symphony Series',
      category: 'Concert',
      description: 'Production services for an outdoor symphony concert series, featuring precise audio engineering for classical performances.',
      services: ['Audio', 'Lighting', 'Staging'],
      imagePlaceholder: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 400' fill='%23e2e8f0'%3E%3Crect width='600' height='400' /%3E%3Cpath d='M300 180 L380 240 L300 300 L220 240 Z' fill='%234f545c'/%3E%3C/svg%3E"
    },
    {
      id: 'project4',
      title: 'Product Launch Event',
      category: 'Corporate Event',
      description: 'Comprehensive production for a high-profile product launch, including projection mapping and custom lighting design.',
      services: ['Video', 'Lighting', 'Audio', 'Staging'],
      imagePlaceholder: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 400' fill='%23e2e8f0'%3E%3Crect width='600' height='400' /%3E%3Cpath d='M300 180 L380 240 L300 300 L220 240 Z' fill='%234f545c'/%3E%3C/svg%3E"
    },
    {
      id: 'project5',
      title: 'Annual Charity Gala',
      category: 'Special Event',
      description: 'Full production services for an elegant charity fundraiser, featuring custom stage design and ambient lighting.',
      services: ['Lighting', 'Audio', 'Video', 'Decor'],
      imagePlaceholder: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 400' fill='%23e2e8f0'%3E%3Crect width='600' height='400' /%3E%3Cpath d='M300 180 L380 240 L300 300 L220 240 Z' fill='%234f545c'/%3E%3C/svg%3E"
    },
    {
      id: 'project6',
      title: 'National Tour Production',
      category: 'Concert Tour',
      description: 'Production management for a 15-city national tour, including technical direction and equipment logistics.',
      services: ['Audio', 'Lighting', 'Video', 'Tour Management'],
      imagePlaceholder: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 400' fill='%23e2e8f0'%3E%3Crect width='600' height='400' /%3E%3Cpath d='M300 180 L380 240 L300 300 L220 240 Z' fill='%234f545c'/%3E%3C/svg%3E"
    },
  ];

  // Client testimonials
  const testimonials = [
    {
      id: 1,
      name: 'Sarah Johnson',
      company: 'Harmony Music Festival',
      role: 'Event Director',
      quote: 'Front of House Productions exceeded our expectations in every way. Their team was professional, responsive, and delivered an incredible audio-visual experience for our festival. We will definitely be working with them again.',
    },
    {
      id: 2,
      name: 'Michael Chen',
      company: 'TechWorld Conference',
      role: 'Production Manager',
      quote: 'We have partnered with FOHP for our annual conference for three years running. Their attention to detail and technical expertise make them an invaluable partner for large-scale corporate events.',
    },
    {
      id: 3,
      name: 'Rebecca Torres',
      company: 'Metropolitan Symphony',
      role: 'Operations Director',
      quote: 'The audio quality for our outdoor concert series was exceptional. The Front of House team understands the unique requirements of live classical music and delivered a perfect sound experience.',
    },
  ];

  // Filter categories
  const categories = [
    'All',
    'Music Festival',
    'Concert',
    'Corporate Event',
    'Special Event',
    'Concert Tour',
  ];

  return (
    <main className="bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
              Our Work
            </h1>
            <p className="text-xl max-w-3xl mx-auto">
              Explore our portfolio of successful events and productions that showcase our expertise and capabilities.
            </p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white dark:from-gray-900 to-transparent"></div>
      </section>

      {/* Filter Section */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((category, index) => (
              <button
                key={index}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  index === 0 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <div key={project.id} className="group bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md transition-all hover:shadow-xl">
                <div className="relative h-64 w-full overflow-hidden">
                  <Image
                    src={project.imagePlaceholder}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end">
                    <div className="p-4 text-white">
                      <h3 className="text-lg font-bold">{project.title}</h3>
                      <p>{project.category}</p>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">{project.title}</h3>
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full dark:bg-blue-900 dark:text-blue-200">
                      {project.category}
                    </span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.services.map((service, i) => (
                      <span key={i} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded dark:bg-gray-700 dark:text-gray-300">
                        {service}
                      </span>
                    ))}
                  </div>
                  <button className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium">
                    View Project →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-100 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Client Testimonials</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Don't just take our word for it — hear what our clients have to say about working with us.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md">
                <div className="flex items-center mb-4">
                  <div className="h-12 w-12 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center text-gray-500 dark:text-gray-400">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{testimonial.name}</h3>
                    <p className="text-gray-600 dark:text-gray-300">{testimonial.role}, {testimonial.company}</p>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-300 italic">"{testimonial.quote}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Ready to create an exceptional event experience?</h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Let's discuss how we can bring your event vision to life with our professional production services.
          </p>
          <Link 
            href="/contact" 
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Start Your Project
          </Link>
        </div>
      </section>
    </main>
  );
}
