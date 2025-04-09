import { useEffect, useState } from "react"
import { fetchCustomers } from "../../services/customerService"
import ViewCustomerModal from "../../components/modals/ViewCustomerModal"
import type { User } from "../../models/User"
import { Eye, Search, ChevronDown, ChevronUp, Filter, Download, RefreshCw } from "lucide-react"
import AnimatedCounter from "../../components/AnimatedCounter"

const Customers = () => {
    const token = localStorage.getItem("token")
    const [customers, setCustomers] = useState<User[]>([])
    const [isViewModalOpen, setIsViewModalOpen] = useState(false)
    const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null)
    const [filteredCustomers, setFilteredCustomers] = useState<User[]>([])
    const [searchTerm, setSearchTerm] = useState("")
    const [loading, setLoading] = useState(true)
    const [sortConfig, setSortConfig] = useState<{
        key: string
        direction: "ascending" | "descending"
    } | null>(null)
    const [statusFilter, setStatusFilter] = useState<string | null>(null)

    const loadCustomers = async () => {
        setLoading(true)
        if (token) {
            try {
                const data = await fetchCustomers(token)
                setCustomers(data)
                setFilteredCustomers(data)
            } catch (error) {
                console.error("Failed to fetch customers:", error)
            } finally {
                setLoading(false)
            }
        } else {
            console.error("No token found")
            setLoading(false)
        }
    }

    useEffect(() => {
        loadCustomers()
    }, [token])

    // Filter and sort customers when dependencies change
    useEffect(() => {
        let result = [...customers]

        // Apply search filter
        if (searchTerm) {
            const term = searchTerm.toLowerCase().trim()
            result = result.filter(
                (customer) => customer.name.toLowerCase().includes(term) || customer.email.toLowerCase().includes(term),
            )
        }

        // Apply status filter
        if (statusFilter) {
            const isActive = statusFilter === "active"
            result = result.filter((customer) => customer.isActive === isActive)
        }

        // Apply sorting
        if (sortConfig) {
            result.sort((a, b) => {
                // Handle different field types
                let aValue, bValue

                if (sortConfig.key === "isActive") {
                    aValue = a.isActive ? 1 : 0
                    bValue = b.isActive ? 1 : 0
                } else if (sortConfig.key === "phone") {
                    aValue = a.phone || ""
                    bValue = b.phone || ""
                } else {
                    // Default string comparison
                    aValue = a[sortConfig.key as keyof User]?.toString().toLowerCase() || ""
                    bValue = b[sortConfig.key as keyof User]?.toString().toLowerCase() || ""
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

        setFilteredCustomers(result)
    }, [customers, searchTerm, sortConfig, statusFilter])

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

    const openViewModal = (customerId: string) => {
        setSelectedCustomerId(customerId)
        setIsViewModalOpen(true)
    }

    const closeViewModal = () => setIsViewModalOpen(false)

    return (
        <div className="bg-white rounded-xl shadow-sm p-6 w-full">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-baseline gap-2">
                    <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
                    <AnimatedCounter value={customers.length} className="text-gray-600 text-2xl" />
                </div>

                <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">

                    {/* Search Button */}
                    <div className="relative flex-grow sm:flex-grow-0">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-4 w-4 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search customers..."
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
                        onClick={loadCustomers}
                        className="p-2 text-gray-500 hover:text-gray-700 border border-gray-300 rounded-lg"
                        title="Refresh customers"
                    >
                        <RefreshCw className="h-4 w-4" />
                    </button>

                    {/* Download Buttno */}
                    <button
                        className="p-2 text-gray-500 hover:text-gray-700 border border-gray-300 rounded-lg"
                        title="Export customers"
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
                                            className="px-3 py-3.5 text-left text-xs font-medium uppercase tracking-wider first:rounded-tl-lg"
                                        >
                                            #
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-3 py-3.5 text-left text-xs font-medium uppercase tracking-wider cursor-pointer"
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
                                            onClick={() => requestSort("email")}
                                        >
                                            <div className="flex items-center gap-1">
                                                Email
                                                {getSortIcon("email")}
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
                                            onClick={() => requestSort("phone")}
                                        >
                                            <div className="flex items-center gap-1">
                                                Phone
                                                {getSortIcon("phone")}
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
                                    {filteredCustomers.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="px-3 py-4 text-center text-sm text-gray-500">
                                                No customers found
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredCustomers.map((customer, index) => (
                                            <tr key={customer._id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">{index + 1}</td>
                                                <td className="px-3 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                    {customer.name}
                                                </td>
                                                <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">{customer.email}</td>
                                                <td className="px-3 py-4 whitespace-nowrap">
                                                    <span
                                                        className={`px-2 py-1 rounded-full text-xs font-medium ${customer.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                                                            }`}
                                                    >
                                                        {customer.isActive ? "Active" : "Inactive"}
                                                    </span>
                                                </td>
                                                <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">{customer.phone || "N/A"}</td>
                                                <td className="px-3 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <div className="flex items-center justify-center">
                                                        <button
                                                            onClick={() => openViewModal(customer._id)}
                                                            className="text-gray-600 hover:text-gray-900 p-1 rounded-full hover:bg-gray-100"
                                                            title="View customer details"
                                                        >
                                                            <Eye className="w-5 h-5" />
                                                        </button>
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

            {/* View Customer Modal */}
            {isViewModalOpen && selectedCustomerId && (
                <ViewCustomerModal customerId={selectedCustomerId} closeModal={closeViewModal} />
            )}
        </div>
    )
}

export default Customers
