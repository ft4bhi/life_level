import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Typography, Spacing, BorderRadius } from '@/constants/theme';
import { mockUser } from '@/constants/mockData';
import { useRouter } from 'expo-router';

export default function ProfileScreen() {
  const router = useRouter();

  const handleSignOut = () => {
    Alert.alert('Sign Out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Log Out', style: 'destructive', onPress: () => router.replace('/onboarding') }
    ]);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Header Profile Section */}
        <View style={styles.header}>
          <View style={styles.avatarLarge}>
            <Text style={styles.avatarText}>{mockUser.username[0].toUpperCase()}</Text>
          </View>
          <Text style={styles.username}>@{mockUser.username}</Text>
          <Text style={styles.email}>{mockUser.email}</Text>
        </View>

        {/* Stats Row */}
        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{mockUser.totalDays}</Text>
            <Text style={styles.statLabel}>Total Days</Text>
          </View>
          <View style={[styles.statBox, styles.statBoxMiddle]}>
            <Text style={styles.statValue}>{mockUser.currentStreak}</Text>
            <Text style={styles.statLabel}>Current Streak</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{mockUser.longestStreak}</Text>
            <Text style={styles.statLabel}>Max Streak</Text>
          </View>
        </View>

        {/* Settings List */}
        <View style={styles.settingsGroup}>
          <Text style={styles.groupTitle}>Preferences</Text>
          <TouchableOpacity style={styles.settingItem}>
            <Text style={styles.settingLabel}>Daily Reminder</Text>
            <View style={styles.settingValueContainer}>
              <Text style={styles.settingValue}>{mockUser.reminderTime}</Text>
              <Text style={styles.chevron}>›</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingItem}>
            <Text style={styles.settingLabel}>Default Privacy</Text>
            <View style={styles.settingValueContainer}>
              <Text style={styles.settingValue}>{mockUser.privacyDefault === 'private' ? '🔒 Private' : '🌎 Public'}</Text>
              <Text style={styles.chevron}>›</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.settingsGroup}>
          <Text style={styles.groupTitle}>Account</Text>
          <TouchableOpacity style={styles.settingItem}>
            <Text style={styles.settingLabel}>Export Data</Text>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingItem} onPress={handleSignOut}>
            <Text style={[styles.settingLabel, { color: Colors.error }]}>Sign Out</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scrollContent: { padding: Spacing.xl },
  header: { alignItems: 'center', marginBottom: Spacing['3xl'], mt: Spacing.xl },
  avatarLarge: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: Colors.goldDark,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  avatarText: { fontFamily: Typography.fontFamily.bold, fontSize: 32, color: Colors.textPrimary },
  username: { fontFamily: Typography.fontFamily.bold, fontSize: Typography.sizes.xl, color: Colors.textPrimary, marginBottom: 4 },
  email: { fontFamily: Typography.fontFamily.regular, fontSize: Typography.sizes.sm, color: Colors.textSecondary },
  statsContainer: {
    flexDirection: 'row', backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg, padding: Spacing.md,
    marginBottom: Spacing['3xl'], borderWidth: 1, borderColor: Colors.border,
  },
  statBox: { flex: 1, alignItems: 'center' },
  statBoxMiddle: { borderLeftWidth: 1, borderRightWidth: 1, borderColor: Colors.border },
  statValue: { fontFamily: Typography.fontFamily.bold, fontSize: Typography.sizes.xl, color: Colors.gold, marginBottom: 4 },
  statLabel: { fontFamily: Typography.fontFamily.medium, fontSize: Typography.sizes.xs, color: Colors.textSecondary },
  settingsGroup: { marginBottom: Spacing['2xl'] },
  groupTitle: { fontFamily: Typography.fontFamily.semiBold, fontSize: Typography.sizes.sm, color: Colors.textMuted, textTransform: 'uppercase', marginBottom: Spacing.md, letterSpacing: 1 },
  settingItem: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingVertical: Spacing.md, borderBottomWidth: 1, borderBottomColor: Colors.divider,
  },
  settingLabel: { fontFamily: Typography.fontFamily.medium, fontSize: Typography.sizes.base, color: Colors.textPrimary },
  settingValueContainer: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  settingValue: { fontFamily: Typography.fontFamily.medium, fontSize: Typography.sizes.sm, color: Colors.textSecondary },
  chevron: { fontFamily: Typography.fontFamily.regular, fontSize: 20, color: Colors.textMuted, marginBottom: 2 },
});
