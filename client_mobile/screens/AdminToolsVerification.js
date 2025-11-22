import React, { useState, useEffect } from 'react';
import { Text, View, Image, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';
import TextField from '../components/TextField';
import PrimaryButton from '../components/PrimaryButton';
import entryCheck from '../functions/entryCheck';
import { API } from '../config/constants';
import { commonStyles, imageStyles } from '../styles/screenStyles';
import { colors } from '../components/themes';

const AdminToolsVerification = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { accountUsername } = route.params || {};
    const [foundAdminAccount, setFoundAdminAccount] = useState(false);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [statusMessage, setStatusMessage] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');

    useEffect(() => {
        locateUnverifiedAccount();
    }, []);

    const locateUnverifiedAccount = async () => {
        try {
            const url = `${API.BASE_URL}/admin/adminTool/UnverifiedInfo`;
            const response = await axios.post(url, { AccountUsername: { accountUsername } });
            
            setFoundAdminAccount(response.data.foundAdminAccount);
            if (response.data.foundAdminAccount) {
                setFirstName(response.data.user?.accountFirstName || '');
                setLastName(response.data.user?.accountLastName || '');
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const submitForm = async () => {
        if (!password || !confirmPassword) {
            return setStatusMessage('All fields with "*" must be filled in!');
        }
        if (password !== confirmPassword) {
            return setStatusMessage('Password and confirm password does not match!');
        }
        if (!entryCheck.CheckPassword(password)) {
            return setStatusMessage('Password Is Not Acceptable');
        }

        try {
            setIsLoading(true);
            const url = `${API.BASE_URL}/admin/adminTool/Verification`;
            
            const response = await axios.post(url, {
                AccountUsername: { accountUsername },
                password
            });
            
            if (response.data.VerificationStatus === 'Successful') {
                navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
            } else {
                setStatusMessage(response.data.message || 'Verification failed!');
            }
        } catch (error) {
            setStatusMessage(error.response?.data?.message || 'An error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <SafeAreaView style={commonStyles.container}>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <ScrollView contentContainerStyle={commonStyles.centeredScrollContent}>
                        <View style={commonStyles.form}>
                            {foundAdminAccount ? (
                                <>
                                    <Image 
                                        source={require('../assets/Images/Logo_Transparent.png')} 
                                        style={imageStyles.logo}
                                    />
                                    <Text style={commonStyles.title24}>Hello {firstName} {lastName},</Text>
                                    <Text style={commonStyles.text}>Please enter a password to verify your account.</Text>
                                    <TextField
                                        label="Password *"
                                        placeholder="Enter A Password"
                                        value={password}
                                        onChangeText={setPassword}
                                        secureTextEntry
                                    />
                                    <TextField
                                        label="Confirm Password *"
                                        placeholder="Confirm Password"
                                        value={confirmPassword}
                                        onChangeText={setConfirmPassword}
                                        secureTextEntry
                                    />
                                    <PrimaryButton
                                        title="Register"
                                        onPress={submitForm}
                                        loading={isLoading}
                                    />
                                </>
                            ) : (
                                <>
                                    <Image 
                                        source={require('../assets/Images/Logo_Transparent.png')} 
                                        style={imageStyles.logoGreyedOut}
                                    />
                                    <Text style={[commonStyles.title24, { color: colors.danger }]}>Not Verified!</Text>
                                    <Text style={commonStyles.text}>Your account is already verified</Text>
                                    <Text style={commonStyles.text}>or</Text>
                                    <Text style={commonStyles.text}>You are not a registered admin.</Text>
                                    <Text style={commonStyles.text}>
                                        Contact an admin by emailing{'\n'}
                                        CatchingSoulsTrivia@Outlook.com
                                    </Text>
                                </>
                            )}
                            {!isLoading && statusMessage && (
                                <Text style={commonStyles.status}>{statusMessage}</Text>
                            )}
                        </View>
                    </ScrollView>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default AdminToolsVerification;
