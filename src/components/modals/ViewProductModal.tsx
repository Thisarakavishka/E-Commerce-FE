import { useState, useEffect } from "react"
import { fetchProductById } from "../../services/productService"
import type { Product } from "../../models/Product"
import { X, Tag, Package, DollarSign, Percent, ShoppingBag, Calendar } from "lucide-react"

const baseUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5001"

interface ViewProductModalProps {
    productId: string
    closeModal: () => void
}

const ViewProductModal: React.FC<ViewProductModalProps> = ({ productId, closeModal }) => {
    const [product, setProduct] = useState<Product | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const loadProduct = async () => {
            try {
                setLoading(true)
                const token = localStorage.getItem("token") || ""
                const fetchedProduct = await fetchProductById(productId, token)
                setProduct(fetchedProduct)
            } catch (err) {
                setError("Failed to load product details.")
            } finally {
                setLoading(false)
            }
        }

        if (productId) {
            loadProduct()
        }
    }, [productId])

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
                    <p className="text-gray-600">Loading product details...</p>
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

    if (!product) return null

    const imageUrl = product.image ? `${baseUrl}/${product.image}` : null
    const discountPercentage =
        product.price && product.discountPrice
            ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
            : 0

    return (
        <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4 animate-in fade-in duration-200"
            onClick={handleBackdropClick}
        >
            <div className="bg-white rounded-xl shadow-xl w-full max-w-[700px] max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-gray-900">Product Details</h2>
                    <button
                        onClick={closeModal}
                        className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Product Image */}
                        <div className="bg-gray-50 rounded-lg p-4 flex items-center justify-center">
                            {imageUrl ? (
                                <img src={imageUrl || "/placeholder.svg"} alt={product.name} className="max-h-[300px] object-contain" />
                            ) : (
                                <div className="w-full h-[200px] bg-gray-200 rounded-lg flex items-center justify-center">
                                    <Package className="w-12 h-12 text-gray-400" />
                                </div>
                            )}
                        </div>

                        {/* Product Info */}
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-xl font-bold text-gray-900">{product.name}</h3>
                                <div className="flex items-center gap-2 mt-1">
                                    <span
                                        className={`px-3 py-1 rounded-full text-xs font-medium ${product.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                                            }`}
                                    >
                                        {product.isActive ? "Active" : "Inactive"}
                                    </span>
                                    <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                                        {product.category?.name || "Uncategorized"}
                                    </span>
                                </div>
                            </div>

                            <p className="text-gray-600">{product.description}</p>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                                    <DollarSign className="w-5 h-5 text-gray-400" />
                                    <div>
                                        <p className="text-xs text-gray-500">Price</p>
                                        <p className="text-sm font-medium text-gray-900">LKR {product.price?.toFixed(2)}</p>
                                    </div>
                                </div>

                                {product.discountPrice && (
                                    <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                                        <Percent className="w-5 h-5 text-gray-400" />
                                        <div>
                                            <p className="text-xs text-gray-500">Discount Price</p>
                                            <div className="flex items-center gap-2">
                                                <p className="text-sm font-medium text-gray-900">LKR {product.discountPrice?.toFixed(2)}</p>
                                                {discountPercentage > 0 && (
                                                    <span className="text-xs bg-green-100 text-green-800 px-1.5 py-0.5 rounded">
                                                        {discountPercentage}% OFF
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                                    <Package className="w-5 h-5 text-gray-400" />
                                    <div>
                                        <p className="text-xs text-gray-500">Stock</p>
                                        <p className="text-sm font-medium text-gray-900">{product.stock}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                                    <ShoppingBag className="w-5 h-5 text-gray-400" />
                                    <div>
                                        <p className="text-xs text-gray-500">Sales</p>
                                        <p className="text-sm font-medium text-gray-900">{product.salesCount || 0}</p>
                                    </div>
                                </div>
                            </div>

                            {product.labels && product.labels.length > 0 && (
                                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                                    <Tag className="w-5 h-5 text-gray-400" />
                                    <div>
                                        <p className="text-xs text-gray-500">Labels</p>
                                        <div className="flex flex-wrap gap-2 mt-1">
                                            {product.labels.map((label, index) => (
                                                <span
                                                    key={index}
                                                    className="px-2 py-1 bg-gray-200 text-gray-700 rounded-md text-xs font-medium"
                                                >
                                                    {label}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {product.createdAt && (
                                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                                    <Calendar className="w-5 h-5 text-gray-400" />
                                    <div>
                                        <p className="text-xs text-gray-500">Created At</p>
                                        <p className="text-sm font-medium text-gray-900">
                                            {new Date(product.createdAt).toLocaleDateString(undefined, {
                                                year: "numeric",
                                                month: "long",
                                                day: "numeric",
                                            })}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ViewProductModal