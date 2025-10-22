import React, { useState, useEffect } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CompanyLogo from "../assets/Images/Logo_Transparent.png";
import TimeOfDay from "../functions/timeOfDay";
import { API } from "../config/constants";
import VerificationCheck from "../functions/verificationCheck";

const Dashboard = () => {
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(true);
  const [TOD] = useState(TimeOfDay());
  const [firstName, setFirstName] = useState(null);
  const [lastName, setLastName] = useState(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const isUser = await VerificationCheck.CheckLogin();
      const isGuest = !!(await AsyncStorage.getItem("catchingSoulsGuestLoggedin"));

      if (!isUser && !isGuest) {
        if (mounted) navigation.navigate("Login");
        return;
      }

      if (isGuest) {
        if (mounted) setFirstName("Guest");
      } else {
        const props = await VerificationCheck.GetUserProps();
        if (mounted && props) {
          setFirstName(props.accountFirstName || "Friend");
          setLastName(props.accountLastName || "");
        }
      }

      if (mounted) setIsLoading(false);
    })();

    return () => {
      mounted = false;
    };
  }, [navigation]);

  return (
    <View style={styles.dashboardContainer}>
      <View style={styles.dashboardForm}>
        {isLoading ? (
          <>
            <Text>Loading...</Text>
          </>
        ) : (
          <>
            <Image
              source={CompanyLogo}
              style={styles.dashboardImage}
              alt="Catching Souls Logo"
            />
            <Text style={styles.dashboardHeader}>
              {TOD} {firstName},
            </Text>
            <Text style={styles.dashboardText}>
              Do you know your bible enough to spread the lord's message and
              save souls?
            </Text>
            <Text style={styles.dashboardText}>
              How about seeing the number of souls you can save with some
              questions?
            </Text>
            <Pressable style={styles.dashboardButton}>
              <Text style={styles.dashboardButtonText}>
                How Many Souls Can you Save?
              </Text>
            </Pressable>
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  dashboardContainer: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  },
  dashboardForm: {
    alignItems: "center",
    justifyContent: "center",
    borderColor: "purple",
    borderStyle: "solid",
    borderWidth: 4,
    borderRadius: 15,
    width: "85%"
  },
  dashboardImage: {
    height: 300,
    width: 300,
    margin: 0,
    padding: 0
  },
  dashboardHeader: {
    margin: 4,
    fontSize: 34,
    fontFamily: "Arial",
    fontWeight: "bold"
  },
  dashboardText: {
    margin: 4,
    fontSize: 16,
    fontFamily: "Arial",
    textAlign: "center",
    width: 300
  },
  dashboardButton: {
    backgroundColor: "gold",
    color: "black",
    padding: 10,
    margin: 25,
    width: "85%",
    alignItems: "center",
    justifyContent: "center",
    borderColor: "purple",
    borderStyle: "solid",
    borderWidth: 2,
    borderRadius: 15
  },
  dashboardButtonText: {
    fontFamily: "Arial",
    fontSize: 16,
    fontWeight: "bold"
  }
});

export default Dashboard;