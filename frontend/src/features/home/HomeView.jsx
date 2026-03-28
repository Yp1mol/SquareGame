import React from 'react';
import { Link } from 'react-router-dom';
import { useHome } from "./hooks/useHome";

export function HomePage() {
    const {
        user,
        isMenuOpen,
        setIsMenuOpen,
        handleLogout,
        handleAddCredit,
    } = useHome();

    return (
        <div className="min-h-screen w-full flex flex-col bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300">
            <nav className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-gray-800">
                <div className="text-lg font-medium flex items-center gap-4">
                    <span>
                        Good day, <span className="text-green-500 font-bold">{user?.username}</span>
                    </span>
                    
                </div>

                <div className="relative">
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-xl"
                    >
                        <span className="hidden sm:inline">{user?.username}</span>
                    </button>
                    

                    {isMenuOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl py-2 z-50">
                            <Link
                                to="/profile"
                                className="block text-center px-4 py-2 text-blue-500 hover:bg-gray-50 dark:hover:bg-gray-700"
                            >
                                Edit Profile
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="w-full text-center px-4 py-2 text-red-500 hover:bg-gray-50 dark:hover:bg-gray-700"
                            >
                                Logout
                            </button>
                        </div>
                        
                    )}
                    <span className="font-bold">Balance: {user?.credits || 0} credits </span>
                    <button
                        onClick={handleAddCredit}
                        className="bg-green-500 hover:bg-green-600 text-white text-xs px-2 py-1 rounded-full transition mt-5"
                    >
                        +1
                    </button>
                </div>
            </nav>

            <main className="flex-grow flex flex-col items-center justify-center p-4">
                <div className="w-full max-w-sm flex flex-col space-y-4">
                    <Link
                        to="/rooms"
                        className="bg-green-600 hover:bg-green-700 text-white font-black py-6 rounded-2xl text-center shadow-xl transform hover:-translate-y-1 transition text-xl"
                    >
                        FIND ROOM
                    </Link>

                    <div className="flex items-center py-2">
                        <div className="flex-grow h-px bg-gray-200 dark:bg-gray-700"></div>
                    </div>

                    <Link
                        to="/createroom"
                        className="bg-blue-600 hover:bg-blue-700 text-white font-black py-6 rounded-2xl text-center shadow-xl transform hover:-translate-y-1 transition text-xl"
                    >
                        CREATE ROOM
                    </Link>

                    <div className="flex items-center py-2">
                        <div className="flex-grow h-px bg-gray-200 dark:bg-gray-700"></div>
                    </div>

                    <Link
                        to="/myrooms"
                        className="bg-yellow-600 hover:bg-yellow-700 text-white font-black py-6 rounded-2xl text-center shadow-xl transform hover:-translate-y-1 transition text-xl"
                    >
                        MY ROOMS
                    </Link>
                </div>
            </main>
        </div>
    );
}

export default HomePage;