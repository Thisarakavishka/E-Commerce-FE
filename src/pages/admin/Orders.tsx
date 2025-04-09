import { useEffect, useState } from "react"
import { fetchOrders } from "../../services/orderService"
import ViewOrderModal from "../../components/modals/ViewOrderModal"
import UpdateOrderModal from "../../components/modals/UpdateOrderModal"
import type { Order } from "../../models/Order"
import { Eye, Search, ChevronDown, ChevronUp, Filter, Download, RefreshCw, CheckCircle, Clock, XCircle, } from "lucide-react"
import { exportToCSV } from "../../utils/exportUtils"
import AnimatedCounter from "../../components/AnimatedCounter"

const Orders = () => {
    const token = localStorage.getItem("token")
    const [orders, setOrders] = useState<Order[]>([])
    const [isViewModalOpen, setIsViewModalOpen] = useState(false)
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false)
    const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null)
    const [filteredOrders, setFilteredOrders] = useState<Order[]>([])
    const [searchTerm, setSearchTerm] = useState("")
    const [loading, setLoading] = useState(true)
    const [sortConfig, setSortConfig] = useState<{
        key: string
        direction: "ascending" | "descending"
    } | null>(null)
    const [statusFilter, setStatusFilter] = useState<string | null>(null)


    const loadOrders = async () => {
        setLoading(true)
        if (token) {
            try {
                const data = await fetchOrders(token)
                setOrders(data)
                setFilteredOrders(data)
            } catch (error) {
                console.error("Failed to fetch orders:", error)
            } finally {
                setLoading(false)
            }
        } else {
            console.error("No token found")
            setLoading(false)
        }
    }

    useEffect(() => {
        loadOrders()
    }, [token])

    useEffect(() => {
        let result = [...orders]

        // Apply search filter
        if (searchTerm) {
            const term = searchTerm.toLowerCase().trim()
            result = result.filter(
                (order) => order._id.toLowerCase().includes(term) || (order.user?.email?.toLowerCase().includes(term) ?? false),
            )
        }

        // Apply status filter
        if (statusFilter) {
            result = result.filter((order) => order.status.toLowerCase() === statusFilter.toLowerCase())
        }

        // Apply sorting
        if (sortConfig) {
            result.sort((a, b) => {
                // Handle different field types
                let aValue, bValue

                if (sortConfig.key === "createdAt") {
                    aValue = new Date(a.createdAt).getTime()
                    bValue = new Date(b.createdAt).getTime()
                } else if (sortConfig.key === "totalAmount") {
                    aValue = a.totalAmount
                    bValue = b.totalAmount
                } else if (sortConfig.key === "items") {
                    aValue = a.items.length
                    bValue = b.items.length
                } else if (sortConfig.key === "status") {
                    aValue = a.status.toLowerCase()
                    bValue = b.status.toLowerCase()
                } else {
                    // Default string comparison
                    aValue = a[sortConfig.key as keyof Order]?.toString().toLowerCase() || ""
                    bValue = b[sortConfig.key as keyof Order]?.toString().toLowerCase() || ""
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

        setFilteredOrders(result)
    }, [orders, searchTerm, sortConfig, statusFilter])

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

    const openViewModal = (orderId: string) => {
        setSelectedOrderId(orderId)
        setIsViewModalOpen(true)
    }

    const closeViewModal = () => setIsViewModalOpen(false)

    const openUpdateModal = (orderId: string) => {
        setSelectedOrderId(orderId)
        setIsUpdateModalOpen(true)
    }

    const closeUpdateModal = () => setIsUpdateModalOpen(false)

    const renderStatusBadge = (status: string) => {
        switch (status.toLowerCase()) {
            case "completed":
                return (
                    <div className="flex justify-center gap-1.5 bg-green-100 text-green-700 py-1 px-3 rounded-full text-xs font-medium">
                        <CheckCircle className="w-3 h-3" />
                        <span>Completed</span>
                    </div>
                )
            case "pending":
                return (
                    <div className="flex justify-center gap-1.5 bg-yellow-100 text-yellow-700 py-1 px-3 rounded-full text-xs font-medium">
                        <Clock className="w-3 h-3" />
                        <span>Pending</span>
                    </div>
                )
            case "canceled":
                return (
                    <div className="flex justify-center gap-1.5 bg-red-100 text-red-700 py-1 px-3 rounded-full text-xs font-medium">
                        <XCircle className="w-3 h-3" />
                        <span>Canceled</span>
                    </div>
                )
            default:
                return (
                    <div className="flex justify-center gap-1.5 bg-gray-100 text-gray-700 py-1 px-3 rounded-full text-xs font-medium">
                        <span>{status}</span>
                    </div>
                )
        }
    }

    const handleExportCSV = () => {
        exportToCSV<Order>(
            filteredOrders,
            [
                { label: "Order ID", key: "_id" },
                { label: "Customer", key: (order) => order.user?.email || "N/A" },
                { label: "Items Count", key: (order) => order.items.length.toString() },
                { label: "Total Amount", key: (order) => `LKR ${order.totalAmount.toFixed(2)}` },
                { label: "Status", key: "status" },
                { label: "Payment Method", key: (order) => order.paymentMethod || "Credit Card" },
                { label: "Date", key: (order) => new Date(order.createdAt).toLocaleDateString() },
                {
                    label: "Items",
                    key: (order) => order.items.map((item) => `${item.product?.name || "Unknown"} (${item.quantity})`).join("; "),
                },
            ],
            "orders.csv",
        )
    }

    return (
        <div className="bg-white rounded-xl shadow-sm p-6 w-full">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-baseline gap-2">
                    <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
                    <AnimatedCounter value={orders.length} className="text-gray-600 text-2xl" />
                </div>

                <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">

                    {/* Search Button */}
                    <div className="relative flex-grow sm:flex-grow-0">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-4 w-4 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search orders..."
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
                            <option value="">All Statuses</option>
                            <option value="pending">Pending</option>
                            <option value="completed">Completed</option>
                            <option value="canceled">Canceled</option>
                        </select>
                        <Filter className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                    </div>

                    {/* Refresh Button */}
                    <button
                        onClick={loadOrders}
                        className="p-2 text-gray-500 hover:text-gray-700 border border-gray-300 rounded-lg"
                        title="Refresh orders"
                    >
                        <RefreshCw className="h-4 w-4" />
                    </button>

                    {/* Download Buttno */}
                    <button
                        className="p-2 text-gray-500 hover:text-gray-700 border border-gray-300 rounded-lg"
                        title="Export orders"
                        onClick={handleExportCSV}
                    >
                        <Download className="h-4 w-4" />
                    </button>
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
                                            onClick={() => requestSort("_id")}
                                        >
                                            <div className="flex items-center gap-1">
                                                Order ID
                                                {getSortIcon("_id")}
                                            </div>
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-3 py-3.5 text-left text-xs font-medium uppercase tracking-wider cursor-pointer"
                                            onClick={() => requestSort("user.email")}
                                        >
                                            <div className="flex items-center gap-1">
                                                Customer
                                                {getSortIcon("user.email")}
                                            </div>
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-3 py-3.5 text-left text-xs font-medium uppercase tracking-wider cursor-pointer"
                                            onClick={() => requestSort("items")}
                                        >
                                            <div className="flex items-center gap-1">
                                                Items
                                                {getSortIcon("items")}
                                            </div>
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-3 py-3.5 text-left text-xs font-medium uppercase tracking-wider cursor-pointer"
                                            onClick={() => requestSort("totalAmount")}
                                        >
                                            <div className="flex items-center gap-1">
                                                Total
                                                {getSortIcon("totalAmount")}
                                            </div>
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-3 py-3.5 text-left text-xs font-medium uppercase tracking-wider cursor-pointer"
                                            onClick={() => requestSort("status")}
                                        >
                                            <div className="flex items-center gap-1">
                                                Status
                                                {getSortIcon("status")}
                                            </div>
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-3 py-3.5 text-left text-xs font-medium uppercase tracking-wider cursor-pointer"
                                            onClick={() => requestSort("paymentMethod")}
                                        >
                                            <div className="flex items-center gap-1">
                                                Payment
                                                {getSortIcon("paymentMethod")}
                                            </div>
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-3 py-3.5 text-left text-xs font-medium uppercase tracking-wider cursor-pointer"
                                            onClick={() => requestSort("createdAt")}
                                        >
                                            <div className="flex items-center gap-1">
                                                Date
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
                                    {filteredOrders.length === 0 ? (
                                        <tr>
                                            <td colSpan={8} className="px-3 py-4 text-center text-sm text-gray-500">
                                                No orders found
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredOrders.map((order) => (
                                            <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-3 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                    #{order._id.substring(0, 8)}
                                                </td>
                                                <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {order.user?.email || "N/A"}
                                                </td>
                                                <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                                                    {order.items.length}
                                                </td>
                                                <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                                                    LKR {order.totalAmount.toFixed(2)}
                                                </td>
                                                <td className="px-3 py-4 whitespace-nowrap">
                                                    <div
                                                        onClick={() => order.status.toLowerCase() === "pending" && openUpdateModal(order._id)}
                                                        className={order.status.toLowerCase() === "pending" ? "cursor-pointer" : "cursor-default"}
                                                    >
                                                        {renderStatusBadge(order.status)}
                                                    </div>
                                                </td>
                                                <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {order.paymentMethod || "Credit Card"}
                                                </td>
                                                <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {new Date(order.createdAt).toLocaleDateString()}
                                                </td>
                                                <td className="px-3 py-4 whitespace-nowrap text-center text-sm font-medium">
                                                    <button
                                                        onClick={() => openViewModal(order._id)}
                                                        className="text-gray-600 hover:text-gray-900 p-1 rounded-full hover:bg-gray-100"
                                                        title="View order details"
                                                    >
                                                        <Eye className="w-5 h-5" />
                                                    </button>
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

            {/* View Order Modal */}
            {isViewModalOpen && selectedOrderId && <ViewOrderModal orderId={selectedOrderId} closeModal={closeViewModal} />}

            {/* Update Order Modal */}
            {isUpdateModalOpen && selectedOrderId && (
                <UpdateOrderModal orderId={selectedOrderId} closeModal={closeUpdateModal} reloadOrders={loadOrders} />
            )}
        </div>
    )
}

export default Orders