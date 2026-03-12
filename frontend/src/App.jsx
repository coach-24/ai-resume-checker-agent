import { BrowserRouter, Routes, Route } from "react-router-dom"

import Home from "./pages/Home"
import Upload from "./pages/Upload"
import Processing from "./pages/Processing"
import Dashboard from "./pages/Dashboard"

function App() {
  return (
    <BrowserRouter>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/processing" element={<Processing />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>

    </BrowserRouter>
  )
}

export default App