import React, { useState, useEffect } from "react";
import { fetchCustomerById } from "../../services/customerService";
import { User } from "../../models/User";

interface ViewCustomerModalProps {
    customerId: string;
    closeModal: () => void;
}

const ViewCustomerModal: React.FC<ViewCustomerModalProps> = ({ customerId, closeModal }) => {
    const [customer, setCustomer] = useState<User | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadCustomer = async () => {
            try {
                const token = localStorage.getItem("token") || "";
                const fetchedCustomer = await fetchCustomerById(customerId, token);
                setCustomer(fetchedCustomer);
            } catch (err) {
                setError("Failed to load customer details.");
            }
        };

        if (customerId) {
            loadCustomer();
        }
    }, [customerId]);

    if (error) return <div className="text-red-500 text-center">{error}</div>;
    if (!customer) return <div className="text-center">Loading...</div>;

    return (
        <div className="fixed top-0 left-0 w-screen h-screen bg-opacity-50 backdrop-blur-md flex justify-center items-center z-50">
            <div className="bg-white p-8 rounded-3xl w-[400px] shadow-2xl relative">
                <button
                    onClick={closeModal}
                    className="absolute top-4 right-4 text-gray-500 text-2xl hover:text-gray-700"
                >
                    &times;
                </button>
                <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Customer Details</h2>

                <div className="space-y-4">
                    <div className="flex justify-between">
                        <p className="text-gray-600 font-medium">Name:</p>
                        <p className="text-gray-800">{customer.name}</p>
                    </div>
                    <div className="flex justify-between">
                        <p className="text-gray-600 font-medium">Email:</p>
                        <p className="text-gray-800">{customer.email}</p>
                    </div>
                    <div className="flex justify-between">
                        <p className="text-gray-600 font-medium">Phone:</p>
                        <p className="text-gray-800">{customer.phone || "N/A"}</p>
                    </div>
                    <div className="flex justify-between">
                        <p className="text-gray-600 font-medium">Address:</p>
                        <p className="text-gray-800">{customer.address || "N/A"}</p>
                    </div>
                    <div className="flex justify-between items-center">
                        <p className="text-gray-600 font-medium">Status:</p>
                        <span
                            className={`px-3 py-1 rounded text-white font-semibold ${customer.isActive ? "bg-green-500" : "bg-red-500"}`}
                        >
                            {customer.isActive ? "Active" : "Inactive"}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ViewCustomerModal;