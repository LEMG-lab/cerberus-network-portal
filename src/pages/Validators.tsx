import { useEffect, useState } from 'react';
import { MapPin, Globe } from 'lucide-react';
import { ethers } from 'ethers';

const RPC_URL = "https://api.cerberus.computer/rpc";

interface Validator {
  nodeID: string;
  weight: string;
  uptime: string;
  connected: boolean;
}

export default function Validators() {
  const [validators, setValidators] = useState<Validator[]>([]);
  const [networkLatency, setNetworkLatency] = useState('Ping: ---');

  useEffect(() => {
    const provider = new ethers.JsonRpcProvider(RPC_URL);
    let isMounted = true;
    
    const pingNetwork = async () => {
      try {
        const start = performance.now();
        await provider.getBlockNumber();
        const end = performance.now();
        if (isMounted) setNetworkLatency(`Ping: ${Math.floor(end - start)}ms`);
      } catch (e) {
        if (isMounted) setNetworkLatency('Connection Error');
      }
    };
    
    const fetchValidators = async () => {
      try {
        const res = await fetch("https://api.avax.network/ext/bc/990305/platform");
        if (!res.ok) return;
        const data = await res.json();
        if (isMounted && data.validators) {
          setValidators(data.validators);
        }
      } catch (e) {
        console.error("Failed to fetch validators:", e);
      }
    };

    fetchValidators();
    pingNetwork();
    const interval = setInterval(pingNetwork, 10000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    }
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center gap-3 mb-8">
        <Globe className="text-[var(--accent)]" size={32} />
        <h1 className="text-3xl font-light tracking-wider">Global Validators</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-6 min-h-[400px] flex items-center justify-center relative overflow-hidden">
          {/* Simulated Map Visual */}
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_center,_var(--color-cerb-blue)_0%,_transparent_70%)]"></div>
          <div className="z-10 text-center space-y-4">
            <Globe size={120} className="mx-auto text-gray-700 animate-[spin_60s_linear_infinite]" />
            <p className="text-sm tracking-widest text-[var(--accent)]">GLOBAL FORCE DEPLOYMENT</p>
            <p className="text-xs font-mono text-[var(--muted)] bg-[var(--card)] py-1 px-3 rounded-full border border-[var(--border)] inline-block mt-4">{networkLatency}</p>
          </div>
        </div>

        <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
          <h2 className="text-xl font-light mb-4 sticky top-0 bg-[var(--bg)] z-10 py-2">Node Registry</h2>
          {validators.length === 0 ? (
             <div className="text-[var(--muted)] text-sm animate-pulse p-4">Syncing with Platform Chain...</div>
          ) : (
            validators.map((v) => (
              <div key={v.nodeID} className="bg-[var(--card)] border border-[var(--border)] p-4 rounded-lg flex items-center justify-between hover:border-gray-600 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`w-2 h-2 rounded-full ${v.connected !== false ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]' : 'bg-red-500'}`}></div>
                  <div>
                    <p className="font-mono text-lg truncate w-40 md:w-auto">{v.nodeID}</p>
                    <p className="text-xs text-[var(--muted)] flex items-center gap-1 mt-1">
                      <MapPin size={12} /> {v.connected !== false ? 'Active Node' : 'Disconnected'} • Weight: {(Number(v.weight) / 1e9).toFixed(2)} AVAX
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-sm tracking-wider ${v.connected !== false ? 'text-emerald-400' : 'text-red-400'}`}>{v.connected !== false ? 'Active' : 'Offline'}</p>
                  <p className="text-xs text-[var(--muted)] font-mono mt-1">Uptime: {v.uptime ? (Number(v.uptime) * 100).toFixed(2) + '%' : '---'}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
