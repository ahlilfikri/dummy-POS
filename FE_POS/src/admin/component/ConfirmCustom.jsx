import { motion } from "framer-motion";
import { IoWarning } from "react-icons/io5";
import { useEffect, useState } from "react";

const ConfirmCustom = ({ isOpen, onClose, onConfirm, title, name, message }) => {
    const [show, setShow] = useState(isOpen);

    useEffect(() => {
        setShow(isOpen);
    }, [isOpen]);

    return (
        <>
            {show && (
                <motion.div
                    initial={{ y: "-100%", opacity: 0 }}
                    animate={{ y: "0%", opacity: 1 }}
                    exit={{ y: "-100%", opacity: 0 }}
                    transition={{ type: "spring", stiffness: 100, damping: 15 }}
                    className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
                >
                    <motion.div
                        initial={{ y: -50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -50, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="bg-[#0F0F0F] text-white p-6 rounded-2xl shadow-xl w-[90%] max-w-md text-center border border-gray-700"
                    >
                        {/* Ikon Peringatan */}
                        <div className="flex justify-center">
                            <IoWarning size={50} className="text-red-500 mb-3" />
                        </div>

                        {/* Judul */}
                        <h2 className="text-xl font-bold">{title || "Konfirmasi Aksi"}</h2>

                        {/* Pesan */}
                        <p className="text-gray-300 mt-2">{message || "Apakah Anda yakin ingin melanjutkan?"}{name ? "'" : ""} <span>{name ?? name} {name ? "'" : ""}{" ?"}</span></p>

                        {/* Tombol Aksi */}
                        <div className="flex justify-center gap-4 mt-6">
                            <button
                                onClick={() => {
                                    onClose();
                                    setShow(false);
                                }}
                                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
                            >
                                Batal
                            </button>
                            <button
                                onClick={() => {
                                    onConfirm();
                                    setShow(false);
                                }}
                                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                            >
                                Ya, Lanjutkan
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </>
    );
};

export default ConfirmCustom;
