import React, { useState, useEffect } from 'react';
import { Text, View, ScrollView, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';
import VerificationCheck from '../functions/verificationCheck';
import PrimaryButton from '../components/PrimaryButton';
import { API } from '../config/constants';
import { commonStyles, profileStyles } from '../styles/screenStyles';
import { colors } from '../components/themes';

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
        <SafeAreaView style={commonStyles.container}>
            <ScrollView contentContainerStyle={commonStyles.centeredScrollContent}>
                <View style={commonStyles.form}>
                    {isLoading ? (
                        <ActivityIndicator size="large" color={colors.primary} />
                    ) : (
                        <>
                            <Text style={commonStyles.title}>{firstName} {lastName}</Text>
                            <View style={profileStyles.infoContainer}>
                                <View style={profileStyles.infoRow}>
                                    <Text style={profileStyles.label}>Username:</Text>
                                    <Text style={profileStyles.value}>{selectedAdmin}</Text>
                                </View>
                                <View style={profileStyles.infoRow}>
                                    <Text style={profileStyles.label}>Email:</Text>
                                    <Text style={profileStyles.value}>{email}</Text>
                                </View>
                                <View style={profileStyles.infoRow}>
                                    <Text style={profileStyles.label}>Role:</Text>
                                    <Text style={profileStyles.value}>{selectRole}</Text>
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

export default AdminToolsManageAccountDetail;
