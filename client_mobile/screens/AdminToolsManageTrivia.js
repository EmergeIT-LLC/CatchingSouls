import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, ActivityIndicator, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';
import VerificationCheck from '../functions/verificationCheck';
import PrimaryButton from '../components/PrimaryButton';
import { API } from '../config/constants';
import { colors, spacing, radius } from '../components/themes';

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
            style={styles.row}
            onPress={() => questionDetail(question.triviaID)}
        >
            <Text style={[styles.cell, { flex: 0.5 }]}>{question.triviaID}</Text>
            <Text style={[styles.cell, { flex: 2 }]} numberOfLines={2}>{question.triviaquestions}</Text>
            <Text style={[styles.cell, { flex: 1 }]} numberOfLines={1}>{question.triviaanswers}</Text>
            <Text style={[styles.cell, { flex: 1 }]}>{question.triviatype}</Text>
            <Text style={[styles.cell, { flex: 1 }]}>{question.trivialevel}</Text>
        </Pressable>
    );

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <PrimaryButton
                    title="Add Questions"
                    onPress={() => navigation.navigate('AdminToolsManageTriviaAdd')}
                />
                {isLoading ? (
                    <ActivityIndicator size="large" color={colors.primary} />
                ) : (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Questionnaires</Text>
                        <ScrollView horizontal>
                            <View style={styles.table}>
                                <View style={styles.headerRow}>
                                    <Text style={[styles.headerCell, { flex: 0.5 }]}>ID</Text>
                                    <Text style={[styles.headerCell, { flex: 2 }]}>Question</Text>
                                    <Text style={[styles.headerCell, { flex: 1 }]}>Answer</Text>
                                    <Text style={[styles.headerCell, { flex: 1 }]}>Type</Text>
                                    <Text style={[styles.headerCell, { flex: 1 }]}>Level</Text>
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.bg,
    },
    scrollContent: {
        padding: spacing.lg,
    },
    section: {
        marginTop: spacing.xl,
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.text,
        marginBottom: spacing.md,
        textAlign: 'center',
    },
    table: {
        borderWidth: 2,
        borderColor: colors.primary,
        borderRadius: radius.sm,
        overflow: 'hidden',
        minWidth: 600,
    },
    headerRow: {
        flexDirection: 'row',
        backgroundColor: colors.primary,
        padding: spacing.sm,
    },
    headerCell: {
        fontWeight: 'bold',
        color: colors.bg,
        fontSize: 12,
    },
    row: {
        flexDirection: 'row',
        padding: spacing.sm,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    cell: {
        fontSize: 11,
        color: colors.text,
    },
});

export default AdminToolsManageTrivia;
