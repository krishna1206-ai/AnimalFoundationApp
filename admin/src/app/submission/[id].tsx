import Ionicons from '@expo/vector-icons/Ionicons';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Linking, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { StatusBadge } from '@/components/StatusBadge';
import { colors, radius, spacing, statusMeta, typeMeta } from '@/constants/theme';
import { useApp } from '@/context/AppContext';
import type { SubmissionStatus } from '@/types';
import { fullDate, initials } from '@/utils/format';

const STATUSES: SubmissionStatus[] = ['new', 'in_progress', 'done'];

function ActionButton({
  icon,
  label,
  color,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  color: string;
  onPress: () => void;
}) {
  return (
    <Pressable style={({ pressed }) => [styles.action, pressed && { opacity: 0.7 }]} onPress={onPress}>
      <View style={[styles.actionIcon, { backgroundColor: color + '1A' }]}>
        <Ionicons name={icon} size={20} color={color} />
      </View>
      <Text style={styles.actionLabel}>{label}</Text>
    </Pressable>
  );
}

function InfoRow({ icon, value }: { icon: keyof typeof Ionicons.glyphMap; value: string }) {
  return (
    <View style={styles.infoRow}>
      <Ionicons name={icon} size={16} color={colors.textMuted} />
      <Text style={styles.infoText} selectable>
        {value}
      </Text>
    </View>
  );
}

export default function SubmissionDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getSubmission, updateStatus, updateNotes, deleteSubmission } = useApp();
  const item = getSubmission(id);
  const [notes, setNotes] = useState(item?.notes ?? '');

  useEffect(() => {
    setNotes(item?.notes ?? '');
  }, [item?.id]);

  if (!item) {
    return (
      <View style={styles.missing}>
        <Stack.Screen options={{ title: 'Not found' }} />
        <Ionicons name="alert-circle-outline" size={48} color={colors.textMuted} />
        <Text style={styles.missingText}>This request no longer exists.</Text>
      </View>
    );
  }

  const type = typeMeta[item.type];
  const phoneDigits = item.phone?.replace(/[^\d]/g, '');

  const open = async (url: string) => {
    try {
      await Linking.openURL(url);
    } catch {
      Alert.alert('Unable to open', 'No app on this device can handle this action.');
    }
  };

  const onDelete = () => {
    Alert.alert('Delete request', 'This will remove the request permanently.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          deleteSubmission(item.id);
          router.back();
        },
      },
    ]);
  };

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <Stack.Screen options={{ title: type.label }} />

      <View style={styles.card}>
        <View style={styles.headerRow}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials(item.name)}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.date}>{fullDate(item.createdAt)}</Text>
          </View>
          <StatusBadge status={item.status} />
        </View>

        <View style={styles.infoBlock}>
          <InfoRow icon="mail-outline" value={item.email} />
          {item.phone ? <InfoRow icon="call-outline" value={item.phone} /> : null}
          {item.location ? <InfoRow icon="location-outline" value={item.location} /> : null}
        </View>

        <View style={styles.actions}>
          {item.phone ? (
            <ActionButton icon="call" label="Call" color="#2E7D32" onPress={() => open(`tel:${item.phone}`)} />
          ) : null}
          {phoneDigits ? (
            <ActionButton
              icon="logo-whatsapp"
              label="WhatsApp"
              color="#25A244"
              onPress={() => open(`https://wa.me/${phoneDigits}`)}
            />
          ) : null}
          <ActionButton
            icon="mail"
            label="Email"
            color="#1565C0"
            onPress={() =>
              open(`mailto:${item.email}?subject=${encodeURIComponent('Re: ' + item.subject)}`)
            }
          />
        </View>
      </View>

      <Text style={styles.section}>Message</Text>
      <View style={styles.card}>
        <Text style={styles.subject}>{item.subject}</Text>
        <Text style={styles.message} selectable>
          {item.message}
        </Text>
      </View>

      <Text style={styles.section}>Status</Text>
      <View style={styles.statusRow}>
        {STATUSES.map((s) => {
          const meta = statusMeta[s];
          const active = item.status === s;
          return (
            <Pressable
              key={s}
              onPress={() => updateStatus(item.id, s)}
              style={[
                styles.statusBtn,
                active && { backgroundColor: meta.bg, borderColor: meta.color },
              ]}
            >
              <Text style={[styles.statusText, active && { color: meta.color }]}>{meta.label}</Text>
            </Pressable>
          );
        })}
      </View>

      <Text style={styles.section}>Internal notes</Text>
      <TextInput
        style={styles.notes}
        value={notes}
        onChangeText={setNotes}
        onEndEditing={() => updateNotes(item.id, notes)}
        placeholder="Add a note for your team..."
        placeholderTextColor={colors.textMuted}
        multiline
      />
      <Pressable
        style={({ pressed }) => [styles.saveBtn, pressed && { opacity: 0.85 }]}
        onPress={() => {
          updateNotes(item.id, notes);
          Alert.alert('Saved', 'Note saved.');
        }}
      >
        <Text style={styles.saveText}>Save note</Text>
      </Pressable>

      <Pressable style={styles.deleteBtn} onPress={onDelete}>
        <Ionicons name="trash-outline" size={18} color={colors.danger} />
        <Text style={styles.deleteText}>Delete request</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: spacing.lg, paddingBottom: spacing.xl * 2 },
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  headerRow: { flexDirection: 'row', alignItems: 'center' },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  avatarText: { color: colors.primaryDark, fontWeight: '800', fontSize: 16 },
  name: { fontSize: 18, fontWeight: '700', color: colors.text },
  date: { fontSize: 12, color: colors.textMuted, marginTop: 2 },
  infoBlock: { marginTop: spacing.lg, gap: spacing.sm },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  infoText: { fontSize: 14, color: colors.text, flex: 1 },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: spacing.lg,
    paddingTop: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  action: { alignItems: 'center', minWidth: 72 },
  actionIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionLabel: { fontSize: 12, fontWeight: '600', color: colors.text, marginTop: 6 },
  section: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textMuted,
    textTransform: 'uppercase',
    marginTop: spacing.xl,
    marginBottom: spacing.sm,
    marginLeft: spacing.xs,
  },
  subject: { fontSize: 16, fontWeight: '700', color: colors.text },
  message: { fontSize: 15, color: colors.text, lineHeight: 22, marginTop: spacing.sm },
  statusRow: { flexDirection: 'row', gap: spacing.sm },
  statusBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
  },
  statusText: { fontWeight: '600', color: colors.textMuted },
  notes: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    padding: spacing.md,
    minHeight: 90,
    textAlignVertical: 'top',
    fontSize: 15,
    color: colors.text,
  },
  saveBtn: {
    backgroundColor: colors.primary,
    borderRadius: radius.sm,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: spacing.md,
  },
  saveText: { color: colors.white, fontWeight: '700' },
  deleteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    marginTop: spacing.xl,
    paddingVertical: 12,
  },
  deleteText: { color: colors.danger, fontWeight: '600' },
  missing: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  missingText: { color: colors.textMuted, marginTop: spacing.sm },
});
