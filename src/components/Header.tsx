import React, { useState, useEffect } from 'react';
import { Phone, Menu, X, Calendar, Mail } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Logo } from './Logo';
import { ThemeToggle } from './ThemeToggle';

interface HeaderProps {
  onOpenBooking: (packageId?: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenBooking }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const onEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMobileMenuOpen(false);
        document.querySelector<HTMLButtonElement>('[aria-controls="mobile-navigation"]')?.focus();
      }
    };
    document.addEventListener('keydown', onEscape);
    return () => document.removeEventListener('keydown', onEscape);
  }, [mobileMenuOpen]);

  const scrollToSection = (id: string) => {
    const waitForMobileMenu = mobileMenuOpen;
    setMobileMenuOpen(false);

    // Wait for the mobile drawer's height animation to finish before measuring
    // the destination; otherwise the page can incorrectly settle back at the hero.
    window.setTimeout(() => {
      const element = document.getElementById(id);
      if (!element) return;

      const headerHeight = document.querySelector('header')?.getBoundingClientRect().height ?? 72;
      const destination = element.getBoundingClientRect().top + window.scrollY - headerHeight - 12;
      window.scrollTo({
        top: Math.max(0, destination),
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
      });
    }, waitForMobileMenu ? 320 : 0);
  };

  return (
    <div className="sticky top-0 z-50 w-full shadow-2xl">

      <header
        className={`w-full transition-all duration-300 bg-surface/95 backdrop-blur-md border-b border-border ${
          isScrolled ? 'py-2.5 shadow-2xl' : 'py-3.5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Brand Logo */}
          <a href="#" className="flex items-center group text-left">
            <Logo variant="horizontal" />
          </a>

          {/* Desktop Nav */}
          <nav className="hidden xl:flex items-center gap-6 text-xs font-sans uppercase tracking-widest text-text-secondary">
            <a
              href="#packages"
              onClick={(e) => { e.preventDefault(); scrollToSection('packages'); }}
              className="hover:text-accent-text transition-colors cursor-pointer py-1"
            >
              Packages
            </a>
            <a
              href="#results"
              onClick={(e) => { e.preventDefault(); scrollToSection('results'); }}
              className="hover:text-accent-text transition-colors cursor-pointer py-1"
            >
              Results
            </a>
            <a
              href="#areas"
              onClick={(e) => { e.preventDefault(); scrollToSection('areas'); }}
              className="hover:text-accent-text transition-colors cursor-pointer py-1"
            >
              Areas
            </a>
            <a
              href="#faq"
              onClick={(e) => { e.preventDefault(); scrollToSection('faq'); }}
              className="hover:text-accent-text transition-colors cursor-pointer py-1"
            >
              FAQ
            </a>
          </nav>

          {/* Action Callouts */}
          <div className="hidden xl:flex items-center gap-4">
            <ThemeToggle />
            <div className="flex flex-col text-right">
              <a
                href="tel:2105806738"
                className="flex items-center justify-end gap-1.5 text-xs font-sans uppercase tracking-wider text-accent-text hover:text-heading transition-colors font-bold"
              >
                <Phone className="w-3 h-3 text-accent-text" />
                <span>Bookings: (210) 580-6738</span>
              </a>
              <a
                href="mailto:premier@premiermobiletexas.com"
                className="flex items-center justify-end gap-1 text-[10px] font-sans text-text-muted hover:text-accent-text transition-colors"
              >
                <Mail className="w-2.5 h-2.5 text-accent-text" />
                <span>premier@premiermobiletexas.com</span>
              </a>
            </div>

            <button
              onClick={() => onOpenBooking()}
              className="bg-accent hover:bg-accent-hover text-accent-contrast text-xs font-sans uppercase tracking-wider px-5 py-2.5 font-semibold transition-all shadow-md hover:shadow-lg cursor-pointer active:scale-95 flex items-center gap-2 rounded-sm"
            >
              <Calendar className="w-3.5 h-3.5" />
              Get An Estimate
            </button>
          </div>

          {/* Mobile menu trigger */}
          <div className="flex xl:hidden items-center gap-2 sm:gap-3">
            <ThemeToggle />
            <button
              onClick={() => onOpenBooking()}
              className="bg-accent text-accent-contrast text-[10px] sm:text-[11px] font-sans uppercase tracking-wider px-2.5 sm:px-3.5 py-2 font-medium rounded-sm whitespace-nowrap"
            >
              Estimate
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-text-secondary hover:text-heading"
              aria-label="Toggle menu"
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              id="mobile-navigation"
              className="xl:hidden max-h-[calc(100dvh-5rem)] overflow-y-auto overscroll-contain bg-surface/98 border-b border-border px-4 sm:px-6 py-5 sm:py-6 space-y-4"
            >
              <div className="flex flex-col space-y-4 text-sm font-sans uppercase tracking-widest text-text-secondary">
                <a
                  href="#packages"
                  onClick={(e) => { e.preventDefault(); scrollToSection('packages'); }}
                  className="text-left py-2 hover:text-accent-text border-b border-border-subtle block"
                >
                  Packages
                </a>
                <a
                  href="#results"
                  onClick={(e) => { e.preventDefault(); scrollToSection('results'); }}
                  className="text-left py-2 hover:text-accent-text border-b border-border-subtle block"
                >
                  Results
                </a>
                <a
                  href="#areas"
                  onClick={(e) => { e.preventDefault(); scrollToSection('areas'); }}
                  className="text-left py-2 hover:text-accent-text border-b border-border-subtle block"
                >
                  Service Areas
                </a>
                <a
                  href="#faq"
                  onClick={(e) => { e.preventDefault(); scrollToSection('faq'); }}
                  className="text-left py-2 hover:text-accent-text border-b border-border-subtle block"
                >
                  FAQ & Guarantees
                </a>
              </div>

              <div className="pt-4 flex flex-col gap-2.5">
                <a
                  href="tel:2105806738"
                  className="flex items-center justify-center gap-2 border border-accent/40 text-accent-text py-2.5 text-xs font-bold uppercase tracking-widest rounded-sm bg-card"
                >
                  <Phone className="w-4 h-4 text-accent-text" />
                  Bookings: (210) 580-6738
                </a>
                <a
                  href="mailto:premier@premiermobiletexas.com"
                  className="flex items-center justify-center gap-2 border border-border text-text-secondary py-2 text-[11px] rounded-sm hover:text-accent-text transition-colors"
                >
                  <Mail className="w-3.5 h-3.5 text-accent-text" />
                  premier@premiermobiletexas.com
                </a>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenBooking();
                  }}
                  className="bg-accent text-accent-contrast font-bold py-3 text-xs uppercase tracking-widest rounded-sm mt-1"
                >
                  Get An Estimate
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </div>
  );
};
