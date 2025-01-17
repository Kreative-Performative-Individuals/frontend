const baseUrl = "http://localhost:8000";
const kbUrl = "http://localhost:8001";
const dbUrl = "http://localhost:8002";
const dataProcessingUrl = "http://localhost:8003";
const ragUrl = "http://localhost:8005";
const kpiEngineUrl = "http://localhost:8008";
const kpiEngineWS = "ws://localhost:8008";

// Auth
export const LoginUserAPI = `${baseUrl}/users/authenticate`; // POST { email, password }
export const RegisterUserAPI = `${baseUrl}/users/new`; // POST { email, password }
export const ForgetPasswordAPI = `${baseUrl}/users/forgetPassword`; // POST { email }
export const ResetPasswordAPI = `${baseUrl}/users/resetPassword`; // POST { password, confirmPassword, token }
export const GetAllUserAPI = `${baseUrl}/users/registered`; // GET add /:userType

// Knowledge Base (Group 1)
export const GetClassInstance = `${kbUrl}/class-instances`; // GET add? owl_class_label & method=levenshtein

// Database (Group 2)
export const runQueryAPI = `${dbUrl}/query`; // GET add? statement
export const GetDashboardParamsAPI = `${dbUrl}/get_machines`; // GET add ?init_date=yy-mm-dd hh:mm:ss & end_date=yy-mm-dd hh:mm:ss
export const GetMachineListAPI = `${dbUrl}/machines`; // GET
export const GetMachineDetailAPI = `${dbUrl}/single_machine_detail`; // GET add? machine_id, init_date and end_date
export const GetProductionDashboardAPI = `${dbUrl}/production_dashboard`; // GET add? init_date and end_date

// dataProcessingUrl (Group 3)
export const ForecastAPI = `${dataProcessingUrl}/get_request`; // GET Add ? "machine_name", "asset_id", "kpi", "operation", "transformation", "forecasting", "timestamp_start", "timestamp_end"

// RAG (Group 5)
export const ChatRagAPI = `${ragUrl}/chat`; // GET Add ?message="" and previous_query (Optional)

// Checking Compose
export const CheckDbAPI = `${dbUrl}/openapi.json`; // GET
export const CheckKpiEngineAPI = `${kpiEngineUrl}`; // GET

// Get Derived KPI Data
export const GetDerivedKpiDataAPI = `${kpiEngineUrl}/kpi`; // POST { name, machines, operations, time_aggregation, start_date, end_date, step }
export const GetDerivedKpiChartAPI = `${kpiEngineUrl}/kpi/chart`; // POST { name, machines, operations, time_aggregation, start_date, end_date, step }

export { baseUrl, kpiEngineWS };