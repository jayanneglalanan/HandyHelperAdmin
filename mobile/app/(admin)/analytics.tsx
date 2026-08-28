import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import { useAnalytics, useUsers, useJobs, useReviews } from '../../hooks/useMockData';
import Card from '../../components/ui/Card';

function MiniBarChart({ data, color }: { data: { label: string; value: number }[]; color: string }) {
  const max = Math.max(...data.map(d => d.value));
  return (
    <View style={chartStyles.container}>
      {data.map((item, i) => (
        <View key={i} style={chartStyles.bar}>
          <Text style={[chartStyles.value, { color: '#6B7280' }]}>{item.value}</Text>
          <View style={[chartStyles.barFill, { backgroundColor: color, height: `${(item.value / max) * 100}%` }]} />
          <Text style={[chartStyles.label, { color: '#6B7280' }]}>{item.label}</Text>
        </View>
      ))}
    </View>
  );
}

const chartStyles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'flex-end', height: 120, gap: 4 },
  bar: { flex: 1, alignItems: 'center' },
  value: { fontSize: 12, marginBottom: 2 },
  barFill: { width: '100%', borderRadius: 4, minHeight: 4 },
  label: { fontSize: 12, marginTop: 4 },
});

export default function AnalyticsScreen() {
  const { colors } = useTheme();
  const analytics = useAnalytics();
  const users = useUsers();
  const jobs = useJobs();

  const stats = [
    { label: 'Total Jobs', value: analytics.jobStats.total.toLocaleString() },
    { label: 'Completed', value: analytics.jobStats.completed.toLocaleString() },
    { label: 'Active', value: analytics.jobStats.active.toString() },
    { label: 'Avg Days', value: analytics.jobStats.avgCompletionDays.toString() },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.title, { color: colors.text }]}>Analytics</Text>

        <View style={styles.statsGrid}>
          {stats.map((stat, i) => (
            <View key={i} style={[styles.statCard, { backgroundColor: colors.white, borderColor: colors.border }]}>
              <Text style={[styles.statValue, { color: colors.text }]}>{stat.value}</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{stat.label}</Text>
            </View>
          ))}
        </View>

        <Card style={{ marginBottom: 12 }}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>User Growth</Text>
          <MiniBarChart data={analytics.userGrowth.map(d => ({ label: d.month, value: d.count }))} color="#2563EB" />
        </Card>

        <Card style={{ marginBottom: 12 }}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Job Growth</Text>
          <MiniBarChart data={analytics.jobGrowth.map(d => ({ label: d.month, value: d.count }))} color="#059669" />
        </Card>

        <Card style={{ marginBottom: 12 }}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Popular Skills</Text>
          {analytics.topSkills.slice(0, 5).map((skill) => (
            <View key={skill.name} style={styles.skillRow}>
              <Text style={[styles.skillName, { color: colors.text }]}>{skill.name}</Text>
              <View style={[styles.skillBar, { backgroundColor: colors.surfaceAlt }]}>
                <View style={[styles.skillFill, { width: `${(skill.jobCount / analytics.topSkills[0].jobCount) * 100}%` }]} />
              </View>
              <Text style={[styles.skillCount, { color: colors.textSecondary }]}>{skill.jobCount}</Text>
            </View>
          ))}
        </Card>

        <Card style={{ marginBottom: 12 }}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Rating Distribution</Text>
          {analytics.ratingDistribution.map((item) => (
            <View key={item.rating} style={styles.ratingRow}>
              <Text style={[styles.ratingLabel, { color: colors.textSecondary }]}>{item.rating} ★</Text>
              <View style={[styles.ratingBar, { backgroundColor: colors.surfaceAlt }]}>
                <View style={[styles.ratingFill, { width: `${item.percentage}%` }]} />
              </View>
              <Text style={[styles.ratingCount, { color: colors.textSecondary }]}>{item.count}</Text>
            </View>
          ))}
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  statCard: { width: '48%', flexGrow: 1, borderWidth: 1, borderRadius: 12, padding: 14 },
  statValue: { fontSize: 22, fontWeight: 'bold' },
  statLabel: { fontSize: 12, marginTop: 2 },
  sectionTitle: { fontSize: 16, fontWeight: '600', marginBottom: 12 },
  skillRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  skillName: { fontSize: 13, width: 90 },
  skillBar: { flex: 1, height: 8, borderRadius: 4, overflow: 'hidden' },
  skillFill: { height: '100%', backgroundColor: '#1A1A1A', borderRadius: 4 },
  skillCount: { fontSize: 12, width: 30, textAlign: 'right' },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
  ratingLabel: { fontSize: 13, width: 30 },
  ratingBar: { flex: 1, height: 8, borderRadius: 4, overflow: 'hidden' },
  ratingFill: { height: '100%', backgroundColor: '#F59E0B', borderRadius: 4 },
  ratingCount: { fontSize: 12, width: 30, textAlign: 'right' },
});
