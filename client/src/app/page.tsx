import Ionicons from '@expo/vector-icons/Ionicons';
import { Stack, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Platform, Pressable, StyleSheet, Text, View } from 'react-native';

import { ArticleView } from '@/components/ArticleView';
import { PageList } from '@/components/PageList';
import { colors, radius, spacing } from '@/constants/theme';
import { fetchPage, type PageContent } from '@/utils/extract';
import { openPage } from '@/utils/open';

/**
 * Phone: download the page directly.
 * Web: browsers block that (CORS), so ask our own server route /api/page to download it.
 */
async function loadPage(url: string): Promise<PageContent> {
  if (Platform.OS !== 'web') return fetchPage(url);
  const res = await fetch(`/api/page?url=${encodeURIComponent(url)}`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

/** Shows the content of a website page inside the app (no external browser). */
export default function PageScreen() {
  const { url } = useLocalSearchParams<{ url: string }>();
  const [page, setPage] = useState<PageContent | null>(null);
  const [error, setError] = useState(false);

  const load = useCallback(() => {
    setError(false);
    setPage(null);
    loadPage(url)
      .then(setPage)
      .catch(() => setError(true));
  }, [url]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <View style={styles.screen}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: page?.title ?? 'Loading…',
          headerTintColor: colors.primary,
          headerTitleStyle: { color: colors.text, fontSize: 16 },
          headerBackTitle: 'Back',
        }}
      />

      {error ? (
        <View style={styles.center}>
          <Ionicons name="cloud-offline-outline" size={42} color={colors.textMuted} />
          <Text style={styles.msg}>Couldn't load this page. Check your internet connection.</Text>
          <Pressable onPress={load} style={styles.btn}>
            <Text style={styles.btnText}>Try again</Text>
          </Pressable>
        </View>
      ) : !page ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : page.kind === 'list' ? (
        <PageList
          key={url}
          title={page.title}
          items={page.items}
          nextUrl={page.nextUrl}
          onOpen={openPage}
          loadMore={async (next) => {
            const more = await loadPage(next);
            return more.kind === 'list' ? more : { items: [] };
          }}
        />
      ) : (
        <ArticleView page={page} onLink={openPage} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xl },
  msg: {
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.md,
    fontSize: 15,
    lineHeight: 22,
  },
  btn: {
    backgroundColor: colors.primary,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.xl,
    paddingVertical: 12,
    marginTop: spacing.lg,
  },
  btnText: { color: colors.white, fontWeight: '700' },
});
