import React from 'react';

const CheckUser = (userLoggedIn) => {
    if(userLoggedIn)
    {
        const loggedUser = sessionStorage.getItem('catchingSoulsUsername');
        return loggedUser;
    }
    else {
        return null;
    }
}

export default CheckUser;
