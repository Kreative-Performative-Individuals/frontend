import axios from "axios";
import { GetDerivedKpiChartAPI, GetDerivedKpiDataAPI, runQueryAPI } from "./apiRoutes";
import { getLocal, setLocal } from "./localstorage";
import { v4 as uuidv4 } from 'uuid';

// Array containing column names for machine data
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

// Function to convert Machine list API response into a structured JSON object
function transformMachineList(apiResponse) {
  return apiResponse.map(machine => {
    const machineObject = {};
    machineColumnNames.forEach((column, index) => {
      machineObject[column] = machine[index]; // Map each field to the respective column
    });
    return machineObject;
  });
}

// Function to get the date range for the last 24 hours
function getLast24Hours() {
  const endDate = new Date();
  const startDate = new Date(endDate.getTime() - 24 * 60 * 60 * 1000); // Subtract 24 hours
  const initDate = formatDate(startDate);
  const formattedEndDate = formatDate(endDate);

  return { init_date: initDate, end_date: formattedEndDate };
}

// Function to get a date range for 1 day 5 months ago
function getOneDay5MonthsAgo() {
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - 5); // Go back 5 months

  const endDate = new Date(startDate.getTime() + 24 * 60 * 60 * 1000); // Add 1 day
  const initDate = formatDate(startDate);
  const formattedEndDate = formatDate(endDate);
  const oneWeekBeforeEndData = formatDate(endDate.setDate(endDate.getDate() - 7)); // Get a date 1 week before the end

  return { init_date: initDate, end_date: formattedEndDate, oneWeekBeforeEndData };
}

// Function to capitalize the first letter of a string
function capitalizeFirstLetter(string) {
  if (!string) return "";
  return string.charAt(0).toUpperCase() + string.slice(1);
}

// Function to truncate a number to 5 decimal places
function truncateToFiveDecimals(number) {
  if (typeof number !== "number") return null;
  return Math.floor(number * 100000) / 100000;
}

// Function to truncate a number to 3 decimal places
function truncateToThreeDecimals(number) {
  if (typeof number !== "number") return null;
  return Math.floor(number * 1000) / 1000;
}

// Function to get a random energy contribution (for simulation purposes)
function getRandomEnergyContribution() {
  return Math.floor(Math.random() * 5) + 1; // Random value between 1 and 5
}

// Function to format a Date object into a specific string format "yyyy-mm-dd hh:mm:ss"
function formatDate(date) {
  const d = new Date(date);
  const yy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  const hh = String(d.getHours()).padStart(2, '0');
  const mi = String(d.getMinutes()).padStart(2, '0');
  const ss = String(d.getSeconds()).padStart(2, '0');

  return `${yy}-${mm}-${dd} ${hh}:${mi}:${ss}`;
}

// Function to get the last day of the month for a given date string
function getLastDayOfMonth(dateString) {
  const date = new Date(dateString);
  const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0); // Get last day of the month
  const yy = lastDay.getFullYear();
  const mm = String(lastDay.getMonth() + 1).padStart(2, '0');
  const dd = String(lastDay.getDate()).padStart(2, '0');
  const hh = String(lastDay.getHours()).padStart(2, '0');
  const mi = String(lastDay.getMinutes()).padStart(2, '0');
  const ss = String(lastDay.getSeconds()).padStart(2, '0');

  return `${yy}-${mm}-${dd} ${hh}:${mi}:${ss}`;
}

// Function to add one day to a given date string
function addOneDay(dateString) {
  const date = new Date(dateString);
  date.setDate(date.getDate() + 1); // Add 1 day (24 hours)

  const yy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  const hh = String(date.getHours()).padStart(2, '0');
  const mi = String(date.getMinutes()).padStart(2, '0');
  const ss = String(date.getSeconds()).padStart(2, '0');

  return `${yy}-${mm}-${dd} ${hh}:${mi}:${ss}`;
}

// Function to show only the date in "yyyy-mm-dd" format
function showDateOnly(dateString) {
  const date = new Date(dateString);
  const yy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');

  return `${yy}-${mm}-${dd}`;
}

