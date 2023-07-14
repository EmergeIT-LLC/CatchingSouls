import React from 'react';

const CheckUsername = (e) => {
    var regex = /^[a-zA-Z0-9_.-]*$/;
    return regex.test(e);
}

export default CheckUsername;