import Cookies from 'js-cookie';
import { CheckUser } from '../Functions/VerificationCheck';

// Function to set a cookie
export const CookieCheck = (name, value, options) => {
    const expirationDate = new Date(options.expirationTime);
    const cookieData = {
        value,
        expirationDate: expirationDate.toISOString()
    };
    const cookieOptions = {
        path: options.path || '/',
        secure: options.secure || false,
        sameSite: options.sameSite || 'Lax',
        expires: expirationDate
    };

    Cookies.set(name, JSON.stringify(cookieData), cookieOptions);
};

// Function to check if a cookie exists and is not expired
export const isCookieValid = () => {
    const cookieName = 'csAuthServices-' + CheckUser();
    const cookieValue = Cookies.get(cookieName);

    if (cookieValue) {
        // Cookie exists, parse its content
        try {
            const parsedValue = JSON.parse(cookieValue);

            // Check if the expiration date is valid
            const expirationDate = new Date(parsedValue.expirationDate);
            const currentTime = new Date();

            return currentTime < expirationDate; // True if current time is before expiration
        } catch (error) {
            console.error('Failed to parse cookie value:', error);
            return false;
        }
    }
    return false; // Cookie doesn't exist or is expired
};