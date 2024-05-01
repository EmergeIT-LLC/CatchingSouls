import React, { useState, useEffect } from 'react';
import './AdminToolsManageDatabase.css';
//Components
import Header from '../../Components/Header/Header';
import Footer from '../../Components/Footer/Footer';
//Functions
import { CheckUserLogin, CheckUser, GetLogoutStatus, GetAdminRole } from '../../Functions/VerificationCheck';
//Repositories
import Axios from 'axios';
import { useNavigate, useLocation, useParams, Link } from 'react-router-dom';

const AdminToolsManageDatabase = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const {AccountUsername} = useParams();
    const userLoggedIn = CheckUserLogin();
    const loggedInUser = CheckUser();
    const isAdmin = GetAdminRole();
    const [isLoading, setIsLoading] = useState(false);
    const [backupExecutionDate, setBackupExecutionDate] = useState('');
    const [backupExecutionResults, setBackupExecutionResults] = useState('');
    const [importExecutionDate, setImportExecutionDate] = useState('');
    const [importExecutionResults, setImportExecutionResults] = useState('');

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

        gatherBackupImportInfo();
    }, [userLoggedIn]);

    const gatherBackupImportInfo = async() => {
        const url = process.env.REACT_APP_Backend_URL + '/admin/adminTool/BackupImportInfo';
        setIsLoading(true);

        try {
            const response = await Axios.post(url);
            setBackupExecutionDate(response.data.BackupImportInfo.backupDetail.executionDate);
            setBackupExecutionResults(response.data.BackupImportInfo.backupDetail.successfulCompletion);
            setImportExecutionDate(response.data.BackupImportInfo.importDetail.executionDate);
            setImportExecutionResults(response.data.BackupImportInfo.importDetail.successfulCompletion);
            setIsLoading(false);
        } catch (error) {
            console.log(error);
            setIsLoading(false);
        }
    }

    const backupDB = async() => {
        const url = process.env.REACT_APP_Backend_URL + '/admin/adminTool/DatabaseBackup';
        setIsLoading(true);

        try {
            const response = await Axios.post(url);
            console.log(response.data.message);
            gatherBackupImportInfo(); // Refresh info after backup
        } catch (error) {
            console.log(error);
            setIsLoading(false);
        }
    }

    const importDB = async() => {
        const url = process.env.REACT_APP_Backend_URL + '/admin/adminTool/DatabaseImport';
        setIsLoading(true);

        try {
            const response = await Axios.post(url);
            console.log(response.data.message);
            gatherBackupImportInfo(); // Refresh info after import
        } catch (error) {
            console.log(error);
            setIsLoading(false);
        }
    }

    return (
        <>
            <Header />
            <div className='adminToolsManageDatabasePage_container'>
                <form className='adminToolsManageDatabase_form'>
                    {isLoading ?
                        <>
                            <h1>Loading...</h1>
                        </>
                        :
                        <>
                            <h1>Would you like to backup or import?</h1>
                            <h2>Import execution was {importExecutionResults}, as of {importExecutionDate}</h2>
                            <h2>Backup execution was {backupExecutionResults}, as of {backupExecutionDate}</h2>
                            <button className='adminToolsManageDatabaseButton' onClick={() => importDB()}>Import Database Table</button>
                            <button className='adminToolsManageDatabaseButton' onClick={() => backupDB()}>Backup Database Table</button>
                        </>
                    }
                </form>
            </div>
            <Footer />
        </>
    );
}

export default AdminToolsManageDatabase;