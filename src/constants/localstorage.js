import axios from "axios";

// Function to store a key-value pair in localStorage
export const setLocal = (key, value) => {
  localStorage.setItem(key, value);  // Set the item in localStorage with the given key and value
};

// Function to retrieve the value for a given key from localStorage
export const getLocal = key => localStorage.getItem(key);  // Retrieve the value from localStorage for the given key

// Function to remove the "authUser" item from localStorage
export const clearLocal = () => {
  localStorage.removeItem("authUser");  // Removes the "authUser" key from localStorage
};

// Function to set the authorization token in the axios default headers
const setDefaultToken = (key, token) => {
  if (token) {
    // If a token is provided, set it in the axios headers for all future requests
    axios.defaults.headers.common[key] = `Bearer ${token}`;
  } else {
    // If no token is provided, remove the token from the axios headers
    delete axios.defaults.headers.common[key];
  }
};

export default setDefaultToken;  // Exporting the function as default for external use
