import React, { useEffect, useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useThrottleAsync } from '../functions/throttler';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { API } from '../config/constants';
import VerificationCheck from '../functions/verificationCheck';

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

    const throttledLogout = useThrottleAsync(logout, 3000);

    return (
        <View style={styles.container}>
            <View style={styles.form}>
                {isLoading ?
                    <>
                        <Text>Loading...</Text>
                    </>
                    :
                    <>
                        <Image
                            source={require('../assets/Images/Logo_Transparent.png')}
                            style={styles.logo}
                            alt="Catching Souls Logo"
                        />
                        <Text style={styles.title} onLoad={throttledLogout}>Logout</Text>
                        {statusMessage ? <Text style={styles.status}>{statusMessage}</Text> : null}
                        <Text>Select <Text style={{fontWeight: 'bold'}}>login</Text> to sign back in!</Text>
                        <Pressable style={styles.button} onPress={loginNav}>
                            <Text style={styles.buttonText}>Login</Text>
                        </Pressable>
                    </>
                }
            </View>
            
        </View>
    );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' },
  form: {
    width: '85%',
    borderWidth: 4,
    borderRadius: 16,
    borderColor: 'purple',
    alignItems: 'center',
    paddingVertical: 16,
  },
  logo: { width: 200, height: 200, marginTop: 8 },
  title: { color: 'crimson', fontSize: 28, marginVertical: 12, fontWeight: '700' },
  input: {
    width: 260,
    height: 44,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  button: {
    width: 260,
    height: 44,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'purple',
    backgroundColor: 'gold',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },
  buttonText: { color: 'black', fontWeight: 'bold' },
  linksRow: { flexDirection: 'row', alignItems: 'center', marginTop: 12 },
  link: { color: 'purple', textDecorationLine: 'none' },
  linkDivider: { color: 'black', marginHorizontal: 4 },
  status: { marginTop: 12, color: 'crimson' },
});

export default Logout;