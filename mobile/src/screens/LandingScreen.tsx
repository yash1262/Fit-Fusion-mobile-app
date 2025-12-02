import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import HeartLogo from '../components/HeartLogo';

const LandingScreen = ({ navigation }: any) => {
  return (
    <ScrollView style={styles.container}>
      {/* Hero Section */}
      <LinearGradient
        colors={['#708d50', '#5a7340']}
        style={styles.hero}
      >
        <View style={styles.heroLogo}>
          <HeartLogo size={100} color="#fff" />
        </View>
        <Text style={styles.heroTitle}>Transform Your Fitness Journey</Text>
        <Text style={styles.heroSubtitle}>
          AI-powered coaching, personalized workouts, and comprehensive tracking
        </Text>
        <View style={styles.heroButtons}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => navigation.navigate('SignUp')}
          >
            <Text style={styles.primaryButtonText}>Get Started Free</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => navigation.navigate('SignIn')}
          >
            <Text style={styles.secondaryButtonText}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Features */}
      <View style={styles.features}>
        <Text style={styles.sectionTitle}>Why Choose Fit Fusion?</Text>
        
        <View style={styles.featureCard}>
          <View style={styles.featureIcon}>
            <Icon name="robot" size={40} color="#708d50" />
          </View>
          <Text style={styles.featureTitle}>AI-Powered Coaching</Text>
          <Text style={styles.featureText}>
            Get personalized workout and nutrition recommendations based on your goals
          </Text>
        </View>

        <View style={styles.featureCard}>
          <View style={styles.featureIcon}>
            <Icon name="walk" size={40} color="#708d50" />
          </View>
          <Text style={styles.featureTitle}>Real-Time Step Tracking</Text>
          <Text style={styles.featureText}>
            Automatic step counting using your phone's motion sensors
          </Text>
        </View>

        <View style={styles.featureCard}>
          <View style={styles.featureIcon}>
            <Icon name="bell-ring" size={40} color="#708d50" />
          </View>
          <Text style={styles.featureTitle}>Smart Reminders</Text>
          <Text style={styles.featureText}>
            Morning water reminders and weather-based meal suggestions
          </Text>
        </View>

        <View style={styles.featureCard}>
          <View style={styles.featureIcon}>
            <Icon name="chart-line" size={40} color="#708d50" />
          </View>
          <Text style={styles.featureTitle}>Progress Analytics</Text>
          <Text style={styles.featureText}>
            Track your fitness journey with detailed charts and insights
          </Text>
        </View>
      </View>

      {/* CTA */}
      <View style={styles.cta}>
        <Text style={styles.ctaTitle}>Ready to Start?</Text>
        <Text style={styles.ctaText}>
          Join thousands of users transforming their fitness journey
        </Text>
        <TouchableOpacity
          style={styles.ctaButton}
          onPress={() => navigation.navigate('SignUp')}
        >
          <LinearGradient
            colors={['#708d50', '#5a7340']}
            style={styles.ctaGradient}
          >
            <Text style={styles.ctaButtonText}>Create Free Account</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  hero: {
    padding: 40,
    paddingTop: 60,
    alignItems: 'center',
  },
  heroLogo: {
    marginBottom: 24,
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 16,
  },
  heroSubtitle: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    opacity: 0.9,
    marginBottom: 32,
  },
  heroButtons: {
    width: '100%',
    gap: 12,
  },
  primaryButton: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#708d50',
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  secondaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  features: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1a1a1a',
    textAlign: 'center',
    marginBottom: 24,
  },
  featureCard: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 16,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  featureIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#708d5015',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  featureText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
  cta: {
    padding: 40,
    alignItems: 'center',
  },
  ctaTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1a1a1a',
    marginBottom: 12,
  },
  ctaText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  ctaButton: {
    width: '100%',
    borderRadius: 12,
    overflow: 'hidden',
  },
  ctaGradient: {
    padding: 16,
    alignItems: 'center',
  },
  ctaButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default LandingScreen;
