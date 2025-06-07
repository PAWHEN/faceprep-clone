import { Link, useLocation } from "react-router-dom";

export default function Sidebar() {
  const location = useLocation();
  const linkStyle = (path) =>
    location.pathname === path
      ? "bg-purple-500 text-white"
      : "text-purple-800 hover:bg-purple-200";

  return (
    <div className="w-48 bg-purple-100 p-4 h-screen sticky top-0">
      <h2 className="text-lg font-bold mb-4 text-purple-700">Pawan's Todo</h2>
      <nav className="flex flex-col space-y-2">
        <Link to="/dashboard" className={`p-2 rounded ${linkStyle("/dashboard")}`}>
  Dashboard
</Link>
<Link to="/leaderboard" className={`p-2 rounded ${linkStyle("/leaderboard")}`}>
  Leaderboard
</Link>
<Link to="/chat" className={`p-2 rounded ${linkStyle("/chat")}`}>
  Chat
</Link>
<Link to="/xo" className={`p-2 rounded ${linkStyle("/xo")}`}>
  XO Game
</Link>

      </nav>
    </div>
  );
}