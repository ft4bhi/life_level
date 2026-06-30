import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LevelNode } from '@/components/LevelNode';
import { MapPath } from '@/components/MapPath';
import { mockLevels, mockUser } from '@/constants/mockData';
import { Colors, Typography, Spacing, Shadows, BorderRadius } from '@/constants/theme';
import { useRouter } from 'expo-router';

export default function LevelMapScreen() {
  const router = useRouter();
  
  // Inverse so we scroll from bottom (recent) to top (oldest), or just straight chronological
  // Usually games go bottom up, so let's reverse the array for display
  const displayLevels = [...mockLevels].reverse();
  const NODE_SPACING = 140; // Total vertical space per node

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Top Bar */}
      <View style={styles.header}>
        <Text style={styles.logo}>Life Levels</Text>
        <View style={styles.headerRight}>
          <View style={styles.streakBadge}>
            <Text style={styles.streakIcon}>🔥</Text>
            <Text style={styles.streakCount}>{mockUser.currentStreak}</Text>
          </View>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{mockUser.username[0].toUpperCase()}</Text>
          </View>
        </View>
      </View>

      {/* Map Area */}
      <ScrollView 
        contentContainerStyle={[styles.mapContainer, { paddingBottom: 100 }]}
        showsVerticalScrollIndicator={false}
      >
        <MapPath nodeCount={displayLevels.length} nodeSpacing={NODE_SPACING} />
        
        {displayLevels.map((node, index) => {
          // Add alternating horizontal offset for the winding visual
          const offset = index % 2 === 0 ? 50 : -50;
          return (
            <View key={node.dayNumber} style={{ transform: [{ translateX: offset }] }}>
              <LevelNode node={node} />
            </View>
          );
        })}
      </ScrollView>

      {/* Floating Action Button for Today */}
      <TouchableOpacity 
        style={styles.fab}
        activeOpacity={0.9}
        onPress={() => router.push('/journal/new')}
      >
        <Text style={styles.fabIcon}>✏️</Text>
        <Text style={styles.fabText}>Write Today's Entry</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.background,
    zIndex: 10, // Above the scrolling map
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  logo: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: Typography.sizes.lg,
    color: Colors.textPrimary,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  streakIcon: {
    fontSize: 16,
    marginRight: 4,
  },
  streakCount: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: Typography.sizes.sm,
    color: Colors.textPrimary,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.goldDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontFamily: Typography.fontFamily.bold,
    color: Colors.textPrimary,
  },
  mapContainer: {
    alignItems: 'center',
    paddingTop: Spacing['3xl'],
  },
  fab: {
    position: 'absolute',
    bottom: Spacing['xl'],
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.gold,
    paddingHorizontal: Spacing['2xl'],
    paddingVertical: Spacing.base,
    borderRadius: BorderRadius.full,
    ...Shadows.glow,
  },
  fabIcon: {
    fontSize: Typography.sizes.md,
    marginRight: Spacing.sm,
  },
  fabText: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: Typography.sizes.base,
    color: Colors.buttonPrimaryText,
  },
});
