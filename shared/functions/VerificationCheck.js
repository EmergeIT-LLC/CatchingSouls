import Axios from 'axios';
import { CookieCheck } from '../Functions/CookieCheck';

export const CheckUserLogin = () => {
    const userLoggedIn = localStorage.getItem('catchingSoulsUserLoggedin');

    if (userLoggedIn) {
        return true;
    }
    return false;
}

export const CheckGuestLogin = () => {
    const guestLoggedIn = sessionStorage.getItem('catchingSoulsGuestLoggedin');

    if (guestLoggedIn) {
        return true;
    }
    return false;
}

export const CheckUser = () => {
    if(CheckUserLogin())
    {
        const loggedUser = localStorage.getItem('catchingSoulsUsername');
        return loggedUser;
    }
    else {
        return null;
    }
}

export const GetAdminRole = () => {
    const isAdmin = localStorage.getItem('catchingSoulsAdmin');;

    if (isAdmin === "true") {
        return true;
    }
    else {
        return false;
    }
}

export const GetUserProps = async () => {
    try {
        if (CheckUserLogin()) {
            const url = process.env.REACT_APP_Backend_URL + '/user/accountDetail_retrieval';
            const response = await Axios.post(url, { username: CheckUser() });

            if (response.data.cookieSetting) {
                CookieCheck(response.data.cookieSetting.name, response.data.cookieSetting.value, response.data.cookieSetting.options);
            }

            return response; // Assuming your response contains the data you're interested in
        }
    } catch (error) {
        console.error('Error fetching user props:', error);
        throw error; // Rethrow the error for the calling code to handle if necessary
    }
};

export const GetLogoutStatus = (urlAccountUsername) => {
    if (CheckUserLogin()) {
        if (urlAccountUsername === CheckUser()) {
            return false;
        }
        return true;
    }
    else {
        return true;
    }
}

export const GetUserVerificationProps = async (AccountUsername) => {
    try {
        const url = process.env.REACT_APP_Backend_URL + '/user/accountDetail_retrieval';
        const response = await Axios.post(url, { username: AccountUsername });

        if (response.data.cookieSetting) {
            CookieCheck(response.data.cookieSetting.name, response.data.cookieSetting.value, response.data.cookieSetting.options);
        }

        return response; // Assuming your response contains the data you're interested in
    } catch (error) {
        console.error('Error fetching user props:', error);
        throw error; // Rethrow the error for the calling code to handle if necessary
    }
}