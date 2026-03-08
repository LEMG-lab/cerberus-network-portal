import { Routes, Route, NavLink, Navigate } from 'react-router-dom'
import Status from './pages/Status'
import ExplorerLink from './pages/ExplorerLink'
import ApiLink from './pages/ApiLink'

export default function App() {
  return (
    <div className="app-shell">
      <header>
        <div className="logo">
          Cerberus <span>Network</span>
        </div>
        <nav>
          <NavLink to="/status" className={({ isActive }) => isActive ? 'active' : ''}>Status</NavLink>
          <NavLink to="/explorer-link" className={({ isActive }) => isActive ? 'active' : ''}>Explorer</NavLink>
          <NavLink to="/api-link" className={({ isActive }) => isActive ? 'active' : ''}>API</NavLink>
        </nav>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<Navigate to="/status" replace />} />
          <Route path="/status" element={<Status />} />
          <Route path="/explorer-link" element={<ExplorerLink />} />
          <Route path="/api-link" element={<ApiLink />} />
        </Routes>
      </main>

      <footer>
        Cerberus Ledger · Chain 990305 · {new Date().getFullYear()}
      </footer>
    </div>
  )
}
