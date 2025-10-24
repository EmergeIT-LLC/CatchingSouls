import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { API } from "../config/constants";

function toBool(value) {
  if (value === undefined || value === null) return false;
  if (typeof value === "boolean") return value;
  // Stored booleans in AsyncStorage are strings: "true"/"false"
  return String(value).toLowerCase() === "true";
}

export const CheckUserLogin = async () => {
  try {
    return toBool(await AsyncStorage.getItem("catchingSoulsLoggedin"));
  } catch {
    return false;
  }
};

export const CheckGuestLogin = async () => {
  try {
    return toBool(await AsyncStorage.getItem("catchingSoulsGuestLoggedin"));
  } catch {
    return false;
  }
};

export const CheckUser = async () => {
  try {
    if (await CheckUserLogin()) {
      return await AsyncStorage.getItem("catchingSoulsUsername");
    }
    return null;
  } catch {
    return null;
  }
};

export const GetAdminRole = async () => {
  try {
    return toBool(await AsyncStorage.getItem("catchingSoulsAdmin"));
  } catch {
    return false;
  }
};

export const GetUserProps = async () => {
  try {
    if (await CheckUserLogin()) {
      const username = await CheckUser();
      if (!username) return null;
      const url = `${API.BASE_URL}/user/accountDetail_retrieval`;
      const response = await axios.post(url, { username });
      return response; // caller can access response.data
    }
    return null;
  } catch (error) {
    console.error("Error fetching user props:", error);
    return null;
  }
};

export const GetLoggedInUser = async () => {
  try {
    return await AsyncStorage.getItem("catchingSoulsUsername");
  } catch {
    return null;
  }
};

export const GetLogoutStatus = async (urlAccountUsername) => {
  try {
    const isLoggedIn = await CheckUserLogin();
    const username = await AsyncStorage.getItem("catchingSoulsUsername");
    return isLoggedIn && username === urlAccountUsername;
  } catch {
    return false;
  }
};

export default {
  CheckGuestLogin,
  CheckUserLogin,
  CheckUser,
  GetLoggedInUser,
  GetAdminRole,
  GetLogoutStatus,
  GetUserProps
};