import { useState } from "react"
import { Save, Bell, Moon, Sun, Globe, Shield } from "lucide-react"

const PreferencesPage = () => {
    // State for form values
    const [notificationsEnabled, setNotificationsEnabled] = useState(true)
    const [emailNotifications, setEmailNotifications] = useState(true)
    const [orderUpdates, setOrderUpdates] = useState(true)
    const [marketingEmails, setMarketingEmails] = useState(false)
    const [darkMode, setDarkMode] = useState(false)
    const [language, setLanguage] = useState("en")
    const [currency, setCurrency] = useState("LKR")
    const [timezone, setTimezone] = useState("Asia/Colombo")

    // Handle form submission
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        // Save preferences to backend (mock)
        console.log("Preferences saved:", {
            notificationsEnabled,
            emailNotifications,
            orderUpdates,
            marketingEmails,
            darkMode,
            language,
            currency,
            timezone,
        })

        // Show success message (mock)
        alert("Preferences saved successfully!")
    }

    return (
        <div className="bg-white rounded-xl shadow-sm p-6 w-full">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Preferences</h1>
            <p className="text-gray-500 mb-8">Customize your admin panel experience</p>

            <div className="max-w-4xl">
                <form onSubmit={handleSubmit}>
                    {/* Notifications Section */}
                    <div className="mb-10">
                        <div className="flex items-center gap-2 mb-4">
                            <Bell className="w-5 h-5 text-gray-700" />
                            <h2 className="text-lg font-semibold">Notifications</h2>
                        </div>
                        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <h3 className="font-medium">Enable Notifications</h3>
                                    <p className="text-sm text-gray-500">
                                        Receive notifications about orders, inventory, and system updates
                                    </p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="sr-only peer"
                                        checked={notificationsEnabled}
                                        onChange={() => setNotificationsEnabled(!notificationsEnabled)}
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-black/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
                                </label>
                            </div>

                            <div className="space-y-4 pl-4 border-l-2 border-gray-200">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h3 className="font-medium">Email Notifications</h3>
                                        <p className="text-sm text-gray-500">Receive notifications via email</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="sr-only peer"
                                            checked={emailNotifications}
                                            onChange={() => setEmailNotifications(!emailNotifications)}
                                            disabled={!notificationsEnabled}
                                        />
                                        <div
                                            className={`w-11 h-6 ${notificationsEnabled ? "bg-gray-200" : "bg-gray-300"} peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-black/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black`}
                                        ></div>
                                    </label>
                                </div>

                                <div className="flex justify-between items-center">
                                    <div>
                                        <h3 className="font-medium">Order Updates</h3>
                                        <p className="text-sm text-gray-500">Receive notifications about new orders and status changes</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="sr-only peer"
                                            checked={orderUpdates}
                                            onChange={() => setOrderUpdates(!orderUpdates)}
                                            disabled={!notificationsEnabled}
                                        />
                                        <div
                                            className={`w-11 h-6 ${notificationsEnabled ? "bg-gray-200" : "bg-gray-300"} peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-black/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black`}
                                        ></div>
                                    </label>
                                </div>

                                <div className="flex justify-between items-center">
                                    <div>
                                        <h3 className="font-medium">Marketing Emails</h3>
                                        <p className="text-sm text-gray-500">Receive promotional emails and newsletters</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="sr-only peer"
                                            checked={marketingEmails}
                                            onChange={() => setMarketingEmails(!marketingEmails)}
                                            disabled={!notificationsEnabled}
                                        />
                                        <div
                                            className={`w-11 h-6 ${notificationsEnabled ? "bg-gray-200" : "bg-gray-300"} peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-black/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black`}
                                        ></div>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Appearance Section */}
                    <div className="mb-10">
                        <div className="flex items-center gap-2 mb-4">
                            <Moon className="w-5 h-5 text-gray-700" />
                            <h2 className="text-lg font-semibold">Appearance</h2>
                        </div>
                        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <h3 className="font-medium">Dark Mode</h3>
                                    <p className="text-sm text-gray-500">Switch between light and dark theme</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        className={`p-2 rounded-lg ${!darkMode ? "bg-black text-white" : "bg-gray-200 text-gray-700"}`}
                                        onClick={() => setDarkMode(false)}
                                    >
                                        <Sun className="w-5 h-5" />
                                    </button>
                                    <button
                                        type="button"
                                        className={`p-2 rounded-lg ${darkMode ? "bg-black text-white" : "bg-gray-200 text-gray-700"}`}
                                        onClick={() => setDarkMode(true)}
                                    >
                                        <Moon className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Regional Settings */}
                    <div className="mb-10">
                        <div className="flex items-center gap-2 mb-4">
                            <Globe className="w-5 h-5 text-gray-700" />
                            <h2 className="text-lg font-semibold">Regional Settings</h2>
                        </div>
                        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                                    <select
                                        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-gray-400"
                                        value={language}
                                        onChange={(e) => setLanguage(e.target.value)}
                                    >
                                        <option value="en">English</option>
                                        <option value="si">Sinhala</option>
                                        <option value="ta">Tamil</option>
                                        <option value="fr">French</option>
                                        <option value="de">German</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
                                    <select
                                        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-gray-400"
                                        value={currency}
                                        onChange={(e) => setCurrency(e.target.value)}
                                    >
                                        <option value="LKR">Sri Lankan Rupee (LKR)</option>
                                        <option value="USD">US Dollar (USD)</option>
                                        <option value="EUR">Euro (EUR)</option>
                                        <option value="GBP">British Pound (GBP)</option>
                                        <option value="INR">Indian Rupee (INR)</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Time Zone</label>
                                    <select
                                        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-gray-400"
                                        value={timezone}
                                        onChange={(e) => setTimezone(e.target.value)}
                                    >
                                        <option value="Asia/Colombo">Colombo (GMT+5:30)</option>
                                        <option value="UTC">UTC</option>
                                        <option value="America/New_York">New York (GMT-4)</option>
                                        <option value="Europe/London">London (GMT+1)</option>
                                        <option value="Asia/Tokyo">Tokyo (GMT+9)</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Security Section */}
                    <div className="mb-10">
                        <div className="flex items-center gap-2 mb-4">
                            <Shield className="w-5 h-5 text-gray-700" />
                            <h2 className="text-lg font-semibold">Security</h2>
                        </div>
                        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                            <div className="space-y-6">
                                <div>
                                    <h3 className="font-medium mb-2">Two-Factor Authentication</h3>
                                    <p className="text-sm text-gray-500 mb-4">Add an extra layer of security to your account</p>
                                    <button
                                        type="button"
                                        className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                                    >
                                        Enable 2FA
                                    </button>
                                </div>

                                <div>
                                    <h3 className="font-medium mb-2">Password</h3>
                                    <p className="text-sm text-gray-500 mb-4">Change your account password</p>
                                    <button
                                        type="button"
                                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        Change Password
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Save Button */}
                    <div className="flex justify-end mt-8">
                        <button
                            type="submit"
                            className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2"
                        >
                            <Save className="w-4 h-4" />
                            Save Preferences
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default PreferencesPage

