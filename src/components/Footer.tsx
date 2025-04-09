import { Facebook, Instagram, Twitter, Mail, ChevronRight } from "lucide-react"

const Footer = () => {
  return (
    <footer className="bg-black text-white pt-12 pb-6">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Footer Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2 lg:col-span-1">
            <h1 className="text-3xl font-extrabold tracking-wide mb-4"  style={{ fontFamily: "Anton SC" }}>
              BATMAN
            </h1>
            <p className="text-gray-400 text-sm mb-6 max-w-xs">
              Elevate your style with our premium clothing collection. Quality fabrics, timeless designs.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="p-2 bg-gray-800 rounded-full hover:bg-gray-700 transition-colors">
                <Facebook className="h-4 w-4" />
              </a>
              <a href="#" className="p-2 bg-gray-800 rounded-full hover:bg-gray-700 transition-colors">
                <Instagram className="h-4 w-4" />
              </a>
              <a href="#" className="p-2 bg-gray-800 rounded-full hover:bg-gray-700 transition-colors">
                <Twitter className="h-4 w-4" />
              </a>
              <a href="#" className="p-2 bg-gray-800 rounded-full hover:bg-gray-700 transition-colors">
                <Mail className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider mb-4 pb-1 border-b border-gray-800 inline-block">
              Shop
            </h3>
            <ul className="space-y-2">
              {["Home", "Men", "Women", "Accessories", "New Arrivals"].map((item) => (
                <li key={item}>
                  <a href="#" className="text-gray-400 hover:text-white text-sm flex items-center group">
                    <ChevronRight className="h-3 w-3 mr-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Account Section */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider mb-4 pb-1 border-b border-gray-800 inline-block">
              Account
            </h3>
            <ul className="space-y-2">
              {["My Account", "Login", "Register", "Order History", "Wishlist"].map((item) => (
                <li key={item}>
                  <a href="#" className="text-gray-400 hover:text-white text-sm flex items-center group">
                    <ChevronRight className="h-3 w-3 mr-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Section */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider mb-4 pb-1 border-b border-gray-800 inline-block">
              Information
            </h3>
            <ul className="space-y-2">
              {["About Us", "Contact Us", "Privacy Policy", "Terms & Conditions", "FAQ"].map((item) => (
                <li key={item}>
                  <a href="#" className="text-gray-400 hover:text-white text-sm flex items-center group">
                    <ChevronRight className="h-3 w-3 mr-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-gray-800 pt-6 mt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm">© 2025 BATMAN. All rights reserved.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a href="#" className="text-gray-500 hover:text-gray-300 text-xs">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-500 hover:text-gray-300 text-xs">
              Terms of Service
            </a>
            <a href="#" className="text-gray-500 hover:text-gray-300 text-xs">
              Cookies Settings
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer

