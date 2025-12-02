import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebaseConfig';

const ProfileScreen = ({ navigation }: any) => {
  const user = auth.currentUser;
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    if (!user) return;
    
    try {
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        setUserData(userDoc.data());
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            await signOut(auth);
            navigation.replace('Landing');
          },
        },
      ]
    );
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const menuItems = [
    {
      icon: 'bell-ring' as const,
      title: 'Notification Settings',
      subtitle: 'Manage your reminders',
      onPress: () => navigation.navigate('NotificationSettings'),
    },
    {
      icon: 'robot' as const,
      title: 'AI Coach',
      subtitle: 'Get personalized guidance',
      onPress: () => navigation.navigate('AiCoach'),
    },
    {
      icon: 'dumbbell' as const,
      title: 'Smart Workout',
      subtitle: 'AI-powered recommendations',
      onPress: () => navigation.navigate('SmartWorkout'),
    },
    {
      icon: 'help-circle' as const,
      title: 'Help & Support',
      subtitle: 'Get assistance',
      onPress: () => {},
    },
    {
      icon: 'information' as const,
      title: 'About',
      subtitle: 'App version 1.0.0',
      onPress: () => {},
    },
  ];

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#708d50" />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.profileAvatar}>
          <Text style={styles.avatarText}>
            {user?.displayName?.charAt(0) || user?.email?.charAt(0) || 'U'}
          </Text>
        </View>
        <Text style={styles.profileName}>
          {userData?.name || user?.displayName || 'User'}
        </Text>
        <Text style={styles.profileEmail}>{user?.email}</Text>
        <Text style={styles.memberSince}>
          Member since {formatDate(userData?.createdAt)}
        </Text>
      </View>

      {/* Account Details Card */}
      <View style={styles.detailsCard}>
        <View style={styles.detailsHeader}>
          <Text style={styles.detailsTitle}>Account Details</Text>
          <TouchableOpacity style={styles.editButton}>
            <Icon name="pencil" size={18} color="#708d50" />
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.detailRow}>
          <View style={styles.detailIcon}>
            <Icon name="account" size={20} color="#708d50" />
          </View>
          <View style={styles.detailInfo}>
            <Text style={styles.detailLabel}>Full Name</Text>
            <Text style={styles.detailValue}>{userData?.name || 'Not set'}</Text>
          </View>
        </View>

        <View style={styles.detailRow}>
          <View style={styles.detailIcon}>
            <Icon name="email" size={20} color="#708d50" />
          </View>
          <View style={styles.detailInfo}>
            <Text style={styles.detailLabel}>Email</Text>
            <Text style={styles.detailValue}>{user?.email}</Text>
          </View>
        </View>

        <View style={styles.detailRow}>
          <View style={styles.detailIcon}>
            <Icon name="calendar" size={20} color="#708d50" />
          </View>
          <View style={styles.detailInfo}>
            <Text style={styles.detailLabel}>Joined</Text>
            <Text style={styles.detailValue}>{formatDate(userData?.createdAt)}</Text>
          </View>
        </View>

        <View style={styles.detailRow}>
          <View style={styles.detailIcon}>
            <Icon name="shield-check" size={20} color="#708d50" />
          </View>
          <View style={styles.detailInfo}>
            <Text style={styles.detailLabel}>Account Status</Text>
            <Text style={[styles.detailValue, styles.activeStatus]}>Active</Text>
          </View>
        </View>
      </View>

      <ScrollView style={styles.content}>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.menuItem}
            onPress={item.onPress}
          >
            <View style={styles.menuIcon}>
              <Icon name={item.icon} size={24} color="#708d50" />
            </View>
            <View style={styles.menuInfo}>
              <Text style={styles.menuTitle}>{item.title}</Text>
              <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
            </View>
            <Icon name="chevron-right" size={24} color="#ccc" />
          </TouchableOpacity>
        ))}

        <TouchableOpacity
          style={[styles.menuItem, styles.signOutItem]}
          onPress={handleSignOut}
        >
          <View style={[styles.menuIcon, styles.signOutIcon]}>
            <Icon name="logout" size={24} color="#ff6b6b" />
          </View>
          <View style={styles.menuInfo}>
            <Text style={[styles.menuTitle, styles.signOutText]}>Sign Out</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    padding: 40,
    paddingTop: 60,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  profileAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#708d50',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: '800',
    color: '#fff',
  },
  profileName: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: '#666',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  menuIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#708d5015',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuInfo: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 2,
  },
  menuSubtitle: {
    fontSize: 12,
    color: '#666',
  },
  signOutItem: {
    marginTop: 24,
  },
  signOutIcon: {
    backgroundColor: '#ff6b6b15',
  },
  signOutText: {
    color: '#ff6b6b',
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  memberSince: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  detailsCard: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: -20,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 16,
  },
  detailsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  detailsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#708d5015',
    borderRadius: 8,
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#708d50',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 12,
  },
  detailIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#708d5015',
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailInfo: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  activeStatus: {
    color: '#4caf50',
  },
});

export default ProfileScreen;
