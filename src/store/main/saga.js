import { all, call, fork, put, takeEvery } from "redux-saga/effects";

import axios from "axios";

import {
  USER_LOGIN,
  USER_LOGOUT,
  USER_REGISTER,
  FORGET_PASSWORD,
  RESET_PASSWORD,
  CHAT_RAG,
  GET_MACHINE_LIST,
  GET_DASHBOARD_PARAMS,
  GET_MACHINE_DETAIL
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
  getMachineListSuccess,
  getMachineListError,
  getDashboardParamsSuccess,
  getDashboardParamsError,
  getMachineDetailSuccess,
  getMachineDetailError
} from "./actions";

import {
  // LoginUserAPI,
  RegisterUserAPI,
  ForgetPasswordAPI,
  ResetPasswordAPI,
  ChatRagAPI,
  GetDashboardParamsAPI,
  GetMachineListAPI,
  GetMachineDetailAPI
} from "../../constants/apiRoutes";
import { getOneDay7MonthsAgo } from "../../constants/_helper";

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
const getMachineListAPI = async () => {
  return await axios.get(`${GetMachineListAPI}`);
};
const getDashboardParamsAPI = async () => {
  // const { init_date, end_date } = getLast24Hours();
  const { init_date, end_date } = getOneDay7MonthsAgo();
  return await axios.get(`${GetDashboardParamsAPI}?init_date=${init_date}&end_date=${end_date}`);
};
const getMachineDetailAPI = async ({ machineId, init_date, end_date }) => {
  return await axios.get(`${GetMachineDetailAPI}?machine_id=${machineId}&init_date=${init_date}&end_date=${end_date}`);
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

function* getDashboardParamsSaga() {
  try {
    const { data } = yield call(getDashboardParamsAPI);
    yield put(getDashboardParamsSuccess(data));
  } catch (error) {
    yield put(getDashboardParamsError(error));
  }
}

function* getMachineListSaga() {
  try {
    const { data } = yield call(getMachineListAPI);
    yield put(getMachineListSuccess(data));
  } catch (error) {
    yield put(getMachineListError(error));
  }
}

function* getMachineDetailSaga({ payload }) {
  try {
    const { data } = yield call(getMachineDetailAPI, {...payload});
    yield put(getMachineDetailSuccess(data));
  } catch (error) {
    yield put(getMachineDetailError(error));
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
export function* watchChatWithRag() {
  yield takeEvery(CHAT_RAG, chatWithRagSaga);
}
export function* watchGetDashboardParams() {
  yield takeEvery(GET_DASHBOARD_PARAMS, getDashboardParamsSaga);
}
export function* watchGetMachineList() {
  yield takeEvery(GET_MACHINE_LIST, getMachineListSaga);
}
export function* watchGetMachineDetail() {
  yield takeEvery(GET_MACHINE_DETAIL, getMachineDetailSaga);
}

export default function* rootSaga() {
  yield all([
    fork(watchUserLogin),
    fork(watchUserLogout),
    fork(watchUserRegister),
    fork(watchForgetPassword),
    fork(watchResetPassword),
    fork(watchChatWithRag),
    fork(watchGetDashboardParams),
    fork(watchGetMachineList),
    fork(watchGetMachineDetail),
  ]);
}
