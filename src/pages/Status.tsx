import { useEffect, useState } from 'react';
import { Activity, Server, Zap, Clock, ShieldCheck, Box } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer, YAxis, Tooltip } from 'recharts';
import { ethers } from 'ethers';

const RPC_URL = "https://api.cerberus.computer/rpc";

interface BlockData {
  number: number;
  txCount: number;
  timestamp: number;
}

export default function Status() {
  const [metrics, setMetrics] = useState({
    blockHeight: 0,
    blockTime: '0.00s',
    rpcLatency: '0 ms',
    status: 'Connecting...',
    timestamp: new Date().toLocaleTimeString()
  });

  const [recentBlocks, setRecentBlocks] = useState<BlockData[]>([]);
  const [latencyHistory, setLatencyHistory] = useState<{ time: string, value: number }[]>([]);

  useEffect(() => {
    const provider = new ethers.JsonRpcProvider(RPC_URL);
    let lastBlockTime = 0;
    let isMounted = true;

    const fetchBlockData = async () => {
      try {
        const start = performance.now();
        const blockNumber = await provider.getBlockNumber();
        const block = await provider.getBlock(blockNumber);
        const end = performance.now();
        
        if (!block || !isMounted) return;

        const latency = Math.floor(end - start);
        const currentTimestamp = block.timestamp;
        
        // Calculate block time if we have a previous block
        let currentBlockTimeStr = '2.00s'; // default est
        if (lastBlockTime > 0) {
          const diff = currentTimestamp - lastBlockTime;
          if (diff > 0 && diff < 30) {
            currentBlockTimeStr = diff.toFixed(2) + 's';
          }
        }
        lastBlockTime = currentTimestamp;

        setMetrics(() => ({
          blockHeight: blockNumber,
          blockTime: currentBlockTimeStr,
          rpcLatency: `${latency} ms`,
          status: 'Healthy',
          timestamp: new Date().toLocaleTimeString()
        }));

        const newBlock = {
          number: blockNumber,
          txCount: block.transactions.length,
          timestamp: block.timestamp
        };

        setRecentBlocks(prev => {
          if (prev.length > 0 && prev[0].number === newBlock.number) return prev;
          return [newBlock, ...prev].slice(0, 10);
        });

        setLatencyHistory(prev => {
          return [...prev, { time: new Date().toLocaleTimeString(), value: latency }].slice(-20);
        });

      } catch (error) {
        console.error("RPC Error:", error);
        if (isMounted) {
          setMetrics(m => ({
            ...m,
            status: 'Degraded',
            rpcLatency: 'ERR'
          }));
        }
      }
    };

    // Initial fetch
    fetchBlockData();

    // Check every 5 seconds
    const interval = setInterval(fetchBlockData, 5000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center gap-3 mb-8">
        <Activity className="text-[var(--accent)]" size={32} />
        <h1 className="text-3xl font-extrabold tracking-wider">Network Status</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard title="Network State" value={metrics.status} icon={<ShieldCheck className={metrics.status === 'Healthy' ? "text-emerald-400" : "text-yellow-400"} />} />
        <MetricCard title="Block Height" value={metrics.blockHeight ? metrics.blockHeight.toLocaleString() : '---'} icon={<Server className="text-blue-400" />} />
        <MetricCard title="Est. Block Time" value={metrics.blockTime} icon={<Clock className="text-purple-400" />} />
        <MetricCard title="RPC Latency" value={metrics.rpcLatency} icon={<Zap className="text-yellow-400" />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        
        {/* Live Chain Activity Panel */}
        <div className="lg:col-span-1 bg-[var(--card)] backdrop-blur-[8px] border border-[var(--border)] p-6 rounded-[14px] flex flex-col">
          <div className="flex items-center gap-2 mb-6">
            <Box className="text-[var(--accent)]" size={20} />
            <h2 className="text-lg font-extrabold">Live Chain Activity</h2>
          </div>
          
          <div className="space-y-4 flex-1">
             <div className="flex justify-between items-center py-2 border-b border-[var(--border)]">
               <span className="text-sm text-[var(--text-secondary)]">Latest Block</span>
               <span className="font-mono text-emerald-400">{metrics.blockHeight || '---'}</span>
             </div>
             <div className="flex justify-between items-center py-2 border-b border-[var(--border)]">
               <span className="text-sm text-[var(--text-secondary)]">Tx in Last Block</span>
               <span className="font-mono text-[var(--text-primary)]">{recentBlocks.length > 0 ? recentBlocks[0].txCount : '---'}</span>
             </div>
             <div className="flex justify-between items-center py-2 border-b border-[var(--border)]">
               <span className="text-sm text-[var(--text-secondary)]">Avg Block Time</span>
               <span className="font-mono text-[var(--text-primary)]">{metrics.blockTime}</span>
             </div>
             <div className="flex justify-between items-center py-2 border-b border-[var(--border)]">
               <span className="text-sm text-[var(--text-secondary)]">RPC Health</span>
               <span className="font-mono text-[var(--accent)]">{metrics.status === 'Healthy' ? '100% ONLINE' : 'DEGRADED'}</span>
             </div>
          </div>

          <div className="mt-6 pt-4 border-t border-[var(--border)]">
             <p className="text-xs text-[var(--text-secondary)] mb-2 uppercase tracking-widest">Recent Blocks</p>
             <div className="space-y-2">
               {recentBlocks.slice(0, 10).map(b => (
                 <div key={b.number} className="flex justify-between text-xs font-mono">
                   <span className="text-[var(--text-secondary)]">#{b.number}</span>
                   <span className="text-[var(--accent)]">{b.txCount} TXs</span>
                 </div>
               ))}
               {recentBlocks.length === 0 && <span className="text-xs text-[var(--text-secondary)]">Waiting for blocks...</span>}
             </div>
          </div>
        </div>

        {/* RPC Latency History */}
        <div className="lg:col-span-2 bg-[var(--card)] backdrop-blur-[8px] border border-[var(--border)] p-6 rounded-[14px]">
          <h2 className="text-lg text-[var(--text-secondary)] mb-4">RPC Latency History (ms)</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={latencyHistory}>
                <YAxis domain={['dataMin - 10', 'dataMax + 20']} hide />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', color: 'var(--text)' }}
                  itemStyle={{ color: 'var(--accent)' }}
                  labelStyle={{ color: 'var(--muted)' }}
                />
                <Line type="stepAfter" dataKey="value" stroke="var(--accent)" strokeWidth={2} dot={true} isAnimationActive={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        
      </div>
    </div>
  );
}

function MetricCard({ title, value, icon }: { title: string, value: string, icon: React.ReactNode }) {
  return (
    <div className="bg-[var(--card)] backdrop-blur-[8px] border border-[var(--border)] p-6 rounded-[14px] flex items-center justify-between">
      <div>
        <p className="text-sm text-[var(--text-secondary)] uppercase tracking-widest mb-1">{title}</p>
        <p className="text-2xl font-semibold">{value}</p>
      </div>
      <div className="p-3 bg-gray-100  rounded-full">{icon}</div>
    </div>
  );
}
