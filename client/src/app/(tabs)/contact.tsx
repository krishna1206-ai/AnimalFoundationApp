import Ionicons from '@expo/vector-icons/Ionicons';
import type { ComponentProps } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { ContactForm } from '@/components/ContactForm';
import { TopBar } from '@/components/TopBar';
import { colors, radius, spacing } from '@/constants/theme';
import { contact } from '@/data/site';
import { openExternal, openPage } from '@/utils/open';

type IconName = ComponentProps<typeof Ionicons>['name'];

function Row({
  icon,
  label,
  value,
  onPress,
}: {
  icon: IconName;
  label: string;
  value: string;
  onPress?: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      style={({ pressed }) => [styles.row, pressed && onPress && { opacity: 0.6 }]}
    >
      <View style={styles.rowIcon}>
        <Ionicons name={icon} size={20} color={colors.primary} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.rowLabel}>{label}</Text>
        <Text style={styles.rowValue}>{value}</Text>
      </View>
      {onPress ? <Ionicons name="chevron-forward" size={18} color={colors.textMuted} /> : null}
    </Pressable>
  );
}

export default function ContactScreen() {
  const phoneDigits = contact.phone.replace(/[^\d+]/g, '');
  return (
    <View style={styles.screen}>
      <TopBar />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.heading}>Contact Us</Text>
        <Text style={styles.sub}>{contact.blurb}</Text>

        <ContactForm />

        <Text style={styles.section}>Other ways to reach us</Text>
        <View style={styles.card}>
          <Row
            icon="mail-outline"
            label="Email"
            value={contact.email}
            onPress={() => openExternal(`mailto:${contact.email}`)}
          />
          <View style={styles.divider} />
          <Row
            icon="call-outline"
            label="Phone"
            value={contact.phone}
            onPress={() => openExternal(`tel:${phoneDigits}`)}
          />
          <View style={styles.divider} />
          <Row
            icon="location-outline"
            label="Our Address"
            value={contact.address}
            onPress={() =>
              openExternal(`https://maps.google.com/?q=${encodeURIComponent(contact.address)}`)
            }
          />
        </View>

        <Text style={styles.section}>Follow us</Text>
        <View style={styles.social}>
          {contact.social.map((s) => (
            <Pressable
              key={s.label}
              onPress={() => openExternal(s.url)}
              accessibilityLabel={s.label}
              style={({ pressed }) => [styles.socialBtn, pressed && { opacity: 0.7 }]}
            >
              <Ionicons name={s.icon} size={22} color={colors.white} />
            </Pressable>
          ))}
        </View>

        <Text style={styles.section}>Policy Settings</Text>
        <View style={styles.card}>
          {contact.policies.map((p, i) => (
            <View key={p.label}>
              {i > 0 ? <View style={styles.divider} /> : null}
              <Pressable
                onPress={() => openPage(p.url)}
                style={({ pressed }) => [styles.policy, pressed && { opacity: 0.6 }]}
              >
                <Text style={styles.policyText}>{p.label}</Text>
                <Ionicons name="open-outline" size={16} color={colors.textMuted} />
              </Pressable>
            </View>
          ))}
        </View>

        <Text style={styles.disclaimer}>{contact.disclaimer}</Text>
        <Text style={styles.copy}>{contact.copyright}</Text>
      </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingBottom: spacing.xl },
  heading: { fontSize: 24, fontWeight: '800', color: colors.text },
  sub: { fontSize: 14, color: colors.textMuted, marginTop: 4, marginBottom: spacing.lg, lineHeight: 20 },
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  row: { flexDirection: 'row', alignItems: 'center', padding: spacing.md, gap: spacing.md },
  rowIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowLabel: { fontSize: 12, color: colors.textMuted },
  rowValue: { fontSize: 15, color: colors.text, fontWeight: '600', marginTop: 2 },
  divider: { height: 1, backgroundColor: colors.border },
  section: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textMuted,
    textTransform: 'uppercase',
    marginTop: spacing.xl,
    marginBottom: spacing.sm,
  },
  social: { flexDirection: 'row', gap: spacing.md },
  socialBtn: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  policy: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
    minHeight: 48,
  },
  policyText: { fontSize: 15, color: colors.text },
  disclaimer: {
    fontSize: 12,
    color: colors.textMuted,
    lineHeight: 18,
    marginTop: spacing.xl,
    textAlign: 'center',
  },
  copy: { fontSize: 11, color: colors.textMuted, marginTop: spacing.sm, textAlign: 'center' },
});
