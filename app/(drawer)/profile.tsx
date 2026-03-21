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
import React, { useState, useLayoutEffect } from 'react';
import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  RefreshControl,
  Alert,
} from 'react-native';
import { useNavigation } from 'expo-router';
import { IconSymbol } from '../../core/ui/icon-symbol';
import { TopUpModal } from '@/features/profile/components/TopUpModal';
import { useWalletTopUp } from '@/features/payment/hooks/useWalletTopUp';
import { RecentTransactions } from '@/features/payment/components/RecentTransactions';
import { useQueryClient } from '@tanstack/react-query';

export default function ProfileScreen() {
  const { data, isLoading, isError, refetch } = useProfile();
  const { logout } = useAuth();
  const { mutate, isPending: isUpdating } = useUpdateProfile();
  const { mutate: requestDelete, isPending: isDeleting } = useDeleteAccount();
  const [topUpVisible, setTopUpVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const queryClient = useQueryClient();
  const createWalletTopUp = useWalletTopUp();

  const navigation = useNavigation();
  const { form, errors, isDirty, updateField, validate } = useProfileForm(data);

  /**
   * Header Integration:
   * Syncs the screen's edit mode with the navigation header.
   * This eliminates the need for a redundant local header view.
   */
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity 
          onPress={() => setIsEditing(!isEditing)}
          style={{ marginRight: spacing.m }}
        >
          <IconSymbol
            name={isEditing ? 'xmark' : 'gearshape.fill'}
            size={24}
            color={isEditing ? colors.error : colors.surface}
          />
        </TouchableOpacity>
      ),
    });
  }, [navigation, isEditing]);

  /**
   * Generates initials for the avatar placeholder.
   */
  const getInitials = (name: string) => {
    if (!name) return '?';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const handleTopUp = (amount: number) => {
    setTopUpVisible(false);

    createWalletTopUp.mutate(
      { amount },
      {
        onSuccess: () => {
          router.replace('/(drawer)/profile' as any);
        },
      },
    );
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
      },
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
      'Submitting this request will schedule deletion of your account within 60 days. You will be logged out now and no data will be retained on the server. Proceed?',
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
        <Text variant="l" weight="bold" style={styles.errorTitle}>
          Connection Failed
        </Text>
        <Text color={colors.textSecondary} style={styles.errorMessage}>
          We couldn't reach the server. Please check internet connection or try logging in again.
        </Text>
        <Button title="Logout" onPress={logout} style={styles.logoutButton} />
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
        <RefreshControl
          refreshing={isLoading}
          onRefresh={() => {
            refetch();
            queryClient.invalidateQueries({ queryKey: ['wallet', 'transactions'] });
          }}
        />
      }
    >
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
            <Text
              variant="xs"
              color={colors.textSecondary}
              style={styles.deleteHint}
            >
              Deletion requests take up to 60 days to complete. No data will
              remain on the server after processing.
            </Text>
          </View>
        </View>
      ) : (
        <>
          {/* 
            Profile Summary:
            A compact, modern view of user info (Avatar + Name + Contact).
            Replaces the bulky centered header for better space utilization.
          */}
          <View style={styles.profileSummary}>
            <View style={styles.avatarLarge}>
              <Text variant="xl" weight="bold" color={colors.primary}>
                {getInitials(data?.name ?? '')}
              </Text>
            </View>
            <View style={styles.profileInfo}>
              <Text variant="xl" weight="bold" style={styles.userName}>
                {data?.name || 'User'}
              </Text>
              <Text variant="s" color={colors.textSecondary}>{data?.email}</Text>
              <Text variant="s" color={colors.textSecondary} style={styles.userPhone}>
                {data?.phone}
              </Text>
            </View>
          </View>

          {/* 
            Wallet Card:
            Displays balance and provides entry point for Top Up.
            Now features modern shadows and refined dimensions.
          */}
          <View style={styles.walletCard}>
            <View style={styles.walletInfo}>
              <Text
                color={colors.surfaceHighlight}
                weight="medium"
                style={styles.walletLabel}
              >
                AVAILABLE BALANCE
              </Text>
              <Text
                variant="xxl"
                weight="bold"
                color={colors.surface}
                style={styles.balance}
              >
                ₹{data?.walletBalance?.toLocaleString('en-IN') || '0.00'}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.topUpBtn}
              onPress={() => setTopUpVisible(true)}
            >
              <Text color={colors.primary} weight="bold">
                Top Up
              </Text>
            </TouchableOpacity>

            {/* Decorative circles to enhance visual depth */}
            <View style={[styles.circle, styles.circle1]} />
            <View style={[styles.circle, styles.circle2]} />
          </View>

          {/* 
            Recent Transactions:
            Lists latest wallet activity.
            Independent component for maintainability.
          */}
          <RecentTransactions />
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
  profileSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.l,
    backgroundColor: colors.surface,
    marginHorizontal: spacing.l,
    marginTop: spacing.l,
    borderRadius: spacing.radius.xl,
    // Add shadow/elevation for modern look
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  avatarLarge: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.primary + '20',
    marginRight: spacing.l,
  },
  profileInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  userName: {
    fontSize: 20,
    marginBottom: 2,
  },
  userPhone: {
    marginTop: 0,
  },
  walletCard: {
    margin: spacing.l,
    padding: spacing.l,
    backgroundColor: colors.primary,
    borderRadius: spacing.radius.xl,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    overflow: 'hidden',
    height: 120,
    // Premium shadow
    elevation: 4,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
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
