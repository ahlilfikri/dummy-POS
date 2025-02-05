// import { useState } from "react";

// function Receipt() {
//   const [printer, setPrinter] = useState(null);
//   const [isConnected, setIsConnected] = useState(false);

//   // Fungsi untuk menghubungkan ke printer BLE
//   const connectToPrinter = async () => {
//     try {
//       console.log("🔍 Mencari printer Bluetooth...");

//       const device = await navigator.bluetooth.requestDevice({ // ini berfungsi untuk meminta akses ke bluetooth
//         acceptAllDevices: true,
//         optionalServices: ["000018f0-0000-1000-8000-00805f9b34fb"], // UUID Printer ESC/POS (Ganti jika beda)
//       });

//       console.log("✅ Printer ditemukan:", device.name);

//       const server = await device.gatt.connect(); // ini berfungsi untuk menghubungkan ke printer
//       console.log("✅ Terhubung ke GATT server");
//       console.log(server)
//       console.log("-----------------------------");

//       const service = await server.getPrimaryService("000018f0-0000-1000-8000-00805f9b34fb"); // ini berfungsi untuk mendapatkan layanan printer
//       console.log("✅ Layanan ESC/POS ditemukan");
//       console.log(service)
//       console.log("-----------------------------");

//       const characteristic = await service.getCharacteristic("00002af1-0000-1000-8000-00805f9b34fb");
//       console.log("✅ Karakteristik ESC/POS ditemukan");
//       console.log(characteristic)
//       console.log("-----------------------------");

//       setPrinter(characteristic);
//       setIsConnected(true);
//     } catch (error) {
//       console.error("❌ Gagal menghubungkan ke printer:", error);
//       alert("Gagal menghubungkan ke printer!");
//     }
//   };

//   // Fungsi untuk mencetak struk ke printer BLE
//   const printReceipt = async () => {
//     if (!printer) {
//       alert("Printer belum terhubung!");
//       return;
//     }

//     const encoder = new TextEncoder();

//     // Format ESC/POS untuk mencetak struk
//     const receiptData = `
//       NOROYONO STORE\n
//       ==========================\n
//       Perangkat: Bluetooth Printer\n
//       Status: Terhubung\n
//       Tanggal: ${new Date().toLocaleString()}\n
//       ==========================\n
//       Terima kasih atas kunjungan Anda!\n\n\n\n
//     `;

//     try {
//       await printer.writeValue(encoder.encode(receiptData));
//       console.log("✅ Struk berhasil dikirim ke printer!");
//     } catch (error) {
//       console.error("❌ Gagal mencetak struk:", error);
//       alert("Gagal mencetak struk!");
//     }
//   };

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
//       <h1 className="text-2xl font-bold mb-4">Hubungkan Printer BLE</h1>

//       <button
//         onClick={connectToPrinter}
//         className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition"
//       >
//         Hubungkan Printer
//       </button>

//       <div className="mt-4 text-lg">
//         {isConnected ? (
//           <>
//             <p className="text-green-600 font-semibold">
//               Terhubung ke Printer!
//             </p>
//             <button
//               onClick={printReceipt}
//               className="mt-4 bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600 transition"
//             >
//               Cetak Struk
//             </button>
//           </>
//         ) : (
//           <p className="text-red-600">Status: Belum terhubung</p>
//         )}
//       </div>
//     </div>
//   );
// }

// export default Receipt;




// import { useState, useEffect } from "react";

// function Receipt() {
//   const [printer, setPrinter] = useState(null);
//   const [isConnected, setIsConnected] = useState(false);
//   const [device, setDevice] = useState(null);

//   useEffect(() => {
//     const savedPrinterId = localStorage.getItem("savedPrinter");
//     if (savedPrinterId) {
//       console.log("🔍 Printer sebelumnya ditemukan di localStorage");
//     }
//   }, []);

//   const connectToPrinter = async () => {
//     try {
//       console.log("🔍 Mencari printer Bluetooth...");

//       const selectedDevice = await navigator.bluetooth.requestDevice({
//         filters: [{ services: ["000018f0-0000-1000-8000-00805f9b34fb"] }],
//         optionalServices: ["000018f0-0000-1000-8000-00805f9b34fb"],
//       });

//       console.log("✅ Printer ditemukan:", selectedDevice.name);

