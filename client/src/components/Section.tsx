import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors, spacing } from '@/constants/theme';

/** Section heading with a short green underline, like the website's section titles. */
export function Section({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  return (
    <View style={styles.section}>
      <View style={styles.header}>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        <Text style={styles.title}>{title}</Text>
        <View style={styles.underline} />
      </View>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  section: { marginTop: spacing.xl + spacing.sm },
  header: { paddingHorizontal: spacing.lg, marginBottom: spacing.md },
  subtitle: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 2,
  },
  title: { fontSize: 22, fontWeight: '800', color: colors.text },
  underline: {
    width: 40,
    height: 3,
    borderRadius: 2,
    backgroundColor: colors.primary,
    marginTop: spacing.sm,
  },
});
