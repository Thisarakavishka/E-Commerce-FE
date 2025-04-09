import { useState } from "react"
import { Search, ChevronDown, ChevronUp, HelpCircle, FileText, MessageCircle, Mail } from "lucide-react"

const faqs = [
    {
        question: "How do I add a new product to the inventory?",
        answer:
            "To add a new product, navigate to the Products page from the sidebar menu. Click on the '+ Add Product' button in the top right corner. Fill in all the required fields in the form that appears, including product name, description, price, and category. You can also upload product images. Once you've filled in all the details, click 'Save' to add the product to your inventory.",
    },
    {
        question: "How do I process an order?",
        answer:
            "To process an order, go to the Orders page from the sidebar menu. Find the order you want to process in the list. Click on the order to view its details. From there, you can update the order status to 'Processing', 'Shipped', or 'Completed'. You can also add tracking information if applicable. Once you've updated the order, click 'Save Changes' to confirm.",
    },
    {
        question: "How do I create discount codes?",
        answer:
            "To create discount codes, navigate to the Marketing section and select 'Discount Codes'. Click on the '+ Add Discount' button. Fill in the details for your discount, including the code, discount type (percentage or fixed amount), value, and validity period. You can also set usage limits and specific product categories the discount applies to. Click 'Create Discount' to save your new discount code.",
    },
    {
        question: "How do I view customer information?",
        answer:
            "To view customer information, go to the Customers page from the sidebar menu. You'll see a list of all your customers. Click on a customer's name or the view icon to see their detailed profile. This includes their contact information, order history, and any notes associated with their account.",
    },
    {
        question: "How do I generate sales reports?",
        answer:
            "To generate sales reports, navigate to the Reports page from the sidebar menu. Select the type of report you want to generate (e.g., Sales Summary, Product Performance, Customer Analysis). Choose the date range for your report using the calendar selector. You can also apply filters to focus on specific products, categories, or customer segments. Click 'Generate Report' to create your report, which you can then view online or download as a CSV or PDF file.",
    },
    {
        question: "How do I manage inventory levels?",
        answer:
            "To manage inventory levels, go to the Products page and select the product you want to update. Click on the edit icon to open the product details. Update the 'Stock' field with the current inventory level. You can also set low stock alerts by configuring the 'Low Stock Threshold' value. The system will notify you when inventory falls below this level. Click 'Save Changes' to update the inventory.",
    },
    {
        question: "How do I change my account password?",
        answer:
            "To change your account password, click on your profile icon in the top right corner of the screen and select 'Settings' from the dropdown menu. In the Settings page, go to the 'Security' tab. Enter your current password, then enter and confirm your new password. Click 'Update Password' to save your changes.",
    },
    {
        question: "How do I add a new user to the admin panel?",
        answer:
            "To add a new user to the admin panel, navigate to the Settings page and select the 'Users' tab. Click on the '+ Add User' button. Fill in the new user's details, including their name, email address, and role (Admin, Manager, or Staff). An invitation email will be sent to the provided email address with instructions to set up their account.",
    },
]

const HelpPage = () => {
    const [searchTerm, setSearchTerm] = useState("")
    const [expandedFaq, setExpandedFaq] = useState<number | null>(null)

    // Filter FAQs based on search term
    const filteredFaqs = faqs.filter(
        (faq) =>
            faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
            faq.answer.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    // Toggle FAQ expansion
    const toggleFaq = (index: number) => {
        if (expandedFaq === index) {
            setExpandedFaq(null)
        } else {
            setExpandedFaq(index)
        }
    }

    return (
        <div className="bg-white rounded-xl shadow-sm p-6 w-full">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Help Center</h1>
            <p className="text-gray-500 mb-8">Find answers to common questions about using the BATMAN admin panel</p>

            {/* Search */}
            <div className="relative max-w-2xl mx-auto mb-10">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                    type="text"
                    placeholder="Search for help..."
                    className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-gray-400"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Quick Links */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 text-center">
                    <div className="w-12 h-12 bg-black/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FileText className="w-6 h-6 text-black" />
                    </div>
                    <h3 className="font-semibold mb-2">Documentation</h3>
                    <p className="text-sm text-gray-600 mb-4">Detailed guides and documentation for all features</p>
                    <a href="#" className="text-blue-600 text-sm font-medium hover:underline">
                        View Documentation
                    </a>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 text-center">
                    <div className="w-12 h-12 bg-black/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <MessageCircle className="w-6 h-6 text-black" />
                    </div>
                    <h3 className="font-semibold mb-2">Live Chat Support</h3>
                    <p className="text-sm text-gray-600 mb-4">Chat with our support team for immediate assistance</p>
                    <a href="#" className="text-blue-600 text-sm font-medium hover:underline">
                        Start Chat
                    </a>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 text-center">
                    <div className="w-12 h-12 bg-black/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Mail className="w-6 h-6 text-black" />
                    </div>
                    <h3 className="font-semibold mb-2">Email Support</h3>
                    <p className="text-sm text-gray-600 mb-4">Send us an email and we'll respond within 24 hours</p>
                    <a href="mailto:support@batman.com" className="text-blue-600 text-sm font-medium hover:underline">
                        support@batman.com
                    </a>
                </div>
            </div>

            {/* FAQs */}
            <div className="max-w-3xl mx-auto">
                <h2 className="text-xl font-bold mb-6 flex items-center">
                    <HelpCircle className="w-5 h-5 mr-2" />
                    Frequently Asked Questions
                </h2>

                <div className="space-y-4">
                    {filteredFaqs.length === 0 ? (
                        <div className="text-center py-10">
                            <HelpCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-700">No results found</h3>
                            <p className="text-gray-500 mt-1">Try adjusting your search terms</p>
                        </div>
                    ) : (
                        filteredFaqs.map((faq, index) => (
                            <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                                <button
                                    className="w-full text-left p-4 flex justify-between items-center bg-gray-50 hover:bg-gray-100 transition-colors"
                                    onClick={() => toggleFaq(index)}
                                >
                                    <span className="font-medium">{faq.question}</span>
                                    {expandedFaq === index ? (
                                        <ChevronUp className="w-5 h-5 text-gray-500" />
                                    ) : (
                                        <ChevronDown className="w-5 h-5 text-gray-500" />
                                    )}
                                </button>
                                {expandedFaq === index && (
                                    <div className="p-4 bg-white">
                                        <p className="text-gray-600">{faq.answer}</p>
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Contact Section */}
            <div className="mt-12 text-center">
                <h2 className="text-lg font-semibold mb-2">Still need help?</h2>
                <p className="text-gray-600 mb-4">Our support team is available 24/7 to assist you</p>
                <div className="flex justify-center gap-4">
                    <a href="#" className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors">
                        Contact Support
                    </a>
                    <a href="#" className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                        Schedule a Demo
                    </a>
                </div>
            </div>
        </div>
    )
}

export default HelpPage

