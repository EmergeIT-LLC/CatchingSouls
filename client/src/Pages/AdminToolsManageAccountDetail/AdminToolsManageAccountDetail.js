import React, { useState, useEffect } from 'react';
import './AdminToolsManageAccountDetail.css';
//Components
import Header from '../../Components/Header/Header';
import Footer from '../../Components/Footer/Footer';
//Functions
import { CheckUserLogin, CheckUser, GetLogoutStatus, GetAdminRole } from '../../Functions/VerificationCheck';
//Repositories
import Axios from 'axios';
import { useNavigate, useLocation, useParams } from 'react-router-dom';

const AdminToolsManageAccountDetail = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const {AccountUsername} = useParams();
    const {SelectedAdmin} = useParams();
    const userLoggedIn = CheckUserLogin();
    const loggedInUser = CheckUser();
    const isAdmin = GetAdminRole();
    const [isLoading, setIsLoading] = useState(false);
    const [firstName, setFirstName] = useState(null);
    const [lastName, setLastName] = useState(null);
    const [email, setEmail] = useState(null);
    const [selectRole, setSelectRole] = useState("null");
    const [showButtons, setShowButtons] = useState(true);

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
        else {
            setIsLoading(true);
            getSelectedAdminProps();

            if (AccountUsername.toLowerCase() === SelectedAdmin.toLowerCase()) {
                setShowButtons(false);
            }
            setIsLoading(false);
        }
    }, [userLoggedIn]);


    const getSelectedAdminProps = async () => {
        const url = process.env.REACT_APP_Backend_URL + '/admin/adminAccountDetail_retrieval';
        
        await Axios.post(url, {SelectedAdmin : {SelectedAdmin}})
        .then((response) => {
            console.log(response)
            setFirstName(response.data.user.accountFirstName);
            setLastName(response.data.user.accountLastName);
            setEmail(response.data.user.accountEmail);
            setSelectRole(response.data.user.accountRole)
        })
        .catch((error) => {
            console.log(error);
            setIsLoading(false);
        })
    }

    return (
        <>
            <Header/>
            <div className='adminToolsManageAccountDetailPage_container'>
                <div className='adminToolsManageAccountDetail_form'>
                {isLoading ?
                    <>
                        <h1>Loading...</h1>
                    </>
                    :
                    <>
                        <h1>{firstName} {lastName}</h1>
                            <div className='adminToolsManageAccountDetailInfo_form'>
                                <p><b>Username:</b> {SelectedAdmin}</p>
                                <p><b>Email:</b> {email}</p>
                                <p><b>Role:</b> {selectRole}</p>
                            </div>
                            {showButtons ?
                                <>
                                    <a href={`/${loggedInUser}/AdminTools/ManageAdminAccounts/${SelectedAdmin}/Update`}><button className='adminToolsManageAccountDetailButton'>Update Admin</button></a>
                                    <a href={`/${loggedInUser}/AdminTools/ManageAdminAccounts/${SelectedAdmin}/Delete`}><button className='adminToolsManageAccountDetailButton'>Delete Admin</button></a>
                                </>
                            :
                            <></>
                            }
                        <a href={`/${loggedInUser}/AdminTools/ManageAdminAccounts`}><button className='adminToolsManageAccountDetailButton'>Return to Accounts</button></a>
                    </>
                }
                </div>
            </div>
            <Footer/>
        </>
    );
}

export default AdminToolsManageAccountDetail;
