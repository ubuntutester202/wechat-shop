import React from 'react'
import { Routes, Route } from 'react-router-dom'
import WelcomePage from './pages/onboarding/WelcomePage'

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/welcome" element={<WelcomePage />} />
      </Routes>
    </div>
  )
}

export default App 