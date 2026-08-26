import React, { useState } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTheme } from '../../hooks/useTheme';
import { useJobs } from '../../hooks/useMockData';
import Card from '../../components/ui/Card';
import StatusBadge from '../../components/ui/StatusBadge';
import Badge from '../../components/ui/Badge';
import { formatDate, formatCurrency } from '../../../../shared/utils/formatters';

export default function JobsScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const jobs = useJobs();
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  const tabs = ['all', 'pending', 'open', 'in_progress', 'completed', 'cancelled'];

  const filtered = jobs.filter(job => {
    const matchesTab = activeTab === 'all' || job.status === activeTab;
    const matchesSearch = job.title.toLowerCase().includes(search.toLowerCase()) ||
      job.clientName.toLowerCase().includes(search.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.text }]}>Jobs</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{filtered.length} jobs</Text>

        <TextInput
          style={[styles.search, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]}
          placeholder="Search jobs..."
          placeholderTextColor={colors.textMuted}
          value={search}
          onChangeText={setSearch}
        />

        <FlatList
          horizontal
          data={tabs}
          keyExtractor={(item) => item}
          showsHorizontalScrollIndicator={false}
          style={styles.tabs}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => setActiveTab(item)}
              style={[
                styles.tab,
                {
                  backgroundColor: activeTab === item ? colors.primary : colors.surface,
                },
              ]}
            >
              <Text style={[
                styles.tabText,
                { color: activeTab === item ? colors.white : colors.textSecondary },
              ]}>
                {item === 'all' ? 'All' : item.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </Text>
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
                <Text style={[styles.jobClient, { color: colors.textSecondary }]}>
                  {item.clientName} · {item.category}
                </Text>
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
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 12,
  },
  search: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    marginBottom: 12,
  },
  tabs: {
    marginBottom: 12,
  },
  tab: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 8,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '500',
  },
  list: {
    paddingBottom: 20,
  },
  jobHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  jobTitle: {
    fontSize: 15,
    fontWeight: '600',
    flex: 1,
  },
  jobClient: {
    fontSize: 13,
    marginTop: 4,
  },
  jobFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  jobBudget: {
    fontSize: 15,
    fontWeight: '700',
  },
});
