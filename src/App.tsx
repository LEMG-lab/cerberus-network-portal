import { Routes, Route, NavLink } from 'react-router-dom'
import Home from './pages/Home'
import Status from './pages/Status'
import ExplorerLink from './pages/ExplorerLink'
import ApiLink from './pages/ApiLink'

export default function App() {
  return (
    <div className="app-shell">
      <header>
        <NavLink to="/" className="logo">
          Cerberus <span>Network</span>
        </NavLink>
        <nav>
          <NavLink to="/" end className={({ isActive }) => isActive ? 'active' : ''}>Home</NavLink>
          <NavLink to="/status" className={({ isActive }) => isActive ? 'active' : ''}>Status</NavLink>
          <NavLink to="/explorer-link" className={({ isActive }) => isActive ? 'active' : ''}>Explorer</NavLink>
          <NavLink to="/api-link" className={({ isActive }) => isActive ? 'active' : ''}>API</NavLink>
        </nav>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
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
