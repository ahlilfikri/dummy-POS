import React, { useState, useEffect } from "react";
import axios from "axios";
import PlusIcon from "/icon/plus-icon.webp";
import ConfirmCustom from "../../admin/component/ConfirmCustom";
import TransactionDetailModal from "../../cashier/components/TransactionDetailModal";

const Transaction = () => {
    const [data, setData] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [editItemId, setEditItemId] = useState(null);
    const [statusData, setStatusData] = useState("");
    const [selectedData, setSelectedData] = useState("");
    const [isConfirmUpdateOpen, setIsConfirmUpdateOpen] = useState(false);
    const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [statusFilter, setStatusFilter] = useState(""); // Status filter state
    const [isConfirmApproveOpen, setIsConfirmApproveOpen] = useState(false);
    const [isConfirmRejectOpen, setIsConfirmRejectOpen] = useState(false);
    const [selectedTransactionId, setSelectedTransactionId] = useState(null);

    const handleShowDetail = (transaction) => {
        setSelectedTransaction(transaction);
        setIsModalOpen(true);
    };

    // Mendapatkan data dari API dengan filter status
    const getFromApi = async () => {
        setStatusData("loading");
        try {
            const response = await axios.get(`${import.meta.env.VITE_DB_API_URL}/api/pos/transaction`, {
                params: { page, status: statusFilter },
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            setTotalPages(response?.data?.totalPages);
            setData(response?.data?.transactions);
            setStatusData("success");
        } catch (err) {
            console.log(err.response?.data?.message || "Failed to fetch items");
            if (err.response?.data?.message == "No transactions found") {
                setStatusData("success");
            } else {
                setStatusData("error");
            }
        }
    };

    // Handle page change
    const handlePageChange = (newPage) => {
        if (newPage > 0 && newPage <= totalPages) {
            setPage(newPage);
        }
    };

    // Perbaiki handleDelete untuk menghapus transaksi
    const handleDelete = async (id, name) => {
        setSelectedData(name);
        setIsConfirmDeleteOpen(true);
        try {
            // Menghapus transaksi dengan status delete
            await axios.delete(`${import.meta.env.VITE_DB_API_URL}/api/pos/transaction/${id}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            getFromApi();
        } catch (err) {
            console.log(err.response?.data?.message || "Failed to delete item");
        }
    };

    // Perbaiki handleEdit untuk mengedit transaksi
    const handleEdit = (transaction) => {
        setSelectedTransaction(transaction);
        setIsModalOpen(true);
    };

    // Fungsi untuk menyimpan perubahan transaksi (edit)
    const handleSaveEdit = async (updatedTransaction) => {
        try {
            await axios.put(`${import.meta.env.VITE_DB_API_URL}/api/pos/transaction/${updatedTransaction._id}`, updatedTransaction, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            getFromApi(); // Refresh data setelah update
            setIsModalOpen(false); // Menutup modal setelah simpan
        } catch (err) {
            console.log("Error saving edit:", err);
        }
    };

    // Fungsi untuk mengonfirmasi setujui transaksi
    const handleApprove = (transactionId) => {
        setSelectedTransactionId(transactionId);
        setIsConfirmApproveOpen(true);  // Menampilkan dialog konfirmasi Setujui
    };

    // Fungsi untuk menolak transaksi
    const handleReject = (transactionId) => {
        setSelectedTransactionId(transactionId);
        setIsConfirmRejectOpen(true);  // Menampilkan dialog konfirmasi Tolak
    };

    useEffect(() => {
        getFromApi();
    }, [page,statusFilter]);

    return (
        <div className="container mx-auto p-4 text-white min-h-screen mt-20">
            <div className="flex items-center justify-between">
                <h1 className="text-xl md:text-3xl font-medium">Transaksi</h1>
            </div>
            <div className="mt-4 flex items-center">
                <p className="mr-2">Filter Status </p>
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="bg-gray-800 text-white px-2 py-1 rounded"
                >
                    <option value="">Semua Status</option>
                    <option value="success">Success</option>
                    <option value="failed">Failed</option>
                    {/* <option value="edit">Edit</option> */}
                    <option value="delete">Delete</option>
                </select>
            </div>
            {statusData === "loading" && (
                <div className="flex justify-center items-center mt-20 min-h-max">
                    <div className="animate-spin border-t-2 border-[#FF0000] border-solid rounded-full w-16 h-16"></div>
                </div>
            )}
            {statusData === "error" && (
                <p className="text-center text-red-500 mt-5">Gagal memuat data, Mohon refresh Halaman</p>
            )}
            {statusData === "success" && data?.length === 0 && (
                <p className="text-center text-gray-600 mt-5">Belum ada transaksi hari ini.</p>
            )}
            {statusData === "success" && data?.length > 0 && (
                <div className="w-full overflow-x-auto">
                    <table className="table-auto w-full text-white shadow-lg rounded-lg overflow-x-auto border-separate border-spacing-y-2">
                        <thead>
                            <tr>
                                <th className="py-2 pr-2 text-left">No</th>
                                <th className="py-2 pr-2 text-left">Waktu</th>
                                <th className="py-2 pr-2 text-left">Nama Cashier</th>
                                <th className="py-2 pr-2 text-left">Total</th>
                                <th className="py-2 pr-2 text-left">Status</th>
                                <th className="py-2 pr-2 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data?.map((transaction, index) => (
                                <tr key={transaction?._id} className="bg-[#0F0F0F] rounded-2xl">
                                    <td className="border px-4 py-2 border-[#1A1A1A] rounded-tl-xl rounded-bl-xl">{page * (index + 1)}</td>
                                    <td className="border px-4 py-2 border-[#1A1A1A]">
                                        {new Date(transaction?.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                                    </td>
                                    <td className="border px-4 py-2 border-[#1A1A1A]">{transaction?.cashierId?.nama}</td>
                                    <td className="border px-4 py-2 border-[#1A1A1A]">
                                        {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(transaction?.total)}
                                    </td>
                                    <td className={`border px-4 py-2 border-[#1A1A1A]`}>
                                        <p className={`w-max px-4 rounded-2xl ${transaction?.status === "success" ? "bg-green-500" : transaction?.status === "failed" ? "bg-red-500" : transaction?.status === "edit" ? "bg-yellow-500" : transaction?.status === "delete" ? "bg-orange-500" : ""}`}>
                                            {transaction?.status}
                                        </p>
                                    </td>
                                    <td className="border px-4 py-2 border-[#1A1A1A] rounded-tr-xl rounded-br-xl">
                                        <button
                                            onClick={() => handleShowDetail(transaction)}
                                            className="m-1 bg-blue-500 hover:bg-blue-700 text-white px-2 rounded mr-2"
                                        >
                                            Detail
                                        </button>
                                        {/* <button
                                            onClick={() => handleEdit(transaction)}
                                            className="bg-[linear-gradient(90deg,_rgba(255,_154,_0,_0.8)_0%,_rgba(255,_0,_0,_0.8)_100%)] hover:bg-[linear-gradient(90deg,_rgba(255,_154,_0,_1)_0%,_rgba(255,_0,_0,_1)_100%)] text-white px-2 mr-2 rounded"
                                        >
                                            Edit
                                        </button> */}
                                        <button
                                            onClick={() => handleDelete(transaction?._id, new Date(transaction?.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }))}
                                            className="bg-[#1E1E1E] hover:bg-[#ff3636] text-white px-2 rounded"
                                        >
                                            Hapus
                                        </button>
                                        {transaction?.status === "edit" || transaction?.status === "delete" ? (
                                            <>
                                                <button
                                                    onClick={() => handleApprove(transaction._id)}
                                                    className="m-1 bg-green-500 hover:bg-green-700 text-white px-2 rounded mr-2"
                                                >
                                                    Setujui
                                                </button>
                                                <button
                                                    onClick={() => handleReject(transaction._id)}
                                                    className="bg-red-500 hover:bg-red-700 text-white px-2 mr-2 rounded"
                                                >
                                                    Tolak
                                                </button>
                                            </>
                                        ) : null}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
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

            {/* Modal Konfirmasi Penghapusan */}
            <ConfirmCustom
                isOpen={isConfirmDeleteOpen}
                onClose={() => setIsConfirmDeleteOpen(false)}
                onConfirm={() => handleDelete(selectedTransactionId)}
                title="Konfirmasi Hapus"
                name={selectedData}
                message="Apakah Anda yakin ingin menghapus transaksi ini?"
            />

            {/* Modal Konfirmasi Setujui */}
            <ConfirmCustom
                isOpen={isConfirmApproveOpen}
                onClose={() => setIsConfirmApproveOpen(false)}
                onConfirm={async () => {
                    try {
                        await axios.put(`${import.meta.env.VITE_DB_API_URL}/api/pos/transaction/${selectedTransactionId}`, { status: 'approve' });
                        getFromApi();
                        setIsConfirmApproveOpen(false);
                    } catch (error) {
                        console.error("Error approving transaction:", error);
                    }
                }}
                title="Konfirmasi Setujui"
                name="Setujui transaksi?"
                message="Apakah Anda yakin ingin menyetujui transaksi ini?"
            />

            {/* Modal Konfirmasi Tolak */}
            <ConfirmCustom
                isOpen={isConfirmRejectOpen}
                onClose={() => setIsConfirmRejectOpen(false)}
                onConfirm={async () => {
                    try {
                        await axios.put(`${import.meta.env.VITE_DB_API_URL}/api/pos/transaction/${selectedTransactionId}`, { status: 'reject' });
                        getFromApi();
                        setIsConfirmRejectOpen(false);
                    } catch (error) {
                        console.error("Error rejecting transaction:", error);
                    }
                }}
                title="Konfirmasi Tolak"
                name="Tolak transaksi?"
                message="Apakah Anda yakin ingin menolak transaksi ini?"
            />

            {/* Modal Detail */}
            <TransactionDetailModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                transaction={selectedTransaction}
            />
        </div>
    );
};

export default Transaction;
