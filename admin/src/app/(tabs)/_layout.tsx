import Ionicons from '@expo/vector-icons/Ionicons';
import { Redirect, Tabs } from 'expo-router';

import { colors } from '@/constants/theme';
import { useApp } from '@/context/AppContext';

export default function TabsLayout() {
  const { isLoggedIn, submissions } = useApp();

  if (!isLoggedIn) return <Redirect href="/login" />;

  const newCount = submissions.filter((s) => s.status === 'new').length;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        headerTitleStyle: { color: colors.text, fontWeight: '700' },
        sceneStyle: { backgroundColor: colors.background },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color, size }) => <Ionicons name="grid" size={size} color={color as string} />,
        }}
      />
      <Tabs.Screen
        name="submissions"
        options={{
          title: 'Requests',
          tabBarBadge: newCount > 0 ? newCount : undefined,
          tabBarIcon: ({ color, size }) => <Ionicons name="file-tray-full" size={size} color={color as string} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size }) => <Ionicons name="settings" size={size} color={color as string} />,
        }}
      />
    </Tabs>
  );
}
