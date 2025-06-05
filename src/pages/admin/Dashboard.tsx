import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, } from "recharts"
import { ArrowUpRight, ArrowDownRight, DollarSign, ShoppingBag, Users, TrendingUp, Package, Clock } from "lucide-react"

// Mock data for dashboard
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

const recentOrders = [
  { id: "ORD-1234", customer: "John Doe", date: "2025-04-07", total: 7500, status: "completed" },
  { id: "ORD-1235", customer: "Jane Smith", date: "2025-04-07", total: 4200, status: "pending" },
  { id: "ORD-1236", customer: "Robert Johnson", date: "2025-04-06", total: 9800, status: "completed" },
  { id: "ORD-1237", customer: "Emily Davis", date: "2025-04-06", total: 3600, status: "pending" },
  { id: "ORD-1238", customer: "Michael Brown", date: "2025-04-05", total: 6200, status: "canceled" },
]

const Dashboard = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 w-full">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500 mb-1">Total Revenue</p>
              <h3 className="text-2xl font-bold">LKR 125,400</h3>
              <div className="flex items-center mt-2">
                <span className="text-green-500 text-xs font-medium flex items-center">
                  <ArrowUpRight className="w-3 h-3 mr-1" /> 12.5%
                </span>
                <span className="text-xs text-gray-500 ml-2">vs last month</span>
              </div>
            </div>
            <div className="bg-black/5 p-3 rounded-full">
              <DollarSign className="w-6 h-6 text-black" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500 mb-1">Total Orders</p>
              <h3 className="text-2xl font-bold">243</h3>
              <div className="flex items-center mt-2">
                <span className="text-green-500 text-xs font-medium flex items-center">
                  <ArrowUpRight className="w-3 h-3 mr-1" /> 8.2%
                </span>
                <span className="text-xs text-gray-500 ml-2">vs last month</span>
              </div>
            </div>
            <div className="bg-black/5 p-3 rounded-full">
              <ShoppingBag className="w-6 h-6 text-black" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500 mb-1">Total Customers</p>
              <h3 className="text-2xl font-bold">1,205</h3>
              <div className="flex items-center mt-2">
                <span className="text-green-500 text-xs font-medium flex items-center">
                  <ArrowUpRight className="w-3 h-3 mr-1" /> 5.3%
                </span>
                <span className="text-xs text-gray-500 ml-2">vs last month</span>
              </div>
            </div>
            <div className="bg-black/5 p-3 rounded-full">
              <Users className="w-6 h-6 text-black" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500 mb-1">Conversion Rate</p>
              <h3 className="text-2xl font-bold">3.2%</h3>
              <div className="flex items-center mt-2">
                <span className="text-red-500 text-xs font-medium flex items-center">
                  <ArrowDownRight className="w-3 h-3 mr-1" /> 1.8%
                </span>
                <span className="text-xs text-gray-500 ml-2">vs last month</span>
              </div>
            </div>
            <div className="bg-black/5 p-3 rounded-full">
              <TrendingUp className="w-6 h-6 text-black" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Sales Overview</h3>
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

        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Sales by Category</h3>
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

      {/* Recent Orders */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Recent Orders</h3>
          <a href="/admin/orders" className="text-sm text-blue-600 hover:underline">
            View All
          </a>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-black text-white rounded-lg">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider rounded-tl-lg"
                >
                  Order ID
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Customer
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Total
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
              {recentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.customer}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(order.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    LKR {order.total.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${order.status === "completed"
                          ? "bg-green-100 text-green-800"
                          : order.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                    >
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inventory Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Low Stock Items</h3>
            <a href="/admin/products" className="text-sm text-blue-600 hover:underline">
              View All
            </a>
          </div>
          <div className="space-y-4">
            {[
              { name: "Urban Black Hoodie", stock: 3, category: "Hoodies" },
              { name: "Signature Logo T-Shirt", stock: 5, category: "T-Shirts" },
              { name: "Tactical Cargo Pants", stock: 2, category: "Pants" },
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                <div className="flex items-center">
                  <Package className="w-5 h-5 text-red-500 mr-3" />
                  <div>
                    <p className="font-medium text-sm">{item.name}</p>
                    <p className="text-xs text-gray-500">{item.category}</p>
                  </div>
                </div>
                <div className="text-red-600 font-medium text-sm">{item.stock} left</div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Pending Orders</h3>
            <a href="/admin/orders" className="text-sm text-blue-600 hover:underline">
              View All
            </a>
          </div>
          <div className="space-y-4">
            {recentOrders
              .filter((order) => order.status === "pending")
              .map((order, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 text-yellow-500 mr-3" />
                    <div>
                      <p className="font-medium text-sm">{order.id}</p>
                      <p className="text-xs text-gray-500">{order.customer}</p>
                    </div>
                  </div>
                  <div className="text-gray-700 font-medium text-sm">LKR {order.total.toLocaleString()}</div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard