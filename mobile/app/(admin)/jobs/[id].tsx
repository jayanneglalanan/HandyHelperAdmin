import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../hooks/useTheme';
import { useJobs } from '../../../hooks/useMockData';
import Card from '../../../components/ui/Card';
import StatusBadge from '../../../components/ui/StatusBadge';
import Badge from '../../../components/ui/Badge';
import { formatDate, formatCurrency } from '../../../../shared/utils/formatters';

export default function JobDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { colors } = useTheme();
  const jobs = useJobs();
  const job = jobs.find(j => j.id === id);

  if (!job) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.center}>
          <Text style={{ color: colors.textSecondary }}>Job not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Ionicons name="arrow-back" size={24} color={colors.text} onPress={() => router.back()} />
          <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>{job.title}</Text>
        </View>

        <View style={styles.topRow}>
          <StatusBadge status={job.status} />
          <Text style={[styles.budget, { color: colors.text }]}>{formatCurrency(job.budget)}</Text>
        </View>

        <View style={{ flexDirection: 'row', gap: 8, marginBottom: 16 }}>
          {job.status === 'open' && (
            <TouchableOpacity onPress={() => Alert.alert('Assigned', `Member assigned to "${job.title}"`)} style={{ flex: 1, paddingVertical: 10, borderRadius: 8, backgroundColor: colors.primary || '#5B4BDB', alignItems: 'center' }}>
              <Text style={{ color: '#FFF', fontSize: 14, fontWeight: '600' }}>Assign</Text>
            </TouchableOpacity>
          )}
          {(job.status === 'open' || job.status === 'in_progress') && (
            <TouchableOpacity onPress={() => Alert.alert('Cancelled', `Job "${job.title}" cancelled`)} style={{ flex: 1, paddingVertical: 10, borderRadius: 8, borderWidth: 1, borderColor: colors.error || '#DC2626', alignItems: 'center' }}>
              <Text style={{ color: colors.error || '#DC2626', fontSize: 14, fontWeight: '600' }}>Cancel</Text>
            </TouchableOpacity>
          )}
        </View>

        <Card style={{ marginBottom: 12 }}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Description</Text>
          <Text style={[styles.description, { color: colors.textSecondary }]}>{job.description}</Text>
        </Card>

        <Card style={{ marginBottom: 12 }}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Details</Text>
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: colors.textMuted }]}>Category</Text>
            <Badge>{job.category}</Badge>
          </View>
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: colors.textMuted }]}>Location</Text>
            <Text style={[styles.detailValue, { color: colors.text }]}>{job.location}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: colors.textMuted }]}>Posted</Text>
            <Text style={[styles.detailValue, { color: colors.text }]}>{formatDate(job.postedDate)}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: colors.textMuted }]}>Schedule</Text>
            <Text style={[styles.detailValue, { color: colors.text }]}>{job.preferredSchedule}</Text>
          </View>
        </Card>

        <Card style={{ marginBottom: 12 }}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Client</Text>
          <Text style={[styles.detailValue, { color: colors.text }]}>{job.clientName}</Text>
        </Card>

        {job.assignedMemberName && (
          <Card style={{ marginBottom: 12 }}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Assigned Member</Text>
            <Text style={[styles.detailValue, { color: colors.text }]}>{job.assignedMemberName}</Text>
            {job.acceptedDate && (
              <Text style={[styles.detailLabel, { color: colors.textMuted }]}>
                Accepted: {formatDate(job.acceptedDate)}
              </Text>
            )}
          </Card>
        )}

        <Card style={{ marginBottom: 12 }}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Timeline</Text>
          {[
            { label: 'Job Posted', date: job.postedDate, done: true },
            { label: 'Member Accepted', date: job.acceptedDate, done: !!job.acceptedDate },
            { label: 'Job Completed', date: job.completedDate, done: !!job.completedDate },
          ].map((step, i) => (
            <View key={i} style={styles.timelineItem}>
              <View style={[styles.dot, { backgroundColor: step.done ? colors.success : colors.border }]} />
              <View style={styles.timelineInfo}>
                <Text style={[styles.timelineLabel, { color: step.done ? colors.text : colors.textMuted }]}>
                  {step.label}
                </Text>
                {step.date && (
                  <Text style={[styles.timelineDate, { color: colors.textMuted }]}>{formatDate(step.date)}</Text>
                )}
              </View>
            </View>
          ))}
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  content: { padding: 16 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  title: { fontSize: 20, fontWeight: 'bold', flex: 1 },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  budget: { fontSize: 22, fontWeight: 'bold' },
  sectionTitle: { fontSize: 16, fontWeight: '600', marginBottom: 8 },
  description: { fontSize: 14, lineHeight: 20 },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  detailLabel: { fontSize: 13 },
  detailValue: { fontSize: 14, fontWeight: '500' },
  timelineItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8,
  },
  dot: { width: 10, height: 10, borderRadius: 5 },
  timelineInfo: { flex: 1 },
  timelineLabel: { fontSize: 14, fontWeight: '500' },
  timelineDate: { fontSize: 12, marginTop: 2 },
});
