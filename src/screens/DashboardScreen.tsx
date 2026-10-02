import React, { useRef, useState } from 'react';
import { ActiveScreen, Shipment } from '../types';
import { INITIAL_SHIPMENTS } from '../data/mockData';

interface DashboardScreenProps {
  onNavigate: (screen: ActiveScreen) => void;
  lang: 'en' | 'es';
  onSelectShipmentToTrack?: (shipmentId: string) => void;
  onOpenSearch?: () => void;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({
  onNavigate,
  lang,
  onSelectShipmentToTrack,
  onOpenSearch,
}) => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [shipments] = useState<Shipment[]>(INITIAL_SHIPMENTS);
  const [showAnalysisModal, setShowAnalysisModal] = useState(false);
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [showSupportModal, setShowSupportModal] = useState(false);

  // Form states for modals
  const [issueTrackingId, setIssueTrackingId] = useState('TRK-8812-ORD');
  const [issueDesc, setIssueDesc] = useState('Port congestion exception at terminal gate.');
  const [issueSuccess, setIssueSuccess] = useState(false);

  const scrollCarousel = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const isEs = lang === 'es';

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 pt-6 pb-28 space-y-10">
      {/* Welcome Section */}
      <header className="space-y-1.5">
        <h1 className="text-3xl md:text-4xl font-extrabold font-headline tracking-tight text-[#000666] dark:text-[#bdc2ff]">
          {isEs ? 'COMANDOS OPERATIVOS' : 'Global Operations Command'}
        </h1>
        <p className="text-slate-500 dark:text-slate-400 font-body text-xs md:text-sm tracking-wider uppercase font-medium">
          {isEs
            ? 'SEGUIMIENTO EN TIEMPO REAL DE LA CADENA DE SUMINISTRO'
            : 'REAL-TIME SUPPLY CHAIN OVERVIEW'}
        </p>
      </header>

