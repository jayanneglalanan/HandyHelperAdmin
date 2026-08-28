import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, Modal, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import { useContent, useFaqs, useAnnouncements } from '../../hooks/useMockData';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import { formatDate } from '../../../shared/utils/formatters';

const STORAGE_KEY = 'handyhelper_content';

export default function ContentScreen() {
  const { colors } = useTheme();
  const basePages = useContent();
  const baseFaqs = useFaqs();
  const baseAnnouncements = useAnnouncements();
  const [activeTab, setActiveTab] = useState('pages');
  const [customPages, setCustomPages] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ title: '', type: 'faq', content: '' });

  useEffect(() => {
    const AsyncStorage = require('@react-native-async-storage/async-storage').default;
    AsyncStorage.getItem(STORAGE_KEY).then((raw: string | null) => {
      if (raw) setCustomPages(JSON.parse(raw));
    });
  }, []);

  useEffect(() => {
    const AsyncStorage = require('@react-native-async-storage/async-storage').default;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(customPages));
  }, [customPages]);

  const pages = [...basePages, ...customPages];

  const tabs = [
    { id: 'pages', label: 'Pages' },
    { id: 'faqs', label: 'FAQs' },
    { id: 'announcements', label: 'Announcements' },
  ];

  const handleSave = () => {
    if (!form.title.trim()) { Alert.alert('Error', 'Title is required'); return; }
    if (!form.content.trim()) { Alert.alert('Error', 'Content is required'); return; }
    const today = new Date().toISOString().split('T')[0];
    const slug = '/' + form.title.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    const newItem = { id: `page_custom_${Date.now()}`, title: form.title.trim(), slug, type: form.type, status: 'draft', lastUpdated: today, updatedBy: 'Admin', content: form.content.trim() };
    setCustomPages(prev => [newItem, ...prev]);
    setForm({ title: '', type: 'faq', content: '' });
    setShowModal(false);
    Alert.alert('Added', `"${newItem.title}" added`);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.text }]}>Content</Text>

        <View style={styles.tabs}>
          {tabs.map((tab) => (
            <TouchableOpacity key={tab.id} onPress={() => setActiveTab(tab.id)} style={[styles.tab, { backgroundColor: activeTab === tab.id ? colors.primary : colors.surface }]}>
              <Text style={[styles.tabText, { color: activeTab === tab.id ? colors.white : colors.textSecondary }]}>{tab.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {activeTab === 'pages' && (
          <FlatList data={pages} keyExtractor={(item) => item.id} renderItem={({ item }) => (
            <Card style={{ marginBottom: 8 }}>
              <View style={styles.itemHeader}>
                <Text style={[styles.itemTitle, { color: colors.text }]}>{item.title}</Text>
                <Badge variant={item.status === 'published' ? 'success' : 'neutral'}>{item.status}</Badge>
              </View>
              <Text style={[styles.itemSlug, { color: colors.textMuted }]}>{item.slug}</Text>
              <Text style={[styles.itemDate, { color: colors.textMuted }]}>Updated {formatDate(item.lastUpdated)}</Text>
            </Card>
          )} />
        )}

        {activeTab === 'faqs' && (
          <FlatList data={baseFaqs} keyExtractor={(item) => item.id} renderItem={({ item }) => (
            <Card style={{ marginBottom: 8 }}>
              <Text style={[styles.faqQuestion, { color: colors.text }]}>{item.question}</Text>
              <Text style={[styles.faqAnswer, { color: colors.textSecondary }]} numberOfLines={2}>{item.answer}</Text>
              <Badge>{item.category}</Badge>
            </Card>
          )} />
        )}

        {activeTab === 'announcements' && (
          <FlatList data={baseAnnouncements} keyExtractor={(item) => item.id} renderItem={({ item }) => (
            <Card style={{ marginBottom: 8 }}>
              <View style={styles.itemHeader}>
                <Text style={[styles.itemTitle, { color: colors.text }]}>{item.title}</Text>
                <Badge variant={item.type === 'maintenance' ? 'warning' : item.type === 'update' ? 'info' : item.type === 'warning' ? 'error' : 'success'}>{item.type}</Badge>
              </View>
              <Text style={[styles.itemContent, { color: colors.textSecondary }]} numberOfLines={2}>{item.content}</Text>
              <Text style={[styles.itemDate, { color: colors.textMuted }]}>{formatDate(item.startDate)} - {formatDate(item.endDate)}</Text>
            </Card>
          )} />
        )}
      </View>

      <TouchableOpacity onPress={() => setShowModal(true)} style={[styles.fab, { backgroundColor: colors.accent || '#5B4BDB' }]}>
        <Ionicons name="add" size={28} color="#FFF" />
      </TouchableOpacity>

      <Modal visible={showModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.white }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Add Content</Text>
              <TouchableOpacity onPress={() => setShowModal(false)}><Ionicons name="close" size={22} color={colors.textSecondary} /></TouchableOpacity>
            </View>
            <Text style={[styles.label, { color: colors.textSecondary }]}>Title *</Text>
            <TextInput style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]} value={form.title} onChangeText={v => setForm(f => ({ ...f, title: v }))} placeholder="Page title" placeholderTextColor={colors.textMuted} />
            <Text style={[styles.label, { color: colors.textSecondary }]}>Type</Text>
            <View style={styles.typeRow}>
              {['faq', 'announcement', 'help', 'terms'].map(t => (
                <TouchableOpacity key={t} onPress={() => setForm(f => ({ ...f, type: t }))} style={[styles.typeBtn, { backgroundColor: form.type === t ? colors.primary : colors.surface, borderColor: form.type === t ? colors.primary : colors.border }]}>
                  <Text style={{ color: form.type === t ? '#FFF' : colors.textSecondary, fontSize: 12, fontWeight: '500', textTransform: 'capitalize' }}>{t}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text style={[styles.label, { color: colors.textSecondary }]}>Content *</Text>
            <TextInput style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text, height: 100, textAlignVertical: 'top' }]} value={form.content} onChangeText={v => setForm(f => ({ ...f, content: v }))} placeholder="Page content..." placeholderTextColor={colors.textMuted} multiline />
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
  tabs: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  tab: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 8 },
  tabText: { fontSize: 13, fontWeight: '500' },
  itemHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  itemTitle: { fontSize: 14, fontWeight: '600', flex: 1 },
  itemSlug: { fontSize: 12, marginTop: 4 },
  itemDate: { fontSize: 12, marginTop: 4 },
  itemContent: { fontSize: 13, marginTop: 6 },
  faqQuestion: { fontSize: 14, fontWeight: '600' },
  faqAnswer: { fontSize: 13, marginTop: 4, marginBottom: 8 },
  fab: { position: 'absolute', bottom: 24, right: 20, width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.3, shadowRadius: 6, elevation: 6 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, maxHeight: '80%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  modalTitle: { fontSize: 18, fontWeight: '600' },
  label: { fontSize: 13, fontWeight: '500', marginBottom: 6, marginLeft: 2 },
  input: { borderWidth: 1, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12, fontSize: 15, marginBottom: 12 },
  typeRow: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  typeBtn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, borderWidth: 1 },
  modalActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 10, marginTop: 8 },
  cancelBtn: { paddingVertical: 10, paddingHorizontal: 14 },
  saveBtn: { paddingVertical: 10, paddingHorizontal: 20, borderRadius: 8 },
  saveBtnText: { color: '#FFF', fontSize: 14, fontWeight: '600' },
});
