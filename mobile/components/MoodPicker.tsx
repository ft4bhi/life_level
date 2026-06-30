import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Moods, MoodType, Colors, Spacing, BorderRadius } from '@/constants/theme';

interface Props {
  selectedMood: MoodType | null;
  onSelect: (mood: MoodType) => void;
}

export function MoodPicker({ selectedMood, onSelect }: Props) {
  return (
    <View style={styles.container}>
      {Object.entries(Moods).map(([key, { emoji }]) => {
        const isSelected = selectedMood === key;
        return (
          <TouchableOpacity
            key={key}
            style={[styles.moodBtn, isSelected && styles.moodBtnSelected]}
            onPress={() => onSelect(key as MoodType)}
            activeOpacity={0.7}
          >
            <Text style={[styles.emoji, isSelected && styles.emojiSelected]}>{emoji}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: Spacing.md,
  },
  moodBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  moodBtnSelected: {
    backgroundColor: Colors.surfaceLight,
    borderColor: Colors.gold,
  },
  emoji: { fontSize: 24, opacity: 0.5 },
  emojiSelected: { opacity: 1, transform: [{ scale: 1.1 }] },
});
