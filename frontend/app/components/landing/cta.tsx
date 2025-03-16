import Link from 'next/link';

export default function CTA() {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Elevate Your Next Event?</h2>
        <p className="text-lg md:text-xl text-blue-100 mb-10 max-w-3xl mx-auto">
          Let Front of House Productions provide the professional equipment and expertise your event deserves. Join our growing family of satisfied clients today.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/equipment"
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-blue-700 bg-white hover:bg-blue-50 transition-colors"
          >
            Explore Equipment
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center px-6 py-3 border border-white text-base font-medium rounded-md text-white hover:bg-white hover:text-blue-700 transition-colors"
          >
            Contact Us
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center justify-center px-6 py-3 border border-blue-400 text-base font-medium rounded-md text-white hover:bg-blue-500 transition-colors"
          >
            Client Login
          </Link>
        </div>
        <p className="mt-8 text-blue-200">
          Have questions? Call us at (123) 456-7890
        </p>
      </div>
    </section>
  );
}
