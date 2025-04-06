import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";
import { fetchActiveProducts } from "../services/productService";
import { Product } from "../models/Product";
import Cart from "../components/Cart";

const Shop = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<(Product & { quantity: number })[]>([]);
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    const loadProducts = async () => {
      const data = await fetchActiveProducts();
      setProducts(data);
    };
    loadProducts();

    // Load cart from localStorage only if it's not empty
    const savedCart = localStorage.getItem("cart");
    console.log("Loaded cart from localStorage:", savedCart);
    if (savedCart && savedCart !== "[]") {
      setCart(JSON.parse(savedCart)); // Initialize cart with localStorage data
    }
  }, []);

  useEffect(() => {
    if (cart.length === 0) {
      console.log("Saving empty cart to localStorage");
      localStorage.setItem("cart", JSON.stringify([])); // Save empty cart if no items
    } else {
      console.log("Saving cart to localStorage", cart);
      localStorage.setItem("cart", JSON.stringify(cart)); // Save cart data
    }
  }, [cart]);

  const addToCart = (product: Product) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item._id === product._id);
      return existing
        ? prevCart.map((item) =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
        : [...prevCart, { ...product, quantity: 1 }];
    });
    setCartOpen(true);
  };

  const updateQuantity = (productId: string, quantity: number) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item._id === productId ? { ...item, quantity: Math.max(1, quantity) } : item
      )
    );
  };

  const removeItem = (productId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item._id !== productId));
  };

  return (
    <div>
      <Navbar toggleCart={() => setCartOpen(!cartOpen)} cartItemCount={cart.reduce((sum, item) => sum + item.quantity, 0)} />
      <div className="p-8 mt-16 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} onAddToCart={addToCart} />
        ))}
      </div>
      <Footer />
      <Cart cartItems={cart} cartOpen={cartOpen} toggleCart={() => setCartOpen(!cartOpen)} updateQuantity={updateQuantity} removeItem={removeItem} />
    </div>
  );
};

export default Shop;
