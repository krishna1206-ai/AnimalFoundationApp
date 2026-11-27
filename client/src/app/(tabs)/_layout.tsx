import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs } from 'expo-router';
import type { ColorValue } from 'react-native';

import { colors } from '@/constants/theme';

type IconName = keyof typeof Ionicons.glyphMap;

function icon(active: IconName, inactive: IconName) {
  return ({ color, focused, size }: { color: ColorValue; focused: boolean; size: number }) => (
    <Ionicons name={focused ? active : inactive} size={size} color={color as string} />
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        sceneStyle: { backgroundColor: colors.background },
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Home', tabBarIcon: icon('home', 'home-outline') }} />
      <Tabs.Screen
        name="explore"
        options={{ title: 'Explore', tabBarIcon: icon('compass', 'compass-outline') }}
      />
      <Tabs.Screen name="about" options={{ title: 'About', tabBarIcon: icon('paw', 'paw-outline') }} />
      <Tabs.Screen
        name="contact"
        options={{ title: 'Contact', tabBarIcon: icon('mail', 'mail-outline') }}
      />
    </Tabs>
  );
}
