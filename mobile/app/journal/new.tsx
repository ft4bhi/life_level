import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors, Typography, Spacing, BorderRadius } from '@/constants/theme';
import { MoodPicker } from '@/components/MoodPicker';
import { MoodType } from '@/constants/theme';
import { mockUser } from '@/constants/mockData';

export default function JournalEditorScreen() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [mood, setMood] = useState<MoodType | null>(null);

  const handleSave = () => {
    // In a real app, this would save the journal and trigger level map animation
    // We just go back to the map
    router.replace('/(tabs)/');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
            <Text style={styles.headerIcon}>✕</Text>
          </TouchableOpacity>
          <View style={styles.dayBadge}>
            <Text style={styles.dayBadgeText}>Day {mockUser.totalDays + 1}</Text>
          </View>
          <TouchableOpacity onPress={handleSave} style={styles.saveBtn} disabled={!content.trim()}>
            <Text style={[styles.saveBtnText, !content.trim() && { color: Colors.textMuted }]}>Save</Text>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.editorContainer} keyboardShouldPersistTaps="handled">
          <TextInput
            style={styles.titleInput}
            placeholder="Give this day a title..."
            placeholderTextColor={Colors.textMuted}
            value={title}
            onChangeText={setTitle}
            maxLength={100}
          />
          <TextInput
            style={styles.contentInput}
            placeholder="What happened today? How do you feel?..."
            placeholderTextColor={Colors.textSecondary}
            value={content}
            onChangeText={setContent}
            multiline
            autoFocus
            textAlignVertical="top"
          />
        </ScrollView>

        {/* Bottom Toolbar */}
        <View style={styles.toolbar}>
          <MoodPicker selectedMood={mood} onSelect={setMood} />
          
          <View style={styles.toolsRow}>
            <TouchableOpacity style={styles.toolBtn}>
              <Text style={styles.toolIcon}>📷</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.toolBtn}>
              <Text style={styles.toolIcon}>🏷️</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.toolBtn}>
              <Text style={styles.toolIcon}>📍</Text>
            </TouchableOpacity>
            
            <View style={{ flex: 1 }} />
            
            <Text style={styles.wordCount}>{content.trim().split(/\s+/).filter(Boolean).length} words</Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: Spacing.xl, paddingVertical: Spacing.md,
    borderBottomWidth: 1, borderBottomColor: Colors.divider,
  },
  iconBtn: { padding: Spacing.sm },
  headerIcon: { fontSize: 24, color: Colors.textPrimary },
  dayBadge: { backgroundColor: Colors.surface, paddingHorizontal: 12, paddingVertical: 6, borderRadius: BorderRadius.full },
  dayBadgeText: { fontFamily: Typography.fontFamily.bold, fontSize: Typography.sizes.sm, color: Colors.textPrimary },
  saveBtn: { padding: Spacing.sm, backgroundColor: Colors.surface, borderRadius: BorderRadius.md },
  saveBtnText: { fontFamily: Typography.fontFamily.bold, fontSize: Typography.sizes.base, color: Colors.gold },
  editorContainer: { flexGrow: 1, padding: Spacing.xl },
  titleInput: {
    fontFamily: Typography.fontFamily.bold, fontSize: Typography.sizes['2xl'],
    color: Colors.textPrimary, marginBottom: Spacing.lg,
  },
  contentInput: {
    fontFamily: Typography.fontFamily.regular, fontSize: Typography.sizes.lg,
    color: Colors.textPrimary, flex: 1, lineHeight: 28,
  },
  toolbar: {
    backgroundColor: Colors.backgroundCard, borderTopWidth: 1, borderTopColor: Colors.border,
    paddingHorizontal: Spacing.xl, paddingBottom: Platform.OS === 'ios' ? 0 : Spacing.md,
  },
  toolsRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: Spacing.sm },
  toolBtn: { marginRight: Spacing.lg, padding: 4 },
  toolIcon: { fontSize: 24 },
  wordCount: { fontFamily: Typography.fontFamily.regular, fontSize: Typography.sizes.sm, color: Colors.textMuted },
});
