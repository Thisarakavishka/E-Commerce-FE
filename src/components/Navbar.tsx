import React from "react";
import { HiShoppingBag, HiUserCircle } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface NavbarProps {
  toggleCart: () => void;
  cartItemCount: number;
}

const Navbar: React.FC<NavbarProps> = ({ toggleCart, cartItemCount }) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleAccountClick = () => {
    navigate(user?.role.toUpperCase() === "CUSTOMER" ? "/customer/profile" : "/customer/login");
  };

  const handleNavigation = () => {
    navigate("/");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center p-4 bg-white shadow-md hover:shadow-lg transition-shadow">
      <div className="text-2xl font-light" style={{ fontFamily: "Anton SC" }} onClick={handleNavigation}>
        BATMAN
      </div>

      <ul className="flex space-x-6">
        <li>
          <a href="#" className="hover:underline">
            Men
          </a>
        </li>
        <li>
          <a href="#" className="hover:underline">
            Women
          </a>
        </li>
        <li>
          <a href="#" className="hover:underline">
            Accessories
          </a>
        </li>
        <li>
          <a href="#" className="hover:underline">
            Offers
          </a>
        </li>
      </ul>

      <div className="flex space-x-4 relative">

        <button className="relative text-2xl" onClick={toggleCart}>
          <HiShoppingBag />
          {cartItemCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
              {cartItemCount}
            </span>
          )}
        </button>

        <button className="text-2xl" onClick={handleAccountClick}>
          <HiUserCircle />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