      {/* KPI Summary Carousel with Interactive Click Handlers */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xs md:text-sm font-bold font-headline text-slate-500 dark:text-slate-400 uppercase tracking-widest">
            {isEs ? 'Métricas de Rendimiento' : 'Performance Metrics'}
          </h2>
          <div className="flex gap-2">
            <button
              onClick={() => scrollCarousel('left')}
              className="p-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-[#000666] dark:text-white hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors active:scale-95"
              title="Previous Metric"
            >
              <span className="material-symbols-outlined text-base">chevron_left</span>
            </button>
            <button
              onClick={() => scrollCarousel('right')}
              className="p-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-[#000666] dark:text-white hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors active:scale-95"
              title="Next Metric"
            >
              <span className="material-symbols-outlined text-base">chevron_right</span>
            </button>
          </div>
        </div>

        <div
          ref={carouselRef}
          className="flex overflow-x-auto gap-4 md:gap-6 hide-scrollbar pb-2 -mx-1 px-1 snap-x"
        >
          {/* KPI 1 - Active Shipments (clicks to Tracking) */}
          <div
            onClick={() => onNavigate('tracking')}
            className="min-w-[270px] sm:min-w-[300px] bg-[#000666] dark:bg-[#1a237e] text-white p-6 rounded-2xl shadow-xl flex flex-col justify-between group transition-transform hover:-translate-y-1 snap-start border border-blue-900/30 cursor-pointer"
            title="Click to view all active tracking"
          >
            <div className="flex justify-between items-start">
              <span
                className="material-symbols-outlined p-2.5 bg-blue-500/20 text-[#bdc2ff] rounded-xl text-xl group-hover:scale-110 transition-transform"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                local_shipping
              </span>
              <span className="text-[#8690ee] text-xs font-bold font-headline bg-blue-950/40 px-2 py-0.5 rounded-md">
                +12% vs LY
              </span>
            </div>
            <div className="mt-8">
              <p className="text-4xl md:text-5xl font-headline font-extrabold leading-none tracking-tight tabular-nums">
                12
              </p>
              <div className="flex justify-between items-center mt-1">
                <p className="text-[#bdc2ff] font-body text-sm font-medium">Active Shipments</p>
                <span className="text-[10px] text-white/70 group-hover:underline">Track →</span>
              </div>
            </div>
          </div>

          {/* KPI 2 - On-Time Delivery (clicks to Analytics) */}
          <div
            onClick={() => onNavigate('analytics')}
            className="min-w-[270px] sm:min-w-[300px] bg-white dark:bg-[#1a1c1c] text-[#1a1c1c] dark:text-[#e2e2e2] p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between transition-transform hover:-translate-y-1 snap-start cursor-pointer group"
            title="Click to view analytics"
          >
            <div className="flex justify-between items-start">
              <span
                className="material-symbols-outlined text-[#9f4200] dark:text-[#ffb692] p-2.5 bg-[#ffdbcb] dark:bg-orange-950/40 rounded-xl text-xl group-hover:scale-110 transition-transform"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                schedule
              </span>
              <span className="text-[#9f4200] dark:text-[#ffb692] font-bold font-headline text-xs bg-orange-50 dark:bg-orange-950/20 px-2 py-0.5 rounded-md">
                Target Met
              </span>
            </div>
            <div className="mt-8">
              <p className="text-4xl md:text-5xl font-headline font-extrabold leading-none text-[#000666] dark:text-white tracking-tight tabular-nums">
                98%
              </p>
              <div className="flex justify-between items-center mt-1">
                <p className="text-slate-500 dark:text-slate-400 font-body text-sm font-medium">
                  On-Time Delivery
                </p>
                <span className="text-[10px] text-[#fd6c00] group-hover:underline">Analytics →</span>
              </div>
            </div>
          </div>

          {/* KPI 3 - Total Spend (clicks to Analytics) */}
          <div
            onClick={() => onNavigate('analytics')}
            className="min-w-[270px] sm:min-w-[300px] bg-white dark:bg-[#1a1c1c] text-[#1a1c1c] dark:text-[#e2e2e2] p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between transition-transform hover:-translate-y-1 snap-start cursor-pointer group"
            title="Click to view financial metrics"
          >
            <div className="flex justify-between items-start">
              <span
                className="material-symbols-outlined text-[#000666] dark:text-[#bdc2ff] p-2.5 bg-blue-50 dark:bg-blue-950/30 rounded-xl text-xl group-hover:scale-110 transition-transform"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                payments
              </span>
              <span className="text-red-600 dark:text-red-400 font-bold font-headline text-xs bg-red-50 dark:bg-red-950/30 px-2 py-0.5 rounded-md">
                +4.2%
              </span>
            </div>
            <div className="mt-8">
              <p className="text-4xl md:text-5xl font-headline font-extrabold leading-none text-[#000666] dark:text-white tracking-tight tabular-nums">
                $4,500
              </p>
              <div className="flex justify-between items-center mt-1">
                <p className="text-slate-500 dark:text-slate-400 font-body text-sm font-medium">
                  Total Spend (MTD)
                </p>
                <span className="text-[10px] text-primary dark:text-[#bdc2ff] group-hover:underline">Audit →</span>
              </div>
            </div>
          </div>

          {/* KPI 4 - Units in Transit (clicks to Inventory) */}
          <div
            onClick={() => onNavigate('inventory')}
            className="min-w-[270px] sm:min-w-[300px] bg-white dark:bg-[#1a1c1c] text-[#1a1c1c] dark:text-[#e2e2e2] p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between transition-transform hover:-translate-y-1 snap-start cursor-pointer group"
            title="Click to view warehouse network"
          >
            <div className="flex justify-between items-start">
              <span
                className="material-symbols-outlined text-[#000666] dark:text-[#bdc2ff] p-2.5 bg-blue-50 dark:bg-blue-950/30 rounded-xl text-xl group-hover:scale-110 transition-transform"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                inventory
              </span>
              <span className="text-slate-600 dark:text-slate-300 font-bold font-headline text-xs bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                Stable
              </span>
            </div>
            <div className="mt-8">
              <p className="text-4xl md:text-5xl font-headline font-extrabold leading-none text-[#000666] dark:text-white tracking-tight tabular-nums">
                422
              </p>
              <div className="flex justify-between items-center mt-1">
                <p className="text-slate-500 dark:text-slate-400 font-body text-sm font-medium">
                  Units In Transit
                </p>
                <span className="text-[10px] text-primary dark:text-[#bdc2ff] group-hover:underline">Inventory →</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Grid: Shipments List & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
        {/* Active Shipments List */}
        <section className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-extrabold font-headline text-[#000666] dark:text-white tracking-tight">
              {isEs ? 'Envíos Activos' : 'Active Shipments'}
            </h2>
            <button
              onClick={() => onNavigate('tracking')}
              className="text-[#9f4200] dark:text-[#ffb692] font-bold text-sm flex items-center gap-1 hover:gap-2 transition-all"
            >
              {isEs ? 'Ver Todos' : 'View All'}
              <span className="material-symbols-outlined text-base">arrow_forward</span>
            </button>
          </div>

          <div className="space-y-4">
            {shipments.slice(0, 4).map((shipment) => {
              let borderCol = 'border-l-4 border-[#fd6c00]';
              let badgeBg = 'bg-[#ffdbcb] text-[#341100]';
              let icon = 'directions_boat';

              if (shipment.mode === 'air') {
                borderCol = 'border-l-4 border-[#000666] dark:border-[#bdc2ff]';
                badgeBg = 'bg-[#e0e0ff] text-[#000767]';
                icon = 'flight';
              } else if (shipment.status === 'Exception') {
                borderCol = 'border-l-4 border-red-600';
                badgeBg = 'bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300';
                icon = 'local_shipping';
              }

              return (
                <div
                  key={shipment.id}
                  onClick={() => {
                    if (onSelectShipmentToTrack) {
                      onSelectShipmentToTrack(shipment.trackingNumber);
                    }
                    onNavigate('tracking');
                  }}
                  className={`bg-white dark:bg-[#1a1c1c] p-5 rounded-2xl shadow-sm hover:shadow-md transition-all cursor-pointer group ${borderCol}`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center text-[#000666] dark:text-[#bdc2ff] group-hover:scale-105 transition-transform">
                        <span className="material-symbols-outlined text-2xl">{icon}</span>
                      </div>
                      <div>
                        <h4 className="font-bold text-[#000666] dark:text-white font-headline text-base">
                          {shipment.trackingNumber}
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                          {shipment.origin} → {shipment.destination}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className={`text-[10px] px-2.5 py-0.5 rounded-md font-extrabold uppercase tracking-widest mb-1 ${badgeBg}`}>
                        {shipment.status}
                      </span>
                      <p
                        className={`text-xs font-bold ${
                          shipment.status === 'Exception'
                            ? 'text-red-600 dark:text-red-400'
                            : 'text-[#000666] dark:text-[#bdc2ff]'
                        }`}
                      >
                        {shipment.delayNotice || `ETA ${shipment.eta}`}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Quick Actions Grid & Market Trends Card */}
        <section className="space-y-6">
          <h2 className="text-xl font-extrabold font-headline text-[#000666] dark:text-white tracking-tight">
            {isEs ? 'Acciones Rápidas' : 'Quick Actions'}
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {/* New Shipment Button */}
            <button
              onClick={() => onNavigate('ship')}
              className="aspect-square bg-[#fd6c00] hover:bg-[#e05f00] text-white p-6 rounded-2xl flex flex-col items-center justify-center gap-3 transition-all active:scale-95 shadow-lg shadow-orange-600/20 group"
            >
              <span className="material-symbols-outlined text-4xl group-hover:scale-110 transition-transform">
                add_box
              </span>
              <span className="font-bold text-xs tracking-wider uppercase text-center font-headline">
                {isEs ? 'Nuevo Envío' : 'New Shipment'}
              </span>
            </button>

            {/* Quote Request */}
            <button
              onClick={() => setShowQuoteModal(true)}
              className="aspect-square bg-white dark:bg-[#1a1c1c] text-[#000666] dark:text-white p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 flex flex-col items-center justify-center gap-3 transition-all active:scale-95 hover:bg-slate-50 dark:hover:bg-slate-800/60 shadow-sm group"
            >
              <span className="material-symbols-outlined text-4xl text-[#000666] dark:text-[#bdc2ff] group-hover:scale-110 transition-transform">
                request_quote
              </span>
              <span className="font-bold text-xs tracking-wider uppercase text-center font-headline">
                {isEs ? 'Cotización' : 'Quote Request'}
              </span>
            </button>

            {/* Report Issue */}
            <button
              onClick={() => {
                setIssueSuccess(false);
                setShowIssueModal(true);
              }}
              className="aspect-square bg-white dark:bg-[#1a1c1c] text-[#000666] dark:text-white p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 flex flex-col items-center justify-center gap-3 transition-all active:scale-95 hover:bg-slate-50 dark:hover:bg-slate-800/60 shadow-sm group"
            >
              <span className="material-symbols-outlined text-4xl text-red-600 dark:text-red-400 group-hover:scale-110 transition-transform">
                report_problem
              </span>
              <span className="font-bold text-xs tracking-wider uppercase text-center font-headline">
                {isEs ? 'Reportar' : 'Report Issue'}
              </span>
            </button>

            {/* Contact Support */}
            <button
              onClick={() => setShowSupportModal(true)}
              className="aspect-square bg-white dark:bg-[#1a1c1c] text-[#000666] dark:text-white p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 flex flex-col items-center justify-center gap-3 transition-all active:scale-95 hover:bg-slate-50 dark:hover:bg-slate-800/60 shadow-sm group"
            >
              <span className="material-symbols-outlined text-4xl text-[#fd6c00] group-hover:scale-110 transition-transform">
                support_agent
              </span>
              <span className="font-bold text-xs tracking-wider uppercase text-center font-headline">
                {isEs ? 'Soporte' : 'Contact Support'}
              </span>
            </button>
          </div>

          {/* Decorative Market Trends Card */}
          <div className="relative overflow-hidden bg-[#000666] dark:bg-[#1a237e] p-6 rounded-2xl text-white shadow-xl">
            <div className="relative z-10 space-y-2">
              <h3 className="font-headline font-bold text-lg text-white">Market Trends</h3>
              <p className="text-xs text-blue-200/80 leading-relaxed">
                Freight rates are stabilizing this quarter. Plan your Q4 logistics now to optimize cost.
              </p>
              <button
                onClick={() => setShowAnalysisModal(true)}
                className="mt-3 text-xs font-black uppercase tracking-wider text-[#ffdbcb] border-b-2 border-[#fd6c00] pb-0.5 hover:text-white transition-colors"
              >
                READ ANALYSIS
              </button>
            </div>
            <div className="absolute -right-4 -bottom-4 opacity-10 pointer-events-none">
              <span className="material-symbols-outlined text-[130px]">trending_up</span>
            </div>
          </div>
        </section>
      </div>

      {/* Analysis Modal */}
      {showAnalysisModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white dark:bg-[#1a1c1c] text-[#1a1c1c] dark:text-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-200 dark:border-slate-800">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-headline font-bold text-lg text-[#000666] dark:text-[#bdc2ff]">
                Q4 Global Freight Intelligence
              </h3>
              <button onClick={() => setShowAnalysisModal(false)} className="text-slate-400 hover:text-slate-600">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Global spot rates for 40ft standard containers have stabilized at $2,450 for trans-Pacific corridors. Air express volume has increased 18% month-over-month due to early consumer electronics restocking.
            </p>
            <div className="p-4 bg-orange-50 dark:bg-orange-950/30 rounded-xl border border-orange-200 dark:border-orange-900/40 text-xs text-[#9f4200] dark:text-[#ffb692] font-semibold space-y-1">
              <p>• Recommendation: Lock in sea contract buffers before November 1st.</p>
              <p>• Port of Rotterdam wait times reduced from 34 hours to 18 hours.</p>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => {
                  setShowAnalysisModal(false);
                  onNavigate('analytics');
                }}
                className="flex-1 py-3 bg-[#fd6c00] text-white rounded-xl font-bold text-xs uppercase tracking-wider"
              >
                View Full Analytics
              </button>
              <button
                onClick={() => setShowAnalysisModal(false)}
                className="flex-1 py-3 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl font-bold text-xs uppercase tracking-wider"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quick Quote Modal */}
      {showQuoteModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white dark:bg-[#1a1c1c] text-[#1a1c1c] dark:text-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200 dark:border-slate-800">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#fd6c00]">request_quote</span>
                <h3 className="font-headline font-bold text-base">Instant Quote Estimator</h3>
              </div>
              <button onClick={() => setShowQuoteModal(false)} className="text-slate-400 hover:text-slate-600">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl space-y-1">
                <span className="text-slate-400 uppercase font-bold text-[10px]">Standard Maritime Container</span>
                <p className="font-bold text-sm text-[#000666] dark:text-white">$1,200 – $1,800 / TEU (22-28 Days)</p>
              </div>
              <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-xl space-y-1">
                <span className="text-blue-500 uppercase font-bold text-[10px]">Express Aerial Cargo</span>
                <p className="font-bold text-sm text-[#000666] dark:text-white">$3.80 / KG ($4,850 avg consignment)</p>
              </div>
            </div>
            <button
              onClick={() => {
                setShowQuoteModal(false);
                onNavigate('ship');
              }}
              className="w-full py-3 bg-[#fd6c00] hover:bg-[#e05f00] text-white rounded-xl font-bold text-xs uppercase tracking-wider shadow-lg shadow-orange-600/20 active:scale-95 transition-all"
            >
              Configure Full Request in Wizard →
            </button>
          </div>
        </div>
      )}

      {/* Report Issue Modal with Working Submission */}
      {showIssueModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white dark:bg-[#1a1c1c] text-[#1a1c1c] dark:text-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200 dark:border-slate-800">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-red-600">report_problem</span>
                <h3 className="font-headline font-bold text-base">Report Logistics Incident</h3>
              </div>
              <button onClick={() => setShowIssueModal(false)} className="text-slate-400 hover:text-slate-600">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {issueSuccess ? (
              <div className="p-6 text-center space-y-3">
                <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <span className="material-symbols-outlined text-2xl">check</span>
                </div>
                <h4 className="font-bold text-base text-emerald-600">Ticket #INC-9912 Dispatched</h4>
                <p className="text-xs text-slate-500">
                  Regional operations director notified. An escalation manager is assigned to resolve this delay.
                </p>
                <button
                  onClick={() => setShowIssueModal(false)}
                  className="w-full py-2.5 bg-[#000666] text-white font-bold rounded-xl text-xs uppercase tracking-wider mt-2"
                >
                  Done
                </button>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setIssueSuccess(true);
                }}
                className="space-y-3"
              >
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
                    Shipment / Tracking Code
                  </label>
                  <input
                    type="text"
                    required
                    value={issueTrackingId}
                    onChange={(e) => setIssueTrackingId(e.target.value)}
                    placeholder="Shipment or Tracking ID (e.g. TRK-8812-ORD)"
                    className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs outline-none focus:ring-2 focus:ring-red-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
                    Incident Summary
                  </label>
                  <textarea
                    required
                    value={issueDesc}
                    onChange={(e) => setIssueDesc(e.target.value)}
                    placeholder="Describe issue (damage, customs freeze, delay)..."
                    rows={3}
                    className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowIssueModal(false)}
                    className="flex-1 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl font-bold text-xs uppercase"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-red-600 text-white rounded-xl font-bold text-xs uppercase tracking-wider shadow-md hover:bg-red-700 transition-colors"
                  >
                    Submit Ticket
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Support Modal */}
      {showSupportModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white dark:bg-[#1a1c1c] text-[#1a1c1c] dark:text-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200 dark:border-slate-800">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#fd6c00]">headset_mic</span>
                <h3 className="font-headline font-bold text-base">24/7 Operations Desk</h3>
              </div>
              <button onClick={() => setShowSupportModal(false)} className="text-slate-400 hover:text-slate-600">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
              <p>• Hotline (US/Americas): <strong className="font-mono text-primary dark:text-[#bdc2ff]">+1 (800) 555-0199</strong></p>
              <p>• Marine Traffic Watch (APAC): <strong className="font-mono text-primary dark:text-[#bdc2ff]">+65 6789 0123</strong></p>
              <p>• Emergency Dispatch Radio: VHF Channel 16 / Automated SAR Relay</p>
            </div>
            <button
              onClick={() => setShowSupportModal(false)}
              className="w-full py-3 bg-[#000666] text-white rounded-xl font-bold text-xs uppercase tracking-wider"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
