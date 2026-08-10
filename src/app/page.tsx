import React from 'react';
import type { Metadata } from 'next';
import { LandingNavbar } from '../components/landing/LandingNavbar';
import { HeroSection } from '../components/landing/HeroSection';
import { DashboardPreview } from '../components/landing/DashboardPreview';
import { RawDataToIntelligence } from '../components/landing/RawDataToIntelligence';
import { HowItWorks } from '../components/landing/HowItWorks';
import { TrustAndQuality } from '../components/landing/TrustAndQuality';
import { AIAnalystPreview } from '../components/landing/AIAnalystPreview';
import { SecuritySection } from '../components/landing/SecuritySection';
import { FinalCTA } from '../components/landing/FinalCTA';
import { LandingFooter } from '../components/landing/LandingFooter';

export const metadata: Metadata = {
  title: 'Zentrivo — Premium Business Intelligence',
  description: 'Turn your business data into clear, evidence-based decisions with Zentrivo.',
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#030308] text-slate-100 font-sans selection:bg-indigo-500 selection:text-white">
      <LandingNavbar />
      <HeroSection />
      <DashboardPreview />
      <RawDataToIntelligence />
      <HowItWorks />
      <TrustAndQuality />
      <AIAnalystPreview />
      <SecuritySection />
      <FinalCTA />
      <LandingFooter />
    </div>
  );
}
