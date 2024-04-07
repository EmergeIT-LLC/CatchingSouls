import React, { useState, useEffect } from 'react';
import './AdminTools.css';
//Components
import Header from '../../Components/Header/Header';
import Footer from '../../Components/Footer/Footer';
//Functions
import { CheckUserLogin, CheckUser, GetLogoutStatus, GetAdminRole } from '../../Functions/VerificationCheck';
//Repositories
import Axios from 'axios';
import { useNavigate, useLocation, useParams, Link } from 'react-router-dom';

const AdminTools = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const {AccountUsername} = useParams();
    const userLoggedIn = CheckUserLogin();
    const loggedInUser = CheckUser();
    const isAdmin = GetAdminRole();
    const [isLoading, setIsLoading] = useState(false);
    
    useEffect(() => {
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
    }, [userLoggedIn]);

    const backupDB = async (e) => {
        e.PreventDefault();
        const url = process.env.REACT_APP_Backend_URL + '/admin/adminTool/DatabaseBackup';

        await Axios.post(url)
        .then((response) =>  {
            console.log(response.data.message);
        })
        .catch((error) => {
            console.log(error);
        })
    }
    
    return (
        <>
            <Header/>
            <div className='adminToolsPage_container'>
                <form className='adminTools_form'>
                    {isLoading ?
                    <>
                        <h1>Loading...</h1>
                    </>
                        :
                    <>
                        <h1>Pick A Tool</h1>
                        <Link to={`/${loggedInUser}/AdminTools/ManageAdminAccounts`}><button className='adminToolsButton'>Manage Admin Accounts</button></Link>
                        <Link to={`/${loggedInUser}/AdminTools/ManageTriviaQuestions`}><button className='adminToolsButton'>Manage Trivia Questions</button></Link>
                        <button className='adminToolsButton' onClick={() => backupDB()}>Backup Database Table</button>
                        </>
                    }
                </form>
            </div>
            <Footer/>
        </>
    );
}

export default AdminTools;
