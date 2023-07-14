import React from 'react';

const CheckPassword = (e) => {
    const regex = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    return regex.test(e);
}

export default CheckPassword;