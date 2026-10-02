import React, { useState } from 'react';
import { InventoryItem } from '../types';

interface RestockModalProps {
  item: InventoryItem | null;
  isOpen: boolean;
  onClose: () => void;
  onRestock: (itemId: string, addQuantity: number) => void;
}

export const RestockModal: React.FC<RestockModalProps> = ({ item, isOpen, onClose, onRestock }) => {
  const [quantity, setQuantity] = useState(100);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !item) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      onRestock(item.id, quantity);
      setIsSubmitting(false);
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="bg-white dark:bg-[#1a1c1c] text-[#1a1c1c] dark:text-[#e2e2e2] rounded-2xl max-w-md w-full shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800">
        <div className="p-6 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-orange-100 dark:bg-orange-950/40 text-orange-600 flex items-center justify-center">
              <span className="material-symbols-outlined">restart_alt</span>
            </div>
            <div>
              <h3 className="font-headline font-bold text-base text-primary dark:text-white">Restock Inventory</h3>
              <p className="text-xs text-slate-500 font-mono">{item.sku}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="flex items-center gap-4 p-3 bg-slate-50 dark:bg-slate-900 rounded-xl">
            <img src={item.imageUrl} alt={item.name} className="w-14 h-14 rounded-lg object-cover bg-white" />
            <div>
              <h4 className="font-bold text-sm text-primary dark:text-white">{item.name}</h4>
              <p className="text-xs text-slate-500">{item.warehouse}</p>
              <p className="text-xs font-semibold text-orange-600 mt-1">Current Stock: {item.stockLevel} units</p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
              Restock Quantity (Units)
            </label>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(10, q - 50))}
                className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-lg font-bold hover:bg-slate-200 transition-colors"
              >
                -50
              </button>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="flex-1 text-center font-headline font-extrabold text-xl py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
              />
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 50)}
                className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-lg font-bold hover:bg-slate-200 transition-colors"
              >
                +50
              </button>
            </div>
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
              disabled={isSubmitting}
              className="flex-1 py-3 bg-[#fd6c00] hover:bg-[#e05f00] text-white rounded-xl font-bold text-xs uppercase tracking-wider shadow-lg shadow-orange-600/20 transition-all flex items-center justify-center gap-2"
            >
              {isSubmitting ? 'Confirming...' : `Confirm +${quantity} Units`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
