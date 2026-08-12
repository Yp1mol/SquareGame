import React from "react";
import PropTypes from "prop-types";
import { useDroppable } from '@dnd-kit/core';

export function GameField({ id, title, color, children }) {
    const { setNodeRef } = useDroppable({
        id: id,
    });

    return (
        <div
            ref={setNodeRef}
            id={id}
            className={`relative w-full aspect-square ${color} rounded-2xl md:rounded-4xl ring-[6px] md:ring-[12px] ring-white dark:ring-gray-900 shadow-2xl`}
        >
            <span className="absolute top-2 left-2 md:top-4 md:left-4 text-[8px] md:text-[10px] font-black text-white uppercase opacity-50">
                {title}
            </span>
            {children}
        </div>
    );
}

GameField.propTypes = {
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired,
    children: PropTypes.node,
};