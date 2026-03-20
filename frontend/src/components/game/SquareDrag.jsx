import React from "react";
import PropTypes from "prop-types";
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

export default function SquareDrag({ id, title, color, position }) {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id,
        data: {
            id,
            title,
            position
        }
    });

    return (
        <div
            ref={setNodeRef}
            style={{
                left: `${position.x}px`,
                top: `${position.y}px`,
                transform: CSS.Translate.toString(transform),
                transition: 'all 0.3s cubic-bezier(0.3, 1.5, 0.6, 1)', 
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
SquareDrag.propTypes = {
    id: PropTypes.string.isRequired,
    title: PropTypes.string,
    color: PropTypes.string,
    position: PropTypes.shape({
        x: PropTypes.number,
        y: PropTypes.number,
    }).isRequired,
};