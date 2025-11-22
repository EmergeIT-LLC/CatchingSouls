import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';
import VerificationCheck from '../functions/verificationCheck';
import PrimaryButton from '../components/PrimaryButton';
import { API } from '../config/constants';
import { colors, spacing, radius } from '../components/themes';

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
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.form}>
                    {isLoading ? (
                        <ActivityIndicator size="large" color={colors.primary} />
                    ) : (
                        <>
                            <Text style={styles.title}>Question ID {questionID}</Text>
                            <View style={styles.infoContainer}>
                                <View style={styles.infoRow}>
                                    <Text style={styles.label}>Question:</Text>
                                    <Text style={styles.value}>{question}</Text>
                                </View>
                                <View style={styles.infoRow}>
                                    <Text style={styles.label}>Answer:</Text>
                                    <Text style={styles.value}>{answer}</Text>
                                </View>
                                <View style={styles.infoRow}>
                                    <Text style={styles.label}>Supporting Verse:</Text>
                                    <Text style={styles.value}>{supportingVerse}</Text>
                                </View>
                                <View style={styles.infoRow}>
                                    <Text style={styles.label}>Answer Relation:</Text>
                                    <Text style={styles.value}>{triviaType}</Text>
                                </View>
                                <View style={styles.infoRow}>
                                    <Text style={styles.label}>Question Level:</Text>
                                    <Text style={styles.value}>{triviaLevel}</Text>
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
    infoContainer: {
        width: '100%',
        marginBottom: spacing.lg,
    },
    infoRow: {
        marginBottom: spacing.md,
        paddingVertical: spacing.sm,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    label: {
        fontWeight: 'bold',
        fontSize: 16,
        color: colors.text,
        marginBottom: spacing.xs,
    },
    value: {
        fontSize: 16,
        color: colors.text,
    },
});

export default AdminToolsManageTriviaDetail;
