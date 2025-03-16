'use client';

import { useState } from 'react';
import Image from 'next/image';

// Mock data for work showcase items - would come from database in production
const workItems = [
  {
    id: 1,
    title: 'Annual Music Festival',
    category: 'Festival',
    description: 'Complete audio and lighting production for a 3-day outdoor music festival featuring multiple stages and artists.',
    // Replace with actual image in production
    imageUrl: null,
  },
  {
    id: 2,
    title: 'Corporate Conference',
    category: 'Corporate',
    description: 'Full stage design, audio setup, and presentation equipment for a major tech company\'s annual conference.',
    imageUrl: null,
  },
  {
    id: 3,
    title: 'Stadium Concert',
    category: 'Concert',
    description: 'Arena-sized sound system and coordinated lighting for a major touring artist\'s performance.',
    imageUrl: null,
  },
  {
    id: 4,
    title: 'Theatrical Production',
    category: 'Theater',
    description: 'Custom lighting design and sound reinforcement for a professional theater company\'s seasonal production.',
    imageUrl: null,
  },
  {
    id: 5,
    title: 'Wedding Celebration',
    category: 'Wedding',
    description: 'Elegant lighting and high-quality sound system for an outdoor wedding reception with 300 guests.',
    imageUrl: null,
  },
  {
    id: 6,
    title: 'Charity Gala',
    category: 'Gala',
    description: 'Complete audiovisual setup including projection, lighting, and sound for an annual fundraising event.',
    imageUrl: null,
  },
];

// Filter categories
const categories = ['All', 'Festival', 'Corporate', 'Concert', 'Theater', 'Wedding', 'Gala'];

export default function WorkShowcase() {
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredWorks = activeCategory === 'All' 
    ? workItems 
    : workItems.filter(item => item.category === activeCategory);

  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Previous Work</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore our portfolio of successful events where we've delivered exceptional production experiences.
          </p>
          <div className="w-24 h-1 bg-blue-600 mx-auto mt-6"></div>
        </div>

        {/* Category filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeCategory === category
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Work items grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredWorks.map((item) => (
            <div key={item.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
              <div className="relative h-56 bg-gray-300">
                {item.imageUrl ? (
                  <Image
                    src={item.imageUrl}
                    alt={item.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <p className="text-gray-600">{item.category} Image</p>
                  </div>
                )}
                <div className="absolute top-4 right-4 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                  {item.category}
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* View more button */}
        <div className="text-center mt-12">
          <button className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors">
            View All Projects
          </button>
        </div>
      </div>
    </section>
  );
}
