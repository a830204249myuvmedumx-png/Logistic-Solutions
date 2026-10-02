import React, { useState } from 'react';

// Secure Handover Modal
export const SecureHandoverModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[140] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="bg-white dark:bg-[#1a1c1c] text-[#1a1c1c] dark:text-[#e2e2e2] rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl border border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-[#000666] dark:text-[#bdc2ff] text-2xl">verified_user</span>
            <h3 className="font-headline font-bold text-base">Cryptographic Chain of Custody</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <div className="space-y-3 text-xs text-slate-600 dark:text-slate-300">
          <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl space-y-1 font-mono text-[11px]">
            <p className="text-slate-400 uppercase text-[9px] font-bold">Ledger Block #8849-B2</p>
            <p className="text-primary dark:text-[#bdc2ff] break-all">HASH: 0x9f42d8819a0026e4bc217da559103c814b</p>
            <p className="text-emerald-600 font-bold mt-1">✓ Signature verified: Port of Shanghai Customs Node 04</p>
          </div>
          <p className="leading-relaxed">
            Every container milestone checkpoint is validated using hardware tamper-evident electronic seals (e-Seals) and signed by certified on-site terminal dispatchers.
          </p>
        </div>
        <button
          onClick={onClose}
          className="w-full py-3 bg-[#000666] text-white rounded-xl font-bold text-xs uppercase tracking-wider"
        >
          Close Certificate
        </button>
      </div>
    </div>
  );
};

// Climate Monitoring Modal
export const ClimateMonitoringModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[140] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="bg-white dark:bg-[#1a1c1c] text-[#1a1c1c] dark:text-[#e2e2e2] rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl border border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-[#000666] dark:text-[#bdc2ff] text-2xl">thermostat</span>
            <h3 className="font-headline font-bold text-base">Climate & Cold Chain Telemetry</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-xl text-center">
              <span className="text-[10px] text-slate-400 font-bold uppercase">Core Temperature</span>
              <p className="text-2xl font-black font-headline text-[#000666] dark:text-white tabular-nums">4.1°C</p>
              <span className="text-[9px] text-emerald-600 font-bold">Target: 4.0°C ±0.5</span>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl text-center">
              <span className="text-[10px] text-slate-400 font-bold uppercase">Relative Humidity</span>
              <p className="text-2xl font-black font-headline text-[#000666] dark:text-white tabular-nums">58%</p>
              <span className="text-[9px] text-emerald-600 font-bold">Nominal</span>
            </div>
          </div>
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 rounded-xl border border-emerald-500/20 text-xs text-emerald-800 dark:text-emerald-300">
            ✓ 48-Hour Log: 0 temperature excursions recorded. Continuous dual refrigeration compressor active.
          </div>
        </div>
        <button
          onClick={onClose}
          className="w-full py-3 bg-[#000666] text-white rounded-xl font-bold text-xs uppercase tracking-wider"
        >
          Done
        </button>
      </div>
    </div>
  );
};

// Dedicated Agent Contact Modal
export const DedicatedAgentModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [msg, setMsg] = useState('');
  const [messages, setMessages] = useState([
    { sender: 'agent', text: 'Hello! I am Sarah Chen, monitoring your Maritime Star VII shipment. Weather conditions at East China Sea are stable. How can I assist?' },
  ]);

  if (!isOpen) return null;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!msg.trim()) return;
    const userMsg = msg;
    setMessages((prev) => [...prev, { sender: 'user', text: userMsg }]);
    setMsg('');
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'agent',
          text: `Acknowledged regarding "${userMsg}". I have verified with the vessel captain; docking remains scheduled for 18:45 on berth 7 without changes.`,
        },
      ]);
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-[140] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="bg-white dark:bg-[#1a1c1c] text-[#1a1c1c] dark:text-[#e2e2e2] rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col h-[500px]">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-orange-100 text-[#fd6c00] flex items-center justify-center font-bold">
              SC
            </div>
            <div>
              <h3 className="font-headline font-bold text-sm text-primary dark:text-white">Sarah Chen</h3>
              <p className="text-[10px] text-emerald-600 font-bold">● Online • Senior Account Controller</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto space-y-2 p-2 text-xs">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`p-3 rounded-2xl max-w-[85%] ${
                m.sender === 'user'
                  ? 'ml-auto bg-[#fd6c00] text-white rounded-br-none'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-bl-none'
              }`}
            >
              {m.text}
            </div>
          ))}
        </div>

        {/* Input */}
        <form onSubmit={handleSend} className="flex gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          <input
            type="text"
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            placeholder="Type message to Sarah..."
            className="flex-1 px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs outline-none focus:ring-1 focus:ring-primary"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-[#fd6c00] text-white font-bold rounded-xl text-xs flex items-center gap-1"
          >
            Send <span className="material-symbols-outlined text-sm">send</span>
          </button>
        </form>
      </div>
    </div>
  );
};

// Terms of Service Modal
export const TermsOfServiceModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[140] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="bg-white dark:bg-[#1a1c1c] text-[#1a1c1c] dark:text-[#e2e2e2] rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <h3 className="font-headline font-bold text-base">Global Logistics Terms & Freight Regulations</h3>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <div className="text-xs text-slate-500 dark:text-slate-400 space-y-2.5 max-h-60 overflow-y-auto pr-1">
          <p>
            1. <strong>Incoterms 2020 Compliance:</strong> All consignments adhere to ICC Incoterms standards. Freight insurance defaults to Institute Cargo Clauses (A) unless explicitly overridden.
          </p>
          <p>
            2. <strong>Customs & Declarations:</strong> Harmonized Tariff Schedule (HTS) codes and hazardous materials declarations must be validated prior to border departure.
          </p>
          <p>
            3. <strong>Demurrage & Detention:</strong> Free storage at destination terminal is granted for 72 hours upon vessel berthing.
          </p>
        </div>
        <button
          onClick={onClose}
          className="w-full py-3 bg-[#000666] text-white rounded-xl font-bold text-xs uppercase tracking-wider"
        >
          I Understand & Agree
        </button>
      </div>
    </div>
  );
};
