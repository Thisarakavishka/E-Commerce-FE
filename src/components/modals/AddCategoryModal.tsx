import { useState } from "react"
import { createCategory } from "../../services/categoryService"
import { X } from "lucide-react"

interface AddCategoryModalProps {
    closeModal: () => void
    refreshCategories: () => void
}

const AddCategoryModal: React.FC<AddCategoryModalProps> = ({ closeModal, refreshCategories }) => {
    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    // Handle backdrop click to close modal
    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            closeModal()
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!name) {
            setError("Category name is required.")
            return
        }

        try {
            setLoading(true)
            const token = localStorage.getItem("token") || ""
            await createCategory({ name, description }, token)
            refreshCategories()
            closeModal()
        } catch (err) {
            setError("Failed to create category. Please try again.")
            setLoading(false)
        }
    }

    return (
        <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4 animate-in fade-in duration-200"
            onClick={handleBackdropClick}
        >
            <div className="bg-white rounded-xl shadow-xl w-full max-w-[500px] overflow-hidden">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-gray-900">Add Category</h2>
                    <button
                        onClick={closeModal}
                        className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Form */}
                <div className="p-6">
                    {error && <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">{error}</div>}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                Category Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                id="name"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-gray-400"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                                Description
                            </label>
                            <textarea
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-gray-400 resize-none"
                                rows={3}
                            ></textarea>
                        </div>

                        <div className="flex justify-end gap-3 pt-4">
                            <button
                                type="button"
                                onClick={closeModal}
                                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors text-sm"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors text-sm flex items-center justify-center min-w-[100px]"
                            >
                                {loading ? (
                                    <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin"></div>
                                ) : (
                                    "Save Category"
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default AddCategoryModal