//       localStorage.setItem("savedPrinter", selectedDevice.id);
//       setDevice(selectedDevice);

//       await setupPrinter(selectedDevice);
//     } catch (error) {
//       console.error("❌ Gagal menghubungkan ke printer:", error);
//       alert("Gagal menghubungkan ke printer!");
//     }
//   };

//   const reconnectPrinter = async () => {
//     try {
//       const savedPrinterId = localStorage.getItem("savedPrinter");
//       if (!savedPrinterId) return;

//       console.log("🔄 Mencoba reconnect ke printer...");

//       const selectedDevice = await navigator.bluetooth.requestDevice({
//         acceptAllDevices: true,
//         optionalServices: ["000018f0-0000-1000-8000-00805f9b34fb"],
//       });

//       if (!selectedDevice) {
//         console.log("❌ Printer sebelumnya tidak ditemukan di daftar perangkat.");
//         return;
//       }

//       console.log("✅ Printer ditemukan:", selectedDevice.name);
//       await setupPrinter(selectedDevice);
//     } catch (error) {
//       console.error("❌ Gagal reconnect ke printer:", error);
//       alert("Gagal reconnect ke printer! Harus pilih ulang.");
//     }
//   };

//   const setupPrinter = async (selectedDevice) => {
//     try {
//       if (!selectedDevice.gatt) {
//         throw new Error("Unsupported device: Perangkat tidak mendukung GATT.");
//       }

//       const server = await selectedDevice.gatt.connect();
//       console.log("✅ Terhubung ke GATT server");

//       const service = await server.getPrimaryService("000018f0-0000-1000-8000-00805f9b34fb");
//       console.log("✅ Layanan ESC/POS ditemukan");

//       const characteristic = await service.getCharacteristic("00002af1-0000-1000-8000-00805f9b34fb");
//       console.log("✅ Karakteristik ESC/POS ditemukan");

//       setPrinter(characteristic);
//       setIsConnected(true);

//       // 🔄 **Tambahkan event listener jika printer disconnect**
//       selectedDevice.addEventListener("gattserverdisconnected", () => {
//         console.log("⚠️ Printer terputus, mencoba reconnect...");
//         setIsConnected(false);
//         alert("Printer terputus! Silakan hubungkan ulang.");
//       });
//     } catch (error) {
//       console.error("❌ Gagal setup printer:", error);
//       alert("Gagal setup printer! Pastikan Bluetooth aktif dan printer menyala.");
//     }
//   };

//   const printReceipt = async () => {
//     if (!printer) {
//       alert("Printer belum terhubung!");
//       return;
//     }

//     const encoder = new TextEncoder();
//     const receiptData = `
//       NOROYONO STORE\n
//       ==========================\n
//       Perangkat: Bluetooth Printer\n
//       Status: Terhubung\n
//       Tanggal: ${new Date().toLocaleString()}\n
//       ==========================\n
//       Terima kasih atas kunjungan Anda!\n\n\n\n
//     `;

//     try {
//       await printer.writeValue(encoder.encode(receiptData));
//       console.log("✅ Struk berhasil dikirim ke printer!");
//     } catch (error) {
//       console.error("❌ Gagal mencetak struk:", error);
//       alert("Gagal mencetak struk!");
//     }
//   };

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
//       <h1 className="text-2xl font-bold mb-4">Hubungkan Printer BLE</h1>

//       <button
//         onClick={connectToPrinter}
//         className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition"
//       >
//         Hubungkan Printer
//       </button>

//       <button
//         onClick={reconnectPrinter}
//         className="mt-4 bg-yellow-500 text-white px-6 py-2 rounded-md hover:bg-yellow-600 transition"
//       >
//         Reconnect Printer
//       </button>

//       <div className="mt-4 text-lg">
//         {isConnected ? (
//           <>
//             <p className="text-green-600 font-semibold">
//               Terhubung ke Printer: {device?.name}
//             </p>
//             <button
//               onClick={printReceipt}
//               className="mt-4 bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600 transition"
//             >
//               Cetak Struk
//             </button>
//           </>
//         ) : (
//           <p className="text-red-600">Status: Belum terhubung</p>
//         )}
//       </div>
//     </div>
//   );
// }

// export default Receipt;



// import { useState, useEffect } from "react";

