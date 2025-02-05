import React from "react";

const TransactionDetailModal = ({ isOpen, onClose, transaction }) => {
  if (!transaction) return null;
  console.log(transaction);


  const calculateTotal = () => {
    return transaction?.item?.reduce((total, item) => {
      return total + (item.hargaJual * item.jumlah);
    }, 0);
  };

  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20 ${isOpen ? "block" : "hidden"
        }`}
      onClick={onClose}
    >
      <div
        className=" bg-[#0F0F0F] border border-[#1A1A1A] rounded-lg shadow-lg min-w-96 w-3/4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-[#0F0F0F] text-white pt-8 px-3 rounded-lg mb-5">
          <h1 className="text-3xl mb-5">Detail Transaksi</h1>
          {/* Table with Items */}
          <div className="w-full overflow-x-auto sm:max-h-[60vh]">
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
                {transaction?.item?.map((item, index) => (
                  <tr key={index}>
                    <td className="py-2 text-xs sm:text-sm md:text-xs lg:text-base">{item?.jumlah}</td>
                    <td className="py-2 text-xs sm:text-sm md:text-xs lg:text-base">{item?.nama}</td>
                    <td className="py-2 text-xs sm:text-sm md:text-xs lg:text-base">{new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(item?.hargaJual)}</td>
                    <td className="py-2 text-xs sm:text-sm md:text-xs lg:text-base text-right">{new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(item?.jumlah * item?.hargaJual)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Total summary */}
          <div className="flex justify-between">
            <p>Total Items: {transaction?.item?.length}</p>
            <p>Total: {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(calculateTotal())}</p>
          </div>

          {/* Date */}
          {/* <div className="flex justify-between mb-5">
            <p>Tanggal: {date}</p>
          </div> */}
        </div>
        <div className="w-full flex justify-end px-4 mb-5">
          <button
            className="bg-[#1E1E1E] hover:bg-red-500 text-white px-4 py-2 rounded "
            onClick={onClose}
          >
            Tutup
          </button>

        </div>
      </div>
    </div>
  );
};

export default TransactionDetailModal;
