import React from "react";
import PropTypes from "prop-types";
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

export default function SquareDrag({ id, title, color, position, disabled = false }) {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id,
        data: { id, title, position },
        disabled,
    });

    const style = {
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: CSS.Translate.toString(transform),
        transition: isDragging ? 'none' : 'all 0.4s cubic-bezier(0.18, 0.89, 0.32, 1.28)',
    };

    const cursorClass = disabled ? 'cursor-default' : 'cursor-grab active:cursor-grabbing';

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...(disabled ? {} : { ...listeners, ...attributes })} 
            className={`absolute w-40 h-40 ${color} rounded-3xl shadow-2xl flex items-center justify-center ${cursorClass} z-50 border-4 border-white/20 select-none`}
        >
            <span className="text-[14px] font-black text-white uppercase text-center">
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
    disabled: PropTypes.bool,
};