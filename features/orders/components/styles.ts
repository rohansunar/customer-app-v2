import { colors } from '@/core/theme/colors';
import { spacing } from '@/core/theme/spacing';
import { StyleSheet } from 'react-native';

const ICON_BOX_SIZE = 28;

export const orderCardStyles = StyleSheet.create({
  card: {
    marginBottom: spacing.m,
    padding: spacing.s,
    backgroundColor: colors.surface,
    borderRadius: spacing.radius.l,
    borderWidth: 0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.s,
  },
  headerTitleContainer: {
    flex: 1,
    marginRight: spacing.s,
  },
  productName: {
    fontSize: 16,
    marginBottom: spacing.xs,
  },
  orderNo: {
    fontSize: 12,
  },
  headerRightContainer: {
    alignItems: 'flex-end',
  },
  dateText: {
    marginTop: spacing.xs,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.s,
    paddingVertical: spacing.xxs,
    borderRadius: spacing.radius.xl,
    borderWidth: 1,
    backgroundColor: '#FFFBEB',
  },
  menuTrigger: {
    padding: spacing.xs,
    marginLeft: spacing.xs,
    marginTop: -spacing.xs,
  },
  detailsContainer: {
    backgroundColor: colors.background,
    borderRadius: spacing.radius.m,
    padding: spacing.s,
    marginBottom: spacing.s,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.s,
  },
  iconBox: {
    width: ICON_BOX_SIZE,
    height: ICON_BOX_SIZE,
    borderRadius: ICON_BOX_SIZE / 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.s,
  },
  detailText: {
    flex: 1,
    fontSize: 13,
  },
  quantityRow: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemsList: {
    marginTop: spacing.s,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.s,
    paddingLeft: ICON_BOX_SIZE + spacing.s,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  itemName: {
    flex: 1,
  },
  amountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.s,
    paddingHorizontal: spacing.xs,
  },
  footerContainer: {
    marginBottom: spacing.s,
  },
  paymentStatusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: spacing.xs,
    paddingHorizontal: spacing.xs,
  },
  paymentLabel: {
    marginRight: spacing.xs,
  },
  paymentStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.s,
    paddingVertical: spacing.xxs,
    borderRadius: spacing.radius.m + 4,
    borderWidth: 1,
  },
  paymentModeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.s,
    paddingVertical: spacing.xxs,
    borderRadius: spacing.radius.m + 4,
    borderWidth: 1,
    marginLeft: spacing.xs,
  },
  trackerContainer: {
    backgroundColor: '#FAFAFA',
    borderRadius: spacing.radius.m,
    padding: spacing.s,
  },
  otpContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.s,
    padding: spacing.s,
    backgroundColor: '#EFF6FF',
    borderRadius: spacing.radius.m,
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  otpText: {
    marginLeft: spacing.s,
  },
  confirmDeliveryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.s,
    padding: spacing.m,
    backgroundColor: colors.primary,
    borderRadius: spacing.radius.m,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  menuOverlay: {
    position: 'absolute',
    backgroundColor: colors.surface,
    borderRadius: spacing.radius.m,
    padding: spacing.s,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 10,
    borderWidth: 1,
    borderColor: colors.border,
    minWidth: 160,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.s,
  },
  menuItemText: {
    marginLeft: spacing.s,
    fontWeight: '500',
  },
  menuDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginHorizontal: spacing.s,
  },
  cancellationContainer: {
    marginTop: spacing.s,
    backgroundColor: colors.background,
    borderRadius: spacing.radius.m,
    padding: spacing.s,
  },
  cancellationRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.s,
  },
  cancellationContent: {
    flex: 1,
    marginLeft: spacing.s,
  },
  cancellationLabel: {
    marginBottom: spacing.xxs,
  },
  cancellationValue: {
    lineHeight: 18,
  },
});

export const iconBoxColors = {
  location: '#E0F2FE',
  quantity: '#F3E8FF',
  cancellation: '#FEE2E2',
  cancelledBy: '#FEF3C7',
};
