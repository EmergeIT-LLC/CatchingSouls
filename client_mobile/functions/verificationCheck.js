import AsyncStorage from "@react-native-async-storage/async-storage";

const toBool = (v) => v === true || v === "true";

export const CheckLogin = async () => {
  try {
    const v = await AsyncStorage.getItem("catchingSoulsLoggedin");
    return toBool(v);
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
    const v = await AsyncStorage.getItem("catchingSoulsAdmin");
    return toBool(v);
  } catch {
    return false;
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

export const GetUserProps = async () => {
  try {
    if (await CheckLogin()) {
      const raw = await AsyncStorage.getItem("catchingSoulsUserProps");
      return raw ? JSON.parse(raw) : null;
    }
    return null;
  } catch {
    return null;
  }
};

export default {
  CheckLogin,
  CheckUser,
  GetAdminRole,
  GetLogoutStatus,
  GetUserProps
};