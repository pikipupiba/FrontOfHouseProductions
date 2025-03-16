'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

// Testimonial data
const testimonials = [
  {
    id: 1,
    name: 'Sarah Johnson',
    role: 'Event Coordinator',
    company: 'CityFest Music Festival',
    content: 'The equipment provided by Front of House Productions was top-notch, and their team was incredibly professional. Setup was quick, and the sound quality was exceptional. We\'ve used them for three years straight and won\'t consider anyone else.',
    rating: 5,
    // Replace with actual image in production
    image: null,
  },
  {
    id: 2,
    name: 'Michael Rodriguez',
    role: 'Technical Director',
    company: 'Corporate Events Inc.',
    content: 'For corporate conferences, reliable equipment and professionalism are essential. FOHP delivers both consistently. Their online portal made document sharing and planning painless. Highly recommended!',
    rating: 5,
    image: null,
  },
  {
    id: 3,
    name: 'Emma Davis',
    role: 'Theater Manager',
    company: 'Community Arts Center',
    content: 'Working with FOHP has elevated our productions significantly. Their lighting design expertise and quality equipment transformed our stage. The team is responsive, knowledgeable, and genuinely cares about our success.',
    rating: 5,
    image: null,
  },
  {
    id: 4,
    name: 'David Kim',
    role: 'Wedding Planner',
    company: 'Perfect Day Weddings',
    content: 'I trust FOHP with all my high-end weddings. Their attention to detail and understanding of atmosphere creation through lighting and sound is unmatched. My clients consistently rave about the results.',
    rating: 5,
    image: null,
  },
];

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
      );
    }, 8000);
    
    return () => clearInterval(interval);
  }, []);

  // Go to a specific testimonial
  const goToTestimonial = (index: number) => {
    setCurrentIndex(index);
  };

  // Next/previous controls
  const nextTestimonial = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
    );
  };
  
  const prevTestimonial = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">What Our Clients Say</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Don't just take our word for it - hear from event professionals who trust their productions to us.
          </p>
          <div className="w-24 h-1 bg-blue-600 mx-auto mt-6"></div>
        </div>

        <div className="relative bg-gray-50 rounded-2xl overflow-hidden shadow-lg p-6 md:p-10">
          {/* Navigation arrows */}
          <button 
            onClick={prevTestimonial}
            className="absolute top-1/2 left-3 transform -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-md hover:bg-gray-100"
            aria-label="Previous testimonial"
          >
            <svg className="w-6 h-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <button 
            onClick={nextTestimonial}
            className="absolute top-1/2 right-3 transform -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-md hover:bg-gray-100"
            aria-label="Next testimonial"
          >
            <svg className="w-6 h-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Current testimonial */}
          <div className="md:grid md:grid-cols-5 gap-8 items-center">
            <div className="col-span-3 mb-8 md:mb-0">
              {/* Quote icon */}
              <svg className="h-12 w-12 text-blue-500 mb-6 opacity-20" fill="currentColor" viewBox="0 0 32 32">
                <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
              </svg>
              
              <p className="text-gray-700 text-lg md:text-xl mb-8 italic">
                "{testimonials[currentIndex]?.content ?? ''}"
              </p>
              
              {/* Star rating */}
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg 
                    key={i} 
                    className={`w-5 h-5 ${i < (testimonials[currentIndex]?.rating ?? 0) ? 'text-yellow-400' : 'text-gray-300'}`} 
                    fill="currentColor" 
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              
              <div>
                <p className="font-bold text-gray-900">{testimonials[currentIndex]?.name ?? 'Client'}</p>
                <p className="text-gray-600">
                  {testimonials[currentIndex]?.role ?? 'Role'}, {testimonials[currentIndex]?.company ?? 'Company'}
                </p>
              </div>
            </div>
            
            <div className="col-span-2 flex justify-center">
              {/* Client photo placeholder */}
              <div className="h-48 w-48 rounded-full bg-gray-300 flex items-center justify-center">
                {testimonials[currentIndex]?.image ? (
                  <Image
                    src={testimonials[currentIndex]?.image ?? ''}
                    alt={testimonials[currentIndex]?.name ?? 'Client Photo'}
                    width={192}
                    height={192}
                    className="rounded-full object-cover"
                  />
                ) : (
                  <span className="text-gray-500">Client Photo</span>
                )}
              </div>
            </div>
          </div>
          
          {/* Dot indicators */}
          <div className="flex justify-center space-x-2 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => goToTestimonial(index)}
                className={`h-3 w-3 rounded-full transition-colors ${
                  index === currentIndex ? 'bg-blue-600' : 'bg-gray-300'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
