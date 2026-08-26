import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';

export default function SettingsScreen() {
  const { colors, theme, setTheme, isDark } = useTheme();
  const [activeSection, setActiveSection] = useState('appearance');

  const sections = [
    { id: 'general', label: 'General', icon: 'settings-outline' },
    { id: 'appearance', label: 'Appearance', icon: 'color-palette-outline' },
    { id: 'notifications', label: 'Notifications', icon: 'notifications-outline' },
    { id: 'security', label: 'Security', icon: 'lock-closed-outline' },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.title, { color: colors.text }]}>Settings</Text>

        <View style={styles.menuList}>
          {sections.map((section) => (
            <TouchableOpacity
              key={section.id}
              onPress={() => setActiveSection(section.id)}
              style={[styles.menuItem, { backgroundColor: colors.white, borderColor: colors.border }]}
            >
              <Ionicons name={section.icon as any} size={20} color={colors.textSecondary} />
              <Text style={[styles.menuLabel, { color: colors.text }]}>{section.label}</Text>
              <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
            </TouchableOpacity>
          ))}
        </View>

        {activeSection === 'appearance' && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Theme</Text>
            <View style={styles.themeOptions}>
              {[
                { id: 'light', label: 'Light', icon: 'sunny' },
                { id: 'dark', label: 'Dark', icon: 'moon' },
                { id: 'system', label: 'System', icon: 'phone-portrait' },
              ].map((option) => (
                <TouchableOpacity
                  key={option.id}
                  onPress={() => setTheme(option.id as any)}
                  style={[
                    styles.themeOption,
                    {
                      borderColor: theme === option.id ? colors.primary : colors.border,
                      backgroundColor: theme === option.id ? colors.surfaceAlt : colors.white,
                    },
                  ]}
                >
                  <Ionicons
                    name={option.icon as any}
                    size={24}
                    color={theme === option.id ? colors.primary : colors.textMuted}
                  />
                  <Text style={[
                    styles.themeLabel,
                    { color: theme === option.id ? colors.primary : colors.textSecondary },
                  ]}>
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={[styles.sectionTitle, { color: colors.text, marginTop: 20 }]}>Accent Color</Text>
            <View style={styles.colorRow}>
              {['#1A1A1A', '#2563EB', '#059669', '#DC2626', '#7C3AED'].map((color) => (
                <View
                  key={color}
                  style={[styles.colorDot, { backgroundColor: color }]}
                />
              ))}
            </View>
          </View>
        )}

        {activeSection === 'general' && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>General Settings</Text>
            <View style={[styles.settingItem, { borderBottomColor: colors.border }]}>
              <Text style={[styles.settingLabel, { color: colors.textSecondary }]}>Platform Name</Text>
              <Text style={[styles.settingValue, { color: colors.text }]}>HandyHelper</Text>
            </View>
            <View style={[styles.settingItem, { borderBottomColor: colors.border }]}>
              <Text style={[styles.settingLabel, { color: colors.textSecondary }]}>Support Email</Text>
              <Text style={[styles.settingValue, { color: colors.text }]}>support@handyhelper.com</Text>
            </View>
          </View>
        )}

        {activeSection === 'notifications' && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Notifications</Text>
            {[
              { label: 'New registrations', defaultOn: true },
              { label: 'Credential submissions', defaultOn: true },
              { label: 'Reports & disputes', defaultOn: true },
              { label: 'Job completions', defaultOn: false },
            ].map((item, i) => (
              <View key={i} style={[styles.settingItem, { borderBottomColor: colors.border }]}>
                <Text style={[styles.settingLabel, { color: colors.text }]}>{item.label}</Text>
                <View style={[styles.toggle, { backgroundColor: item.defaultOn ? colors.primary : colors.border }]}>
                  <View style={[styles.toggleDot, { transform: [{ translateX: item.defaultOn ? 18 : 2 }] }]} />
                </View>
              </View>
            ))}
          </View>
        )}

        {activeSection === 'security' && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Security</Text>
            <TouchableOpacity style={[styles.menuItem, { backgroundColor: colors.white, borderColor: colors.border }]}>
              <Ionicons name="key-outline" size={20} color={colors.textSecondary} />
              <Text style={[styles.menuLabel, { color: colors.text }]}>Change Password</Text>
              <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  menuList: { gap: 8, marginBottom: 20 },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
  },
  menuLabel: { fontSize: 15, flex: 1 },
  section: { marginTop: 4 },
  sectionTitle: { fontSize: 16, fontWeight: '600', marginBottom: 12 },
  themeOptions: { flexDirection: 'row', gap: 10 },
  themeOption: {
    flex: 1,
    alignItems: 'center',
    gap: 8,
    padding: 14,
    borderRadius: 12,
    borderWidth: 2,
  },
  themeLabel: { fontSize: 13, fontWeight: '500' },
  colorRow: { flexDirection: 'row', gap: 12 },
  colorDot: { width: 32, height: 32, borderRadius: 16 },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  settingLabel: { fontSize: 14 },
  settingValue: { fontSize: 14, fontWeight: '500' },
  toggle: {
    width: 44,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  toggleDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'white',
  },
});
