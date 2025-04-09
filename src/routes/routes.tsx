import { Route, Routes, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AdminLayout from "../layouts/AdminLayout";
import Dashboard from "../pages/admin/Dashboard";
import LoginPage from "../pages/LoginPage";
import Customers from "../pages/admin/Customers";
import Products from "../pages/admin/Products";
import Users from "../pages/admin/Users";
import Reports from "../pages/admin/Reports";
import Notifications from "../pages/admin/Notifications";
import Orders from "../pages/admin/Orders";
import Help from "../pages/admin/Help";
import Preferences from "../pages/admin/Preferences";
import Category from "../pages/admin/Category";
import Shop from "../pages/Shop";
import Checkout from "../pages/customer/CheckoutPage";
import CustomerLogin from "../pages/CustomerLogin";
import ForgotPassword from "../pages/ForgotPassword";
import Signup from "../pages/Signup";
import UserProfile from "../pages/customer/UserProfilePage";
import Home from "../pages/Home";

const AppRoutes = () => {
    const { token, user } = useAuth();
    const role = user?.role ? user.role.toUpperCase() : undefined;

    return (
        <Routes>
            {/* Public Route */}
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/customer/login" element={<CustomerLogin />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/signup" element={<Signup />} />

            <Route path="/checkout" element={token && role === "CUSTOMER" ? <Checkout /> : <Navigate to="/customer/login" />} />
            <Route path="/customer/profile" element={token && role === "CUSTOMER" ? <UserProfile /> : <Navigate to="/customer/login" />} />

            {/* Admin Layout with Role Protection */}
            {token && (role === "ADMIN" || role === "SUPER_ADMIN" || role === "USER") ? (
                <Route path="/admin" element={<AdminLayout />}>
                    <Route path="Dashboard" element={<Dashboard />} />
                    <Route path="Products" element={<Products />} />
                    <Route path="Category" element={<Category />} />
                    <Route path="Customers" element={<Customers />} />
                    <Route path="Users" element={<Users />} />
                    <Route path="Reports" element={<Reports />} />
                    <Route path="Notifications" element={<Notifications />} />
                    <Route path="Orders" element={<Orders />} />
                    <Route path="Help" element={<Help />} />
                    <Route path="Preferences" element={<Preferences />} />
                </Route>
            ) : (
                <Route path="/admin/*" element={<Navigate to="/login" />} />
            )}

        </Routes>
    );
};

export default AppRoutes;
