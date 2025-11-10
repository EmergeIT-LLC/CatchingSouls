import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import PrimaryButton from '../components/PrimaryButton';
import { useNavigation, useRoute } from '@react-navigation/native';
import VerificationCheck from '../functions/verificationCheck';

const LevelChoice = () => {
  const navigation = useNavigation();
    const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const init = async () => {
      const loggedIn = await VerificationCheck.CheckUserLogin();
      const guestLoggedIn = await VerificationCheck.CheckGuestLogin();
      if (!loggedIn && !guestLoggedIn) navigation.navigate("Login");
    };
    init();
  }, [navigation]);

  return (
    <View style={styles.container}>
        <View style={styles.form}>
            <Text style={styles.title}>Trivia Levels</Text>
            <Text style={styles.text}>Beginner: +1 Point</Text>
            <Text style={styles.text}>Intermediate: +2 Point</Text>
            <Text style={styles.text}>Advanced: +3 Point</Text>
            <View style={styles.levelButtons}>
                <PrimaryButton
                  title="Beginner"
                  onPress={() => navigation.navigate('LevelChoiceSelected', { SelectedLevel: 'Beginner' })}
                />
                <PrimaryButton
                  title="Intermediate"
                  onPress={() => navigation.navigate('LevelChoiceSelected', { SelectedLevel: 'Intermediate' })}
                />
                <PrimaryButton
                  title="Advance"
                  onPress={() => navigation.navigate('LevelChoiceSelected', { SelectedLevel: 'Advance' })}
                />
            </View>
        </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  form: {
    width: "85%",
    borderWidth: 4,
    borderRadius: 16,
    borderColor: "purple",
    alignItems: "center",
    paddingVertical: 16,
  },
  logo: { width: 200, height: 200, marginTop: 8 },
  title: {
    fontSize: 28,
    marginVertical: 12,
    fontWeight: "700",
  },
  text : {
    fontSize: 16,
    marginVertical: 8,
  },
  input: {
    width: 260,
    height: 44,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  button: {
    width: 260,
    height: 44,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "purple",
    backgroundColor: "gold",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
  },
  buttonText: { color: "black", fontWeight: "bold" },
  linksRow: { flexDirection: "row", alignItems: "center", marginTop: 12 },
  link: { color: "purple", textDecorationLine: "none" },
  linkDivider: { color: "black", marginHorizontal: 4 },
  status: { marginTop: 12, color: "crimson" },
});

export default LevelChoice;