import Ionicons from '@expo/vector-icons/Ionicons';
import { Image } from 'expo-image';
import { useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, radius, spacing } from '@/constants/theme';
import type { ListItem } from '@/utils/extract';

/** Category page (Dogs, Statistics…) shown as native article cards with "Load more". */
export function PageList({
  title,
  items,
  nextUrl,
  onOpen,
  loadMore,
}: {
  title: string;
  items: ListItem[];
  nextUrl?: string;
  onOpen: (url: string) => void;
  loadMore: (url: string) => Promise<{ items: ListItem[]; nextUrl?: string }>;
}) {
  const [list, setList] = useState(items);
  const [next, setNext] = useState(nextUrl);
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);

  const onLoadMore = async () => {
    if (!next || loading) return;
    setLoading(true);
    setFailed(false);
    try {
      const more = await loadMore(next);
      setList((prev) => [...prev, ...more.items.filter((m) => !prev.some((p) => p.url === m.url))]);
      setNext(more.nextUrl);
    } catch {
      setFailed(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <FlatList
      data={list}
      keyExtractor={(item) => item.url}
      contentContainerStyle={styles.content}
      ListHeaderComponent={
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>
          <View style={styles.underline} />
        </View>
      }
      renderItem={({ item }) => (
        <Pressable
          onPress={() => onOpen(item.url)}
          style={({ pressed }) => [styles.card, pressed && { opacity: 0.75 }]}
        >
          {item.image ? (
            <Image source={item.image} style={styles.image} contentFit="cover" transition={200} />
          ) : null}
          <View style={styles.body}>
            {item.category ? <Text style={styles.category}>{item.category}</Text> : null}
            <Text style={styles.cardTitle}>{item.title}</Text>
            {item.excerpt ? (
              <Text style={styles.excerpt} numberOfLines={3}>
                {item.excerpt}
              </Text>
            ) : null}
            <View style={styles.footer}>
              {item.date ? (
                <View style={styles.dateRow}>
                  <Ionicons name="calendar-outline" size={13} color={colors.textMuted} />
                  <Text style={styles.date}>{item.date}</Text>
                </View>
              ) : (
                <View />
              )}
              <Text style={styles.readMore}>Read →</Text>
            </View>
          </View>
        </Pressable>
      )}
      ListFooterComponent={
        next ? (
          <Pressable
            onPress={onLoadMore}
            disabled={loading}
            style={({ pressed }) => [styles.moreBtn, pressed && { opacity: 0.85 }]}
          >
            {loading ? (
              <ActivityIndicator color={colors.white} />
            ) : (
              <Text style={styles.moreText}>{failed ? 'Try again' : 'Load more'}</Text>
            )}
          </Pressable>
        ) : undefined
      }
    />
  );
}

const styles = StyleSheet.create({
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xl * 2,
    width: '100%',
    maxWidth: 760,
    alignSelf: 'center',
  },
  header: { marginBottom: spacing.lg },
  title: { fontSize: 24, fontWeight: '800', color: colors.text },
  underline: {
    width: 40,
    height: 3,
    borderRadius: 2,
    backgroundColor: colors.primary,
    marginTop: spacing.sm,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    marginBottom: spacing.lg,
  },
  image: { width: '100%', aspectRatio: 16 / 9, backgroundColor: colors.primaryLight },
  body: { padding: spacing.md },
  category: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  cardTitle: { fontSize: 17, fontWeight: '700', color: colors.text, lineHeight: 23 },
  excerpt: { fontSize: 14, color: colors.textMuted, lineHeight: 20, marginTop: spacing.sm },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.md,
  },
  dateRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  date: { fontSize: 12, color: colors.textMuted },
  readMore: { fontSize: 13, fontWeight: '700', color: colors.primary },
  moreBtn: {
    backgroundColor: colors.primary,
    borderRadius: radius.sm,
    paddingVertical: 14,
    alignItems: 'center',
  },
  moreText: { color: colors.white, fontWeight: '700', fontSize: 15 },
});
