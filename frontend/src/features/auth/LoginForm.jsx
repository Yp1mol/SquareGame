import { Link } from "react-router-dom";
import { useLogin } from "./hooks/useLogin";
import React from 'react';

export default function LoginForm() {
    const {
        username,
        password,
        setUsername,
        setPassword,
        handleSubmit,
    } = useLogin();

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors duration-300 p-4">
            <div className="w-full max-w-md bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 relative">

                <h1 className="text-3xl font-black mb-6 text-gray-900 dark:text-white text-center">Login</h1>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        className="w-full border dark:border-gray-600 p-3 rounded-xl bg-transparent dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                    <input
                        className="w-full border dark:border-gray-600 p-3 rounded-xl bg-transparent dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transform active:scale-95 transition">
                        Sign In
                    </button>
                </form>

                <p className="mt-6 text-center text-gray-500 dark:text-gray-400">
                    New here? <Link to="/register" className="text-green-500 font-bold hover:underline">Register</Link>
                </p>
            </div>
        </div>
    );
}