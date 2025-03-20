import React, { useState, useEffect } from "react";
import { fetchProductById } from "../../services/productService";
import { Product } from "../../models/Product";

const baseUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5001";

interface ViewProductModalProps {
    productId: string;
    closeModal: () => void;
}

const ViewProductModal: React.FC<ViewProductModalProps> = ({ productId, closeModal }) => {
    const [product, setProduct] = useState<Product | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadProduct = async () => {
            try {
                const token = localStorage.getItem("token") || "";
                const fetchedProduct = await fetchProductById(productId, token);
                setProduct(fetchedProduct);
            } catch (err) {
                setError("Failed to load product details.");
            }
        };

        if (productId) {
            loadProduct();
        }
    }, [productId]);

    if (error) return <div>Error: {error}</div>;

    if (!product) return <div>Loading...</div>;

    const imageUrl = product.image ? `${baseUrl}/${product.image}` : null;

    return (
        <div className="fixed top-0 left-0 w-screen h-screen bg-opacity-50 backdrop-blur-md flex justify-center items-center z-50">
            <div className="bg-white p-8 rounded-3xl w-[450px] shadow-2xl relative">
                <button
                    onClick={closeModal}
                    className="absolute top-4 right-4 text-gray-500 text-2xl hover:text-gray-700"
                >
                    &times;
                </button>
                <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Product Details</h2>

                <div className="space-y-4">
                    <div className="flex justify-between">
                        <p className="text-gray-600 font-medium">Name:</p>
                        <p className="text-gray-800">{product.name}</p>
                    </div>

                    <div className="flex justify-between">
                        <p className="text-gray-600 font-medium">Description:</p>
                        <p className="text-gray-800">{product.description}</p>
                    </div>

                    <div className="flex justify-between">
                        <p className="text-gray-600 font-medium">Price:</p>
                        <p className="text-gray-800">${product.price}</p>
                    </div>

                    <div className="flex justify-between">
                        <p className="text-gray-600 font-medium">Discount Price:</p>
                        <p className="text-gray-800">{product.discountPrice ? `$${product.discountPrice}` : "0"}</p>
                    </div>

                    <div className="flex justify-between">
                        <p className="text-gray-600 font-medium">Category:</p>
                        <p className="text-gray-800">{product.category.name}</p>
                    </div>

                    <div className="flex justify-between">
                        <p className="text-gray-600 font-medium">Stock:</p>
                        <p className="text-gray-800">{product.stock}</p>
                    </div>

                    <div className="flex justify-between">
                        <p className="text-gray-600 font-medium">Sales Count:</p>
                        <p className="text-gray-800">{product.salesCount}</p>
                    </div>

                    <div className="flex justify-between items-center">
                        <p className="text-gray-600 font-medium">Status:</p>
                        <span
                            className={`px-3 py-1 rounded text-white font-semibold ${product.isActive ? "bg-green-500" : "bg-red-500"
                                }`}
                        >
                            {product.isActive ? "Active" : "Inactive"}
                        </span>
                    </div>

                    {imageUrl ? (
                        <div className="mt-4">
                            <img
                                src={imageUrl}
                                alt={product.name}
                                className="w-full h-48 object-cover rounded-lg shadow-md"
                            />
                        </div>
                    ) : (
                        <p className="text-gray-500 text-center mt-4">No image available</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ViewProductModal;
