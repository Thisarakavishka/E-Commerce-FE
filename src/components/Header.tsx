import { BsBell } from "react-icons/bs";
import { useAuth } from "../context/AuthContext";
import { formatUserRole } from "../utils/formatRole";

const Header = ({ notifications = 14 }) => {

    const { user } = useAuth();

    if (!user) return null;

    const userInitial = user.firstName.charAt(0).toUpperCase();

    return (
        <header className="w-full h-[50px] bg-white border-b border-gray-200 fixed top-0 right-0 flex justify-between items-center px-6 z-10">
            <h1 className="text-3xl font-light" style={{ fontFamily: "Anton SC" }}>
                Batman
            </h1>

            <div className="flex items-center gap-10">
                <div className="text-sm leading-tight py-1">
                    <p className="font-semibold text-[13px]">Welcome, {user.firstName} {user.lastName}</p>
                    <p className="font-medium text-gray-600 text-[11px]">
                        {new Date().toLocaleDateString('en-GB', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                        })} | {new Date().toLocaleDateString('en-GB', { weekday: 'long' })}
                    </p>
                </div>

                <div className="relative cursor-pointer hover:text-gray-500">
                    <BsBell className="text-3xl" />
                    {notifications > 0 && (
                        <span className="absolute -top-1 -right-1 bg-black text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                            {notifications > 9 ? "9+" : notifications}
                        </span>
                    )}
                </div>

                <div className="cursor-pointer hover:opacity-80 flex items-center gap-2">
                    <div className="w-8 h-8 bg-black text-white flex justify-center items-center rounded-full font-bold text-lg">
                        {userInitial}
                    </div>
                    <div className="text-sm leading-tight">
                        <p className="font-semibold text-[13px]">{user.firstName} {user.lastName.slice(0, 3)}..</p>
                        <p className="font-medium text-gray-600 text-[11px]">{formatUserRole(user.role)}</p>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;