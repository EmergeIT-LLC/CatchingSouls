import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Alert, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';
import VerificationCheck from '../functions/verificationCheck';
import PrimaryButton from '../components/PrimaryButton';
import { API } from '../config/constants';
import { colors, spacing, radius } from '../components/themes';

const AdminToolsManageTriviaDelete = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { questionID } = route.params || {};
    const [question, setQuestion] = useState('');
    const [statusMessage, setStatusMessage] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadQuestion = async () => {
            try {
                const userLoggedIn = await VerificationCheck.CheckUserLogin();
                const isAdmin = await VerificationCheck.GetAdminRole();
                
                if (!userLoggedIn || !isAdmin) {
                    navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
                    return;
                }

                await getTriviaProps();
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };

        loadQuestion();
    }, [navigation]);

    const getTriviaProps = async () => {
        try {
            const url = `${API.BASE_URL}/admin/adminTool/TriviaDetailRetrieval`;
            const response = await axios.post(url, { QuestionID: { questionID } });
            setQuestion(response.data.triviaquestions);
        } catch (error) {
            console.error(error);
        }
    };

    const submitForm = () => {
        Alert.alert(
            "Confirm Delete",
            `Are you sure you want to delete Question ID ${questionID}?`,
            [
                { text: "No", style: "cancel" },
                {
                    text: "Yes, Delete",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            setIsLoading(true);
                            const url = `${API.BASE_URL}/admin/adminTool/TriviaDelete`;
                            
                            const response = await axios.post(url, { questionID });
                            
                            if (response.data.deleteStatus === 'Successful') {
                                navigation.navigate('AdminToolsManageTrivia');
                            } else {
                                setStatusMessage(response.data.message || 'Deletion failed');
                            }
                        } catch (error) {
                            setStatusMessage(error.response?.data?.message || 'An error occurred');
                        } finally {
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
                        <Text style={styles.title}>Delete Question</Text>
                        <Text style={styles.message}>
                            You sure you want to delete Question ID <Text style={styles.bold}>{questionID}</Text>?
                        </Text>
                        <Text style={styles.label}>Question:</Text>
                        <Text style={styles.questionText}>{question}</Text>
                        <PrimaryButton
                            title="Yes, Delete"
                            onPress={submitForm}
                        />
                        <PrimaryButton
                            title="No, Go Back"
                            onPress={() => navigation.navigate('AdminToolsManageTriviaDetail', { questionID })}
                            variant="outline"
                        />
                        <PrimaryButton
                            title="Return to Questions"
                            onPress={() => navigation.navigate('AdminToolsManageTrivia')}
                            variant="ghost"
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
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.text,
        marginBottom: spacing.lg,
        textAlign: 'center',
    },
    message: {
        fontSize: 16,
        color: colors.text,
        textAlign: 'center',
        marginBottom: spacing.md,
    },
    bold: {
        fontWeight: 'bold',
    },
    label: {
        fontWeight: 'bold',
        fontSize: 16,
        color: colors.text,
        marginTop: spacing.md,
        marginBottom: spacing.xs,
    },
    questionText: {
        fontSize: 14,
        color: colors.text,
        textAlign: 'center',
        marginBottom: spacing.lg,
        paddingHorizontal: spacing.md,
    },
    status: {
        marginTop: spacing.md,
        color: colors.danger,
        textAlign: 'center',
    },
});

export default AdminToolsManageTriviaDelete;
