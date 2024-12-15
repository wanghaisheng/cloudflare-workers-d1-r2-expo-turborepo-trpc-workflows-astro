import { Tabs, usePathname } from "expo-router";
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useEffect, useRef } from 'react';
import { Animated } from 'react-native';

export default function TabLayout() {
  const pathname = usePathname();
  const scaleAnim = useRef(new Animated.Value(0.99)).current;

  useEffect(() => {
    Haptics.selectionAsync();
    
    // Reset the scale to starting position
    scaleAnim.setValue(0.99);
    
    // Animate to full scale
    Animated.spring(scaleAnim, {
      toValue: 1,
      tension: 100,
      friction: 10,
      useNativeDriver: true,
    }).start();
  }, [pathname]);

  return (
    <Animated.View style={{ flex: 1, transform: [{ scale: scaleAnim }] }}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: "#2196f3",
          tabBarInactiveTintColor: "#999",
          tabBarStyle: {
            borderTopWidth: 1,
            borderTopColor: "#333",
            backgroundColor: "#121212",
          },
          headerStyle: {
            backgroundColor: '#121212',
          },
          headerTitleStyle: {
            color: '#F5F5F5',
          },
        }}
      >
        <Tabs.Screen
          name="lore"
          options={{
            title: "Lore",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="book-outline" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="add"
          options={{
            title: "Add",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="add-circle-outline" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="account"
          options={{
            title: "Account",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="person-outline" size={size} color={color} />
            ),
          }}
        />
      </Tabs>
    </Animated.View>
  );
}