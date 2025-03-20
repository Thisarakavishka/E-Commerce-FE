export const formatUserRole = (role: string) => {
    const roleMap: Record<string, string> = {
        super_admin: "Super Admin",
        admin: "Admin",
        user: "User",
        customer: "Customer",
    };

    return roleMap[role] || "Unknown Role";
};