// function Receipt() {
//   const [printer, setPrinter] = useState(null);
//   const [isConnected, setIsConnected] = useState(false);
//   const [device, setDevice] = useState(null);
//   const [savedPrinter, setSavedPrinter] = useState(null);

//   useEffect(() => {
//     const savedPrinterId = localStorage.getItem("savedPrinter");
//     if (savedPrinterId) {
//       setSavedPrinter(savedPrinterId);
//     }
//   }, []);

//   const handleButtonClick = async () => {
//     if (isConnected) {
//       printReceipt();
//     } else if (savedPrinter) {
//       reconnectPrinter();
//     } else {
//       connectToPrinter();
//     }
//   };

//   const connectToPrinter = async () => {
//     try {

//       const selectedDevice = await navigator.bluetooth.requestDevice({
//         filters: [{ services: ["000018f0-0000-1000-8000-00805f9b34fb"] }],
//         optionalServices: ["000018f0-0000-1000-8000-00805f9b34fb"],
//       });


//       localStorage.setItem("savedPrinter", selectedDevice.id);
//       setSavedPrinter(selectedDevice.id);
//       setDevice(selectedDevice);

//       await setupPrinter(selectedDevice);
//     } catch (error) {
//       console.error("❌ Gagal menghubungkan ke printer:", error);
//       alert("Gagal menghubungkan ke printer!");
//     }
//   };

//   const reconnectPrinter = async () => {
//     try {
//       if (!savedPrinter) return;


//       const selectedDevice = await navigator.bluetooth.requestDevice({
//         acceptAllDevices: true,
//         optionalServices: ["000018f0-0000-1000-8000-00805f9b34fb"],
//       });

//       if (!selectedDevice) {
//         return;
//       }

//       await setupPrinter(selectedDevice);
//     } catch (error) {
//       console.error("❌ Gagal reconnect ke printer:", error);
//       alert("Gagal reconnect ke printer! Harus pilih ulang.");
//     }
//   };

//   const setupPrinter = async (selectedDevice) => {
//     try {
//       if (!selectedDevice.gatt) {
//         throw new Error("Unsupported device: Perangkat tidak mendukung GATT.");
//       }

//       const server = await selectedDevice.gatt.connect();

//       const service = await server.getPrimaryService("000018f0-0000-1000-8000-00805f9b34fb");

//       const characteristic = await service.getCharacteristic("00002af1-0000-1000-8000-00805f9b34fb");

//       setPrinter(characteristic);
//       setIsConnected(true);

//       // 🔄 **Tambahkan event listener jika printer disconnect**
//       selectedDevice.addEventListener("gattserverdisconnected", () => {
//         setIsConnected(false);
//         alert("Printer terputus! Silakan hubungkan ulang.");
//       });
//     } catch (error) {
//       console.error("❌ Gagal setup printer:", error);
//       alert("Gagal setup printer! Pastikan Bluetooth aktif dan printer menyala.");
//     }
//   };

//   const printReceipt = async () => {
//     if (!printer) {
//       alert("Printer belum terhubung!");
//       return;
//     }

//     const encoder = new TextEncoder();
//     const receiptData = `
//       NOROYONO STORE\n
//       ==========================\n
//       Perangkat: Bluetooth Printer\n
//       Status: Terhubung\n
//       Tanggal: ${new Date().toLocaleString()}\n
//       ==========================\n
//       Terima kasih atas kunjungan Anda!\n\n\n\n
//     `;

//     try {
//       await printer.writeValue(encoder.encode(receiptData));
//     } catch (error) {
//       console.error("❌ Gagal mencetak struk:", error);
//       alert("Gagal mencetak struk!");
//     }
//   };

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
//       <h1 className="text-2xl font-bold mb-4">Printer BLE</h1>

//       <button
//         onClick={handleButtonClick}
//         className={`px-6 py-2 rounded-md transition text-white ${isConnected
//           ? "bg-green-500 hover:bg-green-600"
//           : savedPrinter
//             ? "bg-yellow-500 hover:bg-yellow-600"
//             : "bg-blue-500 hover:bg-blue-600"
//           }`}
//       >
//         {isConnected ? "Cetak Struk" : savedPrinter ? "Reconnect Printer" : "Hubungkan Printer"}
//       </button>

