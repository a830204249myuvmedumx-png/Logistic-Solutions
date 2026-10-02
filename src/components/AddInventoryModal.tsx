import React, { useState } from 'react';
import { InventoryItem } from '../types';
import { HOTLINKED_ASSETS } from '../data/mockData';

interface AddInventoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (newItem: InventoryItem) => void;
}

export const AddInventoryModal: React.FC<AddInventoryModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [name, setName] = useState('');
  const [sku, setSku] = useState('SKU-');
  const [warehouse, setWarehouse] = useState('Singapore Central');
  const [stockLevel, setStockLevel] = useState(250);
  const [minThreshold, setMinThreshold] = useState(50);
  const [category, setCategory] = useState('Electronics & Automation');
  const [unitPrice, setUnitPrice] = useState(450);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const item: InventoryItem = {
      id: 'inv-' + Date.now(),
      name,
      sku: sku.toUpperCase(),
      warehouse,
      stockLevel,
      minThreshold,
      status: stockLevel > minThreshold ? 'In Stock' : stockLevel > 0 ? 'Low Stock' : 'Out of Stock',
      imageUrl: HOTLINKED_ASSETS.productLens,
      category,
      unitPrice,
    };

    onAdd(item);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="bg-white dark:bg-[#1a1c1c] text-[#1a1c1c] dark:text-[#e2e2e2] rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800">
        <div className="p-6 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary dark:text-[#bdc2ff] flex items-center justify-center">
              <span className="material-symbols-outlined">add_box</span>
            </div>
            <div>
              <h3 className="font-headline font-bold text-base text-primary dark:text-white">Register New Inventory SKU</h3>
              <p className="text-xs text-slate-500">Add asset to global warehouse network</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              Product / Asset Name
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Servo Motor Controller V3"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-3 text-sm focus:ring-2 focus:ring-[#fd6c00] outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                SKU Identifier
              </label>
              <input
                type="text"
                required
                placeholder="SKU-882-NL"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                className="w-full font-mono bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-3 text-sm focus:ring-2 focus:ring-[#fd6c00] outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                Warehouse Hub
              </label>
              <select
                value={warehouse}
                onChange={(e) => setWarehouse(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-3 text-sm focus:ring-2 focus:ring-[#fd6c00] outline-none"
              >
                <option value="Singapore Central">Singapore Central</option>
                <option value="Rotterdam Port">Rotterdam Port</option>
                <option value="Los Angeles West">Los Angeles West</option>
                <option value="Dubai Logistics City">Dubai Logistics City</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                Initial Stock
              </label>
              <input
                type="number"
                min="0"
                value={stockLevel}
                onChange={(e) => setStockLevel(Number(e.target.value))}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-3 text-sm font-bold focus:ring-2 focus:ring-[#fd6c00] outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                Min Threshold
              </label>
              <input
                type="number"
                min="1"
                value={minThreshold}
                onChange={(e) => setMinThreshold(Number(e.target.value))}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-3 text-sm font-bold focus:ring-2 focus:ring-[#fd6c00] outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                Unit Value ($)
              </label>
              <input
                type="number"
                min="0"
                value={unitPrice}
                onChange={(e) => setUnitPrice(Number(e.target.value))}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-3 text-sm font-bold focus:ring-2 focus:ring-[#fd6c00] outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              Category
            </label>
            <input
              type="text"
              placeholder="e.g. Avionics, Mechanical, Medical"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-3 text-sm focus:ring-2 focus:ring-[#fd6c00] outline-none"
            />
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
              className="flex-1 py-3 bg-[#000666] hover:bg-[#1a237e] text-white rounded-xl font-bold text-xs uppercase tracking-wider shadow-lg transition-all"
            >
              Save Asset to Hub
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
