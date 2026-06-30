import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Typography, Spacing, Moods, BorderRadius } from '@/constants/theme';
import { mockJournals } from '@/constants/mockData';
import { useRouter } from 'expo-router';

export default function SearchScreen() {
  const [query, setQuery] = useState('');
  const [activeMood, setActiveMood] = useState<string | null>(null);
  const router = useRouter();

  // Basic mock filtering
  const results = mockJournals.filter((j) => {
    const matchesQuery = j.title.toLowerCase().includes(query.toLowerCase()) || 
                         j.content.toLowerCase().includes(query.toLowerCase());
    const matchesMood = activeMood ? j.mood === activeMood : true;
    return matchesQuery && matchesMood;
  });

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header & Search Bar */}
      <View style={styles.header}>
        <Text style={styles.title}>Search</Text>
        <View style={styles.searchContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search your memories..."
            placeholderTextColor={Colors.textMuted}
            value={query}
            onChangeText={setQuery}
            autoFocus
          />
        </View>
      </View>

      {/* Filters */}
      <View style={styles.filtersContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filtersScroll}>
          {Object.entries(Moods).map(([key, { emoji }]) => (
            <TouchableOpacity
              key={key}
              style={[styles.filterChip, activeMood === key && styles.filterChipActive]}
              onPress={() => setActiveMood(activeMood === key ? null : key)}
            >
              <Text style={styles.filterChipEmoji}>{emoji}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Results */}
      <ScrollView contentContainerStyle={styles.resultsContainer}>
        {results.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🙈</Text>
            <Text style={styles.emptyText}>No memories found</Text>
          </View>
        ) : (
          results.map((journal) => (
            <TouchableOpacity 
              key={journal.id} 
              style={styles.resultCard}
              onPress={() => router.push(`/journal/${journal.id}`)}
              activeOpacity={0.7}
            >
              <View style={styles.resultHeader}>
                <Text style={styles.resultDay}>Day {journal.dayNumber}</Text>
                <Text style={styles.resultDate}>
                  {new Date(journal.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </Text>
              </View>
              {journal.title ? <Text style={styles.resultTitle}>{journal.title}</Text> : null}
              <Text style={styles.resultPreview} numberOfLines={2}>
                {journal.content}
              </Text>
              <View style={styles.resultFooter}>
                <Text style={styles.resultMood}>{Moods[journal.mood].emoji}</Text>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { padding: Spacing.xl, paddingBottom: Spacing.md },
  title: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: Typography.sizes['2xl'],
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.inputBackground,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.inputBorder,
  },
  searchIcon: { fontSize: 18, marginRight: Spacing.sm },
  searchInput: {
    flex: 1,
    height: 48,
    color: Colors.textPrimary,
    fontFamily: Typography.fontFamily.regular,
    fontSize: Typography.sizes.base,
  },
  filtersContainer: { borderBottomWidth: 1, borderBottomColor: Colors.divider, paddingBottom: Spacing.md },
  filtersScroll: { paddingHorizontal: Spacing.xl, gap: Spacing.sm },
  filterChip: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  filterChipActive: { backgroundColor: Colors.surfaceLight, borderColor: Colors.gold },
  filterChipEmoji: { fontSize: 20 },
  resultsContainer: { padding: Spacing.xl, gap: Spacing.md },
  resultCard: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  resultHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: Spacing.xs },
  resultDay: { fontFamily: Typography.fontFamily.bold, color: Colors.gold, fontSize: Typography.sizes.sm },
  resultDate: { fontFamily: Typography.fontFamily.regular, color: Colors.textSecondary, fontSize: Typography.sizes.sm },
  resultTitle: { fontFamily: Typography.fontFamily.semiBold, color: Colors.textPrimary, fontSize: Typography.sizes.base, marginBottom: Spacing.xs },
  resultPreview: { fontFamily: Typography.fontFamily.regular, color: Colors.textSecondary, fontSize: Typography.sizes.sm, lineHeight: 20 },
  resultFooter: { marginTop: Spacing.md, alignSelf: 'flex-start', backgroundColor: Colors.surface, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  resultMood: { fontSize: 16 },
  emptyState: { alignItems: 'center', marginTop: Spacing['4xl'] },
  emptyIcon: { fontSize: 48, marginBottom: Spacing.md },
  emptyText: { fontFamily: Typography.fontFamily.medium, color: Colors.textMuted, fontSize: Typography.sizes.base },
});
