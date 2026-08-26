import React, { useState } from 'react';
import { View, Text, ScrollView, FlatList, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../hooks/useTheme';
import { useAnalytics, useJobs, useUsers, useReports } from '../../hooks/useMockData';
import Card from '../../components/ui/Card';

export default function ReportsScreen() {
  const { colors } = useTheme();
  const analytics = useAnalytics();
  const jobs = useJobs();
  const users = useUsers();
  const reports = useReports();

  const completionRate = Math.round((analytics.jobStats.completed / analytics.jobStats.total) * 100);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.title, { color: colors.text }]}>Advanced Reports</Text>

        <View style={styles.statsGrid}>
          <Card style={styles.statCard}>
            <Text style={[styles.statValue, { color: colors.success }]}>{completionRate}%</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Completion</Text>
          </Card>
          <Card style={styles.statCard}>
            <Text style={[styles.statValue, { color: colors.error }]}>
              {Math.round((analytics.jobStats.cancelled / analytics.jobStats.total) * 100)}%
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Cancellation</Text>
          </Card>
          <Card style={styles.statCard}>
            <Text style={[styles.statValue, { color: colors.text }]}>₱4,250</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Avg Value</Text>
          </Card>
          <Card style={styles.statCard}>
            <Text style={[styles.statValue, { color: colors.warning }]}>
              {reports.filter(r => r.status === 'investigating').length}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Disputes</Text>
          </Card>
        </View>

        <Card style={{ marginBottom: 12 }}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>User Breakdown</Text>
          <View style={styles.breakdownRow}>
            <Text style={[styles.breakdownLabel, { color: colors.textSecondary }]}>Total Users</Text>
            <Text style={[styles.breakdownValue, { color: colors.text }]}>{users.length}</Text>
          </View>
          <View style={styles.breakdownRow}>
            <Text style={[styles.breakdownLabel, { color: colors.textSecondary }]}>Clients</Text>
            <Text style={[styles.breakdownValue, { color: colors.text }]}>{users.filter(u => u.role === 'client').length}</Text>
          </View>
          <View style={styles.breakdownRow}>
            <Text style={[styles.breakdownLabel, { color: colors.textSecondary }]}>Members</Text>
            <Text style={[styles.breakdownValue, { color: colors.text }]}>{users.filter(u => u.role === 'member').length}</Text>
          </View>
          <View style={styles.breakdownRow}>
            <Text style={[styles.breakdownLabel, { color: colors.textSecondary }]}>Suspended</Text>
            <Text style={[styles.breakdownValue, { color: colors.error }]}>{users.filter(u => u.status === 'suspended').length}</Text>
          </View>
        </Card>

        <Card style={{ marginBottom: 12 }}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Revenue by Month</Text>
          <View style={styles.chartContainer}>
            {analytics.revenueData.map((d, i) => (
              <View key={i} style={styles.chartBar}>
                <Text style={[styles.chartValue, { color: colors.textMuted }]}>₱{(d.count / 1000).toFixed(0)}k</Text>
                <View style={[styles.chartFill, { backgroundColor: colors.success, height: `${(d.count / Math.max(...analytics.revenueData.map(r => r.count))) * 100}%` }]} />
                <Text style={[styles.chartLabel, { color: colors.textMuted }]}>{d.month}</Text>
              </View>
            ))}
          </View>
        </Card>

        <Card>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Top Locations</Text>
          {analytics.topLocations.slice(0, 5).map((loc) => (
            <View key={loc.name} style={styles.locationRow}>
              <Text style={[styles.locationName, { color: colors.text }]}>{loc.name}</Text>
              <Text style={[styles.locationCount, { color: colors.textSecondary }]}>{loc.jobCount} jobs</Text>
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
  statCard: { width: '48%', flexGrow: 1 },
  statValue: { fontSize: 22, fontWeight: 'bold' },
  statLabel: { fontSize: 12, marginTop: 2 },
  sectionTitle: { fontSize: 16, fontWeight: '600', marginBottom: 12 },
  breakdownRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  breakdownLabel: { fontSize: 14 },
  breakdownValue: { fontSize: 14, fontWeight: '600' },
  chartContainer: { flexDirection: 'row', alignItems: 'flex-end', height: 120, gap: 4 },
  chartBar: { flex: 1, alignItems: 'center' },
  chartValue: { fontSize: 9, marginBottom: 2 },
  chartFill: { width: '100%', borderRadius: 4, minHeight: 4 },
  chartLabel: { fontSize: 9, marginTop: 4 },
  locationRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  locationName: { fontSize: 14 },
  locationCount: { fontSize: 13 },
});
