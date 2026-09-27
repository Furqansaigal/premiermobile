import React, { useState } from 'react';
import { motion } from 'motion/react';
import { SERVICE_AREAS_DATA } from '../data/content';
import { MapPin, Search, CheckCircle2, AlertCircle } from 'lucide-react';

export const ServiceAreas: React.FC = () => {
  const [zipCodeInput, setZipCodeInput] = useState('');
  const [zipCheckResult, setZipCheckResult] = useState<{
    checked: boolean;
    inService: boolean;
    metroName?: string;
  }>({ checked: false, inService: false });

  const handleZipCheck = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanZip = zipCodeInput.trim();
    if (!cleanZip || cleanZip.length < 5) return;

    let foundMetro: string | undefined;
    for (const metro of SERVICE_AREAS_DATA) {
      if (metro.zipCodes.includes(cleanZip)) {
        foundMetro = metro.name;
        break;
      }
    }

    // Also check standard TX zip range starting with 780, 781, 782, 786, 787
    const isTexasZip = /^(780|781|782|786|787)\d{2}$/.test(cleanZip);

    if (foundMetro) {
      setZipCheckResult({ checked: true, inService: true, metroName: foundMetro });
    } else if (isTexasZip) {
      setZipCheckResult({ checked: true, inService: true, metroName: 'Greater Central Texas' });
    } else {
      setZipCheckResult({ checked: true, inService: false });
    }
  };

  return (
    <section id="areas" className="py-16 sm:py-20 lg:py-24 bg-surface border-t border-border-subtle">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl lg:max-w-6xl mx-auto mb-8 sm:mb-10 lg:mb-8 space-y-3">
          <span className="text-[11px] font-sans uppercase tracking-[0.25em] text-accent-text font-semibold block">
            SERVICE AREAS
          </span>
          <h2 className="font-serif text-4xl sm:text-5xl lg:text-5xl xl:text-6xl text-heading font-normal leading-tight">
            Mobile detailing across Central Texas.
          </h2>
        </div>

        {/* 3 Metros Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 sm:gap-6 lg:gap-6 mb-8 lg:mb-6 text-left">
          {SERVICE_AREAS_DATA.map((area, idx) => (
            <motion.div
              key={area.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              whileTap={{ scale: 0.975, y: 0, transition: { duration: 0.12 } }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.15 }}
              className="bg-card border border-border p-5 sm:p-6 rounded-xs hover:border-accent/40 transition-colors shadow-elevated cursor-pointer"
            >
              <div className="text-[10px] font-sans uppercase tracking-[0.25em] text-text-faint font-semibold mb-2">
                {area.subtitle}
              </div>
              <h3 className="font-serif text-2xl sm:text-3xl text-heading font-normal mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-accent-text" />
                <span>{area.name}</span>
              </h3>

              <ul className="space-y-2 border-t border-border-subtle pt-4">
                {area.neighborhoods.map((n, nIdx) => (
                  <li key={nIdx} className="text-xs text-text-secondary font-sans flex items-center gap-2">
                    <span className="text-accent-text text-[10px]">●</span>
                    <span>{n}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Zip Code Interactive Checker */}
        <div className="max-w-md mx-auto bg-card border border-border p-5 rounded-xs text-center space-y-3 shadow-elevated">
          <p className="text-xs text-text-secondary font-sans">
            Not sure if you're in range? Check your ZIP code:
          </p>

          <form onSubmit={handleZipCheck} className="flex flex-col min-[420px]:flex-row items-stretch min-[420px]:items-center gap-2">
            <input
              type="text"
              aria-label="ZIP code"
              inputMode="numeric"
              autoComplete="postal-code"
              pattern="[0-9]{5}"
              required
              maxLength={5}
              placeholder="78258"
              value={zipCodeInput}
              onChange={(e) => {
                setZipCodeInput(e.target.value);
                setZipCheckResult({ checked: false, inService: false });
              }}
              className="w-full min-[420px]:flex-1 bg-input border border-border-strong text-heading px-3.5 py-2 text-sm text-center focus:outline-none focus:border-accent rounded-xs font-mono"
            />
            <button
              type="submit"
              className="w-full min-[420px]:w-auto bg-accent hover:bg-accent-hover text-accent-contrast px-4 py-2.5 text-xs font-sans uppercase tracking-widest font-bold cursor-pointer transition-all rounded-xs flex items-center justify-center gap-1.5"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Check</span>
            </button>
          </form>

          {zipCheckResult.checked && (
            <div className="pt-2" role="status">
              {zipCheckResult.inService ? (
                <div className="flex items-center justify-center gap-2 text-emerald-400 text-xs font-sans">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Great news! We service <strong>{zipCheckResult.metroName}</strong>. Travel availability and any applicable fees will be confirmed before your appointment.</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2 text-amber-400 text-xs font-sans">
                  <AlertCircle className="w-4 h-4" />
                  <span>ZIP outside standard range. Text (210) 580-6738 for custom travel quote!</span>
                </div>
              )}
            </div>
          )}
        </div>

      </div>
    </section>
  );
};
