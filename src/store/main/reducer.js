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
  DELETE_REPORT,
  FILTER_MACHINE_LIST
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
  dashboardParams: {},
  singleMachineDetail: {},
  productionDashboard: {},
  productionDetail: {},
  energyDashboard: {},
  kpiClassInstane: {},
  forecast: [],
  reports: [],
  singleReport: {},
  filteredMachineList: [],
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
                ragResponse: `Error. Please try again later. *** ERROR`
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
        
        case GET_MACHINE_DETAIL:
            return {
                ...state,
                error: false,
                loading: true,
                errMsg: "",
                singleMachineDetail: []
            };

        case GET_MACHINE_DETAIL_SUCCESS:
            return {
                ...state,
                error: false,
                loading: false,
                errMsg: "",
                singleMachineDetail: action.payload
            };
        case GET_MACHINE_DETAIL_ERROR:
            return {
                ...state,
                error: true,
                loading: false,
                errMsg: action.payload,
                singleMachineDetail: []
            };
        
        case GET_PRODUCTION_DASHBOARD:
            return {
                ...state,
                error: false,
                loading: true,
                errMsg: "",
                productionDashboard: {}
            };

        case GET_PRODUCTION_DASHBOARD_SUCCESS:
            return {
                ...state,
                error: false,
                loading: false,
                errMsg: "",
                productionDashboard: action.payload
            };
        case GET_PRODUCTION_DASHBOARD_ERROR:
            return {
                ...state,
                error: true,
                loading: false,
                errMsg: action.payload,
                productionDashboard: {}
            };
        
        case GET_PRODUCTION_DETAIL:
            return {
                ...state,
                error: false,
                loading: true,
                errMsg: "",
                productionDetail: {}
            };

        case GET_PRODUCTION_DETAIL_SUCCESS:
            return {
                ...state,
                error: false,
                loading: false,
                errMsg: "",
                productionDetail: action.payload
            };
        case GET_PRODUCTION_DETAIL_ERROR:
            return {
                ...state,
                error: true,
                loading: false,
                errMsg: action.payload,
                productionDetail: {}
            };

        case GET_ENERGY_DASHBOARD:
            return {
                ...state,
                error: false,
                loading: true,
                errMsg: "",
                energyDashboard: {}
            };
    
        case GET_ENERGY_DASHBOARD_SUCCESS:
            return {
                ...state,
                error: false,
                loading: false,
                errMsg: "",
                energyDashboard: action.payload
            };
        case GET_ENERGY_DASHBOARD_ERROR:
            return {
                ...state,
                error: true,
                loading: false,
                errMsg: action.payload,
                energyDashboard: {}
            };
        
        case GET_KPI_CLASS_INSTANCE:
            return {
                ...state,
                error: false,
                loading: true,
                errMsg: "",
                kpiClassInstane: {}
            };
    
        case GET_KPI_CLASS_INSTANCE_SUCCESS:
            return {
                ...state,
                error: false,
                loading: false,
                errMsg: "",
                kpiClassInstane: action.payload
            };
        case GET_KPI_CLASS_INSTANCE_ERROR:
            return {
                ...state,
                error: true,
                loading: false,
                errMsg: action.payload,
                kpiClassInstane: {}
            };
        
        case GET_FORECAST:
            return {
                ...state,
                error: false,
                loading: true,
                errMsg: "",
                forecast: []
            };
    
        case GET_FORECAST_SUCCESS:
            return {
                ...state,
                error: false,
                loading: false,
                errMsg: "",
                forecast: action.payload
            };
        case GET_FORECAST_ERROR:
            return {
                ...state,
                error: true,
                loading: false,
                errMsg: action.payload,
                forecast: []
            };
        
        case REPORT_LIST:
            return {
                ...state,
                error: false,
                reports: JSON.parse(getLocal("reports")) || []
            };

        case GET_SINGLE_REPORT:
            const reportList = JSON.parse(getLocal("reports")) || [];
            const filteredList = reportList.find(report => report.reportId === action.payload);
            return {
                ...state,
                error: false,
                singleReport: filteredList
            };
        case ADD_REPORT_TO_LIST:
            const existingList = JSON.parse(getLocal("reports")) || [];
            const existingIndex = existingList.findIndex(report => report.reportId === action.payload.reportId);
            if (existingIndex !== -1) {
                // If reportId exists, update the existing report
                existingList[existingIndex] = action.payload;
            } else {
                // If reportId does not exist, add a new report
                existingList.push(action.payload);
            }
            // existingList.push(action.payload);
            setLocal("reports", JSON.stringify(existingList))
            return {
                ...state,
                error: false,
                reports: existingList
            };

        case DELETE_REPORT:
            const existing = JSON.parse(getLocal("reports")) || [];
            const updatedList = existing.filter(report => report.reportId !== action.payload);
            setLocal("reports", JSON.stringify(updatedList))
            return {
                ...state,
                error: false,
                reports: updatedList
            };
        
        case FILTER_MACHINE_LIST:
            return {
                ...state,
                filteredMachineList: action.payload
            };
      default:
          return { ...state };
  }
}

export default MyReducer;