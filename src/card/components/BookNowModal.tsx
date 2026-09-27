import { useDialog } from '../../hooks/useDialog';
import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Calendar, CheckCircle2, ShieldCheck, Sparkles, Clock, ArrowRight, ExternalLink, Car } from 'lucide-react';
import { BRAND_CONFIG, SERVICES } from '../data/config';
import { ServicePackage } from '../types';
import { sendWeb3FormsNotification } from '../../lib/web3forms';

interface BookNowModalProps {
  isOpen: boolean;
  onClose: () => void;
  preSelectedServiceId?: string;
  onTrackAction?: (action: string) => void;
}

export const BookNowModal: React.FC<BookNowModalProps> = ({
  isOpen,
  onClose,
  preSelectedServiceId,
  onTrackAction,
}) => {
  const [selectedService, setSelectedService] = useState<string>(preSelectedServiceId || 'refresh');
  const [vehicleType, setVehicleType] = useState<'sedan' | 'midSuv' | 'truckThirdRow' | 'exotic'>('midSuv');
  const [step, setStep] = useState<'select' | 'confirm'>('select');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerZip, setCustomerZip] = useState('');
  const [preferredDay, setPreferredDay] = useState('As soon as available');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const submitting = useRef(false);

  useEffect(() => {
    if (isOpen) {
      setSelectedService(preSelectedServiceId || 'refresh');
      setIsSubmitted(false);
      setSubmitError('');
    }
  }, [isOpen, preSelectedServiceId]);

  const vehicleLabels: Record<typeof vehicleType, string> = {
    sedan: 'Sedan / Coupe',
    midSuv: 'Mid SUV / Crossover',
    truckThirdRow: 'Truck / 3-Row SUV',
    exotic: 'Exotic / Sports Car',
  };

  const activePkg = SERVICES.find((s) => s.id === selectedService) || SERVICES[0];
  const calculatedPrice = activePkg.vehiclePricing[vehicleType];

  const handleBookRedirect = () => {
    if (onTrackAction) onTrackAction('redirect_to_calendar_booking');
    const [base, hash] = BRAND_CONFIG.bookingUrl.split('#');
    const separator = base.includes('?') ? '&' : '?';
    const finalUrl = `${base}${separator}service=${activePkg.id}&vehicle=${vehicleType}${hash ? `#${hash}` : ''}`;
    window.location.href = finalUrl;
    onClose();
  };

  const handleQuickRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting.current) return;
    if (!customerName.trim() || customerPhone.replace(/\D/g, '').length < 7) {
      setSubmitError('Please enter your name and a valid phone number.');
      return;
    }
    submitting.current = true;

    if (onTrackAction) onTrackAction('submitted_fast_booking_request');
    setIsSubmitting(true);
    setSubmitError('');

    // Send directly to both business inboxes, same as the main site's booking form
    const didSend = await sendWeb3FormsNotification({
      name: customerName || 'Not provided',
      phone: customerPhone,
      packageId: activePkg.id,
      packageName: `${activePkg.name} (via QR Business Card)`,
      vehicleType: vehicleLabels[vehicleType],
      estimatedPrice: calculatedPrice,
      preferredTime: preferredDay,
      address: customerZip,
      notes: 'Submitted via /card Quick Request form',
    });

    submitting.current = false;
    setIsSubmitting(false);
    if (!didSend) {
      setSubmitError('We could not send your request. Please try again or text us directly.');
      return;
    }

    setIsSubmitted(true);

  };

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

        {/* Content Card */}
        <motion.div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label="Request a booking"
          tabIndex={-1}
          initial={{ y: '100%', opacity: 0.5 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 280 }}
          className="relative w-full max-w-lg bg-card border border-border rounded-t-3xl sm:rounded-3xl p-5 sm:p-6 shadow-2xl shadow-elevated-lg text-heading z-10 max-h-[92dvh] overflow-y-auto overscroll-contain"
        >
          {/* Header */}
            <div className="flex items-start justify-between gap-3 border-b border-border pb-4 mb-4">
              <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-accent/10 border border-accent/30 flex items-center justify-center text-accent-text">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold tracking-tight text-heading">Book Mobile Detailing</h3>
                <p className="text-xs text-text-muted">Fast, convenient service at your location</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 shrink-0 rounded-full text-text-muted hover:text-heading hover:bg-input transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {!isSubmitted ? (
            <div className="space-y-4">
              {/* Direct Booking Fast CTA */}
              <div className="bg-gradient-to-r from-accent/15 via-accent/10 to-transparent border border-accent/30 rounded-2xl p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-accent/20 text-accent-text text-[11px] font-semibold mb-1">
                      <Sparkles className="w-3 h-3" /> Live Booking Schedule
                    </div>
                    <h4 className="text-sm font-semibold text-heading">Pick Your Date & Time Online</h4>
                    <p className="text-xs text-text-secondary mt-0.5">
                      View real-time availability and lock in your appointment.
                    </p>
                  </div>
                </div>
                <button
                  id="direct-calendar-book-btn"
                  onClick={handleBookRedirect}
                  className="mt-3 w-full py-3 px-4 bg-accent hover:bg-accent-hover text-accent-contrast font-extrabold text-sm rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-accent/20 active:scale-[0.98] transition-all cursor-pointer"
                >
                  <span>Open Live Booking Form</span>
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>

              <div className="relative flex items-center justify-center my-3">
                <div className="border-t border-border w-full" />
                <span className="bg-card px-3 text-[11px] font-medium text-text-muted uppercase tracking-wider">
                  OR Quick Request Below
                </span>
                <div className="border-t border-border w-full" />
              </div>

              {/* Step 1: Select Service */}
              <div>
                <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider block mb-2">
                  1. Select Detailing Service
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {SERVICES.map((pkg) => {
                    const isSelected = selectedService === pkg.id;
                    return (
                      <button
                        key={pkg.id}
                        type="button"
                        aria-pressed={isSelected}
                        onClick={() => setSelectedService(pkg.id)}
                        className={`text-left p-3 rounded-xl border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-input border-accent/80 ring-1 ring-accent/50'
                            : 'bg-input/60 border-border hover:border-border-strong'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-heading line-clamp-1">{pkg.name}</span>
                          <span className="text-xs font-semibold text-accent-text">
                            ${pkg.vehiclePricing[vehicleType]}
                          </span>
                        </div>
                        <span className="text-[11px] text-text-muted mt-1 block">
                          ⏱ {pkg.duration}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 2: Vehicle Size */}
              <div>
                <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider block mb-2">
                  2. Vehicle Type
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'sedan', label: 'Sedan / Coupe' },
                    { id: 'midSuv', label: 'Mid SUV / Crossover' },
                    { id: 'truckThirdRow', label: 'Truck / 3-Row SUV' },
                    { id: 'exotic', label: 'Exotic / Sports Car' },
                  ].map((v) => (
                    <button
                      key={v.id}
                      type="button"
                      aria-pressed={vehicleType === v.id}
                      onClick={() => setVehicleType(v.id as any)}
                      className={`p-2.5 rounded-xl border text-center text-xs font-medium transition-all cursor-pointer ${
                        vehicleType === v.id
                          ? 'bg-accent/15 border-accent text-accent-text font-semibold'
                          : 'bg-input/60 border-border text-text-secondary hover:border-border-strong'
                      }`}
                    >
                      {v.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Fast Form */}
              <form onSubmit={handleQuickRequestSubmit} className="space-y-3 pt-2">
                <div>
                  <label htmlFor="booknowmodal-field-1" className="text-xs text-text-secondary block mb-1">Your Name</label>
                  <input id="booknowmodal-field-1"
                    autoComplete="name"
                    type="text"
                    required
                    placeholder="e.g. Michael Smith"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-input border border-border-strong/80 rounded-xl text-sm text-heading placeholder-text-faint focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label htmlFor="booknowmodal-field-2" className="text-xs text-text-secondary block mb-1">Phone Number</label>
                    <input id="booknowmodal-field-2"
                      autoComplete="tel"
                      minLength={7}
                      maxLength={30}
                      type="tel"
                      required
                      placeholder="(210) 000-0000"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-input border border-border-strong/80 rounded-xl text-sm text-heading placeholder-text-faint focus:outline-none focus:border-accent"
                    />
                  </div>
                  <div>
                    <label htmlFor="booknowmodal-field-3" className="text-xs text-text-secondary block mb-1">City / Zip Code</label>
                    <input id="booknowmodal-field-3"
                      type="text"
                      placeholder="e.g. San Antonio / 78209"
                      value={customerZip}
                      onChange={(e) => setCustomerZip(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-input border border-border-strong/80 rounded-xl text-sm text-heading placeholder-text-faint focus:outline-none focus:border-accent"
                    />
                  </div>
                </div>

                {/* Price Summary */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-input/90 border border-border text-xs">
                  <span className="text-text-secondary">Estimated Total:</span>
                  <span className="text-base font-bold text-accent-text">${calculatedPrice}</span>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 px-4 bg-heading text-surface font-bold text-sm rounded-xl flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer"
                >
                  <span>{isSubmitting ? 'Sending Request…' : 'Send Booking Request'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                {submitError && <p role="alert" className="text-xs text-amber-400">{submitError}</p>}
              </form>

              <div className="flex items-center justify-center gap-4 text-[11px] text-text-muted pt-1">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-accent-text" /> 100% Satisfaction Guarantee
                </span>
              </div>
            </div>
          ) : (
            <div className="py-8 text-center space-y-4">
              <div className="w-14 h-14 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center text-emerald-400 mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-bold text-heading">Booking Request Sent!</h4>
              <p className="text-sm text-text-secondary max-w-sm mx-auto">
                Your request has been received by our team. We'll follow up shortly. You can also text us directly below.
              </p>
              <a href={`sms:${BRAND_CONFIG.phoneRaw}?&body=${encodeURIComponent(`Hi Premier Mobile! I submitted a request for ${activePkg.name}. Name: ${customerName}`)}`} className="inline-flex items-center justify-center rounded-xl bg-accent px-6 py-3 text-sm font-semibold text-accent-contrast">Text us directly</a>
              <button
                onClick={onClose}
                className="mt-4 px-6 py-2.5 bg-input text-heading rounded-xl text-sm font-semibold hover:opacity-80"
              >
                Close Window
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
