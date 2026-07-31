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
  RefreshCw
} from 'lucide-react'

interface AppShellProps {
  children: React.ReactNode
}

const navigation = [
  { to: '/', label: 'Home', icon: LayoutDashboard, end: true },
  { to: '/market-data', label: 'Markets', icon: BarChart2 },
  { to: '/factors', label: 'Factors', icon: Layers },
  { to: '/backtests', label: 'Strategies', icon: LineChart },
  { to: '/ml', label: 'ML Signals', icon: BrainCircuit },
]

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const [isDark, setIsDark] = useState(true)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light')
  }, [isDark])

  return (
    <div className="app-shell">
      {/* Sidebar */}
      <aside className="app-sidebar">
        <div className="app-brand" style={{ fontSize: '1.25rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '32px' }}>
          <div style={{ background: 'var(--accent)', color: '#fff', padding: '6px', borderRadius: '8px', display: 'flex' }}>
            <LineChart size={20} />
          </div>
          <span className="nav-label">QuantScope</span>
        </div>

        <nav aria-label="Main Navigation" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {navigation.map((item) => (
            <NavLink 
              key={item.to} 
              to={item.to} 
              end={item.end}
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              style={({ isActive }) => ({
                display: 'flex', alignItems: 'center', gap: '12px', padding: '8px 12px',
                borderRadius: '8px',
                backgroundColor: isActive ? 'var(--surface-2)' : 'transparent',
                color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                fontWeight: 500
              })}
            >
              <item.icon size={18} /> <span className="nav-label">{item.label}</span>
            </NavLink>
          ))}
          <button 
            disabled 
            aria-disabled="true"
            className="nav-link"
            style={{
              display: 'flex', alignItems: 'center', gap: '12px', padding: '8px 12px',
              borderRadius: '8px',
              backgroundColor: 'transparent',
              color: 'var(--text-secondary)',
              fontWeight: 500,
              border: 'none',
              cursor: 'not-allowed',
              opacity: 0.6,
              textAlign: 'left'
            }}
          >
            <Layers size={18} /> <span className="nav-label">Watchlist — Coming soon</span>
          </button>
        </nav>
      </aside>

      <nav className="app-bottom-nav" aria-label="Bottom Navigation">
        {navigation.map((item) => (
          <NavLink 
            key={item.to} 
            to={item.to} 
            end={item.end}
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            style={({ isActive }) => ({
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', padding: '8px',
              color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
              fontWeight: 500,
              fontSize: '0.75rem'
            })}
          >
            <item.icon size={20} /> <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Main Content */}
      <main className="app-main">
        {/* Header */}
        <header className="top-bar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>

            <div className="status-badge">Research workspace</div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button 
              style={{ padding: '6px 8px', border: 'none', background: 'transparent', color: 'var(--text-secondary)', cursor: 'pointer' }}
              onClick={() => window.location.reload()}
              title="Refresh Data"
            >
              <RefreshCw size={18} />
            </button>
            <button 
              style={{ padding: '6px 8px', border: 'none', background: 'transparent', color: 'var(--text-secondary)', cursor: 'pointer' }}
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
