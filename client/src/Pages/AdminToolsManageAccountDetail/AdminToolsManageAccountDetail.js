import React, { useState, useEffect } from 'react';
import './AdminToolsManageAccountDetail.css';
//Components
import Header from '../../Components/Header/Header';
import Footer from '../../Components/Footer/Footer';
//Functions
import CheckLogin from '../../Functions/VerificationCheck/checkLogin';
import CheckUser from '../../Functions/VerificationCheck/checkUser';
import GetLogoutStatus from '../../Functions/VerificationCheck/getLogoutStatus';
import GetAdminRole from '../../Functions/VerificationCheck/getAdminRole';
//Repositories
import Axios from 'axios';
import { useNavigate, useLocation, useParams } from 'react-router-dom';

const AdminToolsManageAccountDetail = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const {AccountUsername} = useParams();
    const {SelectedAdmin} = useParams();
    const userLoggedIn = CheckLogin();
    const loggedInUser = CheckUser(userLoggedIn);
    const logOutStatus = GetLogoutStatus(AccountUsername);
    const isAdmin = GetAdminRole();
    const [isLoading, setIsLoading] = useState(false);
    const [firstName, setFirstName] = useState(null);
    const [lastName, setLastName] = useState(null);
    const [email, setEmail] = useState(null);
    const [selectRole, setSelectRole] = useState("null");
    const [showButtons, setShowButtons] = useState(true);

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
        else {
            getSelectedAdminProps();

            if (AccountUsername.toLowerCase() == SelectedAdmin.toLowerCase()) {
                setShowButtons(false);
            }
        }
    }, [userLoggedIn]);


    const getSelectedAdminProps = async () => {
        const url = process.env.REACT_APP_Backend_URL + '/admin/adminAccountDetail_retrieval';
        
        await Axios.post(url, {SelectedAdmin : {SelectedAdmin}})
        .then((response) => {
            setFirstName(response.data.accountFirstName);
            setLastName(response.data.accountLastName);
            setEmail(response.data.accountEmail);
            setSelectRole(response.data.accountRole)
        })
        .catch((error) => {
            console.log(error);
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
