import React from "react";
import { Link } from "react-router-dom";
import { useProfile } from "./hooks/useProfile";

export function ProfileView() {
    const {
        username,
        credits,
        setUsername,
        handleUpdateUsername,
        handleAddCredit,
        handleLogout,
    } = useProfile();

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-white dark:bg-gray-900 transition-colors p-4">
            <div className="w-full max-w-4xl bg-gray-50 dark:bg-gray-800 p-8 rounded-[2rem] shadow-2xl border border-gray-100 dark:border-gray-700">
                <Link
                    to="/home"
                    className="inline-flex items-center gap-2 text-[10px] font-black text-blue-500 uppercase tracking-widest hover:opacity-70 mb-8"
                >
                    ← BACK
                </Link>

                <div className="flex flex-col md:flex-row gap-8">
                    <div className="flex-1 flex flex-col items-center text-center">
                        <div className={`w-40 h-40 rounded-full bg-green-500 flex items-center justify-center shadow-2xl mb-6`}>
                            <span className="text-6xl font-black text-white uppercase">
                                {username?.charAt(0)}
                            </span>
                        </div>

                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="text-2xl font-bold dark:text-white bg-transparent border-b-2 border-gray-300 dark:border-gray-600 text-center outline-none focus:border-blue-500 mb-2"
                        />

                        <button
                            onClick={handleUpdateUsername}
                            className="text-sm text-blue-500 hover:text-blue-600 font-medium"
                        >
                            Save username →
                        </button>

                        <div className="mt-8 text-center">
                            <div className="text-4xl font-black text-yellow-500">{credits}</div>
                            <div className="text-xs text-gray-400 uppercase tracking-wider mt-1">Credits</div>
                        </div>
                    </div>

                    <div className="flex-1">
                        <h3 className="text-lg font-bold dark:text-white mb-4 text-center md:text-left">
                            Add Credits
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                           <button
                                onClick={() => handleAddCredit(1)}
                                className="bg-gradient-to-br from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-white p-6 rounded-2xl shadow-lg transition transform hover:scale-105"
                            >
                                <div className="text-2xl font-black">+1</div>
                                <div className="text-sm opacity-80 mt-1">0.99$</div>
                            </button>
                            <button
                                onClick={() => handleAddCredit(5)}
                                className="bg-gradient-to-br from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700 text-white p-6 rounded-2xl shadow-lg transition transform hover:scale-105"
                            >
                                <div className="text-2xl font-black">+5</div>
                                <div className="text-sm opacity-80 mt-1">4.99$</div>
                            </button>
                            <button
                                onClick={() => handleAddCredit(10)}
                                className="bg-gradient-to-br from-purple-400 to-purple-600 hover:from-purple-500 hover:to-purple-700 text-white p-6 rounded-2xl shadow-lg transition transform hover:scale-105"
                            >
                                <div className="text-2xl font-black">+10</div>
                                <div className="text-sm opacity-80 mt-1">9.99$</div>
                            </button>
                            <button
                                onClick={() => handleAddCredit(20)}
                                className="bg-gradient-to-br from-red-400 to-red-600 hover:from-red-500 hover:to-red-700 text-white p-6 rounded-2xl shadow-lg transition transform hover:scale-105"
                            >
                                <div className="text-2xl font-black">+20</div>
                                <div className="text-sm opacity-80 mt-1">19.99$</div>
                            </button>
                        </div>
                    </div>
                </div>

                <div className="flex justify-center mt-12">
                    <button
                        onClick={handleLogout}
                        className="bg-gray-200 dark:bg-red-700 hover:bg-red-300 dark:hover:bg-red-600 text-gray-700 dark:text-gray-200 px-8 py-3 rounded-full font-bold transition"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );
}