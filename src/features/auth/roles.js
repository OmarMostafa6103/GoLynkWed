export const Roles = {
  SUPER_ADMIN: "SuperAdmin",
  ADMIN: "Admin",
  USER: "User", // المستخدمين العاديين - ممنوعين من الداش بورد
};

export const roleLabels = {
  [Roles.SUPER_ADMIN]: "سوبر أدمن",
  [Roles.ADMIN]: "أدمن",
  [Roles.USER]: "مستخدم عادي",
};

export default Roles;
