import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar'
import { useFrameworkReady } from '@/hooks/useFrameworkReady';

export default function RootLayout() {
  useFrameworkReady();
  return (
      <>
        <StatusBar style="dark" />
        <Stack
            screenOptions={{
              headerShown: false,
            }}
        >
          <Stack.Screen name="index" />
          <Stack.Screen name="pokemon/[id]" />
          <Stack.Screen name="compare" />
        </Stack>
      </>
  );
}
