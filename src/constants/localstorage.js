import axios from "axios";

export const setLocal = (key, value) => {
  localStorage.setItem(key, value);
};

export const getLocal = key => localStorage.getItem(key);

export const clearLocal = () => {
  localStorage.clear();
};

const setDefaultToken = (key, token) => {
  if (token) {
    axios.defaults.headers.common[key] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common[key];
  }
};

export default setDefaultToken;
