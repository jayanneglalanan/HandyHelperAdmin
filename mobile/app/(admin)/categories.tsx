import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, Modal, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import { useCategories } from '../../hooks/useMockData';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';

const STORAGE_KEY = 'handyhelper_categories';

function loadCustom(): any[] {
  try { const raw = require('@react-native-async-storage/async-storage').default; } catch {}
  return [];
}

export default function CategoriesScreen() {
  const { colors } = useTheme();
  const baseCategories = useCategories();
  const [customItems, setCustomItems] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', icon: '🔧', description: '' });

  useEffect(() => {
    const AsyncStorage = require('@react-native-async-storage/async-storage').default;
    AsyncStorage.getItem(STORAGE_KEY).then((raw: string | null) => {
      if (raw) setCustomItems(JSON.parse(raw));
    });
  }, []);

  useEffect(() => {
    const AsyncStorage = require('@react-native-async-storage/async-storage').default;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(customItems));
  }, [customItems]);

  const categories = [...baseCategories, ...customItems];

  const handleSave = () => {
    if (!form.name.trim()) { Alert.alert('Error', 'Name is required'); return; }
    const newItem = { id: `cat_custom_${Date.now()}`, name: form.name.trim(), icon: form.icon || '🔧', description: form.description.trim(), status: 'active', memberCount: 0, jobCount: 0 };
    setCustomItems(prev => [newItem, ...prev]);
    setForm({ name: '', icon: '🔧', description: '' });
    setShowModal(false);
    Alert.alert('Added', `"${newItem.name}" added`);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.text }]}>Categories</Text>
        <FlatList
          data={categories}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.row}
          renderItem={({ item }) => (
            <Card style={styles.card}>
              <Text style={styles.icon}>{item.icon}</Text>
              <Text style={[styles.name, { color: colors.text }]}>{item.name}</Text>
              <Text style={[styles.desc, { color: colors.textSecondary }]} numberOfLines={2}>{item.description}</Text>
              <View style={styles.stats}>
                <Text style={[styles.stat, { color: colors.textSecondary }]}>{item.memberCount} members</Text>
                <Text style={[styles.stat, { color: colors.textSecondary }]}>{item.jobCount} jobs</Text>
              </View>
              <View style={{ flexDirection: 'row', gap: 6, marginTop: 8 }}>
                <Badge variant={item.status === 'active' ? 'success' : 'neutral'}>{item.status}</Badge>
                <TouchableOpacity onPress={() => Alert.alert('Edit', `Editing "${item.name}"`)} style={{ paddingVertical: 2, paddingHorizontal: 8, borderRadius: 4, borderWidth: 1, borderColor: colors.border }}>
                  <Text style={{ fontSize: 11, color: colors.textSecondary }}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => Alert.alert('Delete', `Delete "${item.name}"?`)} style={{ paddingVertical: 2, paddingHorizontal: 8, borderRadius: 4, borderWidth: 1, borderColor: colors.error || '#DC2626' }}>
                  <Text style={{ fontSize: 11, color: colors.error || '#DC2626' }}>Delete</Text>
                </TouchableOpacity>
              </View>
            </Card>
          )}
        />
      </View>

      <TouchableOpacity onPress={() => setShowModal(true)} style={[styles.fab, { backgroundColor: colors.accent || '#5B4BDB' }]}>
        <Ionicons name="add" size={28} color="#FFF" />
      </TouchableOpacity>

      <Modal visible={showModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.white }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Add Category</Text>
              <TouchableOpacity onPress={() => setShowModal(false)}><Ionicons name="close" size={22} color={colors.textSecondary} /></TouchableOpacity>
            </View>
            <Text style={[styles.label, { color: colors.textSecondary }]}>Name *</Text>
            <TextInput style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]} value={form.name} onChangeText={v => setForm(f => ({ ...f, name: v }))} placeholder="e.g. Roofing" placeholderTextColor={colors.textMuted} />
            <Text style={[styles.label, { color: colors.textSecondary }]}>Icon (emoji)</Text>
            <TextInput style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]} value={form.icon} onChangeText={v => setForm(f => ({ ...f, icon: v }))} placeholder="🔧" placeholderTextColor={colors.textMuted} />
            <Text style={[styles.label, { color: colors.textSecondary }]}>Description</Text>
            <TextInput style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text, height: 80, textAlignVertical: 'top' }]} value={form.description} onChangeText={v => setForm(f => ({ ...f, description: v }))} placeholder="Brief description" placeholderTextColor={colors.textMuted} multiline />
            <View style={styles.modalActions}>
              <TouchableOpacity onPress={() => setShowModal(false)} style={styles.cancelBtn}><Text style={{ color: colors.textSecondary, fontSize: 14 }}>Cancel</Text></TouchableOpacity>
              <TouchableOpacity onPress={handleSave} style={[styles.saveBtn, { backgroundColor: colors.accent || '#5B4BDB' }]}><Text style={styles.saveBtnText}>Save</Text></TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 12 },
  row: { gap: 8, marginBottom: 8 },
  card: { flex: 1 },
  icon: { fontSize: 28, marginBottom: 8 },
  name: { fontSize: 14, fontWeight: '600' },
  desc: { fontSize: 12, marginTop: 2 },
  stats: { flexDirection: 'row', gap: 12, marginTop: 8 },
  stat: { fontSize: 12 },
  fab: { position: 'absolute', bottom: 24, right: 20, width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.3, shadowRadius: 6, elevation: 6 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, maxHeight: '80%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  modalTitle: { fontSize: 18, fontWeight: '600' },
  label: { fontSize: 13, fontWeight: '500', marginBottom: 6, marginLeft: 2 },
  input: { borderWidth: 1, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12, fontSize: 15, marginBottom: 12 },
  modalActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 10, marginTop: 8 },
  cancelBtn: { paddingVertical: 10, paddingHorizontal: 14 },
  saveBtn: { paddingVertical: 10, paddingHorizontal: 20, borderRadius: 8 },
  saveBtnText: { color: '#FFF', fontSize: 14, fontWeight: '600' },
});
