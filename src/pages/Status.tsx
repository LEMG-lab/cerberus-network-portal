import { useState, useEffect, useRef, useCallback } from 'react'
import { JsonRpcProvider } from 'ethers'

const RPC_URL = 'https://api.cerberus.computer/rpc'

interface NetworkData {
  blockNumber: number
  txCount: number
  latencyMs: number
  healthy: boolean
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

      setData({ blockNumber, txCount, latencyMs, healthy: true })
      setError(false)
    } catch {
      setError(true)
      setData(prev => prev ? { ...prev, healthy: false } : null)
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

      {error && !data && (
        <div className="card">
          <h2>Connection</h2>
          <p style={{ color: 'var(--accent)' }}>Unable to reach RPC endpoint</p>
        </div>
      )}

      <div className="status-grid">
        <div className="card">
          <h2>Latest Block</h2>
          <div className="value">
            <span className={error ? 'pulse error' : 'pulse'} />
            {data ? data.blockNumber.toLocaleString() : '—'}
          </div>
        </div>

        <div className="card">
          <h2>TX in Block</h2>
          <div className="value">{data ? data.txCount : '—'}</div>
        </div>

        <div className="card">
          <h2>RPC Latency</h2>
          <div className={`value ${data && data.latencyMs > 500 ? 'accent' : ''}`}>
            {data ? `${data.latencyMs} ms` : '—'}
          </div>
        </div>

        <div className="card">
          <h2>Health</h2>
          <div className="value" style={{ color: data?.healthy ? '#22c55e' : 'var(--accent)' }}>
            {data ? (data.healthy ? 'Operational' : 'Degraded') : '—'}
          </div>
        </div>
      </div>
    </>
  )
}
