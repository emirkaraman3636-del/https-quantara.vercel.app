import LandingNavbar from '../components/landing/LandingNavbar';
import HeroSection from '../components/landing/HeroSection';
import RawDataTransition from '../components/landing/RawDataTransition';
import DataQualitySection from '../components/landing/DataQualitySection';
import DeterministicEngineSection from '../components/landing/DeterministicEngineSection';
import AIAnalystSection from '../components/landing/AIAnalystSection';
import PipelineSection from '../components/landing/PipelineSection';
import ProductShowcase from '../components/landing/ProductShowcase';
import FinalCTA from '../components/landing/FinalCTA';
import LandingFooter from '../components/landing/LandingFooter';

export const metadata = {
  title: 'Quantara | Enterprise Data Intelligence',
  description: 'Transform raw business data into trusted intelligence with deterministic analytics.',
};

export default function Page() {
  return (
    <main className="min-h-screen bg-[#07080F] text-white selection:bg-[#00F0FF]/30 selection:text-white">
      <LandingNavbar />
      <HeroSection />
      <PipelineSection />
      <RawDataTransition />
      <DataQualitySection />
      <DeterministicEngineSection />
      <AIAnalystSection />
      <ProductShowcase />
      <FinalCTA />
      <LandingFooter />
    </main>
  );
}