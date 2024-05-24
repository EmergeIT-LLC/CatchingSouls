import React, { useState } from 'react';
import './Register.css';
// Components
import Header from '../../Components/Header/Header';
import Footer from '../../Components/Footer/Footer';
// Entry Checks
import { CheckUsername, CheckEmail, CheckPassword } from '../../Functions/EntryCheck';
// Repositories
import Axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [firstName, setFirstName] = useState(null);
    const [lastName, setLastName] = useState(null);
    const [username, setUsername] = useState(null);
    const [email, setEmail] = useState(null);
    const [confirmEmail, setConfirmEmail] = useState(null);
    const [password, setPassword] = useState(null);
    const [confirmPassword, setConfirmPassword] = useState(null);
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

    const submitForm = (e) => {
        e.preventDefault();
        if (!firstName || !lastName || !username || !email || !confirmEmail || !password || !confirmPassword){
            return setStatusMessage("All fields with \"*\" must be filled in!");
        } else if (!CheckUsername(username)){
            return setStatusMessage("Username Is Not Acceptable");
        } else if (email !== confirmEmail){
            return setStatusMessage("Email and confirm email does not match!");
        } else if (!CheckEmail(email)){
            return setStatusMessage("Email Is Not Acceptable");
        } else if (password !== confirmPassword){
            return setStatusMessage("Password and confirm password does not match!");
        } else if (!CheckPassword(password)){
            return setStatusMessage(
                <>Password Is Not Acceptable!<br/><br/>
                Password must contain the following:<br/>
                Uppercase Letter<br/>
                Lowercase Letter<br/>
                Numbers<br/>
                Special Characters</>
            );
        } else if (selectDenomination !== null || selectDenomination !== "Not Applicable") {
            if (churchName.length < 2) {
                return setStatusMessage("Church Name Is Not Acceptable"); 
            }

            if (churchLocation.length < 2) {
                return setStatusMessage("Church Location Is Not Acceptable"); 
            }
        }

        setIsLoading(true);
        const url = process.env.REACT_APP_Backend_URL + '/User/register';
                
        Axios.post(url, {
            firstName : firstName,
            lastName : lastName,
            username : username,
            email : email,
            password : password,
            churchName : churchName,
            denomination : selectDenomination,
            churchLocation : churchLocation,
            churchState : churchState
        })
        .then((response) => {
            if (response.data.message){
                setStatusMessage(response.data.message);
                setIsLoading(false);
            } else if (response.data.registerStatus === "Successful") {
                navigate('/Login');
            } else if (response.data.registerStatus === "Unsuccessful") {
                setStatusMessage("An error occurred");
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
            <Header />
            <div className='registerPage_container'>
                <div className='register_form'>
                    <h1>Register</h1>
                    <input className='username' name='username' placeholder='Enter A Username' required autoComplete="off" onChange={(e) => setUsername(e.target.value)} />
                    <input className='firstName' placeholder='First Name' required autoComplete="off" onChange={(e) => setFirstName(e.target.value)} />
                    <input className='lastName' placeholder='Last Name' required autoComplete="off" onChange={(e) => setLastName(e.target.value)} />
                    <input className='email' placeholder='Email Address' type='email' required autoComplete="off" onChange={(e) => setEmail(e.target.value)} />
                    <input className='confirmEmail' placeholder='Confirm Email Address' type='email' required autoComplete="off" onChange={(e) => setConfirmEmail(e.target.value)} />
                    <input className='password' placeholder='Enter A Password' type='password' required autoComplete="off" onChange={(e) => setPassword(e.target.value)} />
                    <input className='confirmPassword' placeholder='Confirm Password' type='password' required autoComplete="off" onChange={(e) => setConfirmPassword(e.target.value)} />
                    <h1>Church Info</h1>
                    {showNamingConvention && <h2>{churchNameToDisplay}</h2>}
                    <select value={selectDenomination} option={selectDenomination} className='churchDenomination' required onChange={(e) => churchInfoChecker(e.target.value)} >
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
                    {isLoading ? 
                        <button className='registerButton' disabled>Loading...</button> :
                        <button className='registerButton' type='submit' onClick={submitForm}>Register</button>
                    }
                </div>
                {isLoading ? null : statusMessage && <h2>{statusMessage}</h2>}
            </div>  
            <Footer />
        </>
    );
}

export default Register;