//       <div className="mt-4 text-lg">
//         {isConnected ? (
//           <p className="text-green-600 font-semibold">
//             Terhubung ke Printer: {device?.name}
//           </p>
//         ) : (
//           <p className="text-red-600">Status: Belum terhubung</p>
//         )}
//       </div>
//     </div>
//   );
// }

// export default Receipt;



// import { useState, useEffect } from "react";

// function Receipt() {
//   const [printer, setPrinter] = useState(null);
//   const [isConnected, setIsConnected] = useState(false);
//   const [device, setDevice] = useState(null);
//   const [savedPrinter, setSavedPrinter] = useState(null);

//   useEffect(() => {
//     const savedPrinterId = localStorage.getItem("savedPrinter");
//     if (savedPrinterId) {
//       setSavedPrinter(savedPrinterId);
//       console.log("🔍 Printer sebelumnya ditemukan di localStorage, menunggu Bluetooth...");

//       // Coba reconnect setelah delay 3 detik biar Bluetooth siap
//       setTimeout(reconnectPrinter, 3000);
//     }
//   }, []);

//   const handleButtonClick = async () => {
//     if (isConnected) {
//       printReceipt();
//     } else if (savedPrinter) {
//       reconnectPrinter();
//     } else {
//       connectToPrinter();
//     }
//   };

//   const connectToPrinter = async () => {
//     try {
//       console.log("🔍 Mencari printer Bluetooth...");

//       const selectedDevice = await navigator.bluetooth.requestDevice({
//         acceptAllDevices: true,
//         optionalServices: ["000018f0-0000-1000-8000-00805f9b34fb"], // ESC/POS service UUID
//       });

//       console.log("✅ Printer ditemukan:", selectedDevice.name);

//       localStorage.setItem("savedPrinter", selectedDevice.id);
//       setSavedPrinter(selectedDevice.id);
//       setDevice(selectedDevice);

//       await setupPrinter(selectedDevice);
//     } catch (error) {
//       console.error("❌ Gagal menghubungkan ke printer:", error);
//       alert("Gagal menghubungkan ke printer!");
//     }
//   };

//   const reconnectPrinter = async () => {
//     try {
//       if (!savedPrinter) return;

//       console.log("🔄 Mencoba reconnect ke printer...");

//       // Langsung cari perangkat yang sebelumnya tersimpan
//       const selectedDevice = await navigator.bluetooth.requestDevice({
//         filters: [{ services: ["000018f0-0000-1000-8000-00805f9b34fb"] }],
//         optionalServices: ["000018f0-0000-1000-8000-00805f9b34fb"],
//       });

//       if (!selectedDevice) {
//         console.log("❌ Printer sebelumnya tidak ditemukan.");
//         alert("Printer tidak ditemukan, mohon pilih ulang.");
//         return;
//       }

//       console.log("✅ Printer ditemukan:", selectedDevice.name);
//       await setupPrinter(selectedDevice);
//     } catch (error) {
//       console.error("❌ Gagal reconnect ke printer:", error);
//       alert("Gagal reconnect ke printer! Harus pilih ulang.");
//     }
//   };

//   const setupPrinter = async (selectedDevice) => {
//     try {
//       if (!selectedDevice.gatt) {
//         throw new Error("Unsupported device: Perangkat tidak mendukung GATT.");
//       }

//       const server = await selectedDevice.gatt.connect();
//       console.log("✅ Terhubung ke GATT server");

//       const service = await server.getPrimaryService("000018f0-0000-1000-8000-00805f9b34fb");
//       console.log("✅ Layanan ESC/POS ditemukan");

//       const characteristic = await service.getCharacteristic("00002af1-0000-1000-8000-00805f9b34fb");
//       console.log("✅ Karakteristik ESC/POS ditemukan");

//       setPrinter(characteristic);
//       setIsConnected(true);

//       selectedDevice.addEventListener("gattserverdisconnected", async () => {
//         console.log("⚠️ Printer terputus, mencoba auto-reconnect...");
//         setIsConnected(false);

//         // Tunggu 3 detik sebelum coba reconnect
//         setTimeout(reconnectPrinter, 3000);
//       });
//     } catch (error) {
//       console.error("❌ Gagal setup printer:", error);
//       alert("Gagal setup printer! Pastikan Bluetooth aktif dan printer menyala.");
//     }
//   };

