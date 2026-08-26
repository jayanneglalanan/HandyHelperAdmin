import React, { useState } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import { useUsers } from '../../hooks/useMockData';
import Card from '../../components/ui/Card';
import Avatar from '../../components/ui/Avatar';
import StatusBadge from '../../components/ui/StatusBadge';
import { formatDate } from '../../../../shared/utils/formatters';

export default function UsersScreen() {
  const { colors } = useTheme();
  const users = useUsers();
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  const filtered = users.filter(user => {
    const matchesSearch = `${user.firstName} ${user.lastName} ${user.email}`.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.text }]}>Users</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{filtered.length} users</Text>

        <TextInput
          style={[styles.search, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]}
          placeholder="Search users..."
          placeholderTextColor={colors.textMuted}
          value={search}
          onChangeText={setSearch}
        />

        <View style={styles.filters}>
          {['all', 'client', 'member', 'admin'].map((role) => (
            <TouchableOpacity
              key={role}
              onPress={() => setRoleFilter(role)}
              style={[
                styles.filter,
                {
                  backgroundColor: roleFilter === role ? colors.primary : colors.surface,
                  borderColor: roleFilter === role ? colors.primary : colors.border,
                },
              ]}
            >
              <Text style={[
                styles.filterText,
                { color: roleFilter === role ? colors.white : colors.textSecondary },
              ]}>
                {role === 'all' ? 'All' : role.charAt(0).toUpperCase() + role.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Card style={{ marginBottom: 8 }}>
              <View style={styles.userRow}>
                <Avatar initials={`${item.firstName[0]}${item.lastName[0]}`} />
                <View style={styles.userInfo}>
                  <Text style={[styles.userName, { color: colors.text }]}>
                    {item.firstName} {item.lastName}
                  </Text>
                  <Text style={[styles.userEmail, { color: colors.textSecondary }]}>{item.email}</Text>
                  <Text style={[styles.userDate, { color: colors.textMuted }]}>Joined {formatDate(item.dateJoined)}</Text>
                </View>
                <StatusBadge status={item.status} />
              </View>
            </Card>
          )}
          contentContainerStyle={styles.list}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 12,
  },
  search: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    marginBottom: 12,
  },
  filters: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  filter: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  filterText: {
    fontSize: 13,
    fontWeight: '500',
  },
  list: {
    paddingBottom: 20,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 14,
    fontWeight: '600',
  },
  userEmail: {
    fontSize: 12,
    marginTop: 1,
  },
  userDate: {
    fontSize: 11,
    marginTop: 1,
  },
});
