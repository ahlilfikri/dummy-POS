import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Image from "/ayam.png";
import { FaSearch } from "react-icons/fa";
import ConfirmationOrder from "./ConfirmationOrder"

const Cashier = ({ openSidebar }) => {
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [dataCategory, setDataCategory] = useState([]);
    const [countMenuSelected, setCountMenuSelected] = useState(0);
    const [cart, setCart] = useState([]);
    const [itemQuantities, setItemQuantities] = useState({});
    const [searchTerm, setSearchTerm] = useState("");
    const [statusData, setStatusData] = useState("");
    const [isFocused, setIsFocused] = useState(false);
    const [categorySelected, setCategorySelected] = useState(null);
    const [filteredData, setFilteredData] = useState([]);
    const [confirmOrderOpen, setConfirmOrderOpen] = useState(false);

    // Handle search input change
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    // Fetch items from API based on selected category
    const getFromApi = async () => {
        setStatusData("loading");
        try {
            const response = await axios.get(`${import.meta.env.VITE_DB_API_URL}/api/pos/item/cashier`, {
                params: { category: categorySelected?._id || "" },
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            setData(response?.data?.items);
            setStatusData("success");
        } catch (err) {
            setStatusData("error");
            if (err?.response?.data?.message === "Item belum ada") {
                setData([]);
                setStatusData("success");
            }
        }
    };

    // Fetch categories from API
    const fetchCategory = async () => {
        setStatusData("loading");
        try {
            const response = await axios.get(`${import.meta.env.VITE_DB_API_URL}/api/pos/category`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            setDataCategory(response?.data?.categories);
            setStatusData("success");
        } catch (err) {
            setStatusData("error");
            if (err?.response?.data?.message === "Category belum ada") {
                setDataCategory([]);
                setStatusData("success");
            }
        }
    };

    // Add an item to the cart
    const addToCart = (item) => {
        if (item?.stok > 0) {
            setCountMenuSelected(countMenuSelected + 1);
        }
        const quantity = itemQuantities[item?.nama];

        if (quantity <= 0) return;

        const existingItem = cart.find((cartItem) => cartItem.nama === item?.nama);

        if (existingItem) {
            if (existingItem.quantity + quantity <= item?.stok) {
                setCart(
                    cart.map((cartItem) =>
                        cartItem.nama === item?.nama
                            ? { ...cartItem, quantity: cartItem.quantity + quantity }
                            : cartItem
                    )
                );
            } else {
                alert("Stok tidak cukup!");
            }
        } else {
            if (item?.stok >= quantity) {
                setCart([...cart, { ...item, quantity }]);
            } else {
                alert("Stok tidak tersedia!");
            }
        }
    };

    // Remove an item from the cart
    const deleteToCart = (item) => {
        setCountMenuSelected(countMenuSelected - 1);

        const quantity = itemQuantities[item?.nama];

        if (quantity <= 0) return;

        const existingItem = cart.find((cartItem) => cartItem.nama === item?.nama);

        if (existingItem) {
            const newQuantity = existingItem.quantity - quantity;
            if (newQuantity > 0) {
                setCart(
                    cart.map((cartItem) =>
                        cartItem.nama === item?.nama
                            ? { ...cartItem, quantity: newQuantity }
                            : cartItem
                    )
                );
            } else {
                setCart(cart.filter((cartItem) => cartItem.nama !== item?.nama));
            }
        }
    };

    // Change the quantity of an item
    const changeQuantity = (item, action) => {
        setItemQuantities((prevQuantities) => {
            const newQuantity = prevQuantities[item?.nama] + action;
            if (newQuantity >= 0 && newQuantity <= item?.stok) {
                return { ...prevQuantities, [item?.nama]: newQuantity };
            }
            return prevQuantities;
        });
    };

    // Navigate to the cart page
    const goToCart = () => {
        // navigate("/confirmation-order", { state: { cart } });(
        setConfirmOrderOpen(true);
    };

    const closeCart = () => {
        // navigate("/confirmation-order", { state: { cart } });(
        setCart([]);
        setCountMenuSelected(0);
        setConfirmOrderOpen(false);
    };

    // Handle focus and blur for search input
    const handleFocus = () => {
        setIsFocused(true);
    };

    const handleBlur = () => {
        setIsFocused(false);
    };

    // Fetch data and categories when component mounts or category changes
    useEffect(() => {
        getFromApi();
        fetchCategory();
    }, [categorySelected]); // Re-fetch items when category changes

    // Initialize quantities when data is loaded
    useEffect(() => {
        if (data && Array.isArray(data)) {
            const initialQuantities = data?.reduce((acc, item) => {
                acc[item?.nama] = 1;
                return acc;
            }, {});
            setItemQuantities(initialQuantities);
        }
    }, [data]);

    // Filter data whenever searchTerm or categorySelected changes
    useEffect(() => {
        if (data && Array.isArray(data)) {
            const filtered = data.filter((item) =>
                item?.nama?.toLowerCase().includes(searchTerm.toLowerCase()) &&
                (categorySelected
                    ? item.categoryId.some(category => category?._id.toString() === categorySelected?._id.toString())
                    : true)
            );
            setFilteredData(filtered);
        }
    }, [data, searchTerm, categorySelected]);

    return (
        <>
            {!confirmOrderOpen ?
                (<div className="min-h-screen mt-20 relative">
                    {!openSidebar && (
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
                                placeholder="Cari menu"
                                value={searchTerm}
                                onChange={handleSearchChange}
                            />
                            <FaSearch />
                        </div>
                    )}
                    <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 pt-16 sm:pt-6">
                        <div onClick={() => setCategorySelected(null)} className={`m-2 ${categorySelected === null ? "bg-[linear-gradient(90deg,_rgba(255,_154,_0,_1)_0%,_rgba(255,_0,_0,_1)_100%)]" : "bg-transparent"} py-2 border border-[#1E1E1E] text-center rounded-2xl hover:bg-[linear-gradient(90deg,_rgba(255,_154,_0,_1)_0%,_rgba(255,_0,_0,_1)_100%)] cursor-pointer`}>
                            {"Semua"}
                        </div>
                        {dataCategory?.map((item) => (
                            <div
                                key={item?.name}
                                onClick={() => setCategorySelected(item)}
                                className={`m-2 ${categorySelected?.name === item?.name ? "bg-[linear-gradient(90deg,_rgba(255,_154,_0,_1)_0%,_rgba(255,_0,_0,_1)_100%)]" : "bg-transparent"} py-2 border border-[#1E1E1E] text-center rounded-2xl hover:bg-[linear-gradient(90deg,_rgba(255,_154,_0,_1)_0%,_rgba(255,_0,_0,_1)_100%)] cursor-pointer`}
                            >
                                {item?.name}
                            </div>
                        ))}
                    </div>
                    <h1 className="my-5">{categorySelected ? `Menu ${categorySelected?.name}` : "Semua Menu"}</h1>
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
                    {statusData === "success" && filteredData?.length === 0 && (
                        <p className="text-center text-gray-600 mt-5">Belum ada data yang ditambahkan.</p>
                    )}
                    {statusData === "success" && filteredData?.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-4">
                            {filteredData?.map((item, index) => (
                                <div key={index} className="bg-[#0F0F0F] rounded-lg shadow-md transform transition-transform">
                                    <img
                                        src={item?.image ? `${import.meta.env.VITE_DB_API_URL_IMAGE}${item?.image}` : Image}
                                        alt={item?.nama}
                                        className="w-full h-32 object-cover mb-2 rounded-t-lg"
                                    />
                                    <h2 className="text-xl px-4 font-semibold text-white">{item?.nama}</h2>
                                    <p className="text-lg px-4 text-white">
                                        {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(
                                            item?.hargaJual
                                        )}
                                    </p>
                                    <p className="text-sm px-4 text-white">Stok: {item?.stok}</p>
                                    <div className="flex justify-around items-center space-x-2 my-4">
                                        <div className="flex items-center justify-around w-2/4">
                                            <button
                                                onClick={() => changeQuantity(item, -1)}
                                                className="text-white w-8 h-8 rounded-full"
                                                disabled={itemQuantities[item?.nama] <= 1}
                                            >
                                                -
                                            </button>
                                            <span className="text-lg">{itemQuantities[item?.nama]}</span>
                                            <button
                                                onClick={() => changeQuantity(item, 1)}
                                                className="text-white w-8 h-8 rounded-full"
                                                disabled={itemQuantities[item?.nama] >= item?.stok}
                                            >
                                                +
                                            </button>
                                        </div>
                                        {cart.find((cartItem) => cartItem.nama === item?.nama) ? (
                                            <button
                                                onClick={() => deleteToCart(item)}
                                                className="bg-[#9a3d3d] text-white px-4 py-2 rounded-lg"
                                            >
                                                Hapus
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => addToCart(item)}
                                                className="bg-[#1E1E1E] text-white px-4 py-2 rounded-lg"
                                            >
                                                Tambah
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                    {countMenuSelected > 0 && (
                        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 bg-[#171717E5] flex items-center justify-between min-w-max max-w-72 sm:max-w-full sm:w-96 md:w-[450px] rounded-2xl px-4 py-3 ">
                            <p className="text-center text-[#676767] mr-2 sm:mr-0 text-base sm:text-xl">
                                <span className="text-[#FF0000] mr-2">{countMenuSelected}</span>
                                Menu Dipilih
                            </p>
                            <button
                                onClick={goToCart} // Navigasi ke halaman konfirmasi
                                className="text-white px-3 sm:px-6 py-1 rounded-full bg-[linear-gradient(90deg,_rgba(255,_154,_0,_0.5)_0%,_rgba(255,_0,_0,_0.5)_100%)] hover:bg-[linear-gradient(90deg,_rgba(255,_154,_0,_1)_0%,_rgba(255,_0,_0,_1)_100%)]"
                            >
                                Checkout
                            </button>
                        </div>
                    )}
                </div>)
                :
                <ConfirmationOrder cart={cart} onClose={() => closeCart()} />
            }
        </>
    );
};

export default Cashier;
