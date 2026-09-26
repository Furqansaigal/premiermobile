import React, { useState } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Stats } from './components/Stats';
import { VideoReels } from './components/VideoReels';
import { BeforeAfter } from './components/BeforeAfter';
import { Packages } from './components/Packages';
import { QuoteCalculator } from './components/QuoteCalculator';
import { Reviews } from './components/Reviews';
import { ServiceAreas } from './components/ServiceAreas';
import { FAQ } from './components/FAQ';
import { FinalCTA } from './components/FinalCTA';
import { Footer } from './components/Footer';
import { BookingModal } from './components/BookingModal';
import { StickyMobileBar } from './components/StickyMobileBar';
import { ScrollReveal } from './components/ScrollReveal';
import { BookingFormData } from './types';
import { useSeo } from './hooks/useSeo';

export default function App() {
  useSeo({
    title: 'Mobile Auto Detailing San Antonio, TX | Premier Mobile',
    description:
      'Premium mobile auto detailing in San Antonio, New Braunfels, Boerne & Austin, TX. Interior detail, paint correction & ceramic coating. Get your estimate today.',
    path: '/',
  });

  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedPackageId, setSelectedPackageId] = useState<string>('prestige');
  const [bookingInitialData, setBookingInitialData] = useState<BookingFormData | undefined>(undefined);

  const handleOpenBooking = (packageId?: string) => {
    if (packageId) {
      setSelectedPackageId(packageId);
    }
    setBookingModalOpen(true);
  };

  const handleFormSubmit = (data: BookingFormData) => {
    setBookingInitialData(data);
    setSelectedPackageId(data.serviceId || 'prestige');
    setBookingModalOpen(true);
  };

  const handleQuoteCalculated = (partialData: Partial<BookingFormData>, price: number) => {
    if (partialData.serviceId) {
      setSelectedPackageId(partialData.serviceId);
    }
    setBookingInitialData((prev) => ({
      name: prev?.name || '',
      phone: prev?.phone || '',
      location: prev?.location || 'San Antonio',
      vehicle: prev?.vehicle || '',
      serviceId: partialData.serviceId || selectedPackageId,
      preferredTime: prev?.preferredTime || 'Morning (8AM - 12PM)',
      notes: partialData.notes ? `${partialData.notes} | Est. Total: $${price}` : `Est. Total: $${price}`,
    }));
    setBookingModalOpen(true);
  };

  return (
    <div className="bg-surface text-text font-sans min-h-screen selection:bg-accent selection:text-accent-contrast transition-colors duration-300">
      {/* Header */}
      <Header onOpenBooking={handleOpenBooking} />

      {/* Main Sections */}
      <main className="pb-20 md:pb-0">
        <Hero onFormSubmit={handleFormSubmit} onOpenBooking={() => handleOpenBooking()} />
        <ScrollReveal><Stats /></ScrollReveal>
        <ScrollReveal><VideoReels onOpenBooking={(pkgId) => handleOpenBooking(pkgId)} /></ScrollReveal>
        <ScrollReveal><BeforeAfter /></ScrollReveal>
        <ScrollReveal><Packages onSelectPackage={(pkgId) => handleOpenBooking(pkgId)} /></ScrollReveal>
        <ScrollReveal><QuoteCalculator onQuoteCalculated={handleQuoteCalculated} /></ScrollReveal>
        <ScrollReveal><Reviews /></ScrollReveal>
        <ScrollReveal><ServiceAreas /></ScrollReveal>
        <ScrollReveal><FAQ /></ScrollReveal>
        <ScrollReveal><FinalCTA onOpenBooking={() => handleOpenBooking()} /></ScrollReveal>
      </main>

      {/* Footer */}
      <Footer />

      {/* Booking Modal Popup */}
      <BookingModal
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        initialPackageId={selectedPackageId}
        initialData={bookingInitialData}
      />

      {/* Sticky Mobile CTA Bar */}
      <StickyMobileBar onOpenBooking={() => handleOpenBooking()} />
    </div>
  );
}
