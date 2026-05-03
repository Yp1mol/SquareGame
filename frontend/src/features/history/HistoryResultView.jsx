import React from "react";
import { useParams } from "react-router-dom";
import { GameField } from "../../components/game/GameField";
import SquareDrag from "../../components/game/SquareDrag";
import { useBattle } from "./hooks/useHistoryResult";
import { Link } from "react-router-dom";

export default function HistoryResultView() {
  const { id } = useParams();
  const { battle } = useBattle(id);

  if (!battle) {
    return <div className="text-center p-8">Battle not found</div>;
  }

  const ownerAttack = battle.ownerPositions?.find(p => p.unitId === 'attack');
  const ownerProtect = battle.ownerPositions?.find(p => p.unitId === 'protect');
  const guestAttack = battle.guestPositions?.find(p => p.unitId === 'attack');
  const guestProtect = battle.guestPositions?.find(p => p.unitId === 'protect');

  const ownerFieldUnits = [
    { id: "owner-protect", title: "OWNER'S PROTECT", color: "bg-blue-600", x: ownerProtect?.x || 0, y: ownerProtect?.y || 0, owner: "owner" },
    { id: "guest-attack", title: "GUEST'S ATTACK", color: "bg-red-600", x: guestAttack?.x || 0, y: guestAttack?.y || 0, owner: "guest" }
  ];

  const guestFieldUnits = [
    { id: "guest-protect", title: "GUEST'S PROTECT", color: "bg-blue-600", x: guestProtect?.x || 0, y: guestProtect?.y || 0, owner: "guest" },
    { id: "owner-attack", title: "OWNER'S ATTACK", color: "bg-red-600", x: ownerAttack?.x || 0, y: ownerAttack?.y || 0, owner: "owner" }
  ];

  const winnerName = battle.winner?.username || "Draw";

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex flex-col items-center p-6">
      <div className="w-full max-w-5xl mb-4">
        <Link
          to="/profile"
          className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition"
        >
          Back
        </Link>
      </div>

      <h1 className="text-2xl font-bold mb-2 dark:text-white">Battle Result</h1>
      <div className="text-lg mb-6">
        Winner: <span className="font-bold text-green-600">{winnerName}</span>
      </div>

      <div className="w-full grid grid-cols-2 gap-4 mb-6 relative">
        <div className="relative">
          <GameField
            id="owner-field"
            title="OWNER'S FIELD"
            color="bg-blue-400 dark:bg-blue-900"
          >
            <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
              <h1 className="text-8xl font-black text-blue-800 dark:text-blue-200">OWNER</h1>
            </div>

            {ownerFieldUnits.map((unit) => (
              <SquareDrag
                key={unit.id}
                id={unit.id}
                title={unit.title}
                color={unit.color}
                position={{ x: unit.x, y: unit.y }}
              />
            ))}
          </GameField>
        </div>

        <div className="relative">
          <GameField
            id="guest-field"
            title="GUEST'S FIELD"
            color="bg-red-400 dark:bg-red-900"
          >
            <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
              <h1 className="text-8xl font-black text-red-800 dark:text-red-200">GUEST</h1>
            </div>

            {guestFieldUnits.map((unit) => (
              <SquareDrag
                key={unit.id}
                id={unit.id}
                title={unit.title}
                color={unit.color}
                position={{ x: unit.x, y: unit.y }}
              />
            ))}
          </GameField>
        </div>
      </div>

      <div className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
        Battle cost: {battle.cost} credits
      </div>
    </div>
  );
}
