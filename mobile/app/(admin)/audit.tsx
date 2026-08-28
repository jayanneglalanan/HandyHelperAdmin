import React, { useState } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import { useAuditLogs } from '../../hooks/useMockData';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import { formatDateTime } from '../../../shared/utils/formatters';

export default function AuditScreen() {
  const { colors } = useTheme();
  const logs = useAuditLogs();
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);

  const actionTypes = ['all', ...new Set(logs.map(l => l.action))];

  const typeOptions = actionTypes.map(t => ({ id: t, label: t === 'all' ? 'All Actions' : t }));

  const filtered = logs.filter(log => {
    const matchesSearch = log.userName.toLowerCase().includes(search.toLowerCase()) || log.targetName.toLowerCase().includes(search.toLowerCase()) || log.details.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === 'all' || log.action === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>Audit Logs</Text>
          <View style={[styles.countBadge, { backgroundColor: colors.surface }]}>
            <Text style={[styles.countText, { color: colors.textSecondary }]}>{filtered.length} entries</Text>
          </View>
        </View>

        <View style={styles.searchRow}>
          <View style={[styles.searchWrapper, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Ionicons name="search" size={16} color={colors.textMuted} style={styles.searchIcon} />
            <TextInput
              style={[styles.searchInput, { color: colors.text }]}
              placeholder="Search logs..."
              placeholderTextColor={colors.textMuted}
              value={search}
              onChangeText={setSearch}
            />
          </View>
          <TouchableOpacity onPress={() => setShowTypeDropdown(true)} style={[styles.dropdown, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.dropdownText, { color: colors.textSecondary }]} numberOfLines={1}>
              {typeOptions.find(t => t.id === typeFilter)?.label}
            </Text>
            <Ionicons name="chevron-down" size={14} color={colors.textMuted} />
          </TouchableOpacity>
        </View>

        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Card style={{ marginBottom: 8 }}>
              <View style={styles.logHeader}>
                <Badge>{item.action}</Badge>
                <Text style={[styles.logTime, { color: colors.textMuted }]}>{formatDateTime(item.timestamp)}</Text>
              </View>
              <Text style={[styles.logTarget, { color: colors.text }]}>{item.targetName}</Text>
              <Text style={[styles.logDetails, { color: colors.textSecondary }]}>{item.details}</Text>
              <Text style={[styles.logUser, { color: colors.textMuted }]}>By {item.userName} · {item.ipAddress}</Text>
            </Card>
          )}
          contentContainerStyle={styles.list}
        />
      </View>

      <Modal visible={showTypeDropdown} transparent animationType="fade">
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setShowTypeDropdown(false)}>
          <View style={[styles.dropdownModal, { backgroundColor: colors.white, borderColor: colors.border }]}>
            {typeOptions.map((t) => (
              <TouchableOpacity key={t.id} onPress={() => { setTypeFilter(t.id); setShowTypeDropdown(false); }} style={[styles.dropdownOption, { borderBottomColor: colors.border }]}>
                <Text style={[styles.dropdownOptionText, { color: typeFilter === t.id ? colors.primary : colors.text }]}>{t.label}</Text>
                {typeFilter === t.id && <Ionicons name="checkmark" size={18} color={colors.primary} />}
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
  searchRow: { flexDirection: 'column', gap: 8, marginBottom: 12 },
  searchWrapper: { flex: 1, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: 10, paddingHorizontal: 10 },
  searchIcon: { marginRight: 6 },
  searchInput: { flex: 1, paddingVertical: 10, fontSize: 14 },
  dropdown: { flexDirection: 'row', alignItems: 'center', gap: 4, borderWidth: 1, borderRadius: 10, paddingHorizontal: 12, minWidth: 120 },
  dropdownText: { fontSize: 13, fontWeight: '500' },
  list: { paddingBottom: 20 },
  logHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  logTime: { fontSize: 12 },
  logTarget: { fontSize: 14, fontWeight: '600', marginTop: 6 },
  logDetails: { fontSize: 13, marginTop: 2 },
  logUser: { fontSize: 12, marginTop: 4 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center' },
  dropdownModal: { width: 220, borderRadius: 12, borderWidth: 1, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.15, shadowRadius: 8, elevation: 4 },
  dropdownOption: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1 },
  dropdownOptionText: { fontSize: 14, fontWeight: '500' },
});
