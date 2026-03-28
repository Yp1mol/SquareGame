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
    } = useGame();

    return (
        <div className="min-h-screen bg-white dark:bg-gray-900 flex flex-col items-center p-6">
            <div className="w-full flex justify-between items-center mb-4 max-w-5xl">
                <button 
                    onClick={leaveRoom} 
                    className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                >
                    Leave Room
                </button>
                <div className="font-mono font-bold">Room: {code}</div>
            </div>

            <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
                <div className="w-full grid grid-cols-2 gap-4 mb-6 relative">
                    {fields.map((field) => (
                        <GameField
                            key={field.id}
                            id={field.id}
                            title={field.title}
                            color={field.color}
                        >
                            <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
                                <h1 className="text-8xl font-black text-white">{field.title}</h1>
                            </div>
                            
                            {units
                                .filter(unit => unit.title === field.title)
                                .map((unit) => (
                                    <SquareDrag
                                        key={unit.id}
                                        id={unit.id}
                                        title={unit.title}
                                        color={unit.color}
                                        position={{ x: unit.x, y: unit.y }}
                                    />
                                ))}
                        </GameField>
                    ))}
                </div>
            </DndContext>

            <div className="flex justify-center w-full gap-4">
                <div className="w-3/4 h-50 bg-gray-50/50 dark:bg-gray-950 rounded-[2rem] border-2 border-dashed border-gray-200 dark:border-gray-800 flex items-center justify-center">
                    <span className="text-[10px] font-black text-gray-300 dark:text-gray-700 uppercase tracking-[0.3em]">
                        Deployment Zone
                    </span>
                </div>
                <div className="flex gap-2">
                    <button 
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-[2rem] transition"
                        onClick={reset}
                    >
                        Reset
                    </button>
                    <button 
                        className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-[2rem] transition"
                        onClick={savePositions}
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
}