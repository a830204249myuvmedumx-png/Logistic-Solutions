import React from 'react';
import { ActiveScreen } from '../types';
import { HOTLINKED_ASSETS } from '../data/mockData';

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeScreen: ActiveScreen;
  onNavigate: (screen: ActiveScreen) => void;
  lang: 'en' | 'es';
  onToggleLang: () => void;
  isDark: boolean;
  onToggleDark: () => void;
  onEmergencyAlert: () => void;
}

export const MobileDrawer: React.FC<MobileDrawerProps> = ({
  isOpen,
  onClose,
  activeScreen,
  onNavigate,
  lang,
  onToggleLang,
  isDark,
  onToggleDark,
  onEmergencyAlert,
}) => {
  if (!isOpen) return null;

  const isEs = lang === 'es';

  const menuItems: { id: ActiveScreen; label: string; icon: string; count?: number }[] = [
    { id: 'dashboard', label: isEs ? 'Comandos Operativos' : 'Operations Command', icon: 'dashboard' },
    { id: 'navigator', label: isEs ? 'Cabina Táctica' : 'Tactical Cockpit (Unit 772)', icon: 'near_me' },
    { id: 'tracking', label: isEs ? 'Rastreo Satelital' : 'Live Asset Tracking', icon: 'location_on', count: 12 },
    { id: 'ship', label: isEs ? 'Nuevo Envío' : 'New Shipment Request', icon: 'add_box' },
    { id: 'inventory', label: isEs ? 'Red de Almacenes' : 'Warehouse Inventory', icon: 'inventory_2', count: 4 },
    { id: 'analytics', label: isEs ? 'Inteligencia Operativa' : 'Operations Analytics', icon: 'analytics' },
  ];

  return (
    <div className="fixed inset-0 z-[120] flex animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Drawer Content */}
      <aside className="relative w-80 max-w-[85vw] bg-white dark:bg-[#1a1c1c] text-[#1a1c1c] dark:text-[#e2e2e2] h-full shadow-2xl flex flex-col justify-between p-6 z-10 animate-in slide-in-from-left duration-300">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#000666] dark:bg-[#bdc2ff] text-white dark:text-[#000666] flex items-center justify-center font-black">
                <span className="material-symbols-outlined text-xl">local_shipping</span>
              </div>
              <div>
                <h3 className="font-headline font-black text-base text-[#000666] dark:text-white uppercase tracking-tight">
                  Precision Navigator
                </h3>
                <p className="text-[10px] text-[#fd6c00] font-bold uppercase tracking-widest">
                  Logistica Internacional
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white"
            >
              <span className="material-symbols-outlined text-xl">close</span>
            </button>
          </div>

          {/* Quick Fleet Pill */}
          <div className="p-3.5 bg-blue-50/70 dark:bg-blue-950/30 rounded-2xl border border-blue-100 dark:border-blue-900/40 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <div>
                <p className="text-xs font-bold text-primary dark:text-white">Unit 772-Bravo</p>
                <p className="text-[10px] text-slate-500 font-medium">In Transit • On Time</p>
              </div>
            </div>
            <button
              onClick={() => {
                onNavigate('navigator');
                onClose();
              }}
              className="text-[10px] font-bold uppercase text-[#fd6c00] hover:underline"
            >
              View Route →
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-1">
            {menuItems.map((item) => {
              const isActive = activeScreen === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onNavigate(item.id);
                    onClose();
                  }}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-headline font-bold transition-all text-left ${
                    isActive
                      ? 'bg-[#fd6c00] text-white shadow-md shadow-orange-600/20'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-lg">{item.icon}</span>
                    <span>{item.label}</span>
                  </div>
                  {item.count && (
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                      }`}
                    >
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Controls in Drawer */}
        <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
          {/* Emergency Alert Button in Drawer */}
          <button
            onClick={() => {
              onClose();
              onEmergencyAlert();
            }}
            className="w-full py-3 bg-[#ba1a1a] hover:bg-red-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 text-xs uppercase tracking-wider shadow-md shadow-red-700/20 active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-base">warning</span>
            {isEs ? 'Alerta de Emergencia' : 'Emergency Alert'}
          </button>

          {/* Quick Toggles */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={onToggleDark}
              className="py-2.5 px-3 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              <span className="material-symbols-outlined text-base">
                {isDark ? 'light_mode' : 'dark_mode'}
              </span>
              <span>{isDark ? 'Light Mode' : 'Dark Mode'}</span>
            </button>
            <button
              onClick={onToggleLang}
              className="py-2.5 px-3 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              <span className="material-symbols-outlined text-base">translate</span>
              <span>{lang === 'en' ? 'Español' : 'English'}</span>
            </button>
          </div>

          {/* User Dispatcher snippet */}
          <div className="flex items-center gap-3 pt-2">
            <img
              src={HOTLINKED_ASSETS.profileDispatcher}
              alt="Dispatcher"
              className="w-9 h-9 rounded-full object-cover border border-[#fd6c00]"
            />
            <div className="text-left">
              <p className="text-xs font-bold text-primary dark:text-white">Marcus Vance</p>
              <p className="text-[10px] text-slate-400 font-mono">Dispatcher #US-772</p>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
};
