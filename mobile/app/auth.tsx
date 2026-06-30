import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Typography, Spacing, BorderRadius } from '@/constants/theme';
import { useRouter } from 'expo-router';

export default function AuthScreen() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(false);

  const handleSubmit = () => {
    // Navigate straight to the level map
    router.replace('/(tabs)/');
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
          style={styles.inner}
        >
          <View style={styles.header}>
            <Text style={styles.appTitle}>Life Levels</Text>
            <Text style={styles.subtitle}>
              {isLogin ? 'Welcome back. Your map awaits.' : 'Start your journey today.'}
            </Text>
          </View>

          <View style={styles.form}>
            {/* Google Button */}
            <TouchableOpacity style={styles.googleBtn} activeOpacity={0.8} onPress={handleSubmit}>
              <Text style={styles.googleIcon}>G</Text>
              <Text style={styles.googleBtnText}>Continue with Google</Text>
            </TouchableOpacity>

            <View style={styles.dividerContainer}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Email Form */}
            {!isLogin && (
              <TextInput
                style={styles.input}
                placeholder="Choose a username"
                placeholderTextColor={Colors.textMuted}
                autoCapitalize="none"
              />
            )}
            <TextInput
              style={styles.input}
              placeholder="Email address"
              placeholderTextColor={Colors.textMuted}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor={Colors.textMuted}
              secureTextEntry
            />

            <TouchableOpacity style={styles.submitBtn} activeOpacity={0.8} onPress={handleSubmit}>
              <Text style={styles.submitBtnText}>{isLogin ? 'Log In' : 'Create Account'}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              {isLogin ? "Don't have an account? " : "Already have an account? "}
            </Text>
            <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
              <Text style={styles.footerLink}>{isLogin ? 'Sign up' : 'Log in'}</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  inner: { flex: 1, padding: Spacing.xl, justifyContent: 'center' },
  header: { alignItems: 'center', marginBottom: Spacing['4xl'] },
  appTitle: { fontFamily: Typography.fontFamily.bold, fontSize: 32, color: Colors.gold, marginBottom: Spacing.sm },
  subtitle: { fontFamily: Typography.fontFamily.regular, fontSize: Typography.sizes.base, color: Colors.textSecondary },
  form: { width: '100%', backgroundColor: Colors.surface, padding: Spacing.xl, borderRadius: BorderRadius.xl, borderWidth: 1, borderColor: Colors.border },
  googleBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#fff', paddingVertical: 14, borderRadius: BorderRadius.md, marginBottom: Spacing.lg
  },
  googleIcon: { fontFamily: Typography.fontFamily.bold, fontSize: 18, color: '#000', marginRight: 12 },
  googleBtnText: { fontFamily: Typography.fontFamily.semiBold, fontSize: Typography.sizes.base, color: '#000' },
  dividerContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.lg },
  dividerLine: { flex: 1, height: 1, backgroundColor: Colors.divider },
  dividerText: { fontFamily: Typography.fontFamily.medium, color: Colors.textMuted, paddingHorizontal: Spacing.md },
  input: {
    backgroundColor: Colors.inputBackground, borderWidth: 1, borderColor: Colors.inputBorder,
    borderRadius: BorderRadius.md, paddingHorizontal: Spacing.md, height: 52,
    marginBottom: Spacing.md, color: Colors.textPrimary, fontFamily: Typography.fontFamily.regular, fontSize: Typography.sizes.base
  },
  submitBtn: {
    backgroundColor: Colors.buttonPrimary, height: 52, borderRadius: BorderRadius.md,
    alignItems: 'center', justifyContent: 'center', marginTop: Spacing.sm
  },
  submitBtnText: { fontFamily: Typography.fontFamily.bold, fontSize: Typography.sizes.base, color: Colors.buttonPrimaryText },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: Spacing['2xl'] },
  footerText: { fontFamily: Typography.fontFamily.regular, color: Colors.textSecondary, fontSize: Typography.sizes.base },
  footerLink: { fontFamily: Typography.fontFamily.semiBold, color: Colors.gold, fontSize: Typography.sizes.base },
});
