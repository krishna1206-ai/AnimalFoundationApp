import Ionicons from '@expo/vector-icons/Ionicons';
import { useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  type TextInputProps,
} from 'react-native';

import { colors, radius, spacing } from '@/constants/theme';
import { submitRequest, type FormType, type SubmitResult } from '@/utils/submit';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function Field({
  label,
  required,
  error,
  ...input
}: TextInputProps & { label: string; required?: boolean; error?: string }) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>
        {label}
        {required ? <Text style={styles.req}> *</Text> : null}
      </Text>
      <TextInput
        placeholderTextColor={colors.textMuted}
        {...input}
        style={[styles.input, input.multiline && styles.multiline, error && styles.inputError]}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

export function ContactForm() {
  const [type, setType] = useState<FormType>('contact');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sent, setSent] = useState<SubmitResult | null>(null);
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState('');

  const isHelp = type === 'help';

  const onSubmit = async () => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = 'Please enter your name.';
    if (!EMAIL_RE.test(email.trim())) e.email = 'Please enter a valid email.';
    if (isHelp && !phone.trim()) e.phone = 'A phone number helps us reach you quickly.';
    if (!subject.trim()) e.subject = 'Please add a subject.';
    if (message.trim().length < 10) e.message = 'Please write a little more (at least 10 characters).';
    setErrors(e);
    if (Object.keys(e).length) return;

    setSending(true);
    setSendError('');
    try {
      const result = await submitRequest({
        type,
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim() || undefined,
        location: isHelp ? location.trim() || undefined : undefined,
        subject: subject.trim(),
        message: message.trim(),
      });
      setSent(result);
    } catch {
      setSendError("Sorry, your message couldn't be sent. Please check your connection and try again.");
    } finally {
      setSending(false);
    }
  };

  const reset = () => {
    setName('');
    setEmail('');
    setPhone('');
    setLocation('');
    setSubject('');
    setMessage('');
    setErrors({});
    setSendError('');
    setSent(null);
  };

  if (sent) {
    return (
      <View style={[styles.card, styles.sent]}>
        <View style={styles.sentIcon}>
          <Ionicons name="checkmark" size={30} color={colors.white} />
        </View>
        <Text style={styles.sentTitle}>Thank you, {name.split(' ')[0]}!</Text>
        <Text style={styles.sentText}>
          {sent === 'saved'
            ? isHelp
              ? 'We have received your help request. Our team will contact you as soon as possible.'
              : 'We have received your message. Our team will get back to you soon.'
            : 'Your email app has opened with your message. Press send there and our team will get back to you.'}
        </Text>
        <Pressable onPress={reset} style={styles.secondaryBtn}>
          <Text style={styles.secondaryText}>Send another message</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Send us a message</Text>

      {/* Contact vs Help request */}
      <View style={styles.segment}>
        {(
          [
            { v: 'contact', label: 'General enquiry', icon: 'mail-outline' },
            { v: 'help', label: 'Animal needs help', icon: 'paw-outline' },
          ] as const
        ).map((o) => {
          const active = type === o.v;
          return (
            <Pressable
              key={o.v}
              onPress={() => setType(o.v)}
              style={[styles.segBtn, active && styles.segActive]}
            >
              <Ionicons name={o.icon} size={16} color={active ? colors.white : colors.textMuted} />
              <Text style={[styles.segText, active && styles.segTextActive]}>{o.label}</Text>
            </Pressable>
          );
        })}
      </View>

      <Field label="Full name" required value={name} onChangeText={setName} placeholder="Your name" autoComplete="name" error={errors.name} />
      <Field
        label="Email"
        required
        value={email}
        onChangeText={setEmail}
        placeholder="you@example.com"
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
        error={errors.email}
      />
      <Field
        label="Phone"
        required={isHelp}
        value={phone}
        onChangeText={setPhone}
        placeholder="+1 555 123 4567"
        keyboardType="phone-pad"
        autoComplete="tel"
        error={errors.phone}
      />
      {isHelp ? (
        <Field
          label="Location of the animal"
          value={location}
          onChangeText={setLocation}
          placeholder="Street, area, city"
        />
      ) : null}
      <Field
        label="Subject"
        required
        value={subject}
        onChangeText={setSubject}
        placeholder={isHelp ? 'e.g. Injured dog near the market' : 'How can we help?'}
        error={errors.subject}
      />
      <Field
        label="Message"
        required
        value={message}
        onChangeText={setMessage}
        placeholder={
          isHelp
            ? 'Describe the animal, its condition and how to find it…'
            : 'Write your message…'
        }
        multiline
        error={errors.message}
      />

      <Pressable
        onPress={onSubmit}
        disabled={sending}
        style={({ pressed }) => [styles.submit, (pressed || sending) && { opacity: 0.7 }]}
      >
        {sending ? (
          <ActivityIndicator color={colors.white} />
        ) : (
          <>
            <Ionicons name="send" size={16} color={colors.white} />
            <Text style={styles.submitText}>Send message</Text>
          </>
        )}
      </Pressable>
      {sendError ? <Text style={[styles.error, styles.sendError]}>{sendError}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
  },
  title: { fontSize: 18, fontWeight: '800', color: colors.text, marginBottom: spacing.md },
  segment: {
    flexDirection: 'row',
    backgroundColor: colors.background,
    borderRadius: radius.sm,
    padding: 3,
    marginBottom: spacing.sm,
  },
  segBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: radius.sm - 2,
  },
  segActive: { backgroundColor: colors.primary },
  segText: { fontSize: 13, fontWeight: '600', color: colors.textMuted },
  segTextActive: { color: colors.white },
  field: { marginTop: spacing.md },
  label: { fontSize: 13, fontWeight: '600', color: colors.text, marginBottom: 6 },
  req: { color: colors.danger },
  input: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: 11,
    fontSize: 15,
    color: colors.text,
  },
  multiline: { minHeight: 120, textAlignVertical: 'top' },
  inputError: { borderColor: colors.danger },
  error: { color: colors.danger, fontSize: 12, marginTop: 4 },
  sendError: { textAlign: 'center', marginTop: spacing.md, fontSize: 13 },
  submit: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.primary,
    borderRadius: radius.sm,
    paddingVertical: 14,
    marginTop: spacing.lg,
  },
  submitText: { color: colors.white, fontWeight: '700', fontSize: 16 },
  sent: { alignItems: 'center', paddingVertical: spacing.xl },
  sentIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sentTitle: { fontSize: 20, fontWeight: '800', color: colors.text, marginTop: spacing.md },
  sentText: {
    fontSize: 14,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 21,
    marginTop: spacing.sm,
  },
  secondaryBtn: {
    marginTop: spacing.lg,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.lg,
    paddingVertical: 10,
  },
  secondaryText: { color: colors.primary, fontWeight: '700' },
});
