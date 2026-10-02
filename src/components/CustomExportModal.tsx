import React, { useState } from 'react';

interface CustomExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: (format: string, dateRange: string) => void;
}

export const CustomExportModal: React.FC<CustomExportModalProps> = ({ isOpen, onClose, onExport }) => {
  const [format, setFormat] = useState<'PDF' | 'XLSX' | 'CSV'>('PDF');
  const [dateRange, setDateRange] = useState('Last 30 Days');
  const [region, setRegion] = useState('Global Network');
  const [isExporting, setIsExporting] = useState(false);

  if (!isOpen) return null;

  const handleExport = (e: React.FormEvent) => {
    e.preventDefault();
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      onExport(format, dateRange);
      onClose();
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="bg-white dark:bg-[#1a1c1c] text-[#1a1c1c] dark:text-[#e2e2e2] rounded-2xl max-w-md w-full shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800">
        <div className="p-6 bg-[#000666] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-2xl">tune</span>
            <div>
              <h3 className="font-headline font-bold text-base">Custom Range Export</h3>
              <p className="text-xs text-blue-200">Generate bespoke technical logistics audit</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-white/70 hover:text-white">
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        <form onSubmit={handleExport} className="p-6 space-y-4">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              Export Format
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['PDF', 'XLSX', 'CSV'] as const).map((fmt) => (
                <button
                  key={fmt}
                  type="button"
                  onClick={() => setFormat(fmt)}
                  className={`py-2 rounded-lg text-xs font-bold transition-all ${
                    format === fmt
                      ? 'bg-[#000666] dark:bg-[#bdc2ff] text-white dark:text-[#000666] shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  {fmt} Document
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              Date Period
            </label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary outline-none"
            >
              <option value="Last 7 Days">Last 7 Days (Tactical)</option>
              <option value="Last 30 Days">Last 30 Days (Monthly Ledger)</option>
              <option value="Current Quarter (Q3)">Current Quarter (Q3 2026)</option>
              <option value="Year-to-Date (YTD)">Year-to-Date (YTD 2026)</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              Regional Filter
            </label>
            <select
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary outline-none"
            >
              <option value="Global Network">Global Network (All Corridors)</option>
              <option value="Trans-Pacific (APAC ↔ Americas)">Trans-Pacific (APAC ↔ Americas)</option>
              <option value="Trans-Atlantic (EMEA ↔ Americas)">Trans-Atlantic (EMEA ↔ Americas)</option>
              <option value="Asia-Europe Maritime">Asia-Europe Maritime</option>
            </select>
          </div>

          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded-xl font-bold text-xs uppercase tracking-wider text-slate-600 dark:text-slate-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isExporting}
              className="flex-1 py-3 bg-[#fd6c00] hover:bg-[#e05f00] text-white rounded-xl font-bold text-xs uppercase tracking-wider shadow-lg shadow-orange-600/20 transition-all flex items-center justify-center gap-2"
            >
              {isExporting ? (
                <>
                  <span className="material-symbols-outlined text-sm animate-spin">refresh</span>
                  Compiling...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-sm">download</span>
                  Generate & Download
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
