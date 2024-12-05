import { all, call, fork, put, takeEvery } from "redux-saga/effects";

import axios from "axios";

import {
  USER_LOGIN,
  USER_LOGOUT,
  USER_REGISTER,
  FORGET_PASSWORD,
  RESET_PASSWORD,
  CHAT_RAG,
  UPLOAD_ASSET
} from "../types";

import setDefaultToken, { clearLocal } from "../../constants/localstorage";
// setLocal,

import {
  userLoginError,
  userLoginSuccess,
  userLogoutSuccess,
  userLogoutError,
  registerUserSuccess,
  registerUserError,
  forgetPasswordSuccess,
  forgetPasswordError,
  resetPasswordSuccess,
  resetPasswordError,
  chatRagSuccess,
  chatRagError,
  uploadAssetSuccess,
  uploadAssetError
} from "./actions";

import {
  // LoginUserAPI,
  RegisterUserAPI,
  ForgetPasswordAPI,
  ResetPasswordAPI,
  ChatRagAPI,
  UploadAssetAPI
} from "../../constants/apiRoutes";

// const userLoginAPI = async data => {
//   return await axios.post(LoginUserAPI, data);
// };
const userRegisterAPI = async data => {
  return await axios.post(RegisterUserAPI, data);
};
const forgetPasswordAPI = async data => {
  return await axios.post(ForgetPasswordAPI, data);
};
const resetPasswordAPI = async data => {
  return await axios.post(ResetPasswordAPI, data);
};
const chatWithRagAPI = async data => {
  return await axios.get(`${ChatRagAPI}/?message=${data.message}`);
};
const uploadAssetAPI = async (data) => {
  return await axios.post(UploadAssetAPI, data);
};

function* userRegisterSaga({ payload, navigate }) {
  try {
    const { data } = yield call(userRegisterAPI, { ...payload });
    yield put(registerUserSuccess(data));
    yield navigate("/signin");
  } catch (error) {
    yield put(registerUserError(error));
  }
}

function* userLoginSaga({ payload, history }) {
  try {
    // const { data } = yield call(userLoginAPI, { ...payload });
    // setDefaultToken("Authorization", data.token);
    // setLocal("token", data.token);
    // setLocal("authUser", JSON.stringify({ ...data }));
    const data = { ...payload }
    yield put(userLoginSuccess({ ...data }));
    yield history("/dashboard");
  } catch (error) {
    yield put(userLoginError(error));
  }
}

function* userLogoutSaga({ history }) {
  try {
    setDefaultToken("Authorization", "");
    clearLocal();
    yield put(userLogoutSuccess());
    yield history("/");
  } catch (error) {
    yield history("/dashboard");
    yield put(userLogoutError(error));
  }
}

function* forgetPasswordSaga({ payload }) {
  try {
    const { data } = yield call(forgetPasswordAPI, { ...payload });
    setDefaultToken("Authorization", "");
    clearLocal();
    yield put(forgetPasswordSuccess(data));
  } catch (error) {
    yield put(forgetPasswordError(error));
  }
}

function* resetPasswordSaga({ payload, history }) {
  try {
    yield call(resetPasswordAPI, { ...payload });
    setDefaultToken("Authorization", "");
    clearLocal();
    yield put(resetPasswordSuccess());
    yield history("/signin");
  } catch (error) {
    yield put(resetPasswordError(error));
  }
}

function* chatWithRagSaga({ payload }) {
  try {
    const { data } = yield call(chatWithRagAPI, { ...payload });
    yield put(chatRagSuccess(data));
  } catch (error) {
    yield put(chatRagError(error));
  }
}

function* uploadAssetSaga({payload}) {
  try {
    const formData = new FormData();
    formData.append("files", payload);
    const { data } = yield call(uploadAssetAPI, formData);
    yield put(uploadAssetSuccess(data.result));
  } catch (error) {
    yield put(uploadAssetError(error));
  }
}

export function* watchUserRegister() {
  yield takeEvery(USER_REGISTER, userRegisterSaga);
}
export function* watchUserLogin() {
  yield takeEvery(USER_LOGIN, userLoginSaga);
}
export function* watchUserLogout() {
  yield takeEvery(USER_LOGOUT, userLogoutSaga);
}
export function* watchForgetPassword() {
  yield takeEvery(FORGET_PASSWORD, forgetPasswordSaga);
}
export function* watchResetPassword() {
  yield takeEvery(RESET_PASSWORD, resetPasswordSaga);
}
export function* watchGetAllUserAssets() {
  yield takeEvery(CHAT_RAG, chatWithRagSaga);
}
export function* watchUploadAsset() {
  yield takeEvery(UPLOAD_ASSET, uploadAssetSaga);
}

export default function* rootSaga() {
  yield all([
    fork(watchUserLogin),
    fork(watchUserLogout),
    fork(watchUserRegister),
    fork(watchForgetPassword),
    fork(watchResetPassword),
    fork(watchGetAllUserAssets),
    fork(watchUploadAsset)
  ]);
}
