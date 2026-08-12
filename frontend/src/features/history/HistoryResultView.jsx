import React from "react";
import { useParams, Link } from "react-router-dom";
import ComponentDrawer from "../../components/game/ComponentDrawer";
import { useHistoryResult } from "./hooks/useHistoryResult";

export default function HistoryResultView() {
  const { id } = useParams();
  const { battle } = useHistoryResult(id);

  if (!battle) {
    return <div className="text-center p-8 dark:text-white">Battle not found or loading...</div>;
  }

  const isAttack = (unitId) => unitId === 'attack' || unitId === 'attacker' || unitId === '1';
  const isProtect = (unitId) => unitId === 'protect' || unitId === 'defender' || unitId === 'defense' || unitId === '2';

  const ownerAttack = battle.ownerPositions?.find(p => isAttack(p.unitId))?.cells || [];
  const ownerProtect = battle.ownerPositions?.find(p => isProtect(p.unitId))?.cells || [];
  const guestAttack = battle.guestPositions?.find(p => isAttack(p.unitId))?.cells || [];
  const guestProtect = battle.guestPositions?.find(p => isProtect(p.unitId))?.cells || [];

  const getOverlap = (cellsA, cellsB) => {
    const setA = new Set(cellsA.map(c => `${c.x},${c.y}`));
    return cellsB.filter(c => setA.has(`${c.x},${c.y}`));
  };

  const ownerFieldOverlap = getOverlap(ownerProtect, guestAttack);
  const guestFieldOverlap = getOverlap(guestProtect, ownerAttack);

  const getWinnerText = () => {
    if (battle.statusId === 10) return battle.owner?.username || "Owner";
    if (battle.statusId === 11) return battle.guest?.username || "Guest";
    return "Draw";
  };

  const winnerName = getWinnerText();
  const isDraw = battle.statusId === 12;

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex flex-col items-center p-4 md:p-6">
      <div className="w-full max-w-5xl mb-4">
        <Link
          to="/profile"
          className="px-3 py-1.5 text-sm md:px-4 md:py-2 bg-gray-200 dark:bg-gray-700 dark:text-white rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition"
        >
          Back
        </Link>
      </div>

      <h1 className="text-xl md:text-2xl font-bold mb-2 dark:text-white">Battle Result</h1>
      <div className="text-base md:text-lg mb-6 dark:text-gray-300">
        Result:{" "}
        <span className={`font-bold ${isDraw ? "text-amber-500" : "text-green-600"}`}>
          {isDraw ? "Draw" : `Winner: ${winnerName}`}
        </span>
      </div>

      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
        
        <ComponentDrawer
          title="OWNER'S FIELD"
          color="bg-blue-500"
          secondaryColor="bg-red-500"
          cells={ownerProtect}
          secondaryCells={guestAttack}
          overlapCells={ownerFieldOverlap}
          disabled={true}
        />

        {/* ПОЛЕ ГОСТЯ */}
        <ComponentDrawer
          title="GUEST'S FIELD"
          color="bg-blue-500"
          secondaryColor="bg-red-500"
          cells={guestProtect}
          secondaryCells={ownerAttack}
          overlapCells={guestFieldOverlap}
          disabled={true}
        />
        
      </div>

      <div className="text-center text-xs md:text-sm text-gray-500 dark:text-gray-400 mt-4">
        Battle cost: {battle.cost} credits
      </div>
    </div>
  );
}