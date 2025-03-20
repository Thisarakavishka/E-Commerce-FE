import React, { useState, useEffect } from "react";
import { fetchCategories } from "../../services/categoryService";
import { updateProduct, fetchProductById } from "../../services/productService";

const baseUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5001";

interface UpdateProductModalProps {
    productId: string;
    closeModal: () => void;
    refreshProducts: () => void;
}

const UpdateProductModal: React.FC<UpdateProductModalProps> = ({ productId, closeModal, refreshProducts }) => {
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        discountPrice: "",
        category: "",
        stock: "",
        labels: ""  // Initial value for labels is an empty string
    });
    const [categories, setCategories] = useState<{ _id: string; name: string }[]>([]);
    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadProduct = async () => {
            try {
                const token = localStorage.getItem("token") || "";
                const product = await fetchProductById(productId, token);

                console.log(product);

                // Set initial form data
                setFormData({
                    name: product.name,
                    description: product.description,
                    price: product.price,
                    discountPrice: product.discountPrice || "",
                    category: product.category._id,
                    stock: product.stock,
                    labels: product.labels ? product.labels.join(", ") : "" // Handle null labels as empty string
                });

                // Set the image preview
                if (product.image) setImagePreview(`${baseUrl}/${product.image}`);
            } catch (err) {
                setError("Failed to load product details.");
            }
        };

        const loadCategories = async () => {
            const fetchedCategories = await fetchCategories();
            setCategories(fetchedCategories);
        };

        loadProduct();
        loadCategories();
    }, [productId]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        setFormData((prev) => ({ ...prev, labels: value }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const { name, price, category, stock } = formData;

        if (!name || !price || !category || !stock) {
            setError("Please fill in required fields.");
            return;
        }

        const updatedData = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                updatedData.append(key, value);
            }
        });

        if (image) updatedData.append("image", image);

        try {
            const token = localStorage.getItem("token") || "";
            await updateProduct(productId, updatedData, token);
            refreshProducts();
            closeModal();
        } catch (err) {
            setError("Failed to update product. Please try again.");
        }
    };



    return (
        <div className="fixed top-0 left-0 w-screen h-screen bg-opacity-10 backdrop-blur-md flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-2xl w-[600px] max-w-full shadow-xl relative">
                <button
                    onClick={closeModal}
                    className="absolute top-3 right-3 text-gray-500 text-xl hover:text-gray-700"
                >
                    &times;
                </button>
                <h2 className="text-lg font-semibold text-gray-800 mb-4 text-center">Update Product</h2>
                {error && <p className="text-red-500 text-sm mb-3 text-center">{error}</p>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {[
                            { label: "Name", name: "name", type: "text", required: true },
                            { label: "Price", name: "price", type: "number", required: true },
                            { label: "Stock", name: "stock", type: "number", required: true },
                            { label: "Description", name: "description", type: "textarea" },
                            { label: "Discount Price", name: "discountPrice", type: "number" }
                        ].map(({ label, name, type, required }) => (
                            <div key={name} className="flex flex-col">
                                <label className="block text-sm font-medium text-gray-600">{label}{required && " *"}</label>
                                {type === "textarea" ? (
                                    <textarea name={name} value={formData[name as keyof typeof formData]} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-400 resize-none" rows={3}></textarea>
                                ) : (
                                    <input type={type} name={name} value={formData[name as keyof typeof formData]} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-400" required={required} />
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Labels field */}
                    <div className="flex flex-col">
                        <label className="block text-sm font-medium text-gray-600">Labels</label>
                        <input
                            type="text"
                            name="labels"
                            value={formData.labels}
                            onChange={handleLabelChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-400"
                            placeholder="Enter product labels (comma-separated)"
                        />
                    </div>

                    {/* Category Select */}
                    <div className="flex flex-col">
                        <label className="block text-sm font-medium text-gray-600">Category *</label>
                        <select name="category" value={formData.category} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-400" required>
                            <option value="">Select Category *</option>
                            {categories.map((cat) => (<option key={cat._id} value={cat._id}>{cat.name}</option>))}
                        </select>
                    </div>

                    {/* Image Upload */}
                    <div className="flex flex-col">
                        <label className="block text-sm font-medium text-gray-600">Product Image</label>
                        <input type="file" accept="image/*" onChange={handleImageChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-400" />
                        {imagePreview && <img src={imagePreview} alt="Preview" className="mt-2 w-full h-40 object-cover rounded-lg" />}
                    </div>

                    <button type="submit" className="w-full bg-black text-white py-2 rounded-lg text-sm hover:bg-gray-700 transition">Update Product</button>
                </form>
            </div>
        </div>
    );
};

export default UpdateProductModal;
