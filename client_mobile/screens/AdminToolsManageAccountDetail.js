import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';
import VerificationCheck from '../functions/verificationCheck';
import PrimaryButton from '../components/PrimaryButton';
import { API } from '../config/constants';
import { colors, spacing, radius } from '../components/themes';

const AdminToolsManageAccountDetail = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { selectedAdmin } = route.params || {};
    const [isLoading, setIsLoading] = useState(true);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [selectRole, setSelectRole] = useState('');
    const [showButtons, setShowButtons] = useState(true);
    const [currentUsername, setCurrentUsername] = useState('');

    useEffect(() => {
        const loadDetails = async () => {
            try {
                const userLoggedIn = await VerificationCheck.CheckUserLogin();
                const isAdmin = await VerificationCheck.GetAdminRole();
                const loggedInUser = await VerificationCheck.CheckUser();
                
                if (!userLoggedIn || !isAdmin) {
                    navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
                    return;
                }

                setCurrentUsername(loggedInUser);
                
                if (loggedInUser?.toLowerCase() === selectedAdmin?.toLowerCase()) {
                    setShowButtons(false);
                }

                await getSelectedAdminProps();
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };

        loadDetails();
    }, [navigation]);

    const getSelectedAdminProps = async () => {
        try {
            const url = `${API.BASE_URL}/admin/adminAccountDetail_retrieval`;
            const response = await axios.post(url, { SelectedAdmin: { selectedAdmin } });
            
            setFirstName(response.data.user.accountFirstName);
            setLastName(response.data.user.accountLastName);
            setEmail(response.data.user.accountEmail);
            setSelectRole(response.data.user.accountRole);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.form}>
                    {isLoading ? (
                        <ActivityIndicator size="large" color={colors.primary} />
                    ) : (
                        <>
                            <Text style={styles.title}>{firstName} {lastName}</Text>
                            <View style={styles.infoContainer}>
                                <View style={styles.infoRow}>
                                    <Text style={styles.label}>Username:</Text>
                                    <Text style={styles.value}>{selectedAdmin}</Text>
                                </View>
                                <View style={styles.infoRow}>
                                    <Text style={styles.label}>Email:</Text>
                                    <Text style={styles.value}>{email}</Text>
                                </View>
                                <View style={styles.infoRow}>
                                    <Text style={styles.label}>Role:</Text>
                                    <Text style={styles.value}>{selectRole}</Text>
                                </View>
                            </View>
                            {showButtons && (
                                <>
                                    <PrimaryButton
                                        title="Update Admin"
                                        onPress={() => navigation.navigate('AdminToolsManageAccountUpdate', { selectedAdmin })}
                                    />
                                    <PrimaryButton
                                        title="Delete Admin"
                                        onPress={() => navigation.navigate('AdminToolsManageAccountDelete', { selectedAdmin })}
                                        variant="outline"
                                    />
                                </>
                            )}
                            <PrimaryButton
                                title="Return to Accounts"
                                onPress={() => navigation.navigate('AdminToolsManageAccount')}
                                variant="ghost"
                            />
                        </>
                    )}
                </View>
            </ScrollView>
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
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: colors.text,
        marginBottom: spacing.lg,
        textAlign: 'center',
    },
    infoContainer: {
        width: '100%',
        marginBottom: spacing.lg,
    },
    infoRow: {
        marginBottom: spacing.md,
        paddingVertical: spacing.sm,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    label: {
        fontWeight: 'bold',
        fontSize: 16,
        color: colors.text,
        marginBottom: spacing.xs,
    },
    value: {
        fontSize: 16,
        color: colors.text,
    },
});

export default AdminToolsManageAccountDetail;
