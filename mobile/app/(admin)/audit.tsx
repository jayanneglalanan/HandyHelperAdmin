import React, { useState } from 'react';
import { View, Text, FlatList, TextInput, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import { useAuditLogs } from '../../hooks/useMockData';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import { formatDateTime } from '../../../shared/utils/formatters';

const actionColors: Record<string, string> = {
  create: '#059669',
  update: '#2563EB',
  delete: '#DC2626',
  login: '#6B7280',
  logout: '#6B7280',
  verify: '#059669',
  suspend: '#DC2626',
  activate: '#059669',
  approve: '#059669',
  reject: '#DC2626',
  flag: '#D97706',
  resolve: '#059669',
};

export default function AuditScreen() {
  const { colors } = useTheme();
  const logs = useAuditLogs();
  const [search, setSearch] = useState('');

  const filtered = logs.filter(log =>
    log.userName.toLowerCase().includes(search.toLowerCase()) ||
    log.targetName.toLowerCase().includes(search.toLowerCase()) ||
    log.details.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.text }]}>Audit Logs</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{logs.length} actions</Text>

        <TextInput
          style={[styles.search, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]}
          placeholder="Search logs..."
          placeholderTextColor={colors.textMuted}
          value={search}
          onChangeText={setSearch}
        />

        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Card style={{ marginBottom: 8 }}>
              <View style={styles.logHeader}>
                <Badge>{item.action}</Badge>
                <Text style={[styles.logTime, { color: colors.textMuted }]}>
                  {formatDateTime(item.timestamp)}
                </Text>
              </View>
              <Text style={[styles.logTarget, { color: colors.text }]}>{item.targetName}</Text>
              <Text style={[styles.logDetails, { color: colors.textSecondary }]}>{item.details}</Text>
              <Text style={[styles.logUser, { color: colors.textMuted }]}>
                By {item.userName} · {item.ipAddress}
              </Text>
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
  title: { fontSize: 24, fontWeight: 'bold' },
  subtitle: { fontSize: 14, marginBottom: 12 },
  search: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    marginBottom: 12,
  },
  list: { paddingBottom: 20 },
  logHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  logTime: { fontSize: 11 },
  logTarget: { fontSize: 14, fontWeight: '600', marginTop: 6 },
  logDetails: { fontSize: 13, marginTop: 2 },
  logUser: { fontSize: 11, marginTop: 4 },
});
