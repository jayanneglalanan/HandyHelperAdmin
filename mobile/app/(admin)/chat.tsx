import React, { useState } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import { useConversations } from '../../hooks/useMockData';
import Card from '../../components/ui/Card';
import StatusBadge from '../../components/ui/StatusBadge';
import { formatDate } from '../../../shared/utils/formatters';

const tabList = [
  { id: 'all', label: 'All' },
  { id: 'normal', label: 'Normal' },
  { id: 'flagged', label: 'Flagged' },
  { id: 'reported', label: 'Reported' },
];

const flagOptions = [
  { id: 'all', label: 'All' },
  { id: 'flagged', label: 'Flagged' },
  { id: 'normal', label: 'Normal' },
];

export default function ChatScreen() {
  const { colors } = useTheme();
  const conversations = useConversations();
  const [activeTab, setActiveTab] = useState('all');
  const [search, setSearch] = useState('');
  const [flagFilter, setFlagFilter] = useState('all');
  const [showFlagDropdown, setShowFlagDropdown] = useState(false);

  const tabCounts = {
    all: conversations.length,
    normal: conversations.filter(c => c.status === 'normal').length,
    flagged: conversations.filter(c => c.status === 'flagged').length,
    reported: conversations.filter(c => c.status === 'reported').length,
  };

  const filtered = conversations.filter(c => {
    const matchesTab = activeTab === 'all' || c.status === activeTab;
    const matchesSearch = c.participant1Name.toLowerCase().includes(search.toLowerCase()) || c.participant2Name.toLowerCase().includes(search.toLowerCase());
    const matchesFlag = flagFilter === 'all' || c.status === flagFilter;
    return matchesTab && matchesSearch && matchesFlag;
  });

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>Chat Monitoring</Text>
          <View style={[styles.countBadge, { backgroundColor: colors.surface }]}>
            <Text style={[styles.countText, { color: colors.textSecondary }]}>{conversations.filter(c => c.status === 'flagged' || c.status === 'reported').length} flagged</Text>
          </View>
        </View>

        <View style={styles.searchRow}>
          <View style={[styles.searchWrapper, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Ionicons name="search" size={16} color={colors.textMuted} style={styles.searchIcon} />
            <TextInput
              style={[styles.searchInput, { color: colors.text }]}
              placeholder="Search conversations..."
              placeholderTextColor={colors.textMuted}
              value={search}
              onChangeText={setSearch}
            />
          </View>
          <TouchableOpacity onPress={() => setShowFlagDropdown(true)} style={[styles.dropdown, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.dropdownText, { color: colors.textSecondary }]} numberOfLines={1}>
              {flagOptions.find(f => f.id === flagFilter)?.label}
            </Text>
            <Ionicons name="chevron-down" size={14} color={colors.textMuted} />
          </TouchableOpacity>
        </View>

        <FlatList
          horizontal
          data={tabList}
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
          style={styles.tabs}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => setActiveTab(item.id)} style={styles.tab}>
              <Text style={[styles.tabText, { color: activeTab === item.id ? colors.primary : colors.textSecondary }]}>{item.label}</Text>
              {activeTab === item.id && <View style={[styles.tabUnderline, { backgroundColor: colors.primary }]} />}
              <View style={[styles.tabBadge, { backgroundColor: activeTab === item.id ? colors.primary : colors.surface }]}>
                <Text style={[styles.tabBadgeText, { color: activeTab === item.id ? '#FFF' : colors.textSecondary }]}>{tabCounts[item.id as keyof typeof tabCounts]}</Text>
              </View>
            </TouchableOpacity>
          )}
        />

        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Card style={{ marginBottom: 8 }}>
              <View style={styles.convHeader}>
                <Text style={[styles.convNames, { color: colors.text }]} numberOfLines={1}>{item.participant1Name} ↔ {item.participant2Name}</Text>
                <StatusBadge status={item.status} />
              </View>
              <Text style={[styles.convJob, { color: colors.textSecondary }]}>Job: {item.jobTitle}</Text>
              <Text style={[styles.convMessage, { color: colors.textMuted }]} numberOfLines={2}>"{item.lastMessage}"</Text>
              <View style={styles.convFooter}>
                <Text style={[styles.convMeta, { color: colors.textMuted }]}>{item.messageCount} messages · {formatDate(item.lastMessageDate)}</Text>
              </View>
              {item.flaggedReason && <Text style={[styles.convFlag, { color: colors.warning }]}>⚠ {item.flaggedReason}</Text>}
            </Card>
          )}
          contentContainerStyle={styles.list}
        />
      </View>

      <Modal visible={showFlagDropdown} transparent animationType="fade">
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setShowFlagDropdown(false)}>
          <View style={[styles.dropdownModal, { backgroundColor: colors.white, borderColor: colors.border }]}>
            {flagOptions.map((f) => (
              <TouchableOpacity key={f.id} onPress={() => { setFlagFilter(f.id); setShowFlagDropdown(false); }} style={[styles.dropdownOption, { borderBottomColor: colors.border }]}>
                <Text style={[styles.dropdownOptionText, { color: flagFilter === f.id ? colors.primary : colors.text }]}>{f.label}</Text>
                {flagFilter === f.id && <Ionicons name="checkmark" size={18} color={colors.primary} />}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, padding: 16 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  title: { fontSize: 24, fontWeight: 'bold' },
  countBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  countText: { fontSize: 12, fontWeight: '500' },
  searchRow: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  searchWrapper: { flex: 1, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: 10, paddingHorizontal: 10 },
  searchIcon: { marginRight: 6 },
  searchInput: { flex: 1, paddingVertical: 10, fontSize: 14 },
  dropdown: { flexDirection: 'row', alignItems: 'center', gap: 4, borderWidth: 1, borderRadius: 10, paddingHorizontal: 12, minWidth: 100 },
  dropdownText: { fontSize: 13, fontWeight: '500' },
  tabs: { marginBottom: 12 },
  tab: { alignItems: 'center', paddingHorizontal: 12, paddingVertical: 8, marginRight: 8, position: 'relative' },
  tabText: { fontSize: 13, fontWeight: '600' },
  tabUnderline: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 2 },
  tabBadge: { marginTop: 4, paddingHorizontal: 6, paddingVertical: 1, borderRadius: 8 },
  tabBadgeText: { fontSize: 10, fontWeight: '600' },
  list: { paddingBottom: 20 },
  convHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  convNames: { fontSize: 14, fontWeight: '600', flex: 1 },
  convJob: { fontSize: 12, marginTop: 4 },
  convMessage: { fontSize: 13, fontStyle: 'italic', marginTop: 6 },
  convFooter: { marginTop: 6 },
  convMeta: { fontSize: 12 },
  convFlag: { fontSize: 12, marginTop: 6 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center' },
  dropdownModal: { width: 200, borderRadius: 12, borderWidth: 1, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.15, shadowRadius: 8, elevation: 4 },
  dropdownOption: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1 },
  dropdownOptionText: { fontSize: 14, fontWeight: '500' },
});
