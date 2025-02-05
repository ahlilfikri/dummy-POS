import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle, Loader2 } from "lucide-react";

const TransactionSuccessModal = ({ isOpen, onClose, transactionDetails }) => {
  const [show, setShow] = useState(isOpen);
  const [printer, setPrinter] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [device, setDevice] = useState(null);
  const [loading, setLoading] = useState(false);
  let user = localStorage.getItem("user");
  user = JSON.parse(user);
  const isMobile = window.matchMedia("(max-width: 768px)").matches;
  console.log(isMobile ? "📱 Mobile/Tablet detected" : "🖥️ Desktop detected");
  const MAX_CHUNK_SIZE = 512;
  const formatCurrency = (amount) => {
    return `Rp ${amount.toLocaleString("id-ID")}`;
  };

  useEffect(() => {
    setShow(isOpen);
  }, [isOpen]);

  // 🔥 Fungsi untuk connect ke printer (Manual)
  const connectToPrinter = async () => {
    setLoading(true);
    try {
      const selectedDevice = await navigator.bluetooth.requestDevice({
        acceptAllDevices: true,
        optionalServices: ["000018f0-0000-1000-8000-00805f9b34fb"],
      });

      setDevice(selectedDevice);
      await setupPrinter(selectedDevice);
    } catch (error) {
      console.error("❌ Gagal menghubungkan ke printer:", error);
      alert("Gagal menghubungkan ke printer!");
      setIsConnected(false);
    }
    setLoading(false);
  };


  // 🔥 Setup printer setelah ditemukan
  const setupPrinter = async (selectedDevice) => {
    try {
      if (!selectedDevice.gatt) {
        throw new Error("Perangkat tidak mendukung GATT.");
      }

      const server = await selectedDevice.gatt.connect();
      const service = await server.getPrimaryService("000018f0-0000-1000-8000-00805f9b34fb");
      const characteristic = await service.getCharacteristic("00002af1-0000-1000-8000-00805f9b34fb");

      setPrinter(characteristic);
      setIsConnected(true);
      setDevice(selectedDevice);

      // 🔥 Jika printer terputus, ubah status jadi tidak terhubung
      selectedDevice.addEventListener("gattserverdisconnected", () => {
        console.warn("⚠ Printer terputus! Silakan hubungkan kembali.");
        setIsConnected(false);
      });
    } catch (error) {
      console.error("❌ Gagal setup printer:", error);
      alert("Gagal setup printer! Pastikan Bluetooth aktif dan printer menyala.");
      setIsConnected(false);
    }
  };

  const openCashDrawer = async () => {
    if (!printer) {
      alert("Printer belum terhubung!");
      return;
    }
    try {
      console.log("🔓 Membuka cash drawer...");
      const OPEN_CASH_DRAWER = new Uint8Array([0x1B, 0x70, 0x00, 0x19, 0xFA]);
      await printer.writeValue(OPEN_CASH_DRAWER);
      console.log("✅ Cash drawer terbuka!");
    } catch (error) {
      console.error("❌ Gagal membuka cash drawer:", error);
      alert("Gagal membuka cash drawer! Periksa koneksi printer.");
      setIsConnected(false);
    }
  };

  // 🔥 Cetak struk dengan format 58mm
  const printReceipt = async () => {
    if (!printer) {
      alert("Printer belum terhubung!");
      return;
    }
    let Bayar = parseFloat(transactionDetails?.uangMasuk);
    const ESC = "\x1B"; // ESC command
    const GS = "\x1D"; // GS command
    const logoData = [
    ];
    try {
      console.log("🔄 Mengirim logo ke printer...");
      let receiptData;
      if (isMobile) {
        if (transactionDetails?.uangMasuk || transactionDetails?.uangMasuk != "" || transactionDetails?.uangKembalian != 0) {
          receiptData = `PENYETAN NOROYONO\n`;
          receiptData += `Mojolaban Sukoharjo\n`;
          receiptData += `Samping Klinik Mbogo\n`;
          receiptData += `Telp: 0822-4141-1661\n`;
          receiptData += `================================\n`;
          receiptData += `Tanggal : ${new Date().toLocaleDateString("id-ID")}\n`;
          receiptData += `Metode  : ${transactionDetails?.metodePembayaran}\n`;
          receiptData += `Detail  : ${transactionDetails?.detail}\n`;
          receiptData += `Kasir   : ${user?.nama}\n`;
          receiptData += `================================\n`;
          receiptData += `ITEM PESANAN\n`;
          receiptData += `--------------------------------\n`;
          // 🔥 Format item supaya rapi dan tidak terpotong
          transactionDetails?.items?.forEach((item) => {
            let itemName = item.nama.padEnd(20, " "); // Pastikan nama tidak lebih dari 20 karakter
            let quantity = String(item.quantity).padEnd(3, " ");
            let price = formatCurrency(item?.harga).padStart(8, " ");
            let total = formatCurrency(item.quantity * item.harga).padStart(8, " ");
            receiptData += `${itemName}\n  ${quantity} x ${price} = ${total}\n`;
          });
          receiptData += `\n================================\n`;
          receiptData += `Total Items : ${transactionDetails?.items?.length}\n`;
          receiptData += `Total Bayar : ${formatCurrency(transactionDetails?.total)}\n`;
          receiptData += `Bayar       : ${formatCurrency(Bayar)}\n`;
          receiptData += `Kembalian   : ${formatCurrency(transactionDetails?.uangKembalian)}\n`;
          receiptData += `\nTerima kasih telah berbelanja!\n`;
          receiptData += `================================\n\n\n\n`;
        } else {
          receiptData = `PENYETAN NOROYONO\n`;
          receiptData += `Mojolaban Sukoharjo\n`;
          receiptData += `Samping Klinik Mbogo\n`;
          receiptData += `Telp: 0822-4141-1661\n`;
          receiptData += `================================\n`;
          receiptData += `Tanggal : ${new Date().toLocaleDateString("id-ID")}\n`;
          receiptData += `Metode  : ${transactionDetails?.metodePembayaran}\n`;
          receiptData += `Detail  : ${transactionDetails?.detail}\n`;
          receiptData += `Kasir   : ${user?.nama}\n`;
          receiptData += `================================\n`;
          receiptData += `ITEM PESANAN\n`;
          receiptData += `--------------------------------\n`;
          transactionDetails?.items?.forEach((item) => {
            let itemName = item.nama.padEnd(20, " "); // Pastikan nama tidak lebih dari 20 karakter
            let quantity = String(item.quantity).padEnd(3, " ");
            let price = formatCurrency(item?.harga).padStart(8, " ");
            let total = formatCurrency(item.quantity * item.harga).padStart(8, " ");
            receiptData += `${itemName}\n  ${quantity} x ${price} = ${total}\n`;
          });
          receiptData += `\n================================\n`;
          receiptData += `Total Items : ${transactionDetails?.items?.length}\n`;
          receiptData += `Total Bayar : ${formatCurrency(transactionDetails?.total)}\n`;
          receiptData += `\nTerima kasih telah berbelanja!\n`;
          receiptData += `================================\n\n\n\n`;
        }
      } else {
        if (transactionDetails?.uangMasuk || transactionDetails?.uangMasuk != "" || transactionDetails?.uangKembalian != 0) {
          receiptData =
            // `${ESC}\x40` + // Reset Printer
            // `${ESC}\x21\x30Penyetan NOROYONO${ESC}\x21\x00\n` +
            `Mojolaban Sukoharjo\n` +
            `Samping Klinik Mbogo\n` +
            `Telp: 0822-4141-1661\n` +
            `${ESC}\x45\x01==============================${ESC}\x45\x00\n` +
            `Tanggal : ${new Date().toLocaleDateString("id-ID")}\n` +
            `Metode  : ${transactionDetails?.metodePembayaran}\n` +
            `Detail  : ${transactionDetails?.detail}\n` +
            `Kasir  : ${user?.nama}\n` +
            `${ESC}\x45\x01==============================${ESC}\x45\x00\n` +
            `ITEM PESANAN\n` +
            `--------------------------------\n` +
            transactionDetails?.items?.map((item) =>
              `${item.nama}\n` +
              `  ${String(item.quantity)} x ${formatCurrency(item?.harga)} = ${formatCurrency(item.quantity * item.harga)}`
            ).join("\n") +
            `\n${ESC}\x45\x01==============================${ESC}\x45\x00\n` +
            `Total Items: ${transactionDetails?.items?.length}\n` +
            `Total Bayar: ${formatCurrency(transactionDetails?.total)}\n` +
            `Jumlah Pembayaran: ${formatCurrency(parseFloat(transactionDetails?.uangMasuk))}\n` +
            `Uang Kemablian: ${formatCurrency(transactionDetails?.uangKembalian)}\n` +
            `\nTerima kasih telah berbelanja!\n` +
            `${ESC}\x45\x01==============================${ESC}\x45\x00\n\n`;
        } else {
          receiptData =
            // `${ESC}\x40` + // Reset Printer
            // `${ESC}\x21\x30Penyetan NOROYONO${ESC}\x21\x00\n` +
            `Mojolaban Sukoharjo\n` +
            `Samping Klinik Mbogo\n` +
            `Telp: 0822-4141-1661\n` +
            `${ESC}\x45\x01==============================${ESC}\x45\x00\n` +
            `Tanggal : ${new Date().toLocaleDateString("id-ID")}\n` +
            `Metode  : ${transactionDetails?.metodePembayaran}\n` +
            `Detail  : ${transactionDetails?.detail}\n` +
            `Kasir  : ${user?.nama}\n` +
            `${ESC}\x45\x01==============================${ESC}\x45\x00\n` +
            `ITEM PESANAN\n` +
            `--------------------------------\n` +
            transactionDetails?.items?.map((item) =>
              `${item.nama}\n` +
              `  ${String(item.quantity)} x ${formatCurrency(item?.harga)} = ${formatCurrency(item.quantity * item.harga)}`
            ).join("\n") +
            `\n${ESC}\x45\x01==============================${ESC}\x45\x00\n` +
            `Total Items: ${transactionDetails?.items?.length}\n` +
            `Total Bayar: ${formatCurrency(transactionDetails?.total)}\n` +
            `\nTerima kasih telah berbelanja!\n` +
            `${ESC}\x45\x01==============================${ESC}\x45\x00\n\n`;
        }
      };

      console.log("🖨️ Mengirim teks struk ke printer...");
      alert(`maxChunkSize: ${MAX_CHUNK_SIZE}`);
      await new Promise(resolve => setTimeout(resolve, 1000));
      if (!isMobile) {
        alert("masuk laptop")
        await writeToPrinterInChunks((new Uint8Array(logoData)), printer);
        await writeToPrinterInChunks((receiptData), printer);
      } else {
        alert("masuk mobile")
        await writeToPrinterInChunksMobile((receiptData), printer);
      }

      if (transactionDetails?.uangMasuk || transactionDetails?.uangMasuk != "") {
        await openCashDrawer();
      }
      alert(`✅ Struk berhasil dicetak!`);
      console.log("✅ Struk berhasil dicetak!");
    } catch (error) {
      console.error("❌ Gagal mencetak struk:", error);
      alert("Gagal mencetak struk! Coba periksa koneksi printer.");
      setIsConnected(false);
    }
  };

  // 🔥 Fungsi untuk mengirim data dalam chunks 512 byte
  const writeToPrinterInChunks = async (data, printer) => {
    const encodedData = data instanceof Uint8Array ? data : new TextEncoder().encode(data);
    for (let i = 0; i < encodedData.length; i += MAX_CHUNK_SIZE) {
      const chunk = encodedData.slice(i, i + MAX_CHUNK_SIZE);
      await printer.writeValue(chunk);
      await new Promise(resolve => setTimeout(resolve, 300));
    }
  };

  const writeToPrinterInChunksMobile = async (data, printer) => {
    const lines = data?.split("\n"); // Pisahkan data per baris

    for (const line of lines) {
      const asciiArray = line?.split("").map(char => char.charCodeAt(0)); // Konversi ke ASCII
      const encodedData = new Uint8Array([...asciiArray, 0x0A]); // Tambahkan newline (0x0A)

      await printer.writeValue(encodedData); // Kirim ke printer
      await new Promise(resolve => setTimeout(resolve, 200)); // Delay antar baris untuk stabilitas
    }

    // 🔥 Pastikan printer nge-feed kertas agar struk tidak terpotong
    const FEED = new Uint8Array([0x0A, 0x0A, 0x0A, 0x0A]); // 4 baris kosong
    await printer.writeValue(FEED);
  };

  if (!isOpen) return null;

  return (
    <>
      {show && (
        <motion.div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <motion.div className="bg-[#0F0F0F] text-white p-6 rounded-2xl shadow-xl w-[500px] text-center border border-gray-700 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-200">Pembayaran Berhasil!</h2>
            <CheckCircle size={50} className="text-green-500 mx-auto mt-4" />

            {/* Rincian Transaksi */}
            {transactionDetails && (
              <div className="mt-4 text-left text-gray-300">
                <p className="text-sm sm:text-base">
                  <strong>Tanggal:</strong> {new Date().toLocaleDateString("id-ID")}
                </p>
                <p className="text-sm sm:text-base">
                  <strong>Metode Pembayaran:</strong> {transactionDetails?.metodePembayaran}
                </p>
                <p className="text-sm sm:text-base">
                  <strong>Detail:</strong> {transactionDetails?.detail}
                </p>
                <p className="text-sm sm:text-base">
                  <strong>Nama Kasir:</strong> {user?.nama}
                </p>
                <div className="mt-3">
                  <div className="overflow-x-auto">
                    <table className="min-w-full mb-5">
                      <thead>
                        <tr>
                          <th className="py-2 text-left text-xs">Qty</th>
                          <th className="py-2 text-left text-xs">Nama</th>
                          <th className="py-2 text-right text-xs">Sub Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {transactionDetails?.items?.map((item, index) => (
                          <tr key={index}>
                            <td className="py-2 text-xs">{item?.quantity}</td>
                            <td className="py-2 text-xs">{item?.nama}</td>
                            <td className="py-2 text-xs text-right">
                              Rp {item?.subTotal?.toLocaleString("id-ID")}
                            </td>
                          </tr>
                        ))}
                      </tbody>

                    </table>
                  </div>
                  <div className="grid grid-cols-2 gap-y-2 text-sm w-full">
                    <p className="font-semibold">Total Items</p>
                    <p className="text-right">{transactionDetails?.items?.length}</p>

                    <p className="font-semibold">Total</p>
                    <p className="text-right">Rp {transactionDetails?.total?.toLocaleString("id-ID")}</p>
                    {
                      transactionDetails?.uangMasuk &&
                      (
                        <>
                          <p className="font-semibold">Jumlah Pembayaran</p>
                          <p className="text-right">Rp {parseFloat(transactionDetails?.uangMasuk)?.toLocaleString("id-ID")}</p>
                        </>
                      )
                    }
                    {
                      (transactionDetails?.uangKembalian || transactionDetails?.uangKembalian != 0) &&
                      (
                        <>
                          <p className="font-semibold">Kembalian</p>
                          <p className="text-right">Rp {transactionDetails?.uangKembalian?.toLocaleString("id-ID")}</p>
                        </>
                      )
                    }
                  </div>
                </div>
              </div>
            )}
            <img
              className="mx-auto w-40 sm:w-52"
              src={`${import.meta.env.VITE_DB_API_URL_IMAGE}${transactionDetails?.qr}`}
              alt="QR Code"
            />

            {/* Tombol Cetak atau Hubungkan Printer */}
            <div className="mt-4">
              {isConnected ? (
                <button className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-md w-full" onClick={printReceipt}>
                  Cetak Struk
                </button>
              ) : (
                <button
                  className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-md w-full flex items-center justify-center"
                  onClick={connectToPrinter}
                  disabled={loading}
                >
                  {loading ? <Loader2 className="animate-spin mr-2" /> : "Hubungkan Printer"}
                </button>
              )}
            </div>

            <button className="mt-4 bg-gray-500 hover:bg-gray-600 px-4 py-2 rounded-md w-full" onClick={onClose}>
              Oke
            </button>
          </motion.div>
        </motion.div>
      )}
    </>
  );
};

export default TransactionSuccessModal;
