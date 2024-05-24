import React, { useState, useEffect } from 'react';
import './ProfileUpdate.css';
//Components
import Header from '../../Components/Header/Header';
import Footer from '../../Components/Footer/Footer';
//Entry Checks
import { CheckEmail, CheckPassword } from '../../Functions/EntryCheck'
//Functions
import { CheckUserLogin, CheckUser, GetAdminRole, GetUserProps, GetLogoutStatus } from '../../Functions/VerificationCheck';
import { isCookieValid } from '../../Functions/CookieCheck';
//Repositories
import Axios from 'axios';
import { useNavigate, useLocation, useParams } from 'react-router-dom';


const ProfileUpdate = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const {AccountUsername} = useParams();
    const userLoggedIn = CheckUserLogin();
    const loggedInUser = CheckUser();
    const logOutStatus = GetLogoutStatus(AccountUsername);
    const validCookie = isCookieValid()
    const [loggedInUserData, setLoggedInUserData] = useState(GetUserProps());
    const [isLoading, setIsLoading] = useState(false);
    const [username, setUsername] = useState(null);
    const [firstName, setFirstName] = useState();
    const [lastName, setLastName] = useState(null);
    const [email, setEmail] = useState(null);
    const [confirmEmail, setConfirmEmail] = useState(null);
    const [password, setPassword] = useState(null);
    const [newPassword, setNewPassword] = useState(null);
    const [confirmNewPassword, setConfirmNewPassword] = useState(null);
    const [selectDenomination, setSelectDenomination] = useState(null);
    const [showChurchInfoFields, setShowChurchInfoFields] = useState(false);
    const [showOtherDenominationField, setShowOtherDenominationfield] = useState(false);
    const [otherDenominationField, setOtherDenominationField] = useState(null);
    const [churchName, setChurchName] = useState(null);
    const [churchNameToDisplay, setChurchNameToDisplay] = useState(null);
    const [showNamingConvention, setShowNamingConvention] = useState(false);
    const [churchLocation, setChurchLocation] = useState(null);
    const [churchState, setChurchState] = useState(null);
    const [statusMessage, setStatusMessage] = useState(null);

    useEffect(()=> {
        setIsLoading(true);
        if (!logOutStatus && validCookie) {
            loggedInUserData.then(res => setUsername(res.data.user.accountUsername));
            loggedInUserData.then(res => setFirstName(res.data.user.accountFirstName))
            loggedInUserData.then(res => setLastName(res.data.user.accountLastName));
            loggedInUserData.then(res => setEmail(res.data.user.accountEmail));
            loggedInUserData.then(res => setConfirmEmail(res.data.user.accountEmail));
            loggedInUserData.then(res => setSelectDenomination(res.data.user.denomination));
            loggedInUserData.then(res => displayNaming(res.data.user.churchName));
            loggedInUserData.then(res => setChurchLocation(res.data.user.churchLocation));
            loggedInUserData.then(res => settingChurchState(res.data.user.churchState));
            setIsLoading(false);
        }
        else if (AccountUsername !== loggedInUser) {
            navigate('/');
        }
        else {
            setIsLoading(false);
            navigate('/Login', {
                state: {
                    previousUrl: location.pathname,
                }
            });
        }
    }, [userLoggedIn]);

    const churchInfoChecker = (denominationType) => {
        if (denominationType === "null" || denominationType === "Not Applicable") {
            setSelectDenomination(denominationType === "null" ? null : denominationType);
            setShowOtherDenominationfield(false);
            setOtherDenominationField(null);
            setShowChurchInfoFields(false);
        } else if (denominationType === "Other") {
            setSelectDenomination(otherDenominationField);
            setShowOtherDenominationfield(true);
            setShowChurchInfoFields(true);
        } else {
            setSelectDenomination(denominationType);
            setShowOtherDenominationfield(false);
            setOtherDenominationField(null);
            setShowChurchInfoFields(true);
        }
    }

    const displayNaming = (churchNaming) => {
        // Resetting boolean for display name
        setShowNamingConvention(churchNaming.length > 0);
        let namingConvention;

        // Ensuring Appropriate naming format
        if (selectDenomination === 'Non-denominational') {
            namingConvention = churchNaming + ' Church';
        }
        else {
            namingConvention = churchNaming + ' ' + selectDenomination + ' Church';
        }
        // Setting church name to pass over the api
        setChurchName(churchNaming);
        setChurchNameToDisplay(namingConvention);
    }

    const settingChurchState = (selectedChurchState) => {
        if (selectedChurchState === "null") {
            setChurchState(null);
        }
        else {
            setChurchState(selectedChurchState);
        }
    }

    const submitUpdateForm = (e) => {
        e.preventDefault();
        if (email !== confirmEmail){
            return setStatusMessage("Email and confirm email does not match!");
        }
        else if (CheckEmail(email) === false){
            return setStatusMessage("Email Is Not Acceptable");
        } else if (password != null){
            if (newPassword === null || confirmNewPassword === null){
                return setStatusMessage("All Password fields must be filled in!");
            }
            else if (newPassword !== confirmNewPassword){
                return setStatusMessage("Password and confirm password does not match!");
            }
            else if (CheckPassword(password) === false){
                return setStatusMessage("Current Password Is Incorrect");
            }    
            else if (CheckPassword(newPassword) === false){
                return setStatusMessage("New Password Is Not Acceptable");
            }    
        } else if (password != null && newPassword === null || password != null && confirmNewPassword === null){
            return setStatusMessage("All Password fields must be filled in!");
        } else if (selectDenomination !== null || selectDenomination !== "Not Applicable") {
            if (churchName.length < 2) {
                return setStatusMessage("Church Name Is Not Acceptable"); 
            }

            if (churchLocation.length < 2) {
                return setStatusMessage("Church Location Is Not Acceptable"); 
            }
        }

        setIsLoading(true);
        const url = process.env.REACT_APP_Backend_URL + '/User/account_Update';
               
        Axios.post(url, {
            username : loggedInUser,
            firstName : firstName,
            lastName : lastName,
            email : email,
            password : password,
            newPassword : newPassword,
            churchName : churchName,
            denomination : selectDenomination,
            churchLocation : churchLocation,
            churchState : churchState

        })
        .then((response) => {
            console.log(response.data)
            if (response.data.message){
                setStatusMessage(response.data.message);
                setIsLoading(false);
            }
            else if (response.data.updateStatus === "Successful") {
                navigate(`/Profile/${loggedInUser}`);
            }
            else if (response.data.updateStatus === "Unsuccessful") {
                setStatusMessage("Update failed!");
                setIsLoading(false);
            }
        })
        .catch((error) => {
            setStatusMessage(error.response.data.message);
            setIsLoading(false);
        });
    };

    return (
        <>
            <Header/>
            <div className='profileUpdatePage_container'>
                <div className='profileUpdate_form'>
                {isLoading ?
                    <>
                        <h1>Loading...</h1>
                    </>
                :
                    <>
                        <h1>Update Profile</h1>
                        <input className='username' name='username' placeholder='Enter A Username' defaultValue={username} required autoComplete="off" disabled/>
                        <input className='firstName' placeholder='First Name' defaultValue={firstName} required autoComplete="off" onChange={(e) => setFirstName(e.target.value)} />
                        <input className='lastName' placeholder='Last Name' defaultValue={lastName} required autoComplete="off" onChange={(e) => setLastName(e.target.value)} />
                        <input className='email' placeholder='Email Address' type='email' defaultValue={email} required autoComplete="off" onChange={(e) => setEmail(e.target.value)} />
                        <input className='confirmEmail' placeholder='Confirm Email Address' type='email' defaultValue={confirmEmail} required autoComplete="off" onChange={(e) => setConfirmEmail(e.target.value)} />
                        <input className='currentpassword' placeholder='Enter Current Password' type='password' required autoComplete="off" onChange={(e) => {setPassword(e.target.value); }} />
                        <input className='password' placeholder='Enter New Password' type='password' required autoComplete="off" onChange={(e) => {setNewPassword(e.target.value); }} />
                        <input className='confirmPassword' placeholder='Confirm New Password' type='password' required autoComplete="off" onChange={(e) => {setConfirmNewPassword(e.target.value); }} />
                        <h1>Church Info</h1>
                        {showNamingConvention && <h2>{churchNameToDisplay}</h2>}
                        <select value={selectDenomination} option={selectDenomination} required onChange={(e) => churchInfoChecker(e.target.value)} >
                            <option value="null">Select Denomination Type</option>
                            <option value="Not Applicable">--Not Applicable--</option>
                            <option value="Other">--Other--</option>
                            <option value="Baptist">Baptist</option>
                            <option value="Catholic">Catholic</option>
                            <option value="Lutheran">Lutheran</option>
                            <option value="Methodism">Methodism</option>
                            <option value="Non-denominational">Non-denominational</option>
                            <option value="Orthodox">Orthodox</option>
                            <option value="Pentecostal">Pentecostal</option>
                            <option value="Presbyterian">Presbyterian</option>
                            <option value="Seventh-Day Adventist">Seventh-Day Adventist</option>
                        </select>
                        {showOtherDenominationField && 
                            <input className='otherDenomination' placeholder='Enter Denomination' autoComplete="off" onChange={(e) => setOtherDenominationField(e.target.value)} />
                        }
                        {showChurchInfoFields &&
                            <> 
                            <input className='churchName' placeholder='Enter Church Name' autoComplete="off" onChange={(e) => displayNaming(e.target.value)} />
                            <input className='churchLocation' placeholder='Enter Church City' autoComplete="off" onChange={(e) => setChurchLocation(e.target.value)} />
                            <select value={churchState} option={churchState} className='churchState' required onChange={(e) => settingChurchState(e.target.value)} >
                                <option value="null">Select Church State</option>
                                <option value="Alabama">Alabama</option>
                                <option value="Alaska">Alaska</option>
                                <option value="Arizona">Arizona</option>
                                <option value="Arkansas">Arkansas</option>
                                <option value="California">California</option>
                                <option value="Colorado">Colorado</option>
                                <option value="Connecticut">Connecticut</option>
                                <option value="Delaware">Delaware</option>
                                <option value="Florida">Florida</option>
                                <option value="Georgia">Georgia</option>
                                <option value="Hawaii">Hawaii</option>
                                <option value="Idaho">Idaho</option>
                                <option value="Illinois">Illinois</option>
                                <option value="Indiana">Indiana</option>
                                <option value="Iowa">Iowa</option>
                                <option value="Kansas">Kansas</option>
                                <option value="Kentucky">Kentucky</option>
                                <option value="Louisiana">Louisiana</option>
                                <option value="Maine">Maine</option>
                                <option value="Maryland">Maryland</option>
                                <option value="Massachusetts">Massachusetts</option>
                                <option value="Michigan">Michigan</option>
                                <option value="Minnesota">Minnesota</option>
                                <option value="Mississippi">Mississippi</option>
                                <option value="Missouri">Missouri</option>
                                <option value="Montana">Montana</option>
                                <option value="Nebraska">Nebraska</option>
                                <option value="Nevada">Nevada</option>
                                <option value="New Hampshire">New Hampshire</option>
                                <option value="New Jersey">New Jersey</option>
                                <option value="New Mexico">New Mexico</option>
                                <option value="New York">New York</option>
                                <option value="North Carolina">North Carolina</option>
                                <option value="North Dakota">North Dakota</option>
                                <option value="Ohio">Ohio</option>
                                <option value="Oklahoma">Oklahoma</option>
                                <option value="Oregon">Oregon</option>
                                <option value="Pennsylvania">Pennsylvania</option>
                                <option value="Rhode Island">Rhode Island</option>
                                <option value="South Carolina">South Carolina</option>
                                <option value="South Dakota">South Dakota</option>
                                <option value="Tennessee">Tennessee</option>
                                <option value="Texas">Texas</option>
                                <option value="Utah">Utah</option>
                                <option value="Vermont">Vermont</option>
                                <option value="Virginia">Virginia</option>
                                <option value="Washington">Washington</option>
                                <option value="West Virginia">West Virginia</option>
                                <option value="Wisconsin">Wisconsin</option>
                                <option value="Wyoming">Wyoming</option>
                            </select>
                            </>
                        }
                        {isLoading && <button className='profileUpdateButton' disabled>Loading...</button>}
                        {!isLoading && <button className='profileUpdateButton' type='submit' onClick={submitUpdateForm}>Update</button>}
                        {!isLoading && <a href={`/Profile/${loggedInUser}`}><button className='profileUpdateButton'>Cancel</button></a>}
                    </>
                }
                </div>
                {isLoading ? null : statusMessage && <h2>{statusMessage}</h2>}
                </div>
            <Footer/>
        </>
    );
}

export default ProfileUpdate;
