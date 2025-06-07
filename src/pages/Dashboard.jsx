import { useEffect, useState } from "react";
import { topics } from "../data/topics";
import { db } from "../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import ProgressBar from "../components/ProgressBar";
import TopicCard from "../components/TopicCard";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const [progress, setProgress] = useState({});
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const loadProgress = async () => {
      const userDoc = await getDoc(doc(db, "users", userId));
      setProgress(userDoc.data().progress || {});
    };
    loadProgress();
  }, [userId]);

  const toggleComplete = async (id) => {
    const updated = { ...progress, [id]: !progress[id] };
    setProgress(updated);
    await updateDoc(doc(db, "users", userId), { progress: updated });
  };

  const completedCount = Object.values(progress).filter(Boolean).length;
  const percentage = Math.round((completedCount / topics.length) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-purple-100 to-pink-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">
          Welcome, {localStorage.getItem("name")}
        </h2>
        <Link
          to="/leaderboard"
          className="text-blue-700 font-semibold underline hover:text-blue-900"
        >
          Competitor Leaderboard →
        </Link>
      </div>

      <div className="text-lg text-green-700 font-medium mb-2">
        Progress: {percentage}%
      </div>
      <ProgressBar percentage={percentage} />

      <div className="mt-6 grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {topics.map((topic) => (
          <TopicCard
            key={topic.id}
            topic={topic}
            completed={progress[topic.id]}
            onToggle={() => toggleComplete(topic.id)}
          />
        ))}
      </div>
    </div>
  );
}