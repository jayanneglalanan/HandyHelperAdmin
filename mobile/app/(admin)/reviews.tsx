import React, { useState } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../hooks/useTheme';
import { useReviews } from '../../hooks/useMockData';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import { formatDate } from '../../../shared/utils/formatters';

export default function ReviewsScreen() {
  const { colors } = useTheme();
  const reviews = useReviews();
  const [filter, setFilter] = useState('all');

  const filtered = reviews.filter(r => filter === 'all' || r.status === filter);
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

        <View style={styles.filters}>
          {['all', 'visible', 'flagged', 'hidden'].map((f) => (
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
              <View style={styles.reviewHeader}>
                <View style={styles.stars}>
                  {[1, 2, 3, 4, 5].map(s => (
                    <Text key={s} style={{ color: s <= item.rating ? '#F59E0B' : '#D1D5DB' }}>★</Text>
                  ))}
                </View>
                <Badge variant={item.status === 'flagged' ? 'error' : item.status === 'hidden' ? 'neutral' : 'success'}>
                  {item.status}
                </Badge>
              </View>
              <Text style={[styles.reviewComment, { color: colors.text }]}>{item.comment}</Text>
              <Text style={[styles.reviewMeta, { color: colors.textMuted }]}>
                {item.reviewerName} → {item.reviewedMemberName} · {formatDate(item.date)}
              </Text>
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
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  title: { fontSize: 24, fontWeight: 'bold' },
  avgRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  avg: { fontSize: 20, fontWeight: 'bold' },
  avgLabel: { fontSize: 14 },
  filters: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  filter: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  filterText: { fontSize: 13, fontWeight: '500' },
  reviewHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  stars: { flexDirection: 'row', gap: 2 },
  reviewComment: { fontSize: 14, marginTop: 6 },
  reviewMeta: { fontSize: 12, marginTop: 4 },
});
