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
           className={`relative w-full h-[60vh] ${color} rounded-4xl border-[12px] border-white dark:border-gray-900 shadow-2xl`}
        >
            <span className="absolute top-4 left-4 text-[10px] font-black text-white uppercase opacity-50">
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