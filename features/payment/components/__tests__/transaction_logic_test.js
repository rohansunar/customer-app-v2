/**
 * Standalone test script for transaction utility logic.
 * Updated to reflect real API response structure (string amounts, createdAt fields, uppercase values).
 */

const colors = {
  success: '#10B981',
  primary: '#0077B6',
  textPrimary: '#0F172A',
  textSecondary: '#475569',
  warning: '#F59E0B',
  error: '#EF4444',
};

function formatTransactionAmount(type, amount) {
  const numericAmount =
    typeof amount === 'string' ? parseFloat(amount) : amount;
  const formatted = isNaN(numericAmount)
    ? '0'
    : numericAmount.toLocaleString('en-IN');
  return type?.toLowerCase() === 'debit' ? `-₹${formatted}` : `+₹${formatted}`;
}

function getTransactionIcon(type) {
  return type?.toLowerCase() === 'debit'
    ? 'arrow.up.right.circle.fill'
    : 'arrow.down.left.circle.fill';
}

function getTransactionColor(type) {
  return type?.toLowerCase() === 'debit' ? colors.primary : colors.success;
}

function getAmountColor(type) {
  return type?.toLowerCase() === 'debit' ? colors.textPrimary : colors.success;
}

function formatTransactionDate(isoString) {
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return isoString;
    return new Intl.DateTimeFormat('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    }).format(date);
  } catch {
    return isoString;
  }
}

function getStatusLabel(status) {
  switch (status?.toLowerCase()) {
    case 'pending':
      return 'Pending';
    case 'failed':
      return 'Failed';
    case 'completed':
      return 'Completed';
    default:
      return status || 'Completed';
  }
}

function getStatusColor(status) {
  switch (status?.toLowerCase()) {
    case 'pending':
      return colors.warning;
    case 'failed':
      return colors.error;
    case 'completed':
      return colors.success;
    default:
      return colors.success;
  }
}

function runTests() {
  console.log('Running Real API Data Logic Validations...\n');

  let passed = 0;
  let failed = 0;

  function assert(name, actual, expected) {
    if (actual === expected) {
      console.log(`[PASS] ${name}`);
      passed++;
    } else {
      console.log(`[FAIL] ${name}`);
      console.log(`  Expected: ${expected}`);
      console.log(`  Got:      ${actual}`);
      failed++;
    }
  }

  // Real data sample: string amount, uppercase type
  assert(
    'Real Sample: DEBIT "300"',
    formatTransactionAmount('DEBIT', '300'),
    '-₹300',
  );
  assert(
    'Real Sample: CREDIT "1000"',
    formatTransactionAmount('CREDIT', '1000'),
    '+₹1,000',
  );

  // Status Logic - Case Insensitive
  assert('Status: COMPLETED', getStatusLabel('COMPLETED'), 'Completed');
  assert('Status: FAILED', getStatusLabel('FAILED'), 'Failed');
  assert(
    'Status Color: COMPLETED',
    getStatusColor('COMPLETED'),
    colors.success,
  );

  // Sorting Logic Simulation with createdAt
  const unsortedData = [
    { id: '1', createdAt: '2026-03-15T10:00:00Z' },
    { id: '2', createdAt: undefined, date: '2026-01-01T00:00:00Z' },
    { id: '3', createdAt: '2026-03-16T12:00:00Z' },
  ];
  const sortedData = [...unsortedData].sort((a, b) => {
    const dateA = a?.createdAt || a?.date || '';
    const dateB = b?.createdAt || b?.date || '';
    return dateB.localeCompare(dateA);
  });
  assert('Sort order: Newest createdAt (id: 3)', sortedData[0].id, '3');
  assert('Sort order: Fallback date (id: 2 last)', sortedData[2].id, '2');

  // Date formatting (real sample)
  const sampleCreatedAt = '2026-02-26T05:27:50.967Z';
  const formattedDate = formatTransactionDate(sampleCreatedAt);
  if (formattedDate.includes('2026') && formattedDate.includes('Feb')) {
    console.log(`[PASS] Date Formatting: ${formattedDate}`);
    passed++;
  } else {
    console.log(
      `[FAIL] Date Formatting: Expected Feb/2026. Got: ${formattedDate}`,
    );
    failed++;
  }

  console.log(`\nTests Completed: ${passed} Passed, ${failed} Failed.`);
  if (failed > 0) process.exit(1);
}

runTests();
