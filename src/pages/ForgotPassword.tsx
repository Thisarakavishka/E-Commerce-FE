import React, { useState } from "react";
import { Link } from "react-router-dom";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Password reset link sent to:", email);
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

                <h2 className="text-white text-2xl font-semibold mb-2">
                    Forgot Password
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-2 border rounded-lg bg-transparent text-white border-gray-500 focus:outline-none focus:border-white placeholder-gray-500"
                        required
                    />

                    <button
                        type="submit"
                        className="w-full py-2 bg-white text-black font-semibold rounded hover:bg-gray-200 transition"
                    >
                        Send Reset Link
                    </button>
                </form>

                <div className="mt-4 text-center">
                    <Link
                        to="/customer/login"
                        className="text-gray-400 hover:text-white transition"
                    >
                        Back to Login
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
