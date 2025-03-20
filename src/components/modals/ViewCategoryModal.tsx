import React, { useState, useEffect } from "react";
import { fetchCategoryById } from "../../services/categoryService";

interface ViewCategoryModalProps {
    categoryId: string;
    closeModal: () => void;
}

const ViewCategoryModal: React.FC<ViewCategoryModalProps> = ({ categoryId, closeModal }) => {
    const [category, setCategory] = useState<{ name: string; description?: string; isActive: boolean } | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadCategory = async () => {
            try {
                const token = localStorage.getItem("token") || "";
                const fetchedCategory = await fetchCategoryById(categoryId, token);
                setCategory(fetchedCategory);
            } catch (err) {
                setError("Failed to load category details.");
            }
        };

        if (categoryId) {
            loadCategory();
        }
    }, [categoryId]);

    if (error) return <div className="text-red-500 text-center">{error}</div>;

    if (!category) return <div className="text-center">Loading...</div>;

    return (
        <div className="fixed top-0 left-0 w-screen h-screen bg-opacity-50 backdrop-blur-md flex justify-center items-center z-50">
            <div className="bg-white p-8 rounded-3xl w-[400px] shadow-2xl relative">
                <button
                    onClick={closeModal}
                    className="absolute top-4 right-4 text-gray-500 text-2xl hover:text-gray-700"
                >
                    &times;
                </button>
                <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Category Details</h2>

                <div className="space-y-4">
                    <div className="flex justify-between">
                        <p className="text-gray-600 font-medium">Name:</p>
                        <p className="text-gray-800">{category.name}</p>
                    </div>

                    <div className="flex justify-between">
                        <p className="text-gray-600 font-medium">Description:</p>
                        <p className="text-gray-800">
                            {category.description ? category.description : "No description available"}
                        </p>
                    </div>

                    {/* Status Section with Badge */}
                    <div className="flex justify-between items-center">
                        <p className="text-gray-600 font-medium">Status:</p>
                        <span
                            className={`px-3 py-1 rounded text-white font-semibold ${category.isActive ? "bg-green-500" : "bg-red-500"}`}
                        >
                            {category.isActive ? "Active" : "Inactive"}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ViewCategoryModal;
