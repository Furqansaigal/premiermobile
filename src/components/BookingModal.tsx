import React, { useState, useEffect, useRef } from 'react';
import { useDialog } from '../hooks/useDialog';
import { motion, AnimatePresence } from 'motion/react';
import { X, CheckCircle2, Calendar, Clock, Car, Shield, Sparkles, Loader2 } from 'lucide-react';
import { BookingFormData } from '../types';
import { PACKAGES_DATA, SERVICES_DATA } from '../data/content';
import { sendWeb3FormsNotification } from '../lib/web3forms';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPackageId?: string;
  initialData?: BookingFormData;
  initialQuotePrice?: number;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  initialPackageId = 'prestige',
  initialData,
  initialQuotePrice,
}) => {
  const dialogRef = useDialog(isOpen, onClose);
  const submitting = useRef(false);
  const [selectedPackage, setSelectedPackage] = useState(initialPackageId);
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const [formData, setFormData] = useState<BookingFormData>({
    name: initialData?.name || '',
    phone: initialData?.phone || '',
    vehicleYearMakeModel: initialData?.vehicleYearMakeModel || '',
    serviceId: initialPackageId,
    locationMetro: initialData?.locationMetro || 'san-antonio',
    preferredDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
    preferredTime: '08:00 AM',
    notes: '',
  });

  useEffect(() => {
    if (initialPackageId) {
      setSelectedPackage(initialPackageId);
      setFormData((prev) => ({ ...prev, serviceId: initialPackageId }));
    }
  }, [initialPackageId]);

  useEffect(() => {
    if (initialData) {
      setFormData((prev) => ({
        ...prev,
        ...initialData,
      }));
    }
  }, [initialData]);

  useEffect(() => {
    if (isOpen) {
      setSelectedPackage(initialPackageId);
      setStep(1);
      setSubmitError('');
      setFormData((prev) => ({ ...prev, serviceId: initialPackageId, notes: initialData?.notes || '' }));
    }
  }, [isOpen]);

  const activePkg = PACKAGES_DATA.find((p) => p.id === selectedPackage) ||
    SERVICES_DATA.find((s) => s.id === selectedPackage);

  const basePrice = activePkg
    ? 'startingPrice' in activePkg
      ? activePkg.startingPrice
      : activePkg.price
    : 249;
  const calculatedPrice = selectedPackage === initialPackageId && initialQuotePrice !== undefined ? initialQuotePrice : basePrice;

  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting.current) return;
    if (!formData.name.trim() || formData.phone.replace(/\D/g, '').length < 7) {
      setSubmitError('Please enter your name and a valid phone number.');
      return;
    }
    submitting.current = true;
    setIsSubmitting(true);
    setSubmitError('');
    const didSend = await sendWeb3FormsNotification({
      ...formData,
      packageId: selectedPackage,
      vehicleMakeModel: formData.vehicleYearMakeModel,
      packageName: activePkg ? ('name' in activePkg ? activePkg.name : activePkg.title) : undefined,
      estimatedPrice: calculatedPrice,
    });
    submitting.current = false;
    setIsSubmitting(false);
    if (didSend) {
      setStep(3);
    } else {
      setSubmitError('We could not send your request. Please try again or call us at (210) 580-6738.');
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-hidden">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          ref={dialogRef}
          tabIndex={-1}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          role="dialog"
          aria-modal="true"
          aria-label="Request a personalized estimate"
          className="relative w-full max-w-2xl max-h-[92dvh] sm:max-h-[calc(100dvh-2rem)] overflow-y-auto overscroll-contain bg-card border border-border rounded-t-2xl sm:rounded-xs shadow-2xl shadow-elevated-lg p-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] sm:p-8 text-left z-10"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            aria-label="Close estimate form"
            className="absolute top-5 right-5 text-text-muted hover:text-heading p-2 rounded-full cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {step === 3 ? (
            /* Confirmation Screen */
            <div className="text-center py-8 space-y-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div className="space-y-2">
                <span className="text-[10px] font-sans uppercase tracking-[0.25em] text-accent-text font-semibold">
                  REQUEST RECEIVED
                </span>
                <h3 className="font-serif text-3xl text-heading font-normal">
                  Estimate Request Received
                </h3>
                <p className="text-xs text-text-secondary max-w-md mx-auto font-sans leading-relaxed">
                  Thank you, <strong className="text-heading">{formData.name}</strong>. Our team will review your information and contact you at{' '}
                  <strong className="text-accent-text">{formData.phone}</strong> with your estimated pricing and availability. Your appointment is not confirmed until you receive official confirmation from Premier Mobile Texas.
                </p>
              </div>

              {/* Summary Card */}
              <div className="bg-input border border-border-strong p-5 rounded-xs text-left max-w-md mx-auto space-y-3 text-xs font-sans">
                <div className="flex justify-between border-b border-border pb-2">
                  <span className="text-text-muted">Selected Service:</span>
                  <span className="text-heading font-medium">
                    {activePkg ? ('name' in activePkg ? activePkg.name : activePkg.title) : 'The Prestige'}
                  </span>
                </div>
                <div className="flex justify-between border-b border-border pb-2">
                  <span className="text-text-muted">Vehicle:</span>
                  <span className="text-heading font-medium">{formData.vehicleYearMakeModel || 'Specified Vehicle'}</span>
                </div>
                <div className="flex justify-between border-b border-border pb-2">
                  <span className="text-text-muted">Preferred Arrival Window:</span>
                  <span className="text-heading font-medium">{formData.preferredDate} ({formData.preferredTime})</span>
                </div>
                <div className="flex justify-between pt-1">
                  <span className="text-text-muted">Estimated Price:</span>
                  <span className="text-accent-text font-bold text-sm">${calculatedPrice}+ (final pricing confirmed by our team)</span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => {
                    setStep(1);
                    onClose();
                  }}
                  className="bg-accent hover:bg-accent-hover text-accent-contrast font-sans text-xs uppercase tracking-widest px-8 py-3.5 font-bold cursor-pointer rounded-xs"
                >
                  RETURN TO WEBSITE
                </button>
              </div>
            </div>
          ) : (
            /* Booking Form Flow */
            <div>
              {/* Header */}
              <div className="mb-5 sm:mb-6 border-b border-border-subtle pb-4 pr-9">
                <span className="text-[10px] font-sans uppercase tracking-[0.25em] text-accent-text font-semibold block mb-1">
                  CONCIERGE MOBILE BOOKING
                </span>
                <h3 className="font-serif text-[1.7rem] leading-tight sm:text-2xl text-heading font-normal">
                  Request Your Personalized Estimate
                </h3>
              </div>

              {/* Package selector horizontal pills */}
              <div className="mb-5 sm:mb-6 space-y-2">
                <p className="block text-[10px] uppercase tracking-widest text-text-muted font-sans">
                  SELECT SERVICE TIER
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {PACKAGES_DATA.map((pkg) => (
                    <button
                      key={pkg.id}
                      type="button"
                      aria-pressed={selectedPackage === pkg.id}
                      onClick={() => {
                        setSelectedPackage(pkg.id);
                        setFormData((p) => ({ ...p, serviceId: pkg.id, notes: pkg.id === initialPackageId ? initialData?.notes || '' : '' }));
                      }}
                      className={`p-2.5 text-left border rounded-xs transition-all cursor-pointer ${
                        selectedPackage === pkg.id
                          ? 'border-accent bg-accent/10 text-heading'
                          : 'border-border bg-input text-text-muted hover:text-heading'
                      }`}
                    >
                      <span className="font-serif text-xs block font-normal truncate">{pkg.name}</span>
                      <span className="text-[10px] text-accent-text font-sans font-medium block">
                        ${pkg.price}+
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <form onSubmit={handleSubmitBooking} className="space-y-3.5 sm:space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="bookingmodal-field-1" className="block text-[10px] uppercase tracking-widest text-text-muted mb-1 font-sans">
                      FULL NAME *
                    </label>
                    <input id="bookingmodal-field-1"
                      autoComplete="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Jamie Reeves"
                      className="w-full bg-input border border-border-strong text-heading px-3.5 py-2.5 text-xs focus:outline-none focus:border-accent rounded-xs"
                    />
                  </div>

                  <div>
                    <label htmlFor="bookingmodal-field-2" className="block text-[10px] uppercase tracking-widest text-text-muted mb-1 font-sans">
                      CELL PHONE *
                    </label>
                    <input id="bookingmodal-field-2"
                      autoComplete="tel"
                      minLength={7}
                      maxLength={30}
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="(210) 580-6738"
                      className="w-full bg-input border border-border-strong text-heading px-3.5 py-2.5 text-xs focus:outline-none focus:border-accent rounded-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="bookingmodal-field-3" className="block text-[10px] uppercase tracking-widest text-text-muted mb-1 font-sans">
                      VEHICLE YEAR / MAKE / MODEL
                    </label>
                    <input id="bookingmodal-field-3"
                      type="text"
                      value={formData.vehicleYearMakeModel}
                      onChange={(e) => setFormData({ ...formData, vehicleYearMakeModel: e.target.value })}
                      placeholder="2022 Ford F-150 / Porsche 911"
                      className="w-full bg-input border border-border-strong text-heading px-3.5 py-2.5 text-xs focus:outline-none focus:border-accent rounded-xs"
                    />
                  </div>

                  <div>
                    <label htmlFor="bookingmodal-field-4" className="block text-[10px] uppercase tracking-widest text-text-muted mb-1 font-sans">
                      SERVICE METRO AREA
                    </label>
                    <select id="bookingmodal-field-4"
                      value={formData.locationMetro}
                      onChange={(e) => setFormData({ ...formData, locationMetro: e.target.value })}
                      className="w-full bg-input border border-border-strong text-text px-3 py-2.5 text-xs focus:outline-none focus:border-accent rounded-xs"
                    >
                      <option value="san-antonio">San Antonio Metro</option>
                      <option value="new-braunfels">New Braunfels Metro</option>
                      <option value="boerne">Boerne & Hill Country</option>
                      <option value="austin">Austin Metro & Surrounding</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="bookingmodal-field-5" className="block text-[10px] uppercase tracking-widest text-text-muted mb-1 font-sans">
                      PREFERRED SERVICE DATE
                    </label>
                    <input id="bookingmodal-field-5"
                      type="date"
                      min={new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 10)}
                      value={formData.preferredDate}
                      onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                      className="w-full bg-input border border-border-strong text-heading px-3 py-2 text-xs focus:outline-none focus:border-accent rounded-xs"
                    />
                  </div>

                  <div>
                    <label htmlFor="bookingmodal-field-6" className="block text-[10px] uppercase tracking-widest text-text-muted mb-1 font-sans">
                      PREFERRED ARRIVAL WINDOW
                    </label>
                    <select id="bookingmodal-field-6"
                      value={formData.preferredTime}
                      onChange={(e) => setFormData({ ...formData, preferredTime: e.target.value })}
                      className="w-full bg-input border border-border-strong text-text px-3 py-2.5 text-xs focus:outline-none focus:border-accent rounded-xs"
                    >
                      <option value="08:00 AM">Morning (8:00 AM - 10:00 AM)</option>
                      <option value="12:00 PM">Midday (12:00 PM - 2:00 PM)</option>
                      <option value="03:00 PM">Afternoon (3:00 PM - 5:00 PM)</option>
                    </select>
                  </div>
                </div>

                <p className="text-[11px] text-text-faint font-sans">
                  Preferred dates and arrival windows are requests only and are subject to availability.
                </p>

                {submitError && (
                  <p role="alert" className="text-xs text-amber-400 font-sans leading-relaxed bg-amber-500/10 border border-amber-500/25 px-3 py-2.5 rounded-xs">
                    {submitError}
                  </p>
                )}

                <div className="pt-2 flex flex-col min-[420px]:flex-row items-stretch min-[420px]:items-center justify-between gap-3 border-t border-border-subtle">
                  <div>
                    <span className="text-[10px] uppercase text-text-muted block font-sans">ESTIMATED PRICING</span>
                    <span className="font-serif text-2xl text-accent-vivid">${calculatedPrice}+</span>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-accent hover:bg-accent-hover text-accent-contrast font-sans text-xs uppercase tracking-widest px-8 py-3.5 font-bold cursor-pointer rounded-xs transition-all flex items-center justify-center gap-2 disabled:opacity-80"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-accent-contrast" />
                        <span>SENDING...</span>
                      </>
                    ) : (
                      <span>SEND MY REQUEST →</span>
                    )}
                  </button>
                </div>

                <p className="text-[11px] text-text-faint font-sans leading-relaxed">
                  Displayed prices are estimates. Final pricing will be confirmed after our team reviews your vehicle's size, condition, location, and requested services. A booking deposit may be required to secure your appointment; any deposit collected will be applied toward your final balance. Submitting this form does not confirm an appointment.
                </p>
              </form>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
