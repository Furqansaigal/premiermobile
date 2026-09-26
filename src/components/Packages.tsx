import React from 'react';
import { motion } from 'motion/react';
import { PACKAGES_DATA } from '../data/content';
import { Check, Sparkles } from 'lucide-react';

interface PackagesProps {
  onSelectPackage: (packageId: string) => void;
}

export const Packages: React.FC<PackagesProps> = ({ onSelectPackage }) => {
  return (
    <section id="packages" className="py-16 sm:py-20 lg:py-24 bg-surface-alt border-t border-border-subtle relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14 lg:mb-16 space-y-4">
          <span className="text-[11px] font-sans uppercase tracking-[0.25em] text-accent-text font-semibold block">
            PACKAGES
          </span>
          <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-heading font-normal">
            Simple, honest pricing.
          </h2>
          <p className="text-text-muted font-sans font-light text-sm sm:text-base">
            Prices start at these figures. Larger vehicles and heavy-condition cars quoted on the spot.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch justify-center">
          {PACKAGES_DATA.map((pkg, idx) => {
            const isFeatured = pkg.isMostBooked;
            return (
              <motion.div
                key={pkg.id}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className={`relative bg-card border shadow-elevated flex flex-col justify-between p-8 rounded-xs text-left cursor-pointer transition-[transform,border-color,box-shadow] duration-300 ease-out hover:-translate-y-1.5 ${
                  isFeatured
                    ? 'border-accent shadow-[0_0_30px_rgba(216,195,165,0.15)] ring-1 ring-accent/50 z-10'
                    : 'border-border hover:border-border-strong'
                }`}
              >
                {/* Badge / Pill */}
                {pkg.badge && (
                  <div className={`absolute -top-3.5 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-[0.2em] font-sans font-bold px-4 py-1 rounded-full shadow-lg flex items-center gap-1.5 ${
                    isFeatured
                      ? 'bg-accent text-accent-contrast'
                      : 'bg-input text-accent-text border border-accent/30'
                  }`}>
                    {isFeatured && <Sparkles className="w-3 h-3 fill-current" />}
                    <span>{pkg.badge}</span>
                  </div>
                )}

                <div>
                  {/* Category */}
                  <div className="text-[10px] font-sans uppercase tracking-[0.25em] text-text-muted font-semibold mb-2">
                    {pkg.category}
                  </div>

                  {/* Name */}
                  <h3 className="font-serif text-3xl text-heading font-normal mb-1">
                    {pkg.name}
                  </h3>

                  {/* Subtitle */}
                  <p className="text-xs text-text-muted font-sans mb-6">
                    {pkg.subtitle}
                  </p>

                  {/* Price */}
                  <div className="flex flex-col gap-1 mb-8 border-b border-border-subtle pb-6">
                    <div className="flex items-baseline justify-between gap-2">
                      <div className="flex items-baseline gap-2">
                        <span className="font-serif text-3xl sm:text-4xl text-heading font-normal">
                          ${pkg.price}
                        </span>
                        {pkg.originalPrice && (
                          <span className="text-sm font-sans line-through text-text-faint font-medium">
                            ${pkg.originalPrice}
                          </span>
                        )}
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-[10px] font-sans uppercase tracking-widest text-text-faint block">
                          EST. TIME
                        </span>
                        <span className="text-[11px] font-sans text-accent-text font-medium block">
                          {pkg.duration}
                        </span>
                      </div>
                    </div>
                    <span className="text-[11px] font-sans text-text-muted">
                      Starting price (varies by vehicle size/condition)
                    </span>
                    {pkg.id === 'refresh' && (
                      <div className="mt-3 grid grid-cols-3 gap-2">
                        <div className="bg-accent/10 border border-accent/25 px-2 py-2 text-center rounded-xs">
                          <span className="text-[9px] uppercase tracking-widest text-text-faint block">Sedan</span>
                          <span className="text-sm font-serif text-accent-text">$129</span>
                        </div>
                        <div className="bg-accent/10 border border-accent/25 px-2 py-2 text-center rounded-xs">
                          <span className="text-[9px] uppercase tracking-widest text-text-faint block">SUV</span>
                          <span className="text-sm font-serif text-accent-text">$139</span>
                        </div>
                        <div className="bg-accent/10 border border-accent/25 px-2 py-2 text-center rounded-xs">
                          <span className="text-[9px] uppercase tracking-widest text-text-faint block">Trucks</span>
                          <span className="text-sm font-serif text-accent-text">$149</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Features List */}
                  <ul className="space-y-3.5 mb-8">
                    {pkg.features.map((feature, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-3 text-xs text-text-secondary font-sans">
                        <Check className="w-4 h-4 text-accent-text shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Button */}
                <button
                  onClick={() => onSelectPackage(pkg.id)}
                  className={`w-full py-3.5 text-xs font-sans uppercase tracking-widest font-bold transition-all rounded-xs cursor-pointer ${
                    isFeatured
                      ? 'bg-accent hover:bg-accent-hover text-accent-contrast shadow-lg'
                      : 'bg-transparent border border-border-strong hover:border-accent text-heading hover:text-accent-text'
                  }`}
                >
                  REQUEST AN ESTIMATE
                </button>
              </motion.div>
            );
          })}
        </div>

        {/* Footnote */}
        <p className="text-center text-xs text-text-muted font-sans mt-12">
          Not sure which tier fits your vehicle?{' '}
          <a href="sms:2105806738" className="text-accent-text underline underline-offset-4 hover:text-heading transition-colors">
            Text us photos at (210) 580-6738
          </a>{' '}
          and we'll give you a quick honest estimate.
        </p>

      </div>
    </section>
  );
};
