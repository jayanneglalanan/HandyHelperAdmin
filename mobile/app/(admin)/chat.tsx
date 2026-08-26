import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import { useConversations } from '../../hooks/useMockData';
import Card from '../../components/ui/Card';
import StatusBadge from '../../components/ui/StatusBadge';
import { formatDate } from '../../../shared/utils/formatters';

export default function ChatScreen() {
  const { colors } = useTheme();
  const conversations = useConversations();
  const [activeTab, setActiveTab] = useState('all');

  const tabs = ['all', 'normal', 'flagged', 'reported'];

  const filtered = conversations.filter(c =>
    activeTab === 'all' || c.status === activeTab
  );

  const flaggedCount = conversations.filter(c => c.status === 'flagged' || c.status === 'reported').length;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.text }]}>Chat Monitoring</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          {flaggedCount} conversations need attention
        </Text>

        <View style={styles.tabs}>
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab}
              onPress={() => setActiveTab(tab)}
              style={[
                styles.tab,
                { backgroundColor: activeTab === tab ? colors.primary : colors.surface },
              ]}
            >
              <Text style={[
                styles.tabText,
                { color: activeTab === tab ? colors.white : colors.textSecondary },
              ]}>
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Card style={{ marginBottom: 8 }}>
              <View style={styles.convHeader}>
                <Text style={[styles.convNames, { color: colors.text }]} numberOfLines={1}>
                  {item.participant1Name} ↔ {item.participant2Name}
                </Text>
                <StatusBadge status={item.status} />
              </View>
              <Text style={[styles.convJob, { color: colors.textSecondary }]}>
                Job: {item.jobTitle}
              </Text>
              <Text style={[styles.convMessage, { color: colors.textMuted }]} numberOfLines={2}>
                "{item.lastMessage}"
              </Text>
              <View style={styles.convFooter}>
                <Text style={[styles.convMeta, { color: colors.textMuted }]}>
                  {item.messageCount} messages · {formatDate(item.lastMessageDate)}
                </Text>
              </View>
              {item.flaggedReason && (
                <Text style={[styles.convFlag, { color: colors.warning }]}>
                  ⚠ {item.flaggedReason}
                </Text>
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
  title: { fontSize: 24, fontWeight: 'bold' },
  subtitle: { fontSize: 14, marginBottom: 12 },
  tabs: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  tab: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 8 },
  tabText: { fontSize: 13, fontWeight: '500' },
  list: { paddingBottom: 20 },
  convHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  convNames: { fontSize: 14, fontWeight: '600', flex: 1 },
  convJob: { fontSize: 12, marginTop: 4 },
  convMessage: { fontSize: 13, fontStyle: 'italic', marginTop: 6 },
  convFooter: { marginTop: 6 },
  convMeta: { fontSize: 11 },
  convFlag: { fontSize: 12, marginTop: 6 },
});
