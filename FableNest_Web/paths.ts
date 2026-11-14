export const homePath = () => "/";

// auth paths
const AUTH_PREFIX = "/auth";
export const loginPath = () => `${AUTH_PREFIX}/login`;
export const signupPath = () => `${AUTH_PREFIX}/signup`;
export const forgotPasswordPath = () => `${AUTH_PREFIX}/forgot-password`;
export const newPasswordPath = () => `${AUTH_PREFIX}/new-password`;
export const unauthorizedPath = () => `/unauthorized`;
export const passwordResetSuccessPath = () => `${AUTH_PREFIX}/forgot-password/reset/success`;
export const loginSuccessPath = () => `${AUTH_PREFIX}/login/success`;
export const signupSuccessPath = () => `${AUTH_PREFIX}/signup/success`;

// super_admin dashboard paths
const DASHBOARD_PREFIX = "/dashboard";
export const superAdminDashboardPath = () => `${DASHBOARD_PREFIX}/super-admin`;

// admin dashboard paths
export const adminDashboardPath = () => `${DASHBOARD_PREFIX}/admin`;

// user dashboard paths
export const userDashboardPath = () =>
  `${DASHBOARD_PREFIX}/user`;

export const generateNewDashboardPath = () => `${DASHBOARD_PREFIX}/user/generate-new`;
export const analyticsDashboardPath = () => `${DASHBOARD_PREFIX}/user/analytics`;
export const historyDashboardPath = () => `${DASHBOARD_PREFIX}/user/history`;
export const saveFilesDashboardPath = () => `${DASHBOARD_PREFIX}/user/save-files`;
export const trashDashboardPath = () => `${DASHBOARD_PREFIX}/user/trash`;