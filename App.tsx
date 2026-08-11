import React, { useState } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { LiveStatusBanner } from './components/LiveStatusBanner';
import { ExclusiveFeatures } from './components/ExclusiveFeatures';
import { GymZonesExplorer } from './components/GymZonesExplorer';
import { ClassSchedule } from './components/ClassSchedule';
import { MembershipCalculator } from './components/MembershipCalculator';
import { FitnessCalculators } from './components/FitnessCalculators';
import { TrainersSection } from './components/TrainersSection';
import { LocationAndContacts } from './components/LocationAndContacts';
import { Footer } from './components/Footer';
import { AICoachDrawer } from './components/AICoachDrawer';
import { Sparkles } from 'lucide-react';

export default function App() {
  const [aiCoachDrawerOpen, setAiCoachDrawerOpen] = useState(false);

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-[#00E5FF] selection:text-black">
      
      {/* Navigation Header */}
      <Header
        onOpenAiCoach={() => setAiCoachDrawerOpen(true)}
      />

      {/* Main Content Sections */}
      <main>
        <Hero
          onOpenAiCoach={() => setAiCoachDrawerOpen(true)}
        />

        <LiveStatusBanner />

        <ExclusiveFeatures />

        <GymZonesExplorer />

        <ClassSchedule />

        <MembershipCalculator />

        <FitnessCalculators />

        <TrainersSection />

        <LocationAndContacts />
      </main>

      {/* Footer */}
      <Footer />

      {/* Floating AI Coach Button */}
      <button
        onClick={() => setAiCoachDrawerOpen(true)}
        className="fixed bottom-6 right-6 z-40 p-3.5 bg-[#00E5FF] text-black font-black shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2 group border border-white"
        aria-label="Open AI Fitness Coach"
      >
        <Sparkles className="w-5 h-5 text-black animate-pulse" />
        <span className="hidden sm:inline text-xs uppercase tracking-wider">AI Coach</span>
      </button>

      {/* Slide-over Drawers */}
      <AICoachDrawer
        isOpen={aiCoachDrawerOpen}
        onClose={() => setAiCoachDrawerOpen(false)}
      />

    </div>
  );
}
