import { useState, useEffect, useCallback } from 'react'
import { validators } from '../../data/validators'
import { CERBERUS_RPC } from '../../config/network'

const RPC_URL = CERBERUS_RPC

interface ValidatorRow {
  name: string
  ip: string
  status: 'Online' | 'Offline'
  peers: string
  version: string
  lastSeen: string
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

export default function ValidatorTable() {
  const [rows, setRows] = useState<ValidatorRow[]>([])
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(true)

  const fetchData = useCallback(async () => {
    try {
      const [peersHex, clientVersion] = await Promise.all([
        rpcCall('net_peerCount'),
        rpcCall('web3_clientVersion'),
      ]) as [string, string]

      const peers = parseInt(peersHex, 16).toString()
      const now = new Date().toLocaleTimeString()

      setRows(
        validators.map((v) => ({
          name: v.name,
          ip: v.ip,
          status: 'Online' as const,
          peers,
          version: clientVersion || '—',
          lastSeen: now,
        }))
      )
      setError(false)
      setLoading(false)
    } catch {
      setRows(
        validators.map((v) => ({
          name: v.name,
          ip: v.ip,
          status: 'Offline' as const,
          peers: '—',
          version: '—',
          lastSeen: '—',
        }))
      )
      setError(true)
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
    const id = setInterval(fetchData, 10_000)
    return () => clearInterval(id)
  }, [fetchData])

  if (loading && rows.length === 0 && !error) {
    return <div className="card"><p className="loading-text">Loading…</p></div>
  }

  return (
    <>
      {error && (
        <div className="card card-error" style={{ marginBottom: 16 }}>
          <p className="rpc-unavailable">Node unreachable</p>
        </div>
      )}
      <div className="card">
        <table className="data-table">
          <thead>
            <tr>
              <th>Node ID</th>
              <th>IP</th>
              <th>Status</th>
              <th>Peers</th>
              <th>Version</th>
              <th>Last Seen</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.name}>
                <td className="mono">{r.name}</td>
                <td className="mono">{r.ip}</td>
                <td>
                  <span className={`pulse${r.status === 'Offline' ? ' error' : ''}`} />{' '}
                  {r.status}
                </td>
                <td>{r.peers}</td>
                <td className="mono" style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.version}</td>
                <td>{r.lastSeen}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
