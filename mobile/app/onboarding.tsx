import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, FlatList, TouchableOpacity, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Typography, Spacing, BorderRadius } from '@/constants/theme';
import { onboardingSlides } from '@/constants/mockData';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

export default function OnboardingScreen() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const x = event.nativeEvent.contentOffset.x;
    setCurrentIndex(Math.round(x / width));
  };

  const handleNext = () => {
    if (currentIndex < onboardingSlides.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1, animated: true });
    } else {
      router.replace('/auth');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={onboardingSlides}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[styles.slide, { width }]}>
            <View style={styles.iconContainer}>
              <Text style={styles.icon}>{item.icon}</Text>
            </View>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.subtitle}>{item.subtitle}</Text>
          </View>
        )}
      />

      <View style={styles.footer}>
        <View style={styles.indicators}>
          {onboardingSlides.map((_, i) => (
            <View key={i} style={[styles.dot, currentIndex === i && styles.dotActive]} />
          ))}
        </View>

        <TouchableOpacity style={styles.button} activeOpacity={0.8} onPress={handleNext}>
          <Text style={styles.buttonText}>{currentIndex === onboardingSlides.length - 1 ? 'Get Started' : 'Next'}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  slide: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: Spacing['3xl'] },
  iconContainer: {
    width: 140, height: 140, borderRadius: 70, backgroundColor: Colors.surface,
    alignItems: 'center', justifyContent: 'center', marginBottom: Spacing['4xl'],
    borderWidth: 1, borderColor: Colors.border,
  },
  icon: { fontSize: 64 },
  title: {
    fontFamily: Typography.fontFamily.bold, fontSize: Typography.sizes['2xl'],
    color: Colors.textPrimary, textAlign: 'center', marginBottom: Spacing.md,
  },
  subtitle: {
    fontFamily: Typography.fontFamily.regular, fontSize: Typography.sizes.md,
    color: Colors.textSecondary, textAlign: 'center', lineHeight: 24,
  },
  footer: { padding: Spacing['2xl'], paddingBottom: Spacing['4xl'], alignItems: 'center' },
  indicators: { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing['3xl'] },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.surface },
  dotActive: { width: 24, backgroundColor: Colors.gold },
  button: {
    backgroundColor: Colors.buttonPrimary, paddingVertical: Spacing.lg, paddingHorizontal: Spacing['4xl'],
    borderRadius: BorderRadius.full, width: '100%', alignItems: 'center',
  },
  buttonText: { fontFamily: Typography.fontFamily.bold, fontSize: Typography.sizes.md, color: Colors.buttonPrimaryText },
});
