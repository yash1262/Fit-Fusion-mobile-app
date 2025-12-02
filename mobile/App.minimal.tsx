import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';

export default function App() {
  const [count, setCount] = React.useState(0);

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      <View style={styles.header}>
        <Text style={styles.logo}>💪</Text>
        <Text style={styles.title}>FitFusion</Text>
        <Text style={styles.subtitle}>AI-Powered Fitness Platform</Text>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>✅ App Status</Text>
          <Text style={styles.cardText}>Running Successfully!</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>📱 Features</Text>
          <Text style={styles.feature}>• Smart Workout Recommendations</Text>
          <Text style={styles.feature}>• AI Fitness Coach</Text>
          <Text style={styles.feature}>• Meal Planning</Text>
          <Text style={styles.feature}>• Progress Tracking</Text>
          <Text style={styles.feature}>• Weather-Based Suggestions</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>🎯 Test Counter</Text>
          <Text style={styles.counterText}>{count}</Text>
          <TouchableOpacity style={styles.button} onPress={() => setCount(count + 1)}>
            <Text style={styles.buttonText}>Tap to Increment</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>ℹ️ Project Info</Text>
          <Text style={styles.infoText}>This is a working React Native app built with Expo.</Text>
          <Text style={styles.infoText}>Ready for your project presentation!</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#708d50',
    paddingTop: 60,
    paddingBottom: 30,
    alignItems: 'center',
  },
  logo: {
    fontSize: 60,
    marginBottom: 10,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  cardText: {
    fontSize: 16,
    color: '#4caf50',
    fontWeight: '600',
  },
  feature: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  counterText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#708d50',
    textAlign: 'center',
    marginVertical: 15,
  },
  button: {
    backgroundColor: '#708d50',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
    lineHeight: 20,
  },
});
