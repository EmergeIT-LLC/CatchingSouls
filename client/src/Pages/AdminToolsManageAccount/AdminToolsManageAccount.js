import React, { useState, useEffect } from 'react';
import './AdminToolsManageAccount.css';
//Components
import Header from '../../Components/Header/Header';
import Footer from '../../Components/Footer/Footer';
//Functions
import { CheckUserLogin, CheckUser, GetLogoutStatus, GetAdminRole } from '../../Functions/VerificationCheck';
import { isCookieValid } from '../../Functions/CookieCheck';
//Repositories
import Axios from 'axios';
import { useNavigate, useLocation, useParams } from 'react-router-dom';

const AdminToolsManageAccount = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const {AccountUsername} = useParams();
    const userLoggedIn = CheckUserLogin();
    const loggedInUser = CheckUser();
    const validCookie = isCookieValid()
    const isAdmin = GetAdminRole();
    const [isLoading, setIsLoading] = useState(false);
    const [accountData, setAccountData] = useState([]);
    const [accountData2, setAccountData2] = useState([]);

    useEffect(() => {
        GetLogoutStatus(AccountUsername);
        if (!userLoggedIn || !validCookie) {
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
            getVerifiedListProps();
            getUnverifiedListProps();
            setIsLoading(false);
        }
    }, [userLoggedIn]);
    
    const getVerifiedListProps = async () => {
        const url = process.env.REACT_APP_Backend_URL + '/admin/account_retrieval';
        
        await Axios.post(url)
        .then((response) =>  {
            setAccountData(response.data);
        })
        .catch((error) => {
            console.log(error);
        })
    };

    const getUnverifiedListProps = async () => {
        const url = process.env.REACT_APP_Backend_URL + '/admin/account_unverifiedRetrieval';
        
        await Axios.post(url)
        .then((response) =>  {
            setAccountData2(response.data);
        })
        .catch((error) => {
            console.log(error);
        })
    };

    const accountDetail = (selectedAdmin) => {
        navigate(`/${loggedInUser}/AdminTools/ManageAdminAccounts/${selectedAdmin}/Detail`);
    }

    return (
        <>
            <Header/>
            <div className='adminToolsManageAccountPage_container'>
                <a href={`/${loggedInUser}/AdminTools/ManageAdminAccounts/AddAdmin`}><button className='adminToolsManageAccountButton'>Add Admin</button></a>
                <form className='adminToolsManageAccount_form'>
                    {isLoading ?
                        <>
                            <h1>Loading...</h1>
                        </>
                    :       
                        <>     
                            <h1>Verified Accounts</h1>
                            <table>
                                <tbody>
                                    <tr>
                                        <th>Username</th>
                                        <th>Full Name</th>
                                        <th>Email</th>
                                        <th>Role</th>
                                    </tr>
                                </tbody>
                                <tbody>
                                {accountData.map((accounts) => (
                                        <tr key={accounts.accountUsername} onClick={() => accountDetail(accounts.accountUsername)}>
                                            <td>{accounts.accountUsername}</td>
                                            <td>{accounts.accountFirstName} {accounts.accountLastName}</td>
                                            <td>{accounts.accountEmail}</td>
                                            <td>{accounts.accountRole}</td>
                                        </tr>
                                ))}
                                </tbody>
                            </table>
                            <h1>Unverified Accounts</h1>
                            <table>
                                <tbody>
                                    <tr>
                                        <th>Username</th>
                                        <th>Full Name</th>
                                        <th>Email</th>
                                        <th>Role</th>
                                    </tr>
                                </tbody>
                                <tbody>
                                {accountData2.map((accounts) => (
                                        <tr key={accounts.accountUsername} onClick={() => accountDetail(accounts.accountUsername)}>
                                            <td>{accounts.accountUsername}</td>
                                            <td>{accounts.accountFirstName} {accounts.accountLastName}</td>
                                            <td>{accounts.accountEmail}</td>
                                            <td>{accounts.accountRole}</td>
                                        </tr>
                                ))}
                                </tbody>
                            </table>
                        </>
                    }
                </form>
            </div>
            <Footer/>
        </>
    );
}

export default AdminToolsManageAccount;
