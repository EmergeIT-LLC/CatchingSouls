const prodStatus = process.env.IN_PROD;
const clientOrigin = process.env.ClientHost;
const amplifyOrigin = process.env.AmplifyHost;

// Set a cookie with advanced options
// Set a cookie with advanced options
const setCookie = (name, value, options = {}) => {
    // Default options
    const defaultOptions = {
        daysToExpire: 1 / 3, // Default expiration time: 8 hours
        path: '/',
        domain: prodStatus === "true" ? [clientOrigin, amplifyOrigin] : [clientOrigin],
        secure: prodStatus === "true",
        sameSite: 'Lax',
        httpOnly: true // Set the cookie as HTTP-only by default
    };

    // Merge default options with provided options
    const mergedOptions = { ...defaultOptions, ...options };

    const { daysToExpire, path, domain, secure, httpOnly, sameSite } = mergedOptions;

    const expirationDate = new Date();
    expirationDate.setTime(expirationDate.getTime() + daysToExpire * 24 * 60 * 60 * 1000);

    // Loop through each domain in the array
    domain.forEach(domainItem => {
        let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;
        cookieString += `;expires=${expirationDate.toUTCString()}`;
        cookieString += `;path=${path}`;
        cookieString += `;domain=${domainItem}`;
        if (secure) cookieString += `;secure`;
        if (sameSite) cookieString += `;SameSite=${sameSite}`;
        if (httpOnly) cookieString += `;HttpOnly`; // Only add HttpOnly if it's explicitly set to true
        
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
        return setCookie(name, cookieValue, { daysToExpire });
    }
};

// Delete a cookie by name
const deleteCookie = (name, path = '/') => {
    let cookieString = `${encodeURIComponent(name)}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=${path}`;
    document.cookie = cookieString;
    return cookieString;
};