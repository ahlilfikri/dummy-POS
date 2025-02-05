import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "/favicon.ico"
// pages
import Cashier from "./cashier/page/Cashier.jsx";
import OrderHistory from "./cashier/page/OrderHistory.jsx";
import Item from "./logistik/page/Item.jsx";
import Material from "./logistik/page/Material.jsx";
import Category from "./logistik/page/Category.jsx";
import Transaction from "./admin/page/Transaction.jsx";
import User from "./admin/page/User.jsx";
import SalesCart from "./admin/page/SalesCart.jsx";
import OprationalStaff from "./cashier/page/oprationalCashier.jsx";
import OprationalAdmin from "./admin/page/oprationalAdmin.jsx";
import { MdMenu } from "react-icons/md";
import ConfirmationOrder from "./cashier/page/ConfirmationOrder.jsx";
import { FaUserCircle } from "react-icons/fa";
import { motion } from "framer-motion";
import CashierIcon from "/icon/cashier-icon.webp";
import CashierIconActive from "/icon/cashier-icon-active.webp";
import CategoryIcon from "/icon/category-icon.webp";
import CategoryIconActive from "/icon/category-icon-active.webp";
import LogoutIcon from "/icon/logout-icon.webp";
import LogoutIconActive from "/icon/logout-icon-active.webp";
import MaterialIcon from "/icon/material-icon.webp";
import MaterialIconActive from "/icon/material-icon-active.webp";
import PaymentHistoryIcon from "/icon/payment-history-icon.webp";
import PaymentHistoryIconActive from "/icon/payment-history-icon-active.webp";
import TransactionIcon from "/icon/transaction-icon.webp";
import TransactionIconActive from "/icon/transaction-icon-active.webp";
import UserSettingIcon from "/icon/user-setting-icon.webp";
import UserSettingIconActive from "/icon/user-setting-icon-active.webp";
import ConfirmCustom from "./admin/component/ConfirmCustom.jsx"

