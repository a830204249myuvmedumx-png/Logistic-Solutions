import React, { useState } from 'react';
import { HOTLINKED_ASSETS } from '../data/mockData';
import { ActiveScreen } from '../types';
import { TermsOfServiceModal } from '../components/TrustModals';

interface ShipmentWizardScreenProps {
  onNavigate: (screen: ActiveScreen) => void;
  onShipmentCreated?: (trackingNum: string) => void;
}

export const ShipmentWizardScreen: React.FC<ShipmentWizardScreenProps> = ({
  onNavigate,
  onShipmentCreated,
}) => {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);

  // Form State
  const [originCountry, setOriginCountry] = useState('United States');
  const [originAddress, setOriginAddress] = useState('123 Industrial Way, Port Area');
  const [originCity, setOriginCity] = useState('New York, USA');

  const [destCountry, setDestCountry] = useState('Brazil');
  const [destAddress, setDestAddress] = useState('Av. das Industrias 500, São Paulo');
  const [destCity, setDestCity] = useState('São Paulo, Brazil');

  const [weightKg, setWeightKg] = useState(1250);
  const [cargoType, setCargoType] = useState<'General Cargo' | 'Hazmat' | 'Fragile' | 'Temperature Controlled'>(
    'General Cargo'
  );
  const [lengthCm, setLengthCm] = useState(120);
  const [widthCm, setWidthCm] = useState(80);
  const [heightCm, setHeightCm] = useState(110);

  const [shippingMode, setShippingMode] = useState<'air' | 'sea' | 'road'>('air');
  const [bookedTrackingId, setBookedTrackingId] = useState<string | null>(null);

  // Modals
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showRouteModal, setShowRouteModal] = useState(false);

  // Dynamic pricing
  const calculateTotal = () => {
    let base = 0;
    if (shippingMode === 'sea') base = 1200 + weightKg * 0.45;
    else if (shippingMode === 'air') base = 2500 + weightKg * 1.88;
    else base = 850 + weightKg * 0.35;

    if (cargoType === 'Hazmat') base *= 1.35;
    if (cargoType === 'Temperature Controlled') base *= 1.25;
    if (cargoType === 'Fragile') base *= 1.15;

    return base.toFixed(2);
  };

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep((prev) => (prev + 1) as any);
    } else {
      // Finalize booking
      const trackingCode = `LI-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}-XQ`;
      setBookedTrackingId(trackingCode);
      if (onShipmentCreated) {
        onShipmentCreated(trackingCode);
      }
    }
  };

  const formattedTotal = `$${Number(calculateTotal()).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-8 py-8 mb-24">
      {/* Multi-step Progress Indicator */}
      <div className="mb-10 max-w-3xl mx-auto">
        <div className="flex items-center justify-between">
          {[
            { step: 1, label: 'Origin/Dest' },
            { step: 2, label: 'Cargo' },
            { step: 3, label: 'Mode' },
            { step: 4, label: 'Review' },
          ].map((item, idx, arr) => {
            const isCompleted = currentStep > item.step;
            const isCurrent = currentStep === item.step;

            return (
              <React.Fragment key={item.step}>
                <button
                  type="button"
                  onClick={() => setCurrentStep(item.step as any)}
                  className="flex flex-col items-center gap-2 cursor-pointer group focus:outline-none"
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                      isCurrent
                        ? 'bg-[#000666] dark:bg-[#bdc2ff] text-white dark:text-[#000666] ring-4 ring-[#e0e0ff] dark:ring-blue-900/50 scale-105'
                        : isCompleted
                        ? 'bg-[#fd6c00] text-white'
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                    }`}
                  >
                    {isCompleted ? (
                      <span className="material-symbols-outlined text-sm font-bold">check</span>
                    ) : (
                      item.step
                    )}
                  </div>
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider transition-colors ${
                      isCurrent
                        ? 'text-[#000666] dark:text-[#bdc2ff]'
                        : isCompleted
                        ? 'text-[#fd6c00]'
                        : 'text-slate-400'
                    }`}
                  >
                    {item.label}
                  </span>
                </button>

                {idx < arr.length - 1 && (
                  <div
                    className={`flex-grow h-0.5 mx-2 mb-6 transition-colors ${
                      currentStep > item.step ? 'bg-[#fd6c00]' : 'bg-slate-200 dark:bg-slate-800'
                    }`}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {bookedTrackingId ? (
        /* Booking Confirmation Card */
        <div className="bg-white dark:bg-[#1a1c1c] rounded-3xl p-8 md:p-12 shadow-2xl border border-emerald-500/20 text-center space-y-6 animate-in zoom-in-95">
          <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-4xl shadow-inner">
            <span className="material-symbols-outlined text-5xl">task_alt</span>
          </div>
          <div>
            <span className="text-xs uppercase font-extrabold text-emerald-600 tracking-widest bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1 rounded-full">
              Consignment Confirmed & Booked
            </span>
            <h2 className="text-3xl font-black font-headline text-[#000666] dark:text-white mt-3">
              Shipment Scheduled for Pickup
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
              Automated carrier dispatch notified. Waybill generated.
            </p>
          </div>

          <div className="max-w-md mx-auto p-6 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3 text-left">
            <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-2">
              <span className="text-xs text-slate-500 font-bold uppercase">Tracking Manifest ID</span>
              <span className="font-mono font-bold text-base text-[#fd6c00]">{bookedTrackingId}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500">Route:</span>
              <span className="font-semibold text-primary dark:text-white">{originCity} → {destCity}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500">Modality:</span>
              <span className="font-semibold text-primary dark:text-white capitalize">{shippingMode} Freight</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500">Total Charged:</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">{formattedTotal}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
            <button
              onClick={() => onNavigate('tracking')}
              className="px-8 py-3.5 bg-[#000666] text-white rounded-xl font-bold text-xs uppercase tracking-wider shadow-lg hover:bg-blue-900 transition-all active:scale-95"
            >
              Track in Real-Time →
            </button>
            <button
              onClick={() => {
                setBookedTrackingId(null);
                setCurrentStep(1);
              }}
              className="px-8 py-3.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-slate-200 transition-colors active:scale-95"
            >
              Book Another Shipment
            </button>
          </div>
        </div>
      ) : (
        /* Main 2-Column Form Layout */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Form Sections */}
          <div className="lg:col-span-8 space-y-10">
            {/* Section 1: Route */}
            <section className="space-y-4">
              <div className="flex items-baseline gap-2 mb-2">
                <h2 className="text-2xl font-extrabold tracking-tight text-[#000666] dark:text-[#bdc2ff] font-headline">
                  Shipment Route
                </h2>
                <div className="h-1 flex-grow bg-slate-200 dark:bg-slate-800 rounded-full" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Origin Point */}
                <div className="bg-white dark:bg-[#1a1c1c] p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
                  <div className="flex items-center gap-2 text-[#000666] dark:text-[#bdc2ff] font-bold text-xs uppercase tracking-widest">
                    <span className="material-symbols-outlined text-sm">location_on</span>
                    Origin Point
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">
                        Country
                      </label>
                      <select
                        value={originCountry}
                        onChange={(e) => {
                          setOriginCountry(e.target.value);
                          if (e.target.value === 'United States') setOriginCity('New York, USA');
                          if (e.target.value === 'Germany') setOriginCity('Frankfurt, DE');
                          if (e.target.value === 'Singapore') setOriginCity('Singapore Port, SG');
                          if (e.target.value === 'China') setOriginCity('Shanghai, CN');
                        }}
                        className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl text-sm font-semibold p-3 outline-none focus:ring-2 focus:ring-[#000666]"
                      >
                        <option value="United States">United States</option>
                        <option value="Germany">Germany</option>
                        <option value="Singapore">Singapore</option>
                        <option value="China">China</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">
                        Pickup Address
                      </label>
                      <input
                        type="text"
                        value={originAddress}
                        onChange={(e) => setOriginAddress(e.target.value)}
                        placeholder="123 Industrial Way, Port Area"
                        className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl text-sm font-medium p-3 outline-none focus:ring-2 focus:ring-[#000666]"
                      />
                    </div>
                  </div>
                </div>

                {/* Final Destination */}
                <div className="bg-white dark:bg-[#1a1c1c] p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
                  <div className="flex items-center gap-2 text-[#fd6c00] font-bold text-xs uppercase tracking-widest">
                    <span className="material-symbols-outlined text-sm">flag</span>
                    Final Destination
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">
                        Country
                      </label>
                      <select
                        value={destCountry}
                        onChange={(e) => {
                          setDestCountry(e.target.value);
                          if (e.target.value === 'Brazil') setDestCity('São Paulo, Brazil');
                          if (e.target.value === 'Mexico') setDestCity('Mexico City, MX');
                          if (e.target.value === 'Netherlands') setDestCity('Rotterdam, NL');
                          if (e.target.value === 'Japan') setDestCity('Tokyo, JP');
                        }}
                        className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl text-sm font-semibold p-3 outline-none focus:ring-2 focus:ring-[#fd6c00]"
                      >
                        <option value="Brazil">Brazil</option>
                        <option value="Mexico">Mexico</option>
                        <option value="Netherlands">Netherlands</option>
                        <option value="Japan">Japan</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">
                        Delivery Address
                      </label>
                      <input
                        type="text"
                        value={destAddress}
                        onChange={(e) => setDestAddress(e.target.value)}
                        placeholder="Av. das Industrias 500, São Paulo"
                        className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl text-sm font-medium p-3 outline-none focus:ring-2 focus:ring-[#fd6c00]"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 2: Cargo Details */}
            <section className="space-y-4">
              <div className="flex items-baseline gap-2 mb-2">
                <h2 className="text-2xl font-extrabold tracking-tight text-[#000666] dark:text-[#bdc2ff] font-headline">
                  Cargo Specifications
                </h2>
                <div className="h-1 flex-grow bg-slate-200 dark:bg-slate-800 rounded-full" />
              </div>

              <div className="bg-white dark:bg-[#1a1c1c] p-6 md:p-8 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Total Weight */}
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">
                      Total Weight (KG)
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        min="1"
                        value={weightKg}
                        onChange={(e) => setWeightKg(Number(e.target.value))}
                        className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl text-sm font-bold p-3 pr-12 outline-none focus:ring-2 focus:ring-[#000666]"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400">
                        KG
                      </span>
                    </div>
                  </div>

                  {/* Cargo Type Pills with Click Handlers */}
                  <div className="md:col-span-2">
                    <label className="block text-[11px] font-bold uppercase text-slate-500 mb-2">
                      Cargo Classification
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {(['General Cargo', 'Hazmat', 'Fragile', 'Temperature Controlled'] as const).map(
                        (type) => {
                          const isSel = cargoType === type;
                          return (
                            <button
                              key={type}
                              type="button"
                              onClick={() => setCargoType(type)}
                              className={`px-4 py-2 rounded-full text-xs font-bold transition-all active:scale-95 ${
                                isSel
                                  ? 'bg-[#000666] dark:bg-[#bdc2ff] text-white dark:text-[#000666] shadow-sm'
                                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                              }`}
                            >
                              {type}
                            </button>
                          );
                        }
                      )}
                    </div>
                  </div>

                  {/* Dimensions */}
                  <div className="md:col-span-3 grid grid-cols-3 gap-4 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <div>
                      <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">
                        Length (cm)
                      </label>
                      <input
                        type="number"
                        value={lengthCm}
                        onChange={(e) => setLengthCm(Number(e.target.value))}
                        className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl text-sm font-medium p-3 outline-none focus:ring-2 focus:ring-[#000666]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">
                        Width (cm)
                      </label>
                      <input
                        type="number"
                        value={widthCm}
                        onChange={(e) => setWidthCm(Number(e.target.value))}
                        className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl text-sm font-medium p-3 outline-none focus:ring-2 focus:ring-[#000666]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">
                        Height (cm)
                      </label>
                      <input
                        type="number"
                        value={heightCm}
                        onChange={(e) => setHeightCm(Number(e.target.value))}
                        className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl text-sm font-medium p-3 outline-none focus:ring-2 focus:ring-[#000666]"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 3: Shipping Mode */}
            <section className="space-y-4">
              <div className="flex items-baseline gap-2 mb-2">
                <h2 className="text-2xl font-extrabold tracking-tight text-[#000666] dark:text-[#bdc2ff] font-headline">
                  Shipping Mode
                </h2>
                <div className="h-1 flex-grow bg-slate-200 dark:bg-slate-800 rounded-full" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Sea Freight Card */}
                <div
                  onClick={() => setShippingMode('sea')}
                  className={`group cursor-pointer rounded-2xl p-5 relative transition-all border-2 active:scale-95 ${
                    shippingMode === 'sea'
                      ? 'bg-[#000666] dark:bg-[#1a237e] text-white ring-4 ring-[#e0e0ff] dark:ring-blue-900 border-transparent shadow-xl'
                      : 'bg-white dark:bg-[#1a1c1c] text-[#1a1c1c] dark:text-[#e2e2e2] border-slate-200/80 dark:border-slate-800 hover:border-[#fd6c00]'
                  }`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <span className="material-symbols-outlined text-3xl">directions_boat</span>
                    {shippingMode === 'sea' && (
                      <span className="material-symbols-outlined text-[#fd6c00]" style={{ fontVariationSettings: "'FILL' 1" }}>
                        check_circle
                      </span>
                    )}
                  </div>
                  <h3 className="font-bold text-lg mb-1 font-headline">Sea Freight</h3>
                  <p className={`text-xs mb-4 ${shippingMode === 'sea' ? 'text-blue-200' : 'text-slate-500'}`}>
                    Standard maritime container shipping
                  </p>
                  <div className="flex justify-between items-end border-t border-slate-200/40 dark:border-slate-700/40 pt-3">
                    <div>
                      <p className="text-[10px] font-bold uppercase opacity-70">Est. Time</p>
                      <p className="text-sm font-bold">22-28 Days</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-bold uppercase opacity-70">Starting at</p>
                      <p className="text-lg font-black text-[#fd6c00]">$1,200</p>
                    </div>
                  </div>
                </div>

                {/* Air Freight Card (Active selection) */}
                <div
                  onClick={() => setShippingMode('air')}
                  className={`group cursor-pointer rounded-2xl p-5 relative overflow-hidden transition-all border-2 active:scale-95 ${
                    shippingMode === 'air'
                      ? 'bg-[#000666] dark:bg-[#1a237e] text-white ring-4 ring-[#e0e0ff] dark:ring-blue-900 border-transparent shadow-xl'
                      : 'bg-white dark:bg-[#1a1c1c] text-[#1a1c1c] dark:text-[#e2e2e2] border-slate-200/80 dark:border-slate-800 hover:border-[#fd6c00]'
                  }`}
                >
                  <div className="absolute -right-6 -bottom-6 opacity-10 pointer-events-none">
                    <span className="material-symbols-outlined text-9xl">flight</span>
                  </div>
                  <div className="flex justify-between items-start mb-3">
                    <span className="material-symbols-outlined text-3xl">flight</span>
                    {shippingMode === 'air' && (
                      <span className="material-symbols-outlined text-[#fd6c00]" style={{ fontVariationSettings: "'FILL' 1" }}>
                        check_circle
                      </span>
                    )}
                  </div>
                  <h3 className="font-bold text-lg mb-1 font-headline">Air Freight</h3>
                  <p className={`text-xs mb-4 ${shippingMode === 'air' ? 'text-blue-200' : 'text-slate-500'}`}>
                    Express aerial transport for priority
                  </p>
                  <div className="flex justify-between items-end border-t border-slate-200/40 dark:border-slate-700/40 pt-3">
                    <div>
                      <p className="text-[10px] font-bold uppercase opacity-70">Est. Time</p>
                      <p className="text-sm font-bold">3-5 Days</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-bold uppercase opacity-70">Estimated</p>
                      <p className="text-lg font-black text-[#fd6c00]">$4,850</p>
                    </div>
                  </div>
                </div>

                {/* Road Freight Card */}
                <div
                  onClick={() => setShippingMode('road')}
                  className={`group cursor-pointer rounded-2xl p-5 relative transition-all border-2 active:scale-95 ${
                    shippingMode === 'road'
                      ? 'bg-[#000666] dark:bg-[#1a237e] text-white ring-4 ring-[#e0e0ff] dark:ring-blue-900 border-transparent shadow-xl'
                      : 'bg-white dark:bg-[#1a1c1c] text-[#1a1c1c] dark:text-[#e2e2e2] border-slate-200/80 dark:border-slate-800 hover:border-[#fd6c00]'
                  }`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <span className="material-symbols-outlined text-3xl">local_shipping</span>
                    {shippingMode === 'road' && (
                      <span className="material-symbols-outlined text-[#fd6c00]" style={{ fontVariationSettings: "'FILL' 1" }}>
                        check_circle
                      </span>
                    )}
                  </div>
                  <h3 className="font-bold text-lg mb-1 font-headline">Road Freight</h3>
                  <p className={`text-xs mb-4 ${shippingMode === 'road' ? 'text-blue-200' : 'text-slate-500'}`}>
                    Inland trucking and distribution
                  </p>
                  <div className="flex justify-between items-end border-t border-slate-200/40 dark:border-slate-700/40 pt-3">
                    <div>
                      <p className="text-[10px] font-bold uppercase opacity-70">Est. Time</p>
                      <p className="text-sm font-bold">7-10 Days</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-bold uppercase opacity-70">Starting at</p>
                      <p className="text-lg font-black text-[#fd6c00]">$850</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Right Column: Sticky Summary & Route Map */}
          <div className="lg:col-span-4">
            <div className="sticky top-24 space-y-6">
              {/* Summary Card */}
              <div className="bg-white dark:bg-[#1a1c1c] p-6 rounded-2xl shadow-xl border border-slate-200/80 dark:border-slate-800 space-y-5">
                <h3 className="text-xs font-black uppercase tracking-widest text-[#000666] dark:text-[#bdc2ff] font-headline">
                  Request Summary
                </h3>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-1 h-14 bg-[#000666] dark:bg-[#bdc2ff] rounded-full shrink-0 mt-1" />
                    <div>
                      <p className="text-[10px] font-bold uppercase text-slate-400">Origin</p>
                      <p className="text-sm font-bold text-primary dark:text-white">{originCity}</p>
                      <p className="text-[10px] text-slate-400 mt-2 font-bold uppercase">Destination</p>
                      <p className="text-sm font-bold text-primary dark:text-white">{destCity}</p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center py-4 border-y border-slate-100 dark:border-slate-800">
                    <div className="text-center">
                      <p className="text-[10px] font-bold uppercase text-slate-400">Total Weight</p>
                      <p className="text-sm font-black text-[#000666] dark:text-white tabular-nums">
                        {weightKg} KG
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-[10px] font-bold uppercase text-slate-400">Transport</p>
                      <p className="text-sm font-black text-[#000666] dark:text-white capitalize">
                        {shippingMode} Freight
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center bg-[#ffdbcb]/40 dark:bg-orange-950/30 p-4 rounded-xl border border-orange-200/50 dark:border-orange-900/30">
                    <span className="text-xs font-bold uppercase text-[#341100] dark:text-[#ffb692]">
                      Est. Total
                    </span>
                    <span className="text-2xl font-black text-[#9f4200] dark:text-[#fd6c00] font-headline tabular-nums">
                      {formattedTotal}
                    </span>
                  </div>

                  <button
                    onClick={handleNext}
                    className="w-full bg-[#fd6c00] hover:bg-[#e05f00] text-white py-4 rounded-xl font-bold transition-all duration-200 active:scale-95 shadow-lg shadow-orange-600/25 flex items-center justify-center gap-2 text-sm uppercase tracking-wider"
                  >
                    <span>
                      {currentStep === 4 ? 'Confirm & Book Consignment' : 'Proceed to Next Step'}
                    </span>
                    <span className="material-symbols-outlined text-base">arrow_forward</span>
                  </button>

                  <p className="text-[10px] text-center text-slate-400 leading-relaxed">
                    By proceeding, you agree to our{' '}
                    <button
                      type="button"
                      onClick={() => setShowTermsModal(true)}
                      className="underline cursor-pointer hover:text-primary dark:hover:text-white"
                    >
                      Terms of Service
                    </button>{' '}
                    and global logistics regulations.
                  </p>
                </div>
              </div>

              {/* Map Preview Card with Click Handlers */}
              <div
                onClick={() => setShowRouteModal(true)}
                className="rounded-2xl overflow-hidden h-48 relative bg-slate-200 shadow-md cursor-pointer group"
                title="Click to inspect live trade corridor"
              >
                <img
                  src={HOTLINKED_ASSETS.worldRouteMap}
                  alt="Live Route Preview"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#000666]/70 via-transparent to-transparent flex items-end justify-between p-4">
                  <div className="flex items-center gap-2 text-white">
                    <span className="material-symbols-outlined text-base">public</span>
                    <span className="text-[10px] font-black uppercase tracking-widest">
                      Live Route Preview
                    </span>
                  </div>
                  <span className="text-[10px] text-white/80 font-bold bg-white/20 px-2 py-0.5 rounded backdrop-blur-sm">
                    Inspect ↗
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Terms of Service Modal */}
      <TermsOfServiceModal
        isOpen={showTermsModal}
        onClose={() => setShowTermsModal(false)}
      />

      {/* Route Corridor Preview Modal */}
      {showRouteModal && (
        <div className="fixed inset-0 z-[140] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white dark:bg-[#1a1c1c] text-[#1a1c1c] dark:text-[#e2e2e2] rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-200 dark:border-slate-800">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#fd6c00]">map</span>
                <h3 className="font-headline font-bold text-base">International Transit Corridor</h3>
              </div>
              <button onClick={() => setShowRouteModal(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="h-48 rounded-xl overflow-hidden relative">
              <img src={HOTLINKED_ASSETS.worldRouteMap} alt="Corridor" className="w-full h-full object-cover" />
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between p-2.5 bg-slate-50 dark:bg-slate-900 rounded-xl">
                <span>Origin Terminal:</span>
                <strong className="text-primary dark:text-white">{originCity} ({originAddress})</strong>
              </div>
              <div className="flex justify-between p-2.5 bg-slate-50 dark:bg-slate-900 rounded-xl">
                <span>Destination Terminal:</span>
                <strong className="text-primary dark:text-white">{destCity} ({destAddress})</strong>
              </div>
              <div className="flex justify-between p-2.5 bg-slate-50 dark:bg-slate-900 rounded-xl">
                <span>Great Circle Distance:</span>
                <strong className="font-mono text-[#fd6c00]">7,680 km (Aerial Waypoints: JFK → MAO → GRU)</strong>
              </div>
            </div>
            <button
              onClick={() => setShowRouteModal(false)}
              className="w-full py-3 bg-[#000666] text-white rounded-xl font-bold text-xs uppercase tracking-wider"
            >
              Close Map
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
