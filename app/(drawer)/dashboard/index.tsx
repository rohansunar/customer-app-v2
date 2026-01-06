import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function DashboardScreen() {
  // Temporary static data (replace with API later)
  const stats = [
    {
      title: 'New Orders',
      value: 12,
      icon: 'receipt-outline',
      color: '#4F46E5',
      route: '/dashboard/orders',
    },
    {
      title: 'Products',
      value: 48,
      icon: 'cube-outline',
      color: '#059669',
      route: '/dashboard/products',
    },
    {
      title: 'Total Earnings',
      value: '₹25,340',
      icon: 'wallet-outline',
      color: '#F59E0B',
      route: '/dashboard/earnings',
    },
  ] as const;

  return (
    <View style={styles.container}>
      {/* Header */}
      <Text style={styles.heading}>Dashboard</Text>
      <Text style={styles.subHeading}>Overview of your business</Text>

      {/* Cards */}
      <View style={styles.grid}>
        {stats.map((item, index) => (
          <Animated.View
            key={item.title}
            entering={FadeInDown.delay(index * 100)}
          >
            <Pressable
              style={styles.card}
              onPress={() => router.push(item.route)}
            >
              <View
                style={[styles.iconWrapper, { backgroundColor: item.color }]}
              >
                <Ionicons name={item.icon as any} size={22} color="#FFF" />
              </View>

              <Text style={styles.value}>{item.value}</Text>
              <Text style={styles.label}>{item.title}</Text>
            </Pressable>
          </Animated.View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
    padding: 10,
  },

  heading: {
    fontSize: 26,
    fontWeight: '700',
    color: '#111',
  },

  subHeading: {
    marginTop: 4,
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 24,
  },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  card: {
    width: '100%',
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },

  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },

  value: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111',
  },

  label: {
    marginTop: 4,
    fontSize: 13,
    color: '#6B7280',
  },
});
