import { Image } from 'expo-image';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, radius, spacing } from '@/constants/theme';
import type { Article } from '@/data/site';
import { openPage } from '@/utils/open';

/** Big card: image on top, title, author · date. `width` set for horizontal carousels. */
export function ArticleCard({ article, width }: { article: Article; width?: number }) {
  return (
    <Pressable
      onPress={() => openPage(article.url)}
      style={({ pressed }) => [styles.card, width ? { width } : null, pressed && styles.pressed]}
    >
      <Image source={article.image} style={styles.image} contentFit="cover" transition={200} />
      <View style={styles.body}>
        <Text style={styles.title} numberOfLines={3}>
          {article.title}
        </Text>
        <Text style={styles.meta} numberOfLines={1}>
          {article.author} · {article.date}
        </Text>
      </View>
    </Pressable>
  );
}

/** Compact row: thumbnail left, title + meta right. */
export function ArticleRow({ article }: { article: Article }) {
  return (
    <Pressable
      onPress={() => openPage(article.url)}
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}
    >
      <Image source={article.image} style={styles.thumb} contentFit="cover" transition={200} />
      <View style={styles.rowBody}>
        <Text style={styles.rowTitle} numberOfLines={3}>
          {article.title}
        </Text>
        <Text style={styles.meta} numberOfLines={1}>
          {article.author} · {article.date}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  pressed: { opacity: 0.75 },
  image: { width: '100%', aspectRatio: 16 / 10, backgroundColor: colors.primaryLight },
  body: { padding: spacing.md },
  title: { fontSize: 15, fontWeight: '700', color: colors.text, lineHeight: 20 },
  meta: { fontSize: 12, color: colors.textMuted, marginTop: spacing.sm },
  row: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.sm,
    marginBottom: spacing.md,
  },
  thumb: {
    width: 96,
    height: 96,
    borderRadius: radius.sm,
    backgroundColor: colors.primaryLight,
  },
  rowBody: { flex: 1, marginLeft: spacing.md, justifyContent: 'center' },
  rowTitle: { fontSize: 14, fontWeight: '700', color: colors.text, lineHeight: 19 },
});
