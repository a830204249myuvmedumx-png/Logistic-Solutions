import React, { useState } from 'react';
import { ActiveScreen, Shipment, InventoryItem } from '../types';
import { INITIAL_SHIPMENTS, INITIAL_INVENTORY_ITEMS } from '../data/mockData';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (screen: ActiveScreen) => void;
  onSelectShipment: (trackingNumber: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
  onSelectShipment,
}) => {
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const filteredShipments = INITIAL_SHIPMENTS.filter(
    (s) =>
      s.trackingNumber.toLowerCase().includes(query.toLowerCase()) ||
      s.origin.toLowerCase().includes(query.toLowerCase()) ||
      s.destination.toLowerCase().includes(query.toLowerCase()) ||
      s.carrier.toLowerCase().includes(query.toLowerCase())
  );

  const filteredInventory = INITIAL_INVENTORY_ITEMS.filter(
    (i) =>
      i.name.toLowerCase().includes(query.toLowerCase()) ||
      i.sku.toLowerCase().includes(query.toLowerCase()) ||
      i.warehouse.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-[130] flex items-start justify-center pt-16 md:pt-24 bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div className="bg-white dark:bg-[#1a1c1c] text-[#1a1c1c] dark:text-[#e2e2e2] rounded-3xl max-w-xl w-full shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-200">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3">
          <span className="material-symbols-outlined text-2xl text-slate-400">search</span>
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search shipments, SKUs, vessels, warehouses, or waypoints..."
            className="flex-1 bg-transparent border-none outline-none text-sm md:text-base font-medium placeholder:text-slate-400"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-white"
            >
              <span className="material-symbols-outlined text-sm">cancel</span>
            </button>
          )}
          <button
            onClick={onClose}
            className="px-2.5 py-1 text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-white"
          >
            ESC
          </button>
        </div>

        {/* Results Body */}
        <div className="p-4 max-h-[60vh] overflow-y-auto space-y-4">
          {/* Quick Categories when query is empty */}
          {!query && (
            <div className="space-y-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Quick Navigation
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[
                  { label: 'Tactical Cockpit', screen: 'navigator', icon: 'near_me' },
                  { label: 'Live Tracking', screen: 'tracking', icon: 'location_on' },
                  { label: 'New Consignment', screen: 'ship', icon: 'add_box' },
                  { label: 'Warehouse Stock', screen: 'inventory', icon: 'inventory_2' },
                  { label: 'Operations Analytics', screen: 'analytics', icon: 'analytics' },
                  { label: 'Dashboard Home', screen: 'dashboard', icon: 'dashboard' },
                ].map((item) => (
                  <button
                    key={item.screen}
                    onClick={() => {
                      onNavigate(item.screen as ActiveScreen);
                      onClose();
                    }}
                    className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl text-left hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-200"
                  >
                    <span className="material-symbols-outlined text-base text-[#fd6c00]">{item.icon}</span>
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Shipments Results */}
          {filteredShipments.length > 0 && (
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Shipments ({filteredShipments.length})
              </span>
              <div className="space-y-1">
                {filteredShipments.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => {
                      onSelectShipment(s.trackingNumber);
                      onNavigate('tracking');
                      onClose();
                    }}
                    className="w-full p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-between text-left transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-[#000666] dark:text-[#bdc2ff] flex items-center justify-center">
                        <span className="material-symbols-outlined text-base">
                          {s.mode === 'sea' ? 'directions_boat' : s.mode === 'air' ? 'flight' : 'local_shipping'}
                        </span>
                      </div>
                      <div>
                        <p className="font-bold text-xs text-primary dark:text-white font-mono">
                          {s.trackingNumber}
                        </p>
                        <p className="text-[11px] text-slate-500">
                          {s.origin} → {s.destination} ({s.carrier})
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        {s.status}
                      </span>
                      <span className="text-[10px] text-[#fd6c00] font-bold block mt-0.5 group-hover:underline">
                        Track Now →
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Inventory Results */}
          {filteredInventory.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Warehouse Inventory ({filteredInventory.length})
              </span>
              <div className="space-y-1">
                {filteredInventory.map((i) => (
                  <button
                    key={i.id}
                    onClick={() => {
                      onNavigate('inventory');
                      onClose();
                    }}
                    className="w-full p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-between text-left transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <img src={i.imageUrl} alt={i.name} className="w-8 h-8 rounded-lg object-cover bg-white" />
                      <div>
                        <p className="font-bold text-xs text-primary dark:text-white">{i.name}</p>
                        <p className="text-[11px] text-slate-500 font-mono">SKU: {i.sku} • {i.warehouse}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-black text-primary dark:text-white">
                        {i.stockLevel} units
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {query && filteredShipments.length === 0 && filteredInventory.length === 0 && (
            <div className="py-8 text-center text-slate-400 space-y-2">
              <span className="material-symbols-outlined text-4xl">search_off</span>
              <p className="text-xs">No records matching "{query}".</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
