import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../hooks/useTheme';
import { useUsers, useJobs, useReviews } from '../../../hooks/useMockData';
import Card from '../../../components/ui/Card';
import Avatar from '../../../components/ui/Avatar';
import StatusBadge from '../../../components/ui/StatusBadge';
import Badge from '../../../components/ui/Badge';
import { formatDate } from '../../../../shared/utils/formatters';

export default function UserDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { colors } = useTheme();
  const users = useUsers();
  const jobs = useJobs();
  const reviews = useReviews();
  const [userStatus, setUserStatus] = useState<string | null>(null);

  const user = users.find(u => u.id === id);
  if (!user) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.center}>
          <Text style={{ color: colors.textSecondary }}>User not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const userJobs = jobs.filter(j => j.clientId === id || j.assignedMemberId === id);
  const userReviews = reviews.filter(r => r.reviewedMemberId === id);
  const effectiveStatus = userStatus || user.status;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Ionicons name="arrow-back" size={24} color={colors.text} onPress={() => router.back()} />
          <Text style={[styles.title, { color: colors.text }]}>{user.firstName} {user.lastName}</Text>
        </View>

        <View style={styles.profileSection}>
          <Avatar initials={`${user.firstName[0]}${user.lastName[0]}`} size="lg" />
          <Text style={[styles.name, { color: colors.text }]}>{user.firstName} {user.lastName}</Text>
          <Text style={[styles.role, { color: colors.textSecondary }]}>{user.role}</Text>
          <StatusBadge status={effectiveStatus} />
        </View>

        <View style={{ flexDirection: 'row', gap: 8, marginBottom: 16 }}>
          <TouchableOpacity onPress={() => Alert.alert('Edit', 'Edit mode coming soon')} style={{ flex: 1, paddingVertical: 10, borderRadius: 8, borderWidth: 1, borderColor: colors.border, alignItems: 'center' }}>
            <Text style={{ color: colors.text, fontSize: 14, fontWeight: '600' }}>Edit</Text>
          </TouchableOpacity>
          {effectiveStatus === 'active' ? (
            <TouchableOpacity onPress={() => { setUserStatus('suspended'); Alert.alert('Suspended', `${user.firstName} has been suspended`); }} style={{ flex: 1, paddingVertical: 10, borderRadius: 8, backgroundColor: colors.error || '#DC2626', alignItems: 'center' }}>
              <Text style={{ color: '#FFF', fontSize: 14, fontWeight: '600' }}>Suspend</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={() => { setUserStatus('active'); Alert.alert('Activated', `${user.firstName} has been activated`); }} style={{ flex: 1, paddingVertical: 10, borderRadius: 8, backgroundColor: colors.success || '#059669', alignItems: 'center' }}>
              <Text style={{ color: '#FFF', fontSize: 14, fontWeight: '600' }}>Activate</Text>
            </TouchableOpacity>
          )}
        </View>

        <Card style={{ marginBottom: 12 }}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Contact</Text>
          <Text style={[styles.info, { color: colors.textSecondary }]}>{user.email}</Text>
          <Text style={[styles.info, { color: colors.textSecondary }]}>{user.phone}</Text>
          <Text style={[styles.info, { color: colors.textSecondary }]}>Joined {formatDate(user.dateJoined)}</Text>
        </Card>

        {user.role === 'member' && 'skills' in user && (
          <Card style={{ marginBottom: 12 }}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Skills</Text>
            <View style={styles.badgeRow}>
              {user.skills.map((skill: string) => (
                <Badge key={skill}>{skill}</Badge>
              ))}
            </View>
          </Card>
        )}

        <Card style={{ marginBottom: 12 }}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Job History</Text>
          {userJobs.length === 0 ? (
            <Text style={{ color: colors.textMuted, fontSize: 13 }}>No jobs found</Text>
          ) : (
            userJobs.map(job => (
              <View key={job.id} style={styles.jobItem}>
                <View style={styles.jobInfo}>
                  <Text style={[styles.jobTitle, { color: colors.text }]}>{job.title}</Text>
                  <Text style={[styles.jobDate, { color: colors.textMuted }]}>{formatDate(job.postedDate)}</Text>
                </View>
                <StatusBadge status={job.status} />
              </View>
            ))
          )}
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 20,
    gap: 8,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  role: {
    fontSize: 14,
    textTransform: 'capitalize',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  info: {
    fontSize: 14,
    marginBottom: 4,
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  jobItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  jobInfo: {
    flex: 1,
  },
  jobTitle: {
    fontSize: 14,
    fontWeight: '500',
  },
  jobDate: {
    fontSize: 12,
    marginTop: 2,
  },
});
