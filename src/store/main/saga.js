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
  GET_MACHINE_DETAIL,
  GET_PRODUCTION_DASHBOARD,
  GET_PRODUCTION_DETAIL
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
  getMachineDetailError,
  getProductionDashboardSuccess,
  getProductionDashboardError,
  getProductionDetailSuccess,
  getProductionDetailError,
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
  GetDerivedKpiDataAPI,
  GetProductionDashboardAPI
} from "../../constants/apiRoutes";
import { getOneDay5MonthsAgo, transformMachineList } from "../../constants/_helper";

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
const getProductionDashboardAPI = async () => {
  const { init_date, end_date } = getOneDay5MonthsAgo();
  return await axios.get(`${GetProductionDashboardAPI}?init_date=${init_date}&end_date=${end_date}`);
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

function* getProductionDashboardSaga() {
  try {
    const { data } = yield call(getProductionDashboardAPI);
    const machineListResponse = yield call(getMachineListAPI);
    const machineList = transformMachineList(machineListResponse.data.data);

    const machineListArray = [];
    
    // const { init_date, end_date } = getOneDay5MonthsAgo();
    const init_date = "2024-05-02 12:00:00";
    const end_date = "2024-05-03 12:00:00";
    for (const machine of machineList) {
      const average_cycle_time_payload = { "name": "average_cycle_time_avg", "machines": [machine.name], "operations": ["working"], "time_aggregation": "mean", "start_date": init_date, "end_date": end_date, "step": 2 }
      const average_cycle_time = yield call(getDerivedKpiAPI, {...average_cycle_time_payload});
      const good_cycles_sum_payload = { "name": "good_cycles_sum", "machines": [machine.name], "operations": ["working"], "time_aggregation": "sum", "start_date": init_date, "end_date": end_date, "step": 2 }
      const good_cycles_sum = yield call(getDerivedKpiAPI, {...good_cycles_sum_payload});
      const bad_cycles_sum_payload = { "name": "bad_cycles_sum", "machines": [machine.name], "operations": ["working"], "time_aggregation": "sum", "start_date": init_date, "end_date": end_date, "step": 2 }
      const bad_cycles_sum = yield call(getDerivedKpiAPI, {...bad_cycles_sum_payload});
      const total_cycles_sum_payload = { "name": "cycles_sum", "machines": [machine.name], "operations": ["working"], "time_aggregation": "sum", "start_date": init_date, "end_date": end_date, "step": 2 }
      const total_cycles_sum = yield call(getDerivedKpiAPI, {...total_cycles_sum_payload});
      const success_rate_payload = { "name": "success_rate", "machines": [machine.name], "operations": ["working"], "time_aggregation": "sum", "start_date": init_date, "end_date": end_date, "step": 2 }
      const success_rate = yield call(getDerivedKpiAPI, {...success_rate_payload});
      const failure_rate_payload = { "name": "failure_rate", "machines": [machine.name], "operations": ["working"], "time_aggregation": "sum", "start_date": init_date, "end_date": end_date, "step": 2 }
      const failure_rate = yield call(getDerivedKpiAPI, {...failure_rate_payload});
      // const efficiency_sum_payload = { "name": "overall_equipment_effectiveness", "machines": [machine.name], "operations": ["working"], "time_aggregation": "sum", "start_date": init_date, "end_date": end_date, "step": 2 }
      // const efficiency_sum = yield call(getDerivedKpiAPI, {...efficiency_sum_payload});
      machineListArray.push({
        ...machine,
        average_cycle_time: average_cycle_time.data.value,
        good_cycles: good_cycles_sum.data.value,
        bad_cycles: bad_cycles_sum.data.value,
        total_cycles: total_cycles_sum.data.value,
        success_rate: success_rate.data.value,
        failure_rate: failure_rate.data.value,
        // efficiency: efficiency_sum.data.value,
        efficiency: (success_rate.data.value / (success_rate.data.value + failure_rate.data.value)) * 100 || 0,
      })
    }
    
    const formatted = {...data.data, machines: machineListArray}
    yield put(getProductionDashboardSuccess(formatted));
  } catch (error) {
    yield put(getProductionDashboardError(error));
  }
}

function* getProductionDetailSaga({ payload }) {
  try {
    // const { init_date, end_date } = getOneDay5MonthsAgo();
    const init_date = payload.init_date;
    const end_date = payload.end_date;
    const machineName = payload.machineName;
    
    const average_cycle_time_payload = { "name": "average_cycle_time_avg", "machines": [machineName], "operations": ["working"], "time_aggregation": "mean", "start_date": init_date, "end_date": end_date, "step": 2 }
    const average_cycle_time = yield call(getDerivedKpiAPI, {...average_cycle_time_payload});
    const good_cycles_sum_payload = { "name": "good_cycles_sum", "machines": [machineName], "operations": ["working"], "time_aggregation": "sum", "start_date": init_date, "end_date": end_date, "step": 2 }
    const good_cycles_sum = yield call(getDerivedKpiAPI, {...good_cycles_sum_payload});
    const bad_cycles_sum_payload = { "name": "bad_cycles_sum", "machines": [machineName], "operations": ["working"], "time_aggregation": "sum", "start_date": init_date, "end_date": end_date, "step": 2 }
    const bad_cycles_sum = yield call(getDerivedKpiAPI, {...bad_cycles_sum_payload});
    const total_cycles_sum_payload = { "name": "cycles_sum", "machines": [machineName], "operations": ["working"], "time_aggregation": "sum", "start_date": init_date, "end_date": end_date, "step": 2 }
    const total_cycles_sum = yield call(getDerivedKpiAPI, {...total_cycles_sum_payload});
    const success_rate_payload = { "name": "success_rate", "machines": [machineName], "operations": ["working"], "time_aggregation": "sum", "start_date": init_date, "end_date": end_date, "step": 2 }
    const success_rate = yield call(getDerivedKpiAPI, {...success_rate_payload});
    const failure_rate_payload = { "name": "failure_rate", "machines": [machineName], "operations": ["working"], "time_aggregation": "sum", "start_date": init_date, "end_date": end_date, "step": 2 }
    const failure_rate = yield call(getDerivedKpiAPI, {...failure_rate_payload});
    // const efficiency_sum_payload = { "name": "overall_equipment_effectiveness", "machines": [machineName], "operations": ["working"], "time_aggregation": "sum", "start_date": init_date, "end_date": end_date, "step": 2 }
    // const efficiency_sum = yield call(getDerivedKpiAPI, {...efficiency_sum_payload});
    const machineObject = {
      ...payload,
      average_cycle_time: average_cycle_time.data.value,
      good_cycles: good_cycles_sum.data.value,
      bad_cycles: bad_cycles_sum.data.value,
      total_cycles: total_cycles_sum.data.value,
      success_rate: success_rate.data.value,
      failure_rate: failure_rate.data.value,
      // efficiency: efficiency_sum.data.value,
      efficiency: (success_rate.data.value / (success_rate.data.value + failure_rate.data.value)) * 100 || 0,
    }
    
    yield put(getProductionDetailSuccess(machineObject));
  } catch (error) {
    yield put(getProductionDetailError(error));
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
export function* watchGetProductionDashboard() {
  yield takeEvery(GET_PRODUCTION_DASHBOARD, getProductionDashboardSaga);
}
export function* watchGetProductionDetail() {
  yield takeEvery(GET_PRODUCTION_DETAIL, getProductionDetailSaga);
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
    fork(watchGetProductionDashboard),
    fork(watchGetProductionDetail),
  ]);
}
