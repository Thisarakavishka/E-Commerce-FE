export interface User {
    _id: string;
    name: string;
    email: string;
    phone?: string;
    address?: string;
    role: "super_admin" | "admin" | "user" | "customer";
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}
