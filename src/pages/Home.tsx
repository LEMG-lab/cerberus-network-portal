import { useState, useEffect, useRef, useCallback } from 'react'
import { JsonRpcProvider } from 'ethers'
import { Link } from 'react-router-dom'
import { CERBERUS_RPC } from '../config/network'

const RPC_URL = CERBERUS_RPC

interface LiveData {
  blockNumber: number
  txCount: number
  latencyMs: number
  lastUpdated: string
}

export default function Home() {
  const [data, setData] = useState<LiveData | null>(null)
  const [rpcDown, setRpcDown] = useState(false)
  const providerRef = useRef<JsonRpcProvider | null>(null)

  const fetchData = useCallback(async () => {
    try {
      if (!providerRef.current) {
        providerRef.current = new JsonRpcProvider(RPC_URL)
      }
      const provider = providerRef.current

      const t0 = performance.now()
      const blockNumber = await provider.getBlockNumber()
      const latencyMs = Math.round(performance.now() - t0)

      const block = await provider.getBlock(blockNumber)
      const txCount = block?.transactions?.length ?? 0

      setData({
        blockNumber,
        txCount,
        latencyMs,
        lastUpdated: new Date().toLocaleTimeString(),
      })
      setRpcDown(false)
    } catch {
      setRpcDown(true)
      setData(null)
    }
  }, [])

  useEffect(() => {
    fetchData()
    const id = setInterval(fetchData, 5000)
    return () => clearInterval(id)
  }, [fetchData])

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

        {rpcDown && (
          <div className="card card-error">
            <p className="rpc-unavailable">RPC unavailable</p>
          </div>
        )}

        {!rpcDown && !data && (
          <div className="card">
            <p className="loading-text">Connecting to RPC…</p>
          </div>
        )}

        {!rpcDown && data && (
          <div className="status-grid">
            <div className="card">
              <h3>Latest Block</h3>
              <div className="metric">
                <span className="pulse" />
                {data.blockNumber.toLocaleString()}
              </div>
            </div>
            <div className="card">
              <h3>TX in Block</h3>
              <div className="metric">{data.txCount}</div>
            </div>
            <div className="card">
              <h3>RPC Latency</h3>
              <div className={`metric ${data.latencyMs > 500 ? 'accent' : ''}`}>
                {data.latencyMs} ms
              </div>
            </div>
            <div className="card">
              <h3>Last Updated</h3>
              <div className="metric">{data.lastUpdated}</div>
            </div>
          </div>
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
              <tr><td>RPC Endpoint</td><td className="mono">{RPC_URL}</td></tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
