import { colors } from '@/core/theme/colors';
import { spacing } from '@/core/theme/spacing';
import { Button } from '@/core/ui/Button';
import { Input } from '@/core/ui/Input';
import { Text } from '@/core/ui/Text';
import { useProfile } from '@/features/profile/hooks/useProfile';
import { useUpdateProfile } from '@/features/profile/hooks/useUpdateProfile';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { IconSymbol } from '../../components/ui/icon-symbol';

export default function ProfileScreen() {
  const { data, isLoading, error } = useProfile();
  const { mutate, isPending } = useUpdateProfile();

  // Local editable state
  const [name, setName] = useState('');
  const [email, setEmail] = useState<string | null>(null);

  // Populate form when profile loads
  useEffect(() => {
    if (data) {
      setName(data.name ?? '');
      setEmail(data.email);
    }
  }, [data]);

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <Text>Loading profile...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text color={colors.error}>Error loading profile: {error.message}</Text>
      </View>
    );
  }

  if (!data) {
    return (
      <View style={styles.centered}>
        <Text>No profile data available.</Text>
      </View>
    );
  }

  function handleSave() {
    mutate({
      name,
      email,
    });
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text variant="xl" weight="bold" color={colors.primary}>
          Profile
        </Text>
      </View>

      <View style={styles.card}>
        {/* Status */}
        <View style={styles.row}>
          <Text weight="medium">Account Status</Text>
          <View style={styles.statusBadge}>
            <IconSymbol
              name={
                data.isActive ? 'checkmark.circle.fill' : 'xmark.circle.fill'
              }
              size={20}
              color={data.isActive ? colors.success : colors.error}
            />
            <Text
              variant="s"
              color={data.isActive ? colors.success : colors.error}
              style={{ marginLeft: spacing.xs }}
            >
              {data.isActive ? 'Active' : 'Inactive'}
            </Text>
          </View>
        </View>

        {/* Phone (disabled) */}
        <Input
          label="Phone Number"
          value={data.phone}
          editable={false}
          selectTextOnFocus={false}
          style={{ backgroundColor: colors.background }} // Visually disabled
        />

        {/* Name */}
        <Input
          label="Full Name"
          value={name}
          onChangeText={setName}
          placeholder="Enter your name"
        />

        {/* Email */}
        <Input
          label="Email Address"
          value={email ?? ''}
          onChangeText={setEmail}
          placeholder="Enter your email"
          keyboardType="email-address"
        />

        <Button
          title={isPending ? 'Saving...' : 'Save Changes'}
          onPress={handleSave}
          loading={isPending}
          style={styles.button}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.m,
    backgroundColor: colors.background,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    marginBottom: spacing.l,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: spacing.radius.l,
    padding: spacing.l,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.l,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    marginTop: spacing.m,
  },
});
