import { useDroppable } from '@dnd-kit/core';

export function GameField({ children }) {
    const { setNodeRef } = useDroppable({
        id: 'game-field-arena',
    });

    return (
        <div 
            ref={setNodeRef} 
            className="relative w-full h-[60vh] bg-yellow-400 dark:bg-yellow-500 rounded-4xl border-[12px] border-white dark:border-gray-900 shadow-2xl overflow-hidden"
        >
            {children}
        </div>
    );
}