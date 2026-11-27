import Ionicons from '@expo/vector-icons/Ionicons';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { TopBar } from '@/components/TopBar';
import { colors, radius, spacing } from '@/constants/theme';
import { menu, type MenuItem } from '@/data/site';
import { openPage } from '@/utils/open';

/** One menu entry. Items with children expand; tapping the label opens the page. */
function MenuNode({ item, depth }: { item: MenuItem; depth: number }) {
  const [open, setOpen] = useState(false);
  const hasChildren = !!item.children?.length;

  const onPress = () => {
    if (hasChildren && !item.url) setOpen((v) => !v);
    else if (item.url) openPage(item.url);
  };

  return (
    <View>
      <View style={[styles.row, { paddingLeft: spacing.lg + depth * 16 }]}>
        <Pressable onPress={onPress} style={styles.labelBtn}>
          <Text style={[styles.label, depth === 0 && styles.labelTop]}>{item.label}</Text>
        </Pressable>
        {hasChildren ? (
          <Pressable onPress={() => setOpen((v) => !v)} hitSlop={10} style={styles.toggle}>
            <Ionicons name={open ? 'chevron-up' : 'chevron-down'} size={18} color={colors.primary} />
          </Pressable>
        ) : (
          <Ionicons name="open-outline" size={16} color={colors.textMuted} style={styles.ext} />
        )}
      </View>
      {open && item.children
        ? item.children.map((c) => <MenuNode key={c.label} item={c} depth={depth + 1} />)
        : null}
    </View>
  );
}

export default function ExploreScreen() {
  return (
    <View style={styles.screen}>
      <TopBar />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.heading}>Explore</Text>
        <Text style={styles.sub}>Every section of the website, in one place.</Text>
        <View style={styles.card}>
          {menu.map((item, i) => (
            <View key={item.label} style={i > 0 ? styles.divider : null}>
              <MenuNode item={item} depth={0} />
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingBottom: spacing.xl },
  heading: { fontSize: 24, fontWeight: '800', color: colors.text },
  sub: { fontSize: 14, color: colors.textMuted, marginTop: 4, marginBottom: spacing.lg },
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  divider: { borderTopWidth: 1, borderTopColor: colors.border },
  row: { flexDirection: 'row', alignItems: 'center', minHeight: 50, paddingRight: spacing.md },
  labelBtn: { flex: 1, paddingVertical: 12 },
  label: { fontSize: 15, color: colors.text },
  labelTop: { fontWeight: '700' },
  toggle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ext: { marginRight: 8 },
});
