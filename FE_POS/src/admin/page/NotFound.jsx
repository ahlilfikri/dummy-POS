import { useState } from "react";
import { useNavigate } from "react-router-dom";
const OrderHistory = () => {
    const navigate = useNavigate();
    return (
        <div className="min-h-screen w-screen bg-[#080808]">
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center w-screen">
                <h1 className="text-5xl md:text-7xl font-bold text-white gradient-menu-sidebar">404</h1>
                <h1 className="text-base sm:text-xl md:text-3xl font-bold text-white">NOT FOUND</h1>
                <h1 className="text-base sm:text-xl md:text-3xl text-white">Tautan Tidak Ditemukan</h1>
                <button className="text-white px-4 py-2 rounded-2xl mt-5 bg-[linear-gradient(90deg,_rgba(255,_154,_0,_0.5)_0%,_rgba(255,_0,_0,_0.5)_100%)] hover:bg-[linear-gradient(90deg,_rgba(255,_154,_0,_1)_0%,_rgba(255,_0,_0,_1)_100%)]" onClick={() => navigate('/')}>
                    Halaman Utama
                </button>
            </div>
        </div>
    );
};

export default OrderHistory;
