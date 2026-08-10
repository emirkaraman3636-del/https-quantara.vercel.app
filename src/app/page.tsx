import LandingNavbar from '../components/landing/LandingNavbar';
import HeroSection from '../components/landing/HeroSection';
import TrustStrip from '../components/landing/TrustStrip';
import RawDataTransition from '../components/landing/RawDataTransition';
import DataQualitySection from '../components/landing/DataQualitySection';
import DeterministicEngineSection from '../components/landing/DeterministicEngineSection';
import AIAnalystSection from '../components/landing/AIAnalystSection';
import PipelineSection from '../components/landing/PipelineSection';
import ProductShowcase from '../components/landing/ProductShowcase';
import FeatureSection from '../components/landing/FeatureSection';
import FinalCTA from '../components/landing/FinalCTA';
import LandingFooter from '../components/landing/LandingFooter';

export const metadata = {
  title: 'Quantara | Enterprise Data Intelligence',
  description: 'Transform raw business data into trusted intelligence with deterministic analytics.',
};

export default function Page() {
  return (
    <main className="min-h-screen bg-[#030308] text-white selection:bg-indigo-500/30 selection:text-white">
      <LandingNavbar />
      <HeroSection />
      <TrustStrip />
      <RawDataTransition />
      <DataQualitySection />
      <DeterministicEngineSection />
      <AIAnalystSection />
      <PipelineSection />
      <ProductShowcase />
      <FeatureSection />
      <FinalCTA />
      <LandingFooter />
    </main>
  );
}
