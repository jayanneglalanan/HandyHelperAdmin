import React, { useState } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import { useJobs } from '../../hooks/useMockData';
import Card from '../../components/ui/Card';
import StatusBadge from '../../components/ui/StatusBadge';
import Badge from '../../components/ui/Badge';
import { formatDate, formatCurrency } from '../../../../shared/utils/formatters';

const tabList = [
  { id: 'all', label: 'All' },
  { id: 'pending', label: 'Pending' },
  { id: 'open', label: 'Open' },
  { id: 'in_progress', label: 'Active' },
  { id: 'completed', label: 'Done' },
  { id: 'cancelled', label: 'Cancelled' },
];

export default function JobsScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const jobs = useJobs();
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  const tabCounts = {
    all: jobs.length,
    pending: jobs.filter(j => j.status === 'pending').length,
    open: jobs.filter(j => j.status === 'open').length,
    in_progress: jobs.filter(j => j.status === 'in_progress').length,
    completed: jobs.filter(j => j.status === 'completed').length,
    cancelled: jobs.filter(j => j.status === 'cancelled').length,
  };

  const filtered = jobs.filter(job => {
    const matchesTab = activeTab === 'all' || job.status === activeTab;
    const matchesSearch = job.title.toLowerCase().includes(search.toLowerCase()) ||
      job.clientName.toLowerCase().includes(search.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>Jobs</Text>
          <View style={[styles.countBadge, { backgroundColor: colors.surface }]}>
            <Text style={[styles.countText, { color: colors.textSecondary }]}>{filtered.length} jobs</Text>
          </View>
        </View>

        <View style={[styles.searchWrapper, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Ionicons name="search" size={16} color={colors.textMuted} style={styles.searchIcon} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Search jobs..."
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
            <TouchableOpacity onPress={() => router.push(`/(admin)/jobs/${item.id}`)}>
              <Card style={{ marginBottom: 8 }}>
                <View style={styles.jobHeader}>
                  <Text style={[styles.jobTitle, { color: colors.text }]}>{item.title}</Text>
                  {item.urgent && <Badge variant="error">Urgent</Badge>}
                </View>
                <Text style={[styles.jobClient, { color: colors.textSecondary }]}>{item.clientName} · {item.category}</Text>
                <View style={styles.jobFooter}>
                  <Text style={[styles.jobBudget, { color: colors.text }]}>{formatCurrency(item.budget)}</Text>
                  <StatusBadge status={item.status} />
                </View>
              </Card>
            </TouchableOpacity>
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
  jobHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  jobTitle: { fontSize: 15, fontWeight: '600', flex: 1 },
  jobClient: { fontSize: 13, marginTop: 4 },
  jobFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 },
  jobBudget: { fontSize: 15, fontWeight: '700' },
});
