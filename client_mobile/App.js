//Dependencies
import "react-native-gesture-handler";
import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { AsyncStorage, Button, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {
  DrawerActions,
  NavigationContainer,
  useNavigation
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Icon } from "react-native-elements";
import { createDrawerNavigator } from "@react-navigation/drawer";
import VerificationCheck from "./functions/verificationCheck";

//Screens
import Dashboard from "./screens/Dashboard";
import Login from "./screens/Login";
import Logout from "./screens/Logout";

//Code
const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

const StackedScreens = () => {
  const navigation = useNavigation();
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [guestLoggedIn, setGuestLoggedIn] = useState(false);

  useEffect(() => {
    const init = async () => {
      const isUser = await VerificationCheck.CheckLogin();
      const isGuest = !!(await AsyncStorage.getItem(
        "catchingSoulsGuestLoggedin"
      ));
      setUserLoggedIn(isUser);
      setGuestLoggedIn(isGuest);
    };
    init();
  }, []);

  return (
    <Drawer.Navigator
      //initialRouteName={userLoggedIn || guestLoggedIn ? "Dashboard" : "Login"}
      initialRouteName="Dashboard" //Temporarily disable login requirement
      screenOptions={headerStyle(navigation)}
      drawerPosition="right"
    >
      <Drawer.Screen
        name="Dashboard"
        component={Dashboard}
        options={{ drawerLabel: "Dashboard" }}
      />

      {!userLoggedIn && !guestLoggedIn ? (
        <Drawer.Screen
          name="Login"
          component={Login}
          options={{ drawerLabel: "Login" }}
        />
      ) : (
        <Drawer.Screen
          name="Logout"
          component={Logout}
          options={{ drawerLabel: "Logout" }}
        />
      )}
    </Drawer.Navigator>
  );
};

export default function App() {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["purple", "gold"]}
        style={styles.linearBGContainer}
      >
        <NavigationContainer>
          <StackedScreens />
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