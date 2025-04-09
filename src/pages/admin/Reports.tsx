"use client"

import { useState } from "react"
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    LineChart,
    Line,
} from "recharts"
import { Download, Calendar, Filter, RefreshCw, FileText, BarChart2, PieChartIcon, TrendingUp } from "lucide-react"

// Mock data for reports
const salesData = [
    { name: "Jan", sales: 4000 },
    { name: "Feb", sales: 3000 },
    { name: "Mar", sales: 5000 },
    { name: "Apr", sales: 2780 },
    { name: "May", sales: 1890 },
    { name: "Jun", sales: 2390 },
    { name: "Jul", sales: 3490 },
]

const categoryData = [
    { name: "T-Shirts", value: 400 },
    { name: "Hoodies", value: 300 },
    { name: "Pants", value: 200 },
    { name: "Accessories", value: 100 },
]

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"]

const ReportsPage = () => {
    const [reportType, setReportType] = useState("sales")
    const [dateRange, setDateRange] = useState("last30days")

    // Handle report generation
    const generateReport = () => {
        console.log("Generating report:", { reportType, dateRange })
        // In a real app, this would fetch data from the backend
    }

    // Handle report download
    const downloadReport = (format: string) => {
        console.log("Downloading report in format:", format)
        // In a real app, this would trigger a download
    }

    return (
        <div className="bg-white rounded-xl shadow-sm p-6 w-full">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Reports</h1>
            <p className="text-gray-500 mb-8">Generate and analyze business reports</p>

            {/* Report Controls */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div className="flex flex-wrap items-center gap-3">
                    <div className="relative">
                        <select
                            className="appearance-none pl-3 pr-8 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-gray-400"
                            value={reportType}
                            onChange={(e) => setReportType(e.target.value)}
                        >
                            <option value="sales">Sales Report</option>
                            <option value="products">Product Performance</option>
                            <option value="customers">Customer Analysis</option>
                            <option value="inventory">Inventory Status</option>
                        </select>
                        <Filter className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                    </div>

                    <div className="relative">
                        <select
                            className="appearance-none pl-3 pr-8 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-gray-400"
                            value={dateRange}
                            onChange={(e) => setDateRange(e.target.value)}
                        >
                            <option value="today">Today</option>
                            <option value="yesterday">Yesterday</option>
                            <option value="last7days">Last 7 Days</option>
                            <option value="last30days">Last 30 Days</option>
                            <option value="thisMonth">This Month</option>
                            <option value="lastMonth">Last Month</option>
                            <option value="thisYear">This Year</option>
                            <option value="custom">Custom Range</option>
                        </select>
                        <Calendar className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                    </div>

                    <button
                        onClick={generateReport}
                        className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2"
                    >
                        <RefreshCw className="w-4 h-4" />
                        Generate Report
                    </button>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => downloadReport("pdf")}
                        className="px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-1"
                    >
                        <Download className="w-4 h-4" />
                        PDF
                    </button>
                    <button
                        onClick={() => downloadReport("csv")}
                        className="px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-1"
                    >
                        <FileText className="w-4 h-4" />
                        CSV
                    </button>
                </div>
            </div>

            {/* Report Content */}
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 mb-8">
                <h2 className="text-lg font-semibold mb-6">
                    {reportType === "sales" && "Sales Report"}
                    {reportType === "products" && "Product Performance"}
                    {reportType === "customers" && "Customer Analysis"}
                    {reportType === "inventory" && "Inventory Status"}
                </h2>

                {/* Sales Report */}
                {reportType === "sales" && (
                    <div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            <div className="bg-white p-4 rounded-lg border border-gray-200">
                                <h3 className="text-sm font-medium text-gray-500 mb-1">Total Sales</h3>
                                <p className="text-2xl font-bold">LKR 125,400</p>
                                <div className="flex items-center mt-2">
                                    <span className="text-green-500 text-xs font-medium flex items-center">
                                        <TrendingUp className="w-3 h-3 mr-1" /> 12.5%
                                    </span>
                                    <span className="text-xs text-gray-500 ml-2">vs previous period</span>
                                </div>
                            </div>

                            <div className="bg-white p-4 rounded-lg border border-gray-200">
                                <h3 className="text-sm font-medium text-gray-500 mb-1">Orders</h3>
                                <p className="text-2xl font-bold">243</p>
                                <div className="flex items-center mt-2">
                                    <span className="text-green-500 text-xs font-medium flex items-center">
                                        <TrendingUp className="w-3 h-3 mr-1" /> 8.2%
                                    </span>
                                    <span className="text-xs text-gray-500 ml-2">vs previous period</span>
                                </div>
                            </div>

                            <div className="bg-white p-4 rounded-lg border border-gray-200">
                                <h3 className="text-sm font-medium text-gray-500 mb-1">Average Order Value</h3>
                                <p className="text-2xl font-bold">LKR 516</p>
                                <div className="flex items-center mt-2">
                                    <span className="text-green-500 text-xs font-medium flex items-center">
                                        <TrendingUp className="w-3 h-3 mr-1" /> 3.7%
                                    </span>
                                    <span className="text-xs text-gray-500 ml-2">vs previous period</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-4 rounded-lg border border-gray-200">
                            <h3 className="text-sm font-medium text-gray-700 mb-4">Sales Trend</h3>
                            <div className="h-80">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={salesData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" />
                                        <YAxis />
                                        <Tooltip />
                                        <Line type="monotone" dataKey="sales" stroke="#000000" activeDot={{ r: 8 }} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                )}

                {/* Product Performance */}
                {reportType === "products" && (
                    <div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            <div className="bg-white p-4 rounded-lg border border-gray-200">
                                <h3 className="text-sm font-medium text-gray-700 mb-4">Top Selling Products</h3>
                                <div className="h-80">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart
                                            data={[
                                                { name: "Urban Black Hoodie", sales: 120 },
                                                { name: "Signature Logo T-Shirt", sales: 98 },
                                                { name: "Tactical Cargo Pants", sales: 86 },
                                                { name: "Stealth Bomber Jacket", sales: 72 },
                                                { name: "Gotham Nights Cap", sales: 65 },
                                            ]}
                                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                                            layout="vertical"
                                        >
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis type="number" />
                                            <YAxis dataKey="name" type="category" width={150} />
                                            <Tooltip />
                                            <Bar dataKey="sales" fill="#000000" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            <div className="bg-white p-4 rounded-lg border border-gray-200">
                                <h3 className="text-sm font-medium text-gray-700 mb-4">Sales by Category</h3>
                                <div className="h-80">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={categoryData}
                                                cx="50%"
                                                cy="50%"
                                                labelLine={false}
                                                outerRadius={80}
                                                fill="#8884d8"
                                                dataKey="value"
                                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                            >
                                                {categoryData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-4 rounded-lg border border-gray-200">
                            <h3 className="text-sm font-medium text-gray-700 mb-4">Product Performance Table</h3>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-black text-white rounded-lg">
                                        <tr>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider rounded-tl-lg"
                                            >
                                                Product
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                                                Category
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                                                Units Sold
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                                                Revenue
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider rounded-tr-lg"
                                            >
                                                Profit Margin
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {[
                                            { name: "Urban Black Hoodie", category: "Hoodies", sold: 120, revenue: 540000, margin: 42 },
                                            { name: "Signature Logo T-Shirt", category: "T-Shirts", sold: 98, revenue: 215600, margin: 38 },
                                            { name: "Tactical Cargo Pants", category: "Pants", sold: 86, revenue: 498800, margin: 45 },
                                            { name: "Stealth Bomber Jacket", category: "Jackets", sold: 72, revenue: 540000, margin: 50 },
                                            { name: "Gotham Nights Cap", category: "Accessories", sold: 65, revenue: 117000, margin: 55 },
                                        ].map((product, index) => (
                                            <tr key={index} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                    {product.name}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.category}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.sold}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    LKR {product.revenue.toLocaleString()}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.margin}%</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {/* Customer Analysis */}
                {reportType === "customers" && (
                    <div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            <div className="bg-white p-4 rounded-lg border border-gray-200">
                                <h3 className="text-sm font-medium text-gray-500 mb-1">Total Customers</h3>
                                <p className="text-2xl font-bold">1,205</p>
                                <div className="flex items-center mt-2">
                                    <span className="text-green-500 text-xs font-medium flex items-center">
                                        <TrendingUp className="w-3 h-3 mr-1" /> 5.3%
                                    </span>
                                    <span className="text-xs text-gray-500 ml-2">vs previous period</span>
                                </div>
                            </div>

                            <div className="bg-white p-4 rounded-lg border border-gray-200">
                                <h3 className="text-sm font-medium text-gray-500 mb-1">New Customers</h3>
                                <p className="text-2xl font-bold">87</p>
                                <div className="flex items-center mt-2">
                                    <span className="text-green-500 text-xs font-medium flex items-center">
                                        <TrendingUp className="w-3 h-3 mr-1" /> 12.8%
                                    </span>
                                    <span className="text-xs text-gray-500 ml-2">vs previous period</span>
                                </div>
                            </div>

                            <div className="bg-white p-4 rounded-lg border border-gray-200">
                                <h3 className="text-sm font-medium text-gray-500 mb-1">Customer Retention</h3>
                                <p className="text-2xl font-bold">78%</p>
                                <div className="flex items-center mt-2">
                                    <span className="text-green-500 text-xs font-medium flex items-center">
                                        <TrendingUp className="w-3 h-3 mr-1" /> 2.1%
                                    </span>
                                    <span className="text-xs text-gray-500 ml-2">vs previous period</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-4 rounded-lg border border-gray-200 mb-6">
                            <h3 className="text-sm font-medium text-gray-700 mb-4">Customer Growth</h3>
                            <div className="h-80">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart
                                        data={[
                                            { name: "Jan", customers: 980 },
                                            { name: "Feb", customers: 1020 },
                                            { name: "Mar", customers: 1050 },
                                            { name: "Apr", customers: 1080 },
                                            { name: "May", customers: 1120 },
                                            { name: "Jun", customers: 1160 },
                                            { name: "Jul", customers: 1205 },
                                        ]}
                                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" />
                                        <YAxis />
                                        <Tooltip />
                                        <Line type="monotone" dataKey="customers" stroke="#000000" activeDot={{ r: 8 }} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        <div className="bg-white p-4 rounded-lg border border-gray-200">
                            <h3 className="text-sm font-medium text-gray-700 mb-4">Top Customers</h3>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-black text-white rounded-lg">
                                        <tr>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider rounded-tl-lg"
                                            >
                                                Customer
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                                                Orders
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                                                Total Spent
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                                                Last Order
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider rounded-tr-lg"
                                            >
                                                Customer Since
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {[
                                            {
                                                name: "John Doe",
                                                email: "john.doe@example.com",
                                                orders: 12,
                                                spent: 85400,
                                                lastOrder: "2025-04-02",
                                                since: "2024-01-15",
                                            },
                                            {
                                                name: "Jane Smith",
                                                email: "jane.smith@example.com",
                                                orders: 9,
                                                spent: 64200,
                                                lastOrder: "2025-04-05",
                                                since: "2024-02-20",
                                            },
                                            {
                                                name: "Robert Johnson",
                                                email: "robert.j@example.com",
                                                orders: 8,
                                                spent: 52800,
                                                lastOrder: "2025-03-28",
                                                since: "2024-01-30",
                                            },
                                            {
                                                name: "Emily Davis",
                                                email: "emily.d@example.com",
                                                orders: 7,
                                                spent: 48600,
                                                lastOrder: "2025-04-01",
                                                since: "2024-03-10",
                                            },
                                            {
                                                name: "Michael Brown",
                                                email: "michael.b@example.com",
                                                orders: 6,
                                                spent: 42000,
                                                lastOrder: "2025-03-25",
                                                since: "2024-02-05",
                                            },
                                        ].map((customer, index) => (
                                            <tr key={index} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                                                    <div className="text-sm text-gray-500">{customer.email}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{customer.orders}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    LKR {customer.spent.toLocaleString()}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {new Date(customer.lastOrder).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {new Date(customer.since).toLocaleDateString()}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {/* Inventory Status */}
                {reportType === "inventory" && (
                    <div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            <div className="bg-white p-4 rounded-lg border border-gray-200">
                                <h3 className="text-sm font-medium text-gray-500 mb-1">Total Products</h3>
                                <p className="text-2xl font-bold">156</p>
                            </div>

                            <div className="bg-white p-4 rounded-lg border border-gray-200">
                                <h3 className="text-sm font-medium text-gray-500 mb-1">Low Stock Items</h3>
                                <p className="text-2xl font-bold">12</p>
                                <div className="flex items-center mt-2">
                                    <span className="text-red-500 text-xs font-medium">Requires attention</span>
                                </div>
                            </div>

                            <div className="bg-white p-4 rounded-lg border border-gray-200">
                                <h3 className="text-sm font-medium text-gray-500 mb-1">Out of Stock Items</h3>
                                <p className="text-2xl font-bold">3</p>
                                <div className="flex items-center mt-2">
                                    <span className="text-red-500 text-xs font-medium">Urgent restock needed</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-4 rounded-lg border border-gray-200 mb-6">
                            <h3 className="text-sm font-medium text-gray-700 mb-4">Inventory by Category</h3>
                            <div className="h-80">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart
                                        data={[
                                            { name: "T-Shirts", stock: 45 },
                                            { name: "Hoodies", stock: 32 },
                                            { name: "Pants", stock: 28 },
                                            { name: "Jackets", stock: 24 },
                                            { name: "Accessories", stock: 27 },
                                        ]}
                                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" />
                                        <YAxis />
                                        <Tooltip />
                                        <Bar dataKey="stock" fill="#000000" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        <div className="bg-white p-4 rounded-lg border border-gray-200">
                            <h3 className="text-sm font-medium text-gray-700 mb-4">Low Stock Items</h3>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-black text-white rounded-lg">
                                        <tr>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider rounded-tl-lg"
                                            >
                                                Product
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                                                Category
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                                                Current Stock
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                                                Reorder Level
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider rounded-tr-lg"
                                            >
                                                Status
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {[
                                            {
                                                name: "Urban Black Hoodie",
                                                category: "Hoodies",
                                                stock: 3,
                                                reorderLevel: 10,
                                                status: "Low Stock",
                                            },
                                            {
                                                name: "Signature Logo T-Shirt",
                                                category: "T-Shirts",
                                                stock: 5,
                                                reorderLevel: 15,
                                                status: "Low Stock",
                                            },
                                            {
                                                name: "Tactical Cargo Pants",
                                                category: "Pants",
                                                stock: 2,
                                                reorderLevel: 8,
                                                status: "Low Stock",
                                            },
                                            {
                                                name: "Stealth Bomber Jacket",
                                                category: "Jackets",
                                                stock: 0,
                                                reorderLevel: 5,
                                                status: "Out of Stock",
                                            },
                                            {
                                                name: "Gotham Nights Cap",
                                                category: "Accessories",
                                                stock: 4,
                                                reorderLevel: 10,
                                                status: "Low Stock",
                                            },
                                        ].map((product, index) => (
                                            <tr key={index} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                    {product.name}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.category}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.stock}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.reorderLevel}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span
                                                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${product.status === "Out of Stock" ? "bg-red-100 text-red-800" : "bg-yellow-100 text-yellow-800"}`}
                                                    >
                                                        {product.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Report Summary */}
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <h2 className="text-lg font-semibold mb-4">Report Summary</h2>
                <div className="space-y-4">
                    <p className="text-gray-700">
                        This report provides an overview of your{" "}
                        {reportType === "sales"
                            ? "sales performance"
                            : reportType === "products"
                                ? "product performance"
                                : reportType === "customers"
                                    ? "customer analysis"
                                    : "inventory status"}
                        for the selected time period.
                    </p>

                    <div className="flex items-start gap-2">
                        <div className="bg-black/10 p-2 rounded-full mt-0.5">
                            {reportType === "sales" && <BarChart2 className="w-5 h-5 text-black" />}
                            {reportType === "products" && <BarChart2 className="w-5 h-5 text-black" />}
                            {reportType === "customers" && <PieChartIcon className="w-5 h-5 text-black" />}
                            {reportType === "inventory" && <BarChart2 className="w-5 h-5 text-black" />}
                        </div>
                        <div>
                            <h3 className="font-medium">Key Insights</h3>
                            <ul className="list-disc list-inside text-sm text-gray-600 mt-2 space-y-1">
                                {reportType === "sales" && (
                                    <>
                                        <li>Total sales have increased by 12.5% compared to the previous period.</li>
                                        <li>The number of orders has grown by 8.2%.</li>
                                        <li>Average order value has increased by 3.7%.</li>
                                        <li>July shows the highest sales volume in the current period.</li>
                                    </>
                                )}

                                {reportType === "products" && (
                                    <>
                                        <li>Urban Black Hoodie is the top-selling product with 120 units sold.</li>
                                        <li>Hoodies category generates the highest revenue.</li>
                                        <li>Stealth Bomber Jacket has the highest profit margin at 50%.</li>
                                        <li>T-Shirts category has the highest number of units sold.</li>
                                    </>
                                )}

                                {reportType === "customers" && (
                                    <>
                                        <li>Total customer base has grown by 5.3% to 1,205 customers.</li>
                                        <li>87 new customers were acquired in this period.</li>
                                        <li>Customer retention rate is at 78%.</li>
                                        <li>John Doe is the highest-spending customer with LKR 85,400 total spend.</li>
                                    </>
                                )}

                                {reportType === "inventory" && (
                                    <>
                                        <li>12 products are currently at low stock levels.</li>
                                        <li>3 products are completely out of stock.</li>
                                        <li>T-Shirts category has the highest inventory levels.</li>
                                        <li>Stealth Bomber Jacket needs immediate restocking.</li>
                                    </>
                                )}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ReportsPage

