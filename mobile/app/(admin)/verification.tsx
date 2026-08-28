import React, { useState } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import { useCredentials } from '../../hooks/useMockData';
import Card from '../../components/ui/Card';
import StatusBadge from '../../components/ui/StatusBadge';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { formatDate } from '../../../shared/utils/formatters';

const tabList = [
  { id: 'pending', label: 'Pending' },
  { id: 'approved', label: 'Approved' },
  { id: 'rejected', label: 'Rejected' },
  { id: 'needs_update', label: 'Update' },
];

export default function VerificationScreen() {
  const { colors } = useTheme();
  const credentials = useCredentials();
  const [activeTab, setActiveTab] = useState('pending');
  const [search, setSearch] = useState('');
  const [credStatuses, setCredStatuses] = useState<Record<string, string>>({});

  const getStatus = (cred: any) => credStatuses[cred.id] || cred.status;

  const handleVerify = (credId: string, name: string) => {
    setCredStatuses(prev => ({ ...prev, [credId]: 'approved' }));
    Alert.alert('Approved', `${name}'s credential has been approved`);
  };

  const handleReject = (credId: string, name: string) => {
    setCredStatuses(prev => ({ ...prev, [credId]: 'rejected' }));
    Alert.alert('Rejected', `${name}'s credential has been rejected`);
  };

  const tabCounts = {
    pending: credentials.filter(c => getStatus(c) === 'pending').length,
    approved: credentials.filter(c => getStatus(c) === 'approved').length,
    rejected: credentials.filter(c => getStatus(c) === 'rejected').length,
    needs_update: credentials.filter(c => getStatus(c) === 'needs_update').length,
  };

  const filtered = credentials.filter(c => {
    const matchesTab = getStatus(c) === activeTab;
    const matchesSearch = c.memberName.toLowerCase().includes(search.toLowerCase()) || c.title.toLowerCase().includes(search.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>Verification</Text>
          <View style={[styles.countBadge, { backgroundColor: colors.surface }]}>
            <Text style={[styles.countText, { color: colors.textSecondary }]}>{filtered.length} pending</Text>
          </View>
        </View>

        <View style={[styles.searchWrapper, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Ionicons name="search" size={16} color={colors.textMuted} style={styles.searchIcon} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Search credentials..."
            placeholderTextColor={colors.textMuted}
            value={search}
            onChangeText={setSearch}
          />
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
              <View style={styles.cardHeader}>
                <View style={styles.headerLeft}>
                  <Text style={[styles.name, { color: colors.text }]}>{item.memberName}</Text>
                  <Badge variant="neutral">{item.type}</Badge>
                </View>
                <StatusBadge status={getStatus(item)} />
              </View>
              <Text style={[styles.credTitle, { color: colors.textSecondary }]}>{item.title}</Text>
              <Text style={[styles.credDesc, { color: colors.textMuted }]}>{item.description}</Text>
              <Text style={[styles.date, { color: colors.textMuted }]}>Submitted: {formatDate(item.submittedDate)}</Text>
              {item.reviewerNotes && <Text style={[styles.note, { color: colors.warning }]}>Note: {item.reviewerNotes}</Text>}
              {getStatus(item) === 'pending' && (
                <View style={styles.actions}>
                  <Button title="Verify" variant="success" size="sm" onPress={() => handleVerify(item.id, item.memberName)} />
                  <Button title="Reject" variant="danger" size="sm" onPress={() => handleReject(item.id, item.memberName)} />
                </View>
              )}
            </Card>
          )}
          contentContainerStyle={styles.list}
        />
      </View>
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
  searchWrapper: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: 10, paddingHorizontal: 10, marginBottom: 12 },
  searchIcon: { marginRight: 6 },
  searchInput: { flex: 1, paddingVertical: 10, fontSize: 14 },
  tabs: { marginBottom: 12 },
  tab: { alignItems: 'center', paddingHorizontal: 12, paddingVertical: 8, marginRight: 8, position: 'relative' },
  tabText: { fontSize: 13, fontWeight: '600' },
  tabUnderline: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 2 },
  tabBadge: { marginTop: 4, paddingHorizontal: 6, paddingVertical: 1, borderRadius: 8 },
  tabBadgeText: { fontSize: 10, fontWeight: '600' },
  list: { paddingBottom: 20 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1 },
  name: { fontSize: 15, fontWeight: '600' },
  credTitle: { fontSize: 14, marginTop: 6 },
  credDesc: { fontSize: 13, marginTop: 2 },
  date: { fontSize: 12, marginTop: 6 },
  note: { fontSize: 12, marginTop: 4, fontStyle: 'italic' },
  actions: { flexDirection: 'row', gap: 8, marginTop: 10 },
});
