export const CERBERUS_CHAIN_ID =
  "J1xzDCPGkgC3inCkYRMe3cxcLMvYE6K4UsQxfqdm8PcGe1EMG";

export const CERBERUS_RPC = "https://api.cerberus.computer/rpc";

export async function rpcCall(method: string, params: unknown[] = []): Promise<unknown> {
  const res = await fetch(CERBERUS_RPC, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ jsonrpc: '2.0', id: 1, method, params }),
  })
  const json = await res.json()
  if (json.error) throw new Error(json.error.message)
  return json.result
}
