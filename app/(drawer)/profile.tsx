import { colors } from '@/core/theme/colors';
import { spacing } from '@/core/theme/spacing';
import { useAuth } from '@/core/providers/AuthProvider';
import { Button } from '@/core/ui/Button';
import { Text } from '@/core/ui/Text';
import { Input } from '@/core/ui/Input';
import { useProfile } from '@/features/profile/hooks/useProfile';
import { useUpdateProfile } from '@/features/profile/hooks/useUpdateProfile';
import { useProfileForm } from '@/features/profile/hooks/useProfileValidator';
import { useDeleteAccount } from '@/features/profile/hooks/useDeleteAccount';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  RefreshControl,
  Alert,
} from 'react-native';
import { IconSymbol } from '../../components/ui/icon-symbol';
import { TopUpModal } from '@/features/profile/components/TopUpModal';
// import { paymentService } from '@/features/payment/services/paymentService';

export default function ProfileScreen() {
  const { data, isLoading, isError, refetch } = useProfile();
  const { logout } = useAuth();
  const { mutate, isPending: isUpdating } = useUpdateProfile();
  const {
    mutate: requestDelete,
    isPending: isDeleting,
  } = useDeleteAccount();
  const [topUpVisible, setTopUpVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const { form, errors, isDirty, updateField, validate } = useProfileForm(data);

  const getInitials = (name: string) => {
    if (!name) return '?';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const handleTopUp = async (amount: number) => {
    setTopUpVisible(false);
    Alert.alert('Top Up', `Redirecting to Razorpay for ₹${amount}...`);
    // Logic to call paymentService.createOrder would go here
  };

  const handleSave = () => {
    if (!isDirty) {
      setIsEditing(false);
      return;
    }
    if (!validate()) return;

    mutate(
      {
        name: form.name,
        email: form.email || null,
      },
      {
        onSuccess: () => {
          setIsEditing(false);
          refetch();
        },
      }
    );
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: () => logout() },
    ]);
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Submitting this request will schedule deletion of your account within 7 days. You will be logged out now and no data will be retained on the server. Proceed?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Submit Request',
          style: 'destructive',
          onPress: () => requestDelete(),
        },
      ],
    );
  };

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.centered}>
        <IconSymbol name="xmark.circle.fill" size={64} color={colors.error} />
        <Text variant="l" weight="bold" style={styles.errorTitle}>Connection Failed</Text>
        <Text color={colors.textSecondary} style={styles.errorMessage}>
          We couldn't reach the backend. Please try logging in again.
        </Text>
        <Button
          title="Logout"
          onPress={logout}
          style={styles.logoutButton}
        />
        <Button
          title="Try Again"
          onPress={() => refetch()}
          variant="outline"
          style={styles.retryButton}
        />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={isLoading} onRefresh={refetch} />
      }
    >
      {/* Header with Settings */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <IconSymbol name="chevron.left" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text variant="l" weight="bold">{isEditing ? 'Edit Profile' : 'Profile & Wallet'}</Text>
        <TouchableOpacity onPress={() => setIsEditing(!isEditing)}>
          <IconSymbol
            name={isEditing ? 'xmark' : 'gearshape.fill'}
            size={24}
            color={isEditing ? colors.error : colors.textPrimary}
          />
        </TouchableOpacity>
      </View>

      {isEditing ? (
        <View style={styles.editSection}>
          <Input
            label="Full Name"
            value={form.name}
            onChangeText={(val) => updateField('name', val)}
            placeholder="Enter your name"
            error={errors.name}
          />

          <Input
            label="Email Address"
            value={form.email ?? ''}
            onChangeText={(val) => updateField('email', val)}
            placeholder="Enter your email"
            keyboardType="email-address"
            error={errors.email}
          />

          <Input
            label="Phone Number"
            value={data?.phone}
            editable={false}
            style={{ backgroundColor: colors.background }}
          />

          <Button
            title={isUpdating ? 'Saving...' : 'Save Changes'}
            onPress={handleSave}
            loading={isUpdating}
            disabled={!isDirty || isUpdating}
            style={styles.saveButton}
          />

          <View style={styles.accountActions}>
            <Button
              title="Logout"
              onPress={handleLogout}
              variant="outline"
              style={styles.logoutInline}
            />
            <Button
              title={isDeleting ? 'Submitting...' : 'Delete Account'}
              onPress={handleDeleteAccount}
              loading={isDeleting}
              variant="ghost"
              textStyle={{ color: colors.error }}
              style={styles.deleteButton}
            />
            <Text variant="xs" color={colors.textSecondary} style={styles.deleteHint}>
              Deletion requests take up to 7 days to complete. No data will remain on the server after processing.
            </Text>
          </View>
        </View>
      ) : (
        <>
          {/* Profile Header section */}
          <View style={styles.profileHeader}>
            <View style={styles.avatarLarge}>
              <Text variant="xl" weight="bold" color={colors.primary}>
                {getInitials(data?.name ?? '')}
              </Text>
            </View>
            <Text variant="xl" weight="bold" style={styles.userName}>
              {data?.name || 'User'}
            </Text>
            <Text color={colors.textSecondary}>{data?.email}</Text>
            <Text color={colors.textSecondary} style={styles.userPhone}>{data?.phone}</Text>
          </View>

          {/* Wallet Card */}
          <View style={styles.walletCard}>
            <View style={styles.walletInfo}>
              <Text color={colors.surfaceHighlight} weight="medium" style={styles.walletLabel}>
                AVAILABLE BALANCE
              </Text>
              <Text variant="xxl" weight="bold" color={colors.surface} style={styles.balance}>
                ₹{data?.walletBalance?.toLocaleString('en-IN') || '0.00'}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.topUpBtn}
              onPress={() => setTopUpVisible(true)}
            >
              <Text color={colors.primary} weight="bold">Top Up</Text>
            </TouchableOpacity>

            {/* Decorative circles */}
            <View style={[styles.circle, styles.circle1]} />
            <View style={[styles.circle, styles.circle2]} />
          </View>

          {/* Recent Transactions */}
          <View style={styles.transactionsHeader}>
            <Text variant="l" weight="bold">Recent Transactions</Text>
          </View>

          <View style={styles.transactionsList}>
            {data?.recentTransactions?.map((tx) => (
              <View key={tx.id} style={styles.transactionItem}>
                <View style={styles.txIconContainer}>
                  <IconSymbol
                    name={tx.type === 'positive' ? 'arrow.down.left.circle.fill' : 'bag.fill'}
                    size={24}
                    color={tx.type === 'positive' ? colors.success : colors.primary}
                  />
                </View>
                <View style={styles.txInfo}>
                  <Text weight="bold">{tx.description}</Text>
                  <Text variant="s" color={colors.textSecondary}>{tx.date}</Text>
                </View>
                <Text
                  weight="bold"
                  color={tx.type === 'positive' ? colors.success : colors.textPrimary}
                >
                  {tx.type === 'positive' ? '+' : '-'}₹{tx.amount.toLocaleString('en-IN')}
                </Text>
              </View>
            ))}
          </View>
        </>
      )}

      <TopUpModal
        visible={topUpVisible}
        onClose={() => setTopUpVisible(false)}
        onTopUp={handleTopUp}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.l,
    backgroundColor: colors.surface,
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: spacing.l, // Reduced padding
  },
  avatarLarge: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: colors.primary + '20', // Light primary border
    marginBottom: spacing.m,
  },
  userName: {
    marginBottom: spacing.xs,
  },
  userPhone: {
    marginTop: 2,
  },
  walletCard: {
    margin: spacing.m,
    padding: spacing.l,
    backgroundColor: colors.primary,
    borderRadius: spacing.radius.xl,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    overflow: 'hidden',
    height: 130,
  },
  walletInfo: {
    zIndex: 1,
  },
  walletLabel: {
    fontSize: 12,
    letterSpacing: 1,
    marginBottom: spacing.s,
  },
  balance: {
    fontSize: 32,
  },
  topUpBtn: {
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.l,
    paddingVertical: spacing.s,
    borderRadius: spacing.radius.l,
    zIndex: 1,
  },
  circle: {
    position: 'absolute',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 100,
  },
  circle1: {
    width: 120,
    height: 120,
    top: -40,
    right: -40,
  },
  circle2: {
    width: 100,
    height: 100,
    bottom: -30,
    left: 80,
  },
  txInfo: {
    flex: 1,
  },
  transactionsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.l,
    marginBottom: spacing.m,
  },
  transactionsList: {
    paddingHorizontal: spacing.l,
    paddingBottom: spacing.xl,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: spacing.m,
    borderRadius: spacing.radius.l,
    marginBottom: spacing.s,
  },
  txIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.m,
  },
  editSection: {
    padding: spacing.l,
    backgroundColor: colors.surface,
    margin: spacing.l,
    borderRadius: spacing.radius.l,
  },
  saveButton: {
    marginTop: spacing.l,
  },
  logoutButton: {
    width: '100%',
    marginTop: spacing.xl,
    backgroundColor: colors.error,
  },
  retryButton: {
    width: '100%',
    marginTop: spacing.m,
  },
  errorTitle: {
    marginTop: spacing.l,
    marginBottom: spacing.s,
  },
  errorMessage: {
    textAlign: 'center',
    marginBottom: spacing.l,
  },
  accountActions: {
    marginTop: spacing.l,
    gap: spacing.s,
  },
  logoutInline: {
    borderColor: colors.border,
  },
  deleteButton: {
    borderColor: colors.error + '50',
    backgroundColor: colors.error + '08',
  },
  deleteHint: {
    lineHeight: 18,
  },
});
