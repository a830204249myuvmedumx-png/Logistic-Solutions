import React, { useState } from 'react';
import { ActiveScreen } from '../types';
import { HOTLINKED_ASSETS } from '../data/mockData';

interface TopNavProps {
  activeScreen: ActiveScreen;
  onNavigate: (screen: ActiveScreen) => void;
  isDark: boolean;
  onToggleDark: () => void;
  lang: 'en' | 'es';
  onToggleLang: () => void;
  isMobileSimulator: boolean;
  onToggleMobileSimulator: () => void;
  notificationCount: number;
  onOpenDrawer: () => void;
  onOpenSearch: () => void;
  onAcknowledgeNotifications?: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({
  activeScreen,
  onNavigate,
  isDark,
  onToggleDark,
  lang,
  onToggleLang,
  isMobileSimulator,
  onToggleMobileSimulator,
  notificationCount,
  onOpenDrawer,
  onOpenSearch,
  onAcknowledgeNotifications,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const [notificationList, setNotificationList] = useState([
    {
      id: 'n-1',
      title: 'Traffic Alert: Junction 44 Reroute',
      time: '4 mins ago',
      desc: 'Unit 772-Bravo rerouted due to central valley congestion (+12m delay).',
      unread: true,
    },
    {
      id: 'n-2',
      title: 'Rotterdam Port Capacity Warning',
      time: '28 mins ago',
      desc: 'Rotterdam Port reaches 94% utilization threshold. Divert secondary shipments.',
      unread: true,
    },
    {
      id: 'n-3',
      title: 'Vessel Arrival Notice',
      time: '1 hour ago',
      desc: 'Maritime Star VII speed nominal at 18.4 knots approaching Singapore waters.',
      unread: false,
    },
  ]);

  const handleAcknowledgeAll = () => {
    setNotificationList((prev) => prev.map((n) => ({ ...n, unread: false })));
    if (onAcknowledgeNotifications) {
      onAcknowledgeNotifications();
    }
  };

  const isEs = lang === 'es';

  return (
    <header className="sticky top-0 z-50 w-full h-16 bg-white/85 dark:bg-[#121414]/90 backdrop-blur-xl border-b border-slate-200/80 dark:border-slate-800/80 px-4 md:px-8 flex justify-between items-center transition-colors">
      {/* Brand & Mobile Hamburger + Main Desktop Nav */}
      <div className="flex items-center gap-3 sm:gap-6 md:gap-8">
        {/* Hamburger Menu on Mobile Viewports */}
        <button
          onClick={onOpenDrawer}
          className="p-2 -ml-2 text-[#000666] dark:text-[#bdc2ff] hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all active:scale-95 flex items-center justify-center"
          title="Open Navigation Menu"
        >
          <span className="material-symbols-outlined text-2xl">menu</span>
        </button>

        {/* Brand Link */}
        <button
          onClick={() => onNavigate('dashboard')}
          className="flex items-center gap-2.5 text-left group transition-transform active:scale-95"
        >
          <div className="w-8 h-8 rounded-lg bg-[#000666] dark:bg-[#bdc2ff] text-white dark:text-[#000666] flex items-center justify-center font-black shadow-md shadow-blue-950/20">
            <span className="material-symbols-outlined text-lg">explore</span>
          </div>
          <div>
            <span className="text-base md:text-lg font-black tracking-tight text-[#000666] dark:text-white uppercase font-headline">
              Precision Navigator
            </span>
            <span className="hidden sm:inline-block text-[10px] text-[#9f4200] dark:text-[#ffb692] font-semibold tracking-wider uppercase ml-2 px-1.5 py-0.5 bg-orange-100/60 dark:bg-orange-950/40 rounded">
              Logistica
            </span>
          </div>
        </button>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
          {[
            { id: 'dashboard', label: isEs ? 'Comandos' : 'Operations', icon: 'dashboard' },
            { id: 'navigator', label: isEs ? 'Cabina Táctica' : 'Tactical Cockpit', icon: 'near_me' },
            { id: 'tracking', label: isEs ? 'Rastreo' : 'Tracking', icon: 'location_on' },
            { id: 'ship', label: isEs ? 'Nuevo Envío' : 'Ship Request', icon: 'add_box' },
            { id: 'inventory', label: isEs ? 'Almacenes' : 'Warehouse Network', icon: 'inventory_2' },
            { id: 'analytics', label: isEs ? 'Analíticas' : 'Analytics', icon: 'analytics' },
          ].map((item) => {
            const isActive = activeScreen === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id as ActiveScreen)}
                className={`px-3 py-1.5 rounded-lg text-xs font-headline font-bold transition-all flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-[#fd6c00]/10 text-[#fd6c00] border-b-2 border-[#fd6c00] rounded-b-none'
                    : 'text-slate-600 dark:text-slate-400 hover:text-[#000666] dark:hover:text-white hover:bg-slate-100/60 dark:hover:bg-slate-800/60'
                }`}
              >
                <span className="material-symbols-outlined text-sm">{item.icon}</span>
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Control Actions & Profile */}
      <div className="flex items-center gap-1.5 sm:gap-2.5">
        {/* Global Search Button */}
        <button
          onClick={onOpenSearch}
          title="Search Manifests, SKUs, and Cargo (⌘K)"
          className="p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all active:scale-95 flex items-center gap-1"
        >
          <span className="material-symbols-outlined text-xl">search</span>
          <span className="hidden xl:inline text-xs font-medium text-slate-400">Search...</span>
        </button>

        {/* Device Mode Switcher (Desktop Full vs Mobile Device Frame) */}
        <button
          onClick={onToggleMobileSimulator}
          title={isMobileSimulator ? 'Switch to Full Desktop View' : 'Preview in Mobile Device View'}
          className={`p-2 rounded-xl transition-all active:scale-95 flex items-center gap-1 text-xs font-semibold ${
            isMobileSimulator
              ? 'bg-[#fd6c00] text-white shadow-md shadow-orange-600/20'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <span className="material-symbols-outlined text-lg">
            {isMobileSimulator ? 'phone_iphone' : 'laptop'}
          </span>
          <span className="hidden xl:inline text-[11px]">
            {isMobileSimulator ? 'Mobile Mode' : 'Desktop View'}
          </span>
        </button>

        {/* Language Toggle */}
        <button
          onClick={onToggleLang}
          title="Toggle Language (English / Español)"
          className="px-2.5 py-1.5 text-xs font-mono font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors active:scale-95"
        >
          {lang === 'en' ? 'ES' : 'EN'}
        </button>

        {/* Theme Toggle */}
        <button
          onClick={onToggleDark}
          title="Toggle Dark / Light Theme"
          className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors active:scale-95"
        >
          <span className="material-symbols-outlined text-lg">
            {isDark ? 'light_mode' : 'dark_mode'}
          </span>
        </button>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfile(false);
            }}
            className="p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors relative active:scale-95"
          >
            <span className="material-symbols-outlined text-xl">notifications</span>
            {notificationCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-[#fd6c00] rounded-full ring-2 ring-white dark:ring-[#121414] animate-pulse" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-[#1a1c1c] text-[#1a1c1c] dark:text-[#e2e2e2] rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-4 space-y-3 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                <span className="font-headline font-bold text-xs uppercase tracking-wider text-primary dark:text-[#bdc2ff]">
                  Operational Signals
                </span>
                <span className="text-[10px] text-slate-400 font-semibold">{notificationList.length} updates</span>
              </div>
              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {notificationList.map((n) => (
                  <div
                    key={n.id}
                    className={`p-3 rounded-2xl transition-colors ${
                      n.unread
                        ? 'bg-orange-50/70 dark:bg-orange-950/20 border-l-2 border-[#fd6c00]'
                        : 'bg-slate-50 dark:bg-slate-800/40'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <p className="text-xs font-bold text-primary dark:text-white">{n.title}</p>
                      <span className="text-[10px] text-slate-400 font-mono">{n.time}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">{n.desc}</p>
                  </div>
                ))}
              </div>
              <button
                onClick={handleAcknowledgeAll}
                className="w-full py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-[#fd6c00] rounded-xl text-xs font-bold uppercase tracking-wider transition-colors"
              >
                Mark all as acknowledged
              </button>
            </div>
          )}
        </div>

