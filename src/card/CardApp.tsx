import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Calendar,
  Sparkles,
  Phone,
  MessageSquare,
  Star,
  ExternalLink,
  ChevronRight,
  Share2,
  Smartphone,
  Maximize2,
  ShieldCheck
} from 'lucide-react';

import { BRAND_CONFIG, SERVICES } from './data/config';
import { TrackingEvent } from './types';
import { Logo } from './components/Logo';
import { BookNowModal } from './components/BookNowModal';
import { ServiceModal } from './components/ServiceModal';
import { ContactActionSheet } from './components/ContactActionSheet';
import { ReviewsModal } from './components/ReviewsModal';
import { SaveContactModal } from './components/SaveContactModal';
import { initGA4, trackGAEvent } from './analytics/ga';
import { useSeo } from '../hooks/useSeo';
import { ThemeToggle } from '../components/ThemeToggle';

export default function App() {
  useSeo({
    title: 'Premier Mobile Auto Detail | Digital Business Card',
    description:
      'Contact Premier Mobile Auto Detail, save our info, view services & pricing, and read reviews — all from our digital business card.',
    path: '/card',
  });

  // Modal states
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isReviewsModalOpen, setIsReviewsModalOpen] = useState(false);
  const [isSaveContactModalOpen, setIsSaveContactModalOpen] = useState(false);
  const [selectedServiceForBooking, setSelectedServiceForBooking] = useState<string>('refresh');

  // Preview device mode on desktop
  const [viewMode, setViewMode] = useState<'mobile-frame' | 'fluid'>('mobile-frame');

  // Analytics & Tracking simulation
  const [events, setEvents] = useState<TrackingEvent[]>([]);
  const [scanCount, setScanCount] = useState<number>(1);

  // Initial load tracking
  useEffect(() => {
    initGA4();
    const searchParams = new URLSearchParams(window.location.search);
    const utmSource = searchParams.get('utm_source') || 'qr_business_card';
    const timestamp = new Date().toLocaleTimeString();

    // Log page scan event
    const initialEvent: TrackingEvent = {
      event: `page_view_qr_card (${utmSource})`,
      timestamp,
      label: 'QR Business Card Scan',
    };
    setEvents([initialEvent]);
    trackGAEvent('qr_scan_landed', { utm_source: utmSource });

    try {
      const storedScans = localStorage.getItem('pm_qr_scans');
      const newCount = (Number(storedScans) || 0) + 1;
      localStorage.setItem('pm_qr_scans', newCount.toString());
      setScanCount(newCount);
    } catch { /* The card remains usable when browser storage is blocked. */ }
  }, []);

  const trackAction = (actionName: string, extra: Record<string, any> = {}) => {
    const timestamp = new Date().toLocaleTimeString();
    setEvents((prev) => [...prev, { event: actionName, timestamp }]);
    trackGAEvent(actionName, extra);
  };

  const handleOpenBooking = (serviceId?: string) => {
    if (serviceId) setSelectedServiceForBooking(serviceId);
    trackAction('tapped_book_now_main_cta');
    setIsBookModalOpen(true);
  };

  const handleOpenServices = () => {
    trackAction('tapped_view_services_pricing');
    setIsServiceModalOpen(true);
  };

  const handleOpenContact = () => {
    trackAction('tapped_call_text_us');
    setIsContactModalOpen(true);
  };

  const handleOpenReviews = () => {
    trackAction('tapped_google_reviews_btn');
    setIsReviewsModalOpen(true);
  };

  const handleOpenSaveContact = () => {
    trackAction('tapped_save_digital_card');
    setIsSaveContactModalOpen(true);
  };

  const handleVisitWebsite = () => {
    trackAction('tapped_visit_full_website');
    window.open(BRAND_CONFIG.websiteUrl, '_blank', 'noopener,noreferrer');
  };

  // Main Card Content Component - Mobile-First single-column layout
  const CardContent = (
    <div className="w-full max-w-[420px] mx-auto min-h-screen bg-surface text-text flex flex-col justify-between p-3 sm:p-5 relative">
      {/* Subtle Warm Luxury Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-44 bg-accent/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-64 h-64 bg-accent/5 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Top Header Controls: Quick Share / Save Card */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-1 pb-1.5">
        <ThemeToggle className="mr-1.5" />
        <button
          onClick={handleOpenSaveContact}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-card border border-border text-[11px] font-semibold text-text-secondary hover:text-heading hover:border-accent/50 transition-all cursor-pointer shadow-elevated active:scale-95"
        >
          <Share2 className="w-3.5 h-3.5 text-accent-text" />
          <span>Save / Share Card</span>
        </button>

        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-semibold whitespace-nowrap">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>Mobile Van On-Duty</span>
        </div>
      </div>

      {/* 1. Premier Mobile logo, centered & 2. Heading: "Premier Mobile Auto Detail" */}
      <div className="flex flex-col items-center text-center mt-2 mb-3">
        <Logo size="md" />
      </div>

      {/* Main Stack of Action Buttons - Top to Bottom as specified */}
      <div className="space-y-3 my-1">
        {/* 3. A large, visually dominant "BOOK NOW" button linking directly to the booking form/page */}
        {/* Styled clearly larger and higher-contrast than every other element, positioned visible above the fold */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          id="main-book-now-button"
          onClick={() => handleOpenBooking()}
          className="relative w-full py-4 px-5 rounded-2xl bg-accent text-accent-contrast font-black shadow-xl shadow-accent/20 border border-accent-hover overflow-hidden flex items-center justify-between group cursor-pointer glow-book-now"
          style={{ minHeight: '68px' }}
        >
          {/* Light sweep animation */}
          <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-1000" />

          <div className="flex items-center gap-3.5 text-left z-10">
            <div className="w-12 h-12 rounded-xl bg-black/15 flex items-center justify-center text-accent-contrast">
              <Calendar className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <div className="text-[10px] tracking-widest uppercase font-extrabold text-accent-contrast/75">
                Primary Action &bull; Book Online
              </div>
              <div className="text-xl font-black tracking-tight text-accent-contrast flex items-center gap-1.5">
                <span>BOOK NOW</span>
              </div>
              <div className="text-[11px] font-semibold text-accent-contrast/85">
                Instant confirmation &bull; Choose your date & time
              </div>
            </div>
          </div>

          <div className="w-9 h-9 rounded-full bg-black/15 flex items-center justify-center text-accent-contrast group-hover:translate-x-1 transition-transform z-10 shrink-0">
            <ChevronRight className="w-5 h-5 stroke-[2.5]" />
          </div>
        </motion.button>

        {/* 4. "View Services & Pricing" button (secondary style, links to services/packages section) */}
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          id="view-services-pricing-button"
          onClick={handleOpenServices}
          className="w-full py-3.5 px-4 rounded-2xl bg-card border border-border hover:border-accent/50 hover:bg-input text-heading flex items-center justify-between transition-all cursor-pointer shadow-elevated group"
          style={{ minHeight: '56px' }}
        >
          <div className="flex items-center gap-3 text-left">
            <div className="w-10 h-10 rounded-xl bg-input border border-border-strong/60 flex items-center justify-center text-accent-text group-hover:text-accent-hover">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-heading group-hover:text-accent-text transition-colors">
                View Services & Pricing
              </div>
              <div className="text-[11px] text-text-muted">
                Interior & Exterior, Ceramic Coating & Wash
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1 text-xs font-semibold text-accent-text">
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </motion.button>

        {/* 5. "Call / Text Us" button linking to tel: and sms: using the real number, (210) 580-6738 */}
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          id="call-text-us-button"
          onClick={handleOpenContact}
          className="w-full py-3.5 px-4 rounded-2xl bg-card border border-border hover:border-border-strong hover:bg-input text-heading flex items-center justify-between transition-all cursor-pointer shadow-elevated group"
          style={{ minHeight: '56px' }}
        >
          <div className="flex items-center gap-3 text-left">
            <div className="w-10 h-10 rounded-xl bg-input border border-border-strong/60 flex items-center justify-center text-emerald-400">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-heading group-hover:text-emerald-400 transition-colors">
                Call / Text Us
              </div>
              <div className="text-[11px] text-text-muted">
                {BRAND_CONFIG.phoneDisplay} &bull; Call or SMS text
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </motion.button>

        {/* 6. Social media icons: Instagram (@premiermobile.tx), Facebook, and TikTok */}
        <div className="py-2.5 px-3 rounded-2xl bg-card/90 border border-border shadow-elevated">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-text-muted uppercase tracking-wider">
              Follow Us
            </span>
            <span className="text-[10px] text-accent-text">@premiermobile.tx</span>
          </div>
          <div className="grid grid-cols-3 gap-2.5">
            {/* Instagram */}
            <a
              href={BRAND_CONFIG.socials.instagram.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackAction('visited_instagram', { platform: 'instagram' })}
              className="h-12 rounded-xl bg-input border border-border hover:border-pink-500/50 hover:bg-card flex items-center justify-center text-pink-400 transition-all cursor-pointer active:scale-95 shadow-elevated"
              aria-label="Instagram @premiermobile.tx"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.13-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>

            {/* Facebook */}
            <a
              href={BRAND_CONFIG.socials.facebook.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackAction('visited_facebook', { platform: 'facebook' })}
              className="h-12 rounded-xl bg-input border border-border hover:border-blue-500/50 hover:bg-card flex items-center justify-center text-blue-400 transition-all cursor-pointer active:scale-95 shadow-elevated"
              aria-label="Facebook Premier Mobile Auto Detail"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>

            {/* TikTok */}
            <a
              href={BRAND_CONFIG.socials.tiktok.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackAction('visited_tiktok', { platform: 'tiktok' })}
              className="h-12 rounded-xl bg-input border border-border hover:border-cyan-500/50 hover:bg-card flex items-center justify-center text-cyan-400 transition-all cursor-pointer active:scale-95 shadow-elevated"
              aria-label="TikTok @premiermobile.tx"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.88 2.89 2.89 0 0 1-2.88-2.88 2.89 2.89 0 0 1 2.88-2.88c.38 0 .74.08 1.07.22V9.48a6.38 6.38 0 0 0-1.07-.09A6.34 6.34 0 0 0 3 15.67a6.34 6.34 0 0 0 6.34 6.33 6.34 6.34 0 0 0 6.34-6.33V8.87a8.28 8.28 0 0 0 4.91 1.6V7.02a4.85 4.85 0 0 1-1-.33z"/>
              </svg>
            </a>
          </div>
        </div>

        {/* 7. "Google Reviews" button linking to real Google review link */}
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          id="google-reviews-button"
          onClick={handleOpenReviews}
          className="w-full py-3.5 px-4 rounded-2xl bg-card border border-border hover:border-border-strong hover:bg-input text-heading flex items-center justify-between transition-all cursor-pointer shadow-elevated group"
          style={{ minHeight: '56px' }}
        >
          <div className="flex items-center gap-3 text-left">
            <div className="w-10 h-10 rounded-xl bg-input border border-border-strong/60 flex items-center justify-center text-accent-text">
              <Star className="w-5 h-5 fill-accent-text" />
            </div>
            <div>
              <div className="text-sm font-bold text-heading group-hover:text-accent-text transition-colors">
                Google Reviews
              </div>
              <div className="text-[11px] text-text-muted">
                5.0 Stars &bull; {BRAND_CONFIG.reviewCount}+ Verified Customer Reviews
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1 text-xs font-bold text-accent-text">
            <span>5.0 ★</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </motion.button>
      </div>

      {/* Feature Badges for high trust & quick conversion */}
      <div className="flex justify-center py-3 px-1 my-1 border-t border-border text-center">
        <div className="p-2 rounded-xl bg-input/60 border border-border w-32 shadow-elevated">
          <ShieldCheck className="w-4 h-4 text-accent-text mx-auto mb-1" />
          <div className="text-[10px] font-bold text-heading">Licensed & Insured</div>
          <div className="text-[9px] text-text-muted">5-Star Quality</div>
        </div>
      </div>

      {/* 8. "Visit Full Website" text link at the bottom, styled less prominently than the buttons above */}
      <div className="mt-2 pt-2 border-t border-border text-center space-y-2">
        <button
          id="visit-full-website-link"
          onClick={handleVisitWebsite}
          className="inline-flex items-center gap-1.5 text-xs text-text-muted hover:text-accent-text underline underline-offset-4 transition-colors cursor-pointer"
        >
          <span>Visit Full Website</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </button>

        <footer className="text-[10px] text-text-faint space-y-0.5">
          <p className="font-mono">premiermobiletexas.com/card</p>
          <p>&copy; {new Date().getFullYear()} Premier Mobile Auto Detail &bull; Texas</p>
        </footer>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-surface flex flex-col items-center">
      {/* Desktop Responsive Bar / Device Mode Controller */}
      {import.meta.env.DEV && <div className="hidden lg:flex w-full items-center justify-between px-6 py-3 bg-surface-alt border-b border-border text-xs text-text-secondary">
        <div className="flex items-center gap-3">
          <span className="font-bold text-accent-text tracking-wider uppercase font-serif">
            Premier Mobile QR Hub
          </span>
          <span className="px-2 py-0.5 rounded-full bg-accent/10 text-accent-text text-[11px] border border-accent/20 font-mono">
            /card
          </span>
        </div>

        {/* View mode toggle */}
        <div className="flex items-center gap-2 bg-input p-1 rounded-xl border border-border">
          <button
            onClick={() => setViewMode('mobile-frame')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              viewMode === 'mobile-frame'
                ? 'bg-accent text-accent-contrast font-bold shadow-md'
                : 'text-text-muted hover:text-heading'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Mobile Device View (iPhone/Android)</span>
          </button>

          <button
            onClick={() => setViewMode('fluid')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              viewMode === 'fluid'
                ? 'bg-accent text-accent-contrast font-bold shadow-md'
                : 'text-text-muted hover:text-heading'
            }`}
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span>Fluid Viewport</span>
          </button>
        </div>

        <div className="text-[11px] text-text-muted">
          Fast QR Landing Page &bull; (210) 580-6738
        </div>
      </div>

      }
      {/* Main Presentation Area */}
      <main className="w-full flex-1 flex flex-col items-center justify-center p-0 lg:p-6">
        {viewMode === 'mobile-frame' ? (
          <div className="w-full flex flex-col items-center">
            {/* Phone Frame wrapper for desktop, seamless on mobile */}
            <div className="w-full max-w-[420px] lg:my-4 lg:rounded-[44px] lg:border-[8px] lg:border-border lg:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] lg:overflow-hidden bg-surface relative">
              {/* Phone Speaker & Dynamic Island simulation on desktop */}
              <div className="hidden lg:flex justify-center pt-3 pb-1 bg-surface">
                <div className="w-24 h-4 bg-black rounded-full border border-border/80" />
              </div>

              {CardContent}
            </div>
          </div>
        ) : (
          <div className="w-full max-w-xl py-6 px-4">
            <div className="rounded-3xl border border-border bg-surface overflow-hidden shadow-2xl">
              {CardContent}
            </div>
          </div>
        )}
      </main>

      {/* Interactive Modals */}
      <BookNowModal
        isOpen={isBookModalOpen}
        onClose={() => setIsBookModalOpen(false)}
        preSelectedServiceId={selectedServiceForBooking}
        onTrackAction={trackAction}
      />

      <ServiceModal
        isOpen={isServiceModalOpen}
        onClose={() => setIsServiceModalOpen(false)}
        onSelectBookService={(serviceId) => handleOpenBooking(serviceId)}
      />

      <ContactActionSheet
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        onTrackAction={trackAction}
      />

      <ReviewsModal
        isOpen={isReviewsModalOpen}
        onClose={() => setIsReviewsModalOpen(false)}
        onTrackAction={trackAction}
      />

      <SaveContactModal
        isOpen={isSaveContactModalOpen}
        onClose={() => setIsSaveContactModalOpen(false)}
        onTrackAction={trackAction}
      />
    </div>
  );
}
