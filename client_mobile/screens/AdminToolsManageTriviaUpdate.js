import React, { useState, useEffect } from 'react';
import { Text, View, ScrollView, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';
import TextField from '../components/TextField';
import SelectField from '../components/SelectField';
import PrimaryButton from '../components/PrimaryButton';
import VerificationCheck from '../functions/verificationCheck';
import { API } from '../config/constants';
import { commonStyles } from '../styles/screenStyles';

const AdminToolsManageTriviaUpdate = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { questionID } = route.params || {};
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState('');
    const [supportingVerse, setSupportingVerse] = useState('');
    const [selectQAType, setSelectQAType] = useState('null');
    const [selectDifficulty, setSelectDifficulty] = useState('null');
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
            setAnswer(response.data.triviaanswers);
            setSupportingVerse(response.data.supportingVerse || '');
            setSelectQAType(response.data.triviatype);
            setSelectDifficulty(response.data.trivialevel);
        } catch (error) {
            console.error(error);
        }
    };

    const submitForm = async () => {
        if (!question || !answer || selectQAType === 'null' || selectDifficulty === 'null') {
            return setStatusMessage('All fields must be filled in!');
        }

        try {
            setIsLoading(true);
            const url = `${API.BASE_URL}/admin/adminTool/TriviaUpdate`;
            
            const response = await axios.post(url, {
                questionID,
                question,
                answer,
                supportingVerse,
                qaType: selectQAType,
                difficulty: selectDifficulty
            });
            
            if (response.data.updateStatus === 'Successful') {
                navigation.navigate('AdminToolsManageTriviaDetail', { questionID });
            } else {
                setStatusMessage('Update failed');
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
                            <Text style={commonStyles.title24}>Update Question {questionID}</Text>
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
                                title="Update Question"
                                onPress={submitForm}
                                loading={isLoading}
                            />
                            {!isLoading && (
                                <PrimaryButton
                                    title="Cancel"
                                    onPress={() => navigation.navigate('AdminToolsManageTriviaDetail', { questionID })}
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

export default AdminToolsManageTriviaUpdate;
