import React, { useEffect, useState } from 'react';
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
  const [quotePrice, setQuotePrice] = useState<number | undefined>();

  const handleOpenBooking = (packageId?: string) => {
    setSelectedPackageId(packageId || 'prestige');
    setBookingInitialData(undefined);
    setQuotePrice(undefined);
    setBookingModalOpen(true);
  };

  useEffect(() => {
    if (window.location.hash !== '#reserve') return;
    const service = new URLSearchParams(window.location.search).get('service');
    setSelectedPackageId(service && ['refresh', 'prestige', 'concours'].includes(service) ? service : 'prestige');
    setBookingModalOpen(true);
  }, []);

  const handleQuoteCalculated = (partialData: Partial<BookingFormData>, price: number) => {
    if (partialData.serviceId) {
      setSelectedPackageId(partialData.serviceId);
    }
    setBookingInitialData((prev) => ({
      name: prev?.name || '',
      phone: prev?.phone || '',
      locationMetro: prev?.locationMetro || 'san-antonio',
      vehicleYearMakeModel: prev?.vehicleYearMakeModel || '',
      serviceId: partialData.serviceId || selectedPackageId,
      preferredTime: prev?.preferredTime || '08:00 AM',
      notes: partialData.notes ? `${partialData.notes} | Est. Total: $${price}` : `Est. Total: $${price}`,
    }));
    setQuotePrice(price);
    setBookingModalOpen(true);
  };

  return (
    <div className="bg-surface text-text font-sans min-h-screen pb-[calc(5rem+env(safe-area-inset-bottom))] md:pb-0 selection:bg-accent selection:text-accent-contrast transition-colors duration-300">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:bg-card focus:p-3">Skip to main content</a>
      {/* Header */}
      <Header onOpenBooking={handleOpenBooking} />

      {/* Main Sections */}
      <main id="main-content" tabIndex={-1}>
        <Hero onOpenBooking={() => handleOpenBooking()} />
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
        initialQuotePrice={quotePrice}
      />

      {/* Sticky Mobile CTA Bar */}
      <StickyMobileBar onOpenBooking={() => handleOpenBooking()} />
    </div>
  );
}
