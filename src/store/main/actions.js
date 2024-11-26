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

export const getAllUserAssets = () => ({
  type: GET_ALL_USER_ASSETS
});

export const getAllUserAssetsSuccess = (payload) => ({
  type: GET_ALL_USER_ASSETS_SUCCESS,
  payload
});

export const getAllUserAssetsError = payload => ({
  type: GET_ALL_USER_ASSETS_ERROR,
  payload
});

export const uploadAsset = (payload) => ({
  type: UPLOAD_ASSET,
  payload
});

export const uploadAssetSuccess = (payload) => ({
  type: UPLOAD_ASSET_SUCCESS,
  payload
});

export const uploadAssetError = payload => ({
  type: UPLOAD_ASSET_ERROR,
  payload
});
