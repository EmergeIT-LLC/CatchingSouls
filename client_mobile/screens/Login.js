import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { API } from '../config/constants';
import { CheckUsername, CheckPassword } from '../functions/entryCheck';
import VerificationCheck from '../functions/verificationCheck';

const Login = () => {
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    const init = async () => {
      const loggedIn = await VerificationCheck.CheckLogin();
      if (loggedIn) navigation.navigate('Dashboard');
    };
    init();
  }, [navigation]);

  const login = async () => {
    if (!username || !password) return setStatusMessage('Username and password must be provided!');
    if (!CheckUsername(username) || !CheckPassword(password)) {
      return setStatusMessage('Account Does Not Exist or Password Is Incorrect!');
    }

    setIsLoading(true);
    setStatusMessage('');

    try {
      const url = `${API.BASE_URL}/user/login`;
      const res = await axios.post(url, { username, password });

      setIsLoading(false);

      if (res.data?.loggedIn) {
        await AsyncStorage.setItem('catchingSoulsLoggedin', 'true');
        await AsyncStorage.setItem('catchingSoulsUsername', res.data.username || username);
        if (res.data.isAdmin) await AsyncStorage.setItem('catchingSoulsAdmin', 'true');

        navigation.navigate('Dashboard');
      } else {
        setStatusMessage(res.data?.message || 'Login failed.');
      }
    } catch (err) {
      setIsLoading(false);
      setStatusMessage('Network error. Try again.');
      console.error('Login error:', err?.message || err);
    }
  };

  const guestLogin = async () => {
    await AsyncStorage.setItem('catchingSoulsGuestLoggedin', 'true');
    await AsyncStorage.setItem('catchingSoulsGuestUsername', 'Guest');
    await AsyncStorage.setItem('catchingSoulsGuestPoints', '0');
    navigation.navigate('Dashboard');
  };

  return (
    <View style={styles.container}>
      <View style={styles.form}>
        <Image source={require('../assets/Images/Logo_Transparent.png')} style={styles.logo} />
        <Text style={styles.title}>Catching Souls</Text>

        <View style={{ width: 260 }}>
          <TextField
            label="Username"
            placeholder="Enter username"
            value={username}
            onChangeText={setUsername}
          />
          <TextField
            label="Password"
            placeholder="Enter password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        <PrimaryButton title="Login" onPress={login} loading={isLoading} />
        {!isLoading && (
          <>
            <PrimaryButton title="Login As Guest" onPress={guestLogin} variant="outline" />
            <View style={styles.linksRow}>
              <Pressable onPress={() => navigation.navigate('Register')}>
                <Text style={styles.link}>Register?</Text>
              </Pressable>
              <Text style={styles.linkDivider}> or </Text>
              <Pressable onPress={() => navigation.navigate('ForgotPassword')}>
                <Text style={styles.link}>Reset Password?</Text>
              </Pressable>
            </View>
          </>
        )}

        {!!statusMessage && !isLoading && <Text style={styles.status}>{statusMessage}</Text>}
      </View>
    </View>
  );
}

export default Login;

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