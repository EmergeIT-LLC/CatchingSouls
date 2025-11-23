import React, { useEffect, useState } from 'react';
import { Image, Pressable, Text, View, ScrollView, KeyboardAvoidingView, Keyboard, TouchableWithoutFeedback, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import PrimaryButton from '../components/PrimaryButton';
import TextField from '../components/TextField';
import { useThrottleAsync } from '../functions/throttler';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { API } from '../config/constants';
import entryCheck from '../functions/entryCheck';
import VerificationCheck from '../functions/verificationCheck';
import { loginStyles } from '../styles/screenStyles';

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
    <SafeAreaView style={loginStyles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 70}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            contentContainerStyle={[
              loginStyles.form,
              {
                flexGrow: 1,
                justifyContent: 'center',
                paddingBottom: Platform.OS === 'ios' ? 160 : 110,
              },
            ]}
            keyboardShouldPersistTaps="handled"
          >
            <Image source={require('../assets/Images/Logo_Transparent.png')} style={loginStyles.logo} />
            <Text style={loginStyles.title}>Catching Souls</Text>

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
                <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 12}}>
                  <Pressable onPress={() => navigation.navigate('Register')}>
                    <Text style={{color: 'purple'}}>Register?</Text>
                  </Pressable>
                  <Text style={{color: 'black', marginHorizontal: 4}}> or </Text>
                  <Pressable onPress={() => navigation.navigate('ForgotPassword')}>
                    <Text style={{color: 'purple'}}>Reset Password?</Text>
                  </Pressable>
                </View>
              </>
            )}

            {!!statusMessage && !isLoading && <Text style={loginStyles.errorText}>{statusMessage}</Text>}
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Login;