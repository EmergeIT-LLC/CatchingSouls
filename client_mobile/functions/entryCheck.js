import React from 'react';

const CheckEmail = (e) => {
    const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regex.test(e);
}

const CheckPassword = (e) => {
    const regex = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    return regex.test(e);
}

const CheckUsername = (e) => {
    var regex = /^[a-zA-Z0-9_.-]*$/;
    return regex.test(e);
}

export default {CheckEmail, CheckPassword, CheckUsername};