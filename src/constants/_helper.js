import axios from "axios";
import { runQueryAPI } from "./apiRoutes";
import { getLocal, setLocal } from "./localstorage";

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
  const initDate = formatDate(startDate);
  const formattedEndDate = formatDate(endDate);

  return { init_date: initDate, end_date: formattedEndDate };
}

function getOneDay5MonthsAgo() {
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - 5);

  const endDate = new Date(startDate.getTime() + 24 * 60 * 60 * 1000); // Add 1 day
  const initDate = formatDate(startDate);
  const formattedEndDate = formatDate(endDate);
  const oneWeekBeforeEndData = formatDate(endDate.setDate(endDate.getDate() - 7))

  return { init_date: initDate, end_date: formattedEndDate, oneWeekBeforeEndData };
}

function capitalizeFirstLetter(string) {
  if (!string) return "";
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function truncateToFiveDecimals(number) {
  if (typeof number !== "number") return null;
  return Math.floor(number * 100000) / 100000;
}
function truncateToThreeDecimals(number) {
  if (typeof number !== "number") return null;
  return Math.floor(number * 1000) / 1000;
}

function getRandomEnergyContribution() {
  return Math.floor(Math.random() * 5) + 1;
}

function formatDate(date) {
  const d = new Date(date);
  const yy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0'); // Month is 0-based
  const dd = String(d.getDate()).padStart(2, '0');
  const hh = String(d.getHours()).padStart(2, '0');
  const mi = String(d.getMinutes()).padStart(2, '0');
  const ss = String(d.getSeconds()).padStart(2, '0');

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

const hoursToReadableFormat = (hours) => {
  const totalSeconds = Math.round(hours * 3600);
  const hrs = Math.floor(totalSeconds / 3600).toString().padStart(2, '0');
  const mins = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0');
  return `${hrs} Hours ${mins} Minutes`;
};

const updateRecentlyViewed = (category, item) => {
  let recentlyViewed = JSON.parse(getLocal("recents")) || {};

  if (!recentlyViewed[category]) {
      recentlyViewed[category] = [];
  }

  const categoryArray = recentlyViewed[category];

  if (Array.isArray(categoryArray)) {
      const index = categoryArray.findIndex(i => i.asset_id === item.asset_id);
      if (index !== -1) {
          categoryArray.splice(index, 1);
      }
      categoryArray.unshift(item);
      recentlyViewed[category] = categoryArray.slice(0, 3);
  } else {
      console.error(`Invalid category: ${category}`);
  }

  // Save the updated object back to local storage
  setLocal("recents", JSON.stringify(recentlyViewed));
};




export {
  transformMachineList,
  getLast24Hours,
  getOneDay5MonthsAgo,
  capitalizeFirstLetter,
  truncateToFiveDecimals,
  truncateToThreeDecimals,
  getRandomEnergyContribution,
  formatDate,
  getLastDayOfMonth,
  addOneDay,
  showDateOnly,
  runDBQuery,
  formatMachineUsageTime,
  secondsToHHMMSS,
  secondsToReadableFormat,
  hoursToReadableFormat,
  updateRecentlyViewed
};
