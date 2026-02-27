export type UserRole = "ADMIN" | "USER" | "MENTOR";

export type UserWithRole = {
  role?: UserRole;
};
