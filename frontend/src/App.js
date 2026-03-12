import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom"
import { AnimatePresence } from "framer-motion"

import { ThemeProvider } from "./context/ThemeContext"
import ErrorBoundary from "./components/ErrorBoundary"


import Home from "./pages/Home"
import Upload from "./pages/Upload"
import Processing from "./pages/Processing"
import Dashboard from "./pages/Dashboard"

function AnimatedRoutes() {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/"           element={<Home />} />
        <Route path="/upload"     element={<Upload />} />
        <Route path="/processing" element={<Processing />} />
        <Route path="/dashboard"  element={<Dashboard />} />
        <Route path="*"           element={<Home />} />
      </Routes>
    </AnimatePresence>
  )
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <Router>
          <AnimatedRoutes />
        </Router>
      </ThemeProvider>
    </ErrorBoundary>
  )
}

export default App