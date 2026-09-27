import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Calculator, ArrowRight, CheckCircle2, Sparkles, Car, Shield, Flame } from 'lucide-react';
import { BookingFormData } from '../types';

interface QuoteCalculatorProps {
  onQuoteCalculated: (data: Partial<BookingFormData>, price: number) => void;
}

export const QuoteCalculator: React.FC<QuoteCalculatorProps> = ({ onQuoteCalculated }) => {
  const [vehicleType, setVehicleType] = useState<'sedan' | 'suv' | 'truck' | 'exotic'>('sedan');
  const [condition, setCondition] = useState<'standard' | 'moderate' | 'heavy'>('standard');
  const [packageChoice, setPackageChoice] = useState<'refresh' | 'prestige' | 'concours'>('prestige');
  const [addOns, setAddOns] = useState<string[]>([]);

  // Base prices per package
  const basePrices = {
    refresh: 129,
    prestige: 249,
    concours: 699,
  };

  // Vehicle multipliers/additions
  const vehicleSurcharges = {
    sedan: packageChoice === 'refresh' ? 0 : 0,
    suv: packageChoice === 'refresh' ? 10 : 30,
    truck: packageChoice === 'refresh' ? 20 : 40,
    exotic: packageChoice === 'refresh' ? 51 : 50,
  };

  // Condition surcharges
  const conditionSurcharges = {
    standard: 0,
    moderate: 25,
    heavy: 50, // e.g. pet hair / heavy mud
  };

  // Addon prices
  const addOnPrices: Record<string, number> = {
    'engine-bay': 49,
    'headlight-restoration': 79,
    'pet-hair-removal': 40,
    'ceramic-windshield': 39,
  };

  const calculatedTotal =
    basePrices[packageChoice] +
    vehicleSurcharges[vehicleType] +
    conditionSurcharges[condition] +
    addOns.reduce((sum, item) => sum + (addOnPrices[item] || 0), 0);

  const toggleAddOn = (id: string) => {
    if (addOns.includes(id)) {
      setAddOns(addOns.filter((item) => item !== id));
    } else {
      setAddOns([...addOns, id]);
    }
  };

  const handleClaimQuote = () => {
    const packageMap: Record<string, string> = {
      refresh: 'refresh',
      prestige: 'prestige',
      concours: 'concours',
    };

    const notesSummary = `Quote Calc: ${vehicleType.toUpperCase()} | Condition: ${condition.toUpperCase()} | Addons: ${addOns.join(', ') || 'None'}`;

    onQuoteCalculated(
      {
        serviceId: packageMap[packageChoice],
        notes: notesSummary,
      },
      calculatedTotal
    );
  };

  return (
    <section id="calculator" className="py-16 sm:py-20 lg:py-24 bg-surface-alt border-t border-border-subtle relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14 lg:mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-accent/10 border border-accent/30 rounded-full text-[10px] uppercase tracking-widest text-accent-text font-semibold">
            <Calculator className="w-3.5 h-3.5" />
            <span>INTERACTIVE ESTIMATOR</span>
          </div>

          <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-heading font-normal">
            Get an Estimated Price.
          </h2>

          <p className="text-text-muted font-sans font-light text-sm sm:text-base">
            Configure your vehicle type, paint condition, and desired package to see estimated pricing.
          </p>
        </div>

        {/* Calculator Card Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start max-w-6xl mx-auto">
          
          {/* Configurator Left Column */}
          <div className="xl:col-span-7 bg-card border border-border p-5 sm:p-8 rounded-xs space-y-8 text-left shadow-2xl shadow-elevated-lg">
            
            {/* Step 1: Vehicle Type */}
            <div>
              <label className="block text-[11px] font-sans uppercase tracking-[0.2em] text-accent-text font-bold mb-3">
                1. SELECT VEHICLE SIZE
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {[
                  { id: 'sedan', label: 'Sedan / Coupe', sub: packageChoice === 'refresh' ? '$129' : 'Standard' },
                  { id: 'suv', label: 'Mid SUV / Crossover', sub: packageChoice === 'refresh' ? '$139' : '+$30' },
                  { id: 'truck', label: 'Truck / 3-Row SUV', sub: packageChoice === 'refresh' ? '$149' : '+$40' },
                  { id: 'exotic', label: 'Exotic / Sports Car', sub: packageChoice === 'refresh' ? '$180' : '+$50' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setVehicleType(item.id as any)}
                    aria-pressed={vehicleType === item.id}
                    className={`p-3 text-left border rounded-xs transition-all cursor-pointer ${
                      vehicleType === item.id
                        ? 'border-accent bg-accent/10 text-heading'
                        : 'border-border bg-input text-text-muted hover:text-heading'
                    }`}
                  >
                    <span className="font-sans text-xs font-semibold block">{item.label}</span>
                    <span className="text-[10px] text-text-faint block mt-1">{item.sub}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Desired Package */}
            <div>
              <label className="block text-[11px] font-sans uppercase tracking-[0.2em] text-accent-text font-bold mb-3">
                2. SELECT SERVICE PACKAGE
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { id: 'refresh', name: 'The Refresh', price: '$129+', desc: 'Wash + Interior Vacuum' },
                  { id: 'prestige', name: 'The Prestige', price: '$249+', desc: 'Full Deep Steam + Polish', popular: true },
                  { id: 'concours', name: 'The Concours', price: '$699+', desc: 'Ceramic Coating' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setPackageChoice(item.id as any)}
                    aria-pressed={packageChoice === item.id}
                    className={`p-4 text-left border rounded-xs transition-all cursor-pointer relative ${
                      packageChoice === item.id
                        ? 'border-accent bg-accent/10 text-heading shadow-md'
                        : 'border-border bg-input text-text-muted hover:text-heading'
                    }`}
                  >
                    {item.popular && (
                      <span className="absolute -top-2 right-2 bg-accent text-accent-contrast text-[9px] uppercase font-bold px-2 py-0.5 rounded-xs">
                        POPULAR
                      </span>
                    )}
                    <span className="font-serif text-lg text-heading font-normal block">{item.name}</span>
                    <span className="text-xs text-accent-text font-bold block mt-0.5">{item.price}</span>
                    <span className="text-[10px] text-text-muted block mt-1">{item.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 3: Vehicle Condition */}
            <div>
              <label className="block text-[11px] font-sans uppercase tracking-[0.2em] text-accent-text font-bold mb-3">
                3. VEHICLE CONDITION
              </label>
              <div className="grid grid-cols-1 min-[480px]:grid-cols-3 gap-2.5">
                {[
                  { id: 'standard', label: 'Light Dirt', sub: 'Normal dust/bugs' },
                  { id: 'moderate', label: 'Moderate Dirt', sub: '+$25 (Stains/spills)' },
                  { id: 'heavy', label: 'Heavy Dirt / Pet Hair', sub: '+$50 (Mud/deep hair)' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setCondition(item.id as any)}
                    aria-pressed={condition === item.id}
                    className={`p-3 text-left border rounded-xs transition-all cursor-pointer ${
                      condition === item.id
                        ? 'border-accent bg-accent/10 text-heading'
                        : 'border-border bg-input text-text-muted hover:text-heading'
                    }`}
                  >
                    <span className="font-sans text-xs font-semibold block">{item.label}</span>
                    <span className="text-[10px] text-text-faint block mt-0.5">{item.sub}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 4: Optional Add-ons */}
            <div>
              <label className="block text-[11px] font-sans uppercase tracking-[0.2em] text-accent-text font-bold mb-3">
                4. OPTIONAL ADD-ONS
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {[
                  { id: 'engine-bay', label: 'Engine Bay Steam & Dressing', price: '+$49' },
                  { id: 'headlight-restoration', label: 'Headlight Oxidation Restored', price: '+$79' },
                  { id: 'pet-hair-removal', label: 'Deep Pet Hair Extraction', price: '+$40' },
                  { id: 'ceramic-windshield', label: 'Ceramic Glass Rain Sealant', price: '+$39' },
                ].map((item) => {
                  const isChecked = addOns.includes(item.id);
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => toggleAddOn(item.id)}
                      aria-pressed={isChecked}
                      className={`p-3 text-left border rounded-xs transition-all cursor-pointer flex items-center justify-between ${
                        isChecked
                          ? 'border-accent bg-accent/15 text-heading'
                          : 'border-border bg-input text-text-muted hover:text-heading'
                      }`}
                    >
                      <span className="font-sans text-xs">{item.label}</span>
                      <span className="text-xs text-accent-text font-bold ml-2">{item.price}</span>
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Quote Summary Box Right Column */}
          <div className="xl:col-span-5 bg-card border-2 border-accent/50 p-5 sm:p-8 rounded-xs text-left space-y-6 shadow-2xl shadow-elevated-lg relative xl:sticky xl:top-28">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4" aria-live="polite" aria-atomic="true">
              <div>
                <span className="text-[10px] uppercase tracking-[0.25em] text-accent-text font-bold block">
                  YOUR ESTIMATED TOTAL
                </span>
                <span className="font-serif text-5xl text-heading font-normal block mt-1">
                  ${calculatedTotal}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase tracking-widest text-text-muted font-sans block bg-input border border-border-strong px-2 py-1 rounded-xs">
                  PRICING ESTIMATE
                </span>
              </div>
            </div>

            {/* Breakdown List */}
            <div className="space-y-2.5 text-xs font-sans text-text-secondary">
              <div className="flex justify-between">
                <span className="text-text-muted">Package:</span>
                <span className="text-heading capitalize font-medium">{packageChoice} (${basePrices[packageChoice]})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Vehicle Size:</span>
                <span className="text-heading capitalize font-medium">{vehicleType} (+${vehicleSurcharges[vehicleType]})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Paint/Interior Condition:</span>
                <span className="text-heading capitalize font-medium">{condition} (+${conditionSurcharges[condition]})</span>
              </div>
              {addOns.length > 0 && (
                <div className="flex justify-between border-t border-border pt-2">
                  <span className="text-text-muted">Add-ons ({addOns.length}):</span>
                  <span className="text-accent-text font-medium">
                    +${addOns.reduce((sum, item) => sum + (addOnPrices[item] || 0), 0)}
                  </span>
                </div>
              )}
            </div>

            {/* Included Guarantees */}
            <div className="bg-input border border-border-strong p-3.5 rounded-xs space-y-1.5 text-[11px] font-sans text-text-secondary">
              <div className="flex items-center gap-2 text-text-muted">
                <CheckCircle2 className="w-3.5 h-3.5 text-text-faint" />
                <span>Travel availability & fees confirmed before your appointment</span>
              </div>
              <div className="flex items-center gap-2 text-text-muted">
                <CheckCircle2 className="w-3.5 h-3.5 text-text-faint" />
                <span>A deposit may be required to secure your appointment</span>
              </div>
            </div>

            {/* High-converting button */}
            <button
              onClick={handleClaimQuote}
              className="w-full bg-accent hover:bg-accent-hover text-accent-contrast font-sans text-xs uppercase tracking-widest py-4 font-bold transition-all shadow-xl rounded-xs cursor-pointer flex items-center justify-center gap-2 group"
            >
              <span>REQUEST AN ESTIMATE →</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <p className="text-[10px] text-text-faint font-sans text-center leading-relaxed">
              Continues to your estimate request form. Takes 30 seconds. Displayed prices are estimates — final pricing is confirmed after our team reviews your vehicle and service details.
            </p>

          </div>

        </div>

      </div>
    </section>
  );
};
