import { useEffect, useState } from 'react';
import { MapPin, Globe } from 'lucide-react';
import { ethers } from 'ethers';

const RPC_URL = "https://api.cerberus.computer/rpc";

const validators = [
  { id: 'Node-0x1A', location: 'Helsinki, FIN', provider: 'AWS eu-north-1', status: 'Active', uptime: '99.99%', lat: 60.1695, lng: 24.9354 },
  { id: 'Node-0x2B', location: 'Nuremberg, DEU', provider: 'Hetzner', status: 'Active', uptime: '99.95%', lat: 49.4521, lng: 11.0767 },
  { id: 'Node-0x3C', location: 'New York, USA', provider: 'GCP us-east4', status: 'Active', uptime: '100.00%', lat: 40.7128, lng: -74.0060 },
  { id: 'Node-0x4D', location: 'Singapore, SGP', provider: 'AWS ap-southeast-1', status: 'Active', uptime: '99.98%', lat: 1.3521, lng: 103.8198 },
];

export default function Validators() {
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

        <div className="space-y-4">
          <h2 className="text-xl font-light mb-4">Node Registry</h2>
          {validators.map((v) => (
            <div key={v.id} className="bg-[var(--card)] border border-[var(--border)] p-4 rounded-lg flex items-center justify-between hover:border-gray-600 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]"></div>
                <div>
                  <p className="font-mono text-lg">{v.id}</p>
                  <p className="text-xs text-[var(--muted)] flex items-center gap-1 mt-1">
                    <MapPin size={12} /> {v.location} • {v.provider}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm tracking-wider text-emerald-400">{v.status}</p>
                <p className="text-xs text-[var(--muted)] font-mono mt-1">Uptime: {v.uptime}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
