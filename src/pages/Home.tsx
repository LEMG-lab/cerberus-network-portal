import { Link } from 'react-router-dom'
import { useRpcMetrics } from '../hooks/useRpcMetrics'
import { CERBERUS_RPC } from '../config/network'

export default function Home() {
  const { metrics, error } = useRpcMetrics()

  return (
    <div className="home">
      {/* ── 1. Hero ── */}
      <section className="hero">
        <h1>Cerberus Network</h1>
        <p className="hero-sub">
          Live infrastructure view of Cerberus Ledger on Avalanche
        </p>
        <div className="hero-actions">
          <a href="https://explorer.cerberus.computer" target="_blank" rel="noopener noreferrer" className="btn btn-primary">
            Open Explorer
          </a>
          <a href="https://api.cerberus.computer" target="_blank" rel="noopener noreferrer" className="btn btn-outline">
            Open API
          </a>
          <Link to="/status" className="btn btn-outline">
            Open Status
          </Link>
        </div>
      </section>

      {/* ── 2. Live Status Panel ── */}
      <section className="section">
        <h2 className="section-title">Live Status</h2>

        {error && (
          <div className="card card-error">
            <p className="rpc-unavailable">RPC unavailable</p>
          </div>
        )}

        {!error && !metrics && (
          <div className="card">
            <p className="loading-text">Connecting to RPC…</p>
          </div>
        )}

        {!error && metrics && (
          <>
            <div className="status-header home-status-header">
              <span className={`health-dot ${metrics.health === 'operational' ? 'health-dot-ok' : 'health-dot-warn'}`} />
              <span className="health-label-inline">
                {metrics.health === 'operational' ? 'Network Operational' : 'Degraded'}
              </span>
            </div>
            <div className="status-grid">
              <div className="card">
                <h3>Latest Block</h3>
                <div className="metric">
                  <span className="pulse" />
                  {metrics.blockNumber.toLocaleString()}
                </div>
              </div>
              <div className="card">
                <h3>TX in Block</h3>
                <div className="metric">{metrics.txCount}</div>
              </div>
              <div className="card">
                <h3>RPC Latency</h3>
                <div className={`metric ${metrics.latencyMs > 500 ? 'accent' : ''}`}>
                  {metrics.latencyMs} ms
                </div>
              </div>
              <div className="card">
                <h3>Block Time</h3>
                <div className="metric">
                  {metrics.blockTimeMs > 0
                    ? `${(metrics.blockTimeMs / 1000).toFixed(1)} s`
                    : '—'}
                </div>
              </div>
            </div>
          </>
        )}
      </section>

      {/* ── 3. Infrastructure Links ── */}
      <section className="section">
        <h2 className="section-title">Infrastructure</h2>
        <div className="infra-grid">
          <a href="https://explorer.cerberus.computer" target="_blank" rel="noopener noreferrer" className="card infra-card">
            <h3>Explorer</h3>
            <p>Browse blocks, transactions and addresses on the Cerberus Ledger.</p>
            <span className="card-link">explorer.cerberus.computer →</span>
          </a>
          <a href="https://api.cerberus.computer" target="_blank" rel="noopener noreferrer" className="card infra-card">
            <h3>API</h3>
            <p>JSON-RPC and REST API for integrations and development.</p>
            <span className="card-link">api.cerberus.computer →</span>
          </a>
          <a href="https://audit.cerberus.computer" target="_blank" rel="noopener noreferrer" className="card infra-card">
            <h3>Audit</h3>
            <p>Compliance and on-chain audit trail for Cerberus operations.</p>
            <span className="card-link">audit.cerberus.computer →</span>
          </a>
        </div>
      </section>

      {/* ── 4. Chain Identity ── */}
      <section className="section">
        <h2 className="section-title">Chain Identity</h2>
        <div className="card identity-card">
          <table className="identity-table">
            <tbody>
              <tr><td>Chain Name</td><td>cerberusLedger</td></tr>
              <tr><td>Chain ID</td><td>990305</td></tr>
              <tr><td>Subnet ID</td><td className="mono">2RSUQMUEzBv6hduKiRt4DqUmAmY6A2uFJETfoABbznZE2agm9L</td></tr>
              <tr><td>Blockchain ID</td><td className="mono">J1xzDCPGkgC3inCkYRMe3cxcLMvYE6K4UsQxfqdm8PcGe1EMG</td></tr>
              <tr><td>RPC Endpoint</td><td className="mono">{CERBERUS_RPC}</td></tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
