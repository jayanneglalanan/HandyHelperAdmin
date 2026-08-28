import React, { useState } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import { useDisputes } from '../../hooks/useMockData';
import Card from '../../components/ui/Card';
import StatusBadge from '../../components/ui/StatusBadge';
import { formatDate } from '../../../shared/utils/formatters';

const tabList = [
  { id: 'pending', label: 'Pending' },
  { id: 'investigating', label: 'In Review' },
  { id: 'resolved', label: 'Resolved' },
];

export default function DisputesScreen() {
  const { colors } = useTheme();
  const disputes = useDisputes();
  const [filter, setFilter] = useState('pending');
  const [search, setSearch] = useState('');

  const tabCounts = {
    pending: disputes.filter(d => d.status === 'pending').length,
    investigating: disputes.filter(d => d.status === 'investigating').length,
    resolved: disputes.filter(d => d.status === 'resolved').length,
  };

  const filtered = disputes.filter(d => {
    const matchesTab = d.status === filter;
    const matchesSearch = d.reason.toLowerCase().includes(search.toLowerCase()) || d.clientName.toLowerCase().includes(search.toLowerCase()) || d.memberName.toLowerCase().includes(search.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>Disputes</Text>
          <View style={[styles.countBadge, { backgroundColor: colors.surface }]}>
            <Text style={[styles.countText, { color: colors.textSecondary }]}>{filtered.length} total</Text>
          </View>
        </View>

        <View style={[styles.searchWrapper, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Ionicons name="search" size={16} color={colors.textMuted} style={styles.searchIcon} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Search disputes..."
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
            <TouchableOpacity onPress={() => setFilter(item.id)} style={styles.tab}>
              <Text style={[styles.tabText, { color: filter === item.id ? colors.primary : colors.textSecondary }]}>{item.label}</Text>
              {filter === item.id && <View style={[styles.tabUnderline, { backgroundColor: colors.primary }]} />}
              <View style={[styles.tabBadge, { backgroundColor: filter === item.id ? colors.primary : colors.surface }]}>
                <Text style={[styles.tabBadgeText, { color: filter === item.id ? '#FFF' : colors.textSecondary }]}>{tabCounts[item.id as keyof typeof tabCounts]}</Text>
              </View>
            </TouchableOpacity>
          )}
        />

        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => Alert.alert('Dispute Details', `${item.reason}\n\n${item.clientName} vs ${item.memberName}\n\n${item.description}`)} activeOpacity={0.7}>
            <Card style={{ marginBottom: 8 }}>
              <View style={styles.cardHeader}>
                <Text style={[styles.reason, { color: colors.text }]}>{item.reason}</Text>
                <StatusBadge status={item.status} />
              </View>
              <Text style={[styles.parties, { color: colors.textSecondary }]}>{item.clientName} vs {item.memberName}</Text>
              <Text style={[styles.job, { color: colors.textMuted }]}>Job: {item.jobTitle}</Text>
              <Text style={[styles.desc, { color: colors.textSecondary }]} numberOfLines={2}>{item.description}</Text>
              <Text style={[styles.date, { color: colors.textMuted }]}>{formatDate(item.filedDate)}</Text>
              {item.resolution && <Text style={[styles.resolution, { color: colors.success }]}>✓ {item.resolution}</Text>}
              {item.status === 'pending' && (
                <TouchableOpacity onPress={() => Alert.alert('Review', `Reviewing dispute: ${item.reason}`)} style={{ marginTop: 8, paddingVertical: 6, paddingHorizontal: 12, backgroundColor: colors.primary, borderRadius: 6, alignSelf: 'flex-start' }}>
                  <Text style={{ color: '#FFF', fontSize: 12, fontWeight: '600' }}>Review</Text>
                </TouchableOpacity>
              )}
              {item.status === 'investigating' && (
                <TouchableOpacity onPress={() => Alert.alert('Resolved', `Dispute resolved: ${item.reason}`)} style={{ marginTop: 8, paddingVertical: 6, paddingHorizontal: 12, backgroundColor: colors.success || '#059669', borderRadius: 6, alignSelf: 'flex-start' }}>
                  <Text style={{ color: '#FFF', fontSize: 12, fontWeight: '600' }}>Resolve</Text>
                </TouchableOpacity>
              )}
            </Card>
            </TouchableOpacity>
          )}
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
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  reason: { fontSize: 14, fontWeight: '600', flex: 1 },
  parties: { fontSize: 13, marginTop: 4 },
  job: { fontSize: 12, marginTop: 2 },
  desc: { fontSize: 13, marginTop: 6 },
  date: { fontSize: 12, marginTop: 4 },
  resolution: { fontSize: 12, marginTop: 6 },
});
