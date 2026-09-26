import React from 'react';
import { Calendar, Phone } from 'lucide-react';

interface StickyMobileBarProps {
  onOpenBooking: () => void;
}

export const StickyMobileBar: React.FC<StickyMobileBarProps> = ({ onOpenBooking }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-surface/95 backdrop-blur-md border-t border-border px-3 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] flex items-center gap-2 sm:gap-3">
      <a
        href="tel:2105806738"
        className="flex-1 border border-border-strong text-heading py-2.5 px-2 sm:px-3 text-[10px] sm:text-[11px] font-sans uppercase tracking-wide sm:tracking-wider font-medium flex items-center justify-center gap-1.5 rounded-xs whitespace-nowrap"
      >
        <Phone className="w-3.5 h-3.5 text-accent-text" />
        <span>Call (210) 580-6738</span>
      </a>

      <button
        onClick={onOpenBooking}
        className="flex-[1.35] sm:flex-[2] bg-accent text-accent-contrast py-2.5 px-2 sm:px-3 text-[10px] sm:text-[11px] font-sans uppercase tracking-wide sm:tracking-widest font-bold flex items-center justify-center gap-1.5 sm:gap-2 rounded-xs shadow-lg cursor-pointer whitespace-nowrap"
      >
        <Calendar className="w-3.5 h-3.5" />
        <span>Get Estimate</span>
      </button>
    </div>
  );
};
