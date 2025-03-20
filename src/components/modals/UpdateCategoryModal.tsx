import React, { useState, useEffect } from "react";
import { fetchCategoryById, updateCategory } from "../../services/categoryService";

interface UpdateCategoryModalProps {
    categoryId: string;
    closeModal: () => void;
    refreshCategories: () => void;
}

const UpdateCategoryModal: React.FC<UpdateCategoryModalProps> = ({ categoryId, closeModal, refreshCategories }) => {
    const [formData, setFormData] = useState({
        name: "",
        description: "",
    });
    const [error, setError] = useState("");

    useEffect(() => {
        const loadCategory = async () => {
            try {
                const token = localStorage.getItem("token") || "";
                const category = await fetchCategoryById(categoryId, token);

                setFormData({
                    name: category.name,
                    description: category.description || "",
                });
            } catch (err) {
                setError("Failed to load category details.");
            }
        };

        loadCategory();
    }, [categoryId]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name) {
            setError("Category name is required.");
            return;
        }

        try {
            const token = localStorage.getItem("token") || "";
            await updateCategory(categoryId, formData, token);
            refreshCategories();
            closeModal();
        } catch (err) {
            setError("Failed to update category. Please try again.");
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
                <h2 className="text-lg font-semibold text-gray-800 mb-4 text-center">Update Category</h2>
                {error && <p className="text-red-500 text-sm mb-3 text-center">{error}</p>}
                <form onSubmit={handleSubmit} className="space-y-2">
                    <input
                        type="text"
                        name="name"
                        placeholder="Category Name *"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-400"
                        required
                    />
                    <textarea
                        name="description"
                        placeholder="Description"
                        value={formData.description}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-400 resize-none"
                        rows={3}
                    ></textarea>
                    <button type="submit" className="w-full bg-black text-white py-2 rounded-lg text-sm hover:bg-gray-700 transition">
                        Update Category
                    </button>
                </form>
            </div>
        </div>
    );
};

export default UpdateCategoryModal;
