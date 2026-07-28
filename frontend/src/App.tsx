import { Navigate, Route, Routes } from 'react-router-dom'
import { AppShell } from './components/AppShell'
import { OverviewPage } from './pages/OverviewPage'
import { MarketDataPage } from './pages/MarketDataPage'
import { FactorsPage } from './pages/FactorsPage'
import { BacktestsPage } from './pages/BacktestsPage'
import { MLLabPage } from './pages/MLLabPage'

export function App() {
  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<OverviewPage />} />
        <Route path="/market-data" element={<MarketDataPage />} />
        <Route path="/factors" element={<FactorsPage />} />
        <Route path="/backtests" element={<BacktestsPage />} />
        <Route path="/ml" element={<MLLabPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppShell>
  )
}