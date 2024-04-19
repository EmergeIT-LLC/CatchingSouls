import React, { useEffect, useState } from 'react';
import './Header.css'
//Image
import companyLogo from '../../Images/Logo_Transparent.png';
import farBars from '../../Images/naviconrww752.png';
//Functions
import { CheckUserLogin, CheckGuestLogin, CheckUser, GetAdminRole } from '../../Functions/VerificationCheck';
//Repositories
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const reRoute = useNavigate();
  const userLoggedIn = CheckUserLogin();
  const loggedInUser = CheckUser();
  const guestLoggedIn = CheckGuestLogin();
  const adminLevel = GetAdminRole();
  const [buttonLabel, setButtonLabel] = useState('Login');
  const [showMenu, setShowMenu] = useState(false);
  let menu = null;
  
  useEffect(() => {
    if (userLoggedIn || guestLoggedIn) {
      setButtonLabel('Logout');
    } else {
      setButtonLabel('Login');
    }
  }, [userLoggedIn, guestLoggedIn]);


  const routeChange = () =>{
    if (userLoggedIn || guestLoggedIn){
      reRoute('/logout');
    }
    else {
      reRoute('/login');
    }
  }

  const showMenuBoolean = () => {
    if (!showMenu){
        setShowMenu(true);
    }
    else {
        setShowMenu(false);
    }
  }

  if (showMenu){
    menu = 
    <nav className='mobileNav'>
        <ul>
          <button className='loginButton' onClick={routeChange}>{buttonLabel}</button>
          <li><a href='/'>Home</a></li>
          {userLoggedIn ? <li><a href={`/Profile/${loggedInUser}`}>Profile</a></li> : <></>}
          {userLoggedIn ? <>{adminLevel ? <li><a href={`/${loggedInUser}/AdminTools`}>Admin Controls</a></li> : <></>}</> : <></>}
          <li><a href='/AboutCatchingSouls'>About Us</a></li>
          <li><a href='/ContactCatchingSouls'>Contact Us</a></li>
          <li><a href='/SendUsYourQuestions'>Send Us Your Questions</a></li>
        </ul>
    </nav>
  }

  return (
      <div className='headerBody'>
          <a href='/'><img src={companyLogo} alt ="Catching Souls" /></a>
          <h1 className='companyName'>Catching Souls</h1>
          <button className='loginButton' onClick={routeChange}>{buttonLabel}</button>
          <img className='farBars' src={farBars} alt ="FarBar Button" onClick={showMenuBoolean}/>
          {menu}
            <nav>
              <ul>
                <li><a href='/'>Home</a></li>
                {userLoggedIn ? <li><a href={`/Profile/${loggedInUser}`}>Profile</a></li> : <></>}
                {userLoggedIn ? <>{adminLevel ? <li><a href={`/${loggedInUser}/AdminTools`}>Admin Controls</a></li> : <></>}</> : <></>}
                <li><a href='/AboutCatchingSouls'>About Us</a></li>
                <li><a href='/ContactCatchingSouls'>Contact Us</a></li>
                <li><a href='/SendUsYourQuestions'>Send Us Your Questions</a></li>
              </ul>
          </nav>
      </div>
  );
}
export default Header;