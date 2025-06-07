import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import Leaderboard from "./pages/Leaderboard";
import ChatRoom from "./pages/ChatRoom";
import XOGame from "./pages/XOGame";
import Sidebar from "./components/Sidebar";

function App() {
  return (
    <BrowserRouter>
      <div className="flex">
        <Sidebar />
        <div className="flex-1">
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/chat" element={<ChatRoom />} />
            <Route path="/xo" element={<XOGame />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;