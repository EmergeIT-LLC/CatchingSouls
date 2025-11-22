import React, { useState, useEffect } from 'react';
import { Text, View, ScrollView, ActivityIndicator, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';
import VerificationCheck from '../functions/verificationCheck';
import PrimaryButton from '../components/PrimaryButton';
import { API } from '../config/constants';
import { commonStyles, tableStyles } from '../styles/screenStyles';
import { colors } from '../components/themes';

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
            style={tableStyles.row}
            onPress={() => accountDetail(account.accountUsername)}
        >
            <Text style={tableStyles.cell}>{account.accountUsername}</Text>
            <Text style={tableStyles.cell}>{account.accountFirstName} {account.accountLastName}</Text>
            <Text style={tableStyles.cell}>{account.accountEmail}</Text>
            <Text style={tableStyles.cell}>{account.accountRole}</Text>
        </Pressable>
    );

    return (
        <SafeAreaView style={commonStyles.container}>
            <ScrollView contentContainerStyle={commonStyles.scrollContent}>
                <PrimaryButton
                    title="Add Admin"
                    onPress={() => navigation.navigate('AdminToolsManageAccountAdd')}
                />
                {isLoading ? (
                    <ActivityIndicator size="large" color={colors.primary} />
                ) : (
                    <>
                        <View style={tableStyles.section}>
                            <Text style={tableStyles.sectionTitle}>Verified Accounts</Text>
                            <View style={tableStyles.table}>
                                <View style={tableStyles.headerRow}>
                                    <Text style={tableStyles.headerCell}>Username</Text>
                                    <Text style={tableStyles.headerCell}>Full Name</Text>
                                    <Text style={tableStyles.headerCell}>Email</Text>
                                    <Text style={tableStyles.headerCell}>Role</Text>
                                </View>
                                {verifiedAccounts.map(renderAccountRow)}
                            </View>
                        </View>

                        <View style={tableStyles.section}>
                            <Text style={tableStyles.sectionTitle}>Unverified Accounts</Text>
                            <View style={tableStyles.table}>
                                <View style={tableStyles.headerRow}>
                                    <Text style={tableStyles.headerCell}>Username</Text>
                                    <Text style={tableStyles.headerCell}>Full Name</Text>
                                    <Text style={tableStyles.headerCell}>Email</Text>
                                    <Text style={tableStyles.headerCell}>Role</Text>
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

export default AdminToolsManageAccount;
