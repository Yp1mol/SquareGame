import React from "react";
import { Link, Navigate } from "react-router-dom";
import { useProfile } from "./hooks/useProfile";

export function ProfileView() {
    const {
        token,
        loading,
        username,
        setUsername,
        isProcessing,
        submit,
    } = useProfile();

    if (loading) return <div className="dark:text-white">Loading...</div>;

    if (!token) return <Navigate to="/login" replace />;

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-white dark:bg-gray-900 transition-colors p-4">
            <div className="w-full max-w-md bg-gray-50 dark:bg-gray-800 p-10 rounded-[2rem] shadow-2xl border border-gray-100 dark:border-gray-700 relative">

                <Link
                    to="/home"
                    className="absolute top-8 left-8 text-[10px] font-black text-blue-500 uppercase tracking-widest hover:opacity-70"
                >
                    Back
                </Link>

                <h1 className="text-3xl font-black mb-10 text-center dark:text-white tracking-tighter">
                    PROFILE
                </h1>

                <form onSubmit={submit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">
                            Username
                        </label>

                        <input
                            className="w-full border-2 border-gray-200 dark:border-gray-700 p-4 rounded-2xl bg-white dark:bg-gray-900 dark:text-white outline-none focus:border-blue-500 transition-all font-bold"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>

                    <button
                        disabled={isProcessing}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-black shadow-lg shadow-blue-500/20 transform active:scale-95 transition-all"
                    >
                        {isProcessing ? "SAVING..." : "SAVE CHANGES"}
                    </button>
                </form>
            </div>
        </div>
    );
}