import { useState, useEffect, useRef, useCallback } from 'react'
import { JsonRpcProvider } from 'ethers'
import { CERBERUS_RPC } from '../config/network'

const RPC_URL = CERBERUS_RPC

interface NetworkData {
  blockNumber: number
  txCount: number
  latencyMs: number
  lastUpdated: string
}

export default function Status() {
  const [data, setData] = useState<NetworkData | null>(null)
  const [error, setError] = useState(false)
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
      setError(false)
    } catch {
      setError(true)
      setData(null)
    }
  }, [])

  useEffect(() => {
    fetchData()
    const id = setInterval(fetchData, 5000)
    return () => clearInterval(id)
  }, [fetchData])

  return (
    <>
      <h1 className="page-title">Cerberus Network Status</h1>

      {error && (
        <div className="card">
          <h2>RPC unavailable</h2>
          <p style={{ color: 'var(--accent)' }}>
            Unable to reach endpoint: {RPC_URL}
          </p>
        </div>
      )}

      {!error && data && (
        <div className="status-grid">
          <div className="card">
            <h2>Latest Block</h2>
            <div className="value">
              <span className="pulse" />
              {data.blockNumber.toLocaleString()}
            </div>
          </div>

          <div className="card">
            <h2>TX in Block</h2>
            <div className="value">{data.txCount}</div>
          </div>

          <div className="card">
            <h2>RPC Latency</h2>
            <div className={`value ${data.latencyMs > 500 ? 'accent' : ''}`}>
              {data.latencyMs} ms
            </div>
          </div>

          <div className="card">
            <h2>Last Updated</h2>
            <div className="value">{data.lastUpdated}</div>
          </div>

          <div className="card">
            <h2>RPC Endpoint</h2>
            <div className="value" style={{ fontSize: '0.85rem', wordBreak: 'break-all' }}>
              {RPC_URL}
            </div>
          </div>
        </div>
      )}

      {!error && !data && (
        <div className="card">
          <h2>Loading…</h2>
        </div>
      )}
    </>
  )
}