//   const printReceipt = async () => {
//     if (!printer) {
//       alert("Printer belum terhubung!");
//       return;
//     }

//     const encoder = new TextEncoder();
//     const receiptData = `
//       NOROYONO STORE\n
//       ==========================\n
//       Perangkat: Bluetooth Printer\n
//       Status: Terhubung\n
//       Tanggal: ${new Date().toLocaleString()}\n
//       ==========================\n
//       Terima kasih atas kunjungan Anda!\n\n\n\n
//     `;

//     try {
//       await printer.writeValue(encoder.encode(receiptData));
//       console.log("✅ Struk berhasil dikirim ke printer!");
//     } catch (error) {
//       console.error("❌ Gagal mencetak struk:", error);
//       alert("Gagal mencetak struk!");
//     }
//   };

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
//       <h1 className="text-2xl font-bold mb-4">Printer BLE</h1>

//       <button
//         onClick={handleButtonClick}
//         className={`px-6 py-2 rounded-md transition text-white ${isConnected
//           ? "bg-green-500 hover:bg-green-600"
//           : savedPrinter
//             ? "bg-yellow-500 hover:bg-yellow-600"
//             : "bg-blue-500 hover:bg-blue-600"
//           }`}
//       >
//         {isConnected ? "Cetak Struk" : savedPrinter ? "Reconnect Printer" : "Hubungkan Printer"}
//       </button>

//       <div className="mt-4 text-lg">
//         {isConnected ? (
//           <p className="text-green-600 font-semibold">
//             Terhubung ke Printer: {device?.name}
//           </p>
//         ) : (
//           <p className="text-red-600">Status: Belum terhubung</p>
//         )}
//       </div>
//     </div>
//   );
// }

// export default Receipt;



// import { useState, useEffect } from "react";

// function Receipt() {
//   const [printer, setPrinter] = useState(null);
//   const [isConnected, setIsConnected] = useState(false);
//   const [device, setDevice] = useState(null);
//   const [savedPrinter, setSavedPrinter] = useState(null);
//   const [printerName, setPrinterName] = useState(null); // Simpan nama printer

//   useEffect(() => {
//     const savedPrinterId = localStorage.getItem("savedPrinter");
//     const savedPrinterName = localStorage.getItem("savedPrinterName"); // Ambil nama printer dari localStorage

//     if (savedPrinterId) {
//       setSavedPrinter(savedPrinterId);
//       if (savedPrinterName) {
//         setPrinterName(savedPrinterName);
//       }

//       // Coba reconnect setelah delay 3 detik biar Bluetooth siap
//       setTimeout(reconnectPrinter, 3000);
//     }
//   }, []);

//   const handleButtonClick = async () => {
//     if (isConnected) {
//       printReceipt();
//     } else if (savedPrinter) {
//       reconnectPrinter();
//     } else {
//       connectToPrinter();
//     }
//   };

//   const connectToPrinter = async () => {
//     try {

//       const selectedDevice = await navigator.bluetooth.requestDevice({
//         acceptAllDevices: true,
//         optionalServices: ["000018f0-0000-1000-8000-00805f9b34fb"], // ESC/POS service UUID
//       });


//       localStorage.setItem("savedPrinter", selectedDevice.id);
//       localStorage.setItem("savedPrinterName", selectedDevice.name); // Simpan nama printer
//       setSavedPrinter(selectedDevice.id);
//       setPrinterName(selectedDevice.name); // Simpan di state juga
//       setDevice(selectedDevice);

//       await setupPrinter(selectedDevice);
//     } catch (error) {
//       console.error("❌ Gagal menghubungkan ke printer:", error);
//       alert("Gagal menghubungkan ke printer!");
//     }
//   };

//   const reconnectPrinter = async () => {
//     try {
//       if (!savedPrinter) return;


//       // Langsung cari perangkat yang sebelumnya tersimpan
//       const selectedDevice = await navigator.bluetooth.requestDevice({
//         filters: [{ services: ["000018f0-0000-1000-8000-00805f9b34fb"] }],
//         optionalServices: ["000018f0-0000-1000-8000-00805f9b34fb"],
//       });

//       if (!selectedDevice) {

//         alert("Printer tidak ditemukan, mohon pilih ulang.");
//         return;
//       }

