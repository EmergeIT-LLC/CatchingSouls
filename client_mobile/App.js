//Dependencies
import "react-native-gesture-handler";
import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from "expo-linear-gradient";
import { DrawerActions, NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Icon } from "react-native-elements";
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import VerificationCheck from "./functions/verificationCheck";

//Screens
import Dashboard from "./screens/Dashboard";
import LevelChoice from "./screens/LevelChoice";
import Login from "./screens/Login";
import Logout from "./screens/Logout";

//Code
const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();


// Accept props from App so auth state is decided once and passed down
const StackedScreens = ({ initialRouteName, isLoggedIn, isGuest }) => {
  // custom drawer content: show Login or Logout based on auth state
  const CustomDrawerContent = (props) => {
    return (
      <DrawerContentScrollView {...props}>
        {!isLoggedIn && !isGuest ? (
          <>
            <DrawerItem
              label="Login"
              onPress={() => props.navigation.navigate('Login')}
            />
          </>
        ) : (
          <>
            <DrawerItem
              label="Dashboard"
              onPress={() => props.navigation.navigate('Dashboard')}
            />
            <DrawerItem
              label="Logout"
              onPress={() => props.navigation.navigate('Logout')}
            />
          </>
        )}
      </DrawerContentScrollView>
    );
  };

  return (
    <Drawer.Navigator
      initialRouteName={initialRouteName}
      screenOptions={({ navigation }) => headerStyle(navigation)}
      drawerPosition="right"
      drawerContent={(props) => (
        <CustomDrawerContent {...props} />
      )}
    >
      <Drawer.Screen
        name="Dashboard"
        component={Dashboard}
        options={{ drawerLabel: "Dashboard" }}
      />
      <Drawer.Screen
        name="LevelChoice"
        component={LevelChoice}
        options={{ drawerLabel: "Level Choice" }}
      />
      <Drawer.Screen
        name="Login"
        component={Login}
        options={{ drawerLabel: "Login" }}
      />
      <Drawer.Screen
        name="Logout"
        component={Logout}
        options={{ drawerLabel: "Logout" }}
      />
    </Drawer.Navigator>
  );
};

export default function App() {
  const [checked, setChecked] = useState(false);
  const [initialRoute, setInitialRoute] = useState('Login');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isGuest, setIsGuest] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const user = await VerificationCheck.CheckUserLogin();
      const guest = await VerificationCheck.CheckGuestLogin();
      if (!mounted) return;
      setIsLoggedIn(user);
      setIsGuest(guest);
      setInitialRoute(user || guest ? 'Dashboard' : 'Login');
      setChecked(true);
    })();
    return () => { mounted = false; };
  }, []);

  if (!checked) {
    // simple loading screen while we decide initial route
    return (
      <View style={styles.container}>
        <LinearGradient colors={['purple', 'gold']} style={styles.linearBGContainer} />
        <StatusBar style="auto" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["purple", "gold"]}
        style={styles.linearBGContainer}
      >
        <NavigationContainer>
          <StackedScreens
            initialRouteName={initialRoute}
            isLoggedIn={isLoggedIn}
            isGuest={isGuest}
          />
        </NavigationContainer>
      </LinearGradient>
      <StatusBar style="auto" />
    </View>
  );
}

const headerStyle = (navigation) => {
  return {
    title: "Catching Souls",
    headerStyle: { backgroundColor: "purple" },
    headerTintColor: "white",
    headerTitleAlign: "center",
    headerTitleStyle: {
      fontSize: 25,
      fontWeight: "bold"
    },
    headerLeft: () => null, // This removes the left hamburger menu
    headerRight: () => (
      // This adds the hamburger menu to the right
      <Icon
        name="menu"
        size={25}
        color="white"
        style={{ marginRight: 15 }}
        onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
      />
    ),
    drawerPosition: "right"
  };
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  },
  linearBGContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  }
});