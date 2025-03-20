import React, { useState, useEffect } from "react";
import { fetchCategories } from "../../services/categoryService";
import { createProduct } from "../../services/productService";

interface AddProductModalProps {
    closeModal: () => void;
    refreshProducts: () => void;
}

const AddProductModal: React.FC<AddProductModalProps> = ({ closeModal, refreshProducts }) => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [discountPrice, setDiscountPrice] = useState("");
    const [category, setCategory] = useState("");
    const [categories, setCategories] = useState<{ _id: string; name: string }[]>([]);
    const [stock, setStock] = useState("");
    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadCategories = async () => {
            const fetchedCategories = await fetchCategories();
            setCategories(fetchedCategories);
        };
        loadCategories();
    }, []);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!name || !price || !category || !stock) {
            setError("Please fill in required fields.");
            return;
        }

        const formData = new FormData();
        formData.append("name", name);
        formData.append("description", description);
        formData.append("price", price);
        formData.append("discountPrice", discountPrice);
        formData.append("category", category);
        formData.append("stock", stock);
        if (image) formData.append("image", image);

        try {
            const token = localStorage.getItem("token") || "";
            await createProduct(formData, token);
            refreshProducts();
            closeModal();
        } catch (err) {
            setError("Failed to create product. Please try again.");
        }
    };

    return (
        <div className="fixed top-0 left-0 w-screen h-screen bg-opacity-10 backdrop-blur-md flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-2xl w-[400px] shadow-xl relative">
                <button
                    onClick={closeModal}
                    className="absolute top-3 right-3 text-gray-500 text-xl hover:text-gray-700"
                >
                    &times;
                </button>
                <h2 className="text-lg font-semibold text-gray-800 mb-4 text-center">Add Product</h2>
                {error && <p className="text-red-500 text-sm mb-3 text-center">{error}</p>}
                <form onSubmit={handleSubmit} className="space-y-2">
                    <input type="text" placeholder="Name *" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-400" required />
                    <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-400 resize-none" rows={3}></textarea>
                    <div className="grid grid-cols-2 gap-2">
                        <input type="number" placeholder="Price *" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-400" required />
                        <input type="number" placeholder="Discount Price" value={discountPrice} onChange={(e) => setDiscountPrice(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-400" />
                    </div>
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-400"
                        required
                    >
                        <option value="">Select Category *</option>
                        {categories.map((cat) => (
                            <option key={cat._id} value={cat._id}>
                                {cat.name}
                            </option>
                        ))}
                    </select>
                    <input type="number" placeholder="Stock *" value={stock} onChange={(e) => setStock(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-400" required />
                    <div className="w-full">
                        <input type="file" accept="image/*" onChange={handleImageChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-400" />
                        {imagePreview && <img src={imagePreview} alt="Preview" className="mt-2 w-full h-40 object-cover rounded-lg" />}
                    </div>
                    <button type="submit" className="w-full bg-black text-white py-2 rounded-lg text-sm hover:bg-gray-700 transition">Save Product</button>
                </form>
            </div>
        </div>
    );
    
};

export default AddProductModal;
