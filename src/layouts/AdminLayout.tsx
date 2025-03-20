import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

const AdminLayout = () => (
    <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <div className="flex flex-col flex-1 overflow-hidden">
            <Header />
            <main className="flex-1 overflow-auto mt-[50px] ml-[240px]">
                <Outlet />
            </main>
        </div>
    </div>
);

export default AdminLayout;
