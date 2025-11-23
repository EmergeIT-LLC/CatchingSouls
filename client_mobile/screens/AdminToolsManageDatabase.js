import React, { useState, useEffect } from 'react';
import { Text, View, ScrollView, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';
import VerificationCheck from '../functions/verificationCheck';
import PrimaryButton from '../components/PrimaryButton';
import { API } from '../config/constants';
import { commonStyles } from '../styles/screenStyles';
import { colors } from '../components/themes';

const AdminToolsManageDatabase = () => {
    const navigation = useNavigation();
    const [isLoading, setIsLoading] = useState(true);
    const [backupExecutionDate, setBackupExecutionDate] = useState('');
    const [backupExecutionResults, setBackupExecutionResults] = useState('');
    const [importExecutionDate, setImportExecutionDate] = useState('');
    const [importExecutionResults, setImportExecutionResults] = useState('');

    useEffect(() => {
        const loadDatabaseInfo = async () => {
            try {
                const userLoggedIn = await VerificationCheck.CheckUserLogin();
                const isAdmin = await VerificationCheck.GetAdminRole();
                
                console.log('AdminToolsManageDatabase - User logged in:', userLoggedIn, 'Is admin:', isAdmin);
                
                if (!userLoggedIn) {
                    navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
                    return;
                }
                
                if (!isAdmin) {
                    navigation.navigate('Dashboard');
                    return;
                }

                await gatherBackupImportInfo();
            } catch (error) {
                console.error('AdminToolsManageDatabase error:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadDatabaseInfo();
    }, [navigation]);

    const gatherBackupImportInfo = async () => {
        try {
            const url = `${API.BASE_URL}/admin/adminTool/BackupImportInfo`;
            const response = await axios.post(url);
            
            setBackupExecutionDate(response.data.BackupImportInfo.backupDetail.executionDate);
            setBackupExecutionResults(response.data.BackupImportInfo.backupDetail.successfulCompletion);
            setImportExecutionDate(response.data.BackupImportInfo.importDetail.executionDate);
            setImportExecutionResults(response.data.BackupImportInfo.importDetail.successfulCompletion);
        } catch (error) {
            console.error(error);
        }
    };

    const backupDB = async () => {
        try {
            setIsLoading(true);
            const url = `${API.BASE_URL}/admin/adminTool/DatabaseBackup`;
            await axios.post(url);
            await gatherBackupImportInfo();
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const importDB = async () => {
        try {
            setIsLoading(true);
            const url = `${API.BASE_URL}/admin/adminTool/DatabaseImport`;
            await axios.post(url);
            await gatherBackupImportInfo();
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
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
                            <Text style={commonStyles.title24}>Database Management</Text>
                            <Text style={commonStyles.subtitle}>
                                Import execution was {importExecutionResults}, as of {importExecutionDate}
                            </Text>
                            <Text style={commonStyles.subtitle}>
                                Backup execution was {backupExecutionResults}, as of {backupExecutionDate}
                            </Text>
                            <PrimaryButton
                                title="Import Database Table"
                                onPress={importDB}
                            />
                            <PrimaryButton
                                title="Backup Database Table"
                                onPress={backupDB}
                            />
                        </>
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default AdminToolsManageDatabase;
