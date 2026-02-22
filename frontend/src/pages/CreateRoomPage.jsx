import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function CreateRoomPage() {
  const [roomCode, setRoomCode] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    setRoomCode(code);
  }, []);

  const handleCreate = async () => {
  try {
    navigate(`/game/${roomCode}`);
  } catch (err) {
    alert("Error creating room");
  }
};

return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-white dark:bg-gray-900 transition-colors p-4">
      <div className="w-full max-w-sm">
        
        <Link to="/home" className="text-xs font-bold text-gray-400 hover:text-blue-500 transition-colors mb-6 block w-fit">
          BACK
        </Link>

        <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 text-center">
          <h1 className="text-2xl font-black mb-1 dark:text-white">1 VS 1</h1>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-10">Private Match</p>

          <button 
            onClick={handleCreate}
            className="w-full bg-green-500 hover:bg-green-600 text-white py-5 rounded-2xl font-black text-lg shadow-lg transition-all active:scale-95 mb-10"
          >
            CREATE ROOM
          </button>

          <div className="max-w-[70%] mx-auto">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Room Code</label>
            <input 
              className="w-full bg-transparent border-b-2 border-gray-200 dark:border-gray-700 py-2 text-center font-mono text-2xl font-black text-gray-800 dark:text-white outline-none focus:border-green-500 transition-all uppercase"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
            />
          </div>

          <p className="mt-10 text-[11px] font-bold text-blue-500/80 uppercase tracking-tight">
            After creating, you'll need to wait for one more player to join
          </p>
        </div>
      </div>
    </div>
  );
}