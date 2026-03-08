import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import Status from './pages/Status';
import Validators from './pages/Validators';
import Stream from './pages/Stream';
import Demo from './pages/Demo';
import Hypercube from './pages/Hypercube';
import NetworkBackground from './components/NetworkBackground';

function Navigation() {
  const location = useLocation();
  const links = [
    { path: '/status', label: 'Status' },
    { path: '/validators', label: 'Validators' },
    { path: '/stream', label: 'Evidence Stream' },
    { path: '/demo', label: 'Operation Demo' },
    { path: '/hypercube', label: 'Hypercube' }
  ];

  return (
    <nav className="flex flex-wrap items-center gap-6 mt-6 md:mt-0">
      {links.map(l => (
        <Link 
          key={l.path} 
          to={l.path}
          className={`text-sm tracking-wider uppercase transition-colors ${location.pathname.startsWith(l.path) ? 'text-[var(--accent)] border-b border-[var(--accent)] pb-1' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
        >
          {l.label}
        </Link>
      ))}
    </nav>
  );
}

export default function App() {
  return (
    <Router>
      <NetworkBackground />
      <div className="min-h-screen flex flex-col font-sans selection:bg-[var(--accent)] selection:text-white">
        <header className="border-b border-[var(--border)] bg-[var(--bg)]/80 backdrop-blur-md sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row items-center justify-between">
            <div>
              <Link to="/status" className="group">
                <h1 className="text-xl font-extrabold tracking-[0.2em] text-[var(--text-primary)] flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[var(--accent)] shadow-[0_0_10px_var(--accent)] group-hover:scale-150 transition-transform"></span>
                  CERBERUS NETWORK
                </h1>
                <p className="text-[10px] text-[var(--text-secondary)] tracking-widest uppercase mt-1">Compliance Computation Infrastructure</p>
              </Link>
            </div>
            <Navigation />
          </div>
        </header>

        <main className="flex-1 max-w-7xl mx-auto px-6 py-12 w-full">
          <Routes>
            <Route path="/" element={<Status />} />
            <Route path="/status" element={<Status />} />
            <Route path="/validators" element={<Validators />} />
            <Route path="/stream" element={<Stream />} />
            <Route path="/demo" element={<Demo />} />
            <Route path="/hypercube" element={<Hypercube />} />
          </Routes>
        </main>

        <footer className="border-t border-[var(--border)] bg-[var(--bg)]/80 backdrop-blur-md mt-auto">
          <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between text-[11px] text-[var(--text-secondary)] tracking-widest uppercase">
            <div>
              <p>Cerberus Ledger • Avalanche L1 Subnet</p>
            </div>
            <div className="mt-4 md:mt-0 flex gap-6">
              <span className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Mainnet</span>
              <span>Chain ID: 990305</span>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}
