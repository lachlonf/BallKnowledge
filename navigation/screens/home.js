import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>
        Welcome to Ball Knowledge!
      </Text>

      <Text style={styles.descriptionText}>
      Dive into the world of NBA with Ball Knowledge, your go-to app for staying updated on the latest basketball action. We deliver your daily dose of NBA excitement, providing highlights, scores, and key statistics, so you never miss a slam dunk or buzzer-beater again.
      </Text>

      <TouchableOpacity onPress={() => navigation.navigate('Games')}>
        <Text style={styles.buttonText}>
          Get Started
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  descriptionText: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 30,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'grey', // Adjust the color as needed
  },
});