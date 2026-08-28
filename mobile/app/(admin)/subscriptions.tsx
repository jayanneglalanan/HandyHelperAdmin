import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, Modal, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import { useSubscriptions } from '../../hooks/useMockData';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';

const STORAGE_KEY = 'handyhelper_subscriptions';

export default function SubscriptionsScreen() {
  const { colors } = useTheme();
  const basePlans = useSubscriptions();
  const [customItems, setCustomItems] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', price: '', duration: 'yearly', featuresText: '' });

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

  const plans = [...basePlans, ...customItems];

  const handleSave = () => {
    if (!form.name.trim()) { Alert.alert('Error', 'Name is required'); return; }
    const price = Number(form.price);
    if (!price || price < 0) { Alert.alert('Error', 'Enter a valid price'); return; }
    const features = form.featuresText.split('\n').map(f => f.trim()).filter(Boolean);
    const newItem = { id: `plan_custom_${Date.now()}`, name: form.name.trim(), price, duration: form.duration, features, status: 'active', subscriberCount: 0 };
    setCustomItems(prev => [newItem, ...prev]);
    setForm({ name: '', price: '', duration: 'yearly', featuresText: '' });
    setShowModal(false);
    Alert.alert('Added', `"${newItem.name}" plan added`);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.text }]}>Subscriptions</Text>
        <FlatList
          data={plans}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Card style={{ marginBottom: 10 }}>
              <View style={styles.header}>
                <Text style={[styles.planName, { color: colors.text }]}>{item.name}</Text>
                <Badge>{item.subscriberCount} subscribers</Badge>
              </View>
              <Text style={[styles.price, { color: colors.text }]}>{item.price === 0 ? 'Free' : `$${item.price}/${item.duration}`}</Text>
              <View style={styles.features}>
                {item.features.slice(0, 4).map((f: string, i: number) => (
                  <Text key={i} style={[styles.feature, { color: colors.textSecondary }]}>✓ {f}</Text>
                ))}
              </View>
              <View style={{ flexDirection: 'row', gap: 6, marginTop: 8 }}>
                <TouchableOpacity onPress={() => Alert.alert('Edit', `Editing "${item.name}"`)} style={{ paddingVertical: 4, paddingHorizontal: 10, borderRadius: 6, borderWidth: 1, borderColor: colors.border }}>
                  <Text style={{ fontSize: 12, color: colors.textSecondary }}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => Alert.alert('Delete', `Delete "${item.name}"?`)} style={{ paddingVertical: 4, paddingHorizontal: 10, borderRadius: 6, borderWidth: 1, borderColor: colors.error || '#DC2626' }}>
                  <Text style={{ fontSize: 12, color: colors.error || '#DC2626' }}>Delete</Text>
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
              <Text style={[styles.modalTitle, { color: colors.text }]}>Add Plan</Text>
              <TouchableOpacity onPress={() => setShowModal(false)}><Ionicons name="close" size={22} color={colors.textSecondary} /></TouchableOpacity>
            </View>
            <Text style={[styles.label, { color: colors.textSecondary }]}>Plan Name *</Text>
            <TextInput style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]} value={form.name} onChangeText={v => setForm(f => ({ ...f, name: v }))} placeholder="e.g. Basic" placeholderTextColor={colors.textMuted} />
            <View style={styles.row}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.label, { color: colors.textSecondary }]}>Price ($) *</Text>
                <TextInput style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]} value={form.price} onChangeText={v => setForm(f => ({ ...f, price: v }))} placeholder="0" placeholderTextColor={colors.textMuted} keyboardType="numeric" />
              </View>
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={[styles.label, { color: colors.textSecondary }]}>Duration</Text>
                <View style={styles.durationRow}>
                  {['monthly', 'yearly'].map(d => (
                    <TouchableOpacity key={d} onPress={() => setForm(f => ({ ...f, duration: d }))} style={[styles.typeBtn, { backgroundColor: form.duration === d ? colors.primary : colors.surface, borderColor: form.duration === d ? colors.primary : colors.border }]}>
                      <Text style={{ color: form.duration === d ? '#FFF' : colors.textSecondary, fontSize: 12, fontWeight: '500', textTransform: 'capitalize' }}>{d}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>
            <Text style={[styles.label, { color: colors.textSecondary }]}>Features (one per line)</Text>
            <TextInput style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text, height: 100, textAlignVertical: 'top' }]} value={form.featuresText} onChangeText={v => setForm(f => ({ ...f, featuresText: v }))} placeholder={"Feature 1\nFeature 2\nFeature 3"} placeholderTextColor={colors.textMuted} multiline />
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
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  planName: { fontSize: 16, fontWeight: '700' },
  price: { fontSize: 22, fontWeight: 'bold', marginTop: 6 },
  features: { marginTop: 10, gap: 4 },
  feature: { fontSize: 13 },
  fab: { position: 'absolute', bottom: 24, right: 20, width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.3, shadowRadius: 6, elevation: 6 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, maxHeight: '80%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  modalTitle: { fontSize: 18, fontWeight: '600' },
  label: { fontSize: 13, fontWeight: '500', marginBottom: 6, marginLeft: 2 },
  input: { borderWidth: 1, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12, fontSize: 15, marginBottom: 12 },
  row: { flexDirection: 'row', marginBottom: 0 },
  durationRow: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  typeBtn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, borderWidth: 1 },
  modalActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 10, marginTop: 8 },
  cancelBtn: { paddingVertical: 10, paddingHorizontal: 14 },
  saveBtn: { paddingVertical: 10, paddingHorizontal: 20, borderRadius: 8 },
  saveBtnText: { color: '#FFF', fontSize: 14, fontWeight: '600' },
});
