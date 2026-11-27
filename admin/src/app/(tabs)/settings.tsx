import Ionicons from '@expo/vector-icons/Ionicons';
import Constants from 'expo-constants';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Linking, Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';

import { colors, radius, spacing } from '@/constants/theme';
import { useApp } from '@/context/AppContext';
import { initials } from '@/utils/format';

const WEBSITE_URL = 'https://worldanimalfoundation.org/';

function Row({
  icon,
  label,
  right,
  onPress,
  danger,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  right?: React.ReactNode;
  onPress?: () => void;
  danger?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      style={({ pressed }) => [styles.row, pressed && onPress && { opacity: 0.6 }]}
    >
      <Ionicons name={icon} size={20} color={danger ? colors.danger : colors.primary} />
      <Text style={[styles.rowLabel, danger && { color: colors.danger }]}>{label}</Text>
      {right ?? (onPress ? <Ionicons name="chevron-forward" size={18} color={colors.textMuted} /> : null)}
    </Pressable>
  );
}

export default function SettingsScreen() {
  const { ownerEmail, logout } = useApp();
  const [pushEnabled, setPushEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(false);

  const onLogout = () => {
    Alert.alert('Sign out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign out',
        style: 'destructive',
        onPress: () => {
          logout();
          router.replace('/login');
        },
      },
    ]);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.profile}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials(ownerEmail ?? 'O')}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.profileName}>Owner</Text>
          <Text style={styles.profileEmail} numberOfLines={1}>
            {ownerEmail}
          </Text>
        </View>
      </View>

      <Text style={styles.section}>Notifications</Text>
      <View style={styles.card}>
        <Row
          icon="notifications"
          label="Push notifications"
          right={
            <Switch
              value={pushEnabled}
              onValueChange={setPushEnabled}
              trackColor={{ true: colors.primary }}
            />
          }
        />
        <View style={styles.divider} />
        <Row
          icon="mail"
          label="Email alerts"
          right={
            <Switch
              value={emailEnabled}
              onValueChange={setEmailEnabled}
              trackColor={{ true: colors.primary }}
            />
          }
        />
      </View>

      <Text style={styles.section}>General</Text>
      <View style={styles.card}>
        <Row icon="globe" label="Open website" onPress={() => Linking.openURL(WEBSITE_URL)} />
        <View style={styles.divider} />
        <Row
          icon="download"
          label="Export requests (coming soon)"
          onPress={() => Alert.alert('Coming soon', 'Export will be available once the backend is connected.')}
        />
        <View style={styles.divider} />
        <Row
          icon="information-circle"
          label="App version"
          right={<Text style={styles.muted}>{Constants.expoConfig?.version ?? '1.0.0'}</Text>}
        />
      </View>

      <View style={[styles.card, { marginTop: spacing.xl }]}>
        <Row icon="log-out" label="Sign out" onPress={onLogout} danger />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: spacing.lg },
  profile: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: radius.md,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  avatarText: { color: colors.white, fontSize: 18, fontWeight: '800' },
  profileName: { fontSize: 17, fontWeight: '700', color: colors.text },
  profileEmail: { fontSize: 13, color: colors.textMuted, marginTop: 2 },
  section: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textMuted,
    textTransform: 'uppercase',
    marginTop: spacing.xl,
    marginBottom: spacing.sm,
    marginLeft: spacing.xs,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  row: { flexDirection: 'row', alignItems: 'center', padding: spacing.md, minHeight: 52 },
  rowLabel: { flex: 1, marginLeft: spacing.md, fontSize: 15, color: colors.text },
  divider: { height: 1, backgroundColor: colors.border, marginLeft: 48 },
  muted: { color: colors.textMuted },
});
