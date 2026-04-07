import { BrowserRouter, Routes, Route } from "react-router-dom";
import Auth from "./pages/Auth"; // 👈 NEW
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* AUTH PAGE (Login + Signup) */}
        <Route path="/" element={<Auth />} />

        {/* DASHBOARD */}
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;