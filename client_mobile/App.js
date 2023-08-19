//Dependencies
import 'react-native-gesture-handler';
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { AsyncStorage, Button, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { DrawerNavigator } from 'react-navigation';
import { DrawerActions, NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Icon } from 'react-native-elements';
import { createDrawerNavigator } from '@react-navigation/drawer';


//Screens
import Dashboard from './screens/Dashboard';
import Login from './screens/Login';
import Logout from './screens/Logout';

//Code
const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

const StackedScreens = () => {
  const navigation = useNavigation();
  return (
    <Stack.Navigator 
      initialRouteName='Dashboard'
      screenOptions={headerStyle(navigation)}
    >
      <Stack.Screen name="Dashboard" component={Dashboard}/>
      <Stack.Screen name="Login" component={Login}/>
      <Stack.Screen name="Logout" component={Logout}/>            
    </Stack.Navigator>
  )
}

export default function App() {
  return (
    <View style={styles.container}>
      <LinearGradient colors={['purple', 'gold']} style={styles.linearBGContainer}>
        <NavigationContainer>
          <StackedScreens/>
        </NavigationContainer>
      </LinearGradient>
      <StatusBar style="auto" />
    </View>
  );
}

const headerStyle = navigation => {
  return {
    title: 'Catching Souls',
    headerStyle: { backgroundColor: 'purple' },
    headerTintColor: 'white',
    headerTitleAlign: 'center',
    headerTitleStyle: {
      fontSize: 25,
      fontWeight: 'bold',
    },
    headerRight: () => 
        (
          <Icon name='menu' size={50} color='white'
          onPress={()=> navigation.dispatch(DrawerActions.toggleDrawer())}
          />
        ),
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  linearBGContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});