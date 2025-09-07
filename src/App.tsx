import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useGameStore } from '@/stores/useGameStore'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { MainMenu } from '@/pages/MainMenu'
import { LevelSelect } from '@/pages/LevelSelect'
import { GameLevel } from '@/pages/GameLevel'
import { BossLevel } from '@/pages/BossLevel'
import { Vocabulary } from '@/pages/Vocabulary'
import { Settings } from '@/pages/Settings'
import { Achievements } from '@/pages/Achievements'

function App() {
  const initialize = useGameStore((state) => state.initialize)

  useEffect(() => {
    // Initialize game store on app mount
    initialize()
  }, [initialize])

  return (
    <ErrorBoundary>
      <Router>
        <Routes>
          <Route path="/" element={<MainMenu />} />
          <Route path="/levels" element={<LevelSelect />} />
          <Route path="/game/:levelId" element={<GameLevel />} />
          <Route path="/boss/:bossId" element={<BossLevel />} />
          <Route path="/vocabulary" element={<Vocabulary />} />
          <Route path="/achievements" element={<Achievements />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </ErrorBoundary>
  )
}

export default App