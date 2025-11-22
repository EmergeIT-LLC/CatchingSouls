import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, ActivityIndicator } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';
import PrimaryButton from '../components/PrimaryButton';
import { API } from '../config/constants';
import { colors, spacing, radius } from '../components/themes';

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
        <SafeAreaView style={styles.container}>
            <View style={styles.form}>
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
                                            style={styles.logo}
                                        />
                                        <Text style={[styles.title, { color: 'green' }]}>Verified!</Text>
                                        <Text style={styles.text}>Your account has been verified.</Text>
                                        <Text style={styles.text}><Text style={styles.bold}>Select login</Text> to sign in!</Text>
                                        <PrimaryButton 
                                            title="Login" 
                                            onPress={() => navigation.navigate('Login')}
                                        />
                                    </>
                                ) : (
                                    <>
                                        <Text style={[styles.title, { color: colors.danger }]}>Not Verified!</Text>
                                        <Text style={styles.text}>Verification failed</Text>
                                        <Text style={styles.text}>Please try again later.</Text>
                                    </>
                                )}
                            </>
                        ) : (
                            <>
                                <Image 
                                    source={require('../assets/Images/Logo_Transparent.png')} 
                                    style={[styles.logo, { opacity: 0.5 }]}
                                />
                                <Text style={[styles.title, { color: colors.danger }]}>Not Verified!</Text>
                                <Text style={styles.text}>Your account is already verified</Text>
                                <Text style={styles.text}>or you never registered.</Text>
                                <Text style={styles.text}>
                                    Select <Text style={styles.bold}>login</Text> to sign back in!{'\n'}
                                    or{'\n'}
                                    Select <Text style={styles.bold}>Register</Text> to sign up!
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.bg,
        justifyContent: 'center',
        padding: spacing.lg,
    },
    form: {
        borderWidth: 4,
        borderColor: colors.primary,
        borderRadius: radius.lg,
        padding: spacing.lg,
        alignItems: 'center',
    },
    logo: {
        width: 200,
        height: 200,
        marginBottom: spacing.lg,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: spacing.md,
        textAlign: 'center',
    },
    text: {
        fontSize: 16,
        color: colors.text,
        textAlign: 'center',
        marginBottom: spacing.sm,
    },
    bold: {
        fontWeight: 'bold',
    },
});

export default AccountVerification;
