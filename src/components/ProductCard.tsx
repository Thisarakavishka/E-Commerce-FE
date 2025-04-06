import type React from "react"
import { ShoppingCart } from "lucide-react"
import type { Product } from "../models/Product"

interface ProductCardProps {
  product: Product
  onAddToCart: (product: Product) => void
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  const baseUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5001"
  const imageUrl = product.image ? `${baseUrl}/${product.image}` : null

  return (
    <div className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-100">
      {/* Image container */}
      <div className="relative h-64 overflow-hidden bg-gray-50">
        {imageUrl ? (
          <img
            src={imageUrl || "/placeholder.svg"}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <p className="text-gray-400 text-sm">No image available</p>
          </div>
        )}

        {/* Labels */}
        {(product.labels?.length ?? 0) > 0 && (
          <div className="absolute top-3 left-3 flex flex-wrap gap-2">
            {product.labels?.map((label, index) => (
              <span key={index} className="bg-black text-white text-xs font-medium px-2 py-1 rounded-md capitalize">
                {label}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="mb-2">
          <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">{product.category.name}</p>
          <h2 className="text-gray-900 font-semibold mt-1 line-clamp-1">{product.name}</h2>
          <p className="text-gray-500 text-sm mt-1 line-clamp-2">{product.description}</p>
        </div>

        {/* Price */}
        <div className="mt-3 mb-4">
          {product.discountPrice ? (
            <div className="flex items-center gap-2">
              <p className="text-lg font-bold text-gray-900">LKR {product.price}</p>
              <p className="text-sm text-red-500 line-through">LKR {product.discountPrice}</p>
            </div>
          ) : (
            <p className="text-lg font-bold text-gray-900">LKR {product.price}</p>
          )}
        </div>

        {/* Add to cart button */}
        <button
          onClick={() => onAddToCart(product)}
          className="w-full bg-black hover:bg-gray-800 text-white font-medium py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <ShoppingCart className="w-4 h-4" />
          <span>Add to Cart</span>
        </button>
      </div>
    </div>
  )
}

export default ProductCard

