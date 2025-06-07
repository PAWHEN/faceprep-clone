import { useState, useEffect, useRef } from "react";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  onSnapshot,
  where,
  getDocs,
  setDoc,
  doc
} from "firebase/firestore";
import { Link } from "react-router-dom";

export default function ChatRoom() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [chatMode, setChatMode] = useState("global");
  const [selectedUser, setSelectedUser] = useState("");
  const [users, setUsers] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);
  const userName = localStorage.getItem("name") || "Anonymous";
  const scrollRef = useRef(null);

  useEffect(() => {
    const q = query(
      collection(db, "messages"),
      where("mode", "==", chatMode),
      ...(chatMode !== "global"
        ? [where("participants", "array-contains", userName)]
        : []),
      orderBy("createdAt")
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setMessages(msgs);
      playNotification(msgs[msgs.length - 1]);
    });
    return () => unsubscribe();
  }, [chatMode, selectedUser]);

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await getDocs(collection(db, "users"));
      const others = res.docs
        .map((doc) => doc.data().name)
        .filter((name) => name !== userName);
      setUsers(others);
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    const typingRef = collection(db, "typing");
    const unsub = onSnapshot(typingRef, (snapshot) => {
      const typing = snapshot.docs
        .map((doc) => doc.id)
        .filter((name) => name !== userName);
      setTypingUsers(typing);
    });
    return () => unsub();
  }, []);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const newMessage = {
      text: message.trim(),
      sender: userName,
      createdAt: serverTimestamp(),
      mode: chatMode,
      participants: chatMode === "global" ? [] : [userName, selectedUser],
    };

    await addDoc(collection(db, "messages"), newMessage);
    await setDoc(doc(db, "typing", userName), { typing: false });
    setMessage("");
  };

  const handleTyping = async (text) => {
    setMessage(text);
    await setDoc(doc(db, "typing", userName), { typing: !!text.trim() });
  };

  const playNotification = (msg) => {
    if (msg?.sender !== userName) {
      const audio = new Audio("https://notificationsounds.com/notification-sounds/pop-1-16529/download/mp3");
      audio.play().catch(() => {});
    }
  };

  const getAvatar = (name) => {
    const colors = ["bg-red-400", "bg-blue-400", "bg-green-400", "bg-yellow-400", "bg-purple-400"];
    const color = colors[name.charCodeAt(0) % colors.length];
    return (
      <div className={`w-8 h-8 flex items-center justify-center rounded-full text-white font-bold ${color}`}>
        {name[0].toUpperCase()}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 via-purple-100 to-pink-100 p-4">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-blue-800">
            {chatMode === "global"
              ? "🌐 Global Chat Room"
              : `💬 Chat with ${selectedUser}`}
          </h2>
          <Link to="/dashboard" className="text-sm underline text-blue-500">
            ← Back to Dashboard
          </Link>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Select Chat Mode
          </label>
          <select
            value={chatMode}
            onChange={(e) => {
              setChatMode(e.target.value);
              setSelectedUser("");
            }}
            className="p-2 border rounded w-full"
          >
            <option value="global">Global Chat</option>
            <option value="private">One-on-One</option>
          </select>

          {chatMode === "private" && (
            <select
              className="p-2 border rounded w-full mt-2"
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
            >
              <option value="">Select User</option>
              {users.map((name, idx) => (
                <option key={idx} value={name}>
                  {name}
                </option>
              ))}
            </select>
          )}
        </div>

        <div className="h-80 overflow-y-auto bg-gray-100 p-3 rounded mb-4" ref={scrollRef}>
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`mb-2 flex ${
                msg.sender === userName ? "justify-end" : "justify-start"
              }`}
            >
              {msg.sender !== userName && getAvatar(msg.sender)}
              <div
                className={`ml-2 p-2 rounded-md ${
                  msg.sender === userName
                    ? "bg-blue-200 text-right"
                    : "bg-gray-200 text-left"
                }`}
                style={{ maxWidth: "70%" }}
              >
                <div className="text-sm font-semibold text-gray-800">
                  {msg.sender}
                </div>
                <div className="text-md">{msg.text}</div>
              </div>
            </div>
          ))}
        </div>

        {typingUsers.length > 0 && (
          <div className="text-sm text-gray-600 mb-2">
            {typingUsers.join(", ")} typing...
          </div>
        )}

        <form onSubmit={handleSend} className="flex space-x-2">
          <input
            value={message}
            onChange={(e) => handleTyping(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 border rounded p-2"
          />
          <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Send
          </button>
        </form>
      </div>
    </div>
  );
}