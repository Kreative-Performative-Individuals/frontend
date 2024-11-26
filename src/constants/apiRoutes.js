const baseUrl = "http://localhost:8000";

// Auth
export const LoginUserAPI = `${baseUrl}/users/authenticate`; // POST { email, password }
export const RegisterUserAPI = `${baseUrl}/users/new`; // POST { email, password }
export const ForgetPasswordAPI = `${baseUrl}/users/forgetPassword`; // POST { email }
export const ResetPasswordAPI = `${baseUrl}/users/resetPassword`; // POST { password, confirmPassword, token }
export const GetAllUserAPI = `${baseUrl}/users/registered`; // GET add /:userType


export const GetAllAssetsAPI = `${baseUrl}/assets/all`; // GET All Assets
export const UploadAssetAPI = `${baseUrl}/assets/add`; // POST

export { baseUrl };