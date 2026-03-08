import { useState, useEffect, useCallback } from 'react'
import { CERBERUS_RPC } from '../../config/network'

const RPC_URL = CERBERUS_RPC

interface BlockRow {
  number: number
  hash: string
  txCount: number
  timestamp: string
  gasUsed: string
}

async function rpcCall(method: string, params: unknown[] = []): Promise<unknown> {
  const res = await fetch(RPC_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ jsonrpc: '2.0', id: 1, method, params }),
  })
  const json = await res.json()
  if (json.error) throw new Error(json.error.message)
  return json.result
}

export default function BlockTable() {
  const [blocks, setBlocks] = useState<BlockRow[]>([])
  const [error, setError] = useState(false)

  const fetchBlocks = useCallback(async () => {
    try {
      const latestHex = (await rpcCall('eth_blockNumber')) as string
      const latest = parseInt(latestHex, 16)

      const promises = Array.from({ length: 10 }, (_, i) => {
        const hex = '0x' + (latest - i).toString(16)
        return rpcCall('eth_getBlockByNumber', [hex, false]) as Promise<{
          number: string
          hash: string
          transactions: string[]
          timestamp: string
          gasUsed: string
        }>
      })

      const results = await Promise.all(promises)

      setBlocks(
        results.map((b) => ({
          number: parseInt(b.number, 16),
          hash: b.hash,
          txCount: b.transactions.length,
          timestamp: new Date(parseInt(b.timestamp, 16) * 1000).toLocaleString(),
          gasUsed: parseInt(b.gasUsed, 16).toLocaleString(),
        }))
      )
      setError(false)
    } catch {
      setError(true)
      setBlocks([])
    }
  }, [])

  useEffect(() => {
    fetchBlocks()
    const id = setInterval(fetchBlocks, 10_000)
    return () => clearInterval(id)
  }, [fetchBlocks])

  if (error) {
    return (
      <div className="card card-error">
        <p className="rpc-unavailable">Node unreachable</p>
      </div>
    )
  }

  if (blocks.length === 0) {
    return <div className="card"><p className="loading-text">Loading…</p></div>
  }

  return (
    <div className="card" style={{ overflowX: 'auto' }}>
      <table className="data-table">
        <thead>
          <tr>
            <th>Block</th>
            <th>Hash</th>
            <th>TXs</th>
            <th>Timestamp</th>
            <th>Gas Used</th>
          </tr>
        </thead>
        <tbody>
          {blocks.map((b) => (
            <tr key={b.number}>
              <td style={{ fontWeight: 600 }}>{b.number.toLocaleString()}</td>
              <td className="mono" style={{ maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {b.hash}
              </td>
              <td>{b.txCount}</td>
              <td>{b.timestamp}</td>
              <td>{b.gasUsed}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
