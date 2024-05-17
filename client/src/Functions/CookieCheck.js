import Cookies from 'js-cookie';

export const CookieCheck = (name, value, options) => {
     // Ensure options are in the correct format for js-cookie
     const cookieOptions = {
        path: options.path || '/',
        secure: options.secure || false,
        sameSite: options.sameSite || 'Lax',
        expires: new Date(options.expirationTime),
        // If httpOnly is true, you can't set it via JavaScript, it's a server-side attribute.
    };

    Cookies.set(name, value, cookieOptions);
};