import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import { useNotifications } from '../../hooks/useMockData';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import { timeAgo } from '../../../shared/utils/formatters';

const typeIcons: Record<string, string> = {
  registration: '👤',
  credential: '📄',
  job: '💼',
  report: '⚠️',
  dispute: '⚖️',
  subscription: '💳',
  system: '🔧',
};

export default function NotificationsScreen() {
  const { colors } = useTheme();
  const notifications = useNotifications();
  const [filter, setFilter] = useState('all');

  const unreadCount = notifications.filter(n => !n.read).length;

  const filtered = notifications.filter(n => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !n.read;
    return n.type === filter;
  });

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>Notifications</Text>
          <Badge variant="info">{unreadCount} unread</Badge>
        </View>

        <View style={styles.filters}>
          {['all', 'unread', 'job', 'report', 'system'].map((f) => (
            <TouchableOpacity
              key={f}
              onPress={() => setFilter(f)}
              style={[
                styles.filter,
                {
                  backgroundColor: filter === f ? colors.primary : colors.surface,
                },
              ]}
            >
              <Text style={[
                styles.filterText,
                { color: filter === f ? colors.white : colors.textSecondary },
              ]}>
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
              <View style={styles.notifRow}>
                <Text style={styles.notifIcon}>{typeIcons[item.type]}</Text>
                <View style={styles.notifInfo}>
                  <View style={styles.notifHeader}>
                    <Text style={[styles.notifTitle, { color: colors.text }]} numberOfLines={1}>
                      {item.title}
                    </Text>
                    {!item.read && <View style={styles.unreadDot} />}
                  </View>
                  <Text style={[styles.notifMessage, { color: colors.textSecondary }]} numberOfLines={2}>
                    {item.message}
                  </Text>
                  <Text style={[styles.notifTime, { color: colors.textMuted }]}>{timeAgo(item.date)}</Text>
                </View>
              </View>
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
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  title: { fontSize: 24, fontWeight: 'bold' },
  filters: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  filter: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  filterText: { fontSize: 13, fontWeight: '500' },
  list: { paddingBottom: 20 },
  notifRow: { flexDirection: 'row', gap: 12 },
  notifIcon: { fontSize: 20 },
  notifInfo: { flex: 1 },
  notifHeader: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  notifTitle: { fontSize: 14, fontWeight: '600', flex: 1 },
  unreadDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#2563EB' },
  notifMessage: { fontSize: 13, marginTop: 2 },
  notifTime: { fontSize: 12, marginTop: 4 },
});
