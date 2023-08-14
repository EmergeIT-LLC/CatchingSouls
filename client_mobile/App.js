//Dependencies
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
//Screens
import Dashboard from './screens/Dashboard';
import Login from './screens/Login';
import Logout from './screens/Logout';
//Code

const Stack = createNativeStackNavigator();

function StackedScreens() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Dashboard" component={Dashboard} initial='true'/>
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
  innerContainer : {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  }
});
