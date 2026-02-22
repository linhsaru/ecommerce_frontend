export const hasPermission = (requiredRole, userRole) => {
  const roleHierarchy = {
    ADMIN: ['ADMIN', 'SUPER_ADMIN'],
    SUPER_ADMIN: ['SUPER_ADMIN'],
    USER: ['USER'],
  };

  if (!roleHierarchy[requiredRole]) {
    return false;
  }

  return roleHierarchy[requiredRole].includes(userRole);
};
