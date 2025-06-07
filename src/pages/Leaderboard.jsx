import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { topics } from "../data/topics";

export default function Leaderboard() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const loadLeaderboard = async () => {
      const snapshot = await getDocs(collection(db, "users"));
      const data = snapshot.docs.map((doc) => {
        const progress = doc.data().progress || {};
        const score = Object.values(progress).filter(Boolean).length;
        return { id: doc.id, name: doc.data().name, score };
      });
      setUsers(data.sort((a, b) => b.score - a.score));
    };
    loadLeaderboard();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-purple-100 p-6">
      <h1 className="text-3xl font-bold text-center mb-6 text-blue-900">Leaderboard</h1>
      <div className="grid gap-4 max-w-4xl mx-auto">
        {users.map((user, index) => (
          <div
            key={index}
            className="bg-white shadow-md rounded-lg p-4 flex items-center justify-between"
          >
            <div>
              <h2 className="font-bold text-lg text-gray-800">
                {index + 1}. {user.name}
              </h2>
              <p className="text-green-600">
                Progress: {Math.round((user.score / topics.length) * 100)}%
              </p>
            </div>
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
              onClick={() => alert(`Chat with ${user.name} (Coming soon!)`)}
            >
              Chat 💬
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}