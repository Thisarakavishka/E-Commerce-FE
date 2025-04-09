import { useState, useEffect } from "react"
import { fetchCategoryById } from "../../services/categoryService"
import { X } from "lucide-react"

interface ViewCategoryModalProps {
    categoryId: string
    closeModal: () => void
}

const ViewCategoryModal: React.FC<ViewCategoryModalProps> = ({ categoryId, closeModal }) => {
    const [category, setCategory] = useState<{ name: string; description?: string; isActive: boolean } | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const loadCategory = async () => {
            try {
                setLoading(true)
                const token = localStorage.getItem("token") || ""
                const fetchedCategory = await fetchCategoryById(categoryId, token)
                setCategory(fetchedCategory)
            } catch (err) {
                setError("Failed to load category details.")
            } finally {
                setLoading(false)
            }
        }

        if (categoryId) {
            loadCategory()
        }
    }, [categoryId])

    // Handle backdrop click to close modal
    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            closeModal()
        }
    }

    if (loading) {
        return (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50">
                <div className="bg-white p-8 rounded-xl shadow-lg w-[90%] max-w-[500px] flex flex-col items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black mb-4"></div>
                    <p className="text-gray-600">Loading category details...</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50">
                <div className="bg-white p-8 rounded-xl shadow-lg w-[90%] max-w-[500px]">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold">Error</h2>
                        <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                    <div className="text-red-500 text-center p-4 bg-red-50 rounded-lg">{error}</div>
                    <div className="mt-6 flex justify-end">
                        <button
                            onClick={closeModal}
                            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-gray-800 transition-colors"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    if (!category) return null

    return (
        <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4 animate-in fade-in duration-200"
            onClick={handleBackdropClick}
        >
            <div className="bg-white rounded-xl shadow-xl w-full max-w-[500px] overflow-hidden">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-gray-900">Category Details</h2>
                    <button
                        onClick={closeModal}
                        className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600 font-medium">Name:</span>
                            <span className="text-gray-900">{category.name}</span>
                        </div>

                        <div className="flex justify-between items-start">
                            <span className="text-gray-600 font-medium">Description:</span>
                            <span className="text-gray-900 text-right max-w-[60%]">
                                {category.description ? category.description : "No description available"}
                            </span>
                        </div>

                        <div className="flex justify-between items-center">
                            <span className="text-gray-600 font-medium">Status:</span>
                            <span
                                className={`px-3 py-1 rounded-full text-xs font-medium ${category.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                                    }`}
                            >
                                {category.isActive ? "Active" : "Inactive"}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ViewCategoryModal