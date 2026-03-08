import { useEffect, useState } from 'react';
import { Activity, Server, Zap, Clock, ShieldCheck } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer, YAxis } from 'recharts';

const mockData = Array.from({ length: 20 }, () => ({ value: 40 + Math.random() * 20 }));

export default function Status() {
  const [metrics, setMetrics] = useState({
    blockHeight: 9945120,
    blockTime: '2.02s',
    rpcLatency: '45 ms',
    status: 'Healthy',
    timestamp: new Date().toLocaleTimeString()
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(m => ({
        blockHeight: m.blockHeight + 1,
        blockTime: (2.00 + Math.random() * 0.05).toFixed(2) + 's',
        rpcLatency: Math.floor(Math.random() * 20 + 35) + ' ms',
        status: 'Healthy',
        timestamp: new Date().toLocaleTimeString()
      }));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center gap-3 mb-8">
        <Activity className="text-[var(--accent)]" size={32} />
        <h1 className="text-3xl font-light tracking-wider">Network Status</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard title="Network State" value={metrics.status} icon={<ShieldCheck className="text-emerald-400" />} />
        <MetricCard title="Block Height" value={metrics.blockHeight.toString()} icon={<Server className="text-blue-400" />} />
        <MetricCard title="Est. Block Time" value={metrics.blockTime} icon={<Clock className="text-purple-400" />} />
        <MetricCard title="RPC Latency" value={metrics.rpcLatency} icon={<Zap className="text-yellow-400" />} />
      </div>

      <div className="mt-8 bg-[var(--card)] border border-[var(--border)] p-6 rounded-lg">
        <h2 className="text-lg text-[var(--muted)] mb-4">RPC Latency History (ms)</h2>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={mockData}>
              <YAxis domain={['dataMin - 10', 'dataMax + 10']} hide />
              <Line type="monotone" dataKey="value" stroke="var(--accent)" strokeWidth={2} dot={false} isAnimationActive={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ title, value, icon }: { title: string, value: string, icon: React.ReactNode }) {
  return (
    <div className="bg-[var(--card)] border border-[var(--border)] p-6 rounded-lg flex items-center justify-between">
      <div>
        <p className="text-sm text-[var(--muted)] uppercase tracking-widest mb-1">{title}</p>
        <p className="text-2xl font-semibold">{value}</p>
      </div>
      <div className="p-3 bg-gray-900/50 rounded-full">{icon}</div>
    </div>
  );
}
