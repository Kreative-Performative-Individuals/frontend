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
  GET_DASHBOARD_PARAMS,
  GET_DASHBOARD_PARAMS_SUCCESS,
  GET_DASHBOARD_PARAMS_ERROR,
  GET_MACHINE_LIST,
  GET_MACHINE_LIST_SUCCESS,
  GET_MACHINE_LIST_ERROR,
  GET_MACHINE_DETAIL,
  GET_MACHINE_DETAIL_SUCCESS,
  GET_MACHINE_DETAIL_ERROR,
  GET_PRODUCTION_DASHBOARD,
  GET_PRODUCTION_DASHBOARD_SUCCESS,
  GET_PRODUCTION_DASHBOARD_ERROR,
  GET_PRODUCTION_DETAIL,
  GET_PRODUCTION_DETAIL_SUCCESS,
  GET_PRODUCTION_DETAIL_ERROR,
  GET_ENERGY_DASHBOARD,
  GET_ENERGY_DASHBOARD_SUCCESS,
  GET_ENERGY_DASHBOARD_ERROR,
  GET_KPI_CLASS_INSTANCE,
  GET_KPI_CLASS_INSTANCE_SUCCESS,
  GET_KPI_CLASS_INSTANCE_ERROR,
  GET_FORECAST,
  GET_FORECAST_SUCCESS,
  GET_FORECAST_ERROR,
  REPORT_LIST,
  GET_SINGLE_REPORT,
  ADD_REPORT_TO_LIST,
  DELETE_REPORT
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

export const getMachineDetail = (payload) => ({
  type: GET_MACHINE_DETAIL,
  payload
});

export const getMachineDetailSuccess = (payload) => ({
  type: GET_MACHINE_DETAIL_SUCCESS,
  payload
});

export const getMachineDetailError = payload => ({
  type: GET_MACHINE_DETAIL_ERROR,
  payload
});

export const getProductionDashboard = () => ({
  type: GET_PRODUCTION_DASHBOARD
});

export const getProductionDashboardSuccess = (payload) => ({
  type: GET_PRODUCTION_DASHBOARD_SUCCESS,
  payload
});

export const getProductionDashboardError = payload => ({
  type: GET_PRODUCTION_DASHBOARD_ERROR,
  payload
});

export const getProductionDetail = (payload) => ({
  type: GET_PRODUCTION_DETAIL,
  payload
});

export const getProductionDetailSuccess = (payload) => ({
  type: GET_PRODUCTION_DETAIL_SUCCESS,
  payload
});

export const getProductionDetailError = payload => ({
  type: GET_PRODUCTION_DETAIL_ERROR,
  payload
});

export const getEnergyDashboard = () => ({
  type: GET_ENERGY_DASHBOARD
});

export const getEnergyDashboardSuccess = (payload) => ({
  type: GET_ENERGY_DASHBOARD_SUCCESS,
  payload
});

export const getEnergyDashboardError = payload => ({
  type: GET_ENERGY_DASHBOARD_ERROR,
  payload
});

export const getKpiClassInstance = (payload) => ({
  type: GET_KPI_CLASS_INSTANCE,
  payload
});

export const getKpiClassInstanceSuccess = (payload) => ({
  type: GET_KPI_CLASS_INSTANCE_SUCCESS,
  payload
});

export const getKpiClassInstanceError = payload => ({
  type: GET_KPI_CLASS_INSTANCE_ERROR,
  payload
});

export const getForecasting = (payload) => ({
  type: GET_FORECAST,
  payload
});

export const getForecastingSuccess = (payload) => ({
  type: GET_FORECAST_SUCCESS,
  payload
});

export const getForecastingError = payload => ({
  type: GET_FORECAST_ERROR,
  payload
});

export const getReportList = () => ({
  type: REPORT_LIST
});
export const getSingleReport = (payload) => ({
  type: GET_SINGLE_REPORT,
  payload
});
export const addReportToList = (payload) => ({
  type: ADD_REPORT_TO_LIST,
  payload
});
export const deleteReport = (payload) => ({
  type: DELETE_REPORT,
  payload
});