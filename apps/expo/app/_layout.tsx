import {Stack} from 'expo-router';
import 'react-native-reanimated';
import {TRPCProvider} from "@/utils/TRPCProvider.tsx";
import {ClerkProvider, ClerkLoaded} from '@clerk/clerk-expo'
import * as SecureStore from 'expo-secure-store'
import { View } from 'react-native';

export default function RootLayoutNav() {
  const tokenCache = {
    async getToken(key: string) {
      try {
        const item = await SecureStore.getItemAsync(key)
        if (item) {
          console.log(`${key} was used 🔐 \n`)
        } else {
          console.log('No values stored under key: ' + key)
        }
        return item
      } catch (error) {
        console.error('SecureStore get item error: ', error)
        await SecureStore.deleteItemAsync(key)
        return null
      }
    },
    async saveToken(key: string, value: string) {
      try {
        return SecureStore.setItemAsync(key, value)
      } catch (err) {
        return
      }
    },
  }
  const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!
  if (!publishableKey) {
    throw new Error('Add EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY to your .env file')
  }
  return (
    <View style={{ flex: 1, backgroundColor: '#121212' }}>
      <ClerkProvider tokenCache={tokenCache} publishableKey={publishableKey}>
        <TRPCProvider>
          <Stack screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: '#121212' }
          }}>
            <Stack.Screen 
              name="(tabs)" 
              options={{
                headerShown: false,
                contentStyle: { backgroundColor: '#121212' }
              }}
            />
          </Stack>
        </TRPCProvider>
      </ClerkProvider>
    </View>
  );
}