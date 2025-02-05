import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";

const Login = () => {
    const [formData, setFormData] = useState({ username: "", password: "" });
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false); // State untuk menampilkan atau menyembunyikan password
    const navigate = useNavigate();
    const [statusData, setStatusData] = useState("");

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setStatusData("loading");
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_DB_API_URL}/api/pos/auth/login`,
                formData
            );
            // Simpan token di localStorage
            localStorage.setItem("token", response.data?.token);
            localStorage.setItem("tokenTime", response.data?.user?.tokenTime);
            localStorage.setItem("user", JSON.stringify(response.data?.user));
            setStatusData("success");
            // Redirect ke halaman dashboard
            navigate("/");
        } catch (err) {
            setStatusData("error");
            if (err.response) {
                setError(err.response.data?.message);
            } else {
                setError("Terjadi kesalahan pada server.");
            }
        }
    };

    const checkLogin = () => {
        const user = localStorage.getItem('token');
        if (user) {
            return navigate('/')
        }
    };

    useEffect(() => {
        checkLogin();
    }, []);

    return (
        <div className="min-h-screen bg-[#080808]">
            <div
                className="flex items-center justify-center min-h-screen bg-center bg-cover bg-no-repeat"
                style={{ backgroundImage: "url('/background.webp')" }}
            >
                <div className="mx-2 sm:mx-0 w-full max-w-sm px-2 py-6 sm:px-6 rounded-lg shadow-md bg-[#101010]">
                    <div className="flex items-center justify-center mb-4">
                        <i className="fas fa-eye text-white text-3xl mr-2"></i> {/* Eye icon */}
                        <h2 className="text-2xl font-bold text-center text-white">
                            Login
                        </h2>
                    </div>
                    {error && (
                        <div className="mt-4 text-sm text-red-600 bg-red-100 p-2 rounded-md">
                            {error}
                        </div>
                    )}
                    <form onSubmit={handleSubmit} className="mt-6">
                        <div className="mb-4">
                            <label
                                htmlFor="username"
                                className="block text-sm font-medium text-white"
                            >
                                Username
                            </label>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                placeholder="Masukkan Username"
                                value={formData?.username}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 mt-2 text-black bg-gray-50 border rounded-md "
                            />
                        </div>
                        <div className="mb-4 relative">
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium text-white"
                            >
                                Password
                            </label>
                            <div className="flex items-center">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    name="password"
                                    placeholder="Masukkan Password"
                                    value={formData?.password}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 mr-2 text-black bg-gray-50 border rounded-md "
                                />
                                <div className="text-white cursor-pointer" onClick={() => setShowPassword(!showPassword)}>
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </div>
                            </div>
                        </div>
                        
                        <button
                            type="submit"
                            className="w-full px-4 py-2 font-medium text-white rounded-xl bg-[linear-gradient(90deg,_rgba(255,_154,_0,_0.5)_0%,_rgba(255,_0,_0,_0.5)_100%)] hover:bg-[linear-gradient(90deg,_rgba(255,_154,_0,_1)_0%,_rgba(255,_0,_0,_1)_100%)]">
                            {statusData == "loading" ? "Memuat..." : "Login"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
