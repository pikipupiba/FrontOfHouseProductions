import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export const metadata = {
  title: 'About Us | Front of House Productions',
  description: 'Learn about Front of House Productions, our history, our team, and our mission to deliver exceptional event production services.',
};

export default function AboutPage() {
  // Team members data
  const teamMembers = [
    {
      name: 'John Doe',
      position: 'Founder & CEO',
      bio: 'With over 20 years of experience in event production, John founded Front of House Productions with a vision to create memorable event experiences through technical excellence.',
      imagePlaceholder: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 500 500' fill='%23e2e8f0'%3E%3Crect width='500' height='500' /%3E%3Cpath d='M250 125C201.25 125 162.5 163.75 162.5 212.5C162.5 261.25 201.25 300 250 300C298.75 300 337.5 261.25 337.5 212.5C337.5 163.75 298.75 125 250 125ZM125 400V425H375V400C375 354.25 283.75 325 250 325C216.25 325 125 354.25 125 400Z' fill='%234f545c'/%3E%3C/svg%3E"
    },
    {
      name: 'Jane Smith',
      position: 'Technical Director',
      bio: 'Jane oversees all technical aspects of our productions, ensuring that our audio, lighting, and video systems are perfectly integrated to meet the unique requirements of each event.',
      imagePlaceholder: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 500 500' fill='%23e2e8f0'%3E%3Crect width='500' height='500' /%3E%3Cpath d='M250 125C201.25 125 162.5 163.75 162.5 212.5C162.5 261.25 201.25 300 250 300C298.75 300 337.5 261.25 337.5 212.5C337.5 163.75 298.75 125 250 125ZM125 400V425H375V400C375 354.25 283.75 325 250 325C216.25 325 125 354.25 125 400Z' fill='%234f545c'/%3E%3C/svg%3E"
    },
    {
      name: 'Michael Johnson',
      position: 'Head of Audio',
      bio: 'A seasoned audio engineer with a passion for perfect sound, Michael leads our audio department, bringing clarity and impact to every event we produce.',
      imagePlaceholder: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 500 500' fill='%23e2e8f0'%3E%3Crect width='500' height='500' /%3E%3Cpath d='M250 125C201.25 125 162.5 163.75 162.5 212.5C162.5 261.25 201.25 300 250 300C298.75 300 337.5 261.25 337.5 212.5C337.5 163.75 298.75 125 250 125ZM125 400V425H375V400C375 354.25 283.75 325 250 325C216.25 325 125 354.25 125 400Z' fill='%234f545c'/%3E%3C/svg%3E"
    },
    {
      name: 'Sarah Williams',
      position: 'Lighting Designer',
      bio: 'Sarah combines technical expertise with artistic vision to create lighting designs that enhance the atmosphere and visual impact of every event.',
      imagePlaceholder: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 500 500' fill='%23e2e8f0'%3E%3Crect width='500' height='500' /%3E%3Cpath d='M250 125C201.25 125 162.5 163.75 162.5 212.5C162.5 261.25 201.25 300 250 300C298.75 300 337.5 261.25 337.5 212.5C337.5 163.75 298.75 125 250 125ZM125 400V425H375V400C375 354.25 283.75 325 250 325C216.25 325 125 354.25 125 400Z' fill='%234f545c'/%3E%3C/svg%3E"
    },
    {
      name: 'Robert Chen',
      position: 'Video Production Manager',
      bio: 'Robert specializes in video production and projection mapping, bringing creative visual elements to life for our clients.',
      imagePlaceholder: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 500 500' fill='%23e2e8f0'%3E%3Crect width='500' height='500' /%3E%3Cpath d='M250 125C201.25 125 162.5 163.75 162.5 212.5C162.5 261.25 201.25 300 250 300C298.75 300 337.5 261.25 337.5 212.5C337.5 163.75 298.75 125 250 125ZM125 400V425H375V400C375 354.25 283.75 325 250 325C216.25 325 125 354.25 125 400Z' fill='%234f545c'/%3E%3C/svg%3E"
    },
    {
      name: 'Emily Davis',
      position: 'Client Relations Manager',
      bio: 'Emily ensures that our clients receive exceptional service from initial inquiry through to event completion, building lasting relationships based on trust and satisfaction.',
      imagePlaceholder: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 500 500' fill='%23e2e8f0'%3E%3Crect width='500' height='500' /%3E%3Cpath d='M250 125C201.25 125 162.5 163.75 162.5 212.5C162.5 261.25 201.25 300 250 300C298.75 300 337.5 261.25 337.5 212.5C337.5 163.75 298.75 125 250 125ZM125 400V425H375V400C375 354.25 283.75 325 250 325C216.25 325 125 354.25 125 400Z' fill='%234f545c'/%3E%3C/svg%3E"
    },
  ];

  // Company values
  const values = [
    {
      title: 'Technical Excellence',
      description: 'We constantly invest in the latest technology and training to deliver the highest quality production services.',
      icon: (
        <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
        </svg>
      ),
    },
    {
      title: 'Client-Focused Service',
      description: 'We prioritize our clients\' needs, working collaboratively to bring their visions to life with attention to every detail.',
      icon: (
        <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
    },
    {
      title: 'Reliability',
      description: 'Our clients can depend on us to deliver flawless execution, even in challenging circumstances and tight timeframes.',
      icon: (
        <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
    },
    {
      title: 'Innovation',
      description: 'We continuously explore new technologies and creative approaches to enhance the impact and effectiveness of our productions.',
      icon: (
        <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
    },
  ];

  // Company milestone/timeline data
  const milestones = [
    {
      year: '2010',
      title: 'Company Founded',
      description: 'Front of House Productions was established with a small team and a big vision.',
    },
    {
      year: '2012',
      title: 'First Major Music Festival',
      description: 'Successfully produced audio and lighting for a regional music festival with over 10,000 attendees.',
    },
    {
      year: '2015',
      title: 'Expanded to Video Production',
      description: 'Added video production services to our offerings, including LED walls and projection mapping.',
    },
    {
      year: '2017',
      title: 'Opened New Headquarters',
      description: 'Moved to our current location with expanded warehouse space for our growing inventory.',
    },
    {
      year: '2020',
      title: 'Virtual Event Solutions',
      description: 'Pioneered hybrid and virtual event production solutions during the global pandemic.',
    },
    {
      year: '2023',
      title: 'International Expansion',
      description: 'Began serving clients internationally, bringing our production expertise to global events.',
    },
  ];

  return (
    <main className="bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
              About Front of House Productions
            </h1>
            <p className="text-xl max-w-3xl mx-auto">
              We are a team of passionate professionals dedicated to creating exceptional event experiences through technical excellence and creative innovation.
            </p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white dark:from-gray-900 to-transparent"></div>
      </section>

      {/* Company Overview */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Our Story</h2>
              <div className="space-y-4 text-gray-600 dark:text-gray-300">
                <p>
                  Front of House Productions was founded in 2010 with a simple mission: to provide exceptional technical production services that elevate events from ordinary to extraordinary.
                </p>
                <p>
                  Our founder, John Doe, had spent years working in the event production industry and saw an opportunity to create a company that combined technical expertise with a client-focused approach.
                </p>
                <p>
                  Starting with just a small inventory of audio equipment and a team of three, we have grown to become a full-service production company with a comprehensive range of services and a team of dedicated professionals.
                </p>
                <p>
                  Today, we serve clients across the country, from music festivals and concert tours to corporate events and special celebrations. What has not changed is our commitment to technical excellence and our passion for creating memorable event experiences.
                </p>
              </div>
            </div>
            <div className="mt-10 lg:mt-0 relative h-80 md:h-96 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
              {/* Placeholder for company image */}
              <div className="absolute inset-0 flex items-center justify-center text-gray-400 dark:text-gray-500 text-lg">
                Company Image
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Mission */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-100 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Our Mission</h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            To empower our clients to create impactful events by providing superior technical production services, innovative solutions, and exceptional customer support.
          </p>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Our Core Values</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              These principles guide every aspect of our work and define who we are as a company.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {values.map((value, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md text-center">
                <div className="flex justify-center mb-4">
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{value.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Company Timeline */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-100 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Our Journey</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              The key milestones that have shaped our company over the years.
            </p>
          </div>

          <div className="relative border-l-4 border-blue-600 ml-6 md:ml-12 pl-6 pb-6 space-y-12">
            {milestones.map((milestone, index) => (
              <div key={index} className="relative">
                <div className="absolute -left-10 mt-1.5 h-6 w-6 rounded-full bg-blue-600 border-4 border-white dark:border-gray-800"></div>
                <div className="bg-white dark:bg-gray-700 rounded-lg shadow-md p-6">
                  <span className="text-blue-600 font-bold text-lg">{milestone.year}</span>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-1 mb-2">{milestone.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300">{milestone.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Meet the Team */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Meet Our Team</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              The talented professionals who make it all happen.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {teamMembers.map((member, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md">
                <div className="h-64 relative">
                  <Image
                    src={member.imagePlaceholder}
                    alt={member.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{member.name}</h3>
                  <p className="text-blue-600 dark:text-blue-400 font-medium mb-4">{member.position}</p>
                  <p className="text-gray-600 dark:text-gray-300">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-blue-600 text-white">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to work with us?</h2>
          <p className="text-xl opacity-90 mb-8">
            Let us discuss how we can help make your next event a success.
          </p>
          <Link 
            href="/contact" 
            className="inline-flex items-center px-6 py-3 border-2 border-white text-base font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50"
          >
            Get in Touch
          </Link>
        </div>
      </section>
    </main>
  );
}
