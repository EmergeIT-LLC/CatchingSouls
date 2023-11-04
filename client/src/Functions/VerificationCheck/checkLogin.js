import React, { useState, useEffect } from 'react';

function checkCookie(cookieName) {
  const cookies = document.cookie.split('; ');
  for (const cookie of cookies) {
    const [name, value] = cookie.split('=');
    if (name === cookieName) {
      return value;
    }
  }
  return null; // Cookie not found
}
  

const CheckLogin = () => {
    const sessionCookie = checkCookie('BibleTriviaSessionCookies');
        
    if (sessionCookie) {
        return true;
    }
    else {
        return false;
    }
}

export default CheckLogin;