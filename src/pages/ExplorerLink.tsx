export default function ExplorerLink() {
  return (
    <>
      <h1 className="page-title">Block Explorer</h1>
      <div className="card link-card">
        <p>View transactions, blocks, and addresses on the Cerberus Ledger explorer.</p>
        <a
          className="btn"
          href="https://explorer.cerberus.computer"
          target="_blank"
          rel="noopener noreferrer"
        >
          Open Cerberus Explorer
        </a>
      </div>
    </>
  )
}
