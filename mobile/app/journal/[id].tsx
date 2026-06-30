import React, { useRef, useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import BottomSheet from '@gorhom/bottom-sheet';
import { Colors, Typography, Spacing, Moods, BorderRadius } from '@/constants/theme';
import { mockJournals } from '@/constants/mockData';
import { ShareSheet } from '@/components/ShareSheet';

export default function SingleJournalScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const bottomSheetRef = useRef<BottomSheet>(null);
  
  // Find journal by ID (or default to the first one for testing)
  const journal = mockJournals.find((j) => j.id === id) || mockJournals[0];

  const handleShare = () => {
    bottomSheetRef.current?.expand();
  };

  return (
    <>
      <SafeAreaView style={styles.container} edges={['top']}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
            <Text style={styles.headerIcon}>←</Text>
          </TouchableOpacity>
          
          <TouchableOpacity onPress={handleShare} style={styles.shareBtn}>
            <Text style={styles.shareIcon}>⤴</Text>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
          {/* Metadata Row */}
          <View style={styles.metaRow}>
            <View style={styles.dayBadge}>
              <Text style={styles.dayBadgeText}>Day {journal.dayNumber}</Text>
            </View>
            <Text style={styles.dateText}>
              {new Date(journal.createdAt).toLocaleDateString('en-US', {
                weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'
              })}
            </Text>
            <View style={{ flex: 1 }} />
            <Text style={styles.moodEmoji}>{Moods[journal.mood].emoji}</Text>
          </View>

          {/* Content */}
          {journal.title ? (
            <Text style={styles.title}>{journal.title}</Text>
          ) : <View style={{ height: Spacing.md }} />}

          <Text style={styles.content}>{journal.content}</Text>

          {/* Tags */}
          {journal.tags.length > 0 && (
            <View style={styles.tagsContainer}>
              {journal.tags.map((tag) => (
                <View key={tag} style={styles.tag}>
                  <Text style={styles.tagText}>#{tag}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Image placeholders */}
          <View style={styles.imageGrid}>
            {/* If there were images they would be mapped here */}
          </View>
        </ScrollView>
        
        {/* Edit floating button */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.editBtn} activeOpacity={0.8} onPress={() => router.push('/journal/new')}>
            <Text style={styles.editIcon}>✏️</Text>
            <Text style={styles.editBtnText}>Edit Entry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      {/* Share Bottom Sheet */}
      <ShareSheet ref={bottomSheetRef} journal={journal} />
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: Spacing.xl, paddingVertical: Spacing.md,
  },
  iconBtn: { padding: Spacing.sm },
  headerIcon: { fontSize: 24, color: Colors.textPrimary },
  shareBtn: {
    width: 44, height: 44, borderRadius: 22, backgroundColor: Colors.surface,
    alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: Colors.border,
  },
  shareIcon: { fontSize: 20, color: Colors.textPrimary, transform: [{ scaleX: -1 }] }, // Flipped arrow for share
  contentContainer: { padding: Spacing.xl, paddingTop: Spacing.md, paddingBottom: 100 },
  metaRow: { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.xl },
  dayBadge: { backgroundColor: Colors.goldGlow, paddingHorizontal: 12, paddingVertical: 4, borderRadius: BorderRadius.full, marginRight: Spacing.md },
  dayBadgeText: { fontFamily: Typography.fontFamily.bold, fontSize: Typography.sizes.sm, color: Colors.goldLight },
  dateText: { fontFamily: Typography.fontFamily.medium, fontSize: Typography.sizes.sm, color: Colors.textSecondary },
  moodEmoji: { fontSize: 28 },
  title: { fontFamily: Typography.fontFamily.bold, fontSize: Typography.sizes['2xl'], color: Colors.textPrimary, marginBottom: Spacing.lg, lineHeight: 34 },
  content: { fontFamily: Typography.fontFamily.regular, fontSize: Typography.sizes.lg, color: Colors.textPrimary, lineHeight: 30, marginBottom: Spacing['2xl'] },
  tagsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm, marginBottom: Spacing.xl },
  tag: { backgroundColor: Colors.surface, paddingHorizontal: 12, paddingVertical: 6, borderRadius: BorderRadius.full, borderWidth: 1, borderColor: Colors.border },
  tagText: { fontFamily: Typography.fontFamily.medium, fontSize: Typography.sizes.xs, color: Colors.textSecondary },
  imageGrid: {}, // Space for image grid
  footer: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    padding: Spacing.xl, backgroundColor: Colors.background,
    borderTopWidth: 1, borderTopColor: Colors.divider,
  },
  editBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: Colors.surfaceLight, paddingVertical: Spacing.md, borderRadius: BorderRadius.md,
    borderWidth: 1, borderColor: Colors.border,
  },
  editIcon: { fontSize: 16, marginRight: Spacing.sm },
  editBtnText: { fontFamily: Typography.fontFamily.semiBold, fontSize: Typography.sizes.base, color: Colors.textPrimary },
});