        {/* Profile Avatar & Drawer */}
        <div className="relative">
          <button
            onClick={() => {
              setShowProfile(!showProfile);
              setShowNotifications(false);
            }}
            className="w-9 h-9 rounded-full overflow-hidden border-2 border-slate-200 dark:border-slate-700 hover:ring-2 hover:ring-[#fd6c00] transition-all active:scale-95 ml-1"
          >
            <img
              src={HOTLINKED_ASSETS.profileDispatcher}
              alt="Dispatcher Profile"
              className="w-full h-full object-cover"
            />
          </button>

          {showProfile && (
            <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-[#1a1c1c] text-[#1a1c1c] dark:text-[#e2e2e2] rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-4 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center gap-3">
                <img
                  src={HOTLINKED_ASSETS.profileDispatcher}
                  alt="Dispatcher"
                  className="w-12 h-12 rounded-full object-cover border-2 border-[#fd6c00]"
                />
                <div>
                  <h4 className="font-headline font-black text-sm text-primary dark:text-white">Marcus Vance</h4>
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Chief Dispatcher</p>
                  <span className="inline-block mt-1 text-[9px] font-black uppercase tracking-wider text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-1.5 py-0.5 rounded">
                    Active Watch • Level 4
                  </span>
                </div>
              </div>
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Terminal:</span>
                  <span className="font-mono font-semibold">Bay Area Control / US-W</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Assigned Fleet:</span>
                  <span className="font-semibold text-primary dark:text-[#bdc2ff]">12 Active Convoys</span>
                </div>
              </div>
              <div className="space-y-2 pt-1">
                <button
                  onClick={() => {
                    onNavigate('analytics');
                    setShowProfile(false);
                  }}
                  className="w-full py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 font-bold rounded-xl text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300 transition-colors"
                >
                  View Performance Metrics
                </button>
                <button
                  onClick={() => setShowProfile(false)}
                  className="w-full py-2 bg-transparent text-slate-400 hover:text-slate-600 text-xs font-semibold"
                >
                  Close Profile
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
