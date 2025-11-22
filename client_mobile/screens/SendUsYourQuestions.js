import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';
import TextField from '../components/TextField';
import PrimaryButton from '../components/PrimaryButton';
import entryCheck from '../functions/entryCheck';
import { API } from '../config/constants';
import { colors, spacing, radius } from '../components/themes';

const SendUsYourQuestions = () => {
    const navigation = useNavigation();
    const [isLoading, setIsLoading] = useState(false);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState('');
    const [verse, setVerse] = useState('');
    const [statusMessage, setStatusMessage] = useState('');

    const submitForm = async () => {
        if (!firstName || !lastName || !email) {
            return setStatusMessage('All fields with "*" must be filled in!');
        }
        if (!entryCheck.CheckEmail(email)) {
            return setStatusMessage('Email Is Not Acceptable');
        }

        try {
            setIsLoading(true);
            const url = `${API.BASE_URL}/User/sendUsYourQuestions`;
            
            const response = await axios.post(url, {
                firstName,
                lastName,
                email,
                question,
                answer,
                verse
            });
            
            if (response.data.successStatus === 'Successful') {
                setStatusMessage('Question Sent Successfully');
                setFirstName('');
                setLastName('');
                setEmail('');
                setQuestion('');
                setAnswer('');
                setVerse('');
            } else if (response.data.successStatus === 'Unsuccessful') {
                setStatusMessage('An error occurred');
            }
        } catch (error) {
            setStatusMessage(error.response?.data?.message || 'An error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <ScrollView contentContainerStyle={styles.scrollContent}>
                        <View style={styles.form}>
                            <Text style={styles.title}>Send Us Your Question</Text>
                            <TextField
                                label="First Name *"
                                placeholder="First Name"
                                value={firstName}
                                onChangeText={setFirstName}
                            />
                            <TextField
                                label="Last Name *"
                                placeholder="Last Name"
                                value={lastName}
                                onChangeText={setLastName}
                            />
                            <TextField
                                label="Email Address *"
                                placeholder="Email Address"
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                            />
                            <TextField
                                label="Trivia Question"
                                placeholder="Type In Your Trivia Question"
                                value={question}
                                onChangeText={setQuestion}
                                multiline
                                numberOfLines={4}
                                inputStyle={{ height: 100, textAlignVertical: 'top' }}
                            />
                            <TextField
                                label="Trivia Answer"
                                placeholder="Enter Trivia Answer"
                                value={answer}
                                onChangeText={setAnswer}
                                multiline
                                numberOfLines={3}
                                inputStyle={{ height: 75, textAlignVertical: 'top' }}
                            />
                            <TextField
                                label="Supporting Verse"
                                placeholder="Enter Supporting Verse"
                                value={verse}
                                onChangeText={setVerse}
                            />
                            <PrimaryButton
                                title="Submit"
                                onPress={submitForm}
                                loading={isLoading}
                            />
                            {!isLoading && statusMessage && (
                                <Text style={styles.status}>{statusMessage}</Text>
                            )}
                        </View>
                    </ScrollView>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
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
    },
    form: {
        borderWidth: 4,
        borderColor: colors.primary,
        borderRadius: radius.lg,
        padding: spacing.lg,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.text,
        marginBottom: spacing.lg,
        textAlign: 'center',
    },
    status: {
        marginTop: spacing.md,
        color: colors.danger,
        textAlign: 'center',
    },
});

export default SendUsYourQuestions;
