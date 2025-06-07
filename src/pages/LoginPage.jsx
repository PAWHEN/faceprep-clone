import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { collection, getDocs, doc, setDoc } from "firebase/firestore";

export default function LoginPage() {
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!name.trim()) {
      alert("Please enter your name.");
      return;
    }

    const usersSnapshot = await getDocs(collection(db, "users"));
    const existingUser = usersSnapshot.docs.find(
      (doc) => doc.data().name.toLowerCase() === name.trim().toLowerCase()
    );

    let userId;

    if (existingUser) {
      userId = existingUser.id;
    } else {
      const newUserNumber = usersSnapshot.size + 1;
      userId = `user${newUserNumber}`;
      await setDoc(doc(db, "users", userId), {
        name: name.trim(),
        progress: {},
      });
    }

    localStorage.setItem("userId", userId);
    localStorage.setItem("name", name.trim());
    navigate("/dashboard");
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-yellow-200 via-pink-200 to-purple-200">
      <div className="bg-white p-10 rounded-lg shadow-xl w-full max-w-md text-center">
        <h1 className="text-4xl font-bold mb-2 text-purple-800">Pawan's</h1>
        <h2 className="text-2xl font-semibold mb-6 text-gray-700">ToDo List </h2>
        <input
          placeholder="Enter your name"
          className="p-3 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-purple-500"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button
          onClick={handleLogin}
          className="mt-6 w-full py-3 bg-purple-600 text-white font-semibold rounded hover:bg-purple-700 transition"
        >
          Start Exploring
        </button>
      </div>
    </div>
  );
}