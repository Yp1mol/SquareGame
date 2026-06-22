import React from 'react';
import { Link } from 'react-router-dom';
import { useNotifications } from './hooks/useNotifications';

export default function NotificationsView() {
    const { handleMarkRead, handleDelete, handleDeleteAll, notifications } = useNotifications();

    return (
        <div className="min-h-screen bg-white dark:bg-gray-900 p-6">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <Link
                        to="/home"
                        className="inline-flex items-center gap-2 text-[10px] font-black text-blue-500 uppercase tracking-widest hover:opacity-70 mb-8"
                    >
                        ← BACK
                    </Link>
                    <h1 className="text-2xl font-bold dark:text-white">Notifications</h1>
                    <button onClick={handleDeleteAll} className="text-red-500 hover:text-red-700 text-sm">
                        Delete All
                    </button>
                </div>

                {notifications.length === 0 ? (
                    <div className="text-center text-gray-500 dark:text-gray-400">No notifications</div>
                ) : (
                    <ul className="space-y-3">
                        {notifications.map((n) => (
                            <li key={n.id} className={`p-4 rounded-lg shadow flex justify-between items-center ${n.isRead ? 'bg-gray-50 dark:bg-gray-800' : 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500'}`}>
                                <div>
                                    <div className="text-sm font-medium dark:text-white">{n.message}</div>
                                    <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                                        {new Date(n.createdAt).toLocaleString()}
                                    </div>
                                </div>
                                <div className="flex space-x-2">
                                    {!n.isRead && (
                                        <button onClick={() => handleMarkRead(n.id)} className="text-blue-500 hover:text-blue-700 text-sm">
                                            Mark as Read
                                        </button>
                                    )}
                                    <button onClick={() => handleDelete(n.id)} className="text-red-400 hover:text-red-600 text-sm">
                                        ✕
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}