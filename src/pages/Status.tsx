import { useRpcMetrics } from '../hooks/useRpcMetrics'
import { CERBERUS_RPC } from '../config/network'

function HealthBadge({ health }: { health: string }) {
  const map: Record<string, { label: string; className: string }> = {
    operational: { label: 'Operational', className: 'health-ok' },
    degraded: { label: 'Degraded', className: 'health-warn' },
    error: { label: 'Error', className: 'health-err' },
  }
  const h = map[health] ?? map.error
  return <span className={`health-badge ${h.className}`}>{h.label}</span>
}

function LatencyBar({ history }: { history: number[] }) {
  if (history.length === 0) return null
  const max = Math.max(...history, 100)
  return (
    <div className="latency-bar-container">
      <div className="latency-bars">
        {history.map((v, i) => (
          <div
            key={i}
            className={`latency-bar ${v > 500 ? 'latency-bar-warn' : ''}`}
            style={{ height: `${Math.max((v / max) * 100, 4)}%` }}
            title={`${v} ms`}
          />
        ))}
      </div>
      <div className="latency-bar-labels">
        <span>0 ms</span>
        <span>{max} ms</span>
      </div>
    </div>
  )
}

export default function Status() {
  const { metrics, error } = useRpcMetrics()

  return (
    <>
      <h1 className="page-title">Cerberus Network Status</h1>

      {error && (
        <div className="card card-error">
          <h2>RPC Unavailable</h2>
          <p style={{ color: 'var(--accent)' }}>
            Unable to reach endpoint: {CERBERUS_RPC}
          </p>
        </div>
      )}

      {!error && !metrics && (
        <div className="card">
          <h2>Connecting to RPC…</h2>
        </div>
      )}

      {!error && metrics && (
        <>
          {/* Health + Core Metrics */}
          <div className="status-header">
            <HealthBadge health={metrics.health} />
            <span className="status-updated">Last updated: {metrics.lastUpdated}</span>
          </div>

          <div className="status-grid">
            <div className="card">
              <h2>Latest Block</h2>
              <div className="value">
                <span className="pulse" />
                {metrics.blockNumber.toLocaleString()}
              </div>
            </div>

            <div className="card">
              <h2>TX in Block</h2>
              <div className="value">{metrics.txCount}</div>
            </div>

            <div className="card">
              <h2>RPC Latency</h2>
              <div className={`value ${metrics.latencyMs > 500 ? 'accent' : ''}`}>
                {metrics.latencyMs} ms
              </div>
            </div>

            <div className="card">
              <h2>Block Time</h2>
              <div className="value">
                {metrics.blockTimeMs > 0
                  ? `${(metrics.blockTimeMs / 1000).toFixed(1)} s`
                  : 'Calculating…'}
              </div>
            </div>

            <div className="card">
              <h2>RPC Endpoint</h2>
              <div className="value" style={{ fontSize: '0.85rem', wordBreak: 'break-all' }}>
                {CERBERUS_RPC}
              </div>
            </div>
          </div>

          {/* Latency History */}
          <div className="card">
            <h2>Latency History <span className="label-sub">(last {metrics.latencyHistory.length} readings)</span></h2>
            <LatencyBar history={metrics.latencyHistory} />
          </div>

          {/* Recent Blocks */}
          {metrics.recentBlocks.length > 0 && (
            <div className="card">
              <h2>Recent Blocks</h2>
              <table className="blocks-table">
                <thead>
                  <tr>
                    <th>Block</th>
                    <th>TXs</th>
                    <th>Time</th>
                  </tr>
                </thead>
                <tbody>
                  {metrics.recentBlocks.map((b) => (
                    <tr key={b.number}>
                      <td className="mono">{b.number.toLocaleString()}</td>
                      <td>{b.txCount}</td>
                      <td>{new Date(b.timestamp * 1000).toLocaleTimeString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </>
  )
}
