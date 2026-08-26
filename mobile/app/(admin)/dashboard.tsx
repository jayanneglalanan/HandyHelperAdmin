import React from 'react';
import { View, Text, ScrollView, StyleSheet, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../hooks/useTheme';
import { useUsers, useJobs, useReports } from '../../hooks/useMockData';
import Card from '../../components/ui/Card';
import StatusBadge from '../../components/ui/StatusBadge';

export default function DashboardScreen() {
  const { colors } = useTheme();
  const users = useUsers();
  const jobs = useJobs();
  const reports = useReports();
  const [refreshing, setRefreshing] = React.useState(false);

  const members = users.filter(u => u.role === 'member');
  const clients = users.filter(u => u.role === 'client');
  const pendingVerification = members.filter(m => m.verificationStatus === 'pending');
  const activeJobs = jobs.filter(j => ['open', 'accepted', 'in_progress'].includes(j.status));
  const completedJobs = jobs.filter(j => j.status === 'completed');

  const stats = [
    { label: 'Total Users', value: users.length },
    { label: 'Clients', value: clients.length },
    { label: 'Members', value: members.length },
    { label: 'Pending Verify', value: pendingVerification.length },
    { label: 'Active Jobs', value: activeJobs.length },
    { label: 'Completed', value: completedJobs.length },
    { label: 'Cancelled', value: jobs.filter(j => j.status === 'cancelled').length },
    { label: 'Reports', value: reports.length },
  ];

  const recentJobs = jobs.slice(0, 5);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.title, { color: colors.text }]}>Dashboard</Text>

        <View style={styles.statsGrid}>
          {stats.map((stat, i) => (
            <View key={i} style={[styles.statCard, { backgroundColor: colors.white, borderColor: colors.border }]}>
              <Text style={[styles.statValue, { color: colors.text }]}>{stat.value}</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{stat.label}</Text>
            </View>
          ))}
        </View>

        <Text style={[styles.sectionTitle, { color: colors.text }]}>Recent Jobs</Text>
        {recentJobs.map((job) => (
          <Card key={job.id} style={{ marginBottom: 8 }}>
            <View style={styles.jobRow}>
              <View style={styles.jobInfo}>
                <Text style={[styles.jobTitle, { color: colors.text }]}>{job.title}</Text>
                <Text style={[styles.jobClient, { color: colors.textSecondary }]}>
                  {job.clientName} · {job.category}
                </Text>
              </View>
              <StatusBadge status={job.status} />
            </View>
          </Card>
        ))}

        <Text style={[styles.sectionTitle, { color: colors.text }]}>Pending Verification</Text>
        {pendingVerification.length === 0 ? (
          <Text style={[styles.emptyText, { color: colors.textMuted }]}>No pending verifications</Text>
        ) : (
          pendingVerification.map((member) => (
            <Card key={member.id} style={{ marginBottom: 8 }}>
              <View style={styles.jobRow}>
                <View>
                  <Text style={[styles.jobTitle, { color: colors.text }]}>
                    {member.firstName} {member.lastName}
                  </Text>
                  <Text style={[styles.jobClient, { color: colors.textSecondary }]}>
                    {member.skills.join(', ')}
                  </Text>
                </View>
              </View>
            </Card>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  statCard: {
    width: '48%',
    flexGrow: 1,
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 12,
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    marginTop: 8,
  },
  jobRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  jobInfo: {
    flex: 1,
    marginRight: 8,
  },
  jobTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  jobClient: {
    fontSize: 12,
    marginTop: 2,
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
    paddingVertical: 20,
  },
});
