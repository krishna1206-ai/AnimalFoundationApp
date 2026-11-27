import Ionicons from '@expo/vector-icons/Ionicons';
import { Link } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { SubmissionCard } from '@/components/SubmissionCard';
import { colors, radius, spacing } from '@/constants/theme';
import { useApp } from '@/context/AppContext';

function StatCard({
  label,
  value,
  icon,
  color,
}: {
  label: string;
  value: number;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
}) {
  return (
    <View style={styles.stat}>
      <View style={[styles.statIcon, { backgroundColor: color + '1A' }]}>
        <Ionicons name={icon} size={18} color={color} />
      </View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

export default function DashboardScreen() {
  const { submissions, ownerEmail } = useApp();

  const total = submissions.length;
  const newCount = submissions.filter((s) => s.status === 'new').length;
  const inProgress = submissions.filter((s) => s.status === 'in_progress').length;
  const done = submissions.filter((s) => s.status === 'done').length;
  const help = submissions.filter((s) => s.type === 'help').length;
  const contact = submissions.filter((s) => s.type === 'contact').length;

  const recent = [...submissions]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 3);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.hero}>
        <Text style={styles.heroHello}>Welcome back</Text>
        <Text style={styles.heroEmail} numberOfLines={1}>
          {ownerEmail}
        </Text>
        <Text style={styles.heroText}>
          You have <Text style={styles.heroStrong}>{newCount} new</Text> request
          {newCount === 1 ? '' : 's'} from the website.
        </Text>
      </View>

      <View style={styles.grid}>
        <StatCard label="Total" value={total} icon="albums" color="#455A64" />
        <StatCard label="New" value={newCount} icon="notifications" color="#1565C0" />
        <StatCard label="In progress" value={inProgress} icon="time" color="#B26A00" />
        <StatCard label="Done" value={done} icon="checkmark-circle" color="#2E7D32" />
      </View>

      <View style={styles.split}>
        <View style={[styles.splitItem, { borderRightWidth: 1, borderColor: colors.border }]}>
          <Ionicons name="paw" size={18} color="#D84315" />
          <Text style={styles.splitValue}>{help}</Text>
          <Text style={styles.statLabel}>Help requests</Text>
        </View>
        <View style={styles.splitItem}>
          <Ionicons name="mail" size={18} color="#5E35B1" />
          <Text style={styles.splitValue}>{contact}</Text>
          <Text style={styles.statLabel}>Contact messages</Text>
        </View>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Latest requests</Text>
        <Link href="/submissions" asChild>
          <Pressable hitSlop={10}>
            <Text style={styles.seeAll}>See all</Text>
          </Pressable>
        </Link>
      </View>

      {recent.length === 0 ? (
        <Text style={styles.empty}>No requests yet.</Text>
      ) : (
        recent.map((item) => <SubmissionCard key={item.id} item={item} />)
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: spacing.lg },
  hero: {
    backgroundColor: colors.primary,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  heroHello: { color: '#C8E6C9', fontSize: 13, fontWeight: '600' },
  heroEmail: { color: colors.white, fontSize: 18, fontWeight: '800', marginTop: 2 },
  heroText: { color: '#E8F5E9', fontSize: 14, marginTop: spacing.sm },
  heroStrong: { fontWeight: '800', color: colors.white },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  stat: {
    flexGrow: 1,
    flexBasis: '45%',
    backgroundColor: colors.card,
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statValue: { fontSize: 24, fontWeight: '800', color: colors.text, marginTop: spacing.sm },
  statLabel: { fontSize: 12, color: colors.textMuted, marginTop: 2 },
  split: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginTop: spacing.md,
  },
  splitItem: { flex: 1, alignItems: 'center', paddingVertical: spacing.md },
  splitValue: { fontSize: 20, fontWeight: '800', color: colors.text, marginTop: 4 },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.xl,
    marginBottom: spacing.md,
  },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: colors.text },
  seeAll: { color: colors.primary, fontWeight: '700' },
  empty: { color: colors.textMuted, textAlign: 'center', marginTop: spacing.lg },
});
