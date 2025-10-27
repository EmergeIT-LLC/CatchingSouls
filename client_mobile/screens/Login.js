import React, { useEffect, useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View, ScrollView, KeyboardAvoidingView, Keyboard, TouchableWithoutFeedback, Platform } from 'react-native';
import PrimaryButton from '../components/PrimaryButton';
import TextField from '../components/TextField';
import { useThrottleAsync } from '../functions/throttler';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { API } from '../config/constants';
import entryCheck from '../functions/entryCheck';
import VerificationCheck from '../functions/verificationCheck';
import { SafeAreaView } from 'react-native-safe-area-context';

const Login = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    const init = async () => {
      const loggedIn = await VerificationCheck.CheckUserLogin();
      if (loggedIn) navigation.navigate('Dashboard');
    };
    init();
  }, [navigation]);

  const login = async () => {
    if (!username || !password) return setStatusMessage('Username and password must be provided!');
    if (!entryCheck.CheckUsername(username) || !entryCheck.CheckPassword(password)) {
      return setStatusMessage('Account Does Not Exist or Password Is Incorrect!');
    }

    try {
      setIsLoading(true);
      const res = await axios.post(`${API.BASE_URL}/user/login`, { username, password });
      setIsLoading(false);

      if (res.data?.loggedIn) {
        await AsyncStorage.setItem('catchingSoulsLoggedin', 'true');
        await AsyncStorage.setItem('catchingSoulsUsername', res.data.username || username);
        if (res.data.isAdmin) await AsyncStorage.setItem('catchingSoulsAdmin', 'true');

        const previous = route?.params?.previousRoute;
        if (previous) {
          navigation.navigate(previous);
        } else {
          navigation.reset({ index: 0, routes: [{ name: 'Dashboard' }] });
        }
        return;
      }

      setStatusMessage(res.data?.message || 'Login failed.');
    } catch (err) {
      setIsLoading(false);
      console.error('Login error', err?.response ?? err.message ?? err);
      setStatusMessage('Network or server error');
    }
  };

  const guestLogin = async () => {
    await AsyncStorage.setItem('catchingSoulsGuestLoggedin', 'true');
    await AsyncStorage.setItem('catchingSoulsGuestUsername', 'Guest');
    await AsyncStorage.setItem('catchingSoulsGuestPoints', '0');
    navigation.navigate('Dashboard');
  };

  const throttledLogin = useThrottleAsync(login, 2000);

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 70}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            contentContainerStyle={[
              styles.form,
              {
                flexGrow: 1,
                justifyContent: 'center',
                paddingBottom: Platform.OS === 'ios' ? 160 : 110,
              },
            ]}
            keyboardShouldPersistTaps="handled"
          >
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

            <PrimaryButton title="Login" onPress={throttledLogin} loading={isLoading} />
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
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'stretch',
    justifyContent: 'flex-start',
  },
  form: {
    width: '85%',
    alignSelf: 'center',
    borderWidth: 4,
    borderRadius: 16,
    borderColor: 'purple',
    alignItems: 'center',
    paddingVertical: 16,
  },
  logo: {
    width: 250,
    height: 250,
    marginBottom: 12,
  },
  title: {
    color: 'crimson',
    fontSize: 28,
    marginVertical: 12,
    fontWeight: '700',
  },
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
  buttonText: {
    color: 'black',
    fontWeight: 'bold',
  },
  linksRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  link: {
    color: 'purple',
    textDecorationLine: 'none',
  },
  linkDivider: {
    color: 'black',
    marginHorizontal: 4,
  },
  status: {
    marginTop: 12,
    color: 'crimson',
  },
});

export default Login;