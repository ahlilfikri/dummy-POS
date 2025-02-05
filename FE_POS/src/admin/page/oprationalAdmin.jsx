import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaSearch } from "react-icons/fa";
import ConfirmCustom from "../../admin/component/ConfirmCustom";
import PlusIcon from "/icon/plus-icon.webp";

const OprationalAdmin = () => {
    const [data, setData] = useState([]);
    const [form, setForm] = useState({
        namaOprational: "",
        biayaOprational: "",
        deskripsiOprational: "",
    });
    const [editDataId, setEditDataId] = useState(null);
    const [error, setError] = useState("");
    const [statusData, setStatusData] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [detailData, setDetailData] = useState(null);
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
            console.log("Response API Admin:", response.data);
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

    const handleDetail = (oprational) => {
        setDetailData(oprational);
    };

    const handleSubmitApproval = async (selectedId, approveStatus) => {
        try {
            await axios.put(
                `${API_URL}/api/pos/oprational/approval/${selectedId}`,
                { approvedStatus: approveStatus },
                {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                }
            );
        } catch (err) {
            setError(err.response?.data?.message || "Gagal menyetujui operasional.");
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
                                <tr key={oprational?._id} className="hover:bg-gray-700" onClick={() => handleDetail(oprational)}>
                                    <td className="border px-4 py-2 border-[#1A1A1A] rounded-tl-xl rounded-bl-xl">
                                        {((page - 1) * 10) + (index + 1)}
                                    </td>
                                    <td className="border px-4 py-2 border-[#1A1A1A]">{oprational?.namaOprational}</td>
                                    <td className="border px-4 py-2 border-[#1A1A1A]">
                                        {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(oprational?.biayaOprational)}
                                    </td>
                                    <td className="border px-4 py-2 border-[#1A1A1A]">{oprational?.deskripsiOprational}</td>
                                    <td className="border px-4 py-2 border-[#1A1A1A]">{oprational?.approvalStatus}</td>
                                    <td className="border px-4 py-2 border-[#1A1A1A] rounded-tr-xl rounded-br-xl">
                                        {oprational?.approvalStatus === "approved" ? (
                                            <>
                                                {/* Tombol Upload Bukti Oprasional */}
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation(); // Mencegah event ke handleDetail
                                                        console.log("upload");
                                                    }}
                                                    className="bg-[#1E1E1E] hover:bg-[linear-gradient(90deg,_rgba(255,_154,_0,_0.8)_0%,_rgba(255,_0,_0,_0.8)_100%)] text-white px-2 mr-2 rounded m-1"
                                                >
                                                    Upload Bukti
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                {/* Tombol Edit */}
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation(); // Mencegah event ke handleDetail
                                                        handleEdit(oprational);
                                                    }}
                                                    className="bg-[linear-gradient(90deg,_rgba(255,_154,_0,_0.8)_0%,_rgba(255,_0,_0,_0.8)_100%)] hover:bg-[linear-gradient(90deg,_rgba(255,_154,_0,_1)_0%,_rgba(255,_0,_0,_1)_100%)] text-white px-2 mr-2 rounded m-1"
                                                >
                                                    Edit
                                                </button>

                                                {/* Tombol Hapus */}
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation(); // Mencegah event ke handleDetail
                                                        handleConfirmDelete(oprational?._id, oprational?.namaOprational);
                                                    }}
                                                    className="bg-[#1E1E1E] hover:bg-red-500 text-white px-2 mr-2 rounded m-1"
                                                >
                                                    Hapus
                                                </button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            {/* Modal Tambah/Edit Oprasional */}
            {showModal && (
                <div className="fixed inset-0 bg-[#0F0F0F] bg-opacity-70 flex items-center justify-center z-50">
                    <div className="bg-[#0F0F0F] p-6 rounded shadow-lg w-full max-w-lg border border-[#1A1A1A]">
                        <h2 className="text-xl font-medium mb-4 text-white text-center">
                            {editDataId ? "Edit Oprasional" : "Tambah Oprasional"}
                        </h2>
                        <form onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 gap-4">
                                {/* Nama Oprasional */}
                                <p className="-mb-3">Nama Oprasional*</p>
                                <input
                                    type="text"
                                    name="namaOprational"
                                    placeholder="Nama"
                                    value={form.namaOprational}
                                    onChange={(e) => setForm({ ...form, namaOprational: e.target.value })}
                                    required
                                    className="p-2 border border-[#3D3D3D] rounded bg-[#0F0F0F] text-white"
                                />

                                {/* Biaya Oprasional */}
                                <p className="-mb-3">Biaya Oprasional*</p>
                                <input
                                    type="number"
                                    name="biayaOprational"
                                    placeholder="Biaya"
                                    value={form.biayaOprational}
                                    onChange={(e) => setForm({ ...form, biayaOprational: e.target.value })}
                                    required
                                    className="p-2 border border-[#3D3D3D] rounded bg-[#0F0F0F] text-white"
                                />

                                {/* Deskripsi Oprasional */}
                                <p className="-mb-3">Deskripsi Oprasional*</p>
                                <textarea
                                    name="deskripsiOprational"
                                    placeholder="Deskripsi"
                                    value={form.deskripsiOprational}
                                    onChange={(e) => setForm({ ...form, deskripsiOprational: e.target.value })}
                                    required
                                    className="p-2 border border-[#3D3D3D] rounded bg-[#0F0F0F] text-white"
                                />
                            </div>

                            {/* Tombol Simpan & Batalkan */}
                            <div className="flex justify-end mt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="bg-[#1E1E1E] hover:bg-red-500 text-white p-2 rounded mr-2"
                                >
                                    Batalkan
                                </button>
                                <button
                                    type="submit"
                                    className={`${statusData === "loading" ? "pointer-events-none" : ""} bg-[linear-gradient(90deg,_rgba(255,_154,_0,_0.8)_0%,_rgba(255,_0,_0,_0.8)_100%)] hover:bg-[linear-gradient(90deg,_rgba(255,_154,_0,_1)_0%,_rgba(255,_0,_0,_1)_100%)] text-white p-2 rounded`}
                                >
                                    {statusData === "loading" ? "Memuat..." : "Simpan"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal Detail Oprasional */}
            {detailData && (
                <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
                    <div className="bg-[#0F0F0F] p-6 rounded shadow-lg w-full max-w-lg border border-[#1A1A1A] text-white">
                        <h2 className="text-xl font-medium mb-4 text-center">Detail Oprasional</h2>

                        <div className="grid grid-cols-1 gap-2">
                            <p><strong>Nama:</strong> {detailData?.namaOprational}</p>
                            <p><strong>Biaya:</strong> {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(detailData?.biayaOprational)}</p>
                            <p><strong>Deskripsi:</strong> {detailData?.deskripsiOprational}</p>
                            <p><strong>Status Approval:</strong> {detailData?.approvalStatus}</p>
                            <p><strong>Nama User:</strong> {detailData?.userId?.nama}</p>
                            <p><strong>Role User:</strong> {detailData?.userId?.role}</p>
                            <p><strong>Dibuat pada:</strong> {new Date(detailData?.createdAt).toLocaleString("id-ID")}</p>
                            <p><strong>Diperbarui pada:</strong> {new Date(detailData?.updatedAt).toLocaleString("id-ID")}</p>

                            {/* Cek apakah ada imageEvidence */}
                            {detailData?.imageEvidence ? (
                                <div className="mt-4">
                                    <p><strong>Bukti Oprasional:</strong></p>
                                    <img src={detailData?.imageEvidence} alt="Bukti Oprasional" className="w-full rounded-lg" />
                                </div>
                            ) : (
                                <p className="mt-4"><strong>Bukti Oprasional:</strong> Tidak ada</p>
                            )}
                        </div>
                        {/* tombol approve dan reject */}
                        {detailData?.approvalStatus === "pending" && (
                            <div className="flex justify-end mt-4">
                                <button
                                    onClick={() => {
                                        handleSubmitApproval(detailData?._id, "approved")
                                        setTimeout(() => {
                                            setDetailData(null)
                                        }, 2000)
                                    }}
                                    className="bg-[linear-gradient(90deg,_rgba(0,_123,_255,_0.8)_0%,_rgba(123,_0,_255,_0.8)_100%)] hover:bg-[linear-gradient(90deg,_rgba(0,_123,_255,_1)_0%,_rgba(123,_0,_255,_1)_100%)] text-white px-4 py-2 rounded mr-2"
                                >
                                    Setujui
                                </button>
                                <button
                                    onClick={() => {
                                        handleSubmitApproval(detailData?._id, "rejected")
                                        setTimeout(() => {
                                            setDetailData(null)
                                        }, 2000)
                                    }}
                                    className="bg-[#1E1E1E] hover:bg-red-500 text-white px-4 py-2 rounded"
                                >
                                    Tolak
                                </button>
                            </div>
                        )}

                        {/* Tombol Tutup */}
                        <div className="flex justify-end mt-4">
                            <button
                                onClick={() => setDetailData(null)}
                                className="bg-[#1E1E1E] hover:bg-red-500 text-white px-4 py-2 rounded"
                            >
                                Tutup
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Confirm Modal */}
            <ConfirmCustom isOpen={isConfirmOpen} onClose={() => setIsConfirmOpen(false)} onConfirm={handleDelete} title="Konfirmasi Hapus" name={selectedData?.nama} />
        </div>
    );
};

export default OprationalAdmin;
