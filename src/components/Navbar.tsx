const Navbar = () => {
    return (
      <nav className="flex justify-between items-center p-4 bg-white shadow-md">
        <div className="text-xl font-bold">BRANDLOGO</div>
        <ul className="flex space-x-6">
          <li><a href="#" className="hover:underline">Men</a></li>
          <li><a href="#" className="hover:underline">Women</a></li>
          <li><a href="#" className="hover:underline">Accessories</a></li>
          <li><a href="#" className="hover:underline">Offers</a></li>
        </ul>
        <div className="flex space-x-4">
          <button className="text-xl">🛒</button>
          <button className="text-xl">👤</button>
        </div>
      </nav>
    );
  };
  
  export default Navbar;