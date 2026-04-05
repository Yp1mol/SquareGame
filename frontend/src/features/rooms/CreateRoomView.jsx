import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useCreateRoom } from "./hooks/useCreateRoom";

export default function CreateRoomView() {
  const { roomCode, setRoomCode, handleCreate, error } = useCreateRoom();
  const [cost, setCost] = useState(1);

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-white dark:bg-gray-900 transition-colors p-4">
      <div className="w-full max-w-sm">
        <Link
          to="/home"
          className="text-xs font-bold text-gray-400 hover:text-blue-500 transition-colors mb-6 block w-fit"
        >
          BACK
        </Link>

        <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 text-center">
          <h1 className="text-2xl font-black mb-1 dark:text-white">1 VS 1</h1>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-6">
            Private Match
          </p>

          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl">
              <p className="text-red-600 dark:text-red-400 text-sm font-medium">
                {error}
              </p>
            </div>
          )}

          <div className="mb-6">
            <label className="text-sm font-bold text-gray-600 dark:text-gray-400 mb-2 block">
              Room Cost: {cost} credit{ cost !== 1 ? 's' : '' }
            </label>
            <input
              type="range"
              min="1"
              max="10"
              value={cost}
              onChange={(e) => setCost(parseInt(e.target.value))}
              className="w-full accent-green-500"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>1</span>
              <span>5</span>
              <span>10</span>
            </div>
          </div>

          <button
            onClick={() => handleCreate(cost)}
            className="w-full py-5 rounded-2xl font-black text-lg shadow-lg transition-all active:scale-95 mb-6 bg-green-500 hover:bg-green-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            CREATE ROOM
          </button>

          <div className="max-w-[70%] mx-auto">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">
              Room Code
            </label>
            <input
              className="w-full bg-transparent border-b-2 border-gray-200 dark:border-gray-700 py-2 text-center font-mono text-2xl font-black text-gray-800 dark:text-white outline-none focus:border-green-500 transition-all uppercase"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
            />
          </div>

          <p className="mt-6 text-[11px] font-bold text-blue-500/80 uppercase tracking-tight">
            After creating, you&apos;ll need to wait for one more player to join
          </p>
        </div>
      </div>
    </div>
  );
}