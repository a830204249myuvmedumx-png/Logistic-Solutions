import React, { useState } from 'react';
import { CustomExportModal } from '../components/CustomExportModal';
import { ActiveScreen } from '../types';

interface AnalyticsScreenProps {
  onNavigate?: (screen: ActiveScreen) => void;
  onSelectShipmentToTrack?: (shipmentId: string) => void;
}

export const AnalyticsScreen: React.FC<AnalyticsScreenProps> = ({
  onNavigate,
  onSelectShipmentToTrack,
}) => {
  const [selectedCorridor, setSelectedCorridor] = useState('Global Network');
  const [timeRange, setTimeRange] = useState('Last 30 Days');
  const [hoveredMonth, setHoveredMonth] = useState<string | null>(null);
  const [isCustomExportOpen, setIsCustomExportOpen] = useState(false);
  const [downloadSuccessNotice, setDownloadSuccessNotice] = useState<string | null>(null);

  // Shipment performance table state
  const [tableSearch, setTableSearch] = useState('');
  const [activePage, setActivePage] = useState(1);

  const monthlyVolume = [
    { month: 'Jan', air: 40, sea: 65, total: '1.2k' },
    { month: 'Feb', air: 65, sea: 70, total: '1.8k' },
    { month: 'Mar', air: 55, sea: 60, total: '1.5k' },
    { month: 'Apr', air: 85, sea: 80, total: '2.4k' },
    { month: 'May', air: 70, sea: 85, total: '2.1k' },
    { month: 'Jun', air: 95, sea: 90, total: '2.9k' },
    { month: 'Jul', air: 60, sea: 70, total: '1.7k' },
  ];

  const recentPerformance = [
    {
      id: '#OP-9942-X1',
      carrier: 'Maersk Line',
      destination: 'Rotterdam, NL',
      status: 'In Transit',
      delay: 'None',
      statusColor: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    },
    {
      id: '#OP-8812-Y7',
      carrier: 'MSC Logistics',
      destination: 'Singapore, SG',
      status: 'Delayed',
      delay: '14 Hours',
      statusColor: 'bg-orange-500/15 text-[#fd6c00]',
    },
    {
      id: '#OP-7721-Z4',
      carrier: 'CMA CGM',
      destination: 'Long Beach, US',
      status: 'Processing',
      delay: 'None',
      statusColor: 'bg-blue-500/10 text-[#000666] dark:text-[#bdc2ff]',
    },
    {
      id: '#OP-5531-A3',
      carrier: 'Hapag-Lloyd',
      destination: 'Hamburg, DE',
      status: 'Delivered',
      delay: 'None',
      statusColor: 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300',
    },
  ];

  const handleDownload = (filename: string) => {
    // Generate text/csv blob to simulate authentic file download
    const blob = new Blob([`Report: ${filename}\nGenerated: ${new Date().toISOString()}\nStatus: Verified Audit`], {
      type: 'text/plain;charset=utf-8',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setDownloadSuccessNotice(`Successfully downloaded ${filename}`);
    setTimeout(() => setDownloadSuccessNotice(null), 3000);
  };

  const filteredPerformance = recentPerformance.filter(
    (p) =>
      p.id.toLowerCase().includes(tableSearch.toLowerCase()) ||
      p.carrier.toLowerCase().includes(tableSearch.toLowerCase()) ||
      p.destination.toLowerCase().includes(tableSearch.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 pt-8 pb-32 space-y-12">
      {/* Header & Region Filter */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <span className="font-headline font-bold text-[#9f4200] dark:text-[#ffb692] uppercase tracking-[0.2em] text-xs">
            Technical Intelligence
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-[#000666] dark:text-[#bdc2ff] tracking-tight font-headline">
            Operations Analytics
          </h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-xl font-medium leading-relaxed text-sm md:text-base">
            Strategic oversight of global logistics performance and operational efficiency across all transit corridors.
          </p>
        </div>

        {/* Filter controls */}
        <div className="flex flex-wrap items-center gap-3 bg-white dark:bg-[#1a1c1c] p-2 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200/50 dark:border-slate-800">
            <span className="material-symbols-outlined text-[#000666] dark:text-[#bdc2ff] text-lg">public</span>
            <select
              value={selectedCorridor}
              onChange={(e) => setSelectedCorridor(e.target.value)}
              className="bg-transparent border-none text-xs font-bold text-[#000666] dark:text-white outline-none cursor-pointer pr-4"
            >
              <option value="Global Network">Global Network</option>
              <option value="North America">North America</option>
              <option value="European Union">European Union</option>
              <option value="Asia Pacific">Asia Pacific</option>
              <option value="LATAM">LATAM</option>
            </select>
          </div>

          <button
            onClick={() => setTimeRange(timeRange === 'Last 30 Days' ? 'Last 90 Days' : 'Last 30 Days')}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#fd6c00] hover:bg-[#e05f00] text-white font-bold text-xs rounded-xl shadow-lg shadow-orange-600/25 active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-sm">calendar_month</span>
            {timeRange}
          </button>
        </div>
      </section>

      {/* Download Alert Toast */}
      {downloadSuccessNotice && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 rounded-2xl text-xs font-bold flex items-center gap-3 shadow-md animate-in fade-in">
          <span className="material-symbols-outlined text-emerald-600">check_circle</span>
          {downloadSuccessNotice}
        </div>
      )}

      {/* Efficiency KPI Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* KPI 1 */}
        <div className="bg-white dark:bg-[#1a1c1c] text-[#1a1c1c] dark:text-[#e2e2e2] p-8 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex justify-between items-start">
            <div className="p-3 bg-blue-50 dark:bg-blue-950/40 rounded-xl text-[#000666] dark:text-[#bdc2ff]">
              <span className="material-symbols-outlined text-2xl">speed</span>
            </div>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-md">
              -12% vs LY
            </span>
          </div>
          <div>
            <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">
              Average Transit Time
            </p>
            <p className="text-5xl font-black text-[#000666] dark:text-white font-headline mt-1 tracking-tighter tabular-nums">
              4.2 <span className="text-xl font-bold opacity-50">Days</span>
            </p>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div className="bg-[#000666] dark:bg-[#bdc2ff] w-3/4 h-full rounded-full" />
          </div>
        </div>

        {/* KPI 2 */}
        <div className="bg-white dark:bg-[#1a1c1c] text-[#1a1c1c] dark:text-[#e2e2e2] p-8 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex justify-between items-start">
            <div className="p-3 bg-orange-50 dark:bg-orange-950/40 rounded-xl text-[#fd6c00]">
              <span className="material-symbols-outlined text-2xl">payments</span>
            </div>
            <span className="text-xs font-bold text-[#fd6c00] bg-orange-50 dark:bg-orange-950/40 px-2.5 py-1 rounded-md">
              +3.4% vs LY
            </span>
          </div>
          <div>
            <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">
              Logistics Cost per Unit
            </p>
            <p className="text-5xl font-black text-[#000666] dark:text-white font-headline mt-1 tracking-tighter tabular-nums">
              $12.85
            </p>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div className="bg-[#fd6c00] w-1/2 h-full rounded-full" />
          </div>
        </div>

        {/* KPI 3 */}
        <div className="bg-white dark:bg-[#1a1c1c] text-[#1a1c1c] dark:text-[#e2e2e2] p-8 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex justify-between items-start">
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl text-emerald-600">
              <span className="material-symbols-outlined text-2xl">task_alt</span>
            </div>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-md">
              Target: 96%
            </span>
          </div>
          <div>
            <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">
              On-Time Performance
            </p>
            <p className="text-5xl font-black text-[#000666] dark:text-white font-headline mt-1 tracking-tighter tabular-nums">
              98.2%
            </p>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div className="bg-emerald-500 w-[98%] h-full rounded-full" />
          </div>
        </div>
      </section>

      {/* Bento Grid: Charts */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Shipping Volume Over Time */}
        <div className="lg:col-span-8 bg-white dark:bg-[#1a1c1c] p-6 md:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 mb-8">
            <div>
              <h3 className="text-xl font-black text-[#000666] dark:text-white font-headline">
                Shipping Volume Over Time
              </h3>
              <p className="text-xs text-slate-400">Monthly corridor aggregate (TEUs & Metric Tons)</p>
            </div>
            <div className="flex gap-4">
              <span className="flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-300">
                <span className="w-3 h-3 rounded-full bg-[#000666] dark:bg-[#bdc2ff]" /> Air
              </span>
              <span className="flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-300">
                <span className="w-3 h-3 rounded-full bg-[#fd6c00]" /> Sea
              </span>
            </div>
          </div>

          {/* Interactive Bar Chart Representation */}
          <div className="h-64 flex items-end justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-2 px-2">
            {monthlyVolume.map((m) => (
              <div
                key={m.month}
                onMouseEnter={() => setHoveredMonth(m.month)}
                onMouseLeave={() => setHoveredMonth(null)}
                className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer"
              >
                {/* Tooltip */}
                {hoveredMonth === m.month && (
                  <div className="mb-2 bg-[#000666] text-white text-[10px] font-bold px-2 py-1 rounded shadow-lg animate-in fade-in">
                    {m.total} TEU
                  </div>
                )}
                <div className="w-full max-w-[40px] flex items-end justify-center gap-1 h-full">
                  {/* Air bar */}
                  <div
                    className="w-1/2 bg-[#000666] dark:bg-[#bdc2ff] rounded-t-md transition-all group-hover:brightness-125"
                    style={{ height: `${m.air}%` }}
                  />
                  {/* Sea bar */}
                  <div
                    className="w-1/2 bg-[#fd6c00] rounded-t-md transition-all group-hover:brightness-125"
                    style={{ height: `${m.sea}%` }}
                  />
                </div>
                <span className="mt-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider font-mono">
                  {m.month}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Cost Distribution (Side Radial Chart) */}
        <div className="lg:col-span-4 bg-[#000666] dark:bg-[#1a237e] text-white p-6 md:p-8 rounded-3xl shadow-xl flex flex-col justify-between border border-blue-900/40">
          <div>
            <h3 className="text-xl font-black font-headline text-white mb-1">Cost Distribution</h3>
            <p className="text-blue-200/70 text-xs leading-relaxed">
              Allocation by shipping modality for the current fiscal quarter.
            </p>
          </div>

          {/* Donut representation */}
          <div className="relative py-6 flex justify-center">
            <div className="w-40 h-40 rounded-full border-[14px] border-blue-500/20 relative flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-[14px] border-[#fd6c00] border-l-transparent border-b-transparent -rotate-45" />
              <div className="text-center">
                <span className="text-3xl font-black font-headline text-white tabular-nums">$2.4M</span>
                <p className="text-[10px] text-blue-200/70 uppercase tracking-wider font-bold">Total Q3</p>
              </div>
            </div>
          </div>

          <div className="space-y-2.5 text-xs font-bold pt-2 border-t border-white/10">
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#fd6c00]" /> Ocean Freight
              </span>
              <span className="font-mono text-sm">64%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#bdc2ff]" /> Air Express
              </span>
              <span className="font-mono text-sm">22%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-white/40" /> Road / Rail
              </span>
              <span className="font-mono text-sm">14%</span>
            </div>
          </div>
        </div>
      </section>

      {/* Reports Section */}
      <section className="bg-white dark:bg-[#1a1c1c] rounded-3xl p-6 md:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <h3 className="text-2xl font-black text-[#000666] dark:text-white font-headline">
              Export Manifests & Reports
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Download high-fidelity operational data for internal auditing.
            </p>
          </div>
          <button
            onClick={() => setIsCustomExportOpen(true)}
            className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-[#000666] dark:text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-colors self-start md:self-auto"
          >
            <span className="material-symbols-outlined text-sm">filter_list</span>
            All Report Types
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Report 1 */}
          <div className="bg-slate-50 dark:bg-slate-900/60 p-5 rounded-2xl border border-slate-200/60 dark:border-slate-800 flex flex-col justify-between group hover:border-[#fd6c00] transition-colors">
            <div className="mb-4 text-[#fd6c00]">
              <span className="material-symbols-outlined text-4xl">description</span>
            </div>
            <div>
              <h4 className="font-bold text-[#000666] dark:text-white text-sm mb-1">
                Q3 Performance Audit
              </h4>
              <p className="text-[11px] text-slate-400 mb-4 font-mono">PDF • 4.2 MB • Oct 12, 2026</p>
            </div>
            <button
              onClick={() => handleDownload('Q3_Performance_Audit_2026.pdf')}
              className="w-full py-2.5 bg-white dark:bg-slate-800 group-hover:bg-[#fd6c00] group-hover:text-white text-[#000666] dark:text-white rounded-xl text-xs font-black uppercase tracking-wider transition-colors shadow-sm"
            >
              DOWNLOAD
            </button>
          </div>

          {/* Report 2 */}
          <div className="bg-slate-50 dark:bg-slate-900/60 p-5 rounded-2xl border border-slate-200/60 dark:border-slate-800 flex flex-col justify-between group hover:border-[#fd6c00] transition-colors">
            <div className="mb-4 text-[#000666] dark:text-[#bdc2ff]">
              <span className="material-symbols-outlined text-4xl">table_view</span>
            </div>
            <div>
              <h4 className="font-bold text-[#000666] dark:text-white text-sm mb-1">
                Cost Optimization Data
              </h4>
              <p className="text-[11px] text-slate-400 mb-4 font-mono">XLSX • 12.8 MB • Oct 10, 2026</p>
            </div>
            <button
              onClick={() => handleDownload('Cost_Optimization_Data_Q3.xlsx')}
              className="w-full py-2.5 bg-white dark:bg-slate-800 group-hover:bg-[#fd6c00] group-hover:text-white text-[#000666] dark:text-white rounded-xl text-xs font-black uppercase tracking-wider transition-colors shadow-sm"
            >
              DOWNLOAD
            </button>
          </div>

          {/* Report 3 */}
          <div className="bg-slate-50 dark:bg-slate-900/60 p-5 rounded-2xl border border-slate-200/60 dark:border-slate-800 flex flex-col justify-between group hover:border-[#fd6c00] transition-colors">
            <div className="mb-4 text-orange-400">
              <span className="material-symbols-outlined text-4xl">analytics</span>
            </div>
            <div>
              <h4 className="font-bold text-[#000666] dark:text-white text-sm mb-1">
                Transit Delay Analysis
              </h4>
              <p className="text-[11px] text-slate-400 mb-4 font-mono">PDF • 1.1 MB • Oct 05, 2026</p>
            </div>
            <button
              onClick={() => handleDownload('Transit_Delay_Analysis_Report.pdf')}
              className="w-full py-2.5 bg-white dark:bg-slate-800 group-hover:bg-[#fd6c00] group-hover:text-white text-[#000666] dark:text-white rounded-xl text-xs font-black uppercase tracking-wider transition-colors shadow-sm"
            >
              DOWNLOAD
            </button>
          </div>

          {/* Custom Range Card */}
          <div className="bg-[#000666] dark:bg-[#1a237e] p-5 rounded-2xl flex flex-col justify-between border-2 border-dashed border-blue-400/40 text-white">
            <div>
              <h4 className="font-bold text-white text-sm mb-1">Custom Range Export</h4>
              <p className="text-[11px] text-blue-200/80 mb-4 leading-relaxed">
                Specify your parameters to generate a bespoke technical report.
              </p>
            </div>
            <button
              onClick={() => setIsCustomExportOpen(true)}
              className="w-full py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-colors"
            >
              CONFIGURE REPORT
            </button>
          </div>
        </div>
      </section>

      {/* Recent Shipment Performance Table */}
      <section className="bg-white dark:bg-[#1a1c1c] rounded-3xl shadow-sm border border-slate-200/80 dark:border-slate-800 overflow-hidden">
        <div className="px-6 md:px-8 py-5 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
          <h3 className="text-xl font-black text-[#000666] dark:text-white font-headline">
            Recent Shipment Performance
          </h3>
          <div className="flex items-center gap-2">
            <div className="relative">
              <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
                search
              </span>
              <input
                type="text"
                placeholder="Filter manifest..."
                value={tableSearch}
                onChange={(e) => setTableSearch(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 rounded-lg outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400 text-[10px] font-bold tracking-widest uppercase">
                <th className="px-6 md:px-8 py-4">Shipment ID</th>
                <th className="px-6 md:px-8 py-4">Carrier</th>
                <th className="px-6 md:px-8 py-4">Destination</th>
                <th className="px-6 md:px-8 py-4">Status</th>
                <th className="px-6 md:px-8 py-4">Delay</th>
                <th className="px-6 md:px-8 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="text-sm font-medium divide-y divide-slate-100 dark:divide-slate-800">
              {filteredPerformance.map((row) => (
                <tr
                  key={row.id}
                  className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <td className="px-6 md:px-8 py-4 font-mono text-xs font-bold text-[#000666] dark:text-[#bdc2ff]">
                    {row.id}
                  </td>
                  <td className="px-6 md:px-8 py-4 text-slate-700 dark:text-slate-300 text-xs">
                    {row.carrier}
                  </td>
                  <td className="px-6 md:px-8 py-4 text-slate-700 dark:text-slate-300 text-xs">
                    {row.destination}
                  </td>
                  <td className="px-6 md:px-8 py-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${row.statusColor}`}>
                      {row.status}
                    </span>
                  </td>
                  <td className={`px-6 md:px-8 py-4 text-xs font-bold ${row.delay !== 'None' ? 'text-red-600' : 'text-slate-400'}`}>
                    {row.delay}
                  </td>
                  <td className="px-6 md:px-8 py-4 text-right">
                    <button
                      onClick={() => {
                        if (onSelectShipmentToTrack) {
                          onSelectShipmentToTrack(row.id);
                        }
                        if (onNavigate) {
                          onNavigate('tracking');
                        }
                      }}
                      className="text-[#000666] dark:text-[#bdc2ff] hover:underline text-xs font-bold"
                    >
                      Track
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-6 md:px-8 py-4 bg-slate-50/60 dark:bg-slate-900/60 flex justify-between items-center text-xs text-slate-500">
          <p className="text-[10px] font-bold uppercase tracking-wider">
            Showing {filteredPerformance.length} of 248 items
          </p>
          <div className="flex space-x-1">
            <button
              onClick={() => setActivePage(1)}
              className={`w-7 h-7 flex items-center justify-center rounded-lg font-bold text-xs ${
                activePage === 1 ? 'bg-[#000666] text-white' : 'bg-slate-200 dark:bg-slate-800'
              }`}
            >
              1
            </button>
            <button
              onClick={() => setActivePage(2)}
              className={`w-7 h-7 flex items-center justify-center rounded-lg font-bold text-xs ${
                activePage === 2 ? 'bg-[#000666] text-white' : 'bg-slate-200 dark:bg-slate-800'
              }`}
            >
              2
            </button>
          </div>
        </div>
      </section>

      {/* Custom Export Modal */}
      <CustomExportModal
        isOpen={isCustomExportOpen}
        onClose={() => setIsCustomExportOpen(false)}
        onExport={(fmt, range) => {
          handleDownload(`Bespoke_Logistics_Export_${range.replace(/\s+/g, '_')}.${fmt.toLowerCase()}`);
        }}
      />
    </div>
  );
};
