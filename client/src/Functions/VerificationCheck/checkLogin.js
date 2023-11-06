import { useEffect, useState } from 'react';
import Axios from 'axios';
import { useNavigate } from 'react-router-dom';

function getCookie(cookieName) {
  const cookies = document.cookie.split(';');
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].trim();
    if (cookie.startsWith(cookieName + '=')) {
      return cookie.substring(cookieName.length + 1);
    }
  }
  return null; // Return null if the cookie is not found
}

const CheckLogin = () => {
  const navigate = useNavigate();
  const [loginStatus, setLoginStatus] = useState(false);
  const url = process.env.REACT_APP_Backend_URL + '/user/checkLogin';

  useEffect(() => {
    checkLogin();
  }, []);

  const checkLogin = async () => {
    try {
      const response = await Axios.post(url, {
        loggedIn: getCookie('loggedIn'),
        username: getCookie('username'),
        isAdmin: getCookie('isAdmin')
      });

      if (response.data.forceLogout === true && response.data.verified === false) {
        //User verificaton failed...
        console.log("User verificaton failed...")
        navigate('/logout');
        setLoginStatus(false);
      } 
      else if (response.data.forceLogout === false && response.data.verified === false) {
        //User not logged in...
        console.log("User not logged in...")
        navigate('/login');
        setLoginStatus(false);
      }
      else {
        //User verification passed...
        console.log("User verification passed...")
        setLoginStatus(true);
      }
    } catch (error) {
      console.log(error);
      setLoginStatus(false); // Handle the error case accordingly
    }
  };

  return loginStatus;
};

export default CheckLogin;