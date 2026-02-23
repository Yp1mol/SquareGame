import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { DndContext, useSensor, useSensors, PointerSensor, rectIntersection } from '@dnd-kit/core';
import { useAuth } from "../contexts/authContext";
import { SquareDrag } from "./SquareDrag";
import { GameField } from "./GameField";

export default function gamePage() {
    const { code } = useParams();
    const { user } = useAuth();
    const [isDark, setIsDark] = useState(true);
    const [units, setUnits] = useState(() => {
        const savedState = localStorage.getItem(`game_${code}`);

        if (savedState) {
            return JSON.parse(savedState);
        }

        return [
            { id: 'attack', title: 'Attack', color: 'bg-red-600', x: -200, y: 666 },
            { id: 'protect', title: 'Protect', color: 'bg-blue-600', x: 250, y: 666 },
        ];
    });
    const SIZE = 1600;
    const sensors = useSensors(useSensor(PointerSensor, {
        activationConstraint: {
            distance: 5
        }
    }));

    useEffect(() => {
        if (isDark) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [isDark]);

    const reset = () => {
        localStorage.removeItem(`game_${code}`);
        window.location.reload();
    };

    const onDragEnd = (event) => {
        const { active, delta, over } = event;
        const field = over.rect;
        const activeSquare = active.rect.current.translated;
        const updatedUnits = units.map(unit => {
            if (unit.id === active.id) {
                return { ...unit, x: unit.x + delta.x, y: unit.y + delta.y };
            }

            return unit;
        });
        const moved = updatedUnits.find(unit => unit.id === active.id);

        if (activeSquare.top < field.top ||
            activeSquare.left < field.left ||
            activeSquare.right > field.right ||
            activeSquare.bottom > field.bottom) {
            return;
        }

        updatedUnits.forEach(target => {
            const r1 = { l: moved.x, r: moved.x + SIZE, t: moved.y, b: moved.y + SIZE };
            const r2 = { l: target.x, r: target.x + SIZE, t: target.y, b: target.y + SIZE };
            const left = Math.max(r1.l, r2.l);
            const right = Math.min(r1.r, r2.r);
            const top = Math.max(r1.t, r2.t);
            const bottom = Math.min(r1.b, r2.b);
            const width = right - left;
            const height = bottom - top;

            if (width >= 0 && height >= 0) {
                const area = width * height;
                const maxArea = SIZE * SIZE;

                if (area === maxArea) {
                    return;
                }
            }
        });

        setUnits(updatedUnits);
        localStorage.setItem(`game_${code}`, JSON.stringify(updatedUnits));
    };

    return (
        <DndContext sensors={sensors} onDragEnd={onDragEnd} collisionDetection={rectIntersection}>
            <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300 relative flex flex-col items-center p-6">

                <div className="w-full flex justify-between items-center z-50 mb-4 max-w-5xl">
                    <Link to="/home" className="text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-blue-500 transition-colors">
                        Leave Room
                    </Link>
                    <div className="bg-gray-100 dark:bg-gray-900 px-4 py-1 rounded-full border border-gray-200 dark:border-gray-800">
                        <span className="text-[10px] font-black text-green-500 uppercase">Room: {code}</span>
                    </div>
                    <button onClick={() => setIsDark(!isDark)} className="p-2 rounded-xl bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
                        {isDark ? "🌙" : "☀️"}
                    </button>
                </div>

                <div className="w-full max-w-5xl flex flex-col gap-6">
                    <GameField>
                        <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none select-none">
                            <h1 className="text-8xl font-black uppercase tracking-tighter">FIELD</h1>
                        </div>
                    </GameField>

                    <div className="flex justify-center w-full">
                        <div className="w-3/4 h-50 bg-gray-50/50 dark:bg-gray-950 rounded-[2rem] border-2 border-dashed border-gray-200 dark:border-gray-800 flex items-center justify-center">
                            <span className="text-[10px] font-black text-gray-300 dark:text-gray-700 uppercase tracking-[0.3em]">
                                Deployment Zone
                            </span>
                        </div>
                        <button className=" bg-green-700 hover:bg-green-900 text-white font-bold py-2 px-4 rounded-[2rem] ml-10" onClick={reset} >Reset position</button>
                    </div>
                </div>

                {units.map((unit) => (
                    <SquareDrag
                        key={unit.id}
                        id={unit.id}
                        title={unit.title}
                        color={unit.color}
                        position={{ x: unit.x, y: unit.y }}
                    />
                ))}

                <div className="mt-auto pt-8">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] opacity-60">
                        User: <span className="text-blue-500">{user?.username || "Player"}</span>
                    </p>
                </div>
            </div>
        </DndContext>
    );
}
