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
  GET_ALL_USER_ASSETS,
  GET_ALL_USER_ASSETS_SUCCESS,
  GET_ALL_USER_ASSETS_ERROR,
  UPLOAD_ASSET,
  UPLOAD_ASSET_SUCCESS,
  UPLOAD_ASSET_ERROR
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
  allAssets: []
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
      
      case GET_ALL_USER_ASSETS:
          return {
              ...state,
              error: false,
              loading: true,
              errMsg: ""
          };

      case GET_ALL_USER_ASSETS_SUCCESS:
          return {
              ...state,
              error: false,
              loading: false,
              errMsg: "",
              allAssets: action.payload
          };
      case GET_ALL_USER_ASSETS_ERROR:
          return {
              ...state,
              error: true,
              loading: false,
              errMsg: action.payload?.response?.data?.error
          };
      
      case UPLOAD_ASSET:
          return {
              ...state,
              error: false,
              loading: true,
              errMsg: ""
          };

      case UPLOAD_ASSET_SUCCESS:
          return {
              ...state,
              error: false,
              loading: false,
              errMsg: ""
          };
      case UPLOAD_ASSET_ERROR:
          return {
              ...state,
              error: true,
              loading: false,
              errMsg: action.payload?.response?.data?.error
          };

      default:
          return { ...state };
  }
}

export default MyReducer;