import React from 'react';
import PropTypes from 'prop-types';

export default function SkeletonRoom({ type }) {
    return (
        <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, index) => (
                <div
                    key={index}
                    role="status"
                    className="p-4 rounded-lg shadow flex justify-between items-center animate-pulse bg-white dark:bg-gray-800"
                >
                    <div className="space-y-2">
                        <div className="h-6 w-24 rounded bg-gray-200 dark:bg-gray-700"></div>
                        <div className="h-4 w-32 rounded bg-gray-200 dark:bg-gray-700"></div>
                        <div className="h-4 w-20 rounded bg-gray-200 dark:bg-gray-700"></div>

                        {type === 'my' && (
                            <div className="h-3 w-28 rounded bg-gray-200 dark:bg-gray-700"></div>
                        )}
                    </div>

                    <div className="flex gap-2">
                        <div className="h-9 w-20 rounded bg-gray-200 dark:bg-gray-700"></div>

                        {type === 'my' && (
                            <div className="h-9 w-20 rounded bg-gray-200 dark:bg-gray-700"></div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}

SkeletonRoom.propTypes = {
    type: PropTypes.string.isRequired,
};
