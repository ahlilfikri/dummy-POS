import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import Image from "/ayam.png";
import axios from "axios";
import TransactionSuccessModal from "../components/TransactionSuccess";
import { useEffect } from "react";

const ConfirmationOrder = ({ cart, onClose }) => {
    const location = useLocation();
    const navigate = useNavigate();
    // const { cart: initialCart } = location.state || { cart: [] };
    const [cartData, setCartData] = useState(cart);
    const [detail, setDetail] = useState("");
    const [metodePembayaran, setMetodePembayaran] = useState("");
    const [uangMasuk, setUangMasuk] = useState("");
    const [uangkembalian, setUangKembalian] = useState("");
    const [statusData, setStatusData] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [transactionDetails, setTransactionDetails] = useState(null);
    const [show, setShow] = useState(true);

    const removeFromCart = (item) => {
        const updatedCart = cartData?.filter((cartItem) => cartItem?.nama !== item?.nama);
        setCartData(updatedCart);
    };

    const changeQuantity = (item, action) => {
        const updatedCart = cartData?.map((cartItem) => {
            if (cartItem?.nama === item?.nama) {
                const newQuantity = cartItem?.quantity + action;
                if (newQuantity >= 1 && newQuantity <= cartItem?.stok) {
                    return { ...cartItem, quantity: newQuantity };
                }
            }
            return cartItem;
        });
        setCartData(updatedCart);
    };

    const calculateTotal = () => {
        return cartData?.reduce((total, item) => {
            return total + (item?.hargaJual * item?.quantity);
        }, 0);
    };

    const handleChangeDetail = (e) => {
        setDetail(e);
    };

    const handleChangeMetodePembayaran = (e) => {
        setMetodePembayaran(e.target.value);
    };

    const getSimplifiedCart = (cartData) => {
        return cartData?.map(item => ({
            itemId: item._id,
            jumlah: item.quantity  // Ganti 'quantity' menjadi 'jumlah'
        }));
    };

    const handleClose = () => {
        setShow(false);
        onClose();
    };

    const handleTransaction = async () => {
        if (!detail || !metodePembayaran) {
            alert("Detail dan Metode Pembayaran harus diisi!");
            return;
        }

        setStatusData("loading");

        try {
            const user = localStorage.getItem('user');
            const kasir = JSON.parse(user);
            const simplifiedCart = getSimplifiedCart(cartData);

            if (simplifiedCart.length === 0) {
                alert("Cart masih kosong!");
                return;
            }

            const requestData = {
                cashierId: kasir?.id,
                detail,
                metodePembayaran,
                item: simplifiedCart,
                uangMasuk: uangMasuk,
            };
            const response = await axios.post(
                `${import.meta.env.VITE_DB_API_URL}/api/pos/transaction/create/transaction`,
                requestData,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    },
                }
            );

            console.log(response);

            setStatusData("success");
            console.log("qr kirim", response);
            console.log("qr kirim", response?.data);
            console.log("qr kirim", response?.data?.transaction);
            console.log("qr kirim", response?.data?.transaction?.qrCode);

            const transactionDetails = {
                metodePembayaran,
                detail,
                total: calculateTotal(),
                uangMasuk,
                uangKembalian: uangMasuk > calculateTotal() ? uangMasuk - calculateTotal() : 0,
                items: cartData?.map(item => ({
                    nama: item?.nama,
                    harga: item?.hargaJual,
                    quantity: item?.quantity,
                    subTotal: item?.quantity * item?.hargaJual
                })),
                qr: response?.data?.transaction?.qrCode
            };

            setTransactionDetails(transactionDetails);
            setIsModalOpen(true);
        } catch (err) {
            console.log(err);
            setStatusData("success");
        }
    };

    useEffect(() => {
        const total = calculateTotal();
        const uangMasukNum = Number(uangMasuk) || 0;
        setUangKembalian(uangMasukNum > total ? uangMasukNum - total : 0);
    }, [uangMasuk]);

    const date = new Date().toLocaleDateString("id-ID");

    return (
        <>
            {show && (
                <div className="min-h-screen mt-24">
                    <h1 className="my-5">Konfirmasi Pesanan</h1>
                    <div className="space-y-4">
                        {cartData?.length === 0 ? (
                            <p>Keranjang Anda kosong.</p>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 ">
                                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 ">
                                    {cartData?.map((item, index) => (
                                        <div key={item?.nama} className="bg-[#0F0F0F] rounded-md relative h-max pb-5">
                                            <button
                                                onClick={() => removeFromCart(item)}
                                                className="bg-[#FF4949] w-8 h-8 rounded-full absolute -right-3 -mt-3 text-4xl"
                                            >
                                                <p className="-mt-2">-</p>
                                            </button>
                                            <img src={Image} alt={item?.nama} className="w-full h-32 object-cover rounded" />
                                            <div className="px-4 py-2">
                                                <h3>{item?.nama}</h3>
                                                <p>{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(item?.hargaJual)} x {item?.quantity}</p>
                                            </div>
                                            <div className="flex items-center justify-around ">
                                                <button
                                                    onClick={() => changeQuantity(item, -1)}
                                                    className="text-white w-8 h-8 rounded-full"
                                                    disabled={item?.quantity <= 1}
                                                >
                                                    -
                                                </button>
                                                <span className="text-lg">{item?.quantity}</span>
                                                <button
                                                    onClick={() => changeQuantity(item, 1)}
                                                    className="text-white w-8 h-8 rounded-full"
                                                    disabled={item?.quantity >= item?.stok}
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="bg-[#0F0F0F] text-white py-8 px-3 md:px-8 rounded-lg mb-5">
                                    <div className="flex flex-wrap items-center justify-between">
                                        <h1 className="text-xl md:text-3xl">Detail Pembelian</h1>

                                    </div>

                                    {/* Table with Items */}
                                    <div className="line-dashed"></div>
                                    <table className="min-w-full mb-5">
                                        <thead>
                                            <tr>
                                                <th className="py-2 text-left text-xs sm:text-sm md:text-xs lg:text-base">
                                                    Qty
                                                    <div className="line-dashed"></div>
                                                </th>
                                                <th className="py-2 text-left text-xs sm:text-sm md:text-xs lg:text-base">
                                                    Nama
                                                    <div className="line-dashed"></div>
                                                </th>
                                                <th className="py-2 text-left text-xs sm:text-sm md:text-xs lg:text-base">
                                                    Harga
                                                    <div className="line-dashed"></div>
                                                </th>
                                                <th className="py-2 text-right text-xs sm:text-sm md:text-xs lg:text-base">
                                                    Sub Total
                                                    <div className="line-dashed"></div>
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {cartData?.map((item, index) => (
                                                <tr key={index}>
                                                    <td className="py-2 text-xs sm:text-sm md:text-xs lg:text-base">{item?.quantity}</td>
                                                    <td className="py-2 text-xs sm:text-sm md:text-xs lg:text-base">{item?.nama}</td>
                                                    <td className="py-2 text-xs sm:text-sm md:text-xs lg:text-base">{new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(item?.hargaJual)}</td>
                                                    <td className="py-2 text-xs sm:text-sm md:text-xs lg:text-base text-right">{new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(item?.quantity * item?.hargaJual)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>

                                    {/* Total summary */}
                                    <div className="flex justify-between mb-5">
                                        <p>Total Items: {cartData?.length}</p>
                                        <p>Total: {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(calculateTotal())}</p>
                                    </div>

                                    {/* Date */}
                                    <div className="flex justify-between mb-5">
                                        <p>Tanggal: {date}</p>
                                    </div>

                                    <div className="grid grid-cols-2 space-x-2 mb-5">
                                        <label className="text-sm md:text-base ml-2">Metode Pembayaran</label>
                                        <label className="text-sm md:text-base">Detail Nama/Meja</label>
                                        <div className="flex flex-wrap items-center justify-between">
                                            <select
                                                value={metodePembayaran}
                                                onChange={handleChangeMetodePembayaran}
                                                className="bg-[#1E1E1E] text-sm p-2 rounded-xl w-full"
                                            >
                                                <option value="">Pilih Metode Pembayaran</option>
                                                <option value="tunai">Tunai</option>
                                                <option value="Qris">Qris</option>
                                            </select>
                                        </div>
                                        <input
                                            className="bg-[#1E1E1E] text-sm p-2 rounded-xl my-2 md:my-0 h-10"
                                            onChange={(e) => handleChangeDetail(e.target.value)}
                                            type="text"
                                            placeholder="Masukkan Detail"
                                            value={detail}
                                        />
                                    </div>
                                    {metodePembayaran === "tunai" && (
                                        <div className="grid grid-cols-2 space-x-2 mb-5">
                                            <label className="text-sm md:text-base ml-2">Jumlah Pembayaran</label>
                                            <label className="text-sm md:text-base">Jumlah Kembalian</label>
                                            <input
                                                className="bg-[#1E1E1E] text-sm p-2 rounded-xl my-2 md:my-0 h-10"
                                                onChange={(e) => setUangMasuk(e.target.value)}
                                                type="number"
                                                placeholder="Masukkan Jumlah Pembayaran"
                                                value={uangMasuk}
                                            />
                                            <p
                                                className="bg-[#1E1E1E] text-sm p-2 rounded-xl my-2 md:my-0 h-10"
                                            >{new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(uangkembalian)}</p>
                                        </div>
                                    )}
                                    {/* Menambahkan dropdown untuk metode pembayaran */}


                                    {/* Buttons */}
                                    <div className="flex justify-end">
                                        <button className="bg-[#1E1E1E] mr-4 w-24 text-sm py-2 text-white rounded-md hover:bg-red-600 transition duration-200" onClick={() => handleClose()}>
                                            Batalkan
                                        </button>
                                        <button disabled={statusData == "loading"} onClick={() => handleTransaction()} className="bg-orange-500 w-26 text-sm py-2 px-2 text-white rounded-md  bg-[linear-gradient(90deg,_rgba(255,_154,_0,_0.5)_0%,_rgba(255,_0,_0,_0.5)_100%)] hover:bg-[linear-gradient(90deg,_rgba(255,_154,_0,_1)_0%,_rgba(255,_0,_0,_1)_100%)] transition duration-200">
                                            {statusData == "loading" ? "Memuat..." : "Buat Pesanan"}
                                        </button>
                                        <div className="space-x-4">
                                            {/* <button className="bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-600 transition duration-200">
                                        Print & Place Order
                                        </button> */}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    <TransactionSuccessModal onClose={handleClose} isOpen={isModalOpen} transactionDetails={transactionDetails} />
                </div>)
            }
        </>
    );
};

export default ConfirmationOrder;
