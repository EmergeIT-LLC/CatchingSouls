import React, { useState, useEffect } from 'react';
import './AdminToolsManageAccountDelete.css';
//Components
import Header from '../../Components/Header/Header';
import Footer from '../../Components/Footer/Footer';
//Functions
import { CheckUserLogin, CheckUser, GetLogoutStatus, GetAdminRole } from '../../Functions/VerificationCheck';
//Repositories
import Axios from 'axios';
import { useNavigate, useLocation, useParams, Link } from 'react-router-dom';

const AdminToolsManageAccountDelete = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const {AccountUsername} = useParams();
    const {SelectedAdmin} = useParams();
    const userLoggedIn = CheckUserLogin();
    const loggedInUser = CheckUser();
    const isAdmin = GetAdminRole();
    const [isLoading, setIsLoading] = useState(false);
    const [username, setUsername] = useState(null);
    const [firstName, setFirstName] = useState(null);
    const [statusMessage, setStatusMessage] = useState(null);

    useEffect(() => {
        GetLogoutStatus(AccountUsername);
        if (!userLoggedIn) {
            navigate('/Login', {
                state: {
                    previousUrl: location.pathname,
                }
            });
        }
        else if (GetLogoutStatus(AccountUsername)) {
            navigate('/Logout')
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

    const getSelectedAdminProps = async () => {
        const url = process.env.REACT_APP_Backend_URL + '/admin/adminAccountDetail_retrieval';
        
        await Axios.post(url, {SelectedAdmin : {SelectedAdmin}})
        .then((response) => {
            setUsername(response.data.accountUsername)
            setFirstName(response.data.accountFirstName);
        })
        .catch((error) => {
            console.log(error);
        })
    }

    const deleteUserProps = (e) => {
        e.preventDefault();
        setIsLoading(true);
        const url = process.env.REACT_APP_Backend_URL + '/admin/adminAccountDetail_Delete';
                
        Axios.post(url, {
            username : username,
        })
        .then((response) => {
            if (response.data.message){
                setStatusMessage(response.data.message);
                setIsLoading(false);
            }
            else if (response.data.deleteStatus === "Successful") {
                navigate(`/${loggedInUser}/AdminTools/ManageAdminAccounts`);
            }
            else if (response.data.deleteStatus === "Unsuccessful") {
                setStatusMessage("Deletion failed!");
                setIsLoading(false);
            }
        })
        .catch((error) => {
            console.log(error.response.data.message);
            setIsLoading(false);
        });
    };


    return (
        <>
            <Header/>
            <div className='profileDeletePage_container'>
                <form className='adminToolsManageAccountDelete_form'>
                    {isLoading ?
                        <>
                            <h1>Loading...</h1>
                            <h2>{statusMessage}</h2>
                        </>
                    :
                        <>
                            <h1>Delete Profile</h1>
                            <p>You sure you want to delete <b>{firstName}'s</b> admin account?</p>
                            <button className='adminToolsManageAccountDeleteButton' type='submit' onClick={deleteUserProps}>Yes</button>
                            <Link to={`/${loggedInUser}/AdminTools/ManageAdminAccounts/${SelectedAdmin}/Detail`}><button className='adminToolsManageAccountDeleteButton'>No</button></Link>
                            <Link to={`/${loggedInUser}/AdminTools/ManageAdminAccounts`}><button className='adminToolsManageAccountDeleteButton'>Return to Accounts</button></Link>
                        </>
                    }
                </form>
                {isLoading ? <></> : <>{statusMessage ? <h2>{statusMessage}</h2> : <></>}</>}            
            </div>
            <Footer/>
        </>
    );
}

export default AdminToolsManageAccountDelete;