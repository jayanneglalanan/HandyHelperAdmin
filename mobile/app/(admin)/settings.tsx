import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import { useBrand } from '../../hooks/useBrand';

export default function SettingsScreen() {
  const { colors, theme, setTheme } = useTheme();
  const { brandName, setBrandName } = useBrand();
  const [activeSection, setActiveSection] = useState('general');
  const [brandInput, setBrandInput] = useState(brandName);
  const [notifSettings, setNotifSettings] = useState({
    registrations: true,
    credentials: true,
    reports: true,
    jobs: false,
  });
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');

  const sections = [
    { id: 'general', label: 'General', icon: 'settings-outline' },
    { id: 'appearance', label: 'Appearance', icon: 'color-palette-outline' },
    { id: 'notifications', label: 'Notifications', icon: 'notifications-outline' },
    { id: 'security', label: 'Security', icon: 'lock-closed-outline' },
  ];

  const handleSaveBrand = () => {
    if (brandInput.trim()) {
      setBrandName(brandInput.trim());
      Alert.alert('Saved', 'Brand name updated');
    }
  };

  const toggleNotif = (key: keyof typeof notifSettings) => {
    setNotifSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleChangePassword = () => {
    if (!currentPw || !newPw || !confirmPw) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    if (newPw !== confirmPw) {
      Alert.alert('Error', 'New passwords do not match');
      return;
    }
    if (newPw.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }
    Alert.alert('Success', 'Password updated successfully');
    setShowPasswordModal(false);
    setCurrentPw('');
    setNewPw('');
    setConfirmPw('');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.title, { color: colors.text }]}>Settings</Text>

        <View style={styles.menuList}>
          {sections.map((section) => (
            <TouchableOpacity key={section.id} onPress={() => setActiveSection(section.id)} style={[styles.menuItem, { backgroundColor: colors.white, borderColor: colors.border }]}>
              <Ionicons name={section.icon as any} size={20} color={colors.textSecondary} />
              <Text style={[styles.menuLabel, { color: colors.text }]}>{section.label}</Text>
              <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
            </TouchableOpacity>
          ))}
        </View>

        {activeSection === 'general' && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>General Settings</Text>
            <View style={styles.editableField}>
              <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>Platform Name</Text>
              <TextInput style={[styles.textInput, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]} value={brandInput} onChangeText={setBrandInput} placeholder="Enter brand name" placeholderTextColor={colors.textMuted} />
              <TouchableOpacity style={[styles.saveButton, { backgroundColor: colors.accent || '#5B4BDB' }]} onPress={handleSaveBrand}>
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
            <View style={[styles.settingItem, { borderBottomColor: colors.border }]}>
              <Text style={[styles.settingLabel, { color: colors.textSecondary }]}>Support Email</Text>
              <Text style={[styles.settingValue, { color: colors.text }]}>support@handyhelper.com</Text>
            </View>
          </View>
        )}

        {activeSection === 'appearance' && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Theme</Text>
            <View style={styles.themeOptions}>
              {[{ id: 'light', label: 'Light', icon: 'sunny' }, { id: 'dark', label: 'Dark', icon: 'moon' }, { id: 'system', label: 'System', icon: 'phone-portrait' }].map((option) => (
                <TouchableOpacity key={option.id} onPress={() => setTheme(option.id as any)} style={[styles.themeOption, { borderColor: theme === option.id ? colors.primary : colors.border, backgroundColor: theme === option.id ? colors.surfaceAlt : colors.white }]}>
                  <Ionicons name={option.icon as any} size={24} color={theme === option.id ? colors.primary : colors.textMuted} />
                  <Text style={[styles.themeLabel, { color: theme === option.id ? colors.primary : colors.textSecondary }]}>{option.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text style={[styles.sectionTitle, { color: colors.text, marginTop: 20 }]}>Accent Color</Text>
            <View style={styles.colorRow}>
              {['#1A1A1A', '#2563EB', '#059669', '#DC2626', '#7C3AED'].map((color) => (
                <TouchableOpacity key={color} onPress={() => Alert.alert('Accent Color', `Color ${color} selected`)} style={[styles.colorDot, { backgroundColor: color }]} />
              ))}
            </View>
          </View>
        )}

        {activeSection === 'notifications' && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Notifications</Text>
            {([
              { key: 'registrations' as const, label: 'New registrations' },
              { key: 'credentials' as const, label: 'Credential submissions' },
              { key: 'reports' as const, label: 'Reports & disputes' },
              { key: 'jobs' as const, label: 'Job completions' },
            ]).map((item) => (
              <TouchableOpacity key={item.key} onPress={() => toggleNotif(item.key)} style={[styles.settingItem, { borderBottomColor: colors.border }]}>
                <Text style={[styles.settingLabel, { color: colors.text }]}>{item.label}</Text>
                <View style={[styles.toggle, { backgroundColor: notifSettings[item.key] ? colors.primary : colors.border }]}>
                  <View style={[styles.toggleDot, { transform: [{ translateX: notifSettings[item.key] ? 18 : 2 }] }]} />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {activeSection === 'security' && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Security</Text>
            {showPasswordModal ? (
              <View style={[styles.passwordModal, { backgroundColor: colors.white, borderColor: colors.border }]}>
                <Text style={[styles.sectionTitle, { color: colors.text, marginBottom: 12 }]}>Change Password</Text>
                <View style={styles.inputGroup}>
                  <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>Current Password</Text>
                  <TextInput style={[styles.textInput, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]} value={currentPw} onChangeText={setCurrentPw} secureTextEntry placeholder="Current password" placeholderTextColor={colors.textMuted} />
                </View>
                <View style={styles.inputGroup}>
                  <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>New Password</Text>
                  <TextInput style={[styles.textInput, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]} value={newPw} onChangeText={setNewPw} secureTextEntry placeholder="New password" placeholderTextColor={colors.textMuted} />
                </View>
                <View style={styles.inputGroup}>
                  <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>Confirm Password</Text>
                  <TextInput style={[styles.textInput, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]} value={confirmPw} onChangeText={setConfirmPw} secureTextEntry placeholder="Confirm password" placeholderTextColor={colors.textMuted} />
                </View>
                <View style={styles.passwordActions}>
                  <TouchableOpacity onPress={() => { setShowPasswordModal(false); setCurrentPw(''); setNewPw(''); setConfirmPw(''); }} style={styles.cancelBtn}>
                    <Text style={{ color: colors.textSecondary, fontSize: 14 }}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={handleChangePassword} style={[styles.saveButton, { backgroundColor: colors.accent || '#5B4BDB' }]}>
                    <Text style={styles.saveButtonText}>Update</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <TouchableOpacity onPress={() => setShowPasswordModal(true)} style={[styles.menuItem, { backgroundColor: colors.white, borderColor: colors.border }]}>
                <Ionicons name="key-outline" size={20} color={colors.textSecondary} />
                <Text style={[styles.menuLabel, { color: colors.text }]}>Change Password</Text>
                <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
              </TouchableOpacity>
            )}
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
  menuItem: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderRadius: 12, borderWidth: 1 },
  menuLabel: { fontSize: 15, flex: 1 },
  section: { marginTop: 4 },
  sectionTitle: { fontSize: 16, fontWeight: '600', marginBottom: 12 },
  themeOptions: { flexDirection: 'row', gap: 10 },
  themeOption: { flex: 1, alignItems: 'center', gap: 8, padding: 14, borderRadius: 12, borderWidth: 2 },
  themeLabel: { fontSize: 13, fontWeight: '500' },
  colorRow: { flexDirection: 'row', gap: 12 },
  colorDot: { width: 32, height: 32, borderRadius: 16 },
  settingItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1 },
  settingLabel: { fontSize: 14 },
  settingValue: { fontSize: 14, fontWeight: '500' },
  editableField: { marginBottom: 16 },
  fieldLabel: { fontSize: 13, fontWeight: '500', marginBottom: 6, marginLeft: 2 },
  textInput: { borderWidth: 1, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12, fontSize: 15, marginBottom: 10 },
  saveButton: { paddingVertical: 10, borderRadius: 8, alignItems: 'center' },
  saveButtonText: { color: '#FFFFFF', fontSize: 14, fontWeight: '600' },
  toggle: { width: 44, height: 24, borderRadius: 12, justifyContent: 'center', paddingHorizontal: 2 },
  toggleDot: { width: 20, height: 20, borderRadius: 10, backgroundColor: 'white' },
  passwordModal: { borderRadius: 12, borderWidth: 1, padding: 16, marginBottom: 8 },
  inputGroup: { marginBottom: 4 },
  passwordActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 8, marginTop: 8 },
  cancelBtn: { paddingVertical: 10, paddingHorizontal: 12 },
});
