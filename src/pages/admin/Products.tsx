import { useEffect, useState } from "react";
import { BsEyeFill, BsPencilSquare, BsTrashFill } from "react-icons/bs";
import ToggleButton from "../../components/ToggleButton";
import { Product } from "../../models/Product";
import { fetchProducts, toggleProductStatus, deleteProduct } from "../../services/productService";
import AddProductModal from "../../components/modals/AddProductModal";
import UpdateProductModal from "../../components/modals/UpdateProductModal";
import ViewProductModal from "../../components/modals/ViewProductModal";
import ConfirmationModal from "../../components/modals/ConfirmationModal";


const Products = () => {
    const token = localStorage.getItem("token");
    const [products, setProducts] = useState<Product[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [currentProductId, setCurrentProductId] = useState<string | null>(null);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [productToDelete, setProductToDelete] = useState<string | null>(null);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [searchTerm, setSearchTerm] = useState("");


    // Function to fetch products and update state
    const loadProducts = async () => {
        if (token) {
            try {
                const data = await fetchProducts(token);
                setProducts(data);
                setFilteredProducts(data); // Sync filtered data with fetched data
            } catch (error) {
                console.error("Failed to fetch products:", error);
            }
        } else {
            console.error("No token found");
        }
    };

    // Load products on component mount
    useEffect(() => {
        loadProducts();
    }, [token]);

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        const term = event.target.value.toLowerCase().trim();
        setSearchTerm(term);

        if (!term) {
            setFilteredProducts(products);
            return;
        }

        const filtered = products.filter((product) =>
            product.name.toLowerCase().includes(term) ||
            (product.category?.name?.toLowerCase().includes(term) ?? false)
        );

        setFilteredProducts(filtered);
    };

    const handleToggleStatus = async (id: string) => {
        if (!token) return console.error("No token found");

        // Find the product by ID
        const productIndex = products.findIndex((product) => product._id === id);
        if (productIndex === -1) return console.error("Product not found");

        // Create a copy of the products array and toggle the isActive state (Optimistic UI update)
        const updatedProducts = [...products];
        updatedProducts[productIndex].isActive = !updatedProducts[productIndex].isActive;
        setProducts(updatedProducts); // Trigger re-render

        try {
            // Call the backend service to update the product status
            const response = await toggleProductStatus(id, token);

            // Ensure backend response reflects in UI (force sync state with backend data)
            updatedProducts[productIndex].isActive = response.updatedProduct.isActive;
            setProducts([...updatedProducts]);
        } catch (error) {
            console.error("Failed to toggle product status", error);

            // Rollback the UI state if the API call fails
            updatedProducts[productIndex].isActive = !updatedProducts[productIndex].isActive;
            setProducts([...updatedProducts]);
        }
    };

    const openAddProductModal = () => setIsModalOpen(true);
    const closeAddModal = () => setIsModalOpen(false);

    const openUpdateProductModal = (productId: string) => {
        setCurrentProductId(productId);
        setIsUpdateModalOpen(true);
    };
    const closeUpdateModal = () => setIsUpdateModalOpen(false);

    const openViewModal = (productId: string) => {
        setSelectedProductId(productId);
        setIsViewModalOpen(true);
    };

    const closeViewModal = () => { setIsViewModalOpen(false); };

    const handleDeleteProduct = async () => {
        if (!token || !productToDelete) return console.error("No token found");

        try {
            await deleteProduct(productToDelete, token); // Delete product service call
            setProducts(prevProducts => prevProducts.filter(product => product._id !== productToDelete)); // Optimistic UI update
            setIsDeleteModalOpen(false); // Close modal after confirmation
            setProductToDelete(null); // Reset product to delete
        } catch (error) {
            console.error("Failed to delete product", error);
            setIsDeleteModalOpen(false); // Close modal if error occurs
        }
    };

    const openDeleteModal = (productId: string) => {
        setProductToDelete(productId);
        setIsDeleteModalOpen(true);
    };

    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setProductToDelete(null);
    };


    return (
        <div className="p-2">
            <h3 className="text-sm text-gray-500 px-2">All Products</h3>
            <hr className="my-2 border-gray-200" />
            <div className="flex justify-between items-center mt-3 px-2">
                <div className="flex items-baseline gap-2">
                    <h1 className="text-2xl font-bold text-black">Products</h1>
                    <span className="text-gray-600 text-2xl">{products.length}</span>
                </div>

                <div className="flex items-center gap-2">
                    <input
                        type="text"
                        placeholder="Search Products"
                        className="p-2 border px-5 text-sm border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-600 w-80"
                        value={searchTerm}
                        onChange={handleSearch}
                    />

                    <button
                        onClick={openAddProductModal}
                        className="bg-black text-sm text-white px-4 py-2 rounded-md hover:bg-gray-700"
                    >
                        + Add Product
                    </button>
                </div>
            </div>

            <div className="mt-4 px-1">
                <table className="min-w-full table-auto border-collapse border border-gray-200 shadow-lg rounded-lg overflow-hidden">
                    <thead className="bg-black text-white">
                        <tr>
                            <th className="p-3 text-left text-xs font-semibold">Name</th>
                            <th className="p-3 text-center text-xs font-semibold">Category</th>
                            <th className="p-3 text-center text-xs font-semibold">Price</th>
                            <th className="p-3 text-center text-xs font-semibold">Stock</th>
                            <th className="p-3 text-center text-xs font-semibold">Sales Count</th>
                            <th className="p-3 text-center text-xs font-semibold">Status</th>
                            <th className="p-3 text-center text-xs font-semibold">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredProducts.map(product => (
                            <tr key={product._id} className="hover:bg-gray-100 transition duration-150">
                                <td className="p-3 text-sm">{product.name}</td>
                                <td className="p-3 text-center text-sm">{product.category.name}</td>
                                <td className="p-3 text-center text-sm">${product.price}</td>
                                <td className="p-3 text-center text-sm">{product.stock}</td>
                                <td className="p-3 text-center text-sm">{product.salesCount}</td>
                                <td className="p-3 text-center text-sm">
                                    <ToggleButton
                                        isActive={product.isActive ?? false}
                                        onToggle={() => handleToggleStatus(product._id)}
                                    />
                                </td>
                                <td className="p-3 text-center text-lg space-x-3">
                                    <button onClick={() => openViewModal(product._id)}>
                                        <BsEyeFill />
                                    </button>
                                    <button onClick={() => openUpdateProductModal(product._id)}>
                                        <BsPencilSquare />
                                    </button>
                                    <button
                                        className="text-red-500"
                                        onClick={() => openDeleteModal(product._id)}>
                                        <BsTrashFill />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isModalOpen &&
                <AddProductModal
                    closeModal={closeAddModal}
                    refreshProducts={loadProducts}
                />}
            {isUpdateModalOpen && currentProductId &&
                <UpdateProductModal
                    productId={currentProductId}
                    closeModal={closeUpdateModal}
                    refreshProducts={loadProducts}
                />}
            {isViewModalOpen && selectedProductId && (
                <ViewProductModal
                    productId={selectedProductId}
                    closeModal={closeViewModal}
                />
            )}
            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                onConfirm={handleDeleteProduct}
                onCancel={closeDeleteModal}
                message="Are you sure you want to delete this product? This action cannot be undone."
                title="Delete Product"
            />
        </div>
    );
};

export default Products;
