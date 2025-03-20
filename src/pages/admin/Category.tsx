import { useEffect, useState } from "react";
import { BsEyeFill, BsPencilSquare, BsTrashFill } from "react-icons/bs";
import ToggleButton from "../../components/ToggleButton";
import { Category } from "../../models/Category";
import { fetchCategories, toggleCategoryStatus, deleteCategory } from "../../services/categoryService";
import AddCategoryModal from "../../components/modals/AddCategoryModal";
import UpdateCategoryModal from "../../components/modals/UpdateCategoryModal";
import ViewCategoryModal from "../../components/modals/ViewCategoryModal";
import ConfirmationModal from "../../components/modals/ConfirmationModal";

const Categories = () => {
    const token = localStorage.getItem("token");
    const [categories, setCategories] = useState<Category[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [currentCategoryId, setCurrentCategoryId] = useState<string | null>(null);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);
    const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
    const [searchTerm, setSearchTerm] = useState("");

    // Function to fetch categories and update state
    const loadCategories = async () => {
        if (token) {
            try {
                const data = await fetchCategories();
                setCategories(data);
                setFilteredCategories(data); // Sync filtered data with fetched data
            } catch (error) {
                console.error("Failed to fetch categories:", error);
            }
        } else {
            console.error("No token found");
        }
    };

    useEffect(() => {
        loadCategories();
    }, [token]);

    // Handle search functionality
    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        const term = event.target.value.toLowerCase().trim();
        setSearchTerm(term);

        if (!term) {
            setFilteredCategories(categories);
            return;
        }

        const filtered = categories.filter((category) =>
            category.name.toLowerCase().includes(term)
        );

        setFilteredCategories(filtered);
    };

    const handleToggleStatus = async (id: string) => {
        if (!token) return console.error("No token found");

        // Find the category by ID
        const categoryIndex = categories.findIndex((category) => category._id === id);
        if (categoryIndex === -1) return console.error("Category not found");

        const updatedCategories = [...categories];
        updatedCategories[categoryIndex].isActive = !updatedCategories[categoryIndex].isActive;
        setCategories(updatedCategories);

        try {
            const response = await toggleCategoryStatus(id, token);
            updatedCategories[categoryIndex].isActive = response.updatedCategory.isActive;
            setCategories([...updatedCategories]);
        } catch (error) {
            console.error("Failed to toggle category status", error);
            // Rollback UI update in case of error
            updatedCategories[categoryIndex].isActive = !updatedCategories[categoryIndex].isActive;
            setCategories([...updatedCategories]);
        }
    };


    const openAddCategoryModal = () => setIsModalOpen(true);
    const closeAddModal = () => setIsModalOpen(false);

    const openUpdateCategoryModal = (categoryId: string) => {
        setCurrentCategoryId(categoryId);
        setIsUpdateModalOpen(true);
    };
    const closeUpdateModal = () => setIsUpdateModalOpen(false);

    const openViewModal = (categoryId: string) => {
        setSelectedCategoryId(categoryId);
        setIsViewModalOpen(true);
    };
    const closeViewModal = () => setIsViewModalOpen(false);

    const openDeleteModal = (categoryId: string) => {
        setCategoryToDelete(categoryId);
        setIsDeleteModalOpen(true);
    };
    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setCategoryToDelete(null);
    };

    const handleDeleteCategory = async () => {
        if (!token || !categoryToDelete) return console.error("No token found");

        try {
            await deleteCategory(categoryToDelete, token);
            setCategories(prevCategories => prevCategories.filter(category => category._id !== categoryToDelete)); // Optimistic UI update
            setIsDeleteModalOpen(false); // Close modal after confirmation
            setCategoryToDelete(null); // Reset category to delete
        } catch (error) {
            console.error("Failed to delete category", error);
            setIsDeleteModalOpen(false); // Close modal if error occurs
        }
    };

    return (
        <div className="p-2">
            <h3 className="text-sm text-gray-500 px-2">All Categories</h3>
            <hr className="my-2 border-gray-200" />
            <div className="flex justify-between items-center mt-3 px-2">
                <div className="flex items-baseline gap-2">
                    <h1 className="text-2xl font-bold text-black">Categories</h1>
                    <span className="text-gray-600 text-2xl">{categories.length}</span>
                </div>

                <div className="flex items-center gap-2">
                    <input
                        type="text"
                        placeholder="Search Categories"
                        className="p-2 border px-5 text-sm border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-600 w-80"
                        value={searchTerm}
                        onChange={handleSearch}
                    />

                    <button
                        onClick={openAddCategoryModal}
                        className="bg-black text-sm text-white px-4 py-2 rounded-md hover:bg-gray-700"
                    >
                        + Add Category
                    </button>
                </div>
            </div>

            <div className="mt-4 px-1">
                <table className="min-w-full table-auto border-collapse border border-gray-200 shadow-lg rounded-lg overflow-hidden">
                    <thead className="bg-black text-white">
                        <tr>
                            <th className="p-3 text-left text-xs font-semibold">Name</th>
                            <th className="p-3 text-center text-xs font-semibold">Status</th>
                            <th className="p-3 text-center text-xs font-semibold">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredCategories.map(category => (
                            <tr key={category._id} className="hover:bg-gray-100 transition duration-150">
                                <td className="p-3 text-sm">{category.name}</td>
                                <td className="p-3 text-center text-sm">
                                    <ToggleButton
                                        isActive={category.isActive ?? false}
                                        onToggle={() => handleToggleStatus(category._id)}
                                    />
                                </td>
                                <td className="p-3 text-center text-lg space-x-3">
                                    <button onClick={() => openViewModal(category._id)}>
                                        <BsEyeFill />
                                    </button>
                                    <button onClick={() => openUpdateCategoryModal(category._id)}>
                                        <BsPencilSquare />
                                    </button>
                                    <button className="text-red-500" onClick={() => openDeleteModal(category._id)}>
                                        <BsTrashFill />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isModalOpen && <AddCategoryModal closeModal={closeAddModal} refreshCategories={loadCategories} />}
            {isUpdateModalOpen && currentCategoryId && (
                <UpdateCategoryModal
                    categoryId={currentCategoryId}
                    closeModal={closeUpdateModal}
                    refreshCategories={loadCategories}
                />
            )}
            {isViewModalOpen && selectedCategoryId && (
                <ViewCategoryModal
                    categoryId={selectedCategoryId}
                    closeModal={closeViewModal}
                />
            )}
            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                onConfirm={handleDeleteCategory}
                onCancel={closeDeleteModal}
                message="Are you sure you want to delete this category? This action cannot be undone."
                title="Delete Category"
            />
        </div>
    );
};

export default Categories;
