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
  GetMachineDetailAPI,
  // CheckDbAPI,
  CheckKpiEngineAPI,
  GetDerivedKpiDataAPI
} from "../../constants/apiRoutes";
import { getOneDay5MonthsAgo } from "../../constants/_helper";

// const userLoginAPI = async data => {
//   return await axios.post(LoginUserAPI, data);
// };
// const checkDBAPI = async () => {
//   return await axios.get(CheckDbAPI);
// };
const checkKpiEngineAPI = async () => {
  return await axios.get(CheckKpiEngineAPI);
};
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
  const { init_date, end_date } = getOneDay5MonthsAgo();
  return await axios.get(`${GetDashboardParamsAPI}?init_date=${init_date}&end_date=${end_date}`);
};
const getMachineDetailAPI = async ({ machineId, init_date, end_date }) => {
  return await axios.get(`${GetMachineDetailAPI}?machine_id=${machineId}&init_date=${init_date}&end_date=${end_date}`);
};
const getDerivedKpiAPI = async (data) => {
  return await axios.post(`${GetDerivedKpiDataAPI}`, data);
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
    yield call(checkKpiEngineAPI);
    const data = { ...payload }
    yield put(userLoginSuccess({ ...data }));
    yield history("/dashboard");
  } catch (error) {
    alert("Please make sure that the docker compose is up and running.")
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
    const machineDetail = (data.data);
    const utilization_rate_payload = { "name": "utilization_rate", "machines": [machineDetail.machineName], "operations": [machineDetail.machineStatus], "time_aggregation": "sum", "start_date": payload.init_date, "end_date": payload.end_date, "step": 2 }
    const utilization_rate = yield call(getDerivedKpiAPI, {...utilization_rate_payload});
    const availability_payload = { "name": "availability", "machines": [machineDetail.machineName], "operations": [machineDetail.machineStatus], "time_aggregation": "sum", "start_date": payload.init_date, "end_date": payload.end_date, "step": 2 }
    const availability = yield call(getDerivedKpiAPI, {...availability_payload});
    const downtime_payload = { "name": "non_operative_time", "machines": [machineDetail.machineName], "operations": [machineDetail.machineStatus], "time_aggregation": "sum", "start_date": payload.init_date, "end_date": payload.end_date, "step": 2 }
    const downtime = yield call(getDerivedKpiAPI, {...downtime_payload});
    const mean_time_between_failures_payload = { "name": "mean_time_between_failures", "machines": [machineDetail.machineName], "operations": [machineDetail.machineStatus], "time_aggregation": "sum", "start_date": payload.init_date, "end_date": payload.end_date, "step": 2 }
    const mean_time_between_failures = yield call(getDerivedKpiAPI, {...mean_time_between_failures_payload});
    const derivedKpiData = {
      utilization_rate: utilization_rate.data.value,
      availability: availability.data.value,
      downtime: downtime.data.value,
      mean_time_between_failures: mean_time_between_failures.data.value
    }
    yield put(getMachineDetailSuccess({ ...data.data, ...derivedKpiData }));
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
