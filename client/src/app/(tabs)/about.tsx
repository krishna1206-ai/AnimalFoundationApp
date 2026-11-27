import Ionicons from '@expo/vector-icons/Ionicons';
import { Image } from 'expo-image';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Section } from '@/components/Section';
import { TopBar } from '@/components/TopBar';
import { colors, radius, spacing } from '@/constants/theme';
import { about, mission, site } from '@/data/site';
import { openPage } from '@/utils/open';

export default function AboutScreen() {
  return (
    <View style={styles.screen}>
      <TopBar />
      <ScrollView contentContainerStyle={styles.content}>
        <Section title={about.title}>
          <View style={styles.pad}>
            <Image source={about.images[0]} style={styles.image} contentFit="cover" />
            {about.paragraphs.map((p) => (
              <Text key={p} style={styles.paragraph}>
                {p}
              </Text>
            ))}
            <Image source={about.images[1]} style={styles.image} contentFit="cover" />
          </View>
        </Section>

        <Section title={mission.title}>
          <View style={styles.pad}>
            <View style={styles.quote}>
              <Ionicons name="paw" size={22} color={colors.primaryLight} />
              <Text style={styles.quoteText}>{mission.quote}</Text>
            </View>
            {mission.paragraphs.map((p) => (
              <Text key={p} style={styles.paragraph}>
                {p}
              </Text>
            ))}
            <Pressable
              onPress={() => openPage(`${site.url}/about-us/`)}
              style={({ pressed }) => [styles.button, pressed && { opacity: 0.85 }]}
            >
              <Text style={styles.buttonText}>Read the full About page</Text>
            </Pressable>
          </View>
        </Section>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { paddingBottom: spacing.xl },
  pad: { paddingHorizontal: spacing.lg },
  image: {
    width: '100%',
    aspectRatio: 16 / 9,
    borderRadius: radius.md,
    backgroundColor: colors.primaryLight,
    marginVertical: spacing.sm,
  },
  paragraph: { fontSize: 15, color: colors.text, lineHeight: 24, marginVertical: spacing.sm },
  quote: { backgroundColor: colors.primary, borderRadius: radius.lg, padding: spacing.xl },
  quoteText: {
    color: colors.white,
    fontSize: 19,
    fontWeight: '700',
    lineHeight: 27,
    marginTop: spacing.sm,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: radius.sm,
    paddingVertical: 13,
    alignItems: 'center',
    marginTop: spacing.md,
  },
  buttonText: { color: colors.white, fontWeight: '700', fontSize: 15 },
});
