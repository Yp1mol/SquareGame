import React from "react";
import PropTypes from "prop-types";
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

export default function SquareDrag({ id, title, color, position, fieldDimensions, disabled = false }) {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id,
        data: { id, title, position },
        disabled,
    });

    const { width: fieldWidth, height: fieldHeight } = fieldDimensions;

    const pixelX = (position.x / 1000) * fieldWidth;
    const pixelY = (position.y / 1000) * fieldHeight;

    const squareSize =  fieldWidth * 0.3;

    const style = {
        position: 'absolute',
        left: `${pixelX}px`,
        top: `${pixelY}px`,
        width: `${squareSize}px`,
        height: `${squareSize}px`,
        transform: CSS.Translate.toString(transform),
        transition: isDragging ? 'none' : 'all 0.4s cubic-bezier(0.18, 0.89, 0.32, 1.28)',
        touchAction: 'none',
        userSelect: 'none',
    };

    const cursorClass = disabled ? 'cursor-default' : 'cursor-grab active:cursor-grabbing';

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...(disabled ? {} : { ...listeners, ...attributes })}
            className={`rounded-xl md:rounded-3xl shadow-2xl flex items-center justify-center ${color} ${cursorClass} z-50 border-2 md:border-4 border-white/20 select-none`}
        >
            <span className="text-[10px] md:text-[14px] font-black text-white uppercase text-center p-1 break-all">
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
    fieldDimensions: PropTypes.shape({
        width: PropTypes.number,
        height: PropTypes.number,
    }).isRequired,
    disabled: PropTypes.bool,
};