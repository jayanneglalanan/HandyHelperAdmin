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

const tabList = [
  { id: 'all', label: 'All' },
  { id: 'unread', label: 'Unread' },
];

export default function NotificationsScreen() {
  const { colors } = useTheme();
  const notifications = useNotifications();
  const [filter, setFilter] = useState('all');
  const [readIds, setReadIds] = useState<Set<string>>(new Set());

  const isRead = (n: any) => n.read || readIds.has(n.id);
  const unreadCount = notifications.filter(n => !isRead(n)).length;

  const tabCounts = {
    all: notifications.length,
    unread: unreadCount,
  };

  const filtered = notifications.filter(n => {
    if (filter === 'unread') return !isRead(n);
    return true;
  });

  const handleMarkAllRead = () => {
    setReadIds(new Set(notifications.map(n => n.id)));
  };

  const handleMarkRead = (id: string) => {
    setReadIds(prev => new Set([...prev, id]));
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>Notifications</Text>
          <TouchableOpacity onPress={handleMarkAllRead} style={[styles.markAllBtn, { borderColor: colors.border }]}>
            <Ionicons name="checkmark-done" size={14} color={colors.primary} />
            <Text style={[styles.markAllText, { color: colors.primary }]}>Mark All Read</Text>
          </TouchableOpacity>
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
            <TouchableOpacity onPress={() => handleMarkRead(item.id)} activeOpacity={0.7}>
            <Card style={{ marginBottom: 8 }}>
              <View style={styles.notifRow}>
                <Text style={styles.notifIcon}>{typeIcons[item.type]}</Text>
                <View style={styles.notifInfo}>
                  <View style={styles.notifHeader}>
                    <Text style={[styles.notifTitle, { color: colors.text }]} numberOfLines={1}>{item.title}</Text>
                    {!isRead(item) && <View style={styles.unreadDot} />}
                  </View>
                  <Text style={[styles.notifMessage, { color: colors.textSecondary }]} numberOfLines={2}>{item.message}</Text>
                  <Text style={[styles.notifTime, { color: colors.textMuted }]}>{timeAgo(item.date)}</Text>
                </View>
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
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  title: { fontSize: 24, fontWeight: 'bold' },
  markAllBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, borderWidth: 1, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 6 },
  markAllText: { fontSize: 12, fontWeight: '600' },
  tabs: { marginBottom: 12 },
  tab: { alignItems: 'center', paddingHorizontal: 12, paddingVertical: 8, marginRight: 8, position: 'relative' },
  tabText: { fontSize: 13, fontWeight: '600' },
  tabUnderline: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 2 },
  tabBadge: { marginTop: 4, paddingHorizontal: 6, paddingVertical: 1, borderRadius: 8 },
  tabBadgeText: { fontSize: 10, fontWeight: '600' },
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
