import React, { useState, useEffect } from 'react';
import { Text, View, Image, ActivityIndicator } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';
import PrimaryButton from '../components/PrimaryButton';
import { API } from '../config/constants';
import { commonStyles, imageStyles } from '../styles/screenStyles';
import { colors } from '../components/themes';

const AccountVerification = () => {
    const route = useRoute();
    const navigation = useNavigation();
    const { accountUsername } = route.params || {};
    const [isLoading, setIsLoading] = useState(true);
    const [foundAccount, setFoundAccount] = useState(false);
    const [verified, setVerified] = useState(false);

    useEffect(() => {
        locateUnverifiedAccount();
    }, []);

    const locateUnverifiedAccount = async () => {
        try {
            const url = `${API.BASE_URL}/user/verificationInfo`;
            const response = await axios.post(url, { AccountUsername: { accountUsername } });
            
            if (response.data.foundAccount) {
                setFoundAccount(true);
                verifyUserAccount();
            }
        } catch (error) {
            console.error(error);
            setFoundAccount(false);
        } finally {
            setIsLoading(false);
        }
    };

    const verifyUserAccount = async () => {
        try {
            const url = `${API.BASE_URL}/user/verifyUser`;
            const response = await axios.post(url, { AccountUsername: { accountUsername } });
            
            if (response.data.verified) {
                setVerified(true);
            }
        } catch (error) {
            console.error(error);
            setVerified(false);
        }
    };

    return (
        <SafeAreaView style={commonStyles.container}>
            <View style={commonStyles.form}>
                {isLoading ? (
                    <ActivityIndicator size="large" color={colors.primary} />
                ) : (
                    <>
                        {foundAccount ? (
                            <>
                                {verified ? (
                                    <>
                                        <Image 
                                            source={require('../assets/Images/Logo_Transparent.png')} 
                                            style={imageStyles.logo}
                                        />
                                        <Text style={[commonStyles.title, { color: 'green' }]}>Verified!</Text>
                                        <Text style={commonStyles.text}>Your account has been verified.</Text>
                                        <Text style={commonStyles.text}><Text style={commonStyles.bold}>Select login</Text> to sign in!</Text>
                                        <PrimaryButton 
                                            title="Login" 
                                            onPress={() => navigation.navigate('Login')}
                                        />
                                    </>
                                ) : (
                                    <>
                                        <Text style={[commonStyles.title, { color: colors.danger }]}>Not Verified!</Text>
                                        <Text style={commonStyles.text}>Verification failed</Text>
                                        <Text style={commonStyles.text}>Please try again later.</Text>
                                    </>
                                )}
                            </>
                        ) : (
                            <>
                                <Image 
                                    source={require('../assets/Images/Logo_Transparent.png')} 
                                    style={imageStyles.logoGreyedOut}
                                />
                                <Text style={[commonStyles.title, { color: colors.danger }]}>Not Verified!</Text>
                                <Text style={commonStyles.text}>Your account is already verified</Text>
                                <Text style={commonStyles.text}>or you never registered.</Text>
                                <Text style={commonStyles.text}>
                                    Select <Text style={commonStyles.bold}>login</Text> to sign back in!{'\n'}
                                    or{'\n'}
                                    Select <Text style={commonStyles.bold}>Register</Text> to sign up!
                                </Text>
                                <PrimaryButton 
                                    title="Login" 
                                    onPress={() => navigation.navigate('Login')}
                                />
                                <PrimaryButton 
                                    title="Register" 
                                    onPress={() => navigation.navigate('Register')}
                                    variant="outline"
                                />
                            </>
                        )}
                    </>
                )}
            </View>
        </SafeAreaView>
    );
};

export default AccountVerification;
