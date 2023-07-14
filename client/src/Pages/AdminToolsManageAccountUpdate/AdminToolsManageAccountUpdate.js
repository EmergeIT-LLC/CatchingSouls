import React, { useState, useEffect } from 'react';
import './AdminToolsManageAccountUpdate.css'
//Components
import Header from '../../Components/Header/Header';
import Footer from '../../Components/Footer/Footer';
//Entry Checks
import checkEmail from '../../Functions/EntryCheck/checkEmail';
//Functions
import CheckLogin from '../../Functions/VerificationCheck/checkLogin';
import CheckUser from '../../Functions/VerificationCheck/checkUser';
import GetLogoutStatus from '../../Functions/VerificationCheck/getLogoutStatus';
import GetAdminRole from '../../Functions/VerificationCheck/getAdminRole';
//Repositories
import Axios from 'axios';
import { useNavigate, useLocation, useParams } from 'react-router-dom';

const AdminToolsManageAccountUpdate = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const {AccountUsername} = useParams();
    const {SelectedAdmin} = useParams();
    const userLoggedIn = CheckLogin();
    const loggedInUser = CheckUser(userLoggedIn);
    const logOutStatus = GetLogoutStatus(AccountUsername);
    const isAdmin = GetAdminRole();
    const [isLoading, setIsLoading] = useState(false);
    const [username, setUsername] = useState(null);
    const [firstName, setFirstName] = useState(null);
    const [lastName, setLastName] = useState(null);
    const [email, setEmail] = useState(null);
    const [confirmEmail, setConfirmEmail] = useState(null);
    const [selectRole, setSelectRole] = useState("null");
    const [statusMessage, setStatusMessage] = useState(null);

    useEffect(() => {
        if (!userLoggedIn) {
            navigate('/Login', {
                state: {
                    previousUrl: location.pathname,
                }
            });
        }
        else if (logOutStatus) {
            navigate('/Logout');
        }
        else if (!isAdmin) {
            navigate('/');
        }
        else if (AccountUsername.toLowerCase() == SelectedAdmin.toLowerCase()) {
            navigate(`/${loggedInUser}/AdminTools/ManageAdminAccounts/${SelectedAdmin}/Detail`);
        }
        else {
            getSelectedAdminProps();
        }
    }, [userLoggedIn]);

    const submitUpdateForm = async () => {
        if (email !== confirmEmail){
            return setStatusMessage("Email and confirm email does not match!");
        }
        else if (checkEmail(email) == false){
            return setStatusMessage("Email Is Not Acceptable");
        }
        else if (selectRole == "null"){
            return setStatusMessage("Please Select A Role");
        }

        setIsLoading(true);
        const url = process.env.REACT_APP_Backend_URL + '/admin/adminAccountDetail_Update';
                
        await Axios.post(url, {
            username : username,
            firstName : firstName,
            lastName : lastName,
            email : email,
            selectRole : selectRole
        })
        .then((response) => {
            if (response.data.message){
                setIsLoading(false);
                setStatusMessage(response.data.message);
            }
            else if (response.data.updateStatus === "Successful") {
                navigate(`/${loggedInUser}/AdminTools/ManageAdminAccounts/${SelectedAdmin}/Detail`);
            }
            else if (response.data.updateStatus === "Successful") {
                setIsLoading(false);
                setStatusMessage("Update Failed!");
            }
        })
        .catch((error) => {
            setIsLoading(false);
            console.log(error);
        });
    };

    const getSelectedAdminProps = async () => {
        const url = process.env.REACT_APP_Backend_URL + '/admin/adminAccountDetail_retrieval';
        
        await Axios.post(url, {SelectedAdmin : {SelectedAdmin}})
        .then((response) => {
            setUsername(response.data.accountUsername)
            setFirstName(response.data.accountFirstName);
            setLastName(response.data.accountLastName);
            setEmail(response.data.accountEmail);
            setConfirmEmail(response.data.accountEmail);
            setSelectRole(response.data.accountRole)
        })
        .catch((error) => {
            console.log(error);
        })
    }

    return (
        <>
            <Header/>
            <div className='adminToolsManageAccountUpdatePage_container'>
                <div className='adminToolsManageAccountUpdate_form'>
                    <h1>Update Admin Profile</h1>
                    <input className='username' name='username' placeholder='Enter A Username' defaultValue={username} required autoComplete="off" disabled/>
                    <input className='firstName' placeholder='First Name' defaultValue={firstName} required autoComplete="off" onChange={(e) => setFirstName(e.target.value)} />
                    <input className='lastName' placeholder='Last Name' defaultValue={lastName} required autoComplete="off" onChange={(e) => setLastName(e.target.value)} />
                    <input className='email' placeholder='Email Address' type='email' defaultValue={email} required autoComplete="off" onChange={(e) => setEmail(e.target.value)} />
                    <input className='confirmEmail' placeholder='Confirm Email Address' type='email' defaultValue={confirmEmail} required autoComplete="off" onChange={(e) => setConfirmEmail(e.target.value)} />
                    <select value={selectRole} options={selectRole} required onChange={(e) => {setSelectRole(e.target.value)}}>
                        <option value="null">Make Selection</option>
                        <option value="Admin">Admin</option>
                    </select>
                    {isLoading && <button className='adminToolsManageAccountUpdateButton' disabled>Loading...</button>}
                    {!isLoading && <button className='adminToolsManageAccountUpdateButton' type='submit' onClick={submitUpdateForm}>Update</button>}
                    {!isLoading && <a href={`/${loggedInUser}/AdminTools/ManageAdminAccounts/${SelectedAdmin}/Detail`}><button className='adminToolsManageAccountUpdateButton'>Cancel</button></a>}
                    {!isLoading && <a href={`/${loggedInUser}/AdminTools/ManageAdminAccounts`}><button className='adminToolsManageAccountUpdateButton'>Return to Accounts</button></a>}
                </div>
            <h2>{statusMessage}</h2>
            </div>
            <Footer/> 
        </>
    );
}

export default AdminToolsManageAccountUpdate;
