const baseUrl = "http://localhost:8000";
const ragUrl = "http://localhost:8005";

// Auth
export const LoginUserAPI = `${baseUrl}/users/authenticate`; // POST { email, password }
export const RegisterUserAPI = `${baseUrl}/users/new`; // POST { email, password }
export const ForgetPasswordAPI = `${baseUrl}/users/forgetPassword`; // POST { email }
export const ResetPasswordAPI = `${baseUrl}/users/resetPassword`; // POST { password, confirmPassword, token }
export const GetAllUserAPI = `${baseUrl}/users/registered`; // GET add /:userType


export const ChatRagAPI = `${ragUrl}/chat`; // GET Add ?message=""
export const UploadAssetAPI = `${baseUrl}/assets/add`; // POST

export { baseUrl };