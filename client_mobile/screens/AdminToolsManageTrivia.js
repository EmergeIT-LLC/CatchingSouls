import React, { useState, useEffect } from 'react';
import { Text, View, ScrollView, ActivityIndicator, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';
import VerificationCheck from '../functions/verificationCheck';
import PrimaryButton from '../components/PrimaryButton';
import { API } from '../config/constants';
import { commonStyles, tableStyles } from '../styles/screenStyles';
import { colors } from '../components/themes';

const AdminToolsManageTrivia = () => {
    const navigation = useNavigation();
    const [isLoading, setIsLoading] = useState(true);
    const [triviaData, setTriviaData] = useState([]);

    useEffect(() => {
        const loadTrivia = async () => {
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

        loadTrivia();
    }, [navigation]);

    const getTriviaProps = async () => {
        try {
            const url = `${API.BASE_URL}/admin/adminTool/TriviaRetrieval`;
            const response = await axios.post(url);
            setTriviaData(response.data || []);
        } catch (error) {
            console.error(error);
        }
    };

    const questionDetail = (questionID) => {
        navigation.navigate('AdminToolsManageTriviaDetail', { questionID });
    };

    const renderTriviaRow = (question) => (
        <Pressable
            key={question.triviaID}
            style={tableStyles.row}
            onPress={() => questionDetail(question.triviaID)}
        >
            <Text style={[tableStyles.cellSmall, { flex: 0.5 }]}>{question.triviaID}</Text>
            <Text style={[tableStyles.cellLarge, { flex: 2 }]} numberOfLines={2}>{question.triviaquestions}</Text>
            <Text style={[tableStyles.cell, { flex: 1 }]} numberOfLines={1}>{question.triviaanswers}</Text>
            <Text style={[tableStyles.cell, { flex: 1 }]}>{question.triviatype}</Text>
            <Text style={[tableStyles.cell, { flex: 1 }]}>{question.trivialevel}</Text>
        </Pressable>
    );

    return (
        <SafeAreaView style={commonStyles.container}>
            <ScrollView contentContainerStyle={commonStyles.scrollContent}>
                <PrimaryButton
                    title="Add Questions"
                    onPress={() => navigation.navigate('AdminToolsManageTriviaAdd')}
                />
                {isLoading ? (
                    <ActivityIndicator size="large" color={colors.primary} />
                ) : (
                    <View style={tableStyles.section}>
                        <Text style={tableStyles.sectionTitle}>Questionnaires</Text>
                        <ScrollView horizontal>
                            <View style={tableStyles.wideTable}>
                                <View style={tableStyles.headerRow}>
                                    <Text style={[tableStyles.headerCell, { flex: 0.5 }]}>ID</Text>
                                    <Text style={[tableStyles.headerCell, { flex: 2 }]}>Question</Text>
                                    <Text style={[tableStyles.headerCell, { flex: 1 }]}>Answer</Text>
                                    <Text style={[tableStyles.headerCell, { flex: 1 }]}>Type</Text>
                                    <Text style={[tableStyles.headerCell, { flex: 1 }]}>Level</Text>
                                </View>
                                {triviaData.map(renderTriviaRow)}
                            </View>
                        </ScrollView>
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
};

export default AdminToolsManageTrivia;
