const prodStatus = process.env.IN_PROD;
const clientOrigin = process.env.ClientHost;
const amplifyOrigin = process.env.AmplifyHost;

// Set a cookie with advanced options
const setCookie = (name, value, options = {}) => {
    // Default options
    const defaultOptions = {
        daysToExpire: 1 / 3, // Default expiration time: 8 hours
        path: '/',
        domain: prodStatus === "true" ? [clientOrigin, amplifyOrigin] : clientOrigin,
        secure: prodStatus === "true",
        sameSite: 'Lax'
    };

    // Merge default options with provided options
    const mergedOptions = { ...defaultOptions, ...options };

    const { daysToExpire, path, domain, secure, httpOnly, sameSite } = mergedOptions;

    const expirationDate = new Date();
    expirationDate.setTime(expirationDate.getTime() + daysToExpire * 24 * 60 * 60 * 1000);

    domain.forEach(domain => {
        let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;
        cookieString += `;expires=${expirationDate.toUTCString()}`;
        cookieString += `;path=${path}`;
        cookieString += `;domain=${domain}`;
        if (secure) cookieString += `;secure`;
        if (sameSite) cookieString += `;SameSite=${sameSite}`;
        cookieString += `;HttpOnly`; // Set the cookie as HTTP-only
        
        document.cookie = cookieString;
    });
};

// Get a cookie value by name
const getCookie = (name) => {
    const cookies = document.cookie.split(';').map(cookie => cookie.trim());
    for (const cookie of cookies) {
        const [cookieName, cookieValue] = cookie.split('=');
        if (decodeURIComponent(cookieName) === name) {
            return decodeURIComponent(cookieValue);
        }
    }
    return null;
};

// Function to update the expiration time of an existing cookie
const updateCookieExpiration = (name) => {
    const daysToExpire = 1 / 3; // Default expiration time: 8 hours
    const cookieValue = getCookie(name);
    if (cookieValue !== null) {
        setCookie(name, cookieValue, { daysToExpire });
    }
};

// Delete a cookie by name
const deleteCookie = (name, path = '/') => {
    document.cookie = `${encodeURIComponent(name)}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=${path}`;
};