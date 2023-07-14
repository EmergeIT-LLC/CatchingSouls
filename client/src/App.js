import React from 'react';
import './App.css';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
//Basics
import Login from './Pages/Login/Login';
import Logout from './Pages/Logout/Logout';
import Register from './Pages/Register/Register';
import AccountVerification from './Pages/AccountVerification/AccountVerification';
import Profile from './Pages/Profile/Profile';
import ProfileUpdate from './Pages/ProfileUpdate/ProfileUpdate';
import ProfileDelete from './Pages/ProfileDelete/ProfileDelete';
import Recovery from './Pages/Recovery/Recovery';
import RecoveryConfirmation from './Pages/RecoveryConfirmation/RecoveryConfirmation';
import Dashboard from './Pages/Dashboard/Dashboard';
import About from './Pages/About/About';
import Contact from './Pages/Contact/Contact';
import PageNotFound from './Pages/PageNotFound/PageNotFound';
//Admin
import AdminTools from './Pages/AdminTools/AdminTools';
import AdminToolsVerification from './Pages/AdminToolsVerification/AdminToolsVerification';
import AdminToolsManageAccount from './Pages/AdminToolsManageAccount/AdminToolsManageAccount';
import AdminToolsManageAccountAdd from './Pages/AdminToolsManageAccountAdd/AdminToolsManageAccountAdd';
import AdminToolsManageAccountDelete from './Pages/AdminToolsManageAccountDelete/AdminToolsManageAccountDelete';
import AdminToolsManageAccountDetail from './Pages/AdminToolsManageAccountDetail/AdminToolsManageAccountDetail';
import AdminToolsManageAccountUpdate from './Pages/AdminToolsManageAccountUpdate/AdminToolsManageAccountUpdate';
import AdminToolsManageTrivia from './Pages/AdminToolsManageTrivia/AdminToolsManageTrivia';
import AdminToolsManageTriviaAdd from './Pages/AdminToolsManageTriviaAdd/AdminToolsManageTriviaAdd';
import AdminToolsManageTriviaDelete from './Pages/AdminToolsManageTriviaDelete/AdminToolsManageTriviaDelete';
import AdminToolsManageTriviaDetail from './Pages/AdminToolsManageTriviaDetail/AdminToolsManageTriviaDetail';
import AdminToolsManageTriviaUpdate from './Pages/AdminToolsManageTriviaUpdate/AdminToolsManageTriviaUpdate';
//Game Page
import LevelChoice from './Pages/LevelChoice/LevelChoice';
import LevelChoiceSelected from './Pages/LevelChoiceSelected/LevelChoiceSelected';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route exact path='/' element={<Dashboard/>} />;
          <Route exact path='/Register' element={<Register/>} />;
          <Route exact path='/Login' element={<Login/>} />;
          <Route exact path='/Logout' element={<Logout/>} />;
          <Route exact path='/AboutCatchingSouls' element={<About/>} />;
          <Route exact path='/ContactCatchingSouls' element={<Contact/>} />;
          <Route exact path='/AccountVerification/:AccountUsername' element={<AccountVerification/>} />;
          <Route exact path='/Profile/:AccountUsername' element={<Profile/>} />;
          <Route exact path='/Profile/:AccountUsername/Delete' element={<ProfileDelete/>} />;
          <Route exact path='/Profile/:AccountUsername/Update' element={<ProfileUpdate/>} />;
          <Route exact path='/ForgotPassword' element={<Recovery/>} />;
          <Route exact path='/ForgotPasswordVerification/:AccountUsername' element={<RecoveryConfirmation/>} />;
          <Route exact path='/LevelChoice' element={<LevelChoice/>} />;
          <Route exact path='/LevelChoice/:SelectedLevel' element={<LevelChoiceSelected/>} />;
          <Route exact path='/:AccountUsername/AdminTools' element={<AdminTools/>} />;
          <Route exact path='/:AccountUsername/AdminTools/ManageAdminAccounts' element={<AdminToolsManageAccount/>} />;
          <Route exact path='/:AccountUsername/AdminTools/ManageAdminAccounts/Verification' element={<AdminToolsVerification/>} />;
          <Route exact path='/:AccountUsername/AdminTools/ManageAdminAccounts/AddAdmin' element={<AdminToolsManageAccountAdd/>} />;
          <Route exact path='/:AccountUsername/AdminTools/ManageAdminAccounts/:SelectedAdmin/Delete' element={<AdminToolsManageAccountDelete/>} />;
          <Route exact path='/:AccountUsername/AdminTools/ManageAdminAccounts/:SelectedAdmin/Detail' element={<AdminToolsManageAccountDetail/>} />;
          <Route exact path='/:AccountUsername/AdminTools/ManageAdminAccounts/:SelectedAdmin/Update' element={<AdminToolsManageAccountUpdate/>} />;
          <Route exact path='/:AccountUsername/AdminTools/ManageTriviaQuestions' element={<AdminToolsManageTrivia/>} />;
          <Route exact path='/:AccountUsername/AdminTools/ManageTriviaQuestions/AddQuestion' element={<AdminToolsManageTriviaAdd/>} />;
          <Route exact path='/:AccountUsername/AdminTools/ManageTriviaQuestions/:QuestionID/Delete' element={<AdminToolsManageTriviaDelete/>} />;
          <Route exact path='/:AccountUsername/AdminTools/ManageTriviaQuestions/:QuestionID/Detail' element={<AdminToolsManageTriviaDetail/>} />;
          <Route exact path='/:AccountUsername/AdminTools/ManageTriviaQuestions/:QuestionID/Update' element={<AdminToolsManageTriviaUpdate/>} />;
          <Route exact path='/*' element={<PageNotFound/>} />;
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;