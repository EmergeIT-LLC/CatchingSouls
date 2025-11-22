import React, { useEffect } from 'react';
import { Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import VerificationCheck from '../functions/verificationCheck';
import PrimaryButton from '../components/PrimaryButton';
import { adminStyles } from '../styles/screenStyles';

const AdminTools = () => {
    const navigation = useNavigation();

    useEffect(() => {
        const checkAccess = async () => {
            const userLoggedIn = await VerificationCheck.CheckUserLogin();
            const isAdmin = await VerificationCheck.GetAdminRole();
            
            if (!userLoggedIn) {
                navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
                return;
            }
            
            if (!isAdmin) {
                navigation.navigate('Dashboard');
            }
        };

        checkAccess();
    }, [navigation]);

    return (
        <SafeAreaView style={adminStyles.container}>
            <View style={adminStyles.form}>
                <Text style={adminStyles.title}>Pick A Tool</Text>
                <PrimaryButton 
                    title="Manage Admin Accounts" 
                    onPress={() => navigation.navigate('AdminToolsManageAccount')}
                />
                <PrimaryButton 
                    title="Manage Trivia Questions" 
                    onPress={() => navigation.navigate('AdminToolsManageTrivia')}
                />
                <PrimaryButton 
                    title="Manage Database" 
                    onPress={() => navigation.navigate('AdminToolsManageDatabase')}
                />
            </View>
        </SafeAreaView>
    );
};

export default AdminTools;
