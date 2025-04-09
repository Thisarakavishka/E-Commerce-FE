import { useEffect, useState } from "react"
import { Category } from "../../models/Category"
import AddCategoryModal from "../../components/modals/AddCategoryModal"
import UpdateCategoryModal from "../../components/modals/UpdateCategoryModal"
import ViewCategoryModal from "../../components/modals/ViewCategoryModal"
import ConfirmationModal from "../../components/modals/ConfirmationModal"
import ToggleButton from "../../components/ToggleButton"
import { Eye, Pencil, Trash2, Search, ChevronDown, ChevronUp, Filter, Download, RefreshCw, ShieldAlert, } from "lucide-react"
import { deleteCategory, fetchCategories } from "../../services/categoryService"
import { exportToCSV } from "../../utils/exportUtils"
import { useRolePermissions } from "../../hooks/userRolePermissions"
import { formatUserRole } from "../../utils/formatRole"
import AnimatedCounter from "../../components/AnimatedCounter"


const Categories = () => {
    const token = localStorage.getItem("token")
    const [categories, setCategories] = useState<Category[]>([])
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false)
    const [currentCategoryId, setCurrentCategoryId] = useState<string | null>(null)
    const [isViewModalOpen, setIsViewModalOpen] = useState(false)
    const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null)
    const [filteredCategories, setFilteredCategories] = useState<Category[]>([])
    const [searchTerm, setSearchTerm] = useState("")
    const [loading, setLoading] = useState(true)
    const [sortConfig, setSortConfig] = useState<{
        key: string
        direction: "ascending" | "descending"
    } | null>(null)
    const [statusFilter, setStatusFilter] = useState<string | null>(null)
    const {
        userRole,
        canCreate: canCreateCategory,
        canUpdate: canUpdateCategory,
        canChangeStatus,
        canDelete: canDeleteCategory,
    } = useRolePermissions("category")

    // Function to fetch categories and update state
    const loadCategories = async () => {
        setLoading(true)
        if (token) {
            try {
                const data = await fetchCategories()
                setCategories(data)
                setFilteredCategories(data) // Sync filtered data with fetched data
            } catch (error) {
                console.error("Failed to fetch categories:", error)
            } finally {
                setLoading(false)
            }
        } else {
            console.error("No token found")
            setLoading(false)
        }
    }

    useEffect(() => {
        loadCategories()
    }, [token])

    // Filter and sort categories when dependencies change
    useEffect(() => {
        let result = [...categories]

        // Apply search filter
        if (searchTerm) {
            const term = searchTerm.toLowerCase().trim()
            result = result.filter(
                (category) => category.name.toLowerCase().includes(term) || category.description.toLowerCase().includes(term),
            )
        }

        // Apply status filter
        if (statusFilter) {
            const isActive = statusFilter === "active"
            result = result.filter((category) => category.isActive === isActive)
        }

        // Apply sorting
        if (sortConfig) {
            result.sort((a, b) => {
                // Handle different field types
                let aValue, bValue

                if (sortConfig.key === "isActive") {
                    aValue = a.isActive ? 1 : 0
                    bValue = b.isActive ? 1 : 0
                } else if (sortConfig.key === "createdAt" || sortConfig.key === "updatedAt") {
                    aValue = new Date(a[sortConfig.key]).getTime()
                    bValue = new Date(b[sortConfig.key]).getTime()
                } else {
                    // Default string comparison
                    aValue = a[sortConfig.key as keyof Category]?.toString().toLowerCase() || ""
                    bValue = b[sortConfig.key as keyof Category]?.toString().toLowerCase() || ""
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

        setFilteredCategories(result)
    }, [categories, searchTerm, sortConfig, statusFilter])

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
        if (!canChangeStatus) {
            alert("You don't have permission to change category status")
            return
        }

        // Find the category by ID
        const categoryIndex = categories.findIndex((category) => category._id === id)
        if (categoryIndex === -1) return console.error("Category not found")

        const updatedCategories = [...categories]
        updatedCategories[categoryIndex].isActive = !updatedCategories[categoryIndex].isActive
        setCategories(updatedCategories)

        try {
            // In a real app, uncomment the line below
            // const response = await toggleCategoryStatus(id, token)

            // For demo, simulate API response
            const updatedCategory = {
                ...updatedCategories[categoryIndex],
                updatedAt: new Date().toISOString(),
            }

            // Simulate API response
            updatedCategories[categoryIndex] = updatedCategory
            setCategories([...updatedCategories])
        } catch (error) {
            console.error("Failed to toggle category status", error)
            // Rollback UI update in case of error
            updatedCategories[categoryIndex].isActive = !updatedCategories[categoryIndex].isActive
            setCategories([...updatedCategories])
        }
    }

    const openAddCategoryModal = () => {
        if (!canCreateCategory) {
            alert("You don't have permission to add categories")
            return
        }
        setIsModalOpen(true)
    }

    const closeAddModal = () => setIsModalOpen(false)

    const openUpdateCategoryModal = (categoryId: string) => {
        if (!canUpdateCategory) {
            alert("You don't have permission to update categories")
            return
        }
        setCurrentCategoryId(categoryId)
        setIsUpdateModalOpen(true)
    }

    const closeUpdateModal = () => setIsUpdateModalOpen(false)

    const openViewModal = (categoryId: string) => {
        setSelectedCategoryId(categoryId)
        setIsViewModalOpen(true)
    }

    const closeViewModal = () => setIsViewModalOpen(false)

    const openDeleteModal = (categoryId: string) => {
        if (!canDeleteCategory) {
            alert("You don't have permission to delete categories")
            return
        }
        setCategoryToDelete(categoryId)
        setIsDeleteModalOpen(true)
    }

    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false)
        setCategoryToDelete(null)
    }

    const handleDeleteCategory = async () => {
        if (!token || !categoryToDelete) return console.error("No token found")

        try {
            await deleteCategory(categoryToDelete, token)
            setCategories((prevCategories) => prevCategories.filter((category) => category._id !== categoryToDelete))
            setIsDeleteModalOpen(false)
            setCategoryToDelete(null)
        } catch (error) {
            console.error("Failed to delete category", error)
            setIsDeleteModalOpen(false)
        }
    }

    const handleExportCSV = () => {
        exportToCSV<Category>(
            filteredCategories,
            [
                { label: "Name", key: "name" },
                { label: "Description", key: "description" },
                { label: "Status", key: (item) => (item.isActive ? "Active" : "Inactive") },
                { label: "Created By", key: "createdBy" },
                { label: "Created At", key: (item) => new Date(item.createdAt).toLocaleDateString() },
                { label: "Updated At", key: (item) => new Date(item.updatedAt).toLocaleDateString() },
            ],
            "categories.csv",
        )
    }

    return (
        <div className="bg-white rounded-xl shadow-sm p-6 w-full">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-baseline gap-2">
                    <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
                    <AnimatedCounter value={categories.length} className="text-gray-600 text-2xl" />

                    {/* Role indicator */}
                    <div className="ml-2 flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-full text-xs font-medium">
                        <ShieldAlert className="w-3 h-3" />
                        <span>{formatUserRole(userRole)}</span>
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
                            placeholder="Search categories..."
                            className="pl-10 pr-4 py-2 w-full sm:w-64 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-gray-400"
                            value={searchTerm}
                            onChange={handleSearch}
                        />
                    </div>

                    {/* Status Filter Button */}
                    <div className="relative">
                        <select
                            className="appearance-none pl-3 pr-8 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-gray-400"
                            value={statusFilter || ""}
                            onChange={(e) => setStatusFilter(e.target.value || null)}
                        >
                            <option value="">All Status</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                        <Filter className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                    </div>

                    {/* Refresh Button */}
                    <button
                        onClick={loadCategories}
                        className="p-2 text-gray-500 hover:text-gray-700 border border-gray-300 rounded-lg"
                        title="Refresh categories"
                    >
                        <RefreshCw className="h-4 w-4" />
                    </button>

                    {/* Download Buttno */}
                    <button
                        onClick={handleExportCSV}
                        className="p-2 text-gray-500 hover:text-gray-700 border border-gray-300 rounded-lg"
                        title="Export categories"
                    >
                        <Download className="h-4 w-4" />
                    </button>

                    {/* Create Button */}
                    {canCreateCategory && (
                        <button
                            onClick={openAddCategoryModal}
                            className="bg-black text-sm text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
                        >
                            + Add Category
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
                                            onClick={() => requestSort("description")}
                                        >
                                            <div className="flex items-center gap-1">
                                                Description
                                                {getSortIcon("description")}
                                            </div>
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-3 py-3.5 text-left text-xs font-medium uppercase tracking-wider cursor-pointer"
                                            onClick={() => requestSort("isActive")}
                                        >
                                            <div className="flex items-center gap-1">
                                                Status
                                                {getSortIcon("isActive")}
                                            </div>
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-3 py-3.5 text-left text-xs font-medium uppercase tracking-wider cursor-pointer"
                                            onClick={() => requestSort("createdAt")}
                                        >
                                            <div className="flex items-center gap-1">
                                                Created At
                                                {getSortIcon("createdAt")}
                                            </div>
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
                                    {filteredCategories.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="px-3 py-4 text-center text-sm text-gray-500">
                                                No categories found
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredCategories.map((category) => (
                                            <tr key={category._id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-3 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                    {category.name}
                                                </td>
                                                <td className="px-3 py-4 text-sm text-gray-500">{category.description}</td>
                                                <td className="px-3 py-4 whitespace-nowrap text-center">
                                                    {canChangeStatus ? (
                                                        <ToggleButton
                                                            isActive={category.isActive ?? false}
                                                            onToggle={() => handleToggleStatus(category._id)}
                                                        />
                                                    ) : (
                                                        <span
                                                            className={`inline-flex rounded-full px-2 text-xs font-semibold ${category.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                                                                }`}
                                                        >
                                                            {category.isActive ? "Active" : "Inactive"}
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {new Date(category.createdAt).toLocaleDateString()}
                                                </td>
                                                <td className="px-3 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <div className="flex items-center justify-center gap-2">
                                                        <button
                                                            onClick={() => openViewModal(category._id)}
                                                            className="text-gray-600 hover:text-gray-900 p-1 rounded-full hover:bg-gray-100"
                                                            title="View category details"
                                                        >
                                                            <Eye className="w-5 h-5" />
                                                        </button>

                                                        {canUpdateCategory && (
                                                            <button
                                                                onClick={() => openUpdateCategoryModal(category._id)}
                                                                className="text-gray-600 hover:text-gray-900 p-1 rounded-full hover:bg-gray-100"
                                                                title="Edit category"
                                                            >
                                                                <Pencil className="w-5 h-5" />
                                                            </button>
                                                        )}

                                                        {canDeleteCategory && (
                                                            <button
                                                                onClick={() => openDeleteModal(category._id)}
                                                                className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-gray-100"
                                                                title="Delete category"
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
            {isModalOpen && <AddCategoryModal closeModal={closeAddModal} refreshCategories={loadCategories} />}
            {isUpdateModalOpen && currentCategoryId && (
                <UpdateCategoryModal
                    categoryId={currentCategoryId}
                    closeModal={closeUpdateModal}
                    refreshCategories={loadCategories}
                />
            )}
            {isViewModalOpen && selectedCategoryId && (
                <ViewCategoryModal categoryId={selectedCategoryId} closeModal={closeViewModal} />
            )}
            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                onConfirm={handleDeleteCategory}
                onCancel={closeDeleteModal}
                message="Are you sure you want to delete this category? This action cannot be undone."
                title="Delete Category"
            />
        </div>
    )
}

export default Categories