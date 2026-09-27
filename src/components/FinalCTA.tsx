import React from 'react';
import { Phone, Calendar } from 'lucide-react';
import { motion } from 'motion/react';
import { Logo } from './Logo';
import heroVideo from '../assets/videos/6159374-hd_1920_1080_30fps.mp4';
import heroPoster from '../assets/videos/optimized/hero-poster.jpg';
import { LazyVideo } from './LazyVideo';

interface FinalCTAProps {
  onOpenBooking: () => void;
}

export const FinalCTA: React.FC<FinalCTAProps> = ({ onOpenBooking }) => {
  return (
    <section className="py-8 sm:py-10 lg:py-10 final-cta-surface border-t border-border-subtle relative overflow-hidden text-center">
      <LazyVideo
        background
        showPlaybackControl={false}
        poster={heroPoster}
        src={heroVideo}
        className="absolute inset-0 h-full w-full object-cover opacity-30 pointer-events-none"
      />
      <div className="absolute inset-0 bg-surface/80 pointer-events-none"></div>
      <div className="absolute inset-0 bg-hero-glow opacity-70 pointer-events-none"></div>
      
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5 sm:space-y-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="flex justify-center scale-90 -my-1"
        >
          <Logo variant="badge" />
        </motion.div>

        <h2 className="font-serif text-[clamp(2.5rem,10vw,3.75rem)] text-heading font-normal leading-tight">
          Ready when you are.
        </h2>

        <p className="text-text-secondary font-sans font-light text-base sm:text-lg max-w-xl mx-auto">
          Get your estimate in 60 seconds. Our team will follow up with pricing and availability — just a great-looking vehicle in a couple days.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-0">
          <button
            onClick={() => onOpenBooking()}
            className="w-full sm:w-auto bg-accent hover:bg-accent-hover text-accent-contrast font-sans text-xs uppercase tracking-widest px-8 py-4 font-bold transition-all shadow-xl rounded-xs cursor-pointer flex items-center justify-center gap-2"
          >
            <Calendar className="w-4 h-4" />
            <span>GET MY ESTIMATE</span>
          </button>

          <a
            href="tel:2105806738"
            className="w-full sm:w-auto border border-border-strong hover:border-accent bg-card text-heading font-sans text-xs uppercase tracking-widest px-8 py-4 font-medium transition-all rounded-xs flex items-center justify-center gap-2 shadow-elevated"
          >
            <Phone className="w-4 h-4 text-accent-text" />
            <span>BOOKINGS: (210) 580-6738</span>
          </a>
        </div>

        <div className="pt-3 text-[10px] uppercase tracking-[0.16em] sm:tracking-[0.3em] text-text-muted font-sans">
          SAN ANTONIO · NEW BRAUNFELS · BOERNE · AUSTIN · & SURROUNDING AREAS
        </div>
      </div>
    </section>
  );
};
