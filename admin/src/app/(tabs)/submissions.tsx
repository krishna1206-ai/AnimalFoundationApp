import Ionicons from '@expo/vector-icons/Ionicons';
import { useMemo, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, Text, TextInput, View } from 'react-native';

import { FilterChips } from '@/components/FilterChips';
import { SubmissionCard } from '@/components/SubmissionCard';
import { colors, radius, spacing } from '@/constants/theme';
import { useApp } from '@/context/AppContext';
import type { FormType, SubmissionStatus } from '@/types';

type TypeFilter = 'all' | FormType;
type StatusFilter = 'all' | SubmissionStatus;

export default function SubmissionsScreen() {
  const { submissions } = useApp();
  const [query, setQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [refreshing, setRefreshing] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return submissions
      .filter((s) => typeFilter === 'all' || s.type === typeFilter)
      .filter((s) => statusFilter === 'all' || s.status === statusFilter)
      .filter(
        (s) =>
          !q ||
          [s.name, s.email, s.subject, s.message, s.phone ?? '', s.location ?? '']
            .join(' ')
            .toLowerCase()
            .includes(q),
      )
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }, [submissions, query, typeFilter, statusFilter]);

  // Placeholder until the backend exists; this will re-fetch submissions.
  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 800);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.search}>
          <Ionicons name="search" size={18} color={colors.textMuted} />
          <TextInput
            style={styles.searchInput}
            value={query}
            onChangeText={setQuery}
            placeholder="Search name, email, message..."
            placeholderTextColor={colors.textMuted}
            clearButtonMode="while-editing"
          />
        </View>
        <FilterChips<TypeFilter>
          value={typeFilter}
          onChange={setTypeFilter}
          options={[
            { value: 'all', label: 'All forms' },
            { value: 'help', label: 'Help' },
            { value: 'contact', label: 'Contact' },
          ]}
        />
        <FilterChips<StatusFilter>
          value={statusFilter}
          onChange={setStatusFilter}
          options={[
            { value: 'all', label: 'Any status' },
            { value: 'new', label: 'New' },
            { value: 'in_progress', label: 'In progress' },
            { value: 'done', label: 'Done' },
          ]}
        />
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <SubmissionCard item={item} />}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
        }
        ListHeaderComponent={
          <Text style={styles.count}>
            {filtered.length} result{filtered.length === 1 ? '' : 's'}
          </Text>
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="file-tray-outline" size={48} color={colors.border} />
            <Text style={styles.emptyText}>No requests match your filters.</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
    gap: spacing.sm,
    backgroundColor: colors.background,
  },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
  },
  searchInput: { flex: 1, paddingVertical: 10, marginLeft: spacing.sm, fontSize: 15, color: colors.text },
  list: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xl },
  count: { fontSize: 12, color: colors.textMuted, marginBottom: spacing.sm },
  empty: { alignItems: 'center', marginTop: spacing.xl * 2 },
  emptyText: { color: colors.textMuted, marginTop: spacing.sm },
});
