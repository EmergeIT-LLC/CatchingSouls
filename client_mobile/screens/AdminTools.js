import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import VerificationCheck from '../functions/verificationCheck';
import PrimaryButton from '../components/PrimaryButton';
import { colors, spacing, radius } from '../components/themes';

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
        <SafeAreaView style={styles.container}>
            <View style={styles.form}>
                <Text style={styles.title}>Pick A Tool</Text>
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
        padding: spacing.xl,
        alignItems: 'center',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: colors.text,
        marginBottom: spacing.xl,
        textAlign: 'center',
    },
});

export default AdminTools;
