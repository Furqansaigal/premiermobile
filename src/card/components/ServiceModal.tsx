import { useDialog } from '../../hooks/useDialog';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Check, ArrowRight, Sparkles, Clock, ShieldCheck, ChevronDown, ChevronUp } from 'lucide-react';
import { SERVICES, BRAND_CONFIG } from '../data/config';
import { ServicePackage } from '../types';

interface ServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectBookService: (serviceId: string) => void;
}

export const ServiceModal: React.FC<ServiceModalProps> = ({
  isOpen,
  onClose,
  onSelectBookService,
}) => {
  const [selectedVehicleType, setSelectedVehicleType] = useState<'sedan' | 'midSuv' | 'truckThirdRow' | 'exotic'>('midSuv');
  const [expandedServiceId, setExpandedServiceId] = useState<string>('full-detail');

  const dialogRef = useDialog(isOpen, onClose);
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center p-0 sm:p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Container */}
        <motion.div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label="Services and pricing"
          tabIndex={-1}
          initial={{ y: '100%', opacity: 0.5 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 280 }}
          className="relative w-full max-w-lg bg-card border border-border rounded-t-3xl sm:rounded-3xl p-5 sm:p-6 shadow-2xl shadow-elevated-lg text-heading z-10 max-h-[90dvh] flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border pb-4 mb-3">
            <div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-accent-text" />
                <h3 className="text-lg font-bold tracking-tight text-heading">Services & Transparent Pricing</h3>
              </div>
              <p className="text-xs text-text-muted mt-0.5">Mobile detailing at your home or office</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full text-text-muted hover:text-heading hover:bg-input transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Vehicle Selector Tabs */}
          <div className="mb-4">
            <label className="text-[11px] font-semibold text-text-muted uppercase tracking-wider block mb-1.5">
              Select Vehicle Size for Exact Pricing:
            </label>
            <div className="grid grid-cols-2 gap-1.5 p-1 bg-input/90 border border-border rounded-2xl">
              {[
                { id: 'sedan', label: 'Sedan / Coupe' },
                { id: 'midSuv', label: 'Mid SUV / Crossover' },
                { id: 'truckThirdRow', label: 'Truck / 3-Row SUV' },
                { id: 'exotic', label: 'Exotic / Sports' },
              ].map((v) => (
                <button
                  key={v.id}
                  onClick={() => setSelectedVehicleType(v.id as any)}
                  aria-pressed={selectedVehicleType === v.id}
                  className={`py-2 px-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    selectedVehicleType === v.id
                      ? 'bg-accent text-accent-contrast font-bold shadow-md shadow-accent/20'
                      : 'text-text-muted hover:text-heading hover:bg-card/50'
                  }`}
                >
                  {v.label}
                </button>
              ))}
            </div>
          </div>

          {/* Services List Scrollable */}
          <div className="space-y-3 overflow-y-auto pr-1 flex-1 pb-4">
            {SERVICES.map((service) => {
              const isExpanded = expandedServiceId === service.id;
              const price = service.vehiclePricing[selectedVehicleType];

              return (
                <div
                  key={service.id}
                  className={`rounded-2xl border transition-all overflow-hidden ${
                    service.popular
                      ? 'bg-gradient-to-b from-input to-card border-accent/40 ring-1 ring-accent/20'
                      : 'bg-input/70 border-border hover:border-border-strong'
                  }`}
                >
                  {/* Card Header */}
                  <div
                    role="button"
                    tabIndex={0}
                    aria-expanded={isExpanded}
                    aria-controls={`service-details-${service.id}`}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        setExpandedServiceId(isExpanded ? '' : service.id);
                      }
                    }}
                    onClick={() => setExpandedServiceId(isExpanded ? '' : service.id)}
                    className="p-4 cursor-pointer flex items-start justify-between gap-3"
                  >
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        {service.badge && (
                          <span className="px-2 py-0.5 rounded-full bg-accent/20 text-accent-text text-[10px] font-bold tracking-wider uppercase border border-accent/30">
                            {service.badge}
                          </span>
                        )}
                        <span className="text-xs text-text-muted flex items-center gap-1">
                          <Clock className="w-3 h-3 text-text-faint" /> {service.duration}
                        </span>
                      </div>
                      <h4 className="text-base font-bold text-heading tracking-tight">{service.name}</h4>
                      <p className="text-xs text-text-secondary line-clamp-2">{service.shortDesc}</p>
                    </div>

                    <div className="text-right flex flex-col items-end justify-between self-stretch">
                      <div className="text-lg font-extrabold text-accent-text">{price === 0 ? 'Contact for quote' : `$${price}`}</div>
                      <div className="text-text-muted mt-2">
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </div>
                    </div>
                  </div>

                  {/* Expanded Features & Action */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        id={`service-details-${service.id}`}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="px-4 pb-4 pt-1 border-t border-border bg-black/[0.03]"
                      >
                        <p className="text-[11px] font-bold tracking-wider text-text-muted uppercase mb-2">
                          What is included:
                        </p>
                        <ul className="space-y-2 mb-4">
                          {service.features.map((feat, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-xs text-text">
                              <Check className="w-3.5 h-3.5 text-accent-text shrink-0 mt-0.5" />
                              <span>{feat}</span>
                            </li>
                          ))}
                        </ul>

                        <button
                          onClick={() => {
                            onSelectBookService(service.id);
                            onClose();
                          }}
                          className="w-full py-2.5 px-4 bg-accent hover:bg-accent-hover active:scale-[0.98] text-accent-contrast font-bold text-xs uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-accent/20"
                        >
                          <span>{price === 0 ? `Contact for ${service.name} Quote` : `Book ${service.name} ($${price})`}</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

          {/* Footer Note */}
          <div className="pt-3 border-t border-border text-center text-xs text-text-muted flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-accent-text" />
            <span>Licensed, Insured &bull; 100% Satisfaction Guarantee</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
