import React, { useState } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import { useReviews } from '../../hooks/useMockData';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import { formatDate } from '../../../shared/utils/formatters';

const tabList = [
  { id: 'all', label: 'All' },
  { id: 'visible', label: 'Visible' },
  { id: 'flagged', label: 'Flagged' },
  { id: 'hidden', label: 'Hidden' },
];

const ratings = [
  { id: 0, label: 'All Ratings' },
  { id: 5, label: '5 Stars' },
  { id: 4, label: '4 Stars' },
  { id: 3, label: '3 Stars' },
  { id: 2, label: '2 Stars' },
  { id: 1, label: '1 Star' },
];

export default function ReviewsScreen() {
  const { colors } = useTheme();
  const reviews = useReviews();
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [ratingFilter, setRatingFilter] = useState(0);
  const [showRatingDropdown, setShowRatingDropdown] = useState(false);

  const tabCounts = {
    all: reviews.length,
    visible: reviews.filter(r => r.status === 'visible').length,
    flagged: reviews.filter(r => r.status === 'flagged').length,
    hidden: reviews.filter(r => r.status === 'hidden').length,
  };

  const filtered = reviews.filter(r => {
    const matchesTab = filter === 'all' || r.status === filter;
    const matchesSearch = r.comment.toLowerCase().includes(search.toLowerCase()) || r.reviewerName.toLowerCase().includes(search.toLowerCase());
    const matchesRating = ratingFilter === 0 || r.rating === ratingFilter;
    return matchesTab && matchesSearch && matchesRating;
  });

  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : '0';

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>Reviews</Text>
          <View style={styles.avgRow}>
            <Text style={[styles.avg, { color: colors.text }]}>{avgRating}</Text>
            <Text style={[styles.avgLabel, { color: colors.textSecondary }]}>★ avg</Text>
          </View>
        </View>

        <View style={styles.searchRow}>
          <View style={[styles.searchWrapper, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Ionicons name="search" size={16} color={colors.textMuted} style={styles.searchIcon} />
            <TextInput
              style={[styles.searchInput, { color: colors.text }]}
              placeholder="Search reviews..."
              placeholderTextColor={colors.textMuted}
              value={search}
              onChangeText={setSearch}
            />
          </View>
          <TouchableOpacity onPress={() => setShowRatingDropdown(true)} style={[styles.dropdown, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.dropdownText, { color: colors.textSecondary }]} numberOfLines={1}>
              {ratings.find(r => r.id === ratingFilter)?.label}
            </Text>
            <Ionicons name="chevron-down" size={14} color={colors.textMuted} />
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
            <Card style={{ marginBottom: 8 }}>
              <View style={styles.reviewHeader}>
                <View style={styles.stars}>
                  {[1, 2, 3, 4, 5].map(s => (
                    <Text key={s} style={{ color: s <= item.rating ? '#F59E0B' : '#D1D5DB' }}>★</Text>
                  ))}
                </View>
                <Badge variant={item.status === 'flagged' ? 'error' : item.status === 'hidden' ? 'neutral' : 'success'}>{item.status}</Badge>
              </View>
              <Text style={[styles.reviewComment, { color: colors.text }]}>{item.comment}</Text>
              <Text style={[styles.reviewMeta, { color: colors.textMuted }]}>{item.reviewerName} → {item.reviewedMemberName} · {formatDate(item.date)}</Text>
            </Card>
          )}
        />
      </View>

      <Modal visible={showRatingDropdown} transparent animationType="fade">
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setShowRatingDropdown(false)}>
          <View style={[styles.dropdownModal, { backgroundColor: colors.white, borderColor: colors.border }]}>
            {ratings.map((r) => (
              <TouchableOpacity key={r.id} onPress={() => { setRatingFilter(r.id); setShowRatingDropdown(false); }} style={[styles.dropdownOption, { borderBottomColor: colors.border }]}>
                <Text style={[styles.dropdownOptionText, { color: ratingFilter === r.id ? colors.primary : colors.text }]}>{r.label}</Text>
                {ratingFilter === r.id && <Ionicons name="checkmark" size={18} color={colors.primary} />}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, padding: 16 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  title: { fontSize: 24, fontWeight: 'bold' },
  avgRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  avg: { fontSize: 20, fontWeight: 'bold' },
  avgLabel: { fontSize: 14 },
  searchRow: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  searchWrapper: { flex: 1, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: 10, paddingHorizontal: 10 },
  searchIcon: { marginRight: 6 },
  searchInput: { flex: 1, paddingVertical: 10, fontSize: 14 },
  dropdown: { flexDirection: 'row', alignItems: 'center', gap: 4, borderWidth: 1, borderRadius: 10, paddingHorizontal: 12, minWidth: 110 },
  dropdownText: { fontSize: 13, fontWeight: '500' },
  tabs: { marginBottom: 12 },
  tab: { alignItems: 'center', paddingHorizontal: 12, paddingVertical: 8, marginRight: 8, position: 'relative' },
  tabText: { fontSize: 13, fontWeight: '600' },
  tabUnderline: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 2 },
  tabBadge: { marginTop: 4, paddingHorizontal: 6, paddingVertical: 1, borderRadius: 8 },
  tabBadgeText: { fontSize: 10, fontWeight: '600' },
  reviewHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  stars: { flexDirection: 'row', gap: 2 },
  reviewComment: { fontSize: 14, marginTop: 6 },
  reviewMeta: { fontSize: 12, marginTop: 4 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center' },
  dropdownModal: { width: 220, borderRadius: 12, borderWidth: 1, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.15, shadowRadius: 8, elevation: 4 },
  dropdownOption: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1 },
  dropdownOptionText: { fontSize: 14, fontWeight: '500' },
});
