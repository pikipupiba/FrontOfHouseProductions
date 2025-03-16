import Image from 'next/image';

export default function Mission() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Mission</h2>
          <div className="w-24 h-1 bg-blue-600 mx-auto"></div>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="relative h-64 md:h-full md:aspect-square rounded-lg overflow-hidden">
            {/* Placeholder for image - replace with actual mission-related image */}
            <div className="absolute inset-0 bg-gray-300 flex items-center justify-center">
              <p className="text-gray-600 text-lg">Company Image</p>
            </div>
            {/* Uncomment when you have real images
            <Image
              src="/images/mission.jpg"
              alt="FOHP team working on an event"
              fill
              className="object-cover"
            />
            */}
          </div>
          
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Delivering Exceptional Event Experiences
            </h3>
            
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              At Front of House Productions, we believe that every event deserves world-class technical production. 
              Our mission is to provide premium audio, lighting, and stage equipment along with unparalleled 
              expertise to turn your vision into reality.
            </p>
            
            <p className="text-lg text-gray-700 mb-8 leading-relaxed">
              With decades of combined experience, our team is dedicated to excellence, innovation, and 
              creating memorable experiences for our clients and their audiences.
            </p>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-blue-600 font-bold text-xl mb-2">100+</div>
                <div className="text-gray-600">Events Annually</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-blue-600 font-bold text-xl mb-2">15+</div>
                <div className="text-gray-600">Years Experience</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-blue-600 font-bold text-xl mb-2">500+</div>
                <div className="text-gray-600">Equipment Items</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-blue-600 font-bold text-xl mb-2">98%</div>
                <div className="text-gray-600">Client Satisfaction</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
