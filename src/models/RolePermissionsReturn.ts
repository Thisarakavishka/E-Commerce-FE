export type UserRole = "SUPER_ADMIN" | "ADMIN" | "USER"

export interface RolePermissionsReturn {
    userRole: UserRole
    canCreate: boolean
    canUpdate: boolean
    canChangeStatus: boolean
    canDelete: boolean
    isLoading: boolean
}