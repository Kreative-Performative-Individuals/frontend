import axios from "axios";
import { runQueryAPI } from "./apiRoutes";

// Function to convert Machine list API response into JSON
const machineColumnNames = [
  "asset_id",
  "name",
  "type",
  "capacity",
  "installation_date",
  "location",
  "status",
  "description"
];

function transformMachineList(apiResponse) {
  // Map each machine's data to the respective column names
  return apiResponse.map(machine => {
    const machineObject = {};
    machineColumnNames.forEach((column, index) => {
      machineObject[column] = machine[index];
    });
    return machineObject;
  });
}

function getLast24Hours() {
  const endDate = new Date();
  const startDate = new Date(endDate.getTime() - 24 * 60 * 60 * 1000);
  const formatDate = date => {
    const yy = date.getFullYear().toString();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    const hh = String(date.getHours()).padStart(2, "0");
    const mi = String(date.getMinutes()).padStart(2, "0");
    const ss = String(date.getSeconds()).padStart(2, "0");
    return `${yy}-${mm}-${dd} ${hh}:${mi}:${ss}`;
  };
  const initDate = formatDate(startDate);
  const formattedEndDate = formatDate(endDate);

  return { init_date: initDate, end_date: formattedEndDate };
}

function getOneDay5MonthsAgo() {
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - 5);

  const endDate = new Date(startDate.getTime() + 24 * 60 * 60 * 1000); // Add 1 day

  const formatDate = date => {
    const yy = date.getFullYear().toString();
    const mm = String(date.getMonth() + 1).padStart(2, "0"); // Month is 0-based
    const dd = String(date.getDate()).padStart(2, "0");
    const hh = String(date.getHours()).padStart(2, "0");
    const mi = String(date.getMinutes()).padStart(2, "0");
    const ss = String(date.getSeconds()).padStart(2, "0");
    return `${yy}-${mm}-${dd} ${hh}:${mi}:${ss}`;
  };

  const initDate = formatDate(startDate);
  const formattedEndDate = formatDate(endDate);

  return { init_date: initDate, end_date: formattedEndDate };
}

function capitalizeFirstLetter(string) {
  if (!string) return "";
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function truncateToFiveDecimals(number) {
  if (typeof number !== "number") return null;
  return Math.floor(number * 100000) / 100000;
}

function getRandomEnergyContribution() {
  return Math.floor(Math.random() * 5) + 1;
}

function formatDate(date) {
  const yy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0'); // Month is 0-based
  const dd = String(date.getDate()).padStart(2, '0');
  const hh = String(date.getHours()).padStart(2, '0');
  const mi = String(date.getMinutes()).padStart(2, '0');
  const ss = String(date.getSeconds()).padStart(2, '0');

  return `${yy}-${mm}-${dd} ${hh}:${mi}:${ss}`;
}

function getLastDayOfMonth(dateString) {
  const date = new Date(dateString);
  const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  const yy = lastDay.getFullYear();
  const mm = String(lastDay.getMonth() + 1).padStart(2, '0');
  const dd = String(lastDay.getDate()).padStart(2, '0');
  const hh = String(lastDay.getHours()).padStart(2, '0');
  const mi = String(lastDay.getMinutes()).padStart(2, '0');
  const ss = String(lastDay.getSeconds()).padStart(2, '0');

  return `${yy}-${mm}-${dd} ${hh}:${mi}:${ss}`;
}

function addOneDay(dateString) {
  const date = new Date(dateString);

  // Add 1 day (24 hours) in milliseconds
  date.setDate(date.getDate() + 1);

  // Format the result as "yyyy-mm-dd hh:mm:ss"
  const yy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  const hh = String(date.getHours()).padStart(2, '0');
  const mi = String(date.getMinutes()).padStart(2, '0');
  const ss = String(date.getSeconds()).padStart(2, '0');

  return `${yy}-${mm}-${dd} ${hh}:${mi}:${ss}`;
}

function showDateOnly(dateString) {
  const date = new Date(dateString);
  
  // Extract the date in the format 'yyyy-mm-dd'
  const yy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
  const dd = String(date.getDate()).padStart(2, '0');
  
  return `${yy}-${mm}-${dd}`;
}

async function runDBQuery(query) {
  const data = await axios.get(`${runQueryAPI}?statement=${encodeURIComponent(query)}`)
  return data
}

function formatMachineUsageTime(inputArray) {
  const result = {};
  inputArray.forEach(item => {
      const key = item[0];
      const value = item[1];
      result[key] = value;
  });
  return result;
}

function secondsToHHMMSS(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;
  const paddedHours = String(hours).padStart(2, '0');
  const paddedMinutes = String(minutes).padStart(2, '0');
  const paddedSeconds = String(remainingSeconds).padStart(2, '0');

  return `${paddedHours}:${paddedMinutes}:${paddedSeconds}`;
}

function secondsToReadableFormat(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;
  return `${hours} Hours ${minutes} Minutes ${remainingSeconds} Seconds`;
}


export {
  transformMachineList,
  getLast24Hours,
  getOneDay5MonthsAgo,
  capitalizeFirstLetter,
  truncateToFiveDecimals,
  getRandomEnergyContribution,
  formatDate,
  getLastDayOfMonth,
  addOneDay,
  showDateOnly,
  runDBQuery,
  formatMachineUsageTime,
  secondsToHHMMSS,
  secondsToReadableFormat
};
