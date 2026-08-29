import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AppShell } from './components/layout/AppShell'
import { Home } from './pages/Home'
import { Portfolio } from './pages/Portfolio'
import { PortfolioDetail } from './pages/PortfolioDetail'
import { Backlog } from './pages/Backlog'
import { IdeaBank } from './pages/IdeaBank'
import { Inbox } from './pages/Inbox'
import { Settings } from './pages/Settings'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route index element={<Home />} />
          <Route path="portfolio" element={<Portfolio />} />
          <Route path="portfolio/:areaId" element={<PortfolioDetail />} />
          <Route path="backlog" element={<Backlog />} />
          <Route path="ideas" element={<IdeaBank />} />
          <Route path="inbox" element={<Inbox />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
