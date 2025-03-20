// import { useState } from "react";
// import { useAuth } from "../context/AuthContext";
// import { loginUser } from "../services/authService";
// import { useNavigate } from "react-router-dom";

// const LoginPage = () => {
//     const [email, setEmail] = useState("");
//     const [password, setPassword] = useState("");
//     const { login } = useAuth();
//     const navigate = useNavigate();

//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();
//         try {
//             const data = await loginUser(email, password);
//             console.log("Login Response:", data); // Debugging

//             const token = data.token;
//             const role = data.user?.role;
//             const username = data.user?.name;

//             if (!token || !role) {
//                 throw new Error("Invalid response from server");
//             }

//             login(token, role, username);

//             if (["ADMIN", "SUPER_ADMIN", "USER"].includes(role?.toUpperCase())) {
//                 console.log("navigate to dashboard");  // Debugging
//                 navigate("/admin/dashboard");
//             } else {
//                 console.log("navigate for forbidden");  // Debugging
//                 navigate("/");
//             }

//         } catch (err) {
//             console.error("Login Error:", err); // Better debugging
//             alert("Invalid credentials. Please try again.");
//         }
//     };

//     return (
//         <div className="flex items-center justify-center min-h-screen bg-white">
//             <div className="bg-white p-8 rounded-lg shadow-lg border-gray-200 w-full max-w-md">

//                 <div className="flex justify-center mb-6">
//                     <span className="text-black text-4xl font-light" style={{ fontFamily: "Anton SC" }}>Batman</span>
//                 </div>

//                 <h2 className="text-black text-center text-lg font-semibold mb-6 mt-20">Login to your account</h2>

//                 <form onSubmit={handleSubmit} className="space-y-4">
//                     <div>
//                         <label className="text-gray-600 block mb-1">Email address</label>
//                         <input
//                             type="email"
//                             placeholder="Enter your email"
//                             value={email}
//                             onChange={(e) => setEmail(e.target.value)}
//                             className="w-full p-2 rounded-lg  text-black border border-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-600"
//                         />
//                     </div>
//                     <div>
//                         <label className="text-gray-600 block mb-1">Password</label>
//                         <input
//                             type="password"
//                             placeholder="Enter your password"
//                             value={password}
//                             onChange={(e) => setPassword(e.target.value)}
//                             className="w-full p-2 rounded-lg text-black border border-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-600"
//                         />
//                         <div className="text-right mt-2">
//                             <a href="#" className="text-black text-sm hover:underline">Forgot password?</a>
//                         </div>
//                     </div>
//                     <button
//                         type="submit"
//                         className="w-full bg-black font-semibold text-white p-2 rounded-lg transition-all duration-200 hover:bg-gray-600"
//                     >
//                         Login
//                     </button>
//                 </form>
//             </div>
//         </div>
//     );
// };

// export default LoginPage;


import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { loginUser } from "../services/authService";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
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
            const data = await loginUser(email, password);
            const { token, user } = data;

            if (!token || !user?.role) {
                throw new Error("Invalid response from server");
            }

            login(token, user.role, user.name);

            const rolePath = ["ADMIN", "SUPER_ADMIN", "USER"].includes(user.role.toUpperCase())
                ? "/admin/dashboard"
                : "/";

            navigate(rolePath);
        } catch (err: any) {
            console.error("Login Error:", err.message);
            setError(err.message || "Invalid credentials. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-white">
            <div className="bg-white p-8 rounded-lg shadow-lg border-gray-200 w-full max-w-md">
                <div className="flex justify-center mb-6">
                    <span className="text-black text-4xl font-light" style={{ fontFamily: "Anton SC" }}>
                        Batman
                    </span>
                </div>

                <h2 className="text-black text-center text-lg font-semibold mb-6 mt-20">
                    Login to your account
                </h2>

                {error && <div className="text-red-500 text-center mb-4">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-2 rounded-lg border border-gray-600"
                    />
                    <input
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-2 rounded-lg border border-gray-600"
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-black font-semibold text-white p-2 rounded-lg transition-all duration-200 hover:bg-gray-600"
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
