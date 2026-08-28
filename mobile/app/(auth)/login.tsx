import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import { useBrand } from '../../hooks/useBrand';

export default function VerificationScreen() {
  const { colors } = useTheme();
  const { brandName } = useBrand();
  const [email, setEmail] = useState('admin@handyhelper.com');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    setLoading(true);
    setError('');
    await new Promise(r => setTimeout(r, 800));
    if (email === 'admin@handyhelper.com' && password === 'admin123') {
      router.replace('/(admin)');
    } else {
      setError('Invalid email or password');
    }
    setLoading(false);
  };

  const handleForgot = () => {
    if (!forgotEmail) {
      Alert.alert('Error', 'Please enter your email');
      return;
    }
    setForgotSent(true);
    Alert.alert('Reset Link Sent', `A password reset link has been sent to ${forgotEmail}`);
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.bgPattern} pointerEvents="none" />
      <View style={styles.bgCircle1} pointerEvents="none" />
      <View style={styles.bgCircle2} pointerEvents="none" />
      <View style={styles.bgCircle3} pointerEvents="none" />

      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <View style={[styles.iconContainer]}>
            <Ionicons name="shield-checkmark" size={40} color={colors.accent || '#5B4BDB'} />
          </View>
          <Text style={[styles.title, { color: colors.text }]}>{brandName}</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Admin Dashboard</Text>
        </View>

        <View style={[styles.card, { backgroundColor: colors.white }]}>
          {error ? (
            <View style={[styles.errorBanner]}>
              <Ionicons name="alert-circle" size={18} color={colors.danger} />
              <Text style={[styles.errorText, { color: colors.danger }]}>{error}</Text>
            </View>
          ) : null}

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>Email</Text>
            <View style={[styles.inputWrapper, { borderColor: error ? colors.danger : colors.border }]}>
              <Ionicons name="mail-outline" size={18} color={colors.textMuted} style={styles.inputIcon} />
              <TextInput style={[styles.input, { color: colors.text }]} placeholder="Email address" placeholderTextColor={colors.textMuted} value={email} onChangeText={(t) => { setEmail(t); setError(''); }} keyboardType="email-address" autoCapitalize="none" />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>Password</Text>
            <View style={[styles.inputWrapper, { borderColor: colors.border }]}>
              <Ionicons name="lock-closed-outline" size={18} color={colors.textMuted} style={styles.inputIcon} />
              <TextInput style={[styles.input, { color: colors.text, flex: 1 }]} placeholder="Password" placeholderTextColor={colors.textMuted} value={password} onChangeText={(t) => { setPassword(t); setError(''); }} secureTextEntry={!showPassword} />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeButton} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color={colors.textMuted} />
              </TouchableOpacity>
            </View>
          </View>

          {showForgot ? (
            <View style={styles.forgotSection}>
              <Text style={[styles.label, { color: colors.textSecondary }]}>Reset Email</Text>
              <View style={[styles.inputWrapper, { borderColor: colors.border }]}>
                <Ionicons name="mail-outline" size={18} color={colors.textMuted} style={styles.inputIcon} />
                <TextInput style={[styles.input, { color: colors.text }]} placeholder="Enter your email" placeholderTextColor={colors.textMuted} value={forgotEmail} onChangeText={setForgotEmail} keyboardType="email-address" autoCapitalize="none" />
              </View>
              <View style={styles.forgotActions}>
                <TouchableOpacity onPress={() => { setShowForgot(false); setForgotSent(false); }} style={styles.forgotCancel}>
                  <Text style={{ color: colors.textSecondary, fontSize: 14 }}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleForgot} style={[styles.forgotSubmit, { backgroundColor: colors.accent || '#5B4BDB' }]} disabled={forgotSent}>
                  <Text style={styles.forgotSubmitText}>{forgotSent ? 'Sent!' : 'Send Link'}</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <TouchableOpacity style={styles.forgotButton} onPress={() => setShowForgot(true)}>
              <Text style={[styles.forgotText, { color: colors.accent || '#5B4BDB' }]}>Forgot password?</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity style={[styles.button, { backgroundColor: colors.accent || '#5B4BDB' }]} onPress={handleLogin} disabled={loading} activeOpacity={0.8}>
            {loading ? <ActivityIndicator color="#FFFFFF" size="small" /> : <Text style={styles.buttonText}>Sign In</Text>}
          </TouchableOpacity>
        </View>

        <Text style={[styles.demo, { color: colors.textMuted }]}>Demo: admin@handyhelper.com / admin123</Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  bgPattern: { ...StyleSheet.absoluteFillObject, opacity: 0.12, backgroundColor: '#5B4BDB' },
  bgCircle1: { position: 'absolute', top: -80, right: -60, width: 280, height: 280, borderRadius: 140, backgroundColor: '#5B4BDB', opacity: 0.12 },
  bgCircle2: { position: 'absolute', bottom: -100, left: -80, width: 320, height: 320, borderRadius: 160, backgroundColor: '#5B4BDB', opacity: 0.08 },
  bgCircle3: { position: 'absolute', top: '40%', left: '50%', width: 200, height: 200, borderRadius: 100, backgroundColor: '#5B4BDB', opacity: 0.06 },
  scrollContent: { flexGrow: 1, justifyContent: 'center', padding: 24 },
  header: { alignItems: 'center', marginBottom: 32 },
  iconContainer: { width: 72, height: 72, borderRadius: 20, backgroundColor: '#EDE9FE', alignItems: 'center', justifyContent: 'center', marginBottom: 16, shadowColor: '#5B4BDB', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4 },
  title: { fontSize: 24, fontWeight: '600', letterSpacing: -0.3 },
  subtitle: { fontSize: 14, marginTop: 4 },
  card: { borderRadius: 16, padding: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.12, shadowRadius: 8, elevation: 3 },
  errorBanner: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 12, backgroundColor: '#FEE2E2', borderLeftWidth: 3, borderLeftColor: '#D64545', borderRadius: 8, marginBottom: 20 },
  errorText: { fontSize: 13, flex: 1 },
  inputGroup: { marginBottom: 16 },
  label: { fontSize: 13, fontWeight: '500', marginBottom: 6, marginLeft: 2 },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: 10, backgroundColor: '#FAFAFA' },
  inputIcon: { paddingLeft: 14 },
  input: { flex: 1, paddingHorizontal: 12, paddingVertical: 14, fontSize: 15 },
  eyeButton: { paddingRight: 14 },
  forgotButton: { alignSelf: 'flex-end', marginBottom: 20, marginTop: -4 },
  forgotText: { fontSize: 13, fontWeight: '500' },
  forgotSection: { marginBottom: 16, padding: 12, borderRadius: 10, backgroundColor: '#F5F5F5' },
  forgotActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 8, marginTop: 10 },
  forgotCancel: { paddingVertical: 8, paddingHorizontal: 12 },
  forgotSubmit: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 8 },
  forgotSubmitText: { color: '#FFF', fontSize: 13, fontWeight: '600' },
  button: { paddingVertical: 15, borderRadius: 10, alignItems: 'center', justifyContent: 'center', shadowColor: '#5B4BDB', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.3, shadowRadius: 6, elevation: 4, minHeight: 50 },
  buttonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600', letterSpacing: 0.3 },
  demo: { textAlign: 'center', fontSize: 12, marginTop: 24 },
});
