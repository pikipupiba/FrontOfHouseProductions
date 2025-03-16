import Link from 'next/link';
import Image from 'next/image';

export default function Hero() {
  return (
    <div className="relative bg-gray-900 overflow-hidden">
      {/* Decorative angle background */}
      <div className="absolute inset-0">
        <div 
          className="absolute inset-0 bg-gradient-to-r from-blue-800 to-purple-900 opacity-70"
          aria-hidden="true"
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              Professional Event <span className="text-blue-400">Production</span> Equipment
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-md">
              Elevate your events with premium audio, lighting, and stage equipment from Front of House Productions.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/equipment"
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-300"
              >
                Explore Equipment
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-6 py-3 border border-white text-base font-medium rounded-md text-white hover:bg-white hover:text-gray-900 transition-colors duration-300"
              >
                Contact Us
              </Link>
            </div>
          </div>
          <div className="hidden md:block relative h-96">
            {/* This is a placeholder for an image - in production, use a real image */}
            <div className="absolute inset-0 bg-blue-500 bg-opacity-20 rounded-lg flex items-center justify-center">
              <p className="text-white text-lg">Event Production Image</p>
            </div>
            {/* Uncomment and use when you have actual images
            <Image
              src="/images/hero-image.jpg"
              alt="Event production equipment in action"
              fill
              className="object-cover rounded-lg"
              priority
            />
            */}
          </div>
        </div>
      </div>

      {/* Animated scroll indicator */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center">
        <span className="text-white text-sm mb-2">Scroll to explore</span>
        <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
          <span className="animate-bounce w-1 h-3 bg-white rounded-full mt-2"></span>
        </div>
      </div>
    </div>
  );
}
