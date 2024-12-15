import Constants from "expo-constants";
import { Platform } from 'react-native';
import * as Network from 'expo-network';

export const getBaseUrl = () => {
  // For iOS, we need to be extra careful about IP resolution
  if (Platform.OS === 'ios') {
    try {
      // Try multiple methods to get the correct local IP
      const debuggerHost = Constants.expoConfig?.hostUri;
      console.log('Debugger Host (iOS):', debuggerHost);

      // Attempt to get the actual network interface IP
      // Prioritize debuggerHost, fall back to network interface

      const host = debuggerHost!.split(':')[0]

      // For iOS, you might need to use the full IP
      const baseUrl = `http://${host}:8787`;
      console.log('Resolved iOS Base URL:', baseUrl);

      return baseUrl;
    } catch (error) {
      console.error('iOS Base URL Detection Error:', error);
      throw new Error('Failed to determine base URL for iOS');
    }
  }

  // Fallback for other platforms
  return 'http://localhost:8787';
};