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
            <svg className="brand-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
            <span>QuantScope</span>
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
