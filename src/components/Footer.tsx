const Footer = () => {
    return (
      <footer className="bg-black text-white p-8 mt-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center md:text-left">
          <div>
            <h3 className="font-bold mb-2">Quick Links</h3>
            <ul>
              <li><a href="#" className="hover:underline">Home</a></li>
              <li><a href="#" className="hover:underline">Men</a></li>
              <li><a href="#" className="hover:underline">Women</a></li>
              <li><a href="#" className="hover:underline">Accessories</a></li>
              <li><a href="#" className="hover:underline">Offers</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-2">Account</h3>
            <ul>
              <li><a href="#" className="hover:underline">Login</a></li>
              <li><a href="#" className="hover:underline">Register</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-2">Legal</h3>
            <ul>
              <li><a href="#" className="hover:underline">Contact Us</a></li>
              <li><a href="#" className="hover:underline">About Us</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-2">Social</h3>
            <div className="flex justify-center md:justify-start space-x-4">
              <a href="#" className="text-xl">✉️</a>
              <a href="#" className="text-xl">📷</a>
              <a href="#" className="text-xl">🎵</a>
              <a href="#" className="text-xl">📘</a>
            </div>
          </div>
        </div>
        <div className="text-center mt-6">© 2025 | BrandLogo | All Rights Reserved.</div>
      </footer>
    );
  };
  
  export default Footer;