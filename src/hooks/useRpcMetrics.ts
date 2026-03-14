import { useState, useEffect, useRef, useCallback } from 'react'
import { JsonRpcProvider } from 'ethers'
import { CERBERUS_RPC } from '../config/network'

export interface RpcMetrics {
  blockNumber: number
  txCount: number
  latencyMs: number
  blockTimeMs: number
  lastUpdated: string
  health: 'operational' | 'degraded' | 'error'
  recentBlocks: BlockEntry[]
  latencyHistory: number[]
}

export interface BlockEntry {
  number: number
  txCount: number
  timestamp: number
}

const HISTORY_SIZE = 20
const RECENT_BLOCKS_SIZE = 5
const POLL_INTERVAL = 5000

export function useRpcMetrics() {
  const [metrics, setMetrics] = useState<RpcMetrics | null>(null)
  const [error, setError] = useState(false)
  const providerRef = useRef<JsonRpcProvider | null>(null)
  const prevTimestampRef = useRef<number>(0)
  const latencyBufferRef = useRef<number[]>([])
  const blocksBufferRef = useRef<BlockEntry[]>([])
  const lastBlockRef = useRef<number>(0)

  const cancelledRef = useRef(false)

  const fetchData = useCallback(async () => {
    if (cancelledRef.current) return
    try {
      if (!providerRef.current) {
        providerRef.current = new JsonRpcProvider(CERBERUS_RPC)
      }
      const provider = providerRef.current

      // Measure latency
      const t0 = performance.now()
      const blockNumber = await provider.getBlockNumber()
      const latencyMs = Math.round(performance.now() - t0)

      // Get block details
      const block = await provider.getBlock(blockNumber)
      const txCount = block?.transactions?.length ?? 0
      const timestamp = block?.timestamp ?? 0

      // Calculate block time (delta from previous fetch)
      let blockTimeMs = 0
      if (prevTimestampRef.current > 0 && timestamp > prevTimestampRef.current) {
        blockTimeMs = (timestamp - prevTimestampRef.current) * 1000
      }
      prevTimestampRef.current = timestamp

      // Update latency history
      latencyBufferRef.current = [
        ...latencyBufferRef.current.slice(-(HISTORY_SIZE - 1)),
        latencyMs,
      ]

      // Update recent blocks (only if new block)
      if (blockNumber !== lastBlockRef.current) {
        blocksBufferRef.current = [
          { number: blockNumber, txCount, timestamp },
          ...blocksBufferRef.current.slice(0, RECENT_BLOCKS_SIZE - 1),
        ]
        lastBlockRef.current = blockNumber
      }

      // Determine health
      let health: RpcMetrics['health'] = 'operational'
      if (latencyMs > 1000) health = 'degraded'
      else if (latencyMs > 500) {
        const avg = latencyBufferRef.current.reduce((a, b) => a + b, 0) / latencyBufferRef.current.length
        if (avg > 500) health = 'degraded'
      }

      if (!cancelledRef.current) {
        setMetrics({
          blockNumber,
          txCount,
          latencyMs,
          blockTimeMs,
          lastUpdated: new Date().toLocaleTimeString(),
          health,
          recentBlocks: [...blocksBufferRef.current],
          latencyHistory: [...latencyBufferRef.current],
        })
        setError(false)
      }
    } catch {
      if (!cancelledRef.current) {
        setError(true)
        setMetrics(null)
      }
    }
  }, [])

  useEffect(() => {
    cancelledRef.current = false
    fetchData()
    const id = setInterval(fetchData, POLL_INTERVAL)
    return () => {
      cancelledRef.current = true
      clearInterval(id)
    }
  }, [fetchData])

  return { metrics, error }
}
