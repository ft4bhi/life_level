import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';
import { Colors } from '@/constants/theme';

export default function JournalTabShortcut() {
  const router = useRouter();

  // Instantly redirect to the modal journal creation screen
  useEffect(() => {
    // Small timeout ensures the router is fully mounted 
    // before attempting to push in the same tick as tab switch
    const tm = setTimeout(() => {
      router.push('/journal/new');
      // We also want to bounce the user back to the home map in the background
      // so when they close the modal they don't land back on this empty tab
      router.replace('/(tabs)/');
    }, 10);
    return () => clearTimeout(tm);
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator color={Colors.gold} />
    </View>
  );
}
