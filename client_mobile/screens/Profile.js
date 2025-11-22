import React, { useState, useEffect } from 'react';
import { Text, View, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import VerificationCheck from '../functions/verificationCheck';
import PrimaryButton from '../components/PrimaryButton';
import { colors } from '../components/themes';
import { commonStyles, profileStyles } from '../styles/screenStyles';

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
        <SafeAreaView style={commonStyles.container}>
            <ScrollView contentContainerStyle={commonStyles.scrollContent}>
                <View style={commonStyles.form}>
                    {isLoading ? (
                        <ActivityIndicator size="large" color={colors.primary} />
                    ) : (
                        <>
                            <Text style={commonStyles.title}>{firstName} {lastName}</Text>
                            <View style={profileStyles.infoContainer}>
                                <View style={profileStyles.infoRow}>
                                    <Text style={profileStyles.label}>Username:</Text>
                                    <Text style={profileStyles.value}>{username}</Text>
                                </View>
                                <View style={profileStyles.infoRow}>
                                    <Text style={profileStyles.label}>Email:</Text>
                                    <Text style={profileStyles.value}>{email}</Text>
                                </View>
                                <View style={profileStyles.infoRow}>
                                    <Text style={profileStyles.label}>Saved Souls:</Text>
                                    <Text style={profileStyles.value}>{savedSouls}</Text>
                                </View>
                                <View style={profileStyles.infoRow}>
                                    <Text style={profileStyles.label}>Church:</Text>
                                    {churchName ? (
                                        <Text style={profileStyles.value}>
                                            {churchName} {selectDenomination} Church in {churchLocation}, {churchState}
                                        </Text>
                                    ) : (
                                        <Text style={profileStyles.value}>-</Text>
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

export default Profile;
