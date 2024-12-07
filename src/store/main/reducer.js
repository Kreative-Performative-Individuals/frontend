import { transformMachineList } from "../../constants/_helper";
import { getLocal, setLocal } from "../../constants/localstorage";
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

const initialState = {
  token: getLocal("token") ? getLocal("token") : "",
  error: false,
  loginError: false,
  loading: false,
  isAuth: getLocal("token") ? true : false,
  user: getLocal("authUser") ? JSON.parse(getLocal("authUser")) : {},
  role: getLocal("authUser") ? JSON.parse(getLocal("authUser")).role : "",
  errMsg: "",
  successMsg: "",
  ragResponse: "",
  machines: [],
  dashboardParams: {}
};

const MyReducer = (state = initialState, action) => {
  switch (action.type) {
      case USER_REGISTER:
          return {
              ...state,
              error: false,
              loading: true,
              errMsg: ""
          };

      case USER_REGISTER_SUCCESS:
          return {
              ...state,
              error: false,
              loading: false,
              errMsg: ""
          };
      case USER_REGISTER_ERROR:
          return {
              ...state,
              error: true,
              loading: false,
              errMsg: action.payload?.response?.data?.error
          };

      case USER_LOGIN:
          return {
              ...state,
              loginError: false,
              loading: true,
              user: {},
              role: "",
              token: "",
              errMsg: ""
          };

      case USER_LOGIN_SUCCESS:
        setLocal("authUser", JSON.stringify(action.payload))
        return {
            ...state,
            token: action.payload?.data?.token,
            role: action.payload?.data?.role,
            user: action.payload?.data,
            isAuth: true,
            loading: false,
            loginError: false,
            errMsg: ""
        };
      case USER_LOGIN_ERROR:
          return {
              ...state,
              token: "",
              user: {},
              role: "",
              loading: false,
              isAuth: false,
              loginError: true,
              errMsg: action.payload?.response?.data?.message
          };

      case USER_LOGOUT:
          return {
              ...state,
              error: false,
              loading: true,
              user: {},
              role: "",
              token: "",
              isAuth: false
          };

      case USER_LOGOUT_SUCCESS:
          return {
              ...state,
              token: "",
              role: "",
              user: {},
              loading: false,
              error: false,
              isAuth: false
          };
      case USER_LOGOUT_ERROR:
          return {
              ...state,
              token: "",
              user: {},
              role: "",
              loading: false,
              error: true,
              isAuth: false
          };

      case FORGET_PASSWORD:
          return {
              ...state,
              error: false,
              loading: true,
              errMsg: ""
          };

      case FORGET_PASSWORD_SUCCESS:
          return {
              ...state,
              error: false,
              loading: false,
              errMsg: "",
              successMsg: action.payload.message
          };
      case FORGET_PASSWORD_ERROR:
          return {
              ...state,
              error: true,
              loading: false,
              errMsg: action.payload?.response?.data?.error
          };

      case RESET_PASSWORD:
          return {
              ...state,
              error: false,
              loading: true,
              errMsg: ""
          };

      case RESET_PASSWORD_SUCCESS:
          return {
              ...state,
              error: false,
              loading: false,
              errMsg: ""
          };
      case RESET_PASSWORD_ERROR:
          return {
              ...state,
              error: true,
              loading: false,
              errMsg: action.payload?.response?.data?.error
          };
      
      case CHAT_RAG:
          return {
              ...state,
              error: false,
              loading: true,
              errMsg: "",
              ragResponse: ""
          };

      case CHAT_RAG_SUCCESS:
          return {
              ...state,
              error: false,
              loading: false,
              errMsg: "",
              ragResponse: action.payload.response ? action.payload.response : "No Response"
          };
      case CHAT_RAG_ERROR:
          return {
              ...state,
              error: true,
              loading: false,
              errMsg: action.payload?.response?.data?.error,
              ragResponse: "Error. Please try again later."
          };
      
      case GET_DASHBOARD_PARAMS:
          return {
              ...state,
              error: false,
              loading: true,
              errMsg: "",
              dashboardParams: {}
          };

      case GET_DASHBOARD_PARAMS_SUCCESS:
          return {
              ...state,
              error: false,
              loading: false,
              errMsg: "",
              dashboardParams: action.payload.data
          };
      case GET_DASHBOARD_PARAMS_ERROR:
          return {
              ...state,
              error: true,
              loading: false,
              errMsg: action.payload?.response?.data?.error,
              dashboardParams: {}
          };
      
      case GET_MACHINE_LIST:
          return {
              ...state,
              error: false,
              loading: true,
              errMsg: "",
              machines: []
          };

      case GET_MACHINE_LIST_SUCCESS:
        const formattedData = transformMachineList(action.payload.data);
          return {
              ...state,
              error: false,
              loading: false,
              errMsg: "",
              machines: formattedData
          };
      case GET_MACHINE_LIST_ERROR:
          return {
              ...state,
              error: true,
              loading: false,
              errMsg: action.payload?.response?.data?.error,
              machines: []
          };
      
      
      default:
          return { ...state };
  }
}

export default MyReducer;