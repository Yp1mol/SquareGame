import React from 'react';
import { useNavigate } from "react-router-dom";
import { useHistoryList } from "./hooks/useHistoryList";

export default function HistoryListView() {
  const { history } = useHistoryList();
  const navigate = useNavigate();

  const handleSeeResult = (battleId) => {
    const id = Number(battleId);
    if (id) {
      navigate(`/history/${id}`);
    } else {
      console.error('Invalid battle ID:', battleId);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 p-6">
      <h1 className="text-2xl font-bold mb-6 dark:text-white">Battle History</h1>

      {history.length === 0 ? (
        <div className="text-center text-gray-500">No battles yet</div>
      ) : (
        <div className="space-y-4">
          {history.map((battle) => (
            <div key={battle.id} className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg shadow">
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-mono text-sm text-gray-500">Room: {battle.room?.code}</div>
                  <div className="text-sm">
                    Winner: <span className="font-bold text-green-600">{battle.winner?.username || 'Draw'}</span>
                  </div>
                  <div className="text-sm text-gray-500">Cost: {battle.cost} credits</div>
                </div>
                <div className="text-sm text-gray-400">
                  {battle.createdAt ? new Date(battle.createdAt).toLocaleDateString() : 'Unknown date'}
                </div>
                <button
                  onClick={() => handleSeeResult(battle.id)}
                  className="bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 rounded text-sm"
                >
                  SEE RESULT
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}