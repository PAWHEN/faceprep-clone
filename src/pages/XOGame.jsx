import { useState, useEffect } from "react";
import { db } from "../firebase";
import {
  doc,
  setDoc,
  onSnapshot,
  getDoc,
  serverTimestamp
} from "firebase/firestore";

const initialBoard = Array(9).fill(null);

export default function XOGame() {
  const [board, setBoard] = useState(initialBoard);
  const [isX, setIsX] = useState(true);
  const [gameId, setGameId] = useState("global-xo");
  const [status, setStatus] = useState("Waiting for player...");
  const [player, setPlayer] = useState("");
  const name = localStorage.getItem("name");

  useEffect(() => {
    setPlayer(Math.random() > 0.5 ? "X" : "O");
    const unsub = onSnapshot(doc(db, "xo", gameId), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setBoard(data.board);
        setIsX(data.isX);
        setStatus(data.status);
      }
    });
    return () => unsub();
  }, [gameId]);

  const makeMove = async (index) => {
    if (board[index] || (isX && player !== "X") || (!isX && player !== "O")) return;

    const newBoard = [...board];
    newBoard[index] = isX ? "X" : "O";
    const winner = calculateWinner(newBoard);

    await setDoc(doc(db, "xo", gameId), {
      board: newBoard,
      isX: !isX,
      status: winner ? `${winner} wins!` : "Game in progress...",
      updatedAt: serverTimestamp()
    });
  };

  const resetGame = async () => {
    await setDoc(doc(db, "xo", gameId), {
      board: initialBoard,
      isX: true,
      status: "New game started!",
      updatedAt: serverTimestamp()
    });
  };

  const calculateWinner = (b) => {
    const lines = [
      [0,1,2],[3,4,5],[6,7,8],
      [0,3,6],[1,4,7],[2,5,8],
      [0,4,8],[2,4,6]
    ];
    for (const [a,b1,c] of lines) {
      if (b[a] && b[a] === b[b1] && b[a] === b[c]) return b[a];
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-yellow-100 to-pink-100 p-4">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6 text-center">
        <h1 className="text-2xl font-bold text-purple-700 mb-2">Tic-Tac-Toe Game</h1>
        <p className="mb-4 text-gray-700">You are playing as: <span className="font-semibold">{player}</span></p>
        <div className="grid grid-cols-3 gap-2 mx-auto w-48">
          {board.map((cell, i) => (
            <button
              key={i}
              className="w-16 h-16 text-2xl font-bold bg-purple-200 hover:bg-purple-300 rounded"
              onClick={() => makeMove(i)}
            >
              {cell}
            </button>
          ))}
        </div>
        <p className="mt-4 font-semibold text-green-700">{status}</p>
        <button
          onClick={resetGame}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Reset Game
        </button>
      </div>
    </div>
  );
}