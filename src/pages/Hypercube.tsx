import { useState } from 'react';
import { Box } from 'lucide-react';
import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const generateData = () => {
  return Array.from({ length: 50 }, () => ({
    supplier: Math.random() * 100,
    risk: Math.random() * 100,
    completeness: Math.random() * 100,
    id: 'OP-' + Math.floor(Math.random() * 10000),
  }));
};

export default function Hypercube() {
  const [data] = useState(generateData());
  const [activeDimension, setActiveDimension] = useState('risk');

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Box className="text-[var(--accent)]" size={32} />
          <h1 className="text-3xl font-extrabold tracking-wider">Hypercube Intelligence</h1>
        </div>
        
        <div className="flex gap-2">
          {['risk', 'completeness'].map(dim => (
            <button
              key={dim}
              onClick={() => setActiveDimension(dim)}
              className={`px-4 py-2 text-xs tracking-wider uppercase rounded border transition-colors ${activeDimension === dim ? 'border-[var(--accent)] text-[var(--accent)] bg-[var(--accent)]/10' : 'border-[var(--border)] text-[var(--muted)] hover:border-[var(--border)]'}`}
            >
              Y-Axis: {dim}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-[var(--card)] border border-[var(--border)] p-6 rounded-[14px] h-[600px] flex flex-col">
        <p className="text-sm text-[var(--muted)] mb-6 max-w-2xl">
          Visualizing the compliance topology. X-axis represents Supplier Distribution. Y-axis represents {activeDimension === 'risk' ? 'Risk Score' : 'Document Completeness'}. Z-axis (size) represents transaction volume. Operations below the optimal plane are flagged for Decision Layer review.
        </p>
        
        <div className="flex-1 w-full bg-[var(--card)] rounded-[14px] p-4 border border-[var(--border)]/50">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <XAxis type="number" dataKey="supplier" name="Supplier Metric" tick={{fill: '#4b5563'}} axisLine={{stroke: '#374151'}} />
              <YAxis type="number" dataKey={activeDimension} name={activeDimension === 'risk' ? 'Risk Score' : 'Completeness'} tick={{fill: '#4b5563'}} axisLine={{stroke: '#374151'}} />
              <ZAxis type="number" dataKey="completeness" range={[50, 400]} name="Volume" />
              <Tooltip 
                cursor={{strokeDasharray: '3 3', stroke: '#374151'}} 
                contentStyle={{backgroundColor: '#0a0b1a', borderColor: '#1f2937', color: '#e2e8f0'}}
                itemStyle={{color: '#00eafe'}}
              />
              <Scatter name="Operations" data={data}>
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={Number(entry[activeDimension as keyof typeof entry]) > 50 ? 'var(--accent)' : '#8b5cf6'} 
                    fillOpacity={0.6}
                  />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
