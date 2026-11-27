import Ionicons from '@expo/vector-icons/Ionicons';
import { Redirect, router } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors, radius, spacing } from '@/constants/theme';
import { useApp } from '@/context/AppContext';

export default function LoginScreen() {
  const { ready, demoMode, isLoggedIn, login } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  if (!ready) {
    return (
      <View style={[styles.safe, { alignItems: 'center', justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }
  if (isLoggedIn) return <Redirect href="/" />;

  const onSubmit = async () => {
    if (busy) return;
    setBusy(true);
    const err = await login(email, password);
    setBusy(false);
    if (err) {
      setError(err);
    } else {
      setError('');
      router.replace('/');
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.logo}>
          <Ionicons name="paw" size={44} color={colors.white} />
        </View>
        <Text style={styles.title}>Animal Foundation</Text>
        <Text style={styles.subtitle}>Owner dashboard · sign in to view website requests</Text>

        <View style={styles.form}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="owner@example.com"
            placeholderTextColor={colors.textMuted}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
          />

          <Text style={styles.label}>Password</Text>
          <View style={styles.passwordRow}>
            <TextInput
              style={[styles.input, styles.passwordInput]}
              value={password}
              onChangeText={setPassword}
              placeholder="••••••••"
              placeholderTextColor={colors.textMuted}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              onSubmitEditing={onSubmit}
            />
            <Pressable style={styles.eye} onPress={() => setShowPassword((v) => !v)} hitSlop={10}>
              <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={20} color={colors.textMuted} />
            </Pressable>
          </View>

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <Pressable
            style={({ pressed }) => [styles.button, (pressed || busy) && { opacity: 0.85 }]}
            onPress={onSubmit}
            disabled={busy}
          >
            {busy ? (
              <ActivityIndicator color={colors.white} />
            ) : (
              <Text style={styles.buttonText}>Sign in</Text>
            )}
          </Pressable>

          {demoMode ? (
            <Text style={styles.demo}>
              Demo mode: backend not connected, showing sample data. Any email and password works.
            </Text>
          ) : null}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1, justifyContent: 'center', padding: spacing.xl },
  logo: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: spacing.lg,
  },
  title: { fontSize: 26, fontWeight: '800', color: colors.text, textAlign: 'center' },
  subtitle: { fontSize: 14, color: colors.textMuted, textAlign: 'center', marginTop: spacing.xs },
  form: { marginTop: spacing.xl * 1.5 },
  label: { fontSize: 13, fontWeight: '600', color: colors.text, marginBottom: 6, marginTop: spacing.md },
  input: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    fontSize: 15,
    color: colors.text,
  },
  passwordRow: { justifyContent: 'center' },
  passwordInput: { paddingRight: 44 },
  eye: { position: 'absolute', right: 12 },
  error: { color: colors.danger, marginTop: spacing.md, fontSize: 13 },
  button: {
    backgroundColor: colors.primary,
    borderRadius: radius.sm,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: spacing.xl,
  },
  buttonText: { color: colors.white, fontSize: 16, fontWeight: '700' },
  demo: { color: colors.textMuted, fontSize: 12, textAlign: 'center', marginTop: spacing.lg, lineHeight: 18 },
});
