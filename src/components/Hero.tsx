import React, { useState } from 'react';
import { Phone, Star, ShieldCheck, ArrowRight, CheckCircle2, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import { BookingFormData } from '../types';
import { sendWeb3FormsNotification } from '../lib/web3forms';
import { useTheme } from '../context/ThemeContext';
import heroVideo from '../assets/videos/6159374-hd_1920_1080_30fps.mp4';

interface HeroProps {
  onFormSubmit: (data: BookingFormData) => void;
  onOpenBooking: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onFormSubmit, onOpenBooking }) => {
  const { theme } = useTheme();
  const [formData, setFormData] = useState<BookingFormData>({
    name: '',
    phone: '',
    vehicleYearMakeModel: '',
    serviceId: 'prestige',
    locationMetro: 'san-antonio',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      alert('Please enter your name and phone number to submit your request.');
      return;
    }
    setIsSubmitting(true);
    await sendWeb3FormsNotification(formData);
    setIsSubmitting(false);
    setSubmitted(true);
    onFormSubmit(formData);
    setTimeout(() => {
      setSubmitted(false);
    }, 4000);
  };

  return (
    <section className="relative min-h-[calc(100svh-4rem)] py-16 sm:py-20 lg:py-24 overflow-hidden bg-hero-glow flex items-center">
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        src={heroVideo}
        className={
          theme === 'light'
            ? 'absolute inset-0 w-full h-full object-cover z-0 opacity-25 filter grayscale-[15%] brightness-110 contrast-95 pointer-events-none'
            : 'absolute inset-0 w-full h-full object-cover z-0 opacity-60 mix-blend-luminosity filter brightness-105 contrast-105 pointer-events-none'
        }
      />
      <div className="absolute inset-0 bg-gradient-to-r from-surface via-surface/85 to-surface/40 z-0 pointer-events-none"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-surface via-transparent to-surface z-0 pointer-events-none"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 xl:gap-12 items-center">
          
          {/* Left Hero Brand Intro */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-7 space-y-6 sm:space-y-8 text-left"
          >
            {/* Tagline */}
            <div className="flex items-center gap-3">
              <span className="w-8 h-[1px] bg-accent/60 shrink-0"></span>
              <span className="text-[9px] sm:text-[11px] uppercase tracking-[0.18em] sm:tracking-[0.25em] text-accent-text font-sans font-medium leading-relaxed">
                EST. 2024 · SAN ANTONIO · NEW BRAUNFELS · BOERNE · AUSTIN
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="font-serif text-[clamp(2.55rem,11vw,4.5rem)] font-normal tracking-tight text-heading leading-[1.05]">
              The last mobile detailer <br className="hidden sm:inline" />
              you'll ever <em className="italic font-serif font-light text-accent-hover">need.</em>
            </h1>
            {theme === 'light' && (
              <div className="w-20 h-[3px] rounded-full bg-gradient-to-r from-accent-vivid to-accent/20 -mt-4" />
            )}

            {/* Subtext */}
            <p className="text-text-secondary text-base sm:text-lg max-w-2xl font-sans font-light leading-relaxed">
              Mobile auto detailing for luxury vehicles and commercial fleets across Central Texas. We connect on-site for water & power, focusing on premium workmanship, convenience, and unmatched attention to detail.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <button
                onClick={() => onOpenBooking()}
                className="bg-accent hover:bg-accent-hover text-accent-contrast font-sans text-xs uppercase tracking-widest px-8 py-4 font-semibold transition-all duration-200 shadow-xl flex items-center justify-center gap-3 cursor-pointer group rounded-sm"
              >
                <span>GET MY ESTIMATE</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <a
                href="tel:2105806738"
                className="border border-border hover:border-accent/50 bg-card/80 hover:bg-card text-heading font-sans text-xs uppercase tracking-widest px-6 py-4 font-medium transition-all duration-200 flex items-center justify-center gap-2 rounded-sm shadow-elevated"
              >
                <Phone className="w-4 h-4 text-accent-text" />
                <span>BOOKINGS: (210) 580-6738</span>
              </a>
            </div>

            {/* Social Proof Bar */}
            <div className="pt-1 -mt-3 flex items-center gap-4 border-t border-border-subtle">
              <div className="text-left">
                <div className="flex items-center gap-1 text-accent-text text-xs">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <Star className="w-3.5 h-3.5 fill-current" />
                </div>
                <p className="text-xs text-text-muted font-sans mt-0.5">
                  Trusted by <strong className="text-heading font-medium">San Antonio-area</strong> drivers
                </p>
              </div>
            </div>
          </motion.div>

          {/* Right Estimate Request Form */}
          <motion.div 
            initial={{ opacity: 0, x: 48 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-5 w-full max-w-xl mx-auto lg:ml-auto"
          >
            <div className="bg-card/95 backdrop-blur-md border border-border p-5 sm:p-8 rounded-sm shadow-2xl shadow-elevated-lg relative overflow-hidden text-left">
              <div className="absolute top-0 right-0 px-3 py-1 bg-accent/10 border-b border-l border-accent/20 text-[10px] uppercase tracking-widest text-accent-text font-sans font-semibold">
                ESTIMATED PRICING
              </div>

              <div className="mb-6">
                <h3 className="font-serif text-2xl text-heading font-normal mb-1">
                  Request your estimate
                </h3>
                <p className="text-xs text-text-muted font-sans">
                  Takes 60 seconds. We'll follow up with your estimate and next steps.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-text-muted mb-1 font-sans">
                    NAME
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Jamie Reeves"
                    className="w-full bg-input border border-border-strong text-heading px-3.5 py-2.5 text-sm focus:outline-none focus:border-accent transition-colors rounded-xs"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-text-muted mb-1 font-sans">
                    PHONE
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="(210) 580-6738"
                    className="w-full bg-input border border-border-strong text-heading px-3.5 py-2.5 text-sm focus:outline-none focus:border-accent transition-colors rounded-xs"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-text-muted mb-1 font-sans">
                    VEHICLE
                  </label>
                  <input
                    type="text"
                    value={formData.vehicleYearMakeModel}
                    onChange={(e) => setFormData({ ...formData, vehicleYearMakeModel: e.target.value })}
                    placeholder="2022 Ford F-150"
                    className="w-full bg-input border border-border-strong text-heading px-3.5 py-2.5 text-sm focus:outline-none focus:border-accent transition-colors rounded-xs"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-text-muted mb-1 font-sans">
                      SERVICE
                    </label>
                    <select
                      value={formData.serviceId}
                      onChange={(e) => setFormData({ ...formData, serviceId: e.target.value })}
                      className="w-full bg-input border border-border-strong text-text px-3 py-2.5 text-xs focus:outline-none focus:border-accent transition-colors rounded-xs"
                    >
                      <option value="refresh">The Refresh ($130+)</option>
                      <option value="prestige">The Prestige ($249+)</option>
                      <option value="concours">The Concours ($699+)</option>
                      <option value="commercial-fleet-services">Commercial Fleet Services (Custom Quote)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-text-muted mb-1 font-sans">
                      LOCATION
                    </label>
                    <select
                      value={formData.locationMetro}
                      onChange={(e) => setFormData({ ...formData, locationMetro: e.target.value })}
                      className="w-full bg-input border border-border-strong text-text px-3 py-2.5 text-xs focus:outline-none focus:border-accent transition-colors rounded-xs"
                    >
                      <option value="san-antonio">San Antonio Metro</option>
                      <option value="new-braunfels">New Braunfels Metro</option>
                      <option value="boerne">Boerne & Hill Country</option>
                      <option value="austin">Austin Metro & Surrounding</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitted || isSubmitting}
                  className="w-full bg-accent hover:bg-accent-hover text-accent-contrast font-sans text-xs uppercase tracking-widest py-3.5 font-bold transition-all mt-2 cursor-pointer rounded-xs flex items-center justify-center gap-2 disabled:opacity-80"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-accent-contrast" />
                      <span>SENDING REQUEST...</span>
                    </>
                  ) : submitted ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-800" />
                      <span>REQUEST SENT!</span>
                    </>
                  ) : (
                    <>
                      <span>SEND MY REQUEST →</span>
                    </>
                  )}
                </button>

                <p className="text-[11px] text-text-faint font-sans text-center pt-1">
                  By submitting you agree to receive a text quote. No spam, ever.
                </p>
              </form>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
