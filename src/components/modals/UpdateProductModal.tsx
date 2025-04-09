import { useState, useEffect } from "react"
import { fetchCategories } from "../../services/categoryService"
import { updateProduct, fetchProductById } from "../../services/productService"
import { X, Upload } from "lucide-react"

const baseUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5001"

interface UpdateProductModalProps {
    productId: string
    closeModal: () => void
    refreshProducts: () => void
}

const UpdateProductModal: React.FC<UpdateProductModalProps> = ({ productId, closeModal, refreshProducts }) => {
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        discountPrice: "",
        category: "",
        stock: "",
        labels: "",
    })
    const [categories, setCategories] = useState<{ _id: string; name: string }[]>([])
    const [image, setImage] = useState<File | null>(null)
    const [imagePreview, setImagePreview] = useState<string | null>(null)
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(true)
    const [updating, setUpdating] = useState(false)

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true)
                const token = localStorage.getItem("token") || ""

                // Load product and categories in parallel
                const [product, fetchedCategories] = await Promise.all([
                    fetchProductById(productId, token),
                    fetchCategories(),
                ])

                // Set form data
                setFormData({
                    name: product.name,
                    description: product.description,
                    price: product.price,
                    discountPrice: product.discountPrice || "",
                    category: product.category._id,
                    stock: product.stock,
                    labels: product.labels ? product.labels.join(", ") : "",
                })

                // Set categories
                setCategories(fetchedCategories)

                // Set image preview
                if (product.image) setImagePreview(`${baseUrl}/${product.image}`)

                setLoading(false)
            } catch (err) {
                setError("Failed to load product details.")
                setLoading(false)
            }
        }

        loadData()
    }, [productId])

    // Handle backdrop click to close modal
    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            closeModal()
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
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

        const { name, price, category, stock } = formData

        if (!name || !price || !category || !stock) {
            setError("Please fill in all required fields.")
            return
        }

        const updatedData = new FormData()
        Object.entries(formData).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                updatedData.append(key, value)
            }
        })

        if (image) updatedData.append("image", image)

        try {
            setUpdating(true)
            const token = localStorage.getItem("token") || ""
            await updateProduct(productId, updatedData, token)
            refreshProducts()
            closeModal()
        } catch (err) {
            setError("Failed to update product. Please try again.")
            setUpdating(false)
        }
    }

    return (
        <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4 animate-in fade-in duration-200"
            onClick={handleBackdropClick}
        >
            <div className="bg-white rounded-xl shadow-xl w-full max-w-[700px] max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-gray-900">Update Product</h2>
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

                    {loading ? (
                        <div className="flex justify-center items-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black mb-4"></div>
                            <p className="text-gray-600 ml-3">Loading product details...</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                        Product Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        id="name"
                                        name="name"
                                        type="text"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-gray-400"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                                        Category <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        id="category"
                                        name="category"
                                        value={formData.category}
                                        onChange={handleChange}
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
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                                    Description
                                </label>
                                <textarea
                                    id="description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-gray-400 resize-none"
                                    rows={3}
                                ></textarea>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                                        Price <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        id="price"
                                        name="price"
                                        type="number"
                                        value={formData.price}
                                        onChange={handleChange}
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
                                        name="discountPrice"
                                        type="number"
                                        value={formData.discountPrice}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-gray-400"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="stock" className="block text-sm font-medium text-gray-700">
                                        Stock <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        id="stock"
                                        name="stock"
                                        type="number"
                                        value={formData.stock}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-gray-400"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="labels" className="block text-sm font-medium text-gray-700">
                                    Labels (comma-separated)
                                </label>
                                <input
                                    id="labels"
                                    name="labels"
                                    type="text"
                                    value={formData.labels}
                                    onChange={handleChange}
                                    placeholder="e.g. new, featured, sale"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-gray-400"
                                />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="image" className="block text-sm font-medium text-gray-700">
                                    Product Image
                                </label>
                                <div className="border border-dashed border-gray-300 rounded-lg p-4">
                                    <input
                                        id="image"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="hidden"
                                    />
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
                                        <label
                                            htmlFor="image"
                                            className="flex flex-col items-center justify-center h-48 cursor-pointer"
                                        >
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
                                    disabled={updating}
                                    className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors text-sm flex items-center justify-center min-w-[100px]"
                                >
                                    {updating ? (
                                        <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin"></div>
                                    ) : (
                                        "Update Product"
                                    )}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    )
}

export default UpdateProductModal