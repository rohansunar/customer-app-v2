import { colors } from '@/core/theme/colors';
import { spacing } from '@/core/theme/spacing';
import { Text } from '@/core/ui/Text';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

interface Props {
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
  minDate?: Date;
}

const DAYS_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function CalendarPicker({
  selectedDate,
  onSelectDate,
  minDate: propMinDate,
}: Props) {
  // Logic: minDate should be at least tomorrow
  const minDate = React.useMemo(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    if (propMinDate && propMinDate > tomorrow) {
      return propMinDate;
    }
    return tomorrow;
  }, [propMinDate]);

  const [viewDate, setViewDate] = useState(new Date(selectedDate));

  const month = viewDate.getMonth();
  const year = viewDate.getFullYear();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();

  const prevMonth = () => {
    setViewDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setViewDate(new Date(year, month + 1, 1));
  };

  const isSelected = (day: number) => {
    return (
      selectedDate.getDate() === day &&
      selectedDate.getMonth() === month &&
      selectedDate.getFullYear() === year
    );
  };

  const isPast = (day: number) => {
    const d = new Date(year, month, day);
    d.setHours(0, 0, 0, 0);
    return d < minDate;
  };

  const isToday = (day: number) => {
    const d = new Date(year, month, day);
    const today = new Date();
    return (
      d.getDate() === today.getDate() &&
      d.getMonth() === today.getMonth() &&
      d.getFullYear() === today.getFullYear()
    );
  };

  const renderDays = () => {
    const days = [];
    // Placeholders for empty days at the start
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<View key={`empty-${i}`} style={styles.dayCell} />);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const disabled = isPast(day);
      const selected = isSelected(day);
      const today = isToday(day);

      days.push(
        <TouchableOpacity
          key={day}
          style={[styles.dayCell, today && !selected && styles.todayCell]}
          disabled={disabled}
          onPress={() => onSelectDate(new Date(year, month, day))}
        >
          {selected ? (
            <LinearGradient
              colors={[colors.primary, '#6366F1']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.selectedGradient}
            >
              <Text variant="s" weight="bold" color={colors.white}>
                {day}
              </Text>
            </LinearGradient>
          ) : (
            <Text
              variant="s"
              weight={today ? 'bold' : 'medium'}
              color={
                disabled
                  ? colors.textSecondary + '44'
                  : today
                    ? colors.primary
                    : colors.textPrimary
              }
            >
              {day}
            </Text>
          )}
        </TouchableOpacity>,
      );
    }

    // Fill the remaining cells to maintain grid alignment
    const totalCells = Math.ceil((firstDayOfMonth + daysInMonth) / 7) * 7;
    for (let i = firstDayOfMonth + daysInMonth; i < totalCells; i++) {
      days.push(<View key={`empty-end-${i}`} style={styles.dayCell} />);
    }

    return days;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={prevMonth} style={styles.navButton}>
          <Ionicons
            name="chevron-back"
            size={20}
            color={colors.textPrimary}
            style={styles.navIcon}
          />
        </TouchableOpacity>

        <Text weight="bold" style={styles.monthLabel}>
          {viewDate.toLocaleDateString(undefined, {
            month: 'long',
            year: 'numeric',
          })}
        </Text>

        <TouchableOpacity onPress={nextMonth} style={styles.navButton}>
          <Ionicons
            name="chevron-forward"
            size={20}
            color={colors.textPrimary}
            style={styles.navIcon}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.weekLabels}>
        {DAYS_SHORT.map((d) => (
          <Text
            key={d}
            variant="xs"
            weight="semibold"
            color={colors.textTertiary}
            style={styles.weekDayLabel}
          >
            {d}
          </Text>
        ))}
      </View>

      <View style={styles.grid}>{renderDays()}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: spacing.radius.l,
    padding: spacing.m,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.l,
    paddingHorizontal: spacing.xs,
  },
  monthLabel: {
    fontSize: 17,
    color: colors.textPrimary,
    letterSpacing: 0.5,
  },
  navButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  navIcon: {
    marginLeft: 0,
  },
  weekLabels: {
    flexDirection: 'row',
    marginBottom: spacing.m,
    borderBottomWidth: 1,
    borderBottomColor: colors.border + '22',
    paddingBottom: spacing.s,
  },
  weekDayLabel: {
    flex: 1,
    textAlign: 'center',
    textTransform: 'uppercase',
    fontSize: 11,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%',
  },
  dayCell: {
    width: '14.28%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 2,
  },
  selectedGradient: {
    width: '100%',
    height: '100%',
    borderRadius: spacing.radius.m,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  todayCell: {
    borderRadius: spacing.radius.m,
    backgroundColor: colors.primary + '10',
    borderWidth: 1,
    borderColor: colors.primary + '44',
  },
});
