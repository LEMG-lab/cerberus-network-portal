import { useState } from 'react';
import { Play, CheckCircle2, Settings, Layers, Lock } from 'lucide-react';

export default function Demo() {
  const [step, setStep] = useState(0);
  const [isSimulating, setIsSimulating] = useState(false);

  const runSimulation = () => {
    if (isSimulating) return;
    setIsSimulating(true);
    setStep(1);
    
    setTimeout(() => setStep(2), 1500);
    setTimeout(() => setStep(3), 3000);
    setTimeout(() => setStep(4), 4500);
    setTimeout(() => {
      setStep(5);
      setIsSimulating(false);
    }, 6000);
  };

  const steps = [
    { title: 'Operation Created', icon: <Settings size={24} />, desc: 'ERP data mapped to Cerberus Standard' },
    { title: 'Evidence Generated', icon: <Layers size={24} />, desc: 'Materiality builder compiles documentation' },
    { title: 'Hash Computed', icon: <Lock size={24} />, desc: 'SHA-256 cryptographic proof derived' },
    { title: 'Contract Execution', icon: <Play size={24} />, desc: 'Cerberus Ledger records operation' },
    { title: 'Triple-Chain Audit', icon: <CheckCircle2 size={24} />, desc: 'Cerberus / Global Force / Base registry complete' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="text-center space-y-4 mb-16">
        <h1 className="text-3xl font-extrabold tracking-wider">Operation Simulator</h1>
        <p className="text-[var(--text-secondary)] max-w-xl mx-auto">
          Execute a simulated transaction through the Cerberus compliance pipeline, demonstrating real-time evidence generation and blockchain notarization.
        </p>
        <button 
          onClick={runSimulation}
          disabled={isSimulating}
          className="mt-8 px-8 py-3 bg-[var(--accent)] text-[var(--bg)] font-bold tracking-wider rounded-sm hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed uppercase flex items-center gap-2 mx-auto"
        >
          {isSimulating ? 'Simulating...' : 'Simulate Operation'} <Play size={18} fill="currentColor" />
        </button>
      </div>

      <div className="relative">
        <div className="absolute left-6 top-0 bottom-0 w-px bg-gray-800 hidden md:block"></div>
        
        <div className="space-y-8">
          {steps.map((s, i) => {
            const isActive = step >= i + 1;
            const isCurrent = step === i + 1;
            
            return (
              <div key={i} className={`flex items-start gap-6 transition-all duration-700 ${isActive ? 'opacity-100' : 'opacity-30'}`}>
                <div className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center shrink-0 border-2 transition-colors duration-500 ${isActive ? 'bg-[var(--card)] backdrop-blur-[8px] border-[var(--accent)] text-[var(--accent)] shadow-[0_0_15px_rgba(0,234,254,0.3)]' : 'bg-gray-900 border-[var(--border)] text-gray-600'}`}>
                  {isCurrent ? <div className="animate-pulse">{s.icon}</div> : s.icon}
                </div>
                
                <div className={`bg-[var(--card)] backdrop-blur-[8px] border transition-colors duration-500 rounded-[14px] p-6 flex-1 ${isCurrent ? 'border-[var(--accent)]/50' : 'border-[var(--border)]'}`}>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-medium tracking-wide">{s.title}</h3>
                    {isActive && !isCurrent && <CheckCircle2 className="text-emerald-400" size={20} />}
                  </div>
                  <p className="text-[var(--text-secondary)] text-sm">{s.desc}</p>
                  
                  {isCurrent && (
                    <div className="mt-4 h-1 w-full bg-gray-800 rounded overflow-hidden">
                      <div className="h-full bg-[var(--accent)] w-full animate-[progress_1.5s_ease-in-out_infinite]" style={{ transformOrigin: 'left' }}></div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
