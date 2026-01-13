import { colors } from '@/core/theme/colors';
import { spacing } from '@/core/theme/spacing';
import { Text } from '@/core/ui/Text';
import { Ionicons } from '@expo/vector-icons';
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
  minDate = new Date(),
}: Props) {
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
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return d < today;
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
          style={[
            styles.dayCell,
            selected && styles.selectedDay,
            today && !selected && styles.todayCell,
          ]}
          disabled={disabled}
          onPress={() => onSelectDate(new Date(year, month, day))}
        >
          <Text
            variant="s"
            weight={selected ? 'bold' : 'medium'}
            color={
              disabled
                ? colors.textSecondary + '66'
                : selected
                  ? colors.white
                  : today
                    ? colors.primary
                    : colors.textPrimary
            }
          >
            {day}
          </Text>
        </TouchableOpacity>,
      );
    }
    return days;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={prevMonth} style={styles.navButton}>
          <Ionicons name="chevron-back" size={20} color={colors.textPrimary} />
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
          />
        </TouchableOpacity>
      </View>

      <View style={styles.weekLabels}>
        {DAYS_SHORT.map((d) => (
          <Text
            key={d}
            variant="xs"
            color={colors.textSecondary}
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
    backgroundColor: colors.background,
    borderRadius: spacing.radius.m,
    padding: spacing.m,
    borderWidth: 1,
    borderColor: colors.border,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.m,
  },
  monthLabel: {
    fontSize: 16,
  },
  navButton: {
    padding: spacing.xs,
  },
  weekLabels: {
    flexDirection: 'row',
    marginBottom: spacing.s,
  },
  weekDayLabel: {
    flex: 1,
    textAlign: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%',
  },
  dayCell: {
    width: '14.28%', // 100 / 7
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: spacing.radius.s,
  },
  selectedDay: {
    backgroundColor: colors.primary,
  },
  todayCell: {
    borderWidth: 1,
    borderColor: colors.primary,
  },
});
