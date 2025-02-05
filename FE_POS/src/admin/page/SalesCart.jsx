import React, { useState, useEffect } from 'react';
import { Line, Bar, Radar, Pie } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import moment from 'moment';

const SalesChart = () => {
  const [salesData, setSalesData] = useState([]);
  const [materialData, setMaterialData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [chartType, setChartType] = useState('line');
  const [statusData, setStatusData] = useState("");
  const [totalAmount, setTotalAmount] = useState(0);
  const [totalAmountMaterial, setTotalAmountMaterial] = useState(0);
  const [itemsStatistic, setItemsStatistic] = useState([]);
  const [materialStatistic, setMaterialStatistic] = useState([]);

  useEffect(() => {
    fetchSalesData();
  }, [startDate, endDate]);

  const fetchSalesData = async () => {
    setStatusData("loading");
    try {
      const response = await fetch(
        `${import.meta.env.VITE_DB_API_URL}/api/pos/transaction/sales?startDate=${moment(startDate).format('YYYY-MM-DD')}&endDate=${moment(endDate).format('YYYY-MM-DD')}`
      );
      const data = await response.json();
      console.log(data);
      setSalesData(data?.salesData);
      setMaterialData(data?.materialData);
      setTotalAmount(data?.totalAmount);
      setTotalAmountMaterial(data?.totalAmountMaterial);
      setItemsStatistic(data?.itemsStatistic);
      setMaterialStatistic(data?.materialStatistic);
      setLoading(false);
      setStatusData("success");
    } catch (error) {
      console.error(error);
      setLoading(false);
      setStatusData("error");
    }
  };

  // Ambil semua tanggal dari salesData dan materialData
  const salesDates = salesData?.map(item => item._id) || [];
  const materialDates = materialData?.map(item => item._id) || [];

  // Gabungkan semua tanggal tanpa duplikat & urutkan secara kronologis
  const allDates = [...new Set([...salesDates, ...materialDates])].sort((a, b) => new Date(a) - new Date(b));

  // Buat lookup untuk total penjualan & total pembelian bahan baku per tanggal
  const salesMap = new Map(salesData?.map(item => [item._id, item.totalAmount || 0]));
  const purchaseMap = new Map(materialData?.map(item => [item._id, item.totalAmount || 0]));

  // Generate data sesuai tanggal yang sudah digabung dan diurutkan
  const salesAmounts = allDates.map(date => salesMap.get(date) || 0);
  const purchaseAmounts = allDates.map(date => purchaseMap.get(date) || 0);

  // Buat data chart
  const chartData = {
    labels: allDates, // Pakai semua tanggal yang sudah digabung & diurutkan
    datasets: [
      {
        label: 'Total Penjualan',
        data: salesAmounts,
        borderColor: '#FF0000',
        backgroundColor: 'rgba(255, 0, 0, 0.2)',
        tension: 0.1,
      },
      {
        label: 'Total Pembelian Bahan Baku',
        data: purchaseAmounts,
        borderColor: '#00FF00',
        backgroundColor: 'rgba(0, 255, 0, 0.2)',
        tension: 0.1,
      },
    ],
  };

  const renderChart = () => {
    switch (chartType) {
      case 'line':
        return <Line data={chartData} />;
      case 'bar':
        return <Bar data={chartData} />;
      case 'radar':
        return <Radar data={chartData} />;
      case 'pie':
        return <Pie data={chartData} />;
      default:
        return <Line data={chartData} />;
    }
  };

  return (
    <div className='min-h-screen mt-24 mb-8'>
      <div className="flex items-center justify-between">
        <h1 className="text-xl md:text-3xl font-medium">Grafik Penjualan & Pembelian (Per Tanggal)</h1>
      </div>

      <div className='my-4 flex flex-wrap items-center'>
        <select
          className='bg-[#1A1A1A] text-white mr-6 p-1 rounded my-2'
          value={chartType}
          onChange={(e) => setChartType(e.target.value)}
        >
          <option value="line">Line Chart</option>
          <option value="bar">Bar Chart</option>
          <option value="radar">Radar Chart</option>
          <option value="pie">Pie Chart</option>
        </select>

        <div className="flex my-2 mr-2">
          <label className='mr-2'>Dari</label>
          <DatePicker
            className='text-white bg-[#1A1A1A] py-1 px-2 w-full rounded'
            selected={startDate}
            onChange={date => setStartDate(date)}
          />
        </div>

        <div className="flex my-2 mr-2">
          <label className='mr-2'>Sampai</label>
          <DatePicker
            className='text-white bg-[#1A1A1A] py-1 px-2 w-full rounded'
            selected={endDate}
            onChange={date => setEndDate(date)}
          />
        </div>
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
        <p className="text-center text-red-500 mt-5">Gagal memuat data?. Silakan refresh halaman</p>
      )}

      {statusData === "success" && (
        <div className="w-full">
          {/* Card Total Penjualan & Total Pembelian */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="p-4 bg-[#1A1A1A] text-white rounded-lg shadow-md">
              <h2 className="text-lg">Total Penjualan</h2>
              <p className="text-2xl font-bold">Rp {totalAmount.toLocaleString("id-ID")}</p>
            </div>
            <div className="p-4 bg-[#1A1A1A] text-white rounded-lg shadow-md">
              <h2 className="text-lg">Total Pembelian Bahan Baku</h2>
              <p className="text-2xl font-bold">Rp {totalAmountMaterial.toLocaleString("id-ID")}</p>
            </div>
          </div>

          {/* Grafik */}
          <div className="bg-[#0E0E0E] p-4 text-white rounded-lg">
            {renderChart()}
          </div>

          {/* Tabel Menu Terbanyak */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold">Menu Terlaris</h2>
            <table className="table-auto w-full text-white shadow-lg rounded-lg overflow-x-auto border-separate border-spacing-y-2">
              <thead>
                <tr>
                  <th className="py-2 pr-2 text-left">Nama Menu</th>
                  <th className="py-2 pr-2 text-left">Jumlah Terjual</th>
                </tr>
              </thead>
              <tbody>
                {itemsStatistic?.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-700">
                    <td className="border px-4 py-2 border-[#1A1A1A] rounded-tl-xl rounded-bl-xl">{item._id}</td>
                    <td className="border px-4 py-2 border-[#1A1A1A] rounded-tr-xl rounded-br-xl">{item.totalQuantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Tabel Material Terbanyak */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold">Material Paling Banyak Digunakan</h2>
            <table className="table-auto w-full text-white shadow-lg rounded-lg overflow-x-auto border-separate border-spacing-y-2">
              <thead>
                <tr>
                  <th className="py-2 pr-2 text-left">Nama Material</th>
                  <th className="py-2 pr-2 text-left">Total Pembelian</th>
                </tr>
              </thead>
              <tbody>
                {materialStatistic?.map((material, index) => (
                  <tr key={index} className="hover:bg-gray-700">
                    <td className="border px-4 py-2 border-[#1A1A1A] rounded-tl-xl rounded-bl-xl">{material._id}</td>
                    <td className="border px-4 py-2 border-[#1A1A1A] rounded-tr-xl rounded-br-xl">Rp {material.totalCost.toLocaleString("id-ID")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalesChart;
