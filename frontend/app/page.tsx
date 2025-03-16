import Hero from './components/landing/hero';
import Mission from './components/landing/mission';
import WorkShowcase from './components/landing/work-showcase';
import EquipmentShowcase from './components/landing/equipment-showcase';
import FeaturesShowcase from './components/landing/features-showcase';
import Testimonials from './components/landing/testimonials';
import CTA from './components/landing/cta';

export default function Home() {
  return (
    <>
      <Hero />
      <Mission />
      <WorkShowcase />
      <EquipmentShowcase />
      <FeaturesShowcase />
      <Testimonials />
      <CTA />
    </>
  );
}
