import React, { useState, useEffect } from "react";
import axios from "axios";
import PlusIcon from "/icon/plus-icon.webp";
import ConfirmCustom from "../component/ConfirmCustom";

const User = () => {
    const [users, setUsers] = useState([]);
    const [form, setForm] = useState({
        nama: "",
        username: "",
        password: "",
        role: "",
    });
    const [editUserId, setEditUserId] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [statusData, setStatusData] = useState(false);
    const [showModal, setShowModal] = useState(false); // State untuk modal
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isFocused, setIsFocused] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [selectedData, setSelectedData] = useState("");

    // Fetch all users
    const fetchUsers = async () => {
        setStatusData("loading");
        try {
            const response = await axios.get(`${import.meta.env.VITE_DB_API_URL}/api/pos/user`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            setTotalPages(response?.data?.metadata?.totalPages);
            setUsers(response.data?.data);
            setStatusData("success");
        } catch (err) {
            setError(err.response?.data?.message || "Failed to fetch users");
            setStatusData("error");
        } 
    };

    // Create or update user
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            if (editUserId) {
                await axios.put(
                    `${API_URL}/${editUserId}`,
                    form,
                    {
                        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                    }
                );
            } else {
                await axios.post(API_URL, form, {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                });
            }

            fetchUsers();
            setForm({ nama: "", username: "", password: "", role: "" });
            setEditUserId(null);
            setShowModal(false); // Tutup modal
        } catch (err) {
            setError(err.response?.data?.message || "Failed to save user");
        }
    };

    const handleConfirmDelete = async (id, name) => {
        setSelectedData({ id: id, name: name });
        setIsConfirmOpen(true);
    };

    // Delete user
    const handleDelete = async () => {
        // if (!window.confirm("Are you sure you want to delete this user?")) return;
        setStatusData("loading");
        try {
            await axios.delete(`${API_URL}/${id}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            fetchUsers();
            setStatusData("success");
        } catch (err) {
            setError(err.response?.data?.message || "Failed to delete user");
            setStatusData("success");
        }
    };

    // Set user data for editing
    const handleEdit = (user) => {
        setEditUserId(user._id);
        setForm({
            nama: user.nama,
            username: user.username,
            password: "",
            role: user.role,
        });
        setShowModal(true); // Buka modal
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    return (
        <div className="container mx-auto p-4 bg-[#080808] text-white min-h-screen mt-20">
            <div className="flex items-center justify-between">
                <h1 className="text-xl md:text-3xl font-medium">Manajemen Pengguna</h1>
                <button
                    onClick={() => {
                        setForm({ nama: "", username: "", password: "", role: "" });
                        setEditUserId(null);
                        setShowModal(true); // Buka modal
                    }}
                    className="text-white p-2 rounded-2xl hover:underline flex items-center"
                >
                    <p className="mr-2">Tambah Pengguna</p>
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
            {statusData === "success" && users?.length === 0 && (
                <p className="text-center text-gray-600 mt-5">Belum ada data yang ditambahkan.</p>
            )}
            {statusData === "success" && users?.length > 0 && (
                <div className="">
                    <div className="w-full overflow-x-auto">
                        <table className="table-auto w-full text-white shadow-lg rounded-lg overflow-x-auto border-separate border-spacing-y-2">
                            <thead>
                                <tr>
                                    <th className="py-2 pr-2 text-left">Nama</th>
                                    <th className="py-2 pr-2 text-left">Username</th>
                                    <th className="py-2 pr-2 text-left">Role</th>
                                    <th className="py-2 pr-2 text-left">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user) => (
                                    <tr key={user._id} className="hover:bg-gray-700">
                                        <td className="border px-4 py-2 border-[#1A1A1A] rounded-tl-xl rounded-bl-xl">{user.nama}</td>
                                        <td className="border px-4 py-2 border-[#1A1A1A] ">{user.username}</td>
                                        <td className="border px-4 py-2 border-[#1A1A1A] ">{user.role}</td>
                                        <td className="border px-4 py-2 border-[#1A1A1A] rounded-tr-xl rounded-br-xl">
                                            <button
                                                onClick={() => handleEdit(user)}
                                                className="bg-yellow-500 text-black p-2 rounded hover:bg-yellow-400 mr-2"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleConfirmDelete(user?._id, user?.username)}
                                                className="bg-red-500 text-white p-2 rounded hover:bg-red-400"
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

            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
                    <div className="bg-[#0F0F0F] p-6 rounded shadow-lg w-full max-w-lg border border-[#1A1A1A]">
                        <h2 className="text-xl font-semibold mb-4 text-white">
                            {editUserId ? "Edit Pengguna" : "Tambah Pengguna"}
                        </h2>
                        <form onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 gap-4">
                                <input
                                    type="text"
                                    name="nama"
                                    placeholder="Nama"
                                    value={form.nama}
                                    onChange={(e) => setForm({ ...form, nama: e.target.value })}
                                    required
                                    className="p-2 border border-[#3D3D3D] rounded bg-[#0F0F0F] text-white"
                                />
                                <input
                                    type="text"
                                    name="username"
                                    placeholder="Username"
                                    value={form.username}
                                    onChange={(e) => setForm({ ...form, username: e.target.value })}
                                    required
                                    className="p-2 border border-[#3D3D3D] rounded bg-[#0F0F0F] text-white"
                                />
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="Password"
                                    value={form.password}
                                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                                    required={!editUserId}
                                    className="p-2 border border-[#3D3D3D] rounded bg-[#0F0F0F] text-white"
                                />
                                <select
                                    name="role"
                                    value={form.role}
                                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                                    required
                                    className="p-2 border border-[#3D3D3D] rounded bg-[#0F0F0F] text-white"
                                >
                                    <option value="">Select Role</option>
                                    <option value="admin">Admin</option>
                                    <option value="cashier">Kasir</option>
                                    <option value="manager">Manager</option>
                                    <option value="logistik">Manager</option>
                                </select>
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
                                    {editUserId ? "Update Pengguna" : "Tambah Pengguna"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
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

export default User;
