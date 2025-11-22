import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, ActivityIndicator, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';
import VerificationCheck from '../functions/verificationCheck';
import PrimaryButton from '../components/PrimaryButton';
import { API } from '../config/constants';
import { colors, spacing, radius } from '../components/themes';

const AdminToolsManageAccount = () => {
    const navigation = useNavigation();
    const [isLoading, setIsLoading] = useState(true);
    const [verifiedAccounts, setVerifiedAccounts] = useState([]);
    const [unverifiedAccounts, setUnverifiedAccounts] = useState([]);

    useEffect(() => {
        const loadAccounts = async () => {
            try {
                const userLoggedIn = await VerificationCheck.CheckUserLogin();
                const isAdmin = await VerificationCheck.GetAdminRole();
                
                if (!userLoggedIn || !isAdmin) {
                    navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
                    return;
                }

                await getVerifiedListProps();
                await getUnverifiedListProps();
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };

        loadAccounts();
    }, [navigation]);

    const getVerifiedListProps = async () => {
        try {
            const url = `${API.BASE_URL}/admin/account_retrieval`;
            const response = await axios.post(url);
            setVerifiedAccounts(response.data || []);
        } catch (error) {
            console.error(error);
        }
    };

    const getUnverifiedListProps = async () => {
        try {
            const url = `${API.BASE_URL}/admin/account_unverifiedRetrieval`;
            const response = await axios.post(url);
            setUnverifiedAccounts(response.data || []);
        } catch (error) {
            console.error(error);
        }
    };

    const accountDetail = (selectedAdmin) => {
        navigation.navigate('AdminToolsManageAccountDetail', { selectedAdmin });
    };

    const renderAccountRow = (account) => (
        <Pressable
            key={account.accountUsername}
            style={styles.row}
            onPress={() => accountDetail(account.accountUsername)}
        >
            <Text style={styles.cell}>{account.accountUsername}</Text>
            <Text style={styles.cell}>{account.accountFirstName} {account.accountLastName}</Text>
            <Text style={styles.cell}>{account.accountEmail}</Text>
            <Text style={styles.cell}>{account.accountRole}</Text>
        </Pressable>
    );

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <PrimaryButton
                    title="Add Admin"
                    onPress={() => navigation.navigate('AdminToolsManageAccountAdd')}
                />
                {isLoading ? (
                    <ActivityIndicator size="large" color={colors.primary} />
                ) : (
                    <>
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Verified Accounts</Text>
                            <View style={styles.table}>
                                <View style={styles.headerRow}>
                                    <Text style={styles.headerCell}>Username</Text>
                                    <Text style={styles.headerCell}>Full Name</Text>
                                    <Text style={styles.headerCell}>Email</Text>
                                    <Text style={styles.headerCell}>Role</Text>
                                </View>
                                {verifiedAccounts.map(renderAccountRow)}
                            </View>
                        </View>

                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Unverified Accounts</Text>
                            <View style={styles.table}>
                                <View style={styles.headerRow}>
                                    <Text style={styles.headerCell}>Username</Text>
                                    <Text style={styles.headerCell}>Full Name</Text>
                                    <Text style={styles.headerCell}>Email</Text>
                                    <Text style={styles.headerCell}>Role</Text>
                                </View>
                                {unverifiedAccounts.map(renderAccountRow)}
                            </View>
                        </View>
                    </>
                )}
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
        padding: spacing.lg,
    },
    section: {
        marginTop: spacing.xl,
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.text,
        marginBottom: spacing.md,
        textAlign: 'center',
    },
    table: {
        borderWidth: 2,
        borderColor: colors.primary,
        borderRadius: radius.sm,
        overflow: 'hidden',
    },
    headerRow: {
        flexDirection: 'row',
        backgroundColor: colors.primary,
        padding: spacing.sm,
    },
    headerCell: {
        flex: 1,
        fontWeight: 'bold',
        color: colors.bg,
        fontSize: 12,
    },
    row: {
        flexDirection: 'row',
        padding: spacing.sm,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    cell: {
        flex: 1,
        fontSize: 12,
        color: colors.text,
    },
});

export default AdminToolsManageAccount;
