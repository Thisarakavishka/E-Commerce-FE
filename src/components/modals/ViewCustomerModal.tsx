import { useState, useEffect } from "react"
import { fetchCustomerById } from "../../services/customerService"
import type { User } from "../../models/User"
import { X, UserIcon, Mail, Phone, MapPin, Calendar } from "lucide-react"

interface ViewCustomerModalProps {
    customerId: string
    closeModal: () => void
}

const ViewCustomerModal: React.FC<ViewCustomerModalProps> = ({ customerId, closeModal }) => {
    const [customer, setCustomer] = useState<User | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const loadCustomer = async () => {
            try {
                setLoading(true)
                const token = localStorage.getItem("token") || ""
                const fetchedCustomer = await fetchCustomerById(customerId, token)
                setCustomer(fetchedCustomer)
            } catch (err) {
                setError("Failed to load customer details.")
            } finally {
                setLoading(false)
            }
        }

        if (customerId) {
            loadCustomer()
        }
    }, [customerId])

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
                    <p className="text-gray-600">Loading customer details...</p>
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

    if (!customer) return null

    return (
        <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4 animate-in fade-in duration-200"
            onClick={handleBackdropClick}
        >
            <div className="bg-white rounded-xl shadow-xl w-full max-w-[500px] overflow-hidden">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-gray-900">Customer Details</h2>
                    <button
                        onClick={closeModal}
                        className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    <div className="flex flex-col items-center mb-6">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                            <UserIcon className="w-10 h-10 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900">{customer.name}</h3>
                        <span
                            className={`mt-1 px-3 py-1 rounded-full text-xs font-medium ${customer.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                                }`}
                        >
                            {customer.isActive ? "Active" : "Inactive"}
                        </span>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                            <Mail className="w-5 h-5 text-gray-400" />
                            <div>
                                <p className="text-xs text-gray-500">Email</p>
                                <p className="text-sm font-medium text-gray-900">{customer.email}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                            <Phone className="w-5 h-5 text-gray-400" />
                            <div>
                                <p className="text-xs text-gray-500">Phone</p>
                                <p className="text-sm font-medium text-gray-900">{customer.phone || "Not provided"}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                            <MapPin className="w-5 h-5 text-gray-400" />
                            <div>
                                <p className="text-xs text-gray-500">Address</p>
                                <p className="text-sm font-medium text-gray-900">{customer.address || "Not provided"}</p>
                            </div>
                        </div>

                        {customer.createdAt && (
                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                <Calendar className="w-5 h-5 text-gray-400" />
                                <div>
                                    <p className="text-xs text-gray-500">Customer Since</p>
                                    <p className="text-sm font-medium text-gray-900">
                                        {new Date(customer.createdAt).toLocaleDateString(undefined, {
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
    )
}

export default ViewCustomerModal