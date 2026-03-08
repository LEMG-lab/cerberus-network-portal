import { useState, useEffect, useRef, useCallback } from 'react'

const RPC_URL = 'https://api.cerberus.computer/rpc'

interface Stats {
  blockNumber: string
  chainId: string
  peerCount: string
  syncing: string
  gasPrice: string
  blockTime: string
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

export default function NetworkStats() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [error, setError] = useState(false)
  const prevBlock = useRef<{ number: number; timestamp: number } | null>(null)

  const fetchStats = useCallback(async () => {
    try {
      const [blockHex, chainHex, peersHex, syncResult, gasPriceHex] = await Promise.all([
        rpcCall('eth_blockNumber'),
        rpcCall('eth_chainId'),
        rpcCall('net_peerCount'),
        rpcCall('eth_syncing'),
        rpcCall('eth_gasPrice'),
      ]) as [string, string, string, boolean | object, string]

      const blockNum = parseInt(blockHex, 16)
      const chainId = parseInt(chainHex, 16).toString()
      const peers = parseInt(peersHex, 16).toString()
      const syncing = syncResult === false ? 'Synced' : 'Syncing…'
      const gasGwei = (parseInt(gasPriceHex, 16) / 1e9).toFixed(2) + ' Gwei'

      let blockTime = '—'
      const now = Date.now()
      if (prevBlock.current && blockNum > prevBlock.current.number) {
        const elapsed = (now - prevBlock.current.timestamp) / 1000
        const blocks = blockNum - prevBlock.current.number
        blockTime = (elapsed / blocks).toFixed(1) + 's'
      }
      prevBlock.current = { number: blockNum, timestamp: now }

      setStats({
        blockNumber: blockNum.toLocaleString(),
        chainId,
        peerCount: peers,
        syncing,
        gasPrice: gasGwei,
        blockTime,
      })
      setError(false)
    } catch {
      setError(true)
      setStats(null)
    }
  }, [])

  useEffect(() => {
    fetchStats()
    const id = setInterval(fetchStats, 10_000)
    return () => clearInterval(id)
  }, [fetchStats])

  if (error) {
    return (
      <div className="card card-error">
        <p className="rpc-unavailable">Node unreachable</p>
      </div>
    )
  }

  if (!stats) {
    return <div className="card"><p className="loading-text">Loading…</p></div>
  }

  const items: { label: string; value: string; accent?: boolean }[] = [
    { label: 'Latest Block', value: stats.blockNumber, accent: true },
    { label: 'Chain ID', value: stats.chainId },
    { label: 'Peer Count', value: stats.peerCount },
    { label: 'Sync Status', value: stats.syncing },
    { label: 'Gas Price', value: stats.gasPrice },
    { label: 'Block Time', value: stats.blockTime },
  ]

  return (
    <div className="network-grid">
      {items.map((item) => (
        <div className="card" key={item.label}>
          <h2>{item.label}</h2>
          <div className={`metric${item.accent ? ' accent' : ''}`}>
            {item.accent && <span className="pulse" />}
            {item.value}
          </div>
        </div>
      ))}
    </div>
  )
}
