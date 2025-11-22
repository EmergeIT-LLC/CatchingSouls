import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, ActivityIndicator, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';
import VerificationCheck from '../functions/verificationCheck';
import PrimaryButton from '../components/PrimaryButton';
import { API } from '../config/constants';
import { colors, spacing, radius } from '../components/themes';

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
                
                if (!userLoggedIn || !isAdmin) {
                    navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
                    return;
                }

                await gatherBackupImportInfo();
            } catch (error) {
                console.error(error);
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
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.form}>
                    {isLoading ? (
                        <ActivityIndicator size="large" color={colors.primary} />
                    ) : (
                        <>
                            <Text style={styles.title}>Database Management</Text>
                            <Text style={styles.subtitle}>
                                Import execution was {importExecutionResults}, as of {importExecutionDate}
                            </Text>
                            <Text style={styles.subtitle}>
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
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.text,
        marginBottom: spacing.lg,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 14,
        color: colors.text,
        textAlign: 'center',
        marginBottom: spacing.md,
    },
});

export default AdminToolsManageDatabase;
