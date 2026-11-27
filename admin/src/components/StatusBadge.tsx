import { StyleSheet, Text, View } from 'react-native';

import { radius, statusMeta } from '@/constants/theme';
import type { SubmissionStatus } from '@/types';

export function StatusBadge({ status }: { status: SubmissionStatus }) {
  const meta = statusMeta[status];
  return (
    <View style={[styles.badge, { backgroundColor: meta.bg }]}>
      <View style={[styles.dot, { backgroundColor: meta.color }]} />
      <Text style={[styles.text, { color: meta.color }]}>{meta.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.pill,
    alignSelf: 'flex-start',
  },
  dot: { width: 6, height: 6, borderRadius: 3, marginRight: 5 },
  text: { fontSize: 12, fontWeight: '600' },
});
