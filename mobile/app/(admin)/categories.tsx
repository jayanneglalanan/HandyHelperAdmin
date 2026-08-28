import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../hooks/useTheme';
import { useCategories } from '../../hooks/useMockData';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';

export default function CategoriesScreen() {
  const { colors } = useTheme();
  const categories = useCategories();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.text }]}>Categories</Text>
        <FlatList
          data={categories}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.row}
          renderItem={({ item }) => (
            <Card style={styles.card}>
              <Text style={styles.icon}>{item.icon}</Text>
              <Text style={[styles.name, { color: colors.text }]}>{item.name}</Text>
              <Text style={[styles.desc, { color: colors.textSecondary }]} numberOfLines={2}>
                {item.description}
              </Text>
              <View style={styles.stats}>
                <Text style={[styles.stat, { color: colors.textSecondary }]}>{item.memberCount} members</Text>
                <Text style={[styles.stat, { color: colors.textSecondary }]}>{item.jobCount} jobs</Text>
              </View>
              <Badge variant={item.status === 'active' ? 'success' : 'neutral'}>{item.status}</Badge>
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
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 12 },
  row: { gap: 8, marginBottom: 8 },
  card: { flex: 1 },
  icon: { fontSize: 28, marginBottom: 8 },
  name: { fontSize: 14, fontWeight: '600' },
  desc: { fontSize: 12, marginTop: 2 },
  stats: { flexDirection: 'row', gap: 12, marginTop: 8 },
  stat: { fontSize: 12 },
});
