import React, { useEffect, useState } from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import { useThrottleAsync } from '../functions/throttler';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { API } from '../config/constants';
import VerificationCheck from '../functions/verificationCheck';
import { logoutStyles } from '../styles/screenStyles';

const Logout = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [statusMessage, setStatusMessage] = useState('');
    const loggedInUser = VerificationCheck.CheckUser();
    const navigation = useNavigation();

    const loginNav = () => {
        navigation.navigate('Login');
    }

    const logout = async () => {
        setIsLoading(true);
        setStatusMessage('');

        const url = `${API.BASE_URL}/user/logout`;
        
        await axios.post(url, { username: loggedInUser })
        .then((response) => {
            setStatusMessage(response.data.message);

            AsyncStorage.removeItem('catchingSoulsUsername');
            AsyncStorage.removeItem('catchingSoulsLoggedin');
            AsyncStorage.removeItem('catchingSoulsAdmin');
            AsyncStorage.removeItem('catchingSoulsGuestLoggedin');
            AsyncStorage.removeItem('catchingSoulsGuestUsername');
            AsyncStorage.removeItem('catchingSoulsGuestPoints');
            setIsLoading(false);
            navigation.navigate('Login');
        }
        ).catch((err) => {
            setStatusMessage(err.message.includes('Network error') ? 'Network error. Try again.' : 'Logout failed. Please try again.');
            console.error('Logout error:', err?.message || err);
        });
    };

    const throttledLogout = useThrottleAsync(logout, 2000);

    useEffect(() => {
        throttledLogout();
    }, [throttledLogout]);

    return (
        <View style={logoutStyles.container}>
            <View style={logoutStyles.form}>
                {isLoading ?
                    <>
                        <Text>Loading...</Text>
                    </>
                    :
                    <>
                        <Image
                            source={require('../assets/Images/Logo_Transparent.png')}
                            style={logoutStyles.logo}
                            alt="Catching Souls Logo"
                        />
                        <Text style={logoutStyles.title}>Logout</Text>
                        {statusMessage ? <Text style={logoutStyles.message}>{statusMessage}</Text> : null}
                        <Text style={logoutStyles.message}>Select <Text style={{fontWeight: 'bold'}}>login</Text> to sign back in!</Text>
                        <Pressable style={{backgroundColor: 'purple', padding: 12, borderRadius: 8, marginTop: 10}} onPress={loginNav}>
                            <Text style={{color: '#fff', fontWeight: '600'}}>Login</Text>
                        </Pressable>
                    </>
                }
            </View>
            
        </View>
    );
}

export default Logout;