import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';
import TextField from '../components/TextField';
import PrimaryButton from '../components/PrimaryButton';
import VerificationCheck from '../functions/verificationCheck';
import entryCheck from '../functions/entryCheck';
import { API } from '../config/constants';
import { colors, spacing, radius } from '../components/themes';

const AdminToolsManageAccountUpdate = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { selectedAdmin } = route.params || {};
    const [isLoading, setIsLoading] = useState(true);
    const [username, setUsername] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [confirmEmail, setConfirmEmail] = useState('');
    const [selectRole, setSelectRole] = useState('');
    const [statusMessage, setStatusMessage] = useState('');

    useEffect(() => {
        const loadAdmin = async () => {
            try {
                const userLoggedIn = await VerificationCheck.CheckUserLogin();
                const isAdmin = await VerificationCheck.GetAdminRole();
                
                if (!userLoggedIn || !isAdmin) {
                    navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
                    return;
                }

                await getSelectedAdminProps();
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };

        loadAdmin();
    }, [navigation]);

    const getSelectedAdminProps = async () => {
        try {
            const url = `${API.BASE_URL}/admin/adminAccountDetail_retrieval`;
            const response = await axios.post(url, { SelectedAdmin: { selectedAdmin } });
            
            setUsername(response.data.user.accountUsername);
            setFirstName(response.data.user.accountFirstName);
            setLastName(response.data.user.accountLastName);
            setEmail(response.data.user.accountEmail);
            setConfirmEmail(response.data.user.accountEmail);
            setSelectRole(response.data.user.accountRole);
        } catch (error) {
            console.error(error);
        }
    };

    const submitUpdateForm = async () => {
        if (email !== confirmEmail) {
            return setStatusMessage('Email and confirm email does not match!');
        }
        if (!entryCheck.CheckEmail(email)) {
            return setStatusMessage('Email Is Not Acceptable');
        }

        try {
            setIsLoading(true);
            const url = `${API.BASE_URL}/admin/account_Update`;
            
            const response = await axios.post(url, {
                username,
                firstName,
                lastName,
                email,
                role: selectRole
            });
            
            if (response.data.updateStatus === 'Successful') {
                navigation.navigate('AdminToolsManageAccountDetail', { selectedAdmin });
            } else {
                setStatusMessage('Update failed!');
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
                            <Text style={styles.title}>Update Admin Account</Text>
                            <TextField
                                label="Username"
                                value={username}
                                editable={false}
                                inputStyle={{ backgroundColor: '#f0f0f0' }}
                            />
                            <TextField
                                label="First Name"
                                placeholder="First Name"
                                value={firstName}
                                onChangeText={setFirstName}
                            />
                            <TextField
                                label="Last Name"
                                placeholder="Last Name"
                                value={lastName}
                                onChangeText={setLastName}
                            />
                            <TextField
                                label="Email Address"
                                placeholder="Email Address"
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                            />
                            <TextField
                                label="Confirm Email Address"
                                placeholder="Confirm Email Address"
                                value={confirmEmail}
                                onChangeText={setConfirmEmail}
                                keyboardType="email-address"
                            />
                            <PrimaryButton
                                title="Update"
                                onPress={submitUpdateForm}
                                loading={isLoading}
                            />
                            {!isLoading && (
                                <PrimaryButton
                                    title="Cancel"
                                    onPress={() => navigation.navigate('AdminToolsManageAccountDetail', { selectedAdmin })}
                                    variant="ghost"
                                />
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
    },
    form: {
        borderWidth: 4,
        borderColor: colors.primary,
        borderRadius: radius.lg,
        padding: spacing.lg,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.text,
        marginBottom: spacing.lg,
        textAlign: 'center',
    },
    status: {
        marginTop: spacing.md,
        color: colors.danger,
        textAlign: 'center',
    },
});

export default AdminToolsManageAccountUpdate;
