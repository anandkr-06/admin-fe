// export const permissions = {
//     ADMIN: ["COURSE_APPROVE", "USER_BLOCK"],
//     MANAGER: ["COURSE_APPROVE"],
//   };

//   export function can(role: string, action: string) {
//     return permissions[role]?.includes(action);
//   }
export type Role = "ADMIN" | "MANAGER";

export type Permission = "COURSE_APPROVE" | "USER_BLOCK";

export const permissions: Record<Role, Permission[]> = {
    ADMIN: ["COURSE_APPROVE", "USER_BLOCK"],
    MANAGER: ["COURSE_APPROVE"],
};

export function can(role: Role, action: Permission): boolean {
    return permissions[role].includes(action);
}
