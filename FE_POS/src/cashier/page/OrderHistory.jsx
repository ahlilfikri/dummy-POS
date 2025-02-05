import React, { useState, useEffect } from "react";
import axios from "axios";
import PlusIcon from "/icon/plus-icon.webp";
import ConfirmCustom from "../../admin/component/ConfirmCustom";
import TransactionDetailModal from "../components/TransactionDetailModal";

const OrderHistory = () => {
    // const [data, setData] = useState([
    //     {
    //         "cashierId": { "name": "Andi" },
    //         "item": [
    //             {
    //                 "itemId": "65f1aeb5c12e4e1a9b8f6a01",
    //                 "jumlah":2,
    //                 "hargaJual": 10000,
    //                 "subtotal": 20000,
    //                 "nama": "Item A"
    //             },
    //             {
    //                 "itemId": "65f1aeb5c12e4e1a9b8f6a02",
    //                 "jumlah":1,
    //                 "hargaJual": 15000,
    //                 "subtotal": 15000,
    //                 "nama": "Item B"
    //             },
    //         ],
    //         "status": "success",
    //         "total": 35000,
    //         "createdAt": "2024-01-30T10:15:30.000Z"
    //     },
    //     {
    //         "cashierId": { "name": "Budi" },
    //         "item": [
    //             {
    //                 "itemId": "65f1aeb5c12e4e1a9b8f6a03",
    //                 "jumlah":1,
    //                 "hargaJual": 15000,
    //                 "subtotal": 15000,
    //                 "nama": "Item C"
    //             },
    //             {
    //                 "itemId": "65f1aeb5c12e4e1a9b8f6a04",
    //                 "jumlah":1,
    //                 "hargaJual": 5000,
    //                 "subtotal": 5000,
    //                 "nama": "Item D"
    //             }
    //         ],
    //         "status": "failed",
    //         "total": 20000,
    //         "createdAt": "2024-01-30T11:20:45.000Z"
    //     },
    //     {
    //         "cashierId": { "name": "Citra" },
    //         "item": [
    //             {
    //                 "itemId": "65f1aeb5c12e4e1a9b8f6a05",
    //                 "jumlah":2,
    //                 "hargaJual": 20000,
    //                 "subtotal": 40000,
    //                 "nama": "Item E"
    //             },
    //             {
    //                 "itemId": "65f1aeb5c12e4e1a9b8f6a06",
    //                 "jumlah":2,
    //                 "hargaJual": 5000,
    //                 "subtotal": 10000,
    //                 "nama": "Item F"
    //             }
    //         ],
    //         "status": "success",
    //         "total": 50000,
    //         "createdAt": "2024-01-30T12:30:10.000Z"
    //     },
    //     {
    //         "cashierId": { "name": "Dewi" },
    //         "item": [
    //             {
    //                 "itemId": "65f1aeb5c12e4e1a9b8f6a07",
    //                 "jumlah":5,
    //                 "hargaJual": 5000,
    //                 "subtotal": 25000,
    //                 "nama": "Item G"
    //             },
    //             {
    //                 "itemId": "65f1aeb5c12e4e1a9b8f6a08",
    //                 "jumlah":5,
    //                 "hargaJual": 7000,
    //                 "subtotal": 35000,
    //                 "nama": "Item H"
    //             }
    //         ],
    //         "status": "edit",
    //         "total": 60000,
    //         "createdAt": "2024-01-30T13:00:05.000Z"
    //     },
    //     {
    //         "cashierId": { "name": "Eko" },
    //         "item": [
    //             {
    //                 "itemId": "65f1aeb5c12e4e1a9b8f6a09",
    //                 "jumlah":2,
    //                 "hargaJual": 12000,
    //                 "subtotal": 24000,
    //                 "nama": "Item I"
    //             },
    //             {
    //                 "itemId": "65f1aeb5c12e4e1a9b8f6a10",
    //                 "jumlah":1,
    //                 "hargaJual": 15000,
    //                 "subtotal": 15000,
    //                 "nama": "Item J"
    //             }
    //         ],
    //         "status": "delete",
    //         "total": 39000,
    //         "createdAt": "2024-01-30T14:10:20.000Z"
    //     },
    //     {
    //         "cashierId": { "name": "Fajar" },
    //         "item": [
    //             {
    //                 "itemId": "65f1aeb5c12e4e1a9b8f6a11",
    //                 "jumlah":3,
    //                 "hargaJual": 8000,
    //                 "subtotal": 24000,
    //                 "nama": "Item K"
    //             },
    //             {
    //                 "itemId": "65f1aeb5c12e4e1a9b8f6a12",
    //                 "jumlah":1,
    //                 "hargaJual": 10000,
    //                 "subtotal": 10000,
    //                 "nama": "Item L"
    //             }
    //         ],
    //         "status": "success",
    //         "total": 34000,
    //         "createdAt": "2024-01-30T15:25:30.000Z"
    //     },
    //     {
    //         "cashierId": { "name": "Gita" },
    //         "item": [
    //             {
    //                 "itemId": "65f1aeb5c12e4e1a9b8f6a13",
    //                 "jumlah":6,
    //                 "hargaJual": 3000,
    //                 "subtotal": 18000,
    //                 "nama": "Item M"
    //             },
    //             {
    //                 "itemId": "65f1aeb5c12e4e1a9b8f6a14",
    //                 "jumlah":2,
    //                 "hargaJual": 7000,
    //                 "subtotal": 14000,
    //                 "nama": "Item N"
    //             }
    //         ],
    //         "status": "failed",
    //         "total": 32000,
    //         "createdAt": "2024-01-30T16:40:10.000Z"
    //     },
    //     {
    //         "cashierId": { "name": "Hadi" },
    //         "item": [
    //             {
    //                 "itemId": "65f1aeb5c12e4e1a9b8f6a15",
    //                 "jumlah":2,
    //                 "hargaJual": 25000,
    //                 "subtotal": 50000,
    //                 "nama": "Item O"
    //             },
    //             {
    //                 "itemId": "65f1aeb5c12e4e1a9b8f6a16",
    //                 "jumlah":1,
    //                 "hargaJual": 15000,
    //                 "subtotal": 15000,
    //                 "nama": "Item P"
    //             }
    //         ],
    //         "status": "success",
    //         "total": 65000,
    //         "createdAt": "2024-01-30T17:05:50.000Z"
    //     },
    //     {
    //         "cashierId": { "name": "Indah" },
    //         "item": [
    //             {
    //                 "itemId": "65f1aeb5c12e4e1a9b8f6a17",
    //                 "jumlah":2,
    //                 "hargaJual": 6000,
    //                 "subtotal": 12000,
    //                 "nama": "Item Q"
    //             },
    //             {
    //                 "itemId": "65f1aeb5c12e4e1a9b8f6a18",
    //                 "jumlah":2,
    //                 "hargaJual": 8000,
    //                 "subtotal": 16000,
    //                 "nama": "Item R"
    //             }
    //         ],
    //         "status": "edit",
    //         "total": 28000,
    //         "createdAt": "2024-01-30T18:15:25.000Z"
    //     },
    //     {
    //         "cashierId": { "name": "Joko" },
    //         "item": [
    //             {
    //                 "itemId": "65f1aeb5c12e4e1a9b8f6a19",
    //                 "jumlah":1,
    //                 "hargaJual": 45000,
    //                 "subtotal": 45000,
    //                 "nama": "Item S"
    //             },
    //             {
    //                 "itemId": "65f1aeb5c12e4e1a9b8f6a20",
    //                 "jumlah":1,
    //                 "hargaJual": 25000,
    //                 "subtotal": 25000,
    //                 "nama": "Item T"
    //             }
    //         ],
    //         "status": "delete",
    //         "total": 70000,
    //         "createdAt": "2024-01-30T19:30:40.000Z"
    //     }
    // ]

    // );
    const [data, setData] = useState("")
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [editItemId, setEditItemId] = useState(null);
    const [statusData, setStatusData] = useState("");
    const [selectedData, setSelectedData] = useState("");
    const [isConfirmUpdateOpen, setIsConfirmUpdateOpen] = useState(false);
    const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState(null);

    const handleShowDetail = (transaction) => {
        setSelectedTransaction(transaction);
        setIsModalOpen(true);
    };

    // Fetch all items
    const getFromApi = async () => {
        setStatusData("loading");
        try {
            const response = await axios.get(`${import.meta.env.VITE_DB_API_URL}/api/pos/transaction/today?page=${page}`, { status: "delete" }, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            setTotalPages(response?.data?.totalPages)
            setData(response?.data?.transactions);
            setStatusData("success");
        } catch (err) {
            if (err.response?.data?.message == "No transaction today") {
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

    const handleConfirmUpdate = async () => {
        console.log(selectedTransaction);
        if (selectedTransaction?.status === "edit") {
            console.log("update");
            try {
                await axios.put(`${import.meta.env.VITE_DB_API_URL}/api/pos/transaction/${selectedTransaction?.id}`, { status: "edit" }, {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                });
                getFromApi();
            } catch (err) {
                console.error("Failed to update item", err.response?.data?.message || err);
            }
        }
        setIsConfirmUpdateOpen(false);
    };
    
    const handleConfirmDelete = async () => {
        if (selectedTransaction?.status === "delete") {
            console.log("delete");
            try {
                await axios.put(`${import.meta.env.VITE_DB_API_URL}/api/pos/transaction/${selectedTransaction?.id}`, { status: "delete" }, {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                });
                getFromApi();
            } catch (err) {
                console.error("Failed to delete item", err.response?.data?.message || err);
            }
        }
        setIsConfirmDeleteOpen(false);
    };

    const handleConfirm = (status, transaction) => {
        setSelectedTransaction({status,id:transaction});
        if (status === "delete") {
            setIsConfirmDeleteOpen(true);
        } else if (status === "edit") {
            setIsConfirmUpdateOpen(true);
        }
    };

    useEffect(() => {
        getFromApi();
    }, [page]);

    return (
        <div className="container mx-auto p-4 text-white min-h-screen mt-20">
            <div className="flex items-center justify-between">
                <h1 className="text-xl md:text-3xl font-medium">History Pesanan</h1>
            </div>
            {statusData === "loading" && (
                <div className="">
                    <div className="flex justify-center items-center mt-20 min-h-max">
                        <div className="animate-spin border-t-2 border-[#FF0000] border-solid rounded-full w-16 h-16"></div>
                    </div>
                    <p className="text-center mt-4">Loading</p>
                </div>
            )}
            {statusData === "error" && (
                <p className="text-center text-red-500 mt-5">Gagal memuat data, Mohon refresh Halaman</p>
            )}
            {statusData === "success" && data?.length === 0 && (
                <p className="text-center text-gray-600 mt-5">Belum ada transaksi hari ini.</p>
            )}
            {statusData === "success" && data?.length > 0 && (
                <div className="">

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
                                            {new Date(transaction?.createdAt).toLocaleTimeString('id-ID', {
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </td>
                                        <td className="border px-4 py-2 border-[#1A1A1A]">{transaction?.cashierId?.nama}</td>
                                        <td className="border px-4 py-2 border-[#1A1A1A]">
                                            {new Intl.NumberFormat('id-ID', {
                                                style: 'currency',
                                                currency: 'IDR',
                                            }).format(transaction?.total)}
                                        </td>
                                        <td className={`border px-4 py-2 border-[#1A1A1A]`}>
                                            <p className={`w-max px-4 rounded-2xl ${transaction?.status == "success" ? "bg-green-500" : transaction?.status == "failed" ? "bg-red-500" : transaction?.status == "edit" ? "bg-yellow-500" : transaction?.status == "delete" ? "bg-orange-500" : ""}`}>
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
                                                onClick={() => handleConfirm("edit", transaction?._id, new Date(transaction?.createdAt).toLocaleTimeString('id-ID', {
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                }))}
                                                className="m-1 bg-[linear-gradient(90deg,_rgba(255,_154,_0,_0.8)_0%,_rgba(255,_0,_0,_0.8)_100%)] hover:bg-[linear-gradient(90deg,_rgba(255,_154,_0,_1)_0%,_rgba(255,_0,_0,_1)_100%)] text-white px-2 mr-2 rounded"
                                            >
                                                Edit
                                            </button> */}
                                            <button
                                                onClick={() => handleConfirm("delete", transaction?._id, new Date(transaction?.createdAt).toLocaleTimeString('id-ID', {
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                }))}
                                                className="m-1 bg-[#1E1E1E] hover:bg-[#ff3636] text-white px-2 rounded"
                                            >
                                                Hapus
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
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
            )
            }
            <ConfirmCustom
                isOpen={isConfirmUpdateOpen}
                onClose={() => setIsConfirmUpdateOpen(false)}
                onConfirm={handleConfirmUpdate} // Call the appropriate function for update
                title="Konfirmasi Pengajuan Rubah Data"
                name={selectedTransaction?.cashierId?.name}
                message={`Apakah Anda yakin ingin mengajukan perubahan data pada waktu ${new Date(selectedTransaction?.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}`}
            />

            <ConfirmCustom
                isOpen={isConfirmDeleteOpen}
                onClose={() => setIsConfirmDeleteOpen(false)}
                onConfirm={handleConfirmDelete} // Call the appropriate function for delete
                title="Konfirmasi Pengajuan Hapus Data"
                name={selectedTransaction?.cashierId?.name}
                message={`Apakah Anda yakin ingin mengajukan penghapusan data pada waktu ${new Date(selectedTransaction?.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}`}
            />
            {/* Modal Detail Transaksi */}
            <TransactionDetailModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                transaction={selectedTransaction}
            />
        </div >
    );
};

export default OrderHistory;