// Function to run a database query and return the result
async function runDBQuery(query) {
  const data = await axios.get(`${runQueryAPI}?statement=${encodeURIComponent(query)}`);
  return data; // Return the result of the query
}
async function callKpiEngine(data) {
  return await axios.post(`${GetDerivedKpiDataAPI}`, data);
}
async function callKpiEngineChart(data) {
  return await axios.post(`${GetDerivedKpiChartAPI}`, data);
}

// Function to format machine usage time from an array to an object
function formatMachineUsageTime(inputArray) {
  const result = {};
  inputArray?.forEach(item => {
    const key = item[0];
    const value = item[1];
    result[key] = value; // Map each key-value pair
  });
  return result;
}

// Function to convert seconds to HH:MM:SS format
function secondsToHHMMSS(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;
  const paddedHours = String(hours).padStart(2, '0');
  const paddedMinutes = String(minutes).padStart(2, '0');
  const paddedSeconds = String(remainingSeconds).padStart(2, '0');

  return `${paddedHours}:${paddedMinutes}:${paddedSeconds}`;
}

// Function to convert seconds to a readable format (e.g., 1 Hour 2 Minutes 3 Seconds)
function secondsToReadableFormat(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;
  return `${hours} Hours ${minutes} Minutes ${remainingSeconds} Seconds`;
}

// Function to convert hours to a readable format (e.g., 2 Hours 30 Minutes)
const hoursToReadableFormat = (hours) => {
  const totalSeconds = Math.round(hours * 3600); // Convert hours to seconds
  const hrs = Math.floor(totalSeconds / 3600).toString().padStart(2, '0');
  const mins = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0');
  return `${hrs} Hours ${mins} Minutes`;
};

// Function to update the recently viewed items in local storage
const updateRecentlyViewed = (category, item) => {
  let recentlyViewed = JSON.parse(getLocal("recents")) || {};

  if (!recentlyViewed[category]) {
    recentlyViewed[category] = []; // Initialize the category if it doesn't exist
  }

  const categoryArray = recentlyViewed[category];

  if (Array.isArray(categoryArray)) {
    const index = categoryArray.findIndex(i => i.asset_id === item.asset_id); // Find existing item
    if (index !== -1) {
      categoryArray.splice(index, 1); // Remove the existing item
    }
    categoryArray.unshift(item); // Add the new item to the top
    recentlyViewed[category] = categoryArray.slice(0, 3); // Limit to 3 most recent items
  } else {
    console.error(`Invalid category: ${category}`);
  }

  // Save the updated object back to local storage
  setLocal("recents", JSON.stringify(recentlyViewed));
};

const saveToMostlyViewed = (newObject) => {
  // Get the existing `mostlyViewed` array from localStorage
  const mostlyViewed = JSON.parse(getLocal('mostlyViewed')) || [];

  // Check if the object already exists in the array
  const existingIndex = mostlyViewed.findIndex(item =>
      JSON.stringify(item.data) === JSON.stringify(newObject)
  );

  if (existingIndex !== -1) {
      // If the object exists, increase its viewCount
      mostlyViewed[existingIndex].viewCount += 1;
  } else {
      // If the object does not exist, add it with a viewCount of 1
      mostlyViewed.push({ data: newObject, viewCount: 1, id: uuidv4() });
  }

  // Save the updated array back to localStorage
  setLocal('mostlyViewed', JSON.stringify(mostlyViewed));
};


function getAllDatesBetween(startDate, endDate) {
  const dates = [];
  let currentDate = new Date(startDate); // Start from the given startDate
  const lastDate = new Date(endDate); // Define the endDate
  currentDate.setDate(currentDate.getDate() + 1);
  lastDate.setDate(lastDate.getDate() + 1);
  
  while (currentDate <= lastDate) {
    // Push the date in 'YYYY-MM-DD' format
    dates.push(new Date(currentDate).toISOString().split('T')[0]);

    // Increment the date by 1 day
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
}

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
  updateRecentlyViewed,
  callKpiEngine,
  callKpiEngineChart,
  getAllDatesBetween,
  saveToMostlyViewed
};
