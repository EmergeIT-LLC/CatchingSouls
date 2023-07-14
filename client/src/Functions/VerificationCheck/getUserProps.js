import React from 'react';
import Axios from 'axios';


const GetUserProps = async (userLoggedIn, loggedInUser) => {
    if (userLoggedIn){
        const url = process.env.REACT_APP_Backend_URL + '/user/accountDetail_retrieval';
        return await Axios.post(url, {username : loggedInUser})
        .then((response) =>  {
            return response;
        })
        .catch((error) => {
            console.log(error);
            return null;
        })
    }
}

export default GetUserProps;