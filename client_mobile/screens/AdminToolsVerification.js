import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';
import TextField from '../components/TextField';
import PrimaryButton from '../components/PrimaryButton';
import entryCheck from '../functions/entryCheck';
import { API } from '../config/constants';
import { colors, spacing, radius } from '../components/themes';

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
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <ScrollView contentContainerStyle={styles.scrollContent}>
                        <View style={styles.form}>
                            {foundAdminAccount ? (
                                <>
                                    <Image 
                                        source={require('../assets/Images/Logo_Transparent.png')} 
                                        style={styles.logo}
                                    />
                                    <Text style={styles.title}>Hello {firstName} {lastName},</Text>
                                    <Text style={styles.text}>Please enter a password to verify your account.</Text>
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
                                        style={[styles.logo, { opacity: 0.5 }]}
                                    />
                                    <Text style={[styles.title, { color: colors.danger }]}>Not Verified!</Text>
                                    <Text style={styles.text}>Your account is already verified</Text>
                                    <Text style={styles.text}>or</Text>
                                    <Text style={styles.text}>You are not a registered admin.</Text>
                                    <Text style={styles.text}>
                                        Contact an admin by emailing{'\n'}
                                        CatchingSoulsTrivia@Outlook.com
                                    </Text>
                                </>
                            )}
                            {!isLoading && statusMessage && (
                                <Text style={styles.status}>{statusMessage}</Text>
                            )}
                        </View>
                    </ScrollView>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.bg,
    },
    scrollContent: {
        flexGrow: 1,
        padding: spacing.lg,
        justifyContent: 'center',
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
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.text,
        marginBottom: spacing.md,
        textAlign: 'center',
    },
    text: {
        fontSize: 16,
        color: colors.text,
        textAlign: 'center',
        marginBottom: spacing.sm,
    },
    status: {
        marginTop: spacing.md,
        color: colors.danger,
        textAlign: 'center',
    },
});

export default AdminToolsVerification;
