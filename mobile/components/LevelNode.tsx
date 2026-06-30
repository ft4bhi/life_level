import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Animated, Easing } from 'react-native';
import { Colors, Typography, Shadows } from '@/constants/theme';
import { LevelNode as LevelNodeType } from '@/constants/mockData';
import { useRouter } from 'expo-router';

interface Props {
  node: LevelNodeType;
  size?: number;
}

export function LevelNode({ node, size = 60 }: Props) {
  const router = useRouter();
  
  const pulseAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (node.status === 'active') {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1500,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          })
        ])
      ).start();
    }
  }, [node.status, pulseAnim]);

  const scale = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.3]
  });
  
  const opacity = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.6, 0]
  });

  const animatedRingStyle = {
    transform: [{ scale }],
    opacity,
  };

  const handlePress = () => {
    if (node.status === 'active') {
      router.push('/journal/new');
    } else if (node.status === 'completed' && node.journal) {
      router.push(`/journal/${node.journal.id}`);
    }
  };

  const isCompleted = node.status === 'completed';
  const isActive = node.status === 'active';
  const isLocked = node.status === 'locked';
  const isMissed = node.status === 'missed';

  return (
    <View style={styles.container}>
      {isActive && (
        <Animated.View
          style={[
            styles.activeRing,
            { width: size + 20, height: size + 20, borderRadius: (size + 20) / 2 },
            animatedRingStyle,
          ]}
        />
      )}

      <TouchableOpacity
        activeOpacity={0.8}
        onPress={handlePress}
        disabled={isLocked || isMissed}
        style={[
          styles.node,
          { width: size, height: size, borderRadius: size / 2 },
          isCompleted && styles.completedNode,
          isActive && styles.activeNode,
          isLocked && styles.lockedNode,
          isMissed && styles.missedNode,
          (isCompleted || isActive) && Shadows.glow,
        ]}
      >
        {isLocked && <Text style={styles.iconText}>🔒</Text>}
        {isMissed && <Text style={styles.iconText}>✕</Text>}
        {isCompleted && <Text style={styles.iconText}>✦</Text>}
        {isActive && <Text style={styles.iconText}>✏️</Text>}
      </TouchableOpacity>

      <Text style={styles.dayLabel}>Day {node.dayNumber}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 40, // Space between nodes
  },
  node: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.levelLocked,
    borderWidth: 2,
    borderColor: Colors.border,
    zIndex: 2,
  },
  completedNode: {
    backgroundColor: Colors.levelCompleted,
    borderColor: Colors.goldLight,
  },
  activeNode: {
    backgroundColor: Colors.levelActive,
    borderColor: Colors.goldLight,
    transform: [{ scale: 1.1 }],
  },
  lockedNode: {
    backgroundColor: Colors.levelLocked,
  },
  missedNode: {
    backgroundColor: Colors.levelMissed,
    opacity: 0.7,
  },
  activeRing: {
    position: 'absolute',
    backgroundColor: Colors.levelActiveRing,
    zIndex: 1,
  },
  iconText: {
    fontSize: Typography.sizes.lg,
    color: '#000',
  },
  dayLabel: {
    position: 'absolute',
    right: -80, // Offset label to the right
    fontFamily: Typography.fontFamily.semiBold,
    fontSize: Typography.sizes.sm,
    color: Colors.textSecondary,
    width: 60,
  },
});
