import React from 'react';
import { ActiveScreen } from '../types';

interface BottomNavProps {
  activeScreen: ActiveScreen;
  onNavigate: (screen: ActiveScreen) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeScreen, onNavigate }) => {
  const tabs = [
    { id: 'dashboard' as ActiveScreen, label: 'HOME', icon: 'dashboard', fill: true },
    { id: 'tracking' as ActiveScreen, label: 'TRACKING', icon: 'location_on', fill: true },
    { id: 'ship' as ActiveScreen, label: 'SHIP', icon: 'add_box', fill: false },
    { id: 'inventory' as ActiveScreen, label: 'INVENTORY', icon: 'inventory_2', fill: true },
    { id: 'analytics' as ActiveScreen, label: 'ANALYTICS', icon: 'analytics', fill: true },
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full z-40 bg-white/90 dark:bg-[#121414]/90 backdrop-blur-2xl border-t border-slate-200/80 dark:border-slate-800/80 rounded-t-2xl shadow-[0_-8px_32px_rgba(0,6,102,0.08)] dark:shadow-[0_-8px_32px_rgba(0,0,0,0.5)] flex justify-around items-center px-4 py-2.5 pb-safe transition-all">
      {tabs.map((tab) => {
        const isActive = activeScreen === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onNavigate(tab.id)}
            className={`flex flex-col items-center justify-center transition-transform duration-200 active:scale-90 ${
              isActive
                ? 'text-orange-600 dark:text-orange-500 bg-orange-50 dark:bg-orange-950/30 rounded-xl px-3 py-1'
                : 'text-slate-500 dark:text-slate-400 opacity-70 hover:opacity-100 px-2 py-1'
            }`}
          >
            <span
              className="material-symbols-outlined text-2xl"
              style={isActive && tab.fill ? { fontVariationSettings: "'FILL' 1" } : {}}
            >
              {tab.icon}
            </span>
            <span className="font-['Inter'] text-[10px] sm:text-[11px] font-semibold tracking-wide uppercase mt-0.5">
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
