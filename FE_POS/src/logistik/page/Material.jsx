import React, { useState, useEffect } from "react";
import axios from "axios";
import PlusIcon from "/icon/plus-icon.webp";
import ConfirmCustom from "../../admin/component/ConfirmCustom";
import { FaSearch } from "react-icons/fa";

const Material = () => {
    const [data, setData] = useState([]);
    const [form, setForm] = useState({
        name: "",
        unit: "",
        stock: "",
        hargaBeli: "",
    });
    const [editDataId, setEditDataId] = useState(null);
    const [error, setError] = useState("");
    const [statusData, setStatusData] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [selectedData, setSelectedData] = useState("");
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isFocused, setIsFocused] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    // Fetch all materials
    const fetchMaterials = async () => {
        setStatusData("loading");
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_DB_API_URL}/api/pos/material?page=${page}&search=${encodeURIComponent(searchTerm)}`,
                {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                }
            );
            setData(response.data.materials);
            setTotalPages(response.data.totalPages);
            setStatusData("success");
            setError("");
        } catch (err) {
            setError(err.response?.data?.message || "Failed to fetch materials");
            setStatusData("error");
            if (err.response?.data?.message === "Material belum ada") {
                setError("");
                setStatusData("success");
                setData([]);
            }
        }
    };

    // Create or update material
    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatusData("loading");
        try {
            if (editDataId) {
                await axios.put(
                    `${import.meta.env.VITE_DB_API_URL}/api/pos/material/${editDataId}`,
                    form,
                    {
                        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                    }
                );
            } else {
                await axios.post(`${import.meta.env.VITE_DB_API_URL}/api/pos/material`, form, {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                });
            }
            fetchMaterials();
            setForm({ name: "", unit: "", stock: "", hargaBeli: "" });
            setEditDataId(null);
            setShowModal(false); // Tutup modal
            setError("");
            setStatusData("success");
        } catch (err) {
            setError(err.response?.data?.message || "Failed to save material");
            setStatusData("success");
        }
    };

    // Delete material
    const handleConfirmDelete = async (id, name) => {
        setSelectedData({ id: id, name: name });
        setIsConfirmOpen(true);
    };

    // Delete material tanpa perlu refresh manual
    const handleDelete = async () => {
        setStatusData("loading");
        try {
            await axios.delete(`${import.meta.env.VITE_DB_API_URL}/api/pos/material/${selectedData?.id}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            // Update state dengan filter data yang sudah dihapus
            setData((prevData) => prevData.filter((material) => material?._id !== selectedData?.id));
            setIsConfirmOpen(false); // Tutup modal konfirmasi setelah delete
            setStatusData("success");
            setError("");
        } catch (err) {
            setStatusData("error");
            setError(err.response?.data?.message || "Failed to delete material");
        }
    };

    // Set material data for editing
    const handleEdit = (material) => {
        setEditDataId(material?._id);
        setForm({
            name: material?.name,
            unit: material?.unit,
            stock: material?.stock,
            hargaBeli: material?.hargaBeli,
        });
        setShowModal(true); // Buka modal
    };

    // Handle page change
    const handlePageChange = (newPage) => {
        if (newPage > 0 && newPage <= totalPages) {
            setPage(newPage);
        }
    };

    const handleFocus = () => {
        setIsFocused(true);
    };

    const handleBlur = () => {
        setIsFocused(false);
    };

    useEffect(() => {
        fetchMaterials();
    }, [page, searchTerm]);

    console.log(searchTerm);


    // const handleChangeCurrency = (e) => {
    //     // Menghilangkan karakter selain angka
    //     const value = e.target.value.replace(/[^0-9]/g, "");

    //     // Mengonversi angka menjadi format IDR
    //     const formattedValue = new Intl.NumberFormat("id-ID", {
    //         style: "currency",
    //         currency: "IDR",
    //     }).format(value / 100); // Membagi dengan 100 agar sesuai format

    //     setForm({ ...form, hargaBeli: formattedValue });
    // };

    return (
        <div className="container mx-auto p-4  text-white min-h-screen mt-20">
            <div
                className={`flex items-center fixed sm:top-5 left-1/2 -translate-x-1/2 bg-[#0F0F0F] z-20 my-2 sm:my-0 min-w-60 w-full sm:w-96 px-4 py-2 rounded-full ${isFocused ? 'outline outline-2 outline-white' : ''}`}
                onFocus={handleFocus}
                onBlur={handleBlur}
            >
                <input
                    className="text-white bg-[#0F0F0F] w-full sm:w-96 focus:outline-none"
                    type="text"
                    name="search"
                    id="search"
                    placeholder="Cari Material"
                    value={searchTerm}
                    onChange={handleSearchChange}
                />
                <FaSearch />
            </div>
            <div className="flex items-center justify-between pt-20 sm:pt-0">
                <h1 className="text-xl md:text-3xl font-medium">Bahan Baku</h1>
                <button
                    onClick={() => {
                        setForm({ name: "", unit: "", stock: "", hargaBeli: "" });
                        setEditDataId(null);
                        setShowModal(true);
                    }}
                    className="text-white p-2 rounded-2xl hover:underline flex items-center"
                >
                    <p className="mr-2">Tambah Bahan Baku</p>
                    <img src={PlusIcon} alt="plus" />
                </button>
            </div>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            {statusData === "loading" && (
                <div className="">
                    <div className="flex justify-center items-center mt-20 min-h-max">
                        <div className="animate-spin border-t-2 border-[#FF0000] border-solid rounded-full w-16 h-16"></div>
                    </div>
                    <p className="text-center mt-4">Loading</p>
                </div>
            )}
            {statusData === "error" && (
                <p className="text-center text-red-500 mt-5">Gagal memuat data.</p>
            )}
            {statusData === "success" && data?.length === 0 && (
                <p className="text-center text-gray-600 mt-5">Belum ada data yang ditambahkan.</p>
            )}
            {statusData === "success" && data?.length > 0 && (
                <div className="">
                    <div className="w-full overflow-x-auto">
                        <table className="table-auto w-full text-white shadow-lg rounded-lg overflow-x-auto border-separate border-spacing-y-2">
                            <thead>
                                <tr>
                                    <th className="py-2 pr-2 text-left">No</th>
                                    <th className="py-2 pr-2 text-left">Nama</th>
                                    <th className="py-2 pr-2 text-left">Satuan</th>
                                    <th className="py-2 pr-2 text-left">Stok</th>
                                    <th className="py-2 pr-2 text-left">Harga Beli</th>
                                    <th className="py-2 pr-2 text-left">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data?.map((material, index) => (
                                    <tr key={material?._id} className="hover:bg-gray-700">
                                        <td className="border px-4 py-2 border-[#1A1A1A] rounded-tl-xl rounded-bl-xl">{((page - 1) * 10) + (index + 1)}</td>
                                        <td className="border px-4 py-2 border-[#1A1A1A]">{material?.name}</td>
                                        <td className="border px-4 py-2 border-[#1A1A1A]">{material?.unit}</td>
                                        <td className="border px-4 py-2 border-[#1A1A1A]">{material?.stock}</td>
                                        <td className="border px-4 py-2 border-[#1A1A1A]">{new Intl.NumberFormat('id-ID', {
                                            style: 'currency',
                                            currency: 'IDR',
                                        }).format(material?.hargaBeli)}</td>
                                        <td className="border px-4 py-2 border-[#1A1A1A] rounded-tr-xl rounded-br-xl">
                                            <button
                                                onClick={() => handleEdit(material)}
                                                className="bg-[linear-gradient(90deg,_rgba(255,_154,_0,_0.8)_0%,_rgba(255,_0,_0,_0.8)_100%)] hover:bg-[linear-gradient(90deg,_rgba(255,_154,_0,_1)_0%,_rgba(255,_0,_0,_1)_100%)] text-white px-2 mr-2 rounded m-1"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleConfirmDelete(material?._id, material?.name)}
                                                className="bg-[#1E1E1E] hover:bg-red-500 text-white px-2 mr-2 rounded m-1"
                                            >
                                                Hapus
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {/* Pagination Controls */}
                    <div className="flex justify-center mt-4">
                        <button
                            onClick={() => handlePageChange(page - 1)}
                            disabled={page <= 1}
                            className="bg-gray-700 text-white px-4 py-2 rounded-l-lg"
                        >
                            Prev
                        </button>
                        <span className="text-white py-2 px-4">{`Halaman ${page} dari ${totalPages}`}</span>
                        <button
                            onClick={() => handlePageChange(page + 1)}
                            disabled={page >= totalPages}
                            className="bg-gray-700 text-white px-4 py-2 rounded-r-lg"
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-[#0F0F0F] bg-opacity-70 flex items-center justify-center z-50">
                    <div className="bg-[#0F0F0F] p-6 rounded shadow-lg w-full max-w-lg border border-[#1A1A1A]">
                        <h2 className="text-xl font-medium mb-4 text-white text-center">
                            {editDataId ? "Edit Bahan Baku" : "Tambah Bahan Baku"}
                        </h2>
                        <form onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 gap-4">
                                <p className="-mb-3">Nama Bahan*</p>
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Nama"
                                    value={form.name}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                    required
                                    className="p-2 border border[#3D3D3D] rounded bg-[#0F0F0F] text-white"
                                />
                                <p className="-mb-3">Satuan*</p>
                                <select
                                    name="unit"
                                    value={form.unit}
                                    onChange={(e) => setForm({ ...form, unit: e.target.value })}
                                    required
                                    className="p-2 border border[#3D3D3D] rounded bg-[#0F0F0F] text-white"
                                >
                                    <option value="" disabled>Pilih Satuan</option>
                                    <option value="kg">Kilogram (kg)</option>
                                    <option value="gram">Gram (g)</option>
                                    <option value="liter">Liter (L)</option>
                                    <option value="ml">Mililiter (ml)</option>
                                    <option value="pcs">Pieces (pcs)</option>
                                </select>
                                <p className="-mb-3">Jumlah*</p>
                                <input
                                    type="number"
                                    name="stock"
                                    placeholder="Stok"
                                    value={form.stock}
                                    onChange={(e) => setForm({ ...form, stock: e.target.value })}
                                    required
                                    className="p-2 border border[#3D3D3D] rounded bg-[#0F0F0F] text-white"
                                />
                                <p className="-mb-3">Harga*</p>
                                <input
                                    type="number"
                                    name="hargaBeli"
                                    placeholder="Harga Beli"
                                    value={form.hargaBeli}
                                    onChange={(e) => setForm({ ...form, hargaBeli: e.target.value })}
                                    required
                                    className="p-2 border border[#3D3D3D] rounded bg-[#0F0F0F] text-white"
                                />
                                {/* <input
                                    type="text"
                                    name="hargaBeli"
                                    placeholder="Harga Beli"
                                    value={form.hargaBeli}
                                    onChange={handleChangeCurrency}
                                    required
                                    className="p-2 border border-[#3D3D3D] rounded bg-[#0F0F0F] text-white"
                                /> */}
                            </div>
                            <div className="flex justify-end mt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="bg-[#1E1E1E] hover:bg-red-500 text-white p-2 rounded mr-2 m-1"
                                >
                                    Batalkan
                                </button>
                                <button
                                    type="submit"
                                    className={`${statusData === "loading" ? "pointer-events-none" : ""} bg-[linear-gradient(90deg,_rgba(255,_154,_0,_0.8)_0%,_rgba(255,_0,_0,_0.8)_100%)] hover:bg-[linear-gradient(90deg,_rgba(255,_154,_0,_1)_0%,_rgba(255,_0,_0,_1)_100%)] text-white p-2 mr-2 rounded m-1`}
                                >
                                    {statusData === "loading" ? "Memuat..." : "Simpan"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Confirm Modal */}
            <ConfirmCustom
                isOpen={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={handleDelete}
                title="Konfirmasi Menghapus Data"
                name={selectedData?.name}
                message="Apakah Anda yakin ingin menghapus data "
            />
        </div>
    );
};

export default Material;
