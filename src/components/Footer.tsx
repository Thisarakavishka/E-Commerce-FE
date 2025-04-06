import { FaFacebookF, FaInstagram, FaTwitter, FaEnvelope } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-black text-white py-8 mt-16">
      <div className="max-w-screen-xl mx-auto px-4">

        {/* Footer Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-center">

          {/* Quick Links */}
          <div className="space-y-2">
            <h3 className="text-md font-semibold">Quick Links</h3>
            <ul className="space-y-1 text-gray-400">
              <li><a href="#" className="hover:text-gray-200 text-sm">Home</a></li>
              <li><a href="#" className="hover:text-gray-200 text-sm">Men</a></li>
              <li><a href="#" className="hover:text-gray-200 text-sm">Women</a></li>
              <li><a href="#" className="hover:text-gray-200 text-sm">Accessories</a></li>
              <li><a href="#" className="hover:text-gray-200 text-sm">Offers</a></li>
            </ul>
          </div>

          {/* Account Section */}
          <div className="space-y-2 text-sm text-left">
            <h3 className="text-md font-semibold">Account</h3>
            <ul className="space-y-1 text-gray-400">
              <li><a href="#" className="hover:text-gray-200">Login</a></li>
              <li><a href="#" className="hover:text-gray-200">Register</a></li>
            </ul>
          </div>

          {/* Centered Logo */}
          <div className="flex justify-center mb-4 md:mb-0">
            <h1 className="text-4xl font-extrabold tracking-wide" style={{ fontFamily: 'Anton, sans-serif' }}>
              BATMAN
            </h1>
          </div>

          {/* Legal Section and Social Media Icons */}
          <div className="space-y-2 text-sm text-right md:text-left ml-auto flex justify-between w-full">
            <div>
              <h3 className="text-md font-semibold">Legal</h3>
              <ul className="space-y-1 text-gray-400">
                <li><a href="#" className="hover:text-gray-200">Contact Us</a></li>
                <li><a href="#" className="hover:text-gray-200">About Us</a></li>
              </ul>
            </div>

            {/* Social Media Icons */}
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-xl hover:text-blue-500">
                <FaFacebookF />
              </a>
              <a href="#" className="text-xl hover:text-pink-500">
                <FaInstagram />
              </a>
              <a href="#" className="text-xl hover:text-blue-400">
                <FaTwitter />
              </a>
              <a href="#" className="text-xl hover:text-red-500">
                <FaEnvelope />
              </a>
            </div>
          </div>

        </div>

        {/* Footer Bottom */}
        <div className="text-center mt-4 text-sm text-gray-400">
          <p>© 2025 | BATMAN | All Rights Reserved.</p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
