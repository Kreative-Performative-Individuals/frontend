import {
  USER_REGISTER,
  USER_REGISTER_SUCCESS,
  USER_REGISTER_ERROR,
  USER_LOGIN,
  USER_LOGIN_SUCCESS,
  USER_LOGIN_ERROR,
  USER_LOGOUT,
  USER_LOGOUT_SUCCESS,
  USER_LOGOUT_ERROR,
  FORGET_PASSWORD,
  FORGET_PASSWORD_SUCCESS,
  FORGET_PASSWORD_ERROR,
  RESET_PASSWORD,
  RESET_PASSWORD_SUCCESS,
  RESET_PASSWORD_ERROR,
  CHAT_RAG,
  CHAT_RAG_SUCCESS,
  CHAT_RAG_ERROR,
  GET_MACHINE_LIST,
  GET_MACHINE_LIST_SUCCESS,
  GET_MACHINE_LIST_ERROR,
  GET_DASHBOARD_PARAMS,
  GET_DASHBOARD_PARAMS_SUCCESS,
  GET_DASHBOARD_PARAMS_ERROR,
} from "../types";

export const registerUser = (payload, navigate) => ({
  type: USER_REGISTER,
  payload,
  navigate
});

export const registerUserSuccess = payload => ({
  type: USER_REGISTER_SUCCESS,
  payload
});

export const registerUserError = payload => ({
  type: USER_REGISTER_ERROR,
  payload
});

export const userLogin = (payload, history) => ({
  type: USER_LOGIN,
  payload,
  history
});

export const userLoginSuccess = payload => ({
  type: USER_LOGIN_SUCCESS,
  payload
});

export const userLoginError = payload => ({
  type: USER_LOGIN_ERROR,
  payload
});

export const userLogout = (payload, history) => ({
  type: USER_LOGOUT,
  payload,
  history
});

export const userLogoutSuccess = () => ({
  type: USER_LOGOUT_SUCCESS
});

export const userLogoutError = () => ({
  type: USER_LOGOUT_ERROR
});

export const forgetPassword = payload => ({
  type: FORGET_PASSWORD,
  payload
});

export const forgetPasswordSuccess = payload => ({
  type: FORGET_PASSWORD_SUCCESS,
  payload
});

export const forgetPasswordError = payload => ({
  type: FORGET_PASSWORD_ERROR,
  payload
});

export const resetPassword = (payload, history) => ({
  type: RESET_PASSWORD,
  payload,
  history
});

export const resetPasswordSuccess = () => ({
  type: RESET_PASSWORD_SUCCESS
});

export const resetPasswordError = payload => ({
  type: RESET_PASSWORD_ERROR,
  payload
});

export const chatRag = (payload) => ({
  type: CHAT_RAG,
  payload
});

export const chatRagSuccess = (payload) => ({
  type: CHAT_RAG_SUCCESS,
  payload
});

export const chatRagError = payload => ({
  type: CHAT_RAG_ERROR,
  payload
});

export const getMachineList = () => ({
  type: GET_MACHINE_LIST
});

export const getMachineListSuccess = (payload) => ({
  type: GET_MACHINE_LIST_SUCCESS,
  payload
});

export const getMachineListError = payload => ({
  type: GET_MACHINE_LIST_ERROR,
  payload
});

export const getDashboardParams = () => ({
  type: GET_DASHBOARD_PARAMS
});

export const getDashboardParamsSuccess = (payload) => ({
  type: GET_DASHBOARD_PARAMS_SUCCESS,
  payload
});

export const getDashboardParamsError = payload => ({
  type: GET_DASHBOARD_PARAMS_ERROR,
  payload
});
