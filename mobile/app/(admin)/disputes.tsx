import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../hooks/useTheme';
import { useDisputes } from '../../hooks/useMockData';
import Card from '../../components/ui/Card';
import StatusBadge from '../../components/ui/StatusBadge';
import { formatDate } from '../../../shared/utils/formatters';

export default function DisputesScreen() {
  const { colors } = useTheme();
  const disputes = useDisputes();
  const [filter, setFilter] = useState('all');

  const filtered = disputes.filter(d => filter === 'all' || d.status === filter);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.text }]}>Disputes</Text>

        <View style={styles.filters}>
          {['all', 'pending', 'investigating', 'resolved'].map((f) => (
            <TouchableOpacity
              key={f}
              onPress={() => setFilter(f)}
              style={[styles.filter, { backgroundColor: filter === f ? colors.primary : colors.surface }]}
            >
              <Text style={[styles.filterText, { color: filter === f ? colors.white : colors.textSecondary }]}>
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Card style={{ marginBottom: 8 }}>
              <View style={styles.header}>
                <Text style={[styles.reason, { color: colors.text }]}>{item.reason}</Text>
                <StatusBadge status={item.status} />
              </View>
              <Text style={[styles.parties, { color: colors.textSecondary }]}>
                {item.clientName} vs {item.memberName}
              </Text>
              <Text style={[styles.job, { color: colors.textMuted }]}>Job: {item.jobTitle}</Text>
              <Text style={[styles.desc, { color: colors.textSecondary }]} numberOfLines={2}>
                {item.description}
              </Text>
              <Text style={[styles.date, { color: colors.textMuted }]}>{formatDate(item.filedDate)}</Text>
              {item.resolution && (
                <Text style={[styles.resolution, { color: colors.success }]}>✓ {item.resolution}</Text>
              )}
            </Card>
          )}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 12 },
  filters: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  filter: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  filterText: { fontSize: 13, fontWeight: '500' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  reason: { fontSize: 14, fontWeight: '600', flex: 1 },
  parties: { fontSize: 13, marginTop: 4 },
  job: { fontSize: 12, marginTop: 2 },
  desc: { fontSize: 13, marginTop: 6 },
  date: { fontSize: 11, marginTop: 4 },
  resolution: { fontSize: 12, marginTop: 6 },
});
