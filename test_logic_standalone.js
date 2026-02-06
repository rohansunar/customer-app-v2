// Mock types for JS execution
// SubscriptionType: 'DAILY' | 'ALTERNATIVE_DAYS' | 'CUSTOM_DAYS' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'ANNUALLY'

function getSubscriptionDetails(
  startDate,
  frequency,
  quantity,
  price,
  customDays = [],
) {
  const year = startDate.getFullYear();
  const month = startDate.getMonth();

  // Check if startDate is the last day of the month
  const lastDayOfCurrentMonth = new Date(year, month + 1, 0).getDate();
  const isLastDay = startDate.getDate() === lastDayOfCurrentMonth;

  let effectiveStartDate;
  let effectiveEndDate;
  let periodLabel;
  let isNextMonth = false;

  if (isLastDay) {
    // Shift to next month
    effectiveStartDate = new Date(year, month + 1, 1);
    effectiveEndDate = new Date(year, month + 2, 0);
    const nextMonthName = effectiveStartDate.toLocaleDateString(undefined, {
      month: 'long',
    });
    periodLabel = `Full Month (${nextMonthName})`;
    isNextMonth = true;
  } else {
    // Stay in current month
    effectiveStartDate = new Date(startDate);
    effectiveEndDate = new Date(year, month + 1, 0);
    const currentMonthName = effectiveStartDate.toLocaleDateString(undefined, {
      month: 'long',
    });
    periodLabel = `Rest of ${currentMonthName}`;
  }

  // Calculate deliveries between effective start and end dates
  let totalDeliveries = 0;
  const loopDate = new Date(effectiveStartDate);

  while (loopDate <= effectiveEndDate) {
    const dayOfWeek = loopDate.getDay();
    let isDeliveryDay = false;

    if (frequency === 'DAILY') {
      isDeliveryDay = true;
    } else if (frequency === 'ALTERNATIVE_DAYS') {
      const diffInDays = Math.floor(
        (loopDate.getTime() - effectiveStartDate.getTime()) /
          (1000 * 60 * 60 * 24),
      );
      if (diffInDays % 2 === 0) {
        isDeliveryDay = true;
      }
    } else if (frequency === 'CUSTOM_DAYS') {
      if (customDays.includes(dayOfWeek)) {
        isDeliveryDay = true;
      }
    }

    if (isDeliveryDay) {
      totalDeliveries++;
    }

    // Move to next day
    loopDate.setDate(loopDate.getDate() + 1);
  }

  const daysRemaining =
    Math.floor(
      (effectiveEndDate.getTime() - effectiveStartDate.getTime()) /
        (1000 * 60 * 60 * 24),
    ) + 1;

  const totalAmount = totalDeliveries * quantity * price;

  return {
    effectiveStartDate,
    effectiveEndDate,
    periodLabel,
    totalDeliveries,
    daysRemaining,
    totalAmount,
    isNextMonth,
  };
}

function runTests() {
  console.log('Running Subscription Logic Validations...\n');

  const testCases = [
    {
      name: 'Standard Date (Jan 15)',
      date: new Date('2026-01-15T00:00:00'),
      expectedStart: new Date('2026-01-15T00:00:00'),
      expectedEnd: new Date('2026-01-31T00:00:00'),
      isNextMonth: false,
    },
    {
      name: 'Last Day - 31st (Jan 31)',
      date: new Date('2026-01-31T00:00:00'),
      expectedStart: new Date('2026-02-01T00:00:00'),
      expectedEnd: new Date('2026-02-28T00:00:00'), // 2026 is non-leap
      isNextMonth: true,
    },
    {
      name: 'Last Day - 30th (Apr 30)',
      date: new Date('2026-04-30T00:00:00'),
      expectedStart: new Date('2026-05-01T00:00:00'),
      expectedEnd: new Date('2026-05-31T00:00:00'),
      isNextMonth: true,
    },
    {
      name: 'Last Day - Feb 28 (Non-Leap)',
      date: new Date('2026-02-28T00:00:00'),
      expectedStart: new Date('2026-03-01T00:00:00'),
      expectedEnd: new Date('2026-03-31T00:00:00'),
      isNextMonth: true,
    },
    {
      name: 'First Day of Month (Mar 1)',
      date: new Date('2026-03-01T00:00:00'),
      expectedStart: new Date('2026-03-01T00:00:00'),
      expectedEnd: new Date('2026-03-31T00:00:00'),
      isNextMonth: false,
    },
  ];

  let passed = 0;
  let failed = 0;

  testCases.forEach((test) => {
    const result = getSubscriptionDetails(test.date, 'DAILY', 1, 10);

    const rStart = result.effectiveStartDate;
    const rEnd = result.effectiveEndDate;

    // Compare YMD
    const startMatch =
      rStart.getFullYear() === test.expectedStart.getFullYear() &&
      rStart.getMonth() === test.expectedStart.getMonth() &&
      rStart.getDate() === test.expectedStart.getDate();

    const endMatch =
      rEnd.getFullYear() === test.expectedEnd.getFullYear() &&
      rEnd.getMonth() === test.expectedEnd.getMonth() &&
      rEnd.getDate() === test.expectedEnd.getDate();

    const isNextMonthMatch = result.isNextMonth === test.isNextMonth;

    if (startMatch && endMatch && isNextMonthMatch) {
      console.log(`[PASS] ${test.name}`);
      passed++;
    } else {
      console.log(`[FAIL] ${test.name}`);
      console.log(
        `  Expected Start: ${test.expectedStart.toDateString()}, Got: ${rStart.toDateString()}`,
      );
      console.log(
        `  Expected End:   ${test.expectedEnd.toDateString()}, Got: ${rEnd.toDateString()}`,
      );
      console.log(
        `  Expected NextMonth: ${test.isNextMonth}, Got: ${result.isNextMonth}`,
      );
      failed++;
    }
  });

  console.log(`\nTests Completed: ${passed} Passed, ${failed} Failed.`);
}

runTests();
