import { Outlet } from "react-router-dom";

const CustomerLayout = () => (
    <div className="p-4">
        <h1 className="text-2xl font-bold">Welcome to Our Store!</h1>
        <Outlet />
    </div>
);

export default CustomerLayout;
