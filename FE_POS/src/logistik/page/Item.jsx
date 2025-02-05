import React, { useState, useEffect } from "react";
import axios from "axios";
import PlusIcon from "/icon/plus-icon.webp";
import ConfirmCustom from "../../admin/component/ConfirmCustom";


const Item = () => {
    const [items, setItems] = useState([]);
    const [materials, setMaterials] = useState([]);
    const [categories, setCategories] = useState([]);
    const [form, setForm] = useState({
        nama: "",
        hargaBeli: "",
        hargaJual: "",
        stok: "",
        categoryId: [],
        isNonMaterial: true,
        materials: [],
        image: null,
    });
    const [editItemId, setEditItemId] = useState(null);
    const [error, setError] = useState("");
    const [statusData, setStatusData] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);
    const [selectedData, setSelectedData] = useState("");
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchCategories = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_DB_API_URL}/api/pos/category/all/form`);
            setCategories(response.data);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to fetch categories");
            if (err.response?.data?.message === "Item belum ada") {
                setError();
                setCategories([]);
            }
        }
    };


    const fetchItems = async () => {
        setStatusData("loading");
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_DB_API_URL}/api/pos/item?page=${page}`,
                {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                }
            );

            setItems(response.data.items); // Pastikan backend kasih data dalam format ini
            setTotalPages(response.data.totalPages);
            setStatusData("success");
            setError("");
        } catch (err) {
            setError(err.response?.data?.message || "Failed to fetch items");
            setStatusData("error");
            if (err.response?.data?.message === "Item belum ada") {
                setError("");
                setItems([]);
                setStatusData("success");
            }
        }
    };

    const handlePageChange = (newPage) => {
        if (newPage > 0 && newPage <= totalPages) {
            setPage(newPage);
        }
    };

    // Fetch materials buat dropdown
    const fetchMaterials = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_DB_API_URL}/api/pos/material/name`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            setMaterials(response.data.materials);
            setError("");
        } catch (err) {
            setError(err.response?.data?.message || "Failed to fetch materials");
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setForm({ ...form, image: file });
            setImagePreview(URL.createObjectURL(file));
        }
    };

    // Tambah material ke form
    const addMaterialToForm = () => {
        setForm({
            ...form,
            materials: [...form.materials, { materialId: "", unitPerMaterial: "", quantityPerMaterial: "" }],
        });
    };

    const updateMaterialInForm = (index, field, value) => {
        const updatedMaterials = [...form.materials];
        updatedMaterials[index][field] = value;
        setForm({ ...form, materials: updatedMaterials });
    };

    // Hapus material dari form
    const removeMaterialFromForm = (index) => {
        const updatedMaterials = form.materials.filter((_, i) => i !== index);
        setForm({ ...form, materials: updatedMaterials });
    };

    // Create or update item
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const formData = new FormData();
            formData.append("nama", form.nama);
            formData.append("hargaBeli", Number(form.hargaBeli));
            formData.append("hargaJual", Number(form.hargaJual));
            formData.append("stok", Number(form.stok));
            // ini gue comment dulu soalnya rangga bilang belum perlu jadi gue set jadi true dulu
            // formData.append("isNonMaterial", form.isNonMaterial);
            formData.append("isNonMaterial", true);
            // 🔹 Kirim categoryId sebagai array string
            form.categoryId.forEach((catId) => {
                formData.append("categoryId[]", catId);
            });

            if (form.image) {
                formData.append("image", form.image);
            }

            formData.append("materials", JSON.stringify(form.materials));

            if (editItemId) {
                await axios.put(`${import.meta.env.VITE_DB_API_URL}/api/pos/item/${editItemId}`, formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
            } else {
                await axios.post(`${import.meta.env.VITE_DB_API_URL}/api/pos/item`, formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
            }

            fetchItems();
            setShowModal(false);
            setError("");
        } catch (err) {
            setError(err.response?.data?.message || "Failed to save item");
        }
    };

    const handleConfirmDelete = async (id, name) => {
        setSelectedData({ id: id, name: name });
        setIsConfirmOpen(true);
    };

    // Delete item
    const handleDelete = async () => {
        setStatusData("loading");
        console.log(selectedData);

        try {
            await axios.delete(`${import.meta.env.VITE_DB_API_URL}/api/pos/item/${selectedData?.id}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            fetchItems();
            setIsConfirmOpen(false);
            setStatusData("success");
            setError("");
        } catch (err) {
            setError(err.response?.data?.message || "Failed to delete item");
            setStatusData("success");
        }
    };

    // Set item data for editing
    const handleEdit = (item) => {
        setEditItemId(item?._id);
        setForm({
            nama: item?.nama,
            hargaBeli: item?.hargaBeli,
            hargaJual: item?.hargaJual,
            stok: item?.stok,
            // Mengonversi categoryId menjadi array string ID kategori
            categoryId: item?.categoryId?.map(cat => cat._id) || [],
            materials: item?.materials || [],
        });
        setImagePreview(`${import.meta.env.VITE_DB_API_URL_IMAGE}${item?.image}`);
        setShowModal(true);
    };

    useEffect(() => {
        fetchItems();
        fetchMaterials();
        fetchCategories();
    }, [page]);

    return (
        <div className="container mx-auto p-4 text-white min-h-screen mt-20">
            <div className="flex items-center justify-between">
                <h1 className="text-xl md:text-3xl font-medium">Menu</h1>
                <button
                    onClick={() => {
                        setForm({ nama: "", hargaBeli: "", hargaJual: "", stok: "", kategori: "", materials: [] });
                        setEditItemId(null);
                        setShowModal(true);
                    }}
                    className="text-white p-2 rounded-2xl hover:underline flex items-center"
                >
                    <p className="mr-2">Tambah Menu</p>
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
            {statusData === "success" && items?.length === 0 && (
                <p className="text-center text-gray-600 mt-5">Belum ada data yang ditambahkan.</p>
            )}
            {statusData === "success" && items?.length > 0 && (
                <div className="">
                    <div className="w-full overflow-x-auto">

                        <table className="table-auto w-full text-white shadow-lg rounded-lg overflow-x-auto border-separate border-spacing-y-2">
                            <thead>
                                <tr>
                                    <th className="py-2 pr-2 text-left">Nama</th>
                                    <th className="py-2 pr-2 text-left">Harga Jual</th>
                                    <th className="py-2 pr-2 text-left">Stok</th>
                                    <th className="py-2 pr-2 text-left">Kategori</th>
                                    <th className="py-2 pr-2 text-left">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {items.map((item) => (
                                    <tr key={item?._id} className=" bg-[#0F0F0F] rounded-2xl">
                                        <td className="border px-4 py-2 border-[#1A1A1A] rounded-tl-xl rounded-bl-xl">{item?.nama}</td>
                                        <td className="border px-4 py-2 border-[#1A1A1A] ">{new Intl.NumberFormat('id-ID', {
                                            style: 'currency',
                                            currency: 'IDR',
                                        }).format(item?.hargaJual)}
                                        </td>
                                        <td className="border px-4 py-2 border-[#1A1A1A] ">{item?.stok}</td>
                                        <td className="border px-4 py-2 border-[#1A1A1A] ">{item?.categoryId[0]?.name}</td>
                                        <td className="border px-4 py-2 border-[#1A1A1A] rounded-tr-xl rounded-br-xl">
                                            <button
                                                onClick={() => handleEdit(item)}
                                                className="m-1 bg-[linear-gradient(90deg,_rgba(255,_154,_0,_0.8)_0%,_rgba(255,_0,_0,_0.8)_100%)] hover:bg-[linear-gradient(90deg,_rgba(255,_154,_0,_1)_0%,_rgba(255,_0,_0,_1)_100%)] text-black px-2 hover:bg-yellow-400 mr-2 rounded "
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleConfirmDelete(item?._id, item?.nama)}
                                                className="m-1 bg-[#1E1E1E] hover:bg-[#ff3636] text-white px-2 rounded"
                                            >
                                                Delete
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
            )}

            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
                    <div className="bg-[#0F0F0F] p-6 rounded shadow-lg w-full max-w-lg border border-[#1A1A1A] max-h-[90vh]">
                        <div className="flex justify-between items-center relative">
                            <h2 className="text-xl font-medium mb-4 text-white">
                                {editItemId ? "Edit Menu" : "Tambah Menu"}
                            </h2>
                            <button onClick={() => setShowModal(false)} className="absolute top-2 right-2 text-white">
                                X
                            </button>
                        </div>
                        <form className="max-h-[70vh] overflow-y-auto" onSubmit={handleSubmit}>
                            <input
                                type="text"
                                placeholder="Nama Item"
                                className="p-2 w-full mb-2 bg-[#0F0F0F] border border-[#1A1A1A] text-white focus:outline-none rounded-lg  "
                                value={form.nama}
                                onChange={(e) => setForm({ ...form, nama: e.target.value })}
                                required
                            />

                            <input
                                type="number"
                                placeholder="Harga Beli"
                                className="p-2 w-full mb-2 bg-[#0F0F0F] border border-[#1A1A1A] text-white focus:outline-none rounded-lg  "
                                value={form.hargaBeli}
                                onChange={(e) => setForm({ ...form, hargaBeli: e.target.value ? Number(e.target.value) : "" })}
                                required
                            />

                            <input
                                type="number"
                                placeholder="Harga Jual"
                                className="p-2 w-full mb-2 bg-[#0F0F0F] border border-[#1A1A1A] text-white focus:outline-none rounded-lg  "
                                value={form.hargaJual}
                                onChange={(e) => setForm({ ...form, hargaJual: e.target.value ? Number(e.target.value) : "" })}
                                required
                            />

                            <input
                                type="number"
                                placeholder="Stok"
                                className="p-2 w-full mb-2 bg-[#0F0F0F] border border-[#1A1A1A] text-white focus:outline-none rounded-lg  "
                                value={form.stok}
                                onChange={(e) => setForm({ ...form, stok: e.target.value ? Number(e.target.value) : "" })}
                                required
                            />

                            {/* <select
                                multiple
                                value={form.categoryId}
                                onChange={(e) => {
                                    const selectedCategories = Array.from(e.target.selectedOptions, (option) => option.value);
                                    setForm({ ...form, categoryId: selectedCategories });
                                }}
                                className="p-2 border border-[#3D3D3D] w-full mb-2 bg-[#1E1E1E] text-white focus:outline-none"
                                required
                            >
                                {categories.map((cat) => (
                                    <option key={cat._id} value={cat._id}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select> */}

                            <p>Kategori</p>
                            <div className="p-2 border border-[#3D3D3D] w-full mb-2 bg-[#1E1E1E] text-white focus:outline-none max-h-48 overflow-y-auto">
                                {categories.map((cat) => (
                                    <label key={cat._id} className="flex items-center space-x-2 py-1">
                                        <input
                                            type="checkbox"
                                            value={cat._id}
                                            checked={form.categoryId?.includes(cat._id) || false}
                                            onChange={(e) => {
                                                const selectedCategories = form.categoryId?.includes(cat._id)
                                                    ? form.categoryId.filter(id => id !== cat._id)
                                                    : [...(form.categoryId || []), cat._id];

                                                setForm({ ...form, categoryId: selectedCategories });
                                            }}
                                            className="accent-orange-500"
                                        />
                                        <span>{cat.name}</span>
                                    </label>
                                ))}
                            </div>

                            <input
                                type="file"
                                onChange={handleFileChange}
                                className="p-2 w-full mb-2 bg-[#0F0F0F] file:text-white"
                            />
                            {imagePreview && <img src={imagePreview} alt="Preview" className="w-32 h-32 object-cover mb-2" />}


                            {/* 
                                ini gue hide dlu soalnya rangga bilang belum perlu
                            */}
                            <div className="hidden">
                                <label className="flex items-center mb-4 text-white d-none">
                                    <input
                                        type="checkbox"
                                        checked={form.isNonMaterial}
                                        onChange={(e) => setForm({ ...form, isNonMaterial: e.target.checked })}
                                        className="mr-2"
                                    />
                                    <span>Item Non-Material</span>
                                </label>

                                {!form.isNonMaterial && (
                                    <>
                                        <button type="button" onClick={addMaterialToForm} className="bg-blue-500 text-white p-2 rounded mb-2 w-full hover:bg-blue-400 transition">
                                            + Tambah Material
                                        </button>
                                        {form.materials.map((mat, index) => {
                                            const selectedMaterial = materials.find((m) => m._id === mat.materialId);
                                            return (
                                                <div key={index} className="flex flex-wrap gap-2 mb-2">


                                                    <select
                                                        value={mat.materialId}
                                                        onChange={(e) => updateMaterialInForm(index, "materialId", e.target.value)}
                                                        className="p-2 w-full bg-gray-700 text-white focus:outline-none rounded-lg  "
                                                    >
                                                        <option value="">Pilih Material</option>
                                                        {materials.map((m) => (
                                                            <option key={m._id} value={m._id}>
                                                                {m.name}
                                                            </option>
                                                        ))}
                                                    </select>


                                                    {/* 
                                                untuk unitPerMaterial, bisa diisi dengan
                                                bentuknya dropdown 
                                                    kg, gram, liter, ml, pcs
                                                */}
                                                    <select
                                                        value={mat.unitPerMaterial}
                                                        onChange={(e) => updateMaterialInForm(index, "unitPerMaterial", e.target.value)}
                                                        className="p-2 w-full bg-gray-700 text-white focus:outline-none rounded-lg  "
                                                    >
                                                        <option value="">Pilih Unit</option>
                                                        <option value="kg">kg</option>
                                                        <option value="gram">gram</option>
                                                        <option value="liter">liter</option>
                                                        <option value="ml">ml</option>
                                                        <option value="pcs">pcs</option>
                                                    </select>

                                                    <input
                                                        type="number"
                                                        placeholder={`Masukkan jumlah (${selectedMaterial ? selectedMaterial.unit : "unit"})`}
                                                        value={mat.quantityPerMaterial}
                                                        onChange={(e) => updateMaterialInForm(index, "quantityPerMaterial", e.target.value)}
                                                        className="p-2 w-full bg-gray-700 text-white focus:outline-none rounded-lg  "
                                                        min="1"
                                                        required
                                                    />

                                                    <button
                                                        type="button"
                                                        onClick={() => removeMaterialFromForm(index)}
                                                        className="bg-[#1E1E1E] text-white p-2 rounded w-full hover:bg-red-600 transition"
                                                    >
                                                        Hapus
                                                    </button>
                                                </div>
                                            );
                                        })}
                                    </>
                                )}
                            </div>



                            <button type="submit" className="text-white p-2 w-full rounded mt-2 bg-[linear-gradient(90deg,_rgba(255,_154,_0,_0.5)_0%,_rgba(255,_0,_0,_0.5)_100%)] hover:bg-[linear-gradient(90deg,_rgba(255,_154,_0,_1)_0%,_rgba(255,_0,_0,_1)_100%)]">Simpan</button>
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

export default Item;
