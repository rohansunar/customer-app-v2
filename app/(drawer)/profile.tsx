import { useAuth } from '@/core/providers/AuthProvider';
import { colors } from '@/core/theme/colors';
import { spacing } from '@/core/theme/spacing';
import { Button } from '@/core/ui/Button';
import { Input } from '@/core/ui/Input';
import { Text } from '@/core/ui/Text';
import { useProfile } from '@/features/profile/hooks/useProfile';
import { useUpdateProfile } from '@/features/profile/hooks/useUpdateProfile';
import { router } from 'expo-router';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { IconSymbol } from '../../components/ui/icon-symbol';
import { useProfileForm } from '@/features/profile/hooks/useProfileValidator';

export default function ProfileScreen() {
  const { data, isLoading, error } = useProfile();
  const { mutate, isPending } = useUpdateProfile();
  const { logout } = useAuth();

  const { form, errors, updateField, validate } = useProfileForm(
    data
      ? {
          name: data.name ?? undefined,
          email: data.email ?? undefined,
        }
      : undefined,
  );

  async function handleLogout() {
    await logout();
    router.replace('/login');
  }

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <Text>Loading profile...</Text>
      </View>
    );
  }

  if (error || !data) {
    return (
      <View style={styles.centered}>
        <Text
          variant="xl"
          weight="bold"
          color={colors.error}
          style={styles.errorTitle}
        >
          Error Loading Profile
        </Text>
        <Text color={colors.error} style={styles.errorMessage}>
          We encountered an issue while loading your profile. Please try logging
          out and logging back in.
        </Text>
        <Button
          title="Logout"
          onPress={handleLogout}
          style={styles.logoutButton}
        />
      </View>
    );
  }

  function handleSave() {
    if (!validate()) return;

    mutate({
      name: form.name,
      email: form.email || null, // backend-safe
    });
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text variant="xl" weight="bold" color={colors.primary}>
          Profile
        </Text>
        <TouchableOpacity onPress={handleLogout}>
          <Text color={colors.error} weight="bold">
            Logout
          </Text>
        </TouchableOpacity>
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
          value={form.name}
          onChangeText={(val) => updateField('name', val)}
          placeholder="Enter your name"
          error={errors.name}
        />

        {/* Email */}
        <Input
          label="Email Address"
          value={form.email ?? ''}
          onChangeText={(val) => updateField('email', val)}
          placeholder="Enter your email"
          keyboardType="email-address"
          error={errors.email}
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
    padding: spacing.l,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  errorTitle: {
    marginBottom: spacing.s,
    textAlign: 'center',
  },
  errorMessage: {
    marginBottom: spacing.xl,
    textAlign: 'center',
    maxWidth: '80%',
  },
  emptyTitle: {
    marginBottom: spacing.s,
    textAlign: 'center',
  },
  emptyMessage: {
    marginBottom: spacing.xl,
    textAlign: 'center',
    maxWidth: '80%',
  },
  logoutButton: {
    marginTop: spacing.l,
    width: '60%',
  },
});
