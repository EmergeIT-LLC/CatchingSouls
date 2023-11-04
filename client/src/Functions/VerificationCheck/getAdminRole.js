import React from 'react';

function checkCookie(cookieName) {
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
        const [name, value] = cookie.trim().split('=');
        if (name === cookieName) {
        return value;
        }
    }
    return null; // Cookie not found
}

const GetAdminRole = () => {
    const isAdmin = checkCookie('isAdmin');

    if (isAdmin === "true") {
        return true;
    }
    else {
        return false;
    }
}

export default GetAdminRole;