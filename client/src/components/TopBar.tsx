import Ionicons from '@expo/vector-icons/Ionicons';
import { Image } from 'expo-image';
import { useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, radius, spacing } from '@/constants/theme';
import { site } from '@/data/site';
import { openPage } from '@/utils/open';

/** Website-style header: logo on the left, search on the right. Search opens the site's search results. */
export function TopBar() {
  const insets = useSafeAreaInsets();
  const [searching, setSearching] = useState(false);
  const [query, setQuery] = useState('');

  const submit = () => {
    const q = query.trim();
    if (q) openPage(site.searchUrl(q));
  };

  return (
    <View style={[styles.bar, { paddingTop: insets.top + spacing.sm }]}>
      <View style={styles.row}>
        <Image
          source={site.logo}
          style={styles.logo}
          contentFit="contain"
          accessibilityLabel={site.name}
        />
        <Pressable onPress={() => setSearching((v) => !v)} hitSlop={10} style={styles.iconBtn}>
          <Ionicons name={searching ? 'close' : 'search'} size={22} color={colors.text} />
        </Pressable>
      </View>
      {searching ? (
        <View style={styles.search}>
          <Ionicons name="search" size={18} color={colors.textMuted} />
          <TextInput
            style={styles.input}
            value={query}
            onChangeText={setQuery}
            placeholder="Search animals, guides, facts..."
            placeholderTextColor={colors.textMuted}
            returnKeyType="search"
            onSubmitEditing={submit}
            autoFocus
          />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    backgroundColor: colors.card,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  logo: { width: 170, height: 44 },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    marginTop: spacing.sm,
  },
  input: { flex: 1, paddingVertical: 10, marginLeft: spacing.sm, fontSize: 15, color: colors.text },
});
