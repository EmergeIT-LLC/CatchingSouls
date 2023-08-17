import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { AsyncStorage } from '@react-native-async-storage/async-storage';

const CheckLogin = () => {
    const userLoggedIn = AsyncStorage.getItem('catchingSoulsLoggedin');
    
    if (userLoggedIn) {
        return userLoggedIn;
    }
    else {
        return false;
    }
}

const CheckUser = () => {
    if(CheckLogin)
    {
        const loggedUser = AsyncStorage.getItem('catchingSoulsUsername');
        return loggedUser;
    }
    else {
        return null;
    }
}

const GetAdminRole = () => {
    const isAdmin = AsyncStorage.getItem('catchingSoulsAdmin');

    if (isAdmin == "true") {
        return isAdmin;
    }
    else {
        return false;
    }
}

const GetLogoutStatus = (urlAccountUsername) => {
    if (CheckLogin()) {
        if (urlAccountUsername === CheckUser()) {
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

const GetUserProps = async () => {
    if (CheckLogin()){
        const url = process.env.REACT_APP_Backend_URL + '/user/accountDetail_retrieval';
        return await Axios.post(url, {username : CheckUser()})
        .then((response) =>  {
            return response;
        })
        .catch((error) => {
            console.log(error);
            return null;
        })
    }
}

export default {CheckLogin, CheckUser, GetAdminRole, GetLogoutStatus, GetUserProps};