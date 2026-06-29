import { DndContext } from '@dnd-kit/core';
import { GameField } from "../../components/game/GameField";
import SquareDrag from "../../components/game/SquareDrag";
import { useGame } from "./hooks/useGame";
import React from "react";

export default function GameView() {
    const {
        code,
        fields,
        units,
        reset,
        savePositions,
        leaveRoom,
        handleDragEnd,
        sensors,
        isOwner,
        ownerReady,
        guestReady,
        finishSetup,
        fieldDimensions
    } = useGame();

    const showFinishButton = () => {
        if (isOwner && !ownerReady) {
            return true;
        }

        if (!isOwner && !guestReady && ownerReady) {
            return true;
        }
        
        return false;
    };

    const hasFinishedSetup = isOwner ? ownerReady : guestReady;

    return (
        <div className="min-h-screen bg-white dark:bg-gray-900 flex flex-col items-center p-4 md:p-6">
            <div className="w-full max-w-5xl flex justify-between items-center mb-4">
                <button
                    onClick={leaveRoom}
                    className="px-3 py-1.5 text-sm md:px-4 md:py-2 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                >
                    Leave Room
                </button>
                <div className="font-mono font-bold text-sm md:text-base">Room: {code}</div>
            </div>

            <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
                <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 relative">
                    {fields.map((field) => (
                        <GameField
                            key={field.id}
                            id={field.id}
                            title={field.title}
                            color={field.color}
                        >
                            <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
                                <h1 className="text-4xl md:text-8xl font-black text-white">{field.title}</h1>
                            </div>

                            {units
                                .filter(unit => unit.title === field.title && unit.x !== -1)
                                .map((unit) => (
                                    <SquareDrag
                                        key={unit.id}
                                        id={unit.id}
                                        title={unit.title}
                                        color={unit.color}
                                        position={{ x: unit.x, y: unit.y }}
                                        fieldDimensions={fieldDimensions}
                                        disabled={hasFinishedSetup}
                                    />
                                ))}
                        </GameField>
                    ))}
                </div>

                <div className="flex flex-col sm:flex-row justify-center items-center w-full max-w-5xl gap-4">
                    {!hasFinishedSetup && (
                        <>
                            <div id="deployment-zone" className="w-full sm:w-3/4 h-24 md:h-32 bg-gray-50/50 dark:bg-gray-950 rounded-2xl md:rounded-[2rem] border-2 border-dashed border-gray-200 dark:border-gray-800 flex items-center justify-center gap-6 p-4">
                                {units.filter(u => u.x === -1).length === 0 ? (
                                    <span className="text-[8px] md:text-[10px] font-black text-gray-300 dark:text-gray-700 uppercase tracking-[0.3em]">
                                        Deployment Zone Empty
                                    </span>
                                ) : (
                                    units
                                        .filter(unit => unit.x === -1)
                                        .map((unit) => (
                                            <SquareDrag
                                                key={unit.id}
                                                id={unit.id}
                                                title={unit.title}
                                                color={unit.color}
                                                position={{ x: unit.x, y: unit.y }}
                                                fieldDimensions={fieldDimensions}
                                                disabled={hasFinishedSetup}
                                            />
                                        ))
                                )}
                            </div>
                            <div className="flex gap-2 w-full sm:w-auto justify-center">
                                <button
                                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-xl md:rounded-[2rem] transition text-sm md:text-base"
                                    onClick={reset}
                                >
                                    Reset
                                </button>
                                <button
                                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-xl md:rounded-[2rem] transition text-sm md:text-base"
                                    onClick={savePositions}
                                >
                                    Save
                                </button>
                            </div>
                        </>
                    )}
                    
                    {showFinishButton() && (
                        <button
                            onClick={finishSetup}
                            className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-6 rounded-xl md:rounded-[2rem] transition text-sm md:text-base"
                        >
                            FINISH SETUP
                        </button>
                    )}
                </div>
            </DndContext>
        </div>
    );
}