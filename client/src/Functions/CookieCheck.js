import Cookies from 'js-cookie';

export const CookieCheck = (name, value, options) => {
    const cookieOptions = {
        path: options.path || '/',
        secure: options.secure || false,
        sameSite: options.sameSite || 'Lax',
        expires: new Date(options.expirationTime)
    };

    Cookies.set(name, value, cookieOptions);
};