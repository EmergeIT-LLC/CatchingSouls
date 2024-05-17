import Cookies from 'js-cookie';
import {CheckUser} from '../Functions/VerificationCheck';

export const CookieCheck = (name, value, options) => {
    const cookieOptions = {
        path: options.path || '/',
        secure: options.secure || false,
        sameSite: options.sameSite || 'Lax',
        expires: new Date(options.expirationTime)
    };

    Cookies.set(name, value, cookieOptions);
};

// Function to check if a cookie exists and is not expired
export const isCookieValid = () => {
    let cookieName = 'csAuthServices-' + CheckUser();
    const cookieValue = Cookies.get(cookieName);
    if (cookieValue) {
        // Cookie exists, now check if it's expired
        const expirationDate = getCookieExpiration(cookieName);
        if (expirationDate) {
            const currentTime = new Date();
            return currentTime < expirationDate; // True if current time is before expiration
        }
    }
    return false; // Cookie doesn't exist or is expired
};

// Function to get the expiration date of a cookie
const getCookieExpiration = (cookieName) => {
    const expirationDateString = Cookies.get(cookieName);
    if (expirationDateString) {
        return new Date(expirationDateString);
    }
    return null; // Expiration date not found
};