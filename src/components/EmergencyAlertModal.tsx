import React, { useState } from 'react';

interface EmergencyAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBroadcast: (reason: string, priority: string) => void;
}

export const EmergencyAlertModal: React.FC<EmergencyAlertModalProps> = ({ isOpen, onClose, onBroadcast }) => {
  const [reason, setReason] = useState('Critical Delay / Highway Closure near Junction 44');
  const [priority, setPriority] = useState<'CRITICAL' | 'HIGH' | 'ADVISORY'>('CRITICAL');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSentSuccess(true);
      onBroadcast(reason, priority);
      setTimeout(() => {
        setSentSuccess(false);
        onClose();
      }, 1400);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#1a1c1c] text-[#1a1c1c] dark:text-[#e2e2e2] rounded-2xl max-w-md w-full shadow-2xl overflow-hidden border border-red-500/20">
        <div className="bg-gradient-to-r from-red-600 to-[#ba1a1a] p-6 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-3xl">warning</span>
            <div>
              <h3 className="font-headline font-black text-lg uppercase tracking-wider">Tactical Emergency Alert</h3>
              <p className="text-xs text-red-100">Broadcast alert to Unit 772-Bravo & Dispatch</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        {sentSuccess ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-950/50 text-red-600 rounded-full flex items-center justify-center mx-auto text-3xl">
              <span className="material-symbols-outlined text-3xl">check_circle</span>
            </div>
            <h4 className="font-headline font-bold text-xl text-red-600">Alert Broadcasted!</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Emergency protocols initiated. Highway reroute dispatched to onboard navigation system.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-2">
                Severity Level
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['CRITICAL', 'HIGH', 'ADVISORY'] as const).map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setPriority(lvl)}
                    className={`py-2 px-3 rounded-lg text-xs font-bold transition-all ${
                      priority === lvl
                        ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-2">
                Alert Description
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={3}
                required
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-sm focus:ring-2 focus:ring-red-500 outline-none"
                placeholder="State the nature of the emergency..."
              />
            </div>

            <div className="p-3 bg-red-50 dark:bg-red-950/30 rounded-xl border border-red-200/50 dark:border-red-900/30 flex items-start gap-3">
              <span className="material-symbols-outlined text-red-600 text-xl shrink-0 mt-0.5">notification_important</span>
              <p className="text-xs text-red-700 dark:text-red-300">
                This will alert California Highway Patrol liaison and lock current waypoint until verified.
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 font-bold rounded-xl text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-all shadow-lg shadow-red-600/30 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <span className="material-symbols-outlined text-sm animate-spin">refresh</span>
                    Broadcasting...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-sm">campaign</span>
                    Send Alert
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
