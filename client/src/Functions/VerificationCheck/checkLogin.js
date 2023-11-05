import React, { useState, useEffect } from 'react';
import Axios from 'axios';

const CheckLogin = () => {
  const url = process.env.REACT_APP_Backend_URL + '/user/checkLogin';

  useEffect(() => {
    login();
  }, [])
  
  const login = async () => {
    await Axios.post(url)
    .then((response) => {
      if (response.data.loggedIn === true){
        return true;
      }
      return false;
    })
    .catch((error) => {
      console.log(error);
      return false;
    });
  }
}

export default CheckLogin;