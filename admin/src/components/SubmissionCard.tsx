import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, radius, spacing, statusMeta, typeMeta } from '@/constants/theme';
import type { Submission } from '@/types';
import { timeAgo } from '@/utils/format';

/**
 * One request = one card.
 * Top row: icon · name / time ago · arrow. Below: the message, full card width.
 * Status badge sits in the top-right corner.
 */
export function SubmissionCard({ item }: { item: Submission }) {
  const type = typeMeta[item.type];
  const status = statusMeta[item.status];
  const isNew = item.status === 'new';
  return (
    <Pressable
      accessibilityRole="link"
      onPress={() => router.push({ pathname: '/submission/[id]', params: { id: item.id } })}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <View style={styles.header}>
        <View style={[styles.icon, { backgroundColor: type.color + '1F' }]}>
          <Ionicons name={type.icon} size={22} color={type.color} />
        </View>
        <View style={styles.who}>
          <Text style={styles.name} numberOfLines={1}>
            {item.name}
          </Text>
          <View style={styles.timeRow}>
            <Ionicons name="time-outline" size={13} color={colors.textMuted} />
            <Text style={styles.time}>{timeAgo(item.createdAt)}</Text>
          </View>
        </View>
        <View style={styles.chevronCircle}>
          <Ionicons name="chevron-forward" size={18} color={colors.primary} />
        </View>
      </View>

      <View style={styles.messageBox}>
        <Text style={styles.message} numberOfLines={2}>
          {item.message}
        </Text>
      </View>

      {isNew ? (
        <View style={[styles.badge, { backgroundColor: status.color }]}>
          <Text style={styles.badgeText}>NEW</Text>
        </View>
      ) : (
        // Minimal badge for "In progress" / "Done": soft tint, small colored text
        <View style={[styles.badge, { backgroundColor: status.bg }]}>
          <Text style={[styles.badgeText, { color: status.color }]}>{status.label}</Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#EEF0EF', // light gray card
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.06)',
    overflow: 'hidden',
  },
  pressed: { opacity: 0.7 },
  header: { flexDirection: 'row', alignItems: 'center', paddingTop: spacing.xs },
  icon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  who: { flex: 1, marginRight: spacing.sm },
  name: { fontSize: 16, fontWeight: '700', color: colors.text, marginRight: 60 },
  timeRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  time: { fontSize: 12, color: colors.textMuted },
  chevronCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Quote style: thin green line on the left, no box
  messageBox: {
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
    paddingLeft: spacing.md,
    paddingVertical: 2,
    marginTop: spacing.md,
    marginLeft: spacing.xs,
  },
  message: { fontSize: 14, color: colors.text, lineHeight: 20 },
  badge: {
    position: 'absolute',
    top: 0,
    right: 0,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderBottomLeftRadius: radius.md,
  },
  badgeText: { color: colors.white, fontSize: 10, fontWeight: '800', letterSpacing: 0.5 },
});
