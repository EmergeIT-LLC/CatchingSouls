import React, { useState, useEffect } from 'react';

const CheckLogin = () => {
    const userLoggedIn = sessionStorage.getItem('catchingSoulsLoggedin');
    
    if (userLoggedIn) {
        return userLoggedIn;
    }
    else {
        return false;
    }
}

export default CheckLogin;