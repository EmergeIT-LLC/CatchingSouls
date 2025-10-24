import AsyncStorage from "@react-native-async-storage/async-storage";
import { API } from "../config/constants";

export const CheckUserLogin = async () => {
  try {
    return toBool(await AsyncStorage.getItem("catchingSoulsUserLoggedin"));
  } catch {
    return false;
  }
};

export const CheckGuestLogin = async () => {
  try {
    return await toBool(AsyncStorage.getItem("catchingSoulsGuestLoggedin"));
  } catch {
    return false;
  }
};

export const CheckUser = async () => {
  try {
    if (await CheckLogin()) {
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
      const url = API.BASE_URL + '/user/accountDetail_retrieval';
      const response = await Axios.post(url, { username: CheckUser() });

        return response;
    }
    return null;
  } catch (error) {
    console.error("Error fetching user props:", error);
    return null;
 }
};

export const GetLoggedInUser = async () => {
  try {
    if (await CheckLogin()) {
      return await AsyncStorage.getItem("catchingSoulsUsername");
    }
    return null;
  } catch {
    return null;
  }
};

// Optional: return whether logout should be shown for a given username
export const GetLogoutStatus = async (urlAccountUsername) => {
  try {
    const isLoggedIn = await CheckLogin();
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