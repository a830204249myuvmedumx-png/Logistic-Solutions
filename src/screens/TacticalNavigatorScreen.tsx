import React, { useState } from 'react';
import { HOTLINKED_ASSETS, INITIAL_WAYPOINTS, INITIAL_TELEMETRY } from '../data/mockData';
import { Waypoint, TelemetryData } from '../types';
import { EmergencyAlertModal } from '../components/EmergencyAlertModal';

interface TacticalNavigatorScreenProps {
  onExportManifest: () => void;
}

export const TacticalNavigatorScreen: React.FC<TacticalNavigatorScreenProps> = ({ onExportManifest }) => {
  const [waypoints, setWaypoints] = useState<Waypoint[]>(INITIAL_WAYPOINTS);
  const [telemetry, setTelemetry] = useState<TelemetryData>(INITIAL_TELEMETRY);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [activeSideTab, setActiveSideTab] = useState<'map' | 'status' | 'stops' | 'telemetry' | 'history'>('status');
  const [mapType, setMapType] = useState<'topographic' | 'satellite'>('topographic');
  const [selectedWaypoint, setSelectedWaypoint] = useState<Waypoint | null>(null);
  const [showDiagnosticsModal, setShowDiagnosticsModal] = useState(false);
  const [showFuelModal, setShowFuelModal] = useState(false);
  const [showWeatherModal, setShowWeatherModal] = useState(false);
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  const handleBroadcastAlert = (reason: string, priority: string) => {
    setWaypoints((prev) =>
      prev.map((wp) =>
        wp.id === 'wp-3'
          ? { ...wp, note: `[${priority}] ${reason}` }
          : wp
      )
    );
  };

  const handleExport = () => {
    setExportNotice('Manifest Log exported: Unit-772-Bravo_Waypoints.csv');
    onExportManifest();
    setTimeout(() => setExportNotice(null), 3500);
  };

  const handleSpeedPulse = () => {
    setTelemetry((prev) => ({
      ...prev,
      speedKmh: prev.speedKmh >= 95 ? 78 : prev.speedKmh + 4,
    }));
  };

  return (
    <div className="relative min-h-[calc(100vh-64px)] w-full flex flex-col lg:flex-row bg-[#f9f9f9] dark:bg-[#121414] text-[#1a1c1c] dark:text-[#e2e2e2] overflow-x-hidden">
      {/* SideNavBar (Desktop Left) */}
      <aside className="w-full lg:w-72 shrink-0 bg-slate-50 dark:bg-[#1a1c1c] border-b lg:border-b-0 lg:border-r border-slate-200/70 dark:border-slate-800/80 flex flex-col justify-between pt-4 pb-6">
        <div>
          {/* Unit Status Header */}
          <div className="px-6 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#000666] dark:bg-[#bdc2ff] flex items-center justify-center text-white dark:text-[#000666] shadow-md shadow-blue-900/20">
                <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                  local_shipping
                </span>
              </div>
              <div>
                <h3 className="text-sm font-bold font-headline text-[#000666] dark:text-white">Unit 772-Bravo</h3>
                <p className="text-[10px] text-[#9f4200] dark:text-[#ffb692] font-black uppercase tracking-widest">
                  In Transit - On Time
                </p>
              </div>
            </div>
          </div>

          {/* Navigation Links with Real Handlers */}
          <nav className="flex flex-col gap-1 px-3">
            {[
              { id: 'map', label: 'Active Map', icon: 'map', desc: 'Toggle Topographic / Satellite' },
              { id: 'status', label: 'Vehicle Status', icon: 'local_shipping', fill: true, desc: 'Live Convoy Status' },
              { id: 'stops', label: 'Stop Schedule', icon: 'reorder', desc: '5 Registered Waypoints' },
              { id: 'telemetry', label: 'Telemetry', icon: 'analytics', desc: 'Engine & Sensors' },
              { id: 'history', label: 'History', icon: 'history', desc: 'Past Transit Corridors' },
            ].map((nav) => {
              const isActive = activeSideTab === nav.id;
              return (
                <button
                  key={nav.id}
                  onClick={() => {
                    setActiveSideTab(nav.id as any);
                    if (nav.id === 'map') {
                      setMapType((prev) => (prev === 'topographic' ? 'satellite' : 'topographic'));
                    } else if (nav.id === 'telemetry') {
                      setShowDiagnosticsModal(true);
                    } else if (nav.id === 'stops') {
                      setSelectedWaypoint(waypoints[2]);
                    }
                  }}
                  className={`flex items-center justify-between px-6 py-3.5 transition-all font-body text-sm tracking-wide text-left ${
                    isActive
                      ? 'bg-white dark:bg-[#282a2b] text-[#fd6c00] rounded-r-full font-bold shadow-sm translate-x-1'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 font-medium'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="material-symbols-outlined text-lg"
                      style={isActive && nav.fill ? { fontVariationSettings: "'FILL' 1" } : {}}
                    >
                      {nav.icon}
                    </span>
                    <span>{nav.label}</span>
                  </div>
                  {nav.id === 'map' && (
                    <span className="text-[9px] font-mono uppercase bg-slate-200 dark:bg-slate-800 px-1.5 py-0.5 rounded text-slate-500">
                      {mapType === 'topographic' ? 'TOPO' : 'SAT'}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Quick Map Layer Toggle Pill */}
          <div className="mx-6 mt-4 p-3 bg-white dark:bg-[#282a2b] rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Map Rendering Mode</span>
            <div className="grid grid-cols-2 gap-1.5">
              <button
                onClick={() => setMapType('topographic')}
                className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all ${
                  mapType === 'topographic'
                    ? 'bg-[#000666] text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                }`}
              >
                Topographic
              </button>
              <button
                onClick={() => setMapType('satellite')}
                className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all ${
                  mapType === 'satellite'
                    ? 'bg-[#000666] text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                }`}
              >
                Satellite
              </button>
            </div>
          </div>
        </div>

        {/* Emergency Alert Button */}
        <div className="px-6 mt-6">
          <button
            onClick={() => setIsAlertOpen(true)}
            className="w-full py-3.5 bg-[#ba1a1a] hover:bg-red-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-red-700/20 active:scale-95 transition-all text-xs uppercase tracking-wider"
          >
            <span className="material-symbols-outlined text-lg">warning</span>
            Emergency Alert
          </button>
        </div>
      </aside>

      {/* Main Map Canvas Area */}
      <main className="flex-1 relative min-h-[560px] lg:min-h-auto overflow-hidden flex flex-col justify-between">
        {/* Background Map Image with Overlay */}
        <div className="absolute inset-0 bg-slate-900 transition-all duration-500">
          <img
            src={mapType === 'topographic' ? HOTLINKED_ASSETS.topographicMap : HOTLINKED_ASSETS.satelliteMap}
            alt="Navigation Map"
            className="w-full h-full object-cover opacity-90 filter contrast-125 brightness-95"
          />
          {/* Subtle gradient vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none" />

          {/* Animated SVG GPS Route Layer */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="neonGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#00e5ff" stopOpacity="0.9" />
                <stop offset="50%" stopColor="#00b0ff" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#fd6c00" stopOpacity="1" />
              </linearGradient>
              <filter id="glowEffect" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <path
              d="M 120 480 Q 240 380 340 320 T 520 280 T 680 200 T 820 180"
              fill="none"
              stroke="url(#neonGlow)"
              strokeWidth="4"
              strokeDasharray="6 3"
              filter="url(#glowEffect)"
              className="animate-pulse"
            />
          </svg>
        </div>

        {/* Route Info Overlay (Top-Left Floating Bento) */}
        <div className="relative z-10 p-4 md:p-8 max-w-sm">
          <div className="bg-white/90 dark:bg-[#1a1c1c]/90 backdrop-blur-xl p-5 md:p-6 rounded-2xl shadow-2xl border border-white/40 dark:border-white/10">
            <div className="flex justify-between items-start mb-3">
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">
                  Route Destination
                </span>
                <h2 className="text-xl font-black font-headline text-[#000666] dark:text-white">
                  San Francisco Port
                </h2>
              </div>
              <span className="bg-[#fd6c00]/15 text-[#fd6c00] text-[10px] px-2.5 py-1 rounded-md font-extrabold uppercase tracking-wide">
                ETA 18:45
              </span>
            </div>
            <div className="flex gap-4 items-center mt-3">
              <div className="flex-1 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div className="w-3/4 h-full bg-[#fd6c00] rounded-full transition-all duration-500" />
              </div>
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 font-mono">
                75% Complete
              </span>
            </div>
            <div className="mt-3 pt-3 border-t border-slate-200/50 dark:border-slate-800 flex justify-between text-[11px] text-slate-500">
              <span>Distance Left: <strong>62 km</strong></span>
              <span>Next Checkpoint: <strong>Terminal 4-B</strong></span>
            </div>
          </div>
        </div>

        {/* Telemetry Overlay (Bottom Floating Bento Bar with Interactive Gauges) */}
        <div className="relative z-10 p-4 md:p-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {/* Speed KPI */}
            <div
              onClick={handleSpeedPulse}
              title="Click to modulate ground speed"
              className="bg-[#000666]/95 dark:bg-[#1a237e]/95 backdrop-blur-xl p-5 rounded-2xl text-white shadow-2xl flex flex-col justify-between h-32 border-l-4 border-[#fd6c00] cursor-pointer hover:brightness-110 transition-all group"
            >
              <div className="flex justify-between items-center opacity-70">
                <span className="text-[10px] font-bold uppercase tracking-widest">Ground Speed</span>
                <span className="material-symbols-outlined text-sm group-hover:scale-110 transition-transform">speed</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl md:text-4xl font-black font-headline tracking-tighter tabular-nums">
                  {telemetry.speedKmh}
                </span>
                <span className="text-xs font-medium opacity-60">km/h</span>
              </div>
              <span className="text-[9px] text-[#bdc2ff] opacity-80">Click to throttle speed</span>
            </div>

            {/* Fuel KPI */}
            <div
              onClick={() => setShowFuelModal(true)}
              title="Click to view fuel station telemetry"
              className="bg-white/90 dark:bg-[#1e2020]/90 backdrop-blur-xl p-5 rounded-2xl shadow-2xl flex flex-col justify-between h-32 border border-white/20 dark:border-white/5 cursor-pointer hover:bg-white dark:hover:bg-[#282a2b] transition-all group"
            >
              <div className="flex justify-between items-center text-slate-500 dark:text-slate-400">
                <span className="text-[10px] font-bold uppercase tracking-widest">Fuel Reserve</span>
                <span className="material-symbols-outlined text-sm group-hover:scale-110 transition-transform">local_gas_station</span>
              </div>
              <div>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-3xl md:text-4xl font-black font-headline tracking-tighter text-[#000666] dark:text-white tabular-nums">
                    {telemetry.fuelPercent}
                  </span>
                  <span className="text-xs font-medium text-slate-500">%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#fd6c00] rounded-full"
                    style={{ width: `${telemetry.fuelPercent}%` }}
                  />
                </div>
              </div>
              <span className="text-[9px] text-[#fd6c00] font-bold">Est. Range: 410 km</span>
            </div>

            {/* Engine Status KPI */}
            <div
              onClick={() => setShowDiagnosticsModal(true)}
              title="Click to inspect powertrain diagnostics"
              className="bg-white/90 dark:bg-[#1e2020]/90 backdrop-blur-xl p-5 rounded-2xl shadow-2xl flex flex-col justify-between h-32 border border-white/20 dark:border-white/5 cursor-pointer hover:bg-white dark:hover:bg-[#282a2b] transition-all group"
            >
              <div className="flex justify-between items-center text-slate-500 dark:text-slate-400">
                <span className="text-[10px] font-bold uppercase tracking-widest">Engine Status</span>
                <span className="material-symbols-outlined text-sm group-hover:scale-110 transition-transform">settings_input_component</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3.5 h-3.5 rounded-full bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.7)] animate-pulse" />
                <span className="text-xl md:text-2xl font-black font-headline tracking-tight text-[#000666] dark:text-white uppercase">
                  {telemetry.engineStatus}
                </span>
              </div>
              <span className="text-[9px] text-emerald-600 font-bold">All 12 Sensors Nominal</span>
            </div>

            {/* Weather / Local Conditions */}
            <div
              onClick={() => setShowWeatherModal(true)}
              title="Click to view detailed weather radar"
              className="col-span-2 md:col-span-1 bg-[#fd6c00] hover:bg-[#e05f00] p-5 rounded-2xl text-white shadow-2xl flex flex-col justify-between h-32 cursor-pointer transition-all"
            >
              <div className="flex justify-between items-center opacity-85">
                <span className="text-[10px] font-bold uppercase tracking-widest">Local Conditions</span>
                <span className="material-symbols-outlined text-sm">cloud</span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-2xl md:text-3xl font-black font-headline tracking-tighter">
                    {telemetry.temperatureC}°C
                  </span>
                  <p className="text-[10px] uppercase font-bold opacity-80">{telemetry.conditionsText}</p>
                </div>
                <div className="h-8 w-px bg-white/25" />
                <div>
                  <span className="text-2xl md:text-3xl font-black font-headline tracking-tighter">
                    {telemetry.windSpeedMs}m/s
                  </span>
                  <p className="text-[10px] uppercase font-bold opacity-80">{telemetry.windDirection}</p>
                </div>
              </div>
              <span className="text-[9px] text-white/80">Click for Doppler Radar</span>
            </div>
          </div>
        </div>
      </main>

      {/* Right Side Panel: Route Manifest */}
      <aside className="w-full lg:w-80 shrink-0 bg-white dark:bg-[#1a1c1c] border-t lg:border-t-0 lg:border-l border-slate-200/70 dark:border-slate-800/80 shadow-[-10px_0_30px_rgba(0,0,0,0.03)] flex flex-col justify-between">
        <div>
          {/* Header */}
          <div className="p-6 md:p-8 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
            <div>
              <h2 className="text-lg font-black font-headline text-[#000666] dark:text-white mb-1">Route Manifest</h2>
              <p className="text-xs text-slate-500 font-medium tracking-wide">
                {waypoints.length} Registered Waypoints
              </p>
            </div>
            <button
              onClick={() => setSelectedWaypoint(waypoints[0])}
              className="p-1 text-slate-400 hover:text-slate-600"
              title="Inspect Waypoints"
            >
              <span className="material-symbols-outlined text-lg">info</span>
            </button>
          </div>

          {/* Export notification banner */}
          {exportNotice && (
            <div className="mx-6 mt-4 p-3 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 rounded-xl text-xs font-semibold flex items-center gap-2">
              <span className="material-symbols-outlined text-base">check_circle</span>
              {exportNotice}
            </div>
          )}

          {/* Waypoints Timeline List with Click Inspection */}
          <div className="p-6 space-y-6 max-h-[calc(100vh-280px)] overflow-y-auto">
            {waypoints.map((wp, index) => {
              if (wp.status === 'arrived') {
                return (
                  <div
                    key={wp.id}
                    onClick={() => setSelectedWaypoint(wp)}
                    className="relative pl-8 cursor-pointer group"
                  >
                    {index < waypoints.length - 1 && (
                      <div className="absolute left-[3px] top-2 bottom-[-24px] w-0.5 bg-[#fd6c00]/30" />
                    )}
                    <div className="absolute left-0 top-1.5 w-2 h-2 rounded-full bg-[#fd6c00] shadow-[0_0_8px_rgba(253,108,0,0.6)] group-hover:scale-125 transition-transform" />
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-[10px] font-bold text-[#fd6c00] uppercase tracking-widest">
                        {wp.timeLabel}
                      </span>
                      <span
                        className="material-symbols-outlined text-emerald-500 text-sm"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        check_circle
                      </span>
                    </div>
                    <h4 className="font-bold text-[#000666] dark:text-white text-sm group-hover:text-[#fd6c00] transition-colors">{wp.name}</h4>
                    <p className="text-xs text-slate-400 font-medium">{wp.subLocation}</p>
                  </div>
                );
              }

              if (wp.status === 'delayed') {
                return (
                  <div
                    key={wp.id}
                    onClick={() => setSelectedWaypoint(wp)}
                    className="relative pl-8 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-red-500/20 cursor-pointer group"
                  >
                    {index < waypoints.length - 1 && (
                      <div className="absolute left-[3px] top-6 bottom-[-24px] w-0.5 bg-[#fd6c00]/30" />
                    )}
                    <div className="absolute left-[-2px] top-5 w-4 h-4 rounded-full bg-[#fd6c00] flex items-center justify-center border-4 border-white dark:border-[#1a1c1c]">
                      <div className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                    </div>
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-[10px] font-bold text-[#ba1a1a] dark:text-[#ffb4ab] uppercase tracking-widest">
                        {wp.timeLabel}
                      </span>
                      <span
                        className="material-symbols-outlined text-[#ba1a1a] dark:text-[#ffb4ab] text-sm"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        schedule
                      </span>
                    </div>
                    <h4 className="font-black text-[#000666] dark:text-white text-sm mb-1 group-hover:text-[#fd6c00] transition-colors">{wp.name}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-2.5">
                      {wp.subLocation}
                    </p>
                    {wp.note && (
                      <div className="bg-red-50 dark:bg-red-950/40 p-2.5 rounded-lg text-[10px] text-red-600 dark:text-red-300 font-bold leading-relaxed border border-red-200/50 dark:border-red-900/30">
                        {wp.note}
                      </div>
                    )}
                  </div>
                );
              }

              // Upcoming or Destination
              return (
                <div
                  key={wp.id}
                  onClick={() => setSelectedWaypoint(wp)}
                  className="relative pl-8 opacity-60 hover:opacity-100 transition-opacity cursor-pointer group"
                >
                  {index < waypoints.length - 1 && (
                    <div className="absolute left-[3px] top-2 bottom-[-24px] w-0.5 border-l-2 border-dashed border-slate-300 dark:border-slate-700" />
                  )}
                  <div className="absolute left-0 top-1.5 w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-600 group-hover:scale-125 transition-transform" />
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                      {wp.timeLabel}
                    </span>
                  </div>
                  <h4 className="font-bold text-[#000666] dark:text-white text-sm group-hover:text-[#fd6c00] transition-colors">{wp.name}</h4>
                  <p className="text-xs text-slate-400 font-medium">{wp.subLocation}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Panel Footer Action */}
        <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-[#1a1c1c]">
          <button
            onClick={handleExport}
            className="w-full py-4 bg-[#000666] hover:bg-[#1a237e] text-white rounded-xl font-black font-headline uppercase tracking-widest text-xs shadow-lg shadow-blue-950/20 active:scale-95 transition-all flex items-center justify-center gap-3"
          >
            <span className="material-symbols-outlined text-sm">file_download</span>
            Export Log Manifest
          </button>
        </div>
      </aside>

      {/* Emergency Alert Modal */}
      <EmergencyAlertModal
        isOpen={isAlertOpen}
        onClose={() => setIsAlertOpen(false)}
        onBroadcast={handleBroadcastAlert}
      />

      {/* Waypoint Inspector Modal */}
      {selectedWaypoint && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white dark:bg-[#1a1c1c] text-[#1a1c1c] dark:text-[#e2e2e2] rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200 dark:border-slate-800">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#fd6c00]">pin_drop</span>
                <h3 className="font-headline font-bold text-base">Waypoint Inspector</h3>
              </div>
              <button onClick={() => setSelectedWaypoint(null)} className="p-1 text-slate-400 hover:text-slate-600">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="space-y-3 text-xs">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Waypoint Name</span>
                <p className="font-bold text-sm text-[#000666] dark:text-white">{selectedWaypoint.name}</p>
                <p className="text-slate-500">{selectedWaypoint.subLocation}</p>
              </div>
              <div className="flex justify-between p-3 bg-slate-50 dark:bg-slate-900 rounded-xl">
                <span>Timeline Status:</span>
                <strong className="uppercase text-[#fd6c00]">{selectedWaypoint.timeLabel}</strong>
              </div>
              {selectedWaypoint.note && (
                <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/30 rounded-xl text-red-600 font-semibold">
                  {selectedWaypoint.note}
                </div>
              )}
            </div>
            <button
              onClick={() => setSelectedWaypoint(null)}
              className="w-full py-3 bg-[#000666] text-white rounded-xl font-bold text-xs uppercase tracking-wider"
            >
              Close Inspector
            </button>
          </div>
        </div>
      )}

      {/* Engine Diagnostics Modal */}
      {showDiagnosticsModal && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white dark:bg-[#1a1c1c] text-[#1a1c1c] dark:text-[#e2e2e2] rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200 dark:border-slate-800">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-emerald-500">settings_suggest</span>
                <h3 className="font-headline font-bold text-base">Powertrain Diagnostics</h3>
              </div>
              <button onClick={() => setShowDiagnosticsModal(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between p-3 bg-slate-50 dark:bg-slate-900 rounded-xl">
                <span>Coolant Temperature:</span>
                <strong className="font-mono text-emerald-600">89°C (Optimal)</strong>
              </div>
              <div className="flex justify-between p-3 bg-slate-50 dark:bg-slate-900 rounded-xl">
                <span>Oil Pressure:</span>
                <strong className="font-mono text-emerald-600">42 PSI</strong>
              </div>
              <div className="flex justify-between p-3 bg-slate-50 dark:bg-slate-900 rounded-xl">
                <span>Transmission Torque:</span>
                <strong className="font-mono text-emerald-600">1,850 Nm</strong>
              </div>
              <div className="flex justify-between p-3 bg-slate-50 dark:bg-slate-900 rounded-xl">
                <span>ECU Firmware:</span>
                <strong className="font-mono text-primary dark:text-[#bdc2ff]">v2026.4.12-Certified</strong>
              </div>
            </div>
            <button
              onClick={() => setShowDiagnosticsModal(false)}
              className="w-full py-3 bg-[#000666] text-white rounded-xl font-bold text-xs uppercase tracking-wider"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* Fuel Station Planner Modal */}
      {showFuelModal && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white dark:bg-[#1a1c1c] text-[#1a1c1c] dark:text-[#e2e2e2] rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200 dark:border-slate-800">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#fd6c00]">local_gas_station</span>
                <h3 className="font-headline font-bold text-base">Fuel & Resupply Planner</h3>
              </div>
              <button onClick={() => setShowFuelModal(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="space-y-3 text-xs">
              <div className="p-3 bg-orange-50 dark:bg-orange-950/30 rounded-xl text-orange-900 dark:text-orange-200">
                Current Reserve: <strong>65% (410 km range)</strong>. Next partner station: Pilot Flying J, Tracy CA (38 km).
              </div>
              <button
                onClick={() => {
                  alert('Refueling stop waypoint scheduled at Tracy, CA Interchange.');
                  setShowFuelModal(false);
                }}
                className="w-full py-2.5 bg-[#fd6c00] text-white font-bold rounded-xl text-xs uppercase tracking-wider"
              >
                Schedule Refueling Stop (+15m)
              </button>
            </div>
            <button
              onClick={() => setShowFuelModal(false)}
              className="w-full py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold rounded-xl text-xs"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Weather Radar Modal */}
      {showWeatherModal && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white dark:bg-[#1a1c1c] text-[#1a1c1c] dark:text-[#e2e2e2] rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200 dark:border-slate-800">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-blue-500">cyclone</span>
                <h3 className="font-headline font-bold text-base">Live Doppler Radar & Wind</h3>
              </div>
              <button onClick={() => setShowWeatherModal(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="space-y-3 text-xs">
              <p>• Ambient Air: <strong>18°C (64°F)</strong></p>
              <p>• Wind Vectors: <strong>12 m/s NW Gusting to 15 m/s</strong></p>
              <p>• Precipitation: Light mist / road surface friction index 0.78 (Stable)</p>
              <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-xl text-blue-900 dark:text-blue-200 font-semibold">
                No severe storm warnings on current route corridor to San Francisco Port.
              </div>
            </div>
            <button
              onClick={() => setShowWeatherModal(false)}
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
