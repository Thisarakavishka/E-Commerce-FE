import { useState, useEffect } from "react"
import { RolePermissionsReturn, UserRole } from "../models/RolePermissionsReturn"

/**
 * @param entityType Optional parameter to specify different permission rules for different entities
 * @returns Object containing user role and permission check functions
 */
export const useRolePermissions = (entityType?: "product" | "category" | "user"): RolePermissionsReturn => {
    const [userRole, setUserRole] = useState<UserRole>("USER")
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const getUserRole = () => {
            try {
                setIsLoading(true)
                // Get user data from localStorage
                const userData = localStorage.getItem("user")
                if (userData) {
                    const parsedData = JSON.parse(userData)
                    const role = parsedData.role.toUpperCase()
                    setUserRole(role as UserRole)
                }
            } catch (error) {
                console.error("Failed to get user role:", error)
                setUserRole("USER")
            } finally {
                setIsLoading(false)
            }
        }

        getUserRole()
    }, [])

    // Default permission rules
    const canCreate = ["SUPER_ADMIN", "ADMIN"].includes(userRole)
    const canUpdate = ["SUPER_ADMIN", "ADMIN"].includes(userRole)
    const canChangeStatus = ["SUPER_ADMIN", "ADMIN"].includes(userRole)
    const canDelete = userRole === "SUPER_ADMIN"

    // // You can add entity-specific permission rules here
    // // For example, if certain entities have different permission requirements
    // if (entityType === "user") {
    //     // Only SUPER_ADMIN can create/update/delete users
    //     return {
    //         userRole,
    //         canCreate: userRole === "SUPER_ADMIN",
    //         canUpdate: userRole === "SUPER_ADMIN",
    //         canChangeStatus: userRole === "SUPER_ADMIN",
    //         canDelete: userRole === "SUPER_ADMIN",
    //         isLoading,
    //     }
    // }

    // Return default permissions
    return {
        userRole,
        canCreate,
        canUpdate,
        canChangeStatus,
        canDelete,
        isLoading,
    }
}
