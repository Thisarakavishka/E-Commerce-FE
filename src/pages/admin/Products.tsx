import { useEffect, useState } from "react"
import { fetchProducts, toggleProductStatus, deleteProduct } from "../../services/productService"
import AddProductModal from "../../components/modals/AddProductModal"
import UpdateProductModal from "../../components/modals/UpdateProductModal"
import ViewProductModal from "../../components/modals/ViewProductModal"
import ConfirmationModal from "../../components/modals/ConfirmationModal"
import ToggleButton from "../../components/ToggleButton"
import type { Product } from "../../models/Product"
import { Eye, Pencil, Trash2, Search, ChevronDown, ChevronUp, Filter, Download, RefreshCw, ShieldAlert, } from "lucide-react"

type UserRole = "SUPER_ADMIN" | "ADMIN" | "USER"

const Products = () => {
    const token = localStorage.getItem("token")
    const [products, setProducts] = useState<Product[]>([])
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false)
    const [currentProductId, setCurrentProductId] = useState<string | null>(null)
    const [isViewModalOpen, setIsViewModalOpen] = useState(false)
    const [selectedProductId, setSelectedProductId] = useState<string | null>(null)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [productToDelete, setProductToDelete] = useState<string | null>(null)
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
    const [searchTerm, setSearchTerm] = useState("")
    const [loading, setLoading] = useState(true)
    const [sortConfig, setSortConfig] = useState<{
        key: string
        direction: "ascending" | "descending"
    } | null>(null)
    const [categoryFilter, setCategoryFilter] = useState<string | null>(null)

    // Get user role from localStorage
    const [userRole, setUserRole] = useState<UserRole>("USER")

    useEffect(() => {
        const getUserRole = () => {
            try {
                // Example: decode JWT token or get from localStorage
                const userData = localStorage.getItem("user")
                if (userData) {
                    const parsedData = JSON.parse(userData)
                    const role = parsedData.role.toUpperCase()
                    setUserRole(role as UserRole)
                }
            } catch (error) {
                console.error("Failed to get user role:", error)
                // Default to lowest permission level if there's an error
                setUserRole("USER")
            }
        }

        getUserRole()
    }, [])

    // Permission check functions based on role
    const canCreateProduct = () => ["SUPER_ADMIN", "ADMIN"].includes(userRole)
    const canUpdateProduct = () => ["SUPER_ADMIN", "ADMIN"].includes(userRole)
    const canChangeStatus = () => ["SUPER_ADMIN", "ADMIN"].includes(userRole)
    const canDeleteProduct = () => userRole === "SUPER_ADMIN"

    // Function to fetch products and update state
    const loadProducts = async () => {
        setLoading(true)
        if (token) {
            try {
                const data = await fetchProducts(token)
                setProducts(data)
                setFilteredProducts(data) // Sync filtered data with fetched data
            } catch (error) {
                console.error("Failed to fetch products:", error)
            } finally {
                setLoading(false)
            }
        } else {
            console.error("No token found")
            setLoading(false)
        }
    }

    // Load products on component mount
    useEffect(() => {
        loadProducts()
    }, [token])

    // Filter and sort products when dependencies change
    useEffect(() => {
        let result = [...products]

        // Apply search filter
        if (searchTerm) {
            const term = searchTerm.toLowerCase().trim()
            result = result.filter(
                (product) =>
                    product.name.toLowerCase().includes(term) || (product.category?.name?.toLowerCase().includes(term) ?? false),
            )
        }

        // Apply category filter
        if (categoryFilter) {
            result = result.filter((product) => product.category.name.toLowerCase() === categoryFilter.toLowerCase())
        }

        // Apply sorting
        if (sortConfig) {
            result.sort((a, b) => {
                // Handle different field types
                let aValue, bValue

                if (sortConfig.key === "price") {
                    aValue = a.price
                    bValue = b.price
                } else if (sortConfig.key === "discountPrice") {
                    aValue = a.discountPrice || 0
                    bValue = b.discountPrice || 0
                } else if (sortConfig.key === "stock") {
                    aValue = a.stock
                    bValue = b.stock
                } else if (sortConfig.key === "salesCount") {
                    aValue = a.salesCount
                    bValue = b.salesCount
                } else if (sortConfig.key === "category") {
                    aValue = a.category?.name?.toLowerCase() || ""
                    bValue = b.category?.name?.toLowerCase() || ""
                } else {
                    // Default string comparison
                    aValue = a[sortConfig.key as keyof Product]?.toString().toLowerCase() || ""
                    bValue = b[sortConfig.key as keyof Product]?.toString().toLowerCase() || ""
                }

                if (aValue < bValue) {
                    return sortConfig.direction === "ascending" ? -1 : 1
                }
                if (aValue > bValue) {
                    return sortConfig.direction === "ascending" ? 1 : -1
                }
                return 0
            })
        }

        setFilteredProducts(result)
    }, [products, searchTerm, sortConfig, categoryFilter])

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value)
    }

    const requestSort = (key: string) => {
        let direction: "ascending" | "descending" = "ascending"

        if (sortConfig && sortConfig.key === key && sortConfig.direction === "ascending") {
            direction = "descending"
        }

        setSortConfig({ key, direction })
    }

    const getSortIcon = (columnName: string) => {
        if (!sortConfig || sortConfig.key !== columnName) {
            return <ChevronDown className="w-4 h-4 opacity-30" />
        }
        return sortConfig.direction === "ascending" ? (
            <ChevronUp className="w-4 h-4" />
        ) : (
            <ChevronDown className="w-4 h-4" />
        )
    }

    const handleToggleStatus = async (id: string) => {
        if (!token) return console.error("No token found")
        if (!canChangeStatus()) {
            alert("You don't have permission to change product status")
            return
        }

        // Find the product by ID
        const productIndex = products.findIndex((product) => product._id === id)
        if (productIndex === -1) return console.error("Product not found")

        // Create a copy of the products array and toggle the isActive state (Optimistic UI update)
        const updatedProducts = [...products]
        updatedProducts[productIndex].isActive = !updatedProducts[productIndex].isActive
        setProducts(updatedProducts) // Trigger re-render

        try {
            // Call the backend service to update the product status
            const response = await toggleProductStatus(id, token)

            // Ensure backend response reflects in UI (force sync state with backend data)
            updatedProducts[productIndex].isActive = response.updatedProduct.isActive
            setProducts([...updatedProducts])
        } catch (error) {
            console.error("Failed to toggle product status", error)

            // Rollback the UI state if the API call fails
            updatedProducts[productIndex].isActive = !updatedProducts[productIndex].isActive
            setProducts([...updatedProducts])
        }
    }

    const openAddProductModal = () => {
        if (!canCreateProduct()) {
            alert("You don't have permission to add products")
            return
        }
        setIsModalOpen(true)
    }

    const closeAddModal = () => setIsModalOpen(false)

    const openUpdateProductModal = (productId: string) => {
        if (!canUpdateProduct()) {
            alert("You don't have permission to update products")
            return
        }
        setCurrentProductId(productId)
        setIsUpdateModalOpen(true)
    }

    const closeUpdateModal = () => setIsUpdateModalOpen(false)

    const openViewModal = (productId: string) => {
        setSelectedProductId(productId)
        setIsViewModalOpen(true)
    }

    const closeViewModal = () => {
        setIsViewModalOpen(false)
    }

    const handleDeleteProduct = async () => {
        if (!token || !productToDelete) return console.error("No token found")
        if (!canDeleteProduct()) {
            alert("You don't have permission to delete products")
            return
        }

        try {
            await deleteProduct(productToDelete, token) // Delete product service call
            setProducts((prevProducts) => prevProducts.filter((product) => product._id !== productToDelete)) // Optimistic UI update
            setIsDeleteModalOpen(false) // Close modal after confirmation
            setProductToDelete(null) // Reset product to delete
        } catch (error) {
            console.error("Failed to delete product", error)
            setIsDeleteModalOpen(false) // Close modal if error occurs
        }
    }

    const openDeleteModal = (productId: string) => {
        if (!canDeleteProduct()) {
            alert("You don't have permission to delete products")
            return
        }
        setProductToDelete(productId)
        setIsDeleteModalOpen(true)
    }

    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false)
        setProductToDelete(null)
    }

    // Get unique categories for filter dropdown
    const uniqueCategories = Array.from(new Set(products.map((product) => product.category?.name || ""))).filter(Boolean)

    const handleExportCSV = () => {
        const headers = [
            "Name",
            "Category",
            "Price",
            "Discount Price",
            "Stock",
            "Sales Count",
            "Status"
        ]

        const rows = filteredProducts.map((product) => [
            product.name,
            product.category?.name || "N/A",
            product.price,
            product.discountPrice || "-",
            product.stock,
            product.salesCount,
            product.isActive ? "Active" : "Inactive"
        ])

        const csvContent =
            "data:text/csv;charset=utf-8," +
            [headers, ...rows]
                .map((row) => row.map(String).map(cell => `"${cell.replace(/"/g, '""')}"`).join(","))
                .join("\n")

        const encodedUri = encodeURI(csvContent)
        const link = document.createElement("a")
        link.setAttribute("href", encodedUri)
        link.setAttribute("download", "products.csv")
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    return (
        <div className="bg-white rounded-xl shadow-sm p-6 w-full">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-baseline gap-2">
                    <h1 className="text-2xl font-bold text-gray-900">Products</h1>
                    <span className="text-gray-600 text-2xl">{products.length}</span>

                    {/* Role indicator */}
                    <div className="ml-2 flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-full text-xs font-medium">
                        <ShieldAlert className="w-3 h-3" />
                        <span>{userRole}</span>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">

                    {/* Search Button */}
                    <div className="relative flex-grow sm:flex-grow-0">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-4 w-4 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search products..."
                            className="pl-10 pr-4 py-2 w-full sm:w-64 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-gray-400"
                            value={searchTerm}
                            onChange={handleSearch}
                        />
                    </div>

                    {/* Category Filter Button */}
                    <div className="relative">
                        <select
                            className="appearance-none pl-3 pr-8 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-gray-400"
                            value={categoryFilter || ""}
                            onChange={(e) => setCategoryFilter(e.target.value || null)}
                        >
                            <option value="">All Categories</option>
                            {uniqueCategories.map((category) => (
                                <option key={category} value={category}>
                                    {category}
                                </option>
                            ))}
                        </select>
                        <Filter className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                    </div>

                    {/* Refresh Button */}
                    <button
                        onClick={loadProducts}
                        className="p-2 text-gray-500 hover:text-gray-700 border border-gray-300 rounded-lg"
                        title="Refresh products"
                    >
                        <RefreshCw className="h-4 w-4" />
                    </button>

                    {/* Download Buttno */}
                    <button
                        className="p-2 text-gray-500 hover:text-gray-700 border border-gray-300 rounded-lg"
                        title="Export products"
                        onClick={handleExportCSV}
                    >
                        <Download className="h-4 w-4" />
                    </button>

                    {/* Create Button */}
                    {canCreateProduct() && (
                        <button
                            onClick={openAddProductModal}
                            className="bg-black text-sm text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
                        >
                            + Add Product
                        </button>
                    )}
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
                </div>
            ) : (
                <>
                    <div className="overflow-x-auto -mx-6">
                        <div className="inline-block min-w-full align-middle p-6">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-black rounded-lg text-white">
                                    <tr>
                                        <th
                                            scope="col"
                                            className="px-3 py-3.5 text-left text-xs font-medium uppercase tracking-wider cursor-pointer first:rounded-tl-lg"
                                            onClick={() => requestSort("name")}
                                        >
                                            <div className="flex items-center gap-1">
                                                Name
                                                {getSortIcon("name")}
                                            </div>
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-3 py-3.5 text-left text-xs font-medium uppercase tracking-wider cursor-pointer"
                                            onClick={() => requestSort("category")}
                                        >
                                            <div className="flex items-center gap-1">
                                                Category
                                                {getSortIcon("category")}
                                            </div>
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-3 py-3.5 text-left text-xs font-medium uppercase tracking-wider cursor-pointer"
                                            onClick={() => requestSort("price")}
                                        >
                                            <div className="flex items-center gap-1">
                                                Price
                                                {getSortIcon("price")}
                                            </div>
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-3 py-3.5 text-left text-xs font-medium uppercase tracking-wider cursor-pointer"
                                            onClick={() => requestSort("discountPrice")}
                                        >
                                            <div className="flex items-center gap-1">
                                                Discount
                                                {getSortIcon("discountPrice")}
                                            </div>
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-3 py-3.5 text-left text-xs font-medium uppercase tracking-wider cursor-pointer"
                                            onClick={() => requestSort("stock")}
                                        >
                                            <div className="flex items-center gap-1">
                                                Stock
                                                {getSortIcon("stock")}
                                            </div>
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-3 py-3.5 text-left text-xs font-medium uppercase tracking-wider cursor-pointer"
                                            onClick={() => requestSort("salesCount")}
                                        >
                                            <div className="flex items-center gap-1">
                                                Sales
                                                {getSortIcon("salesCount")}
                                            </div>
                                        </th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-xs font-medium uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-3 py-3.5 text-center text-xs font-medium uppercase tracking-wider last:rounded-tr-lg"
                                        >
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {filteredProducts.length === 0 ? (
                                        <tr>
                                            <td colSpan={8} className="px-3 py-4 text-center text-sm text-gray-500">
                                                No products found
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredProducts.map((product) => (
                                            <tr key={product._id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-3 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                    {product.name}
                                                </td>
                                                <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {product.category?.name || "N/A"}
                                                </td>
                                                <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                                                    LKR {product.price.toFixed(2)}
                                                </td>
                                                <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {product.discountPrice ? `LKR ${product.discountPrice.toFixed(2)}` : "-"}
                                                </td>
                                                <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">{product.stock}</td>
                                                <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">{product.salesCount}</td>
                                                <td className="px-3 py-4 whitespace-nowrap text-center">
                                                    {canChangeStatus() ? (
                                                        <ToggleButton
                                                            isActive={product.isActive ?? false}
                                                            onToggle={() => handleToggleStatus(product._id)}
                                                        />
                                                    ) : (
                                                        <span
                                                            className={`inline-flex rounded-full px-2 text-xs font-semibold ${product.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                                                                }`}
                                                        >
                                                            {product.isActive ? "Active" : "Inactive"}
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-3 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <div className="flex items-center justify-center gap-2">
                                                        <button
                                                            onClick={() => openViewModal(product._id)}
                                                            className="text-gray-600 hover:text-gray-900 p-1 rounded-full hover:bg-gray-100"
                                                            title="View product details"
                                                        >
                                                            <Eye className="w-5 h-5" />
                                                        </button>

                                                        {canUpdateProduct() && (
                                                            <button
                                                                onClick={() => openUpdateProductModal(product._id)}
                                                                className="text-gray-600 hover:text-gray-900 p-1 rounded-full hover:bg-gray-100"
                                                                title="Edit product"
                                                            >
                                                                <Pencil className="w-5 h-5" />
                                                            </button>
                                                        )}

                                                        {canDeleteProduct() && (
                                                            <button
                                                                onClick={() => openDeleteModal(product._id)}
                                                                className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-gray-100"
                                                                title="Delete product"
                                                            >
                                                                <Trash2 className="w-5 h-5" />
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )}

            {/* Modals */}
            {isModalOpen && <AddProductModal closeModal={closeAddModal} refreshProducts={loadProducts} />}
            {isUpdateModalOpen && currentProductId && (
                <UpdateProductModal productId={currentProductId} closeModal={closeUpdateModal} refreshProducts={loadProducts} />
            )}
            {isViewModalOpen && selectedProductId && (
                <ViewProductModal productId={selectedProductId} closeModal={closeViewModal} />
            )}
            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                onConfirm={handleDeleteProduct}
                onCancel={closeDeleteModal}
                message="Are you sure you want to delete this product? This action cannot be undone."
                title="Delete Product"
            />
        </div>
    )
}

export default Products