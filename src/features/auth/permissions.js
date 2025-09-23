import Roles from "./roles";

export const RBAC_BYPASS =
  (import.meta.env.VITE_RBAC_BYPASS ?? "true") !== "false";

export const Permissions = {
  MANAGE_ADMINS: "MANAGE_ADMINS",
  VIEW_DASHBOARD: "VIEW_DASHBOARD",
  VIEW_REPORTS: "VIEW_REPORTS",
  VIEW_COMPLAINTS: "VIEW_COMPLAINTS",
  VIEW_ORDERS: "VIEW_ORDERS",
  VIEW_USERS: "VIEW_USERS",
  VIEW_CHAT: "VIEW_CHAT",
};

export const permissionLabels = {
  [Permissions.MANAGE_ADMINS]: "إدارة المسؤولين",
  [Permissions.VIEW_DASHBOARD]: "عرض لوحة التحكم",
  [Permissions.VIEW_REPORTS]: "عرض التقارير",
  [Permissions.VIEW_COMPLAINTS]: "عرض الشكاوى",
  [Permissions.VIEW_ORDERS]: "عرض الطلبات",
  [Permissions.VIEW_USERS]: "عرض المستخدمين",
  [Permissions.VIEW_CHAT]: "عرض المحادثات",
};

export const allPermissions = Object.values(Permissions);

export const roleToPermissions = {
  [Roles.SUPER_ADMIN]: [
    Permissions.MANAGE_ADMINS,
    Permissions.VIEW_DASHBOARD,
    Permissions.VIEW_REPORTS,
    Permissions.VIEW_COMPLAINTS,
    Permissions.VIEW_ORDERS,
    Permissions.VIEW_USERS,
    Permissions.VIEW_CHAT,
  ],
  [Roles.ADMIN]: [
    Permissions.VIEW_DASHBOARD,
    Permissions.VIEW_REPORTS,
    Permissions.VIEW_COMPLAINTS,
    Permissions.VIEW_ORDERS,
    Permissions.VIEW_USERS,
    Permissions.VIEW_CHAT,
  ],
  // المستخدمين العاديين ليس لديهم أي صلاحيات إدارية
  [Roles.USER]: [],
};

export const getEffectivePermissions = (user) => {
  if (!user) return new Set();

  // السوبر أدمين لديه كل الصلاحيات
  if (user.role === Roles.SUPER_ADMIN || user.grantAll) {
    console.log("🔑 Super Admin detected - granting all permissions");
    return new Set(allPermissions);
  }

  // المستخدمين العاديين ممنوعين من الداش بورد
  if (user.role === Roles.USER) {
    console.log("❌ Regular User - no admin permissions");
    return new Set();
  }

  const base = new Set(roleToPermissions[user.role] || []);
  const allowed = Array.isArray(user.permissions) ? user.permissions : [];
  const denied = Array.isArray(user.deniedPermissions)
    ? user.deniedPermissions
    : [];
  for (const p of allowed) base.add(p);
  for (const p of denied) base.delete(p);
  return base;
};

export const can = (user, permission) => {
  if (RBAC_BYPASS) {
    console.log("🔓 RBAC Bypass enabled - allowing access");
    return true;
  }

  if (!user) {
    console.log("❌ No user - denying access");
    return false;
  }

  // المستخدمين العاديين ممنوعين من الداش بورد
  if (user.role === Roles.USER) {
    console.log("❌ Regular User - denying admin access");
    return false;
  }

  // السوبر أدمين لديه كل الصلاحيات
  if (user.role === Roles.SUPER_ADMIN) {
    console.log("🔑 Super Admin - allowing access to:", permission);
    return true;
  }

  const eff = getEffectivePermissions(user);
  const hasPermission = eff.has(permission);
  console.log(
    `🔍 Permission check for ${user.role}: ${permission} = ${hasPermission}`
  );
  return hasPermission;
};

export default Permissions;
