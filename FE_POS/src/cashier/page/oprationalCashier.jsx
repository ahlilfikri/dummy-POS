import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaSearch } from "react-icons/fa";
import ConfirmCustom from "../../admin/component/ConfirmCustom";
import PlusIcon from "/icon/plus-icon.webp";

const OprationalStaff = ({onClose}) => {
    const [data, setData] = useState([]);
    const [form, setForm] = useState({
        namaOprational: "",
        biayaOprational: "",
        deskripsiOprational: "",
    });
    const [editDataId, setEditDataId] = useState(null);
    const [approveStatus, setApproveStatus] = useState("");
    const [buktiOprational, setBuktiOprational] = useState(null);
    const [showModalBukti, setShowModalBukti] = useState(false);
    const [selectedOprationalId, setSelectedOprationalId] = useState(null);
    const [showApproveModal, setShowApproveModal] = useState(false);
    const [error, setError] = useState("");
    const [statusData, setStatusData] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [selectedData, setSelectedData] = useState(null);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [isFocused, setIsFocused] = useState(false);

    const API_URL = import.meta.env.VITE_DB_API_URL;

    const handleSearchChange = (e) => setSearchTerm(e.target.value);
    const handleFocus = () => setIsFocused(true);
    const handleBlur = () => setIsFocused(false);

    const fetchOprational = async () => {
        setStatusData("loading");
        try {
            const response = await axios.get(
                `${API_URL}/api/pos/oprational/?page=${page}&search=${searchTerm}`,
                { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
            );
            setData(response.data.data);
            console.log("Response API cashier:", response.data);
            setTotalPages(response.data.metadata.totalPages);
            setStatusData("success");
        } catch (err) {
            setError(err.response?.data?.message || "Gagal mengambil data operasional.");
            setStatusData("error");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatusData("loading");
        try {
            if (editDataId) {
                await axios.put(`${API_URL}/api/pos/oprational/${editDataId}`, form, {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                });
            } else {
                await axios.post(`${API_URL}/api/pos/oprational`, form, {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                });
            }
            fetchOprational();
            setForm({ namaOprational: "", biayaOprational: "", deskripsiOprational: "" });
            setEditDataId(null);
            setShowModal(false);
        } catch (err) {
            setError(err.response?.data?.message || "Gagal menyimpan data operasional.");
        }
    };

    const handleConfirmDelete = async (id, nama) => {
        setSelectedData({ id, nama });
        setIsConfirmOpen(true);
    };

    const handleDelete = async () => {
        try {
            await axios.delete(`${API_URL}/api/pos/oprational/${selectedData?.id}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            setData((prevData) => prevData.filter((oprational) => oprational._id !== selectedData?.id));
            setIsConfirmOpen(false);
        } catch (err) {
            setError(err.response?.data?.message || "Gagal menghapus data operasional.");
        }
    };

    const handleEdit = (oprational) => {
        setEditDataId(oprational._id);
        setForm({
            namaOprational: oprational.namaOprational,
            biayaOprational: oprational.biayaOprational,
            deskripsiOprational: oprational.deskripsiOprational,
        });
        setShowModal(true);
    };

    const handleUploadBukti = (id) => {
        console.log("Upload Bukti Oprasional untuk ID:", id);
        setSelectedOprationalId(id); // Simpan ID ke state
        setShowModalBukti(true);
    };

    const handleOprationalUpload = async (e) => {
        e.preventDefault();
        setStatusData("loading");

        if (!buktiOprational) {
            setError("Silakan pilih file bukti operasional.");
            return;
        }

        try {
            const formData = new FormData();
            formData.append("image", buktiOprational); // Sesuaikan dengan middleware Multer

            await axios.post(
                `${API_URL}/api/pos/oprational/upload/evidence/${selectedOprationalId}`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                        "Content-Type": "multipart/form-data", // Pastikan pakai multipart/form-data
                    },
                }
            );

            fetchOprational();
            setBuktiOprational(null);
            setSelectedOprationalId(null);
            setShowModalBukti(false);
            setStatusData("success");

        } catch (err) {
            setError(err.response?.data?.message || "Gagal mengupload bukti operasional.");
            setStatusData("error");
        }
    };

    const handlePageChange = (newPage) => {
        if (newPage > 0 && newPage <= totalPages) {
            setPage(newPage);
        }
    };

    useEffect(() => {
        fetchOprational();
    }, [page]);

    return (
        <div className="container mx-auto p-4 text-white min-h-screen mt-20">
            {/* Search Bar */}
            <div
                className={`flex items-center fixed sm:top-10 left-1/2 -translate-x-1/2 bg-[#0F0F0F] z-20 min-w-60 w-full sm:w-96 px-4 py-2 rounded-full ${isFocused ? 'outline outline-2 outline-white' : ''}`}
                onFocus={handleFocus}
                onBlur={handleBlur}
            >
                <input
                    className="text-white bg-[#0F0F0F] w-full sm:w-96 focus:outline-none"
                    type="text"
                    placeholder="Cari Oprasional"
                    value={searchTerm}
                    onChange={handleSearchChange}
                />
                <FaSearch />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between pt-20 sm:pt-0">
                <h1 className="text-xl md:text-3xl font-medium">Oprasional</h1>
                <button
                    onClick={() => {
                        setForm({ namaOprational: "", biayaOprational: "", deskripsiOprational: "" });
                        setEditDataId(null);
                        setShowModal(true);
                    }}
                    className="text-white p-2 rounded-2xl hover:underline flex items-center"
                >
                    <p className="mr-2">Tambah Oprasional</p>
                    <img src={PlusIcon} alt="plus" />
                </button>
            </div>

            {/* Tabel */}
            {statusData === "success" && data.length > 0 && (
                <div className="w-full overflow-x-auto">
                    <table className="table-auto w-full text-white shadow-lg rounded-lg overflow-x-auto border-separate border-spacing-y-2">
                        <thead>
                            <tr>
                                <th className="py-2 pr-2 text-left">No</th>
                                <th className="py-2 pr-2 text-left">Nama</th>
                                <th className="py-2 pr-2 text-left">Biaya</th>
                                <th className="py-2 pr-2 text-left">Deskripsi</th>
                                <th className="py-2 pr-2 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data?.map((oprational, index) => (
                                <tr key={oprational?._id} className="hover:bg-gray-700">
                                    <td className="border px-4 py-2 border-[#1A1A1A] rounded-tl-xl rounded-bl-xl">
                                        {((page - 1) * 10) + (index + 1)}
                                    </td>
                                    <td className="border px-4 py-2 border-[#1A1A1A]">
                                        {oprational.namaOprational}
                                    </td>
                                    <td className="border px-4 py-2 border-[#1A1A1A]">
                                        {oprational.biayaOprational}
                                    </td>
                                    <td className="border px-4 py-2 border-[#1A1A1A]">
                                        {oprational.deskripsiOprational}
                                    </td>
                                    <td className="border px-4 py-2 border-[#1A1A1A] flex items-center space-x-4">
                                        <button
                                            onClick={() => handleEdit(oprational)}
                                            className="text-blue-400 hover:underline"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleConfirmDelete(oprational._id, oprational.namaOprational)}
                                            className="text-red-400 hover:underline"
                                        >
                                            Hapus
                                        </button>
                                        <button
                                            onClick={() => handleUploadBukti(oprational._id)}
                                            className="text-green-400 hover:underline"
                                        >
                                            Upload Bukti
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="flex justify-between mt-4">
                        <button
                            onClick={() => handlePageChange(page - 1)}
                            className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700"
                        >
                            Prev
                        </button>
                        <p className="text-white">
                            Page {page} of {totalPages}
                        </p>
                        <button
                            onClick={() => handlePageChange(page + 1)}
                            className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700"
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}

            {/* Confirm Delete Modal */}
            {isConfirmOpen && (
                <ConfirmCustom
                    isOpen={isConfirmOpen}
                    setIsOpen={setIsConfirmOpen}
                    onConfirm={handleDelete}
                    title="Hapus Data"
                    description={`Apakah Anda yakin ingin menghapus operasional ${selectedData?.nama}?`}
                />
            )}

            {/* Add/Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 z-30 flex justify-center items-center">
                    <div className="bg-[#0F0F0F] p-6 rounded-xl w-full sm:w-96">
                        <h2 className="text-xl mb-4">{editDataId ? "Edit" : "Tambah"} Oprasional</h2>
                        <form onSubmit={handleSubmit}>
                            <input
                                type="text"
                                className="w-full p-2 mb-2 text-white bg-[#1A1A1A] rounded-lg"
                                placeholder="Nama Oprasional"
                                value={form.namaOprational}
                                onChange={(e) => setForm({ ...form, namaOprational: e.target.value })}
                                required
                            />
                            <input
                                type="text"
                                className="w-full p-2 mb-2 text-white bg-[#1A1A1A] rounded-lg"
                                placeholder="Biaya Oprasional"
                                value={form.biayaOprational}
                                onChange={(e) => setForm({ ...form, biayaOprational: e.target.value })}
                                required
                            />
                            <textarea
                                className="w-full p-2 mb-2 text-white bg-[#1A1A1A] rounded-lg"
                                placeholder="Deskripsi Oprasional"
                                value={form.deskripsiOprational}
                                onChange={(e) => setForm({ ...form, deskripsiOprational: e.target.value })}
                                required
                            />
                            <div className="flex justify-between items-center">
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-400"
                                >
                                    {editDataId ? "Simpan Perubahan" : "Tambah"}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-400"
                                >
                                    Batal
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Upload Bukti Modal */}
            {showModalBukti && (
                <div className="fixed inset-0 z-30 flex justify-center items-center">
                    <div className="bg-[#0F0F0F] p-6 rounded-xl w-full sm:w-96">
                        <h2 className="text-xl mb-4">Upload Bukti Oprasional</h2>
                        <form onSubmit={handleOprationalUpload}>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => setBuktiOprational(e.target.files[0])}
                                className="w-full p-2 mb-2 text-white bg-[#1A1A1A] rounded-lg"
                            />
                            <div className="flex justify-between items-center">
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-400"
                                >
                                    Upload
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowModalBukti(false)}
                                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-400"
                                >
                                    Batal
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OprationalStaff;
