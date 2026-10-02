import React, { useState } from 'react';
import { InventoryItem, WarehouseHub } from '../types';
import { INITIAL_INVENTORY_ITEMS, INITIAL_WAREHOUSE_HUBS } from '../data/mockData';
import { RestockModal } from '../components/RestockModal';
import { AddInventoryModal } from '../components/AddInventoryModal';

export const InventoryScreen: React.FC = () => {
  const [hubs] = useState<WarehouseHub[]>(INITIAL_WAREHOUSE_HUBS);
  const [inventory, setInventory] = useState<InventoryItem[]>(INITIAL_INVENTORY_ITEMS);
  const [filterType, setFilterType] = useState<'all' | 'in_stock' | 'low_stock'>('all');
  const [selectedHubFilter, setSelectedHubFilter] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRestockItem, setSelectedRestockItem] = useState<InventoryItem | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [actionMenuId, setActionMenuId] = useState<string | null>(null);
  const [auditLogItem, setAuditLogItem] = useState<InventoryItem | null>(null);

  const handleRestock = (itemId: string, addQuantity: number) => {
    setInventory((prev) =>
      prev.map((item) => {
        if (item.id === itemId) {
          const newLevel = item.stockLevel + addQuantity;
          return {
            ...item,
            stockLevel: newLevel,
            status: newLevel > item.minThreshold ? 'In Stock' : 'Low Stock',
          };
        }
        return item;
      })
    );
  };

  const handleAddNewItem = (newItem: InventoryItem) => {
    setInventory((prev) => [newItem, ...prev]);
  };

  // Filter items
  const filteredItems = inventory.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.warehouse.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (selectedHubFilter && item.warehouse !== selectedHubFilter) {
      return false;
    }

    if (filterType === 'in_stock') return item.status === 'In Stock';
    if (filterType === 'low_stock') return item.status === 'Low Stock' || item.status === 'Out of Stock';
    return true;
  });

  // Low stock alert items
  const criticalItems = inventory.filter((i) => i.stockLevel < i.minThreshold);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-10 mb-24">
      {/* Warehouse Overview */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-1">
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-[#000666] dark:text-[#bdc2ff] font-headline">
              Global Warehouse Network
            </h2>
            <p className="text-xs text-slate-400">Click any hub below to filter regional warehouse stock</p>
          </div>
          <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
            Live Capacity Status
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {hubs.map((hub) => {
            const isNearCap = hub.capacityUsedPercent >= 90;
            const isSelected = selectedHubFilter === hub.name;

            return (
              <div
                key={hub.id}
                onClick={() => setSelectedHubFilter(isSelected ? null : hub.name)}
                className={`rounded-2xl p-5 md:p-6 border shadow-sm hover:shadow-md transition-all space-y-3 cursor-pointer ${
                  isSelected
                    ? 'bg-blue-50 dark:bg-blue-950/40 border-[#fd6c00] ring-2 ring-[#fd6c00]'
                    : 'bg-white dark:bg-[#1a1c1c] text-[#1a1c1c] dark:text-[#e2e2e2] border-slate-200/80 dark:border-slate-800'
                }`}
                title={`Click to filter by ${hub.name}`}
              >
                <div className="flex justify-between items-start">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-[#000666] dark:text-[#bdc2ff] flex items-center justify-center">
                    <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                      {hub.icon}
                    </span>
                  </div>
                  <span
                    className={`text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                      isNearCap
                        ? 'bg-[#fd6c00]/15 text-[#fd6c00]'
                        : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                    }`}
                  >
                    {hub.status}
                  </span>
                </div>
                <div>
                  <div className="flex justify-between items-center">
                    <p className="text-slate-500 dark:text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                      {hub.name}
                    </p>
                    {isSelected && (
                      <span className="text-[10px] font-bold text-[#fd6c00]">FILTERED ✕</span>
                    )}
                  </div>
                  <p className="text-2xl font-black font-headline text-[#000666] dark:text-white tabular-nums mt-0.5">
                    {hub.capacityUsedPercent}%{' '}
                    <span className="text-xs font-normal text-slate-400">Used</span>
                  </p>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isNearCap ? 'bg-[#fd6c00]' : 'bg-[#000666] dark:bg-[#bdc2ff]'
                      }`}
                      style={{ width: `${hub.capacityUsedPercent}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Critical Stock Restoration Banner */}
      {criticalItems.length > 0 && (
        <section className="bg-[#000666] dark:bg-[#1a237e] text-white rounded-3xl p-6 md:p-8 relative overflow-hidden shadow-xl border border-blue-900/40">
          <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none">
            <span className="material-symbols-outlined text-[130px]">warning</span>
          </div>

          <div className="relative z-10 space-y-4">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[#fd6c00] text-2xl">priority_high</span>
              <h2 className="text-xl font-extrabold tracking-tight text-white font-headline">
                Critical Stock Restoration Required
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {criticalItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white/10 dark:bg-white/5 backdrop-blur-md border border-white/15 rounded-2xl p-4 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3.5">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-12 h-12 rounded-xl object-cover bg-white/20 p-1 border border-white/20 shrink-0"
                    />
                    <div>
                      <p className="text-sm font-bold text-white leading-snug">{item.name}</p>
                      <p className="text-xs font-semibold text-[#ffdbcb] dark:text-[#ffb692] mt-0.5">
                        {item.stockLevel === 0
                          ? 'OUT OF STOCK'
                          : `Only ${item.stockLevel} units remaining`}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedRestockItem(item)}
                    className="bg-[#fd6c00] hover:bg-[#e05f00] text-white px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider shadow-lg shadow-orange-600/30 transition-transform active:scale-95 shrink-0"
                  >
                    Restock
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Inventory List Section */}
      <section className="space-y-6">
        {/* Search & Filter Bar */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search SKU or Product Name..."
              className="w-full pl-12 pr-4 py-3 bg-white dark:bg-[#1a1c1c] text-[#1a1c1c] dark:text-white rounded-full border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-[#000666] outline-none text-sm placeholder:text-slate-400 shadow-sm"
            />
          </div>

          <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-1 hide-scrollbar shrink-0">
            <button
              onClick={() => {
                setFilterType('all');
                setSelectedHubFilter(null);
              }}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold shrink-0 transition-all ${
                filterType === 'all' && !selectedHubFilter
                  ? 'bg-[#000666] dark:bg-[#bdc2ff] text-white dark:text-[#000666] shadow-sm'
                  : 'bg-white dark:bg-[#1a1c1c] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-100'
              }`}
            >
              <span className="material-symbols-outlined text-sm">filter_list</span>
              All Locations
            </button>
            <button
              onClick={() => setFilterType('in_stock')}
              className={`px-5 py-2.5 rounded-full text-xs font-bold shrink-0 transition-all ${
                filterType === 'in_stock'
                  ? 'bg-[#000666] dark:bg-[#bdc2ff] text-white dark:text-[#000666] shadow-sm'
                  : 'bg-white dark:bg-[#1a1c1c] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-100'
              }`}
            >
              In Stock
            </button>
            <button
              onClick={() => setFilterType('low_stock')}
              className={`px-5 py-2.5 rounded-full text-xs font-bold shrink-0 transition-all ${
                filterType === 'low_stock'
                  ? 'bg-[#000666] dark:bg-[#bdc2ff] text-white dark:text-[#000666] shadow-sm'
                  : 'bg-white dark:bg-[#1a1c1c] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-100'
              }`}
            >
              Low Stock
            </button>
          </div>
        </div>

        {/* Bento Inventory Table / Cards */}
        <div className="space-y-3">
          {/* Table Header (Desktop) */}
          <div className="hidden md:grid grid-cols-12 px-6 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400">
            <div className="col-span-5">Product Details</div>
            <div className="col-span-2 text-center">Warehouse</div>
            <div className="col-span-2 text-center">Stock Level</div>
            <div className="col-span-2 text-center">Status</div>
            <div className="col-span-1 text-right">Actions</div>
          </div>

          {/* Product Rows */}
          {filteredItems.map((item) => {
            let statusBadge = (
              <span className="px-3 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full text-[10px] font-black uppercase tracking-wider">
                In Stock
              </span>
            );

            if (item.status === 'Low Stock') {
              statusBadge = (
                <span className="px-3 py-1 bg-[#fd6c00]/15 text-[#fd6c00] rounded-full text-[10px] font-black uppercase tracking-wider">
                  Low Stock
                </span>
              );
            } else if (item.status === 'Out of Stock') {
              statusBadge = (
                <span className="px-3 py-1 bg-red-500/15 text-red-600 dark:text-red-400 rounded-full text-[10px] font-black uppercase tracking-wider">
                  Out of Stock
                </span>
              );
            }

            return (
              <div
                key={item.id}
                className="bg-white dark:bg-[#1a1c1c] rounded-2xl px-6 py-5 grid grid-cols-1 md:grid-cols-12 items-center gap-4 transition-all hover:bg-slate-50 dark:hover:bg-[#282a2b] border border-slate-200/70 dark:border-slate-800 shadow-sm relative group"
              >
                {/* Product Info */}
                <div className="col-span-5 flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-slate-100 dark:bg-slate-800 p-1 overflow-hidden shrink-0 border border-slate-200/50 dark:border-slate-700 shadow-sm">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#000666] dark:text-white font-headline text-base">
                      {item.name}
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono tracking-tight">
                      SKU: {item.sku} • ${item.unitPrice} / unit
                    </p>
                  </div>
                </div>

                {/* Warehouse */}
                <div className="col-span-2 text-left md:text-center">
                  <span className="text-[10px] md:hidden font-bold uppercase text-slate-400 mr-2">Hub:</span>
                  <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                    {item.warehouse}
                  </span>
                </div>

                {/* Stock Level */}
                <div className="col-span-2 text-left md:text-center">
                  <span className="text-[10px] md:hidden font-bold uppercase text-slate-400 mr-2">Stock:</span>
                  <span className="text-lg font-black font-headline text-[#000666] dark:text-white tabular-nums">
                    {item.stockLevel.toLocaleString()}{' '}
                    <span className="text-[10px] font-normal opacity-60 text-slate-500">units</span>
                  </span>
                </div>

                {/* Status */}
                <div className="col-span-2 flex justify-start md:justify-center">
                  {statusBadge}
                </div>

                {/* Actions Menu */}
                <div className="col-span-1 flex justify-end relative">
                  <button
                    onClick={() =>
                      setActionMenuId(actionMenuId === item.id ? null : item.id)
                    }
                    className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
                  >
                    <span className="material-symbols-outlined">more_vert</span>
                  </button>

                  {actionMenuId === item.id && (
                    <div className="absolute right-0 top-8 w-44 bg-white dark:bg-[#1a1c1c] rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 p-2 z-20 space-y-1 text-xs animate-in zoom-in-95">
                      <button
                        onClick={() => {
                          setSelectedRestockItem(item);
                          setActionMenuId(null);
                        }}
                        className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-primary dark:text-white font-medium flex items-center gap-2"
                      >
                        <span className="material-symbols-outlined text-sm">restart_alt</span>
                        Restock Units
                      </button>
                      <button
                        onClick={() => {
                          setAuditLogItem(item);
                          setActionMenuId(null);
                        }}
                        className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium flex items-center gap-2"
                      >
                        <span className="material-symbols-outlined text-sm">history</span>
                        View Audit Log
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Floating Action Button for Adding New Stock */}
      <button
        onClick={() => setIsAddModalOpen(true)}
        className="fixed bottom-24 right-6 w-14 h-14 bg-[#fd6c00] hover:bg-[#e05f00] text-white rounded-full shadow-2xl flex items-center justify-center transition-all active:scale-90 hover:scale-105 z-40"
        title="Add New Inventory SKU"
      >
        <span className="material-symbols-outlined text-2xl font-bold">add</span>
      </button>

      {/* Modals */}
      <RestockModal
        item={selectedRestockItem}
        isOpen={Boolean(selectedRestockItem)}
        onClose={() => setSelectedRestockItem(null)}
        onRestock={handleRestock}
      />

      <AddInventoryModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddNewItem}
      />

      {/* Audit Log Modal */}
      {auditLogItem && (
        <div className="fixed inset-0 z-[140] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white dark:bg-[#1a1c1c] text-[#1a1c1c] dark:text-[#e2e2e2] rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200 dark:border-slate-800">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-headline font-bold text-base">SKU Audit Log</h3>
              <button onClick={() => setAuditLogItem(null)} className="p-1 text-slate-400 hover:text-slate-600">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="space-y-2 text-xs">
              <p className="font-bold text-sm text-primary dark:text-white">{auditLogItem.name}</p>
              <p className="font-mono text-slate-400">SKU: {auditLogItem.sku} • {auditLogItem.warehouse}</p>
              <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl space-y-2 font-mono text-[11px] max-h-48 overflow-y-auto">
                <div className="flex justify-between border-b border-slate-200/50 pb-1">
                  <span>2026-10-01 08:30:</span>
                  <span className="text-emerald-600">+100 Inbound Restock</span>
                </div>
                <div className="flex justify-between border-b border-slate-200/50 pb-1">
                  <span>2026-09-28 14:15:</span>
                  <span className="text-red-600">-40 Dispatch (OB-X992)</span>
                </div>
                <div className="flex justify-between">
                  <span>2026-09-24 11:00:</span>
                  <span>Physical Cycle Count Verified</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setAuditLogItem(null)}
              className="w-full py-3 bg-[#000666] text-white rounded-xl font-bold text-xs uppercase tracking-wider"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
