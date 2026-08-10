import React from 'react';
import type { Metadata } from 'next';
import { LandingNavbar } from '../components/landing/LandingNavbar';
import { HeroSection } from '../components/landing/HeroSection';
import { ProductShowcase } from '../components/landing/ProductShowcase';
import { RawDataTransition } from '../components/landing/RawDataTransition';
import { DeterministicEngine } from '../components/landing/DeterministicEngine';
import { PipelineFlow } from '../components/landing/PipelineFlow';
import { ConversationalInterface } from '../components/landing/ConversationalInterface';
import { UniversalData } from '../components/landing/UniversalData';
import { SecurityAndTrust } from '../components/landing/SecurityAndTrust';
import { MinimalCTA } from '../components/landing/MinimalCTA';
import { LandingFooter } from '../components/landing/LandingFooter';

export const metadata: Metadata = {
  title: 'Zentrivo — Premium Business Intelligence',
  description: 'Turn your business data into clear, evidence-based decisions with Zentrivo.',
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#030308] text-slate-100 font-sans selection:bg-white/20 selection:text-white">
      <LandingNavbar />
      <main>
        <HeroSection />
        <ProductShowcase />
        <RawDataTransition />
        <DeterministicEngine />
        <PipelineFlow />
        <ConversationalInterface />
        <UniversalData />
        <SecurityAndTrust />
        <MinimalCTA />
      </main>
      <LandingFooter />
    </div>
  );
}
