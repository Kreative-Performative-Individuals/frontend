const baseUrl = "http://localhost:8000";
const dbUrl = "http://localhost:8002";
const ragUrl = "http://localhost:8005";

// Auth
export const LoginUserAPI = `${baseUrl}/users/authenticate`; // POST { email, password }
export const RegisterUserAPI = `${baseUrl}/users/new`; // POST { email, password }
export const ForgetPasswordAPI = `${baseUrl}/users/forgetPassword`; // POST { email }
export const ResetPasswordAPI = `${baseUrl}/users/resetPassword`; // POST { password, confirmPassword, token }
export const GetAllUserAPI = `${baseUrl}/users/registered`; // GET add /:userType

// Database (Group 2)
export const GetMachineListAPI = `${dbUrl}/machines`; // GET

// RAG (Group 5)
export const ChatRagAPI = `${ragUrl}/chat`; // GET Add ?message=""

export { baseUrl };