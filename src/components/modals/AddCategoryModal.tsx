import React, { useState } from "react";
import { createCategory } from "../../services/categoryService";

interface AddCategoryModalProps {
    closeModal: () => void;
    refreshCategories: () => void;
}

const AddCategoryModal: React.FC<AddCategoryModalProps> = ({ closeModal, refreshCategories }) => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!name) {
            setError("Category name is required.");
            return;
        }

        try {
            const token = localStorage.getItem("token") || "";
            await createCategory({ name, description }, token);
            refreshCategories();
            closeModal();
        } catch (err) {
            setError("Failed to create category. Please try again.");
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
                <h2 className="text-lg font-semibold text-gray-800 mb-4 text-center">Add Category</h2>
                {error && <p className="text-red-500 text-sm mb-3 text-center">{error}</p>}
                <form onSubmit={handleSubmit} className="space-y-2">
                    <input
                        type="text"
                        placeholder="Category Name *"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-400"
                        required
                    />
                    <textarea
                        placeholder="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-400 resize-none"
                        rows={3}
                    ></textarea>
                    <button type="submit" className="w-full bg-black text-white py-2 rounded-lg text-sm hover:bg-gray-700 transition">
                        Save Category
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddCategoryModal;
