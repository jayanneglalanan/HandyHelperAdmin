import React, { useState } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import { useUsers } from '../../hooks/useMockData';
import Card from '../../components/ui/Card';
import Avatar from '../../components/ui/Avatar';
import StatusBadge from '../../components/ui/StatusBadge';
import { formatDate } from '../../../../shared/utils/formatters';

const roles = [
  { id: 'all', label: 'All' },
  { id: 'client', label: 'Client' },
  { id: 'member', label: 'Member' },
  { id: 'admin', label: 'Admin' },
];

const statuses = [
  { id: 'all', label: 'All Status' },
  { id: 'active', label: 'Active' },
  { id: 'suspended', label: 'Suspended' },
];

export default function UsersScreen() {
  const { colors } = useTheme();
  const users = useUsers();
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);

  const roleCounts = {
    all: users.length,
    client: users.filter(u => u.role === 'client').length,
    member: users.filter(u => u.role === 'member').length,
    admin: users.filter(u => u.role === 'admin').length,
  };

  const filtered = users.filter(user => {
    const matchesSearch = `${user.firstName} ${user.lastName} ${user.email}`.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>Users</Text>
          <View style={[styles.countBadge, { backgroundColor: colors.surface }]}>
            <Text style={[styles.countText, { color: colors.textSecondary }]}>{filtered.length} users</Text>
          </View>
        </View>

        <View style={styles.searchRow}>
          <View style={[styles.searchWrapper, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Ionicons name="search" size={16} color={colors.textMuted} style={styles.searchIcon} />
            <TextInput
              style={[styles.searchInput, { color: colors.text }]}
              placeholder="Search users..."
              placeholderTextColor={colors.textMuted}
              value={search}
              onChangeText={setSearch}
            />
          </View>
          <TouchableOpacity onPress={() => setShowStatusDropdown(true)} style={[styles.dropdown, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.dropdownText, { color: colors.textSecondary }]} numberOfLines={1}>
              {statuses.find(s => s.id === statusFilter)?.label}
            </Text>
            <Ionicons name="chevron-down" size={14} color={colors.textMuted} />
          </TouchableOpacity>
        </View>

        <View style={styles.tabBar}>
          {roles.map((role) => (
            <TouchableOpacity key={role.id} onPress={() => setRoleFilter(role.id)} style={styles.tab}>
              <Text style={[styles.tabText, { color: roleFilter === role.id ? colors.primary : colors.textSecondary }]}>
                {role.label}
              </Text>
              {roleFilter === role.id && <View style={[styles.tabUnderline, { backgroundColor: colors.primary }]} />}
              <View style={[styles.tabBadge, { backgroundColor: roleFilter === role.id ? colors.primary : colors.surface }]}>
                <Text style={[styles.tabBadgeText, { color: roleFilter === role.id ? '#FFF' : colors.textSecondary }]}>{roleCounts[role.id as keyof typeof roleCounts]}</Text>
              </View>
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
                  <Text style={[styles.userName, { color: colors.text }]}>{item.firstName} {item.lastName}</Text>
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

      <Modal visible={showStatusDropdown} transparent animationType="fade">
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setShowStatusDropdown(false)}>
          <View style={[styles.dropdownModal, { backgroundColor: colors.white, borderColor: colors.border }]}>
            {statuses.map((s) => (
              <TouchableOpacity key={s.id} onPress={() => { setStatusFilter(s.id); setShowStatusDropdown(false); }} style={[styles.dropdownOption, { borderBottomColor: colors.border }]}>
                <Text style={[styles.dropdownOptionText, { color: statusFilter === s.id ? colors.primary : colors.text }]}>{s.label}</Text>
                {statusFilter === s.id && <Ionicons name="checkmark" size={18} color={colors.primary} />}
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
  countBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  countText: { fontSize: 12, fontWeight: '500' },
  searchRow: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  searchWrapper: { flex: 1, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: 10, paddingHorizontal: 10 },
  searchIcon: { marginRight: 6 },
  searchInput: { flex: 1, paddingVertical: 10, fontSize: 14 },
  dropdown: { flexDirection: 'row', alignItems: 'center', gap: 4, borderWidth: 1, borderRadius: 10, paddingHorizontal: 12, minWidth: 110 },
  dropdownText: { fontSize: 13, fontWeight: '500' },
  tabBar: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#E5E7EB', marginBottom: 12 },
  tab: { flex: 1, alignItems: 'center', paddingVertical: 10, position: 'relative' },
  tabText: { fontSize: 13, fontWeight: '600' },
  tabUnderline: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 2 },
  tabBadge: { marginTop: 4, paddingHorizontal: 6, paddingVertical: 1, borderRadius: 8 },
  tabBadgeText: { fontSize: 10, fontWeight: '600' },
  list: { paddingBottom: 20 },
  userRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  userInfo: { flex: 1 },
  userName: { fontSize: 14, fontWeight: '600' },
  userEmail: { fontSize: 12, marginTop: 1 },
  userDate: { fontSize: 12, marginTop: 1 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center' },
  dropdownModal: { width: 220, borderRadius: 12, borderWidth: 1, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.15, shadowRadius: 8, elevation: 4 },
  dropdownOption: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1 },
  dropdownOptionText: { fontSize: 14, fontWeight: '500' },
});
