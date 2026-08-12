import React from "react";
import { useGame } from "./hooks/useGame";
import ComponentDrawer from "../../components/game/ComponentDrawer";
import { useState } from "react";

export default function GameView() {
    const {
        code,
        leaveRoom,
        isOwner,
        ownerReady,
        guestReady,
        finishSetup,
        attackCells,
        protectCells,
        setAttackCells,
        setProtectCells,
        reset,
        savePositions,
    } = useGame();

    const hasFinishedSetup = isOwner ? ownerReady : guestReady;

    const showFinishButton = () => {
        if (isOwner && !ownerReady) return true;
        if (!isOwner && !guestReady && ownerReady) return true;
        return false;
    };

    const cellsMismatch =
        attackCells.length > 0 &&
        protectCells.length > 0 &&
        attackCells.length !== protectCells.length;

    const [showMismatchModal, setShowMismatchModal] = useState(false);

    const handleSave = async () => {
        if (attackCells.length === 0 || protectCells.length === 0) {
            setShowMismatchModal(true);
            return;
        }
        if (attackCells.length !== protectCells.length) {
            setShowMismatchModal(true);
            return;
        }
        await savePositions();
    };

    return (

        <div className="min-h-screen bg-white dark:bg-gray-900 flex flex-col items-center p-4 md:p-6">
            {showMismatchModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-sm w-full shadow-xl text-center">
                        <p className="font-bold text-lg mb-2 dark:text-white">Cells mismatch</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                            ATTACK: {attackCells.length} · PROTECT: {protectCells.length}.
                            Units must have the same number of cells before saving and more than 0.
                        </p>
                        <button
                            onClick={() => setShowMismatchModal(false)}
                            className="w-full py-2 rounded-xl bg-gray-200 dark:bg-gray-700 font-bold"
                        >
                            OK
                        </button>
                    </div>
                </div>
            )}
            <div className="w-full max-w-5xl flex justify-between items-center mb-4">
                
                <button
                    onClick={leaveRoom}
                    className="px-3 py-1.5 text-sm md:px-4 md:py-2 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                >
                    Leave Room
                </button>
                <div className="font-mono font-bold text-sm md:text-base">Room: {code}</div>
            </div>

            <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <ComponentDrawer
                    title="ATTACK"
                    fieldColor="bg-red-400 dark:bg-red-900"
                    color="bg-red-600"
                    cells={attackCells}
                    onChange={setAttackCells}
                    disabled={hasFinishedSetup}
                />
                <ComponentDrawer
                    title="PROTECT"
                    fieldColor="bg-blue-400 dark:bg-blue-900"
                    color="bg-blue-600"
                    cells={protectCells}
                    onChange={setProtectCells}
                    disabled={hasFinishedSetup}
                />
            </div>

            <div className="flex flex-col sm:flex-row justify-center items-center w-full max-w-5xl gap-4">
                {cellsMismatch && (
                    <div className="w-full max-w-5xl mb-4 px-4 py-3 rounded-xl bg-red-50 dark:bg-red-900/40 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-300 text-sm font-bold text-center">
                        ATTACK and PROTECT must have the same number of cells
                        ({attackCells.length} vs {protectCells.length})
                    </div>
                )}
                {!hasFinishedSetup && !cellsMismatch ? (
                    <div className="flex gap-2 w-full sm:w-auto justify-center">
                        <button
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-xl md:rounded-[2rem] transition text-sm md:text-base"
                            onClick={reset}
                        >
                            Reset
                        </button>
                        <button
                            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-xl md:rounded-[2rem] transition text-sm md:text-base"
                            onClick={handleSave}
                        >
                            Save
                        </button>
                    </div>
                ) : (
                    <div></div>
                )}

                {showFinishButton() && !cellsMismatch && (
                    <button
                        onClick={finishSetup}
                        className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-6 rounded-xl md:rounded-[2rem] transition text-sm md:text-base"
                    >
                        FINISH SETUP
                    </button>
                )}
            </div>
        </div>
    );
}