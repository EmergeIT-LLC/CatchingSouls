import React from 'react';

const GetAdminRole = () => {
    const isAdmin = sessionStorage.getItem('catchingSoulsAdmin');

    if (isAdmin == "true") {
        return isAdmin;
    }
    else {
        return false;
    }
}

export default GetAdminRole;