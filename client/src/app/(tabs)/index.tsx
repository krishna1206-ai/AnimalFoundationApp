import Ionicons from '@expo/vector-icons/Ionicons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { ArticleCard, ArticleRow } from '@/components/ArticleCard';
import { Section } from '@/components/Section';
import { TopBar } from '@/components/TopBar';
import { colors, radius, spacing } from '@/constants/theme';
import {
  about,
  asSeenOn,
  contact,
  fieldTested,
  guides,
  hero,
  mission,
  mostRecent,
  quickLinks,
} from '@/data/site';
import { openPage } from '@/utils/open';

export default function HomeScreen() {
  return (
    <View style={styles.screen}>
      <TopBar />
      <ScrollView contentContainerStyle={styles.content}>
        {/* Hero */}
        <View style={styles.hero}>
          <Image source={hero.image} style={StyleSheet.absoluteFill} contentFit="cover" />
          <View style={styles.heroOverlay} />
          <Text style={styles.heroTitle}>{hero.title}</Text>
          <Pressable
            onPress={() => openPage(hero.button.url)}
            style={({ pressed }) => [styles.heroBtn, pressed && { opacity: 0.85 }]}
          >
            <Text style={styles.heroBtnText}>{hero.button.label}</Text>
            <Ionicons name="arrow-forward" size={16} color={colors.white} />
          </Pressable>
        </View>

        {/* Most Recent */}
        <Section title="Most Recent">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.carousel}
          >
            {mostRecent.map((a) => (
              <ArticleCard key={a.url} article={a} width={260} />
            ))}
          </ScrollView>
        </Section>

        {/* Field Tested */}
        <Section title={fieldTested.title}>
          <View style={styles.pad}>
            <View style={styles.chip}>
              <Text style={styles.chipText}>{fieldTested.category}</Text>
            </View>
            {fieldTested.articles.map((a) => (
              <ArticleRow key={a.url} article={a} />
            ))}
          </View>
        </Section>

        {/* About Us */}
        <Section title={about.title}>
          <View style={styles.pad}>
            <View style={styles.card}>
              <Image source={about.images[0]} style={styles.aboutImage} contentFit="cover" />
              <Text style={styles.paragraph}>{about.paragraphs[0]}</Text>
              <Pressable onPress={() => router.push('/about')} hitSlop={8}>
                <Text style={styles.link}>Read more about us →</Text>
              </Pressable>
            </View>
          </View>
        </Section>

        {/* Our Mission */}
        <Section title={mission.title}>
          <View style={styles.pad}>
            <View style={styles.quote}>
              <Ionicons name="paw" size={22} color={colors.primaryLight} />
              <Text style={styles.quoteText}>{mission.quote}</Text>
            </View>
          </View>
        </Section>

        {/* Making It Easy For You */}
        <Section title="Making It Easy For You">
          <View style={[styles.pad, styles.links]}>
            {quickLinks.map((l) => (
              <Pressable
                key={l.label}
                onPress={() => l.url && openPage(l.url)}
                style={({ pressed }) => [styles.linkChip, pressed && { opacity: 0.7 }]}
              >
                <Text style={styles.linkChipText}>{l.label}</Text>
              </Pressable>
            ))}
          </View>
        </Section>

        {/* As seen on */}
        <Section title="As seen on">
          <View style={[styles.pad, styles.logos]}>
            {asSeenOn.map((src) => (
              <View key={src} style={styles.logoBox}>
                <Image source={src} style={styles.logoImg} contentFit="contain" />
              </View>
            ))}
          </View>
        </Section>

        {/* Our Guides */}
        <Section title="Our Guides">
          <View style={styles.pad}>
            {guides.map((a) => (
              <ArticleRow key={a.url} article={a} />
            ))}
          </View>
        </Section>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerTitle}>World Animal Foundation</Text>
          <Text style={styles.footerText}>{contact.disclaimer}</Text>
          <Text style={styles.footerCopy}>{contact.copyright}</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { paddingBottom: spacing.xl },
  pad: { paddingHorizontal: spacing.lg },
  hero: {
    margin: spacing.lg,
    marginBottom: 0,
    height: 220,
    borderRadius: radius.lg,
    overflow: 'hidden',
    justifyContent: 'flex-end',
    padding: spacing.lg,
    backgroundColor: colors.primaryDark,
  },
  heroOverlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  heroTitle: { color: colors.white, fontSize: 28, fontWeight: '800', lineHeight: 34 },
  heroBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: 10,
    borderRadius: radius.pill,
    marginTop: spacing.md,
  },
  heroBtnText: { color: colors.white, fontWeight: '700', fontSize: 14 },
  carousel: { paddingHorizontal: spacing.lg, gap: spacing.md },
  chip: {
    alignSelf: 'flex-start',
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: radius.pill,
    marginBottom: spacing.md,
  },
  chipText: { color: colors.primaryDark, fontWeight: '700', fontSize: 12 },
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
  },
  aboutImage: {
    width: '100%',
    aspectRatio: 16 / 9,
    borderRadius: radius.sm,
    marginBottom: spacing.md,
    backgroundColor: colors.primaryLight,
  },
  paragraph: { fontSize: 15, color: colors.text, lineHeight: 23 },
  link: { color: colors.primary, fontWeight: '700', marginTop: spacing.md },
  quote: {
    backgroundColor: colors.primary,
    borderRadius: radius.lg,
    padding: spacing.xl,
  },
  quoteText: {
    color: colors.white,
    fontSize: 19,
    fontWeight: '700',
    lineHeight: 27,
    marginTop: spacing.sm,
  },
  links: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  linkChip: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.pill,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  linkChipText: { color: colors.text, fontWeight: '600', fontSize: 13 },
  logos: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  logoBox: {
    width: '31.5%',
    height: 60,
    backgroundColor: colors.card,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.sm,
  },
  logoImg: { width: '100%', height: '100%' },
  footer: {
    marginTop: spacing.xl + spacing.sm,
    marginHorizontal: spacing.lg,
    padding: spacing.lg,
    borderRadius: radius.lg,
    backgroundColor: colors.primaryDark,
  },
  footerTitle: { color: colors.white, fontWeight: '800', fontSize: 16 },
  footerText: { color: '#C8E6C9', fontSize: 13, lineHeight: 19, marginTop: spacing.sm },
  footerCopy: { color: '#A5D6A7', fontSize: 11, marginTop: spacing.md },
});
