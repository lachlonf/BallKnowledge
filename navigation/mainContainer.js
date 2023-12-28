import * as React from 'react';
import { View, Text } from 'react-native';
import { StatusBar } from 'expo-status-bar';

import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

import HomeScreen from './screens/home';
import NewsScreen from './screens/news';
import GamesScreen from './screens/games';
import StandingsScreen from './screens/standings'

const homeName = "Home";
const gamesName = "Games";
const newsName = "News";
const standingsName = "Standings";


const Tab = createBottomTabNavigator();

function mainContainer() {
    return (
        <NavigationContainer>
            <Tab.Navigator
                initialRouteName={homeName}
                screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;
                    let rn = route.name;

                    if (rn === homeName) {
                        iconName = focused ? 'home' : 'home-outline';
                    } else if (rn === gamesName) {
                        iconName = focused ? 'basketball' : 'basketball-outline';
                    } else if (rn === newsName) {
                        iconName = focused ? 'newspaper' : 'newspaper-outline';
                    } else if (rn === standingsName) {
                        iconName = focused ? 'stats-chart' : 'stats-chart-outline'
                    }
                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: "grey",
                tabBarStyle:[{
                    display: "flex"
                },
                null
                ]
                })}>

                <Tab.Screen name={homeName} component = {HomeScreen}/>
                <Tab.Screen name={gamesName} component = {GamesScreen}/>
                <Tab.Screen name={standingsName} component = {StandingsScreen}/>
                <Tab.Screen name={newsName} component = {NewsScreen}/>
            </Tab.Navigator>

        <StatusBar style="auto" />
        </NavigationContainer>
    )
}

export default mainContainer;