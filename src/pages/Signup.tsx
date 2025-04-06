import React, { useState } from "react";
import { Link } from "react-router-dom";

const Signup = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("New Account:", email, password);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-black">
            <div className="bg-[#1a1a1a] p-8 shadow-lg rounded-2xl w-md">
                <h1
                    className="text-white text-center text-4xl font-bold tracking-widest mb-6 p-5"
                    style={{ fontFamily: "Anton SC" }}
                >
                    BATMAN
                </h1>

                <h2 className="text-white text-2xl font-semibold mb-2">Sign Up</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-2 border rounded-lg bg-transparent text-white border-gray-500 focus:outline-none focus:border-white placeholder-gray-500"
                        required
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-2 border rounded-lg bg-transparent text-white border-gray-500 focus:outline-none focus:border-white placeholder-gray-500"
                        required
                    />

                    <input
                        type="password"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full p-2 border rounded-lg bg-transparent text-white border-gray-500 focus:outline-none focus:border-white placeholder-gray-500"
                        required
                    />

                    <button
                        type="submit"
                        className="w-full py-2 bg-white text-black font-semibold rounded hover:bg-gray-200 transition"
                    >
                        Create Account
                    </button>
                </form>

                <div className="mt-4 text-center">
                    <span className="text-gray-400">Already have an account? </span>
                    <Link
                        to="/customer/login"
                        className="text-blue-500 hover:text-blue-400 font-semibold transition"
                    >
                        Log in
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Signup;