function App() {
	const navigate = useNavigate();
	const [role, setRole] = useState("");
	const [user, setUser] = useState("");
	const [pathName, setPathName] = useState("admin");
	const [openSidebar, setOpenSidebar] = useState(false);
	const [LogoutStatus, setLogoutStatus] = useState("");
	const [isConfirmOpen, setIsConfirmOpen] = useState(false);

	const checkLogin = async () => {
		const token = localStorage.getItem('token');
		const tokenTime = localStorage.getItem('tokenTime');
		const user = localStorage.getItem('user');

		if (!token) {
			return navigate('/login')
		}
		if (user) {
			const userParse = JSON.parse(user);
			setRole(userParse?.role);
			setUser(userParse?.nama);
		}
		if (tokenTime < new Date()) {
			try {
				const token = localStorage.getItem('token');

				if (!token) {
					throw new Error("Token tidak ditemukan.");
				}

				const response = await fetch(`${import.meta.env.VITE_DB_API_URL}/api/pos/auth/logout`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						'Authorization': `Bearer ${token}`
					}
				});

				const data = await response.json();

				if (!response.ok) {
					throw new Error(data.message || "Gagal logout.");
				}

				// Hapus token setelah request sukses
				localStorage.removeItem('user');
				localStorage.removeItem('token');
				// hapus keseluruhan local storage
				localStorage.clear();
				setLogoutStatus("success");
				navigate('/login');
			} catch (err) {
				console.error("Logout Error:", err.message);
				if (err.message === "Token tidak valid atau telah kedaluwarsa.") {
					localStorage.removeItem('user');
					localStorage.removeItem('token');
					return navigate('/login');
				}
				setLogoutStatus("error");
			}
		}
	};

	const handleLogout = async () => {
		setLogoutStatus("loading");
		try {
			const token = localStorage.getItem('token');

			if (!token) {
				throw new Error("Token tidak ditemukan.");
			}

			const response = await fetch(`${import.meta.env.VITE_DB_API_URL}/api/pos/auth/logout`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${token}`
				}
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.message || "Gagal logout.");
			}

			// Hapus token setelah request sukses
			localStorage.removeItem('user');
			localStorage.removeItem('token');
			localStorage.clear();


			setLogoutStatus("success");
			navigate('/login');
		} catch (err) {
			console.error("Logout Error:", err.message);
			if (err.message === "Token tidak valid atau telah kedaluwarsa." || err.message === "Token tidak valid.") {
				localStorage.removeItem('user');
				localStorage.removeItem('token');
				return navigate('/login');
			}
			setLogoutStatus("error");
		}
	};

	useEffect(() => {
		checkLogin();
		const path = window.location.pathname;
		setPathName(path);
	}, [window.location.pathname]);

	return (
		<div className="min-h-screen bg-[#080808] text-white ">
			{/* Main Content */}
			<div className="flex items-center">
				{/* sidebar */}
				{!openSidebar &&
					<div className="w-full px-2 sm:px-4 md:px-12 fixed top-0 py-3 z-10 flex items-center justify-between bg-[#080808] bg-opacity-90 border-b border-white">
						<div className="rounded-full p-2 bg-[#0F0F0F] cursor-pointer">
							<MdMenu className="text-2xl " onClick={() => setOpenSidebar(!openSidebar)} />
						</div>
						<div className="flex items-center w-max rounded-full px-2 sm:px-4 py-2 bg-black">
							<FaUserCircle className="text-xl sm:text-4xl" />
							<div className="ml-2">
								<p className="text-sm sm:text-base">
									{user?.toLocaleUpperCase()}
								</p>
								<p className="text-xs text-[#676767]">
									{role}
								</p>
							</div>
						</div>
					</div>
				}
				{/* Sidebar Animation */}
				{openSidebar && (
					<motion.div
						className="custom-scroll bg-[#0F0F0FE5] px-4 sm:px-10 w-52 sm:w-60 h-screen fixed top-0 z-30 left-0 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-100"
						initial={{ x: -250 }}
						animate={{ x: 0 }}
						exit={{ x: -250 }}
						transition={{ type: "spring", stiffness: 300 }}
					>
						<div className="flex items-center justify-between mt-8">
							<img className="w-20 absolute" src={Logo} alt="Logo" />
							<p>POS RAN</p>
							<MdMenu className="text-2xl cursor-pointer" onClick={() => setOpenSidebar(!openSidebar)} />
						</div>
						{/* Pengecekan role user untuk menampilkan sub menu */}
						{(role === 'cashier' || role === "admin" || role === "manager") && (
							<div
								className={`w-full flex items-center cursor-pointer hover:bg-[#777777] rounded-2xl px-1 pl-3 py-1 my-5`}
								onClick={() => { setOpenSidebar(false), navigate("/cashier"); }}
							>
								{(location.pathname === "/cashier" || location.pathname === "/") ?
									<img src={CashierIconActive} alt="" />
									:
									<img src={CashierIcon} alt="Logo" />
								}
								<p className={`ml-2 text-[10px] sm:text-base ${(location.pathname === "/cashier" || location.pathname === "/") ? "text-white" : "text-[#505050]"}`}>
									Kasir
								</p>
							</div>
						)}
						{(role === 'cashier' || role === "admin" || role === "manager") && (
							<div
								className={`w-full flex items-center cursor-pointer hover:bg-[#777777] rounded-2xl px-1 pl-3 py-1 my-5 ${location.pathname === "/order-history" ? "text-white" : "text-[#505050]"}`}
								onClick={() => { setOpenSidebar(false), navigate("/order-history"); }}
							>
								{(location.pathname === "/order-history") ?
									<img src={PaymentHistoryIconActive} alt="" />
									:
									<img src={PaymentHistoryIcon} alt="Logo" />
								}
								<p className={`ml-2 text-[10px] sm:text-base ${location.pathname === "/order-history" ? "text-white" : "text-[#505050]"}`}>
									History Pesanan
								</p>
							</div>
						)}
						{(role === 'logistik' || role === 'manager' || role === 'admin') && (
							<div
								className={`w-full flex items-center cursor-pointer hover:bg-[#777777] rounded-2xl px-1 pl-3 py-1 my-5 ${location.pathname === "/item" ? "text-white" : "text-[#505050]"}`}
								onClick={() => { setOpenSidebar(false), navigate("/item") }
								}>
								{(location.pathname === "/item") ?
									<img src={MaterialIconActive} alt="" />
									:
									<img src={MaterialIcon} alt="" />
								}
								<p className={`ml-2 text-[10px] sm:text-base ${location.pathname === "/item" ? "text-white" : "text-[#505050]"}`}>
									Menu
								</p>
							</div>
						)}
						{(role === 'logistik' || role === 'manager' || role === 'admin') && (
							<div
								className={`w-full flex items-center cursor-pointer hover:bg-[#777777] rounded-2xl px-1 pl-3 py-1 my-5 ${location.pathname === "/material" ? "text-white" : "text-[#505050]"}`}
								onClick={() => { setOpenSidebar(false), navigate("/material") }
								}>
								{(location.pathname === "/material") ?
									<img src={MaterialIconActive} alt="" />
									:
									<img src={MaterialIcon} alt="" />
								}
								<p className={`ml-2 text-[10px] sm:text-base ${location.pathname === "/material" ? "text-white" : "text-[#505050]"}`}>
									Bahan Baku
								</p>
							</div>
						)}
						{(role === 'logistik' || role === 'manager' || role === 'admin') && (
							<div
								className={`w-full flex items-center cursor-pointer hover:bg-[#777777] rounded-2xl px-1 pl-3 py-1 my-5 ${location.pathname === "/category" ? "text-white" : "text-[#505050]"}`}
								onClick={() => { setOpenSidebar(false), navigate("/category") }
								}>
								{(location.pathname === "/category") ?
									<img src={CategoryIconActive} alt="" />
									:
									<img src={CategoryIcon} alt="" />
								}
								<p className={`ml-2 text-[10px] sm:text-base ${location.pathname === "/category" ? "text-white" : "text-[#505050]"}`}>
									Kategori
								</p>
							</div>
						)}
						{(role === 'admin' || role === "manager") && (
							<div
								className={`w-full flex items-center cursor-pointer hover:bg-[#777777] rounded-2xl px-1 pl-3 py-1 my-5 ${location.pathname === "/transaction" ? "text-white" : "text-[#505050]"}`}
								onClick={() => { setOpenSidebar(false), navigate("/transaction") }
								}>
								{(location.pathname === "/transaction") ?
									<img src={TransactionIconActive} alt="" />
									:
									<img src={TransactionIcon} alt="" />
								}
								<p className={`ml-2 text-[10px] sm:text-base ${location.pathname === "/transaction" ? "text-white" : "text-[#505050]"}`}>
									Transaksi
								</p>
							</div>
						)}
						{(role === 'manager' || role === 'admin') && (
							<div
								className={`w-full flex items-center cursor-pointer hover:bg-[#777777] rounded-2xl px-1 pl-3 py-1 my-5 ${location.pathname === "/user" ? "text-white" : "text-[#505050]"}`}
								onClick={() => { setOpenSidebar(false), navigate("/user-setting"); }}
							>
								{(location.pathname === "/user-setting") ?
									<img src={UserSettingIconActive} alt="" />
									:
									<img src={UserSettingIcon} alt="" />
								}
								<p className={`ml-2 text-[10px] sm:text-base ${location.pathname === "/user-setting" ? "text-white" : "text-[#505050]"}`}>
									Manajemen Karyawan
								</p>
							</div>
						)}
						{(role === 'manager' || role === 'admin') && (
							<div
								className={`w-full flex items-center cursor-pointer hover:bg-[#777777] rounded-2xl px-1 pl-3 py-1 my-5 ${location.pathname === "/sales" ? "text-white" : "text-[#505050]"}`}
								onClick={() => { setOpenSidebar(false), navigate("/sales") }
								}>
								{(location.pathname === "/sales") ?
									<img src={UserSettingIconActive} alt="" />
									:
									<img src={UserSettingIcon} alt="" />
								}
								<p className={`ml-2 text-[10px] sm:text-base ${location.pathname === "/sales" ? "text-white" : "text-[#505050]"}`}>
									Grafik
								</p>
							</div>
						)}
						{(role === 'manager' || role === 'admin') && (
							<div
								className={`w-full flex items-center cursor-pointer hover:bg-[#777777] rounded-2xl px-1 pl-3 py-1 my-5 ${location.pathname === "/sales" ? "text-white" : "text-[#505050]"}`}
								onClick={() => { setOpenSidebar(false), navigate("/oprational-admin"); }}
							>
								{(location.pathname === "/oprational-admin") ?
									<img src={UserSettingIconActive} alt="" />
									:
									<img src={UserSettingIcon} alt="" />
								}
								<p className={`ml-2 text-[10px] sm:text-base ${location.pathname === "/oprational-admin" ? "text-white" : "text-[#505050]"}`}>
									Oprasional
								</p>
							</div>
						)}
						{/* oprational */}
						{(role === 'cashier' || role === 'logistik') && (
							<div
								className={`w-full flex items-center cursor-pointer hover:bg-[#777777] rounded-2xl px-1 pl-3 py-1 my-5 ${location.pathname === "/oprational" ? "text-white" : "text-[#505050]"}`}
								onClick={() => { setOpenSidebar(false), navigate("/oprational-staff"); }}
							>
								{(location.pathname === "/oprational-staff") ?
									<img src={UserSettingIconActive} alt="" />
									:
									<img src={UserSettingIcon} alt="" />
								}
								<p className={`ml-2 text-[10px] sm:text-base ${location.pathname === "/oprational" ? "text-white" : "text-[#505050]"}`}>
									Oprasional
								</p>
							</div>
						)}
						{/* Logout */}
						<div
							className={`w-full flex items-center cursor-pointer hover:bg-[#777777] rounded-2xl px-1 pl-3 py-1 my-5 ${location.pathname === "/user" ? "text-white" : "text-[#505050]"}`}
						>
							{(LogoutStatus === "loading") ?
								<img src={LogoutIconActive} alt="" />
								:
								<img src={LogoutIcon} alt="" />
							}
							<p onClick={() => setIsConfirmOpen(true)} className={`ml-2 text-[10px] sm:text-base  ${LogoutStatus === "loading" ? "text-white" : "text-[#505050]"}`}>
								Logout
							</p>
						</div>
					</motion.div>
				)}

				{/* Child content */}
				<div className="w-full px-2 sm:px-4 md:px-12 overflow-y-hidden">
					{/* Jika logout masih loading, tampilkan loader atau kosong */}
					{LogoutStatus === "loading" ? (
						<div className="flex justify-center items-center min-h-screen">
							<div className=" ">
								<div className="animate-spin border-t-2 border-[#FF0000] border-solid rounded-full w-16 h-16"></div>
								<p className="text-center mt-4">Loading</p>
							</div>
						</div>) : (
						<>
							{/* Cashier */}
							{(role === 'admin' || role === 'manager' || role === 'cashier') && pathName === "/" && <Cashier />}
							{(role === 'admin' || role === 'logistic') && pathName === "/" && <Item />}

							{/* Halaman spesifik */}
							{pathName === "/cashier" && <Cashier openSidebar={openSidebar} />}
							{pathName === "/order-history" && <OrderHistory openSidebar={openSidebar} />}
							{pathName === "/confirmation-order" && <ConfirmationOrder openSidebar={openSidebar} />}

							{/* Logistic */}
							{pathName === "/item" && <Item openSidebar={openSidebar} />}
							{pathName === "/material" && <Material openSidebar={openSidebar} />}
							{pathName === "/category" && <Category openSidebar={openSidebar} />}

							{/* Admin */}
							{pathName === "/transaction" && <Transaction openSidebar={openSidebar} />}
							{pathName === "/user-setting" && <User openSidebar={openSidebar} />}
							{pathName === "/sales" && <SalesCart openSidebar={openSidebar} />}

							{/* Logistic and cashier */}
							{pathName === "/oprational-staff" && <OprationalStaff openSidebar={openSidebar} />}
							{pathName === "/oprational-admin" && <OprationalAdmin openSidebar={openSidebar} />}



						</>
					)}
				</div>
			</div>

			<ConfirmCustom
				isOpen={isConfirmOpen}
				onClose={() => setIsConfirmOpen(false)}
				onConfirm={() => handleLogout()}
				title="Konfirmasi Keluar Aplikasi"
				name={""}
				message="Apakah Anda yakin ingin keluar"
			/>

			{/* Footer */}
			{/* <footer className="bg-gray-800 py-4 mt-auto">
				<div className="container text-center text-orange-400 text-sm">
					© 2025 POS RAN - All Rights Reserved
				</div>
			</footer> */}
		</div >
	);
}

export default App;
