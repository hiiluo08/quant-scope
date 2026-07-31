import React, { useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import { 
  LayoutDashboard, 
  BarChart2, 
  Layers, 
  LineChart, 
  BrainCircuit, 
  Moon, 
  Sun,
  RefreshCw,
  Database
} from 'lucide-react'

interface AppShellProps {
  children: React.ReactNode
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const [isDark, setIsDark] = useState(true)

  useEffect(() => {
    // If we were to actually toggle CSS we would do it here. 
    // Right now styles.css uses prefers-color-scheme, but we can force it via data-theme.
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light')
  }, [isDark])

  return (
    <div className="app-shell">
      {/* Sidebar */}
      <aside className="app-sidebar">
        <div className="app-brand">
          <div style={{ background: 'var(--accent-primary)', color: 'var(--accent-primary-text)', padding: '6px', borderRadius: '8px' }}>
            <LineChart size={20} />
          </div>
          QuantScope
        </div>

        <nav aria-label="Main Navigation" style={{ flex: 1 }}>
          <NavLink to="/" end className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
            <LayoutDashboard size={18} /> Overview
          </NavLink>
          <NavLink to="/market-data" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
            <BarChart2 size={18} /> Market Data
          </NavLink>
          <NavLink to="/factors" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
            <Layers size={18} /> Factors
          </NavLink>
          <NavLink to="/backtests" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
            <LineChart size={18} /> Backtests
          </NavLink>
          <NavLink to="/ml" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
            <BrainCircuit size={18} /> ML Lab
          </NavLink>
        </nav>
        
        {/* Sidebar Footer */}
        <div style={{ marginTop: 'auto', borderTop: '1px solid var(--border-default)', paddingTop: '16px' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--data-green)' }}></div>
            System Online
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="app-main">
        {/* Header */}
        <header className="app-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <h2 style={{ fontSize: '1rem', margin: 0, fontWeight: 500 }}>Global Alpha Project</h2>
            <div className="badge"><Database size={12} style={{ marginRight: '4px' }} /> 500 Symbols</div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button 
              className="btn btn-outline" 
              style={{ padding: '6px 8px', borderColor: 'transparent' }}
              onClick={() => window.location.reload()}
              title="Refresh Data"
            >
              <RefreshCw size={18} />
            </button>
            <button 
              className="btn btn-outline" 
              style={{ padding: '6px 8px', borderColor: 'transparent' }}
              onClick={() => setIsDark(!isDark)}
              title="Toggle Theme"
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
        </header>

        {/* Page Content */}
        <div className="page-container">
          {children}
        </div>
      </main>
    </div>
  )
}
