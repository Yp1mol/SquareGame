import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

export function SquareDrag({ id, title, color, position }) {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({ id });

    return (
        <div
            ref={setNodeRef}
            style={{
                left: `${position.x}px`,
                top: `${position.y}px`,
                transform: CSS.Translate.toString(transform),
            }}
            {...listeners}
            {...attributes}
            className={`absolute w-40 h-40 ${color} rounded-3xl shadow-2xl flex items-center justify-center cursor-grab active:cursor-grabbing z-50 border-4 border-white/20 select-none`}
        >
            <span className="text-[10px] font-black text-white uppercase text-center leading-none tracking-tighter">
                {title}
            </span>
        </div>
    );
}