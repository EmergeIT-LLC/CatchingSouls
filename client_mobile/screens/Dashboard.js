import React, { useState, useEffect } from "react";
import { Image, Pressable, Text, View } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import CompanyLogo from "../assets/Images/Logo_Transparent.png";
import TimeOfDay from "../functions/timeOfDay";
import VerificationCheck from "../functions/verificationCheck";
import { dashboardStyles } from '../styles/screenStyles';

const Dashboard = () => {
  const navigation = useNavigation();
  const [TOD] = useState(TimeOfDay());
  const [isLoading, setIsLoading] = useState(true);
  const [firstName, setFirstName] = useState(null);
  const [lastName, setLastName] = useState(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const isUser = await VerificationCheck.CheckUserLogin();
        const isGuest = await VerificationCheck.CheckGuestLogin();

        if (!isUser && !isGuest) {
          if (mounted) navigation.reset({ index: 0, routes: [{ name: "Login" }] });
          return;
        }

        if (isGuest) {
          if (mounted) setFirstName("Guest");
        } else {
          const props = await VerificationCheck.GetUserProps();
          if (mounted && props) {
            const payload = props.data ?? props;
            setFirstName(payload.user.accountFirstName || "Friend");
            setLastName(payload.user.accountLastName || null);
          }
        }
      } catch (err) {
        if (mounted) navigation.reset({ index: 0, routes: [{ name: "Login" }] });
      } finally {
        if (mounted) setIsLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [navigation]);

  return (
    <View style={{flex: 1, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center'}}>
      <View style={{alignItems: 'center', justifyContent: 'center', borderColor: 'purple', borderWidth: 4, borderRadius: 15, width: '85%', padding: 16}}>
        {isLoading ? (
          <Text>Loading...</Text>
        ) : (
          <>
            <Image source={CompanyLogo} style={{width: 300, height: 300}} alt="Catching Souls Logo" />
            <Text style={{margin: 4, fontSize: 34, fontWeight: 'bold', textAlign: 'center'}}>
              {TOD} {lastName ? `${firstName} ${lastName}` : `${firstName}`},
            </Text>
            <Text style={{margin: 4, fontSize: 16, textAlign: 'center', width: 300}}>
              Do you know your bible enough to spread the lord's message and save souls?
            </Text>
            <Text style={{margin: 4, fontSize: 16, textAlign: 'center', width: 300}}>
              How about seeing the number of souls you can save with some questions?
            </Text>
            <Pressable 
              style={{backgroundColor: 'gold', padding: 10, margin: 25, width: '85%', alignItems: 'center', justifyContent: 'center', borderColor: 'purple', borderWidth: 2, borderRadius: 15}} 
              onPress={() => navigation.navigate("LevelChoice")}
            >
              <Text style={{fontSize: 18, fontWeight: 'bold'}}>
                How Many Souls Can you Save?
              </Text>
            </Pressable>
          </>
        )}
      </View>
    </View>
  );
};

export default Dashboard;