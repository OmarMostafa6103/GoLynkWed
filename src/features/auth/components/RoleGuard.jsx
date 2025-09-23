import { Navigate } from "react-router-dom";
import PropTypes from "prop-types";
import { can } from "../permissions";
import { Roles } from "../roles";

const RoleGuard = ({ user, permission, children, fallback = null }) => {
  if (!user) return <Navigate to="/login" replace />;

  // منع المستخدمين العاديين من الوصول للداش بورد
  if (user.role === Roles.USER) {
    return <Navigate to="/login" replace />;
  }

  if (!permission || can(user, permission)) return children;
  return (
    fallback ?? (
      <div className="p-6">
        <h2 className="text-xl font-bold text-red-600">
          ليس لديك صلاحية للوصول
        </h2>
        <p className="text-gray-600 text-sm mt-2">
          يرجى التواصل مع المشرف الأعلى.
        </p>
      </div>
    )
  );
};

RoleGuard.propTypes = {
  user: PropTypes.shape({
    role: PropTypes.string,
  }),
  permission: PropTypes.string,
  children: PropTypes.node,
  fallback: PropTypes.node,
};

export default RoleGuard;
