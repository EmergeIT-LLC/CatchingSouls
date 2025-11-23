//Dependencies
import "react-native-gesture-handler"; // MUST be first
import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { DrawerActions, NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { MaterialIcons } from '@expo/vector-icons';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import VerificationCheck from "./functions/verificationCheck";

//Screens
import About from "./screens/About";
import Contact from "./screens/Contact";
import Dashboard from "./screens/Dashboard";
import LevelChoice from "./screens/LevelChoice";
import LevelChoiceSelected from "./screens/LevelChoiceSelected";
import Login from "./screens/Login";
import Logout from "./screens/Logout";
import Profile from "./screens/Profile";
import ProfileDelete from "./screens/ProfileDelete";
import ProfileUpdate from "./screens/ProfileUpdate";
import Register from "./screens/Register";
import SendUsYourQuestions from "./screens/SendUsYourQuestions";
import AccountVerification from "./screens/AccountVerification";
import AdminTools from "./screens/AdminTools";
import AdminToolsManageAccount from "./screens/AdminToolsManageAccount";
import AdminToolsManageAccountDetail from "./screens/AdminToolsManageAccountDetail";
import AdminToolsManageAccountUpdate from "./screens/AdminToolsManageAccountUpdate";
import AdminToolsManageDatabase from "./screens/AdminToolsManageDatabase";
import AdminToolsManageTrivia from "./screens/AdminToolsManageTrivia";
import AdminToolsManageTriviaAdd from "./screens/AdminToolsManageTriviaAdd";
import AdminToolsManageTriviaDelete from "./screens/AdminToolsManageTriviaDelete";
import AdminToolsManageTriviaDetail from "./screens/AdminToolsManageTriviaDetail";
import AdminToolsManageTriviaUpdate from "./screens/AdminToolsManageTriviaUpdate";
import AdminToolsVerification from "./screens/AdminToolsVerification";

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
              label="Register"
              onPress={() => props.navigation.navigate('Register')}
            />
            <DrawerItem
              label="Login"
              onPress={() => props.navigation.navigate('Login')}
            />
          </>
        ) : (
          <>
            <DrawerItem
              label="Admin Tools"
              onPress={() => props.navigation.navigate('AdminTools')}
            />
            <DrawerItem
              label="Dashboard"
              onPress={() => props.navigation.navigate('Dashboard')}
            />
            <DrawerItem
              label="Profile"
              onPress={() => props.navigation.navigate('Profile')}
            />
            <DrawerItem
              label="Logout"
              onPress={() => props.navigation.navigate('Logout')}
            />
          </>
        )}
        <DrawerItem
          label="About Us"
          onPress={() => props.navigation.navigate('About')}
        />
        <DrawerItem
          label="Contact Us"
          onPress={() => props.navigation.navigate('Contact')}
        />
        <DrawerItem
          label="Send Us Your Questions"
          onPress={() => props.navigation.navigate('SendUsYourQuestions')}
        />
      </DrawerContentScrollView>
    );
  };

  return (
    <Drawer.Navigator
      initialRouteName={initialRouteName}
      screenOptions={({ navigation }) => headerStyle(navigation)}
      drawerPosition="right"
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen
        name="About"
        component={About}
        options={{ drawerLabel: "About Us" }}
      />
      <Drawer.Screen
        name="Contact"
        component={Contact}
        options={{ drawerLabel: "Contact Us" }}
      />
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
        name="LevelChoiceSelected"
        component={LevelChoiceSelected}
        options={{ drawerLabel: "Level Choice Selected" }}
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
      <Drawer.Screen
        name="Profile"
        component={Profile}
        options={{ drawerLabel: "Profile" }}
      />
      <Drawer.Screen
        name="ProfileDelete"
        component={ProfileDelete}
        options={{ drawerLabel: "Profile Delete" }}
      />
      <Drawer.Screen
        name="ProfileUpdate"
        component={ProfileUpdate}
        options={{ drawerLabel: "Profile Update" }}
      />
      <Drawer.Screen
        name="Register"
        component={Register}
        options={{ drawerLabel: "Register" }}
      />
      <Drawer.Screen
        name="SendUsYourQuestions"
        component={SendUsYourQuestions}
        options={{ drawerLabel: "Send Us Your Trivia Questions" }}
      />
      <Drawer.Screen
        name="AccountVerification"
        component={AccountVerification}
        options={{ drawerLabel: "Account Verification" }}
      />
      <Drawer.Screen
        name="AdminTools"
        component={AdminTools}
        options={{ drawerLabel: "Admin Tools" }}
      />
      <Drawer.Screen
        name="AdminToolsManageAccount"
        component={AdminToolsManageAccount}
        options={{ drawerLabel: "Manage Admin Accounts" }}
      />
      <Drawer.Screen
        name="AdminToolsManageAccountDetail"
        component={AdminToolsManageAccountDetail}
        options={{ drawerLabel: "Admin Account Detail" }}
      />
      <Drawer.Screen
        name="AdminToolsManageAccountUpdate"
        component={AdminToolsManageAccountUpdate}
        options={{ drawerLabel: "Admin Account Update" }}
      />
      <Drawer.Screen
        name="AdminToolsManageTrivia"
        component={AdminToolsManageTrivia}
        options={{ drawerLabel: "Manage Trivia Questions" }}
      />
      <Drawer.Screen
        name="AdminToolsManageTriviaAdd"
        component={AdminToolsManageTriviaAdd}
        options={{ drawerLabel: "Add Trivia Question" }}
      />
      <Drawer.Screen
        name="AdminToolsManageTriviaDetail"
        component={AdminToolsManageTriviaDetail}
        options={{ drawerLabel: "Trivia Question Detail" }}
      />
      <Drawer.Screen
        name="AdminToolsManageTriviaUpdate"
        component={AdminToolsManageTriviaUpdate}
        options={{ drawerLabel: "Update Trivia Question" }}
      />
      <Drawer.Screen
        name="AdminToolsManageTriviaDelete"
        component={AdminToolsManageTriviaDelete}
        options={{ drawerLabel: "Delete Trivia Question" }}
      />
      <Drawer.Screen
        name="AdminToolsManageDatabase"
        component={AdminToolsManageDatabase}
        options={{ drawerLabel: "Manage Database" }}
      />
      <Drawer.Screen
        name="AdminToolsVerification"
        component={AdminToolsVerification}
        options={{ drawerLabel: "Admin Verification" }}
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
        <GestureHandlerRootView style={{ flex: 1 }}>
          <NavigationContainer>
            <StackedScreens
              initialRouteName={initialRoute}
              isLoggedIn={isLoggedIn}
              isGuest={isGuest}
            />
          </NavigationContainer>
        </GestureHandlerRootView>
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
      <MaterialIcons
        name="menu"
        size={28}
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