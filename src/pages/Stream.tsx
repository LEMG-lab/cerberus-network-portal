import { useEffect, useState } from 'react';
import { ActivitySquare, Database, Key } from 'lucide-react';

interface EvidenceEvent {
  id: string;
  hash: string;
  supplier: string;
  chains_written: string;
  timestamp: string;
}

export default function Stream() {
  const [events, setEvents] = useState<EvidenceEvent[]>([]);

  useEffect(() => {
    const suppliers = ['RFC 10293', 'CEN/TC 434', 'ISO 27001', 'SOC 2 TYPE II'];
    const chains = ['Cerberus / Global Force / Base', 'Cerberus / Global Force', 'Cerberus Only'];
    
    const interval = setInterval(() => {
      const newEvent: EvidenceEvent = {
        id: Math.random().toString(36).substring(2, 9),
        hash: '0x' + Math.random().toString(16).substring(2, 40).padEnd(64, '0'),
        supplier: suppliers[Math.floor(Math.random() * suppliers.length)],
        chains_written: chains[Math.floor(Math.random() * chains.length)],
        timestamp: new Date().toLocaleTimeString()
      };
      
      setEvents(prev => [newEvent, ...prev].slice(0, 15));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-5xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <ActivitySquare className="text-[var(--accent)]" size={32} />
        <h1 className="text-3xl font-light tracking-wider">Live Evidence Stream</h1>
      </div>

      <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg overflow-hidden">
        <div className="grid grid-cols-12 gap-4 p-4 border-b border-[var(--border)] text-xs tracking-widest text-[var(--muted)] uppercase bg-gray-900/50">
          <div className="col-span-2">Time</div>
          <div className="col-span-4">Evidence Hash</div>
          <div className="col-span-3">Supplier</div>
          <div className="col-span-3">Chains Written</div>
        </div>
        
        <div className="divide-y divide-gray-800/50">
          {events.length === 0 ? (
            <div className="p-8 text-center text-[var(--muted)] animate-pulse">Awaiting network events...</div>
          ) : (
            events.map((ev, i) => (
              <div key={ev.id} className={`grid grid-cols-12 gap-4 p-4 items-center text-sm transition-all duration-300 ${i === 0 ? 'bg-[var(--color-cerb-blue)]/10 border-l-2 border-l-[var(--accent)]' : 'hover:bg-gray-800/30'}`}>
                <div className="col-span-2 font-mono text-[var(--muted)]">{ev.timestamp}</div>
                <div className="col-span-4 font-mono text-[var(--accent)] truncate pr-4 flex items-center gap-2">
                  <Key size={14} className="opacity-50" /> {ev.hash.substring(0, 16)}...
                </div>
                <div className="col-span-3 text-gray-300">{ev.supplier}</div>
                <div className="col-span-3 text-xs flex items-center gap-2">
                  <Database size={12} className="text-emerald-400" /> {ev.chains_written}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
