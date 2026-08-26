import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../hooks/useTheme';
import { useSubscriptions } from '../../hooks/useMockData';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';

export default function SubscriptionsScreen() {
  const { colors } = useTheme();
  const plans = useSubscriptions();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.text }]}>Subscriptions</Text>
        <FlatList
          data={plans}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Card style={{ marginBottom: 10 }}>
              <View style={styles.header}>
                <Text style={[styles.planName, { color: colors.text }]}>{item.name}</Text>
                <Badge>{item.subscriberCount} subscribers</Badge>
              </View>
              <Text style={[styles.price, { color: colors.text }]}>
                {item.price === 0 ? 'Free' : `₱${item.price}/${item.duration}`}
              </Text>
              <View style={styles.features}>
                {item.features.slice(0, 4).map((f, i) => (
                  <Text key={i} style={[styles.feature, { color: colors.textSecondary }]}>✓ {f}</Text>
                ))}
              </View>
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
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  planName: { fontSize: 16, fontWeight: '700' },
  price: { fontSize: 22, fontWeight: 'bold', marginTop: 6 },
  features: { marginTop: 10, gap: 4 },
  feature: { fontSize: 13 },
});
