import React, { useState } from 'react';
import { HOTLINKED_ASSETS } from '../data/mockData';
import {
  SecureHandoverModal,
  ClimateMonitoringModal,
  DedicatedAgentModal,
} from '../components/TrustModals';

interface TrackingScreenProps {
  initialTrackingId?: string;
}

export const TrackingScreen: React.FC<TrackingScreenProps> = ({
  initialTrackingId = 'LI-7700-4829-XQ',
}) => {
  const [searchQuery, setSearchQuery] = useState(initialTrackingId);
  const [activeTrackingId, setActiveTrackingId] = useState(initialTrackingId);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isSearching, setIsSearching] = useState(false);

  // Modals state
  const [isSecureModalOpen, setIsSecureModalOpen] = useState(false);
  const [isClimateModalOpen, setIsClimateModalOpen] = useState(false);
  const [isAgentModalOpen, setIsAgentModalOpen] = useState(false);
  const [selectedMilestone, setSelectedMilestone] = useState<{ title: string; time: string; desc: string } | null>(null);
  const [showVesselModal, setShowVesselModal] = useState(false);

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    setTimeout(() => {
      setActiveTrackingId(searchQuery.trim().toUpperCase());
      setIsSearching(false);
    }, 400);
  };

  return (
    <div className="min-h-screen pb-32">
      {/* Search Header Section */}
      <section className="px-4 md:px-8 pt-8 pb-14 bg-[#000666] dark:bg-[#1a237e] text-white transition-colors">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="space-y-1.5 text-center sm:text-left">
            <h2 className="font-headline text-3xl md:text-4xl font-extrabold tracking-tight text-white">
              Track Your Assets
            </h2>
            <p className="text-blue-200/80 text-xs md:text-sm font-medium tracking-wide uppercase">
              Enter shipment or container ID for real-time telemetry
            </p>
          </div>

          <form onSubmit={handleTrack} className="relative group">
            <div className="absolute inset-y-0 left-4 md:left-5 flex items-center pointer-events-none text-blue-200">
              <span className="material-symbols-outlined text-2xl">travel_explore</span>
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="LI-7700-4829-XQ or Container ID..."
              className="w-full bg-white/10 dark:bg-white/5 border border-white/20 dark:border-white/10 rounded-2xl py-4 md:py-5 pl-12 md:pl-14 pr-28 md:pr-36 text-white placeholder:text-white/40 focus:ring-2 focus:ring-[#fd6c00] outline-none transition-all font-headline font-bold text-base md:text-lg backdrop-blur-md"
            />
            <div className="absolute inset-y-2 right-2 flex items-center">
              <button
                type="submit"
                disabled={isSearching}
                className="bg-[#fd6c00] hover:bg-[#e05f00] text-white px-5 md:px-7 h-full rounded-xl font-black text-xs uppercase tracking-widest transition-all active:scale-95 shadow-lg shadow-orange-600/30 flex items-center gap-2"
              >
                {isSearching ? (
                  <span className="material-symbols-outlined text-sm animate-spin">refresh</span>
                ) : (
                  <>
                    Track <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Quick tracker pills with click handlers */}
          <div className="flex flex-wrap items-center gap-2 text-xs text-blue-200/70 pt-1">
            <span>Quick queries:</span>
            {['LI-7700-4829-XQ', 'SHP-99281-XM', 'AIR-4420-LAX', 'OP-8812-Y7'].map((id) => (
              <button
                key={id}
                type="button"
                onClick={() => {
                  setSearchQuery(id);
                  setActiveTrackingId(id);
                }}
                className={`px-2.5 py-1 rounded-md font-mono text-[11px] transition-colors ${
                  activeTrackingId === id
                    ? 'bg-[#fd6c00] text-white font-bold'
                    : 'bg-white/10 hover:bg-white/20 text-white'
                }`}
              >
                {id}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Live Map & Details Bento */}
      <section className="px-4 md:px-8 -mt-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Map View (Main) */}
          <div className="lg:col-span-8 bg-slate-900 rounded-2xl overflow-hidden min-h-[480px] md:min-h-[580px] relative shadow-xl border border-slate-200/30 dark:border-slate-800">
            <div
              className="w-full h-full relative transition-transform duration-300"
              style={{ transform: `scale(${zoomLevel})` }}
            >
              <img
                src={HOTLINKED_ASSETS.satelliteMap}
                alt="Singapore Strait Satellite Tracking"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Map Overlays (Top Left Floating Cards with Click Handlers) */}
            <div className="absolute top-6 left-6 flex flex-col gap-3 z-10 pointer-events-auto">
              <div
                onClick={() => setShowVesselModal(true)}
                className="glass-panel bg-white/85 dark:bg-[#1a1c1c]/90 p-4 rounded-2xl shadow-xl border border-white/30 dark:border-white/10 max-w-[240px] cursor-pointer hover:scale-105 transition-transform"
                title="Click for vessel specifications"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#000666] dark:bg-[#bdc2ff] text-white dark:text-[#000666] flex items-center justify-center">
                    <span className="material-symbols-outlined text-xl">directions_boat</span>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 font-extrabold uppercase tracking-wider">
                      Current Vessel
                    </p>
                    <p className="font-headline font-black text-sm text-[#000666] dark:text-white">
                      MARITIME STAR VII
                    </p>
                  </div>
                </div>
              </div>

              <div
                onClick={() => setShowVesselModal(true)}
                className="glass-panel bg-white/85 dark:bg-[#1a1c1c]/90 p-4 rounded-2xl shadow-xl border border-white/30 dark:border-white/10 max-w-[240px] cursor-pointer hover:scale-105 transition-transform"
                title="Click for speed and fuel telemetry"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#fd6c00] text-white flex items-center justify-center">
                    <span className="material-symbols-outlined text-xl">speed</span>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 font-extrabold uppercase tracking-wider">
                      Cruising Speed
                    </p>
                    <p className="font-headline font-black text-sm text-[#000666] dark:text-white tabular-nums">
                      18.4 KNOTS
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Zoom Controls */}
            <div className="absolute bottom-6 right-6 z-10 flex flex-col gap-2">
              <button
                onClick={() => setZoomLevel((z) => Math.min(1.8, z + 0.2))}
                className="w-10 h-10 rounded-xl bg-white dark:bg-[#1a1c1c] text-[#000666] dark:text-white shadow-lg flex items-center justify-center hover:bg-slate-50 active:scale-95 transition-all"
                title="Zoom in"
              >
                <span className="material-symbols-outlined text-lg">add</span>
              </button>
              <button
                onClick={() => setZoomLevel((z) => Math.max(0.8, z - 0.2))}
                className="w-10 h-10 rounded-xl bg-white dark:bg-[#1a1c1c] text-[#000666] dark:text-white shadow-lg flex items-center justify-center hover:bg-slate-50 active:scale-95 transition-all"
                title="Zoom out"
              >
                <span className="material-symbols-outlined text-lg">remove</span>
              </button>
            </div>
          </div>

          {/* Shipment Technical Specs & Milestone Progress */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            {/* Manifest Details */}
            <div className="bg-white dark:bg-[#1a1c1c] p-6 md:p-8 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
              <h3 className="font-headline font-extrabold text-xl text-[#000666] dark:text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-[#fd6c00]">info</span>
                Manifest Details
              </h3>

              <div className="space-y-4">
                <div className="flex justify-between items-end border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">Carrier</p>
                    <p className="font-headline font-bold text-sm text-[#000666] dark:text-white">
                      OCEAN-BRIDGE LOGISTICS
                    </p>
                  </div>
                  <span className="material-symbols-outlined text-slate-400 text-lg">corporate_fare</span>
                </div>

                <div className="flex justify-between items-end border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">
                      Flight/Vessel ID
                    </p>
                    <p className="font-headline font-bold text-sm text-[#000666] dark:text-white font-mono">
                      OB-X992-G
                    </p>
                  </div>
                  <span className="material-symbols-outlined text-slate-400 text-lg">tag</span>
                </div>

                <div className="flex justify-between items-end border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">
                      Total Gross Weight
                    </p>
                    <p className="font-headline font-bold text-sm text-[#000666] dark:text-white tabular-nums">
                      14,240.50 KG
                    </p>
                  </div>
                  <span className="material-symbols-outlined text-slate-400 text-lg">weight</span>
                </div>

                <div className="bg-[#ffdbcb]/60 dark:bg-orange-950/40 p-4 rounded-xl border border-orange-200/50 dark:border-orange-900/30">
                  <p className="text-[10px] font-bold text-[#9f4200] dark:text-[#ffb692] tracking-widest uppercase mb-1">
                    Estimated Arrival
                  </p>
                  <div className="flex items-center justify-between">
                    <p className="font-headline font-black text-2xl text-[#341100] dark:text-white">
                      OCT 24, 2026
                    </p>
                    <span className="text-xs font-black uppercase text-[#9f4200] dark:text-[#ffb692] bg-white/60 dark:bg-black/30 px-2 py-0.5 rounded">
                      In 4 Days
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Milestone Progress */}
            <div className="bg-white dark:bg-[#1a1c1c] p-6 md:p-8 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6 flex-grow">
              <div className="flex justify-between items-center">
                <h3 className="font-headline font-extrabold text-xl text-[#000666] dark:text-white">
                  Milestone Progress
                </h3>
                <span className="text-[10px] font-mono text-slate-400 font-bold">{activeTrackingId}</span>
              </div>

              <div className="relative space-y-6">
                <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-slate-200 dark:bg-slate-700" />

                {/* Milestone 1 */}
                <div
                  onClick={() =>
                    setSelectedMilestone({
                      title: 'Origin Departure',
                      time: 'Oct 18 • 09:45',
                      desc: 'Consignment departed Port of Shanghai Terminal 4 after customs clearance and loading into hold 2.',
                    })
                  }
                  className="relative flex gap-5 cursor-pointer group"
                >
                  <div className="z-10 w-6 h-6 rounded-full bg-[#000666] dark:bg-[#bdc2ff] text-white dark:text-[#000666] flex items-center justify-center ring-4 ring-white dark:ring-[#1a1c1c] group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-[14px] font-bold">check</span>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-[#000666] dark:text-[#bdc2ff] uppercase tracking-widest">
                      Oct 18 • 09:45
                    </p>
                    <p className="font-headline font-bold text-sm text-[#1a1c1c] dark:text-white group-hover:text-[#fd6c00] transition-colors">
                      Origin Departure
                    </p>
                    <p className="text-xs text-slate-400">Port of Shanghai, Terminal 4</p>
                  </div>
                </div>

                {/* Milestone 2 */}
                <div
                  onClick={() =>
                    setSelectedMilestone({
                      title: 'International Waters',
                      time: 'Oct 19 • 14:20',
                      desc: 'Vessel safely cleared Taiwan Strait into East China Sea transit corridor under clear maritime radar.',
                    })
                  }
                  className="relative flex gap-5 cursor-pointer group"
                >
                  <div className="z-10 w-6 h-6 rounded-full bg-[#000666] dark:bg-[#bdc2ff] text-white dark:text-[#000666] flex items-center justify-center ring-4 ring-white dark:ring-[#1a1c1c] group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-[14px] font-bold">check</span>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-[#000666] dark:text-[#bdc2ff] uppercase tracking-widest">
                      Oct 19 • 14:20
                    </p>
                    <p className="font-headline font-bold text-sm text-[#1a1c1c] dark:text-white group-hover:text-[#fd6c00] transition-colors">
                      International Waters
                    </p>
                    <p className="text-xs text-slate-400">Vessel crossing East China Sea</p>
                  </div>
                </div>

                {/* Milestone 3 (Active) */}
                <div
                  onClick={() =>
                    setSelectedMilestone({
                      title: 'Approaching Port (Active)',
                      time: 'Current Location',
                      desc: 'Estimated proximity 450nm from Singapore anchorage. Scheduled pilot boat boarding in 16 hours.',
                    })
                  }
                  className="relative flex gap-5 cursor-pointer group"
                >
                  <div className="z-10 w-6 h-6 rounded-full bg-[#fd6c00] flex items-center justify-center ring-4 ring-[#ffdbcb] dark:ring-orange-950 group-hover:scale-110 transition-transform">
                    <div className="w-2 h-2 bg-white rounded-full animate-ping" />
                  </div>
                  <div>
                    <div className="inline-block bg-[#ffdbcb] dark:bg-orange-950/60 px-2 py-0.5 rounded text-[10px] font-black text-[#9f4200] dark:text-[#ffb692] mb-1">
                      IN TRANSIT
                    </div>
                    <p className="font-headline font-bold text-sm text-[#1a1c1c] dark:text-white group-hover:text-[#fd6c00] transition-colors">
                      Approaching Port
                    </p>
                    <p className="text-xs text-slate-400">Estimated proximity 450nm</p>
                  </div>
                </div>

                {/* Milestone 4 (Pending) */}
                <div
                  onClick={() =>
                    setSelectedMilestone({
                      title: 'Customs Clearance',
                      time: 'Estimated Oct 24',
                      desc: 'Pre-clearance documentation approved by Singapore Port Authority. Awaiting physical discharge.',
                    })
                  }
                  className="relative flex gap-5 opacity-50 hover:opacity-100 transition-opacity cursor-pointer group"
                >
                  <div className="z-10 w-6 h-6 rounded-full bg-slate-300 dark:bg-slate-700 flex items-center justify-center ring-4 ring-white dark:ring-[#1a1c1c]" />
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      Estimated Oct 24
                    </p>
                    <p className="font-headline font-bold text-sm text-[#1a1c1c] dark:text-white group-hover:text-[#fd6c00] transition-colors">
                      Customs Clearance
                    </p>
                  </div>
                </div>

                {/* Milestone 5 (Pending) */}
                <div
                  onClick={() =>
                    setSelectedMilestone({
                      title: 'Final Delivery',
                      time: 'Estimated Oct 25',
                      desc: 'Consignee warehouse delivery via inland intermodal freight container truck.',
                    })
                  }
                  className="relative flex gap-5 opacity-50 hover:opacity-100 transition-opacity cursor-pointer group"
                >
                  <div className="z-10 w-6 h-6 rounded-full bg-slate-300 dark:bg-slate-700 flex items-center justify-center ring-4 ring-white dark:ring-[#1a1c1c]" />
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      Estimated Oct 25
                    </p>
                    <p className="font-headline font-bold text-sm text-[#1a1c1c] dark:text-white group-hover:text-[#fd6c00] transition-colors">
                      Final Delivery
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contextual Trust & Operational Specifications with Click Handlers */}
      <section className="px-4 md:px-8 mt-10 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div
            onClick={() => setIsSecureModalOpen(true)}
            className="bg-white dark:bg-[#1a1c1c] p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-2 cursor-pointer hover:border-[#fd6c00] hover:shadow-md transition-all group"
          >
            <div className="flex items-center justify-between">
              <span className="material-symbols-outlined text-[#000666] dark:text-[#bdc2ff] text-2xl group-hover:scale-110 transition-transform">
                security
              </span>
              <span className="text-[10px] font-bold text-[#fd6c00] uppercase">View Ledger →</span>
            </div>
            <h4 className="font-headline font-bold text-[#000666] dark:text-white text-base">
              Secure Handover
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              All milestones are cryptographically signed by on-site controllers to ensure chain of custody integrity.
            </p>
          </div>

          <div
            onClick={() => setIsClimateModalOpen(true)}
            className="bg-white dark:bg-[#1a1c1c] p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-2 cursor-pointer hover:border-[#fd6c00] hover:shadow-md transition-all group"
          >
            <div className="flex items-center justify-between">
              <span className="material-symbols-outlined text-[#000666] dark:text-[#bdc2ff] text-2xl group-hover:scale-110 transition-transform">
                thermostat
              </span>
              <span className="text-[10px] font-bold text-[#fd6c00] uppercase">View Telemetry →</span>
            </div>
            <h4 className="font-headline font-bold text-[#000666] dark:text-white text-base">
              Climate Monitoring
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Shipment is maintained at constant 4°C. No temperature excursions detected in past 48 hours.
            </p>
          </div>

          <div
            onClick={() => setIsAgentModalOpen(true)}
            className="bg-white dark:bg-[#1a1c1c] p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-2 cursor-pointer hover:border-[#fd6c00] hover:shadow-md transition-all group"
          >
            <div className="flex items-center justify-between">
              <span className="material-symbols-outlined text-[#000666] dark:text-[#bdc2ff] text-2xl group-hover:scale-110 transition-transform">
                support_agent
              </span>
              <span className="text-[10px] font-bold text-[#fd6c00] uppercase">Message Sarah →</span>
            </div>
            <h4 className="font-headline font-bold text-[#000666] dark:text-white text-base">
              Dedicated Agent
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Your account manager, Sarah Chen, is monitoring this route for potential weather delays.
            </p>
          </div>
        </div>
      </section>

      {/* Modals */}
      <SecureHandoverModal
        isOpen={isSecureModalOpen}
        onClose={() => setIsSecureModalOpen(false)}
      />

      <ClimateMonitoringModal
        isOpen={isClimateModalOpen}
        onClose={() => setIsClimateModalOpen(false)}
      />

      <DedicatedAgentModal
        isOpen={isAgentModalOpen}
        onClose={() => setIsAgentModalOpen(false)}
      />

      {/* Milestone Checkpoint Modal */}
      {selectedMilestone && (
        <div className="fixed inset-0 z-[140] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white dark:bg-[#1a1c1c] text-[#1a1c1c] dark:text-[#e2e2e2] rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200 dark:border-slate-800">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#fd6c00]">flag</span>
                <h3 className="font-headline font-bold text-base">{selectedMilestone.title}</h3>
              </div>
              <button onClick={() => setSelectedMilestone(null)} className="p-1 text-slate-400 hover:text-slate-600">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="space-y-2 text-xs">
              <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl flex justify-between font-mono">
                <span className="text-slate-400">Timestamp:</span>
                <strong className="text-primary dark:text-[#bdc2ff]">{selectedMilestone.time}</strong>
              </div>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed p-1">
                {selectedMilestone.desc}
              </p>
            </div>
            <button
              onClick={() => setSelectedMilestone(null)}
              className="w-full py-3 bg-[#000666] text-white rounded-xl font-bold text-xs uppercase tracking-wider"
            >
              Close Checkpoint
            </button>
          </div>
        </div>
      )}

      {/* Vessel Profile Modal */}
      {showVesselModal && (
        <div className="fixed inset-0 z-[140] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white dark:bg-[#1a1c1c] text-[#1a1c1c] dark:text-[#e2e2e2] rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200 dark:border-slate-800">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#000666] dark:text-[#bdc2ff]">directions_boat</span>
                <h3 className="font-headline font-bold text-base">MARITIME STAR VII</h3>
              </div>
              <button onClick={() => setShowVesselModal(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between p-2.5 bg-slate-50 dark:bg-slate-900 rounded-xl">
                <span>Vessel Type:</span>
                <strong className="text-primary dark:text-white">Ultra Large Container Vessel (ULCV)</strong>
              </div>
              <div className="flex justify-between p-2.5 bg-slate-50 dark:bg-slate-900 rounded-xl">
                <span>IMO Number:</span>
                <strong className="font-mono text-primary dark:text-white">9821440</strong>
              </div>
              <div className="flex justify-between p-2.5 bg-slate-50 dark:bg-slate-900 rounded-xl">
                <span>Flag State:</span>
                <strong className="text-primary dark:text-white">Singapore (SGP)</strong>
              </div>
              <div className="flex justify-between p-2.5 bg-slate-50 dark:bg-slate-900 rounded-xl">
                <span>Current Speed:</span>
                <strong className="font-mono text-emerald-600">18.4 knots (34.1 km/h)</strong>
              </div>
            </div>
            <button
              onClick={() => setShowVesselModal(false)}
              className="w-full py-3 bg-[#000666] text-white rounded-xl font-bold text-xs uppercase tracking-wider"
            >
              Close Specifications
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
