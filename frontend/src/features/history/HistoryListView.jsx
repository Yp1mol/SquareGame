import React from 'react';
import { useNavigate } from "react-router-dom";
import { useHistoryList } from "./hooks/useHistoryList";

export default function HistoryListView() {
  const { history, handleDeleteHistory } = useHistoryList();
  const navigate = useNavigate();

  const handleSeeResult = (battleId) => {
    const id = Number(battleId);

    if (id) {
      navigate(`/history/${id}`);
    } else {
      console.error('Invalid battle ID:', battleId);
    }
  };

  const getWinnerText = (battle) => {
    if (battle.statusId === 10) {
      return battle.owner?.username || 'Owner';
    }

    if (battle.statusId === 11) {
      return battle.guest?.username || 'Guest';
    }

    return 'Draw';
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold mb-6 dark:text-white" >Battle History</h1>
        {history.length > 0 && (
          <button 
            onClick={handleDeleteHistory}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-colors"
          >
            Delete All
          </button>
        )}
      </div>
      {history.length === 0 ? (
        <div className="text-center text-gray-500">No battles yet</div>
      ) : (
        <div className="space-y-4">
          {history.map((battle) => {
            const winnerText = getWinnerText(battle);
            const isDraw = battle.statusId === 12;

            return (
              <div key={battle.id} className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg shadow">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-mono text-sm text-gray-500">Room: {battle.room?.code}</div>
                    <div className="text-sm text-gray-700 dark:text-gray-300">
                      Result:{' '}
                      <span className={`font-bold ${isDraw ? 'text-amber-500' : 'text-green-600'}`}>
                        {isDraw ? 'Draw' : `Winner: ${winnerText}`}
                      </span>
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
            );
          })}
        </div>
      )}
    </div>
  );
}