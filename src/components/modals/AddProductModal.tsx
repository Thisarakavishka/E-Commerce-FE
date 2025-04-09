import { useState, useEffect } from "react"
import { fetchActiveCategories } from "../../services/categoryService"
import { createProduct } from "../../services/productService"
import { X, Upload } from "lucide-react"

interface AddProductModalProps {
    closeModal: () => void
    refreshProducts: () => void
}

const AddProductModal: React.FC<AddProductModalProps> = ({ closeModal, refreshProducts }) => {
    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [price, setPrice] = useState("")
    const [discountPrice, setDiscountPrice] = useState("")
    const [category, setCategory] = useState("")
    const [categories, setCategories] = useState<{ _id: string; name: string }[]>([])
    const [stock, setStock] = useState("")
    const [image, setImage] = useState<File | null>(null)
    const [imagePreview, setImagePreview] = useState<string | null>(null)
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const loadCategories = async () => {
            try {
                const fetchedCategories = await fetchActiveCategories()
                setCategories(fetchedCategories)
            } catch (err) {
                setError("Failed to load categories. Please try again.")
            }
        }
        loadCategories()
    }, [])

    // Handle backdrop click to close modal
    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            closeModal()
        }
    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0]
            setImage(file)
            setImagePreview(URL.createObjectURL(file))
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!name || !price || !category || !stock) {
            setError("Please fill in all required fields.")
            return
        }

        const formData = new FormData()
        formData.append("name", name)
        formData.append("description", description)
        formData.append("price", price)
        formData.append("discountPrice", discountPrice)
        formData.append("category", category)
        formData.append("stock", stock)
        if (image) formData.append("image", image)

        try {
            setLoading(true)
            const token = localStorage.getItem("token") || ""
            await createProduct(formData, token)
            refreshProducts()
            closeModal()
        } catch (err) {
            setError("Failed to create product. Please try again.")
            setLoading(false)
        }
    }

    return (
        <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4 animate-in fade-in duration-200"
            onClick={handleBackdropClick}
        >
            <div className="bg-white rounded-xl shadow-xl w-full max-w-[600px] max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-gray-900">Add Product</h2>
                    <button
                        onClick={closeModal}
                        className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Form */}
                <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
                    {error && <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">{error}</div>}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                Product Name <span className="text-red-500">*</span>
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

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                                    Price <span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="price"
                                    type="number"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-gray-400"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="discountPrice" className="block text-sm font-medium text-gray-700">
                                    Discount Price
                                </label>
                                <input
                                    id="discountPrice"
                                    type="number"
                                    value={discountPrice}
                                    onChange={(e) => setDiscountPrice(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-gray-400"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                                    Category <span className="text-red-500">*</span>
                                </label>
                                <select
                                    id="category"
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-gray-400"
                                    required
                                >
                                    <option value="">Select Category</option>
                                    {categories.map((cat) => (
                                        <option key={cat._id} value={cat._id}>
                                            {cat.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="stock" className="block text-sm font-medium text-gray-700">
                                    Stock <span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="stock"
                                    type="number"
                                    value={stock}
                                    onChange={(e) => setStock(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-gray-400"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="image" className="block text-sm font-medium text-gray-700">
                                Product Image
                            </label>
                            <div className="border border-dashed border-gray-300 rounded-lg p-4">
                                <input id="image" type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                                {imagePreview ? (
                                    <div className="space-y-4">
                                        <img
                                            src={imagePreview || "/placeholder.svg"}
                                            alt="Preview"
                                            className="w-full h-48 object-contain rounded-lg"
                                        />
                                        <div className="flex justify-center">
                                            <label
                                                htmlFor="image"
                                                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors text-sm cursor-pointer flex items-center gap-2"
                                            >
                                                <Upload className="w-4 h-4" />
                                                Change Image
                                            </label>
                                        </div>
                                    </div>
                                ) : (
                                    <label htmlFor="image" className="flex flex-col items-center justify-center h-48 cursor-pointer">
                                        <Upload className="w-8 h-8 text-gray-400 mb-2" />
                                        <span className="text-sm text-gray-500">Click to upload an image</span>
                                        <span className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP up to 5MB</span>
                                    </label>
                                )}
                            </div>
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
                                    "Save Product"
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default AddProductModal