//       await setupPrinter(selectedDevice);
//     } catch (error) {
//       console.error("❌ Gagal reconnect ke printer:", error);
//       alert("Gagal reconnect ke printer! Harus pilih ulang.");
//     }
//   };

//   const setupPrinter = async (selectedDevice) => {
//     try {
//       if (!selectedDevice.gatt) {
//         throw new Error("Unsupported device: Perangkat tidak mendukung GATT.");
//       }

//       const server = await selectedDevice.gatt.connect();

//       const service = await server.getPrimaryService("000018f0-0000-1000-8000-00805f9b34fb");

//       const characteristic = await service.getCharacteristic("00002af1-0000-1000-8000-00805f9b34fb");

//       setPrinter(characteristic);
//       setIsConnected(true);

//       selectedDevice.addEventListener("gattserverdisconnected", async () => {

//         setIsConnected(false);
//         setTimeout(reconnectPrinter, 3000);
//       });
//     } catch (error) {
//       console.error("❌ Gagal setup printer:", error);
//       alert("Gagal setup printer! Pastikan Bluetooth aktif dan printer menyala.");
//     }
//   };

//   const printReceipt = async () => {
//     if (!printer) {
//       alert("Printer belum terhubung!");
//       return;
//     }

//     const encoder = new TextEncoder();
//     const receiptData = `
//       ${printerName || "NOROYONO STORE"}\n
//       ==========================\n
//       Perangkat: Bluetooth Printer\n
//       Status: Terhubung\n
//       Tanggal: ${new Date().toLocaleString()}\n
//       ==========================\n
//       Terima kasih atas kunjungan Anda!\n\n\n\n
//     `;

//     try {
//       await printer.writeValue(encoder.encode(receiptData));
//     } catch (error) {
//       console.error("❌ Gagal mencetak struk:", error);
//       alert("Gagal mencetak struk!");
//     }
//   };

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
//       <h1 className="text-2xl font-bold mb-4">Printer BLE</h1>

//       <button
//         onClick={handleButtonClick}
//         className={`px-6 py-2 rounded-md transition text-white ${isConnected
//           ? "bg-green-500 hover:bg-green-600"
//           : savedPrinter
//             ? "bg-yellow-500 hover:bg-yellow-600"
//             : "bg-blue-500 hover:bg-blue-600"
//           }`}
//       >
//         {isConnected ? "Cetak Struk" : savedPrinter ? "Reconnect Printer" : "Hubungkan Printer"}
//       </button>

//       <div className="mt-4 text-lg">
//         {isConnected ? (
//           <p className="text-green-600 font-semibold">
//             Terhubung ke Printer: {printerName || "Unknown Printer"}
//           </p>
//         ) : savedPrinter ? (
//           <p className="text-yellow-600">
//             Printer Tersimpan: {printerName || "Unknown Printer"} (Belum Terhubung)
//           </p>
//         ) : (
//           <p className="text-red-600">Status: Belum terhubung</p>
//         )}
//       </div>
//     </div>
//   );
// }

import { useState, useEffect } from "react";

