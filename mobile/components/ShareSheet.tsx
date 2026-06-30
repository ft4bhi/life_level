import React, { forwardRef, useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import BottomSheet, { BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { Colors, Typography, Spacing, BorderRadius, Moods } from '@/constants/theme';
import { JournalEntry } from '@/constants/mockData';

interface Props {
  journal: JournalEntry;
}

export const ShareSheet = forwardRef<BottomSheet, Props>(({ journal }, ref) => {
  const snapPoints = useMemo(() => ['50%', '70%'], []);

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} opacity={0.7} />
    ),
    []
  );

  return (
    <BottomSheet
      ref={ref}
      index={-1} // Closed by default
      snapPoints={snapPoints}
      backdropComponent={renderBackdrop}
      backgroundStyle={styles.sheetBackground}
      handleIndicatorStyle={styles.handle}
      enablePanDownToClose
    >
      <View style={styles.container}>
        <Text style={styles.title}>Share Memory</Text>

        {/* Preview Card */}
        <View style={styles.previewCard}>
          <View style={styles.previewHeader}>
            <Text style={styles.previewDay}>Day {journal.dayNumber}</Text>
            <Text style={styles.previewMood}>{Moods[journal.mood].emoji}</Text>
          </View>
          <Text style={styles.previewContent} numberOfLines={4}>
            {journal.content}
          </Text>
        </View>

        {/* Share Options */}
        <View style={styles.optionsGrid}>
          <TouchableOpacity style={styles.optionBtn}>
            <View style={[styles.iconBox, { backgroundColor: '#25D366' }]}>
              <Text>💬</Text>
            </View>
            <Text style={styles.optionText}>WhatsApp</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.optionBtn}>
            <View style={[styles.iconBox, { backgroundColor: '#E1306C' }]}>
              <Text>📸</Text>
            </View>
            <Text style={styles.optionText}>Instagram</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.optionBtn}>
            <View style={styles.iconBox}>
              <Text style={{ fontSize: 18, color: '#fff' }}>↓</Text>
            </View>
            <Text style={styles.optionText}>Save Image</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.optionBtn}>
            <View style={styles.iconBox}>
              <Text style={{ fontSize: 18, color: '#fff' }}>🔗</Text>
            </View>
            <Text style={styles.optionText}>Copy Link</Text>
          </TouchableOpacity>
        </View>

        {/* Privacy Toggle */}
        <View style={styles.privacySection}>
          <Text style={styles.privacyLabel}>Who can see this link?</Text>
          <View style={styles.privacyOptions}>
            <TouchableOpacity style={styles.privacyBtn}>
              <Text style={styles.privacyBtnText}>🔒 Private</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.privacyBtn, styles.privacyBtnActive]}>
              <Text style={[styles.privacyBtnText, styles.privacyBtnTextActive]}>🌎 Public</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </BottomSheet>
  );
});

const styles = StyleSheet.create({
  sheetBackground: { backgroundColor: Colors.backgroundCard },
  handle: { backgroundColor: Colors.divider, width: 40 },
  container: { flex: 1, padding: Spacing.xl },
  title: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: Typography.sizes.lg,
    color: Colors.textPrimary,
    marginBottom: Spacing.lg,
    textAlign: 'center',
  },
  previewCard: {
    backgroundColor: Colors.background,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing['2xl'],
  },
  previewHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: Spacing.sm },
  previewDay: { fontFamily: Typography.fontFamily.bold, color: Colors.gold, fontSize: Typography.sizes.base },
  previewMood: { fontSize: 20 },
  previewContent: {
    fontFamily: Typography.fontFamily.medium,
    color: Colors.textPrimary,
    fontSize: Typography.sizes.base,
    lineHeight: 24,
  },
  optionsGrid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: Spacing['3xl'] },
  optionBtn: { alignItems: 'center', flex: 1 },
  iconBox: {
    width: 50, height: 50, borderRadius: 25,
    backgroundColor: Colors.surfaceLight,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  optionText: {
    fontFamily: Typography.fontFamily.medium,
    fontSize: Typography.sizes.xs,
    color: Colors.textSecondary,
  },
  privacySection: { borderTopWidth: 1, borderTopColor: Colors.divider, paddingTop: Spacing.xl },
  privacyLabel: {
    fontFamily: Typography.fontFamily.semiBold,
    fontSize: Typography.sizes.sm,
    color: Colors.textMuted,
    marginBottom: Spacing.md,
  },
  privacyOptions: { flexDirection: 'row', gap: Spacing.md },
  privacyBtn: {
    flex: 1, paddingVertical: Spacing.md,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    borderWidth: 1, borderColor: Colors.border,
  },
  privacyBtnActive: { backgroundColor: Colors.surfaceLight, borderColor: Colors.gold },
  privacyBtnText: { fontFamily: Typography.fontFamily.semiBold, color: Colors.textSecondary },
  privacyBtnTextActive: { color: Colors.gold },
});
