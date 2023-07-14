import React from 'react';
import CheckLogin from '../../Functions/VerificationCheck/checkLogin';
import CheckUser from '../../Functions/VerificationCheck/checkUser';

const GetLogoutStatus = (urlAccountUsername) => {
    const userLoggedIn = CheckLogin();
    const loggedInUser = CheckUser(userLoggedIn);

    if (userLoggedIn) {
        if (urlAccountUsername === loggedInUser) {
            return false;
        }
        else {
            return true; 
        }
    }
    else {
        return true;
    }
}

export default GetLogoutStatus;
