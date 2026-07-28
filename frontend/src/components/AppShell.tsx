import React from 'react'
import { NavLink } from 'react-router-dom'

interface AppShellProps {
  children: React.ReactNode
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="header-container">
          <div className="app-brand">
            <span>📈 QuantScope</span>
          </div>
          <nav className="app-nav" aria-label="Main Navigation">
            <NavLink
              to="/"
              end
              className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
            >
              Overview
            </NavLink>
            <NavLink
              to="/market-data"
              className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
            >
              Market Data
            </NavLink>
            <NavLink
              to="/factors"
              className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
            >
              Factors
            </NavLink>
            <NavLink
              to="/backtests"
              className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
            >
              Backtests
            </NavLink>
            <NavLink
              to="/ml"
              className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
            >
              ML Lab
            </NavLink>
          </nav>
        </div>
      </header>
      <main>{children}</main>
    </div>
  )
}