function Receipt() {
  const [printer, setPrinter] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [device, setDevice] = useState(null);
  const [savedPrinter, setSavedPrinter] = useState(null);
  const [printerName, setPrinterName] = useState(null);

  useEffect(() => {
    const savedPrinterId = localStorage.getItem("savedPrinter");
    const savedPrinterName = localStorage.getItem("savedPrinterName");

    if (savedPrinterId) {
      setSavedPrinter(savedPrinterId);
      setPrinterName(savedPrinterName || "Unknown Printer");
    }
  }, []);

  const handleButtonClick = async () => {
    if (isConnected) {
      printReceipt();
    } else if (savedPrinter) {
      const confirmReconnect = window.confirm("Do you want to reconnect to the saved printer?");
      if (confirmReconnect) {
        reconnectPrinter();
      }
    } else {
      connectToPrinter();
    }
  };

  const connectToPrinter = async () => {
    try {
      const selectedDevice = await navigator.bluetooth.requestDevice({
        acceptAllDevices: true,
        optionalServices: ["000018f0-0000-1000-8000-00805f9b34fb"],
      });

      localStorage.setItem("savedPrinter", selectedDevice.id);
      localStorage.setItem("savedPrinterName", selectedDevice.name);
      setSavedPrinter(selectedDevice.id);
      setPrinterName(selectedDevice.name);
      setDevice(selectedDevice);

      await setupPrinter(selectedDevice);
    } catch (error) {
      console.error("❌ Failed to connect to printer:", error);
      alert("Failed to connect to printer!");
    }
  };

  const reconnectPrinter = async () => {
    try {
      const savedPrinterId = localStorage.getItem("savedPrinter");

      if (!savedPrinterId) {
        console.log("No saved printer, user must select again.");
        return;
      }

      console.log("🔄 Trying to reconnect to printer without reselecting...");

      const selectedDevice = await navigator.bluetooth.requestDevice({
        filters: [{ services: ["000018f0-0000-1000-8000-00805f9b34fb"] }],
        optionalServices: ["000018f0-0000-1000-8000-00805f9b34fb"],
      });

      if (!selectedDevice) {
        console.warn("❌ Printer not found, removing from storage...");
        localStorage.removeItem("savedPrinter");
        localStorage.removeItem("savedPrinterName");
        setSavedPrinter(null);
        setPrinterName(null);
        return;
      }

      setDevice(selectedDevice);
      await setupPrinter(selectedDevice);
    } catch (error) {
      console.error("❌ Failed to reconnect to printer:", error);
      alert("Failed to reconnect to printer! Please select again.");
      
      // If reconnect fails, remove old printer data
      localStorage.removeItem("savedPrinter");
      localStorage.removeItem("savedPrinterName");
      setSavedPrinter(null);
      setPrinterName(null);
    }
  };

  const setupPrinter = async (selectedDevice) => {
    try {
      if (!selectedDevice.gatt) {
        throw new Error("Device does not support GATT.");
      }

      const server = await selectedDevice.gatt.connect();
      const service = await server.getPrimaryService("000018f0-0000-1000-8000-00805f9b34fb");
      const characteristic = await service.getCharacteristic("00002af1-0000-1000-8000-00805f9b34fb");

      setPrinter(characteristic);
      setIsConnected(true);
      setDevice(selectedDevice);

      selectedDevice.addEventListener("gattserverdisconnected", async () => {
        console.warn("Printer disconnected, trying to reconnect...");
        setIsConnected(false);
        setTimeout(reconnectPrinter, 3000);
      });
    } catch (error) {
      console.error("❌ Failed to setup printer:", error);
      alert("Failed to setup printer! Make sure Bluetooth is active and printer is on.");
    }
  };

  const printReceipt = async () => {
    if (!printer) {
      alert("Printer not connected!");
      return;
    }

    const encoder = new TextEncoder();
    const receiptData = `
      ${printerName || "NOROYONO STORE"}\n
      ==========================\n
      Device: Bluetooth Printer\n
      Status: Connected\n
      Date: ${new Date().toLocaleString()}\n
      ==========================\n
      Thank you for your visit!\n\n\n\n
    `;

    try {
      await printer.writeValue(encoder.encode(receiptData));
    } catch (error) {
      console.error("❌ Failed to print receipt:", error);
      alert("Failed to print receipt!");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-4">BLE Printer</h1>

      <button
        onClick={handleButtonClick}
        className={`px-6 py-2 rounded-md transition text-white ${
          isConnected
            ? "bg-green-500 hover:bg-green-600"
            : savedPrinter
            ? "bg-yellow-500 hover:bg-yellow-600"
            : "bg-blue-500 hover:bg-blue-600"
        }`}
      >
        {isConnected
          ? "Print Receipt"
          : savedPrinter
          ? "Reconnect Printer"
          : "Connect Printer"}
      </button>

      <div className="mt-4 text-lg">
        {isConnected ? (
          <p className="text-green-600 font-semibold">
            Connected to Printer: {printerName || "Unknown Printer"}
          </p>
        ) : savedPrinter ? (
          <>
            <p className="text-yellow-600">
              Saved Printer: {printerName || "Unknown Printer"} (Not Connected)
            </p>
            <button
              onClick={reconnectPrinter}
              className="px-4 py-2 mt-4 text-white bg-yellow-500 rounded-md hover:bg-yellow-600"
            >
              Reconnect to Saved Printer
            </button>
          </>
        ) : (
          <p className="text-red-600">Status: Not connected</p>
        )}
      </div>
    </div>
  );
}

export default Receipt;