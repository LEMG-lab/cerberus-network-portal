import { useEffect, useState } from 'react';
import { ActivitySquare, Database, Key } from 'lucide-react';
import { ethers } from 'ethers';

const RPC_URL = "https://api.cerberus.computer/rpc";

interface EvidenceEvent {
  id: string;
  hash: string;
  supplier: string;
  chains_written: string;
  timestamp: string;
}

export default function Stream() {
  const [events, setEvents] = useState<EvidenceEvent[]>([]);
  const [errorStatus, setErrorStatus] = useState<string | null>(null);

  useEffect(() => {
    const provider = new ethers.JsonRpcProvider(RPC_URL);
    let isMounted = true;
    let lastProcessedBlock = 0;

    const fetchTransactions = async () => {
      try {
        const blockNumber = await provider.getBlockNumber();
        if (!isMounted) return;
        
        if (lastProcessedBlock === blockNumber) return;
        lastProcessedBlock = blockNumber;

        const block = await provider.getBlock(blockNumber, true);
        if (!block || !isMounted) return;

        setErrorStatus(null);

        if (block.prefetchedTransactions && block.prefetchedTransactions.length > 0) {
          const newEvents = block.prefetchedTransactions.map(tx => ({
            id: tx.hash,
            hash: tx.hash,
            supplier: tx.to ? `Target: ${tx.to.substring(0, 8)}...` : 'System Operation',
            chains_written: 'Cerberus Ledger',
            timestamp: new Date(block.timestamp * 1000).toLocaleTimeString()
          }));

          setEvents(prev => {
            const combined = [...newEvents, ...prev];
            const unique = combined.filter((v, i, a) => a.findIndex(t => (t.id === v.id)) === i);
            return unique.slice(0, 15);
          });
        }
      } catch (error) {
        console.error("RPC Error:", error);
        if (isMounted) setErrorStatus("No live evidence records available");
      }
    };

    fetchTransactions();
    const interval = setInterval(fetchTransactions, 5000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-5xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <ActivitySquare className="text-[var(--accent)]" size={32} />
        <h1 className="text-3xl font-extrabold tracking-wider">Live Evidence Stream</h1>
      </div>

      <div className="bg-[var(--card)] border border-[var(--border)] rounded-[14px] overflow-hidden">
        <div className="grid grid-cols-12 gap-4 p-4 border-b border-[var(--border)] text-xs tracking-widest text-[var(--muted)] uppercase bg-[var(--bg)]">
          <div className="col-span-2">Time</div>
          <div className="col-span-4">Evidence Hash</div>
          <div className="col-span-3">Supplier</div>
          <div className="col-span-3">Chains Written</div>
        </div>
        
        <div className="divide-y divide-gray-800/50">
          {errorStatus ? (
            <div className="p-8 text-center text-[var(--accent)]">{errorStatus}</div>
          ) : events.length === 0 ? (
            <div className="p-8 text-center text-[var(--muted)] animate-pulse">Awaiting live network events...</div>
          ) : (
            events.map((ev, i) => (
              <div key={ev.id} className={`grid grid-cols-12 gap-4 p-4 items-center text-sm transition-all duration-300 ${i === 0 ? 'bg-[var(--accent)]/10 border-l-2 border-l-[var(--accent)]' : 'hover:bg-[var(--card)]'}`}>
                <div className="col-span-2 font-mono text-[var(--muted)]">{ev.timestamp}</div>
                <div className="col-span-4 font-mono text-[var(--accent)] truncate pr-4 flex items-center gap-2">
                  <Key size={14} className="opacity-50" /> {ev.hash.substring(0, 16)}...
                </div>
                <div className="col-span-3 text-[var(--text)]">{ev.supplier}</div>
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
