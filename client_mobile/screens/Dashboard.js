import React, { useState, useEffect } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import CompanyLogo from '../assets/Images/Logo_Transparent.png'
import TimeOfDay from '../functions/timeOfDay';

const Dashboard = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [TOD, setTOD] = useState(TimeOfDay);

    return (
        <View style={styles.dashboardContainer}>
            <View style={styles.dashboardForm}>
                {isLoading ? 
                    <>
                        <Text>Loading...</Text> 
                    </>
                    : 
                    <>
                        <Image source={CompanyLogo} style={styles.dashboardImage} alt ="Catching Souls Logo"/>
                        <Text style={styles.dashboardHeader}>{TOD},</Text>
                        <Text style={styles.dashboardText}>Do you know your bible enough to spread the lord's message and save souls?</Text>
                        <Text style={styles.dashboardText}>How about seeing the number of souls you can save with some questions?</Text>
                        <Pressable style={styles.dashboardButton}>
                            <Text style={styles.dashboardButtonText}>How Many Souls Can you Save?</Text>
                        </Pressable>
                    </>
                }
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    dashboardContainer: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    dashboardForm: {
        alignItems: 'center',
        justifyContent: 'center',        
        borderColor: 'purple',
        borderStyle: 'solid',
        borderWidth: 4,
        borderRadius: 15,
        width: '85%',
    },
    dashboardImage: {
        height: 300,
        width: 300,
        margin: 0,
        padding: 0,
    },
    dashboardHeader: {
        margin: 4,
        fontSize: 34,
        fontFamily: 'sans-serif',
        fontWeight: "bold",
    },
    dashboardText: {
        margin: 4,
        fontSize: 16,
        fontFamily: 'sans-serif',
        textAlign: 'center',
        width: 300,
    },
    dashboardButton: {
        backgroundColor: 'gold',
        color: 'black',
        padding: 10,
        margin: 25,
        width: '85%',
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: 'purple',
        borderStyle: 'solid',
        borderWidth: 2,
        borderRadius: 15,     

    },
    dashboardButtonText: {
        fontFamily: 'sans-serif',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default Dashboard;