import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import { useCredentials } from '../../hooks/useMockData';
import Card from '../../components/ui/Card';
import StatusBadge from '../../components/ui/StatusBadge';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { formatDate } from '../../../shared/utils/formatters';

export default function VerificationScreen() {
  const { colors } = useTheme();
  const credentials = useCredentials();
  const [activeTab, setActiveTab] = useState('pending');

  const tabs = [
    { id: 'pending', label: 'Pending' },
    { id: 'approved', label: 'Approved' },
    { id: 'rejected', label: 'Rejected' },
    { id: 'needs_update', label: 'Needs Update' },
  ];

  const filtered = credentials.filter(c => c.status === activeTab);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.text }]}>Member Verification</Text>

        <FlatList
          horizontal
          data={tabs}
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
          style={styles.tabs}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => setActiveTab(item.id)}
              style={[
                styles.tab,
                {
                  backgroundColor: activeTab === item.id ? colors.primary : colors.surface,
                },
              ]}
            >
              <Text style={[
                styles.tabText,
                { color: activeTab === item.id ? colors.white : colors.textSecondary },
              ]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          )}
        />

        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Card style={{ marginBottom: 8 }}>
              <View style={styles.header}>
                <View style={styles.headerLeft}>
                  <Text style={[styles.name, { color: colors.text }]}>{item.memberName}</Text>
                  <Badge variant="neutral">{item.type}</Badge>
                </View>
                <StatusBadge status={item.status} />
              </View>
              <Text style={[styles.credTitle, { color: colors.textSecondary }]}>{item.title}</Text>
              <Text style={[styles.credDesc, { color: colors.textMuted }]}>{item.description}</Text>
              <Text style={[styles.date, { color: colors.textMuted }]}>
                Submitted: {formatDate(item.submittedDate)}
              </Text>
              {item.reviewerNotes && (
                <Text style={[styles.note, { color: colors.warning }]}>
                  Note: {item.reviewerNotes}
                </Text>
              )}
              {item.status === 'pending' && (
                <View style={styles.actions}>
                  <Button title="Verify" variant="success" size="sm" onPress={() => {}} />
                  <Button title="Reject" variant="danger" size="sm" onPress={() => {}} />
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
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 12 },
  tabs: { marginBottom: 12 },
  tab: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 8,
  },
  tabText: { fontSize: 13, fontWeight: '500' },
  list: { paddingBottom: 20 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1 },
  name: { fontSize: 15, fontWeight: '600' },
  credTitle: { fontSize: 14, marginTop: 6 },
  credDesc: { fontSize: 13, marginTop: 2 },
  date: { fontSize: 12, marginTop: 6 },
  note: { fontSize: 12, marginTop: 4, fontStyle: 'italic' },
  actions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 10,
  },
});
