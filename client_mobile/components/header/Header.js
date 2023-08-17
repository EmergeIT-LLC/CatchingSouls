import React from 'react';
import {Text, View, StyleSheet} from 'react-native';

const Header = () => {
    return (
        <View style={styles.headerContainer}>
            <Text>Catching Souls</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    headerContainer : {
        backgroundColor: 'purple',
        alignItems: 'center',
        justifyContent: 'center',
    }
})

export default Header;