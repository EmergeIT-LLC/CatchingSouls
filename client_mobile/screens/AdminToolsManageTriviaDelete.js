import React, { useState, useEffect } from 'react';
import { Text, View, Alert, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';
import VerificationCheck from '../functions/verificationCheck';
import PrimaryButton from '../components/PrimaryButton';
import { API } from '../config/constants';
import { commonStyles, adminStyles } from '../styles/screenStyles';

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
        <SafeAreaView style={commonStyles.container}>
            <View style={commonStyles.form}>
                {isLoading ? (
                    <ActivityIndicator size="large" color={colors.primary} />
                ) : (
                    <>
                        <Text style={commonStyles.title}>Delete Question</Text>
                        <Text style={commonStyles.text}>
                            You sure you want to delete Question ID <Text style={{fontWeight: 'bold'}}>{questionID}</Text>?
                        </Text>
                        <Text style={commonStyles.label}>Question:</Text>
                        <Text style={commonStyles.text}>{question}</Text>
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
                        {statusMessage && <Text style={commonStyles.status}>{statusMessage}</Text>}
                    </>
                )}
            </View>
        </SafeAreaView>
    );
};

export default AdminToolsManageTriviaDelete;
