import { useState, useEffect } from 'react';
import { ActiveScreen } from './types';
import { TopNav } from './components/TopNav';
import { BottomNav } from './components/BottomNav';
import { MobileDrawer } from './components/MobileDrawer';
import { SearchModal } from './components/SearchModal';
import { EmergencyAlertModal } from './components/EmergencyAlertModal';
import { TacticalNavigatorScreen } from './screens/TacticalNavigatorScreen';
import { DashboardScreen } from './screens/DashboardScreen';
import { ShipmentWizardScreen } from './screens/ShipmentWizardScreen';
import { TrackingScreen } from './screens/TrackingScreen';
import { InventoryScreen } from './screens/InventoryScreen';
import { AnalyticsScreen } from './screens/AnalyticsScreen';

export default function App() {
  const [activeScreen, setActiveScreen] = useState<ActiveScreen>('dashboard');
  const [isDark, setIsDark] = useState(false);
  const [lang, setLang] = useState<'en' | 'es'>('en');
  const [isMobileSimulator, setIsMobileSimulator] = useState(false);
  const [trackedShipmentId, setTrackedShipmentId] = useState('LI-7700-4829-XQ');
  const [notificationsCount, setNotificationsCount] = useState(3);

  // Global Navigation Modals
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isGlobalEmergencyOpen, setIsGlobalEmergencyOpen] = useState(false);

  // Sync dark mode class on <html>
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }
  }, [isDark]);

  // Global keyboard shortcut: Cmd+K / Ctrl+K opens search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleExportManifest = () => {
    const blob = new Blob(
      [
        `UNIT 772-BRAVO ROUTE MANIFEST\nTimestamp,Waypoint,SubLocation,Status\n09:20,Logistics Hub - Zone A,Bakersfield Interchange,Arrived\n13:45,Coastal Resupply Point,Highway 101 Access,Arrived\n15:30,Central Valley Terminal,Highway Junction 44,Delayed +12m (Traffic congestion reroute active)\n17:15,Oakland Cargo Gate,Terminal 4-B,Upcoming\n18:45,San Francisco Port,Global Berth 7,Destination\n`,
      ],
      { type: 'text/csv;charset=utf-8' }
    );
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Unit-772-Bravo_Manifest_Route.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleSelectShipmentToTrack = (id: string) => {
    setTrackedShipmentId(id);
    setActiveScreen('tracking');
  };

  const renderActiveScreen = () => {
    switch (activeScreen) {
      case 'navigator':
        return <TacticalNavigatorScreen onExportManifest={handleExportManifest} />;
      case 'dashboard':
        return (
          <DashboardScreen
            onNavigate={setActiveScreen}
            lang={lang}
            onSelectShipmentToTrack={handleSelectShipmentToTrack}
            onOpenSearch={() => setIsSearchOpen(true)}
          />
        );
      case 'tracking':
        return <TrackingScreen initialTrackingId={trackedShipmentId} />;
      case 'ship':
        return (
          <ShipmentWizardScreen
            onNavigate={setActiveScreen}
            onShipmentCreated={(newId) => {
              setTrackedShipmentId(newId);
              setNotificationsCount((c) => c + 1);
            }}
          />
        );
      case 'inventory':
        return <InventoryScreen />;
      case 'analytics':
        return (
          <AnalyticsScreen
            onNavigate={setActiveScreen}
            onSelectShipmentToTrack={handleSelectShipmentToTrack}
          />
        );
      default:
        return <TacticalNavigatorScreen onExportManifest={handleExportManifest} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#f9f9f9] dark:bg-[#121414] text-[#1a1c1c] dark:text-[#e2e2e2] flex flex-col font-body transition-colors selection:bg-[#ffdbcb] selection:text-[#341100]">
      {/* Universal Top Bar */}
      <TopNav
        activeScreen={activeScreen}
        onNavigate={setActiveScreen}
        isDark={isDark}
        onToggleDark={() => setIsDark(!isDark)}
        lang={lang}
        onToggleLang={() => setLang(lang === 'en' ? 'es' : 'en')}
        isMobileSimulator={isMobileSimulator}
        onToggleMobileSimulator={() => setIsMobileSimulator(!isMobileSimulator)}
        notificationCount={notificationsCount}
        onOpenDrawer={() => setIsDrawerOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onAcknowledgeNotifications={() => setNotificationsCount(0)}
      />

      {/* Main Workspace */}
      {isMobileSimulator ? (
        /* Mobile Simulator Frame */
        <div className="flex-1 py-8 px-4 flex flex-col items-center justify-center bg-slate-200/70 dark:bg-black/80">
          <div className="mb-4 flex items-center gap-3">
            <span className="text-xs font-bold font-headline uppercase tracking-wider text-slate-600 dark:text-slate-400">
              Mobile Device Preview (iPhone 15 Pro)
            </span>
            <button
              onClick={() => setIsMobileSimulator(false)}
              className="text-xs text-[#fd6c00] font-bold hover:underline"
            >
              Exit to Full Desktop
            </button>
          </div>

          {/* Smartphone Frame Bezel */}
          <div className="w-[390px] h-[844px] bg-white dark:bg-[#121414] rounded-[52px] shadow-[0_25px_70px_rgba(0,0,0,0.35)] border-[12px] border-slate-900 dark:border-slate-800 overflow-hidden relative flex flex-col">
            {/* Dynamic Island Speaker Notch */}
            <div className="absolute top-3 left-1/2 -translate-x-1/2 w-28 h-6 bg-black rounded-full z-50 flex items-center justify-end pr-2.5">
              <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-700" />
            </div>

            {/* Mobile Scrollable Viewport */}
            <div className="flex-1 overflow-y-auto pt-6 pb-20 relative hide-scrollbar">
              {renderActiveScreen()}
            </div>

            {/* Mobile Bottom Navigation Bar */}
            <BottomNav activeScreen={activeScreen} onNavigate={setActiveScreen} />

            {/* Home Indicator Bar */}
            <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-36 h-1 bg-slate-400/50 rounded-full z-50 pointer-events-none" />
          </div>
        </div>
      ) : (
        /* Full Desktop & Responsive Viewport */
        <div className="flex-1 flex flex-col relative">
          {renderActiveScreen()}

          {/* Responsive Bottom Navigation on small viewports */}
          <div className="lg:hidden">
            <BottomNav activeScreen={activeScreen} onNavigate={setActiveScreen} />
          </div>
        </div>
      )}

      {/* Slide-out Mobile Navigation Drawer */}
      <MobileDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        activeScreen={activeScreen}
        onNavigate={setActiveScreen}
        lang={lang}
        onToggleLang={() => setLang(lang === 'en' ? 'es' : 'en')}
        isDark={isDark}
        onToggleDark={() => setIsDark(!isDark)}
        onEmergencyAlert={() => setIsGlobalEmergencyOpen(true)}
      />

      {/* Global Interactive Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onNavigate={setActiveScreen}
        onSelectShipment={handleSelectShipmentToTrack}
      />

      {/* Global Emergency Alert Modal */}
      <EmergencyAlertModal
        isOpen={isGlobalEmergencyOpen}
        onClose={() => setIsGlobalEmergencyOpen(false)}
        onBroadcast={(reason, priority) => {
          alert(`Global Alert [${priority}]: ${reason}`);
        }}
      />
    </div>
  );
}
