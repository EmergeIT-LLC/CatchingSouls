import React, { useState, useEffect } from 'react';
import { Text, View, ScrollView, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';
import TextField from '../components/TextField';
import SelectField from '../components/SelectField';
import PrimaryButton from '../components/PrimaryButton';
import VerificationCheck from '../functions/verificationCheck';
import { API } from '../config/constants';
import { commonStyles } from '../styles/screenStyles';

const AdminToolsManageTriviaAdd = () => {
    const navigation = useNavigation();
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState('');
    const [selectQAType, setSelectQAType] = useState('null');
    const [supportingVerse, setSupportingVerse] = useState('');
    const [selectDifficulty, setSelectDifficulty] = useState('null');
    const [statusMessage, setStatusMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const checkAccess = async () => {
            const userLoggedIn = await VerificationCheck.CheckUserLogin();
            const isAdmin = await VerificationCheck.GetAdminRole();
            
            if (!userLoggedIn || !isAdmin) {
                navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
            }
        };

        checkAccess();
    }, [navigation]);

    const submitForm = async () => {
        if (!question || !answer || selectQAType === 'null' || selectDifficulty === 'null') {
            return setStatusMessage('All fields must be filled in!');
        }

        try {
            setIsLoading(true);
            const url = `${API.BASE_URL}/admin/adminTool/TriviaUpload`;
            
            const response = await axios.post(url, {
                question,
                answer,
                supportingVerse,
                qaType: selectQAType,
                difficulty: selectDifficulty
            });
            
            if (response.data.uploadStatus === 'Successful') {
                setStatusMessage('Question uploaded successfully!');
                setQuestion('');
                setAnswer('');
                setSelectQAType('null');
                setSupportingVerse('');
                setSelectDifficulty('null');
            } else {
                setStatusMessage('Upload failed');
            }
        } catch (error) {
            setStatusMessage(error.response?.data?.message || 'An error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    const qaTypes = [
        { label: 'Select Q&A Type', value: 'null' },
        { label: 'True or False', value: 'TrueOrFalse' },
        { label: 'Number', value: 'Number' },
        { label: 'People', value: 'People' },
        { label: 'Item', value: 'Item' },
        { label: 'Quote', value: 'Quote' },
        { label: 'Verse', value: 'Verse' },
        { label: 'Book', value: 'Book' },
        { label: 'Location', value: 'Location' },
    ];

    const difficultyLevels = [
        { label: 'Select Q&A Difficulty', value: 'null' },
        { label: 'Beginner', value: 'Beginner' },
        { label: 'Intermediate', value: 'Intermediate' },
        { label: 'Advance', value: 'Advance' },
    ];

    return (
        <SafeAreaView style={commonStyles.container}>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <ScrollView contentContainerStyle={commonStyles.scrollContent}>
                        <View style={commonStyles.formNonCentered}>
                            <Text style={commonStyles.title24}>Upload Question & Answer</Text>
                            <TextField
                                label="Question"
                                placeholder="Enter Question"
                                value={question}
                                onChangeText={setQuestion}
                                multiline
                                numberOfLines={4}
                                inputStyle={{ height: 100, textAlignVertical: 'top' }}
                            />
                            <TextField
                                label="Answer"
                                placeholder="Enter Answer"
                                value={answer}
                                onChangeText={setAnswer}
                            />
                            <TextField
                                label="Supporting Verse"
                                placeholder="Enter Supporting Verse"
                                value={supportingVerse}
                                onChangeText={setSupportingVerse}
                            />
                            <SelectField
                                label="Q&A Type"
                                value={selectQAType}
                                onValueChange={setSelectQAType}
                                items={qaTypes}
                            />
                            <SelectField
                                label="Difficulty Level"
                                value={selectDifficulty}
                                onValueChange={setSelectDifficulty}
                                items={difficultyLevels}
                            />
                            <PrimaryButton
                                title="Add Q&A"
                                onPress={submitForm}
                                loading={isLoading}
                            />
                            {!isLoading && (
                                <PrimaryButton
                                    title="Return to Questions"
                                    onPress={() => navigation.navigate('AdminToolsManageTrivia')}
                                    variant="ghost"
                                />
                            )}
                            {!isLoading && statusMessage && (
                                <Text style={commonStyles.status}>{statusMessage}</Text>
                            )}
                        </View>
                    </ScrollView>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default AdminToolsManageTriviaAdd;
