import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import VerificationCheck from '../functions/verificationCheck';
import PrimaryButton from '../components/PrimaryButton';
import { colors, spacing, radius } from '../components/themes';

const Profile = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const [isLoading, setIsLoading] = useState(true);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [savedSouls, setSavedSouls] = useState('');
    const [selectDenomination, setSelectDenomination] = useState(null);
    const [churchName, setChurchName] = useState(null);
    const [churchLocation, setChurchLocation] = useState(null);
    const [churchState, setChurchState] = useState(null);
    const [showButtons, setShowButtons] = useState(true);

    useEffect(() => {
        const loadProfile = async () => {
            try {
                const userLoggedIn = await VerificationCheck.CheckUserLogin();
                if (!userLoggedIn) {
                    navigation.reset({ index: 0, routes: [{ name: 'Login', params: { previousRoute: 'Profile' } }] });
                    return;
                }

                const loggedInUser = await VerificationCheck.CheckUser();
                const isAdmin = await VerificationCheck.GetAdminRole();
                
                const userData = await VerificationCheck.GetUserProps();
                if (userData && userData.data) {
                    const user = userData.data.user;
                    setUsername(loggedInUser);
                    setFirstName(user.accountFirstName || '');
                    setLastName(user.accountLastName || '');
                    setEmail(user.accountEmail || '');
                    setSavedSouls(user.savedSouls || '0');
                    setSelectDenomination(user.denomination);
                    setChurchName(user.churchName);
                    setChurchLocation(user.churchLocation);
                    setChurchState(user.churchState);
                    
                    if (isAdmin) {
                        setShowButtons(false);
                    }
                }
            } catch (error) {
                console.error('Error loading profile:', error);
                navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
            } finally {
                setIsLoading(false);
            }
        };

        loadProfile();
    }, [navigation]);

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.form}>
                    {isLoading ? (
                        <ActivityIndicator size="large" color={colors.primary} />
                    ) : (
                        <>
                            <Text style={styles.title}>{firstName} {lastName}</Text>
                            <View style={styles.infoContainer}>
                                <View style={styles.infoRow}>
                                    <Text style={styles.label}>Username:</Text>
                                    <Text style={styles.value}>{username}</Text>
                                </View>
                                <View style={styles.infoRow}>
                                    <Text style={styles.label}>Email:</Text>
                                    <Text style={styles.value}>{email}</Text>
                                </View>
                                <View style={styles.infoRow}>
                                    <Text style={styles.label}>Saved Souls:</Text>
                                    <Text style={styles.value}>{savedSouls}</Text>
                                </View>
                                <View style={styles.infoRow}>
                                    <Text style={styles.label}>Church:</Text>
                                    {churchName ? (
                                        <Text style={styles.value}>
                                            {churchName} {selectDenomination} Church in {churchLocation}, {churchState}
                                        </Text>
                                    ) : (
                                        <Text style={styles.value}>-</Text>
                                    )}
                                </View>
                            </View>
                            <PrimaryButton 
                                title="Update Profile" 
                                onPress={() => navigation.navigate('ProfileUpdate')} 
                            />
                            {showButtons && (
                                <PrimaryButton 
                                    title="Delete Profile" 
                                    onPress={() => navigation.navigate('ProfileDelete')}
                                    variant="outline"
                                />
                            )}
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
        fontSize: 28,
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

export default Profile;
