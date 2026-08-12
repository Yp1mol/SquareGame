import React from "react";
import PropTypes from "prop-types";
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

export default function SquareDrag({
  id,
  title,
  color,
  position,
  fieldDimensions,
  disabled = false,
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id,
    disabled,
  });

  const squareSize = fieldDimensions.width * 0.3 || 80;
  const inDeployZone = position.x === -1;

  const style = inDeployZone
    ? {
        width: squareSize,
        height: squareSize,
        transform: CSS.Translate.toString(transform),
        touchAction: 'none',
      }
    : {
        position: 'absolute',
        left: `${(position.x / 1000) * fieldDimensions.width}px`,
        top: `${(position.y / 1000) * fieldDimensions.height}px`,
        width: squareSize,
        height: squareSize,
        transform: CSS.Translate.toString(transform),
        transition: isDragging ? 'none' : 'all 0.4s cubic-bezier(0.18, 0.89, 0.32, 1.28)',
        touchAction: 'none',
      };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...(disabled ? {} : { ...listeners, ...attributes })}
      className={`rounded-xl md:rounded-3xl shadow-2xl flex items-center justify-center ${color} ${
        disabled ? 'cursor-default' : 'cursor-grab active:cursor-grabbing'
      } z-50 ring-2 md:ring-4 ring-white/20 select-none`}
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