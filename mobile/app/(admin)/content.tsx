import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import { useContent, useFaqs, useAnnouncements } from '../../hooks/useMockData';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import { formatDate } from '../../../shared/utils/formatters';

export default function ContentScreen() {
  const { colors } = useTheme();
  const pages = useContent();
  const faqs = useFaqs();
  const announcements = useAnnouncements();
  const [activeTab, setActiveTab] = useState('pages');

  const tabs = [
    { id: 'pages', label: 'Pages' },
    { id: 'faqs', label: 'FAQs' },
    { id: 'announcements', label: 'Announcements' },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.text }]}>Content</Text>

        <View style={styles.tabs}>
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab.id}
              onPress={() => setActiveTab(tab.id)}
              style={[
                styles.tab,
                { backgroundColor: activeTab === tab.id ? colors.primary : colors.surface },
              ]}
            >
              <Text style={[
                styles.tabText,
                { color: activeTab === tab.id ? colors.white : colors.textSecondary },
              ]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {activeTab === 'pages' && (
          <FlatList
            data={pages}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <Card style={{ marginBottom: 8 }}>
                <View style={styles.itemHeader}>
                  <Text style={[styles.itemTitle, { color: colors.text }]}>{item.title}</Text>
                  <Badge variant={item.status === 'published' ? 'success' : 'neutral'}>
                    {item.status}
                  </Badge>
                </View>
                <Text style={[styles.itemSlug, { color: colors.textMuted }]}>{item.slug}</Text>
                <Text style={[styles.itemDate, { color: colors.textMuted }]}>
                  Updated {formatDate(item.lastUpdated)}
                </Text>
              </Card>
            )}
          />
        )}

        {activeTab === 'faqs' && (
          <FlatList
            data={faqs}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <Card style={{ marginBottom: 8 }}>
                <Text style={[styles.faqQuestion, { color: colors.text }]}>{item.question}</Text>
                <Text style={[styles.faqAnswer, { color: colors.textSecondary }]} numberOfLines={2}>
                  {item.answer}
                </Text>
                <Badge>{item.category}</Badge>
              </Card>
            )}
          />
        )}

        {activeTab === 'announcements' && (
          <FlatList
            data={announcements}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <Card style={{ marginBottom: 8 }}>
                <View style={styles.itemHeader}>
                  <Text style={[styles.itemTitle, { color: colors.text }]}>{item.title}</Text>
                  <Badge variant={
                    item.type === 'maintenance' ? 'warning' :
                    item.type === 'update' ? 'info' :
                    item.type === 'warning' ? 'error' : 'success'
                  }>
                    {item.type}
                  </Badge>
                </View>
                <Text style={[styles.itemContent, { color: colors.textSecondary }]} numberOfLines={2}>
                  {item.content}
                </Text>
                <Text style={[styles.itemDate, { color: colors.textMuted }]}>
                  {formatDate(item.startDate)} - {formatDate(item.endDate)}
                </Text>
              </Card>
            )}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 12 },
  tabs: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  tab: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 8 },
  tabText: { fontSize: 13, fontWeight: '500' },
  itemHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  itemTitle: { fontSize: 14, fontWeight: '600', flex: 1 },
  itemSlug: { fontSize: 12, marginTop: 4 },
  itemDate: { fontSize: 12, marginTop: 4 },
  itemContent: { fontSize: 13, marginTop: 6 },
  faqQuestion: { fontSize: 14, fontWeight: '600' },
  faqAnswer: { fontSize: 13, marginTop: 4, marginBottom: 8 },
});
