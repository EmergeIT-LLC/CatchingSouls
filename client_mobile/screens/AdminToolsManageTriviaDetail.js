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

const AdminToolsManageTriviaDetail = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { questionID } = route.params || {};
    const [isLoading, setIsLoading] = useState(true);
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState('');
    const [triviaType, setTriviaType] = useState('');
    const [triviaLevel, setTriviaLevel] = useState('');
    const [supportingVerse, setSupportingVerse] = useState('');
    const [showButtons, setShowButtons] = useState(true);

    useEffect(() => {
        const loadDetails = async () => {
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

        loadDetails();
    }, [navigation]);

    const getTriviaProps = async () => {
        try {
            const url = `${API.BASE_URL}/admin/adminTool/TriviaDetailRetrieval`;
            const response = await axios.post(url, { QuestionID: { questionID } });
            
            setQuestion(response.data.triviaquestions);
            setAnswer(response.data.triviaanswers);
            setTriviaType(response.data.triviatype);
            setTriviaLevel(response.data.trivialevel);
            setSupportingVerse(response.data.supportingVerse);
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
                            <Text style={commonStyles.title24}>Question ID {questionID}</Text>
                            <View style={profileStyles.infoContainer}>
                                <View style={profileStyles.infoRow}>
                                    <Text style={profileStyles.label}>Question:</Text>
                                    <Text style={profileStyles.value}>{question}</Text>
                                </View>
                                <View style={profileStyles.infoRow}>
                                    <Text style={profileStyles.label}>Answer:</Text>
                                    <Text style={profileStyles.value}>{answer}</Text>
                                </View>
                                <View style={profileStyles.infoRow}>
                                    <Text style={profileStyles.label}>Supporting Verse:</Text>
                                    <Text style={profileStyles.value}>{supportingVerse}</Text>
                                </View>
                                <View style={profileStyles.infoRow}>
                                    <Text style={profileStyles.label}>Answer Relation:</Text>
                                    <Text style={profileStyles.value}>{triviaType}</Text>
                                </View>
                                <View style={profileStyles.infoRow}>
                                    <Text style={profileStyles.label}>Question Level:</Text>
                                    <Text style={profileStyles.value}>{triviaLevel}</Text>
                                </View>
                            </View>
                            {showButtons && (
                                <>
                                    <PrimaryButton
                                        title="Update Question"
                                        onPress={() => navigation.navigate('AdminToolsManageTriviaUpdate', { questionID })}
                                    />
                                    <PrimaryButton
                                        title="Delete Question"
                                        onPress={() => navigation.navigate('AdminToolsManageTriviaDelete', { questionID })}
                                        variant="outline"
                                    />
                                </>
                            )}
                            <PrimaryButton
                                title="Return to Questions"
                                onPress={() => navigation.navigate('AdminToolsManageTrivia')}
                                variant="ghost"
                            />
                        </>
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default AdminToolsManageTriviaDetail;
