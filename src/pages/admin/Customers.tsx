import React, { useEffect, useState } from "react";
import { BsEyeFill } from "react-icons/bs";
import { fetchCustomers } from "../../services/customerService";
import ViewCustomerModal from "../../components/modals/ViewCustomerModal";
import { User } from "../../models/User";

const Customers = () => {
    const token = localStorage.getItem("token");
    const [customers, setCustomers] = useState<User[]>([]);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
    const [filteredCustomers, setFilteredCustomers] = useState<User[]>([]);
    const [searchTerm, setSearchTerm] = useState("");

    const loadCustomers = async () => {
        if (token) {
            try {
                const data = await fetchCustomers(token);
                setCustomers(data);
                setFilteredCustomers(data);
            } catch (error) {
                console.error("Failed to fetch customers:", error);
            }
        } else {
            console.error("No token found");
        }
    };

    useEffect(() => {
        loadCustomers();
    }, [token]);

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        const term = event.target.value.toLowerCase().trim();
        setSearchTerm(term);

        if (!term) {
            setFilteredCustomers(customers);
            return;
        }

        const filtered = customers.filter((customer) =>
            customer.name.toLowerCase().includes(term) ||
            customer.email.toLowerCase().includes(term)
        );

        setFilteredCustomers(filtered);
    };

    const openViewModal = (customerId: string) => {
        setSelectedCustomerId(customerId);
        setIsViewModalOpen(true);
    };

    const closeViewModal = () => setIsViewModalOpen(false);

    return (
        <div className="p-2">
            <h3 className="text-sm text-gray-500 px-2">All Customers</h3>
            <hr className="my-2 border-gray-200" />
            <div className="flex justify-between items-center mt-3 px-2">
                <div className="flex items-baseline gap-2">
                    <h1 className="text-2xl font-bold text-black">Customers</h1>
                    <span className="text-gray-600 text-2xl">{customers.length}</span>
                </div>
                <input
                    type="text"
                    placeholder="Search Customers"
                    className="p-2 border px-5 text-sm border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-600 w-80"
                    value={searchTerm}
                    onChange={handleSearch}
                />
            </div>

            <div className="mt-4 px-1">
                <table className="min-w-full table-auto border-collapse border border-gray-200 shadow-lg rounded-lg overflow-hidden">
                    <thead className="bg-black text-white">
                        <tr>
                            <th className="p-3 text-left text-xs font-semibold">#</th>
                            <th className="p-3 text-left text-xs font-semibold">Name</th>
                            <th className="p-3 text-left text-xs font-semibold">Email</th>
                            <th className="p-3 text-center text-xs font-semibold">Status</th>
                            <th className="p-3 text-center text-xs font-semibold">Phone</th>
                            <th className="p-3 text-center text-xs font-semibold">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredCustomers.map((customer, index) => (
                            <tr key={customer._id} className="hover:bg-gray-100 transition duration-150">
                                <td className="p-3 text-sm">{index + 1}</td>
                                <td className="p-3 text-left text-sm">{customer.name}</td>
                                <td className="p-3 text-left text-sm">{customer.email}</td>
                                <td className="p-3 text-center text-sm">
                                    <span className={`px-2 py-1 rounded-full text-white font-medium ${customer.isActive ? "bg-green-500" : "bg-red-500"}`}>
                                        {customer.isActive ? "Active" : "Inactive"}
                                    </span>
                                </td>
                                <td className="p-3 text-center text-sm">{customer.phone || "N/A"}</td>
                                <td className="p-3 text-center text-sm space-x-3">
                                    <button onClick={() => openViewModal(customer._id)}>
                                        <BsEyeFill />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isViewModalOpen && selectedCustomerId && (
                <ViewCustomerModal
                    customerId={selectedCustomerId}
                    closeModal={closeViewModal}
                />
            )}
        </div>
    );
};

export default Customers;