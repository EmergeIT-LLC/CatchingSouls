import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import VerificationCheck from '../functions/verificationCheck';
import PrimaryButton from '../components/PrimaryButton';
import { API } from '../config/constants';
import { colors, spacing, radius } from '../components/themes';

const ProfileDelete = () => {
    const navigation = useNavigation();
    const [isLoading, setIsLoading] = useState(true);
    const [username, setUsername] = useState(null);
    const [firstName, setFirstName] = useState('');
    const [statusMessage, setStatusMessage] = useState(null);

    useEffect(() => {
        const loadProfile = async () => {
            try {
                const userLoggedIn = await VerificationCheck.CheckUserLogin();
                if (!userLoggedIn) {
                    navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
                    return;
                }

                const loggedInUser = await VerificationCheck.CheckUser();
                const isAdmin = await VerificationCheck.GetAdminRole();
                
                if (isAdmin) {
                    navigation.navigate('Profile');
                    return;
                }

                const userData = await VerificationCheck.GetUserProps();
                if (userData && userData.data) {
                    setUsername(userData.data.user.accountUsername);
                    setFirstName(userData.data.user.accountFirstName);
                }
            } catch (error) {
                console.error('Error loading profile:', error);
                navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
            } finally {
                setIsLoading(false);
            }
        };

        loadProfile();
    }, [navigation]);

    const deleteUserProps = async () => {
        Alert.alert(
            "Confirm Delete",
            "Are you sure you want to delete your account? This action cannot be undone.",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            setIsLoading(true);
                            const url = `${API.BASE_URL}/user/account_Delete`;
                            
                            const response = await axios.post(url, { username });
                            
                            if (response.data.message) {
                                setStatusMessage(response.data.message);
                                setIsLoading(false);
                            } else if (response.data.deleteStatus === "Successful") {
                                await AsyncStorage.clear();
                                navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
                            } else if (response.data.deleteStatus === "Unsuccessful") {
                                setStatusMessage("Deletion failed");
                                setIsLoading(false);
                            }
                        } catch (error) {
                            console.error(error);
                            setStatusMessage(error.response?.data?.message || 'An error occurred');
                            setIsLoading(false);
                        }
                    }
                }
            ]
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.form}>
                {isLoading ? (
                    <ActivityIndicator size="large" color={colors.primary} />
                ) : (
                    <>
                        <Text style={styles.title}>Delete Profile</Text>
                        <Text style={styles.message}>
                            <Text style={styles.bold}>{firstName}</Text>, are you sure you want to delete your account?
                        </Text>
                        <PrimaryButton 
                            title="Yes, Delete My Account" 
                            onPress={deleteUserProps}
                            variant="primary"
                        />
                        <PrimaryButton 
                            title="No, Keep My Account" 
                            onPress={() => navigation.navigate('Profile')}
                            variant="outline"
                        />
                        {statusMessage && <Text style={styles.status}>{statusMessage}</Text>}
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
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: colors.text,
        marginBottom: spacing.lg,
        textAlign: 'center',
    },
    message: {
        fontSize: 16,
        color: colors.text,
        textAlign: 'center',
        marginBottom: spacing.lg,
    },
    bold: {
        fontWeight: 'bold',
    },
    status: {
        marginTop: spacing.md,
        color: colors.danger,
        textAlign: 'center',
    },
});

export default ProfileDelete;
