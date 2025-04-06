import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { loginUser } from "../services/authService";

const CustomerLogin = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!email || !password) {
            setError("Please enter both email and password.");
            return;
        }

        setLoading(true);
        try {
            const data = await loginUser(email, password); // Call backend API
            const { token, user } = data;

            if (!token || !user?.role) {
                throw new Error("Invalid response from server");
            }

            login(token, user.role, user.name);

            // Redirect customer to home or customer dashboard
            navigate("/");

        } catch (err: any) {
            console.error("Login Error:", err.message);
            setError(err.message || "Invalid credentials. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-black">
            <div className="bg-[#1a1a1a] p-8 shadow-lg rounded-2xl w-md">

                <h1 className="text-white text-center text-4xl font-bold tracking-widest mb-6 p-5" style={{ fontFamily: "Anton SC" }}>
                    BATMAN
                </h1>

                <h2 className="text-white text-2xl font-semibold mb-2">Log in</h2>

                {error && <p className="text-red-500 text-center">{error}</p>}

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

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-2 bg-white text-black font-semibold rounded hover:bg-gray-200 transition"
                    >
                        {loading ? "Logging in..." : "Continue"}
                    </button>
                </form>

                <div className="mt-4 text-center">
                    <Link to="/forgot-password" className="text-gray-400 hover:text-white transition">
                        Forgot password?
                    </Link>
                </div>

                <div className="mt-2 text-center">
                    <span className="text-gray-400">Don't have an account? </span>
                    <Link to="/signup" className="text-blue-500 hover:text-blue-400 font-semibold transition">
                        Sign Up
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default CustomerLogin;
