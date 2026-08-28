import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';

export default function LoginScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const [email, setEmail] = useState('admin@handyhelper.com');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: '#F5F5F5' }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        {/* Header */}
        <View style={styles.header}>
          <View style={[styles.iconContainer]}>
            <Ionicons name="shield-checkmark" size={40} color={colors.accent || '#5B4BDB'} />
          </View>
          <Text style={[styles.title, { color: colors.text }]}>HandyHelper</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Admin Dashboard</Text>
        </View>

        {/* Material Card */}
        <View style={[styles.card, { backgroundColor: colors.white }]}>
          {error ? (
            <View style={[styles.errorBanner]}>
              <Ionicons name="alert-circle" size={18} color={colors.danger} />
              <Text style={[styles.errorText, { color: colors.danger }]}>{error}</Text>
            </View>
          ) : null}

          {/* Email Field */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>Email</Text>
            <View style={[styles.inputWrapper, { borderColor: error ? colors.danger : colors.border }]}>
              <Ionicons name="mail-outline" size={18} color={colors.textMuted} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { color: colors.text }]}
                placeholder="Email address"
                placeholderTextColor={colors.textMuted}
                value={email}
                onChangeText={(t) => { setEmail(t); setError(''); }}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>

          {/* Password Field */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>Password</Text>
            <View style={[styles.inputWrapper, { borderColor: colors.border }]}>
              <Ionicons name="lock-closed-outline" size={18} color={colors.textMuted} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { color: colors.text, flex: 1 }]}
                placeholder="Password"
                placeholderTextColor={colors.textMuted}
                value={password}
                onChangeText={(t) => { setPassword(t); setError(''); }}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeButton}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={20}
                  color={colors.textMuted}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Forgot Password */}
          <TouchableOpacity style={styles.forgotButton}>
            <Text style={[styles.forgotText, { color: colors.accent || '#5B4BDB' }]}>
              Forgot password?
            </Text>
          </TouchableOpacity>

          {/* Submit Button */}
          <TouchableOpacity
            style={[styles.button, { backgroundColor: colors.accent || '#5B4BDB' }]}
            onPress={handleLogin}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <Text style={styles.buttonText}>Sign In</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Demo Credentials */}
        <Text style={[styles.demo, { color: colors.textMuted }]}>
          Demo: admin@handyhelper.com / admin123
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  iconContainer: {
    width: 72,
    height: 72,
    borderRadius: 20,
    backgroundColor: '#EDE9FE',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#5B4BDB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 14,
    marginTop: 4,
  },
  card: {
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 3,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    backgroundColor: '#FEE2E2',
    borderLeftWidth: 3,
    borderLeftColor: '#D64545',
    borderRadius: 8,
    marginBottom: 20,
  },
  errorText: {
    fontSize: 13,
    flex: 1,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 6,
    marginLeft: 2,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: '#FAFAFA',
  },
  inputIcon: {
    paddingLeft: 14,
  },
  input: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 14,
    fontSize: 15,
  },
  eyeButton: {
    paddingRight: 14,
  },
  forgotButton: {
    alignSelf: 'flex-end',
    marginBottom: 20,
    marginTop: -4,
  },
  forgotText: {
    fontSize: 13,
    fontWeight: '500',
  },
  button: {
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#5B4BDB',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
    minHeight: 50,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  demo: {
    textAlign: 'center',
    fontSize: 12,
    marginTop: 24,
  },
});
