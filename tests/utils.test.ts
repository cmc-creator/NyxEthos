import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { formatCurrency, formatDate, formatTime, generateInvoiceNumber } from '@/lib/utils';

describe('utils', () => {
  it('formatCurrency formats USD values', () => {
    assert.equal(formatCurrency(1234.5), '$1,234.50');
  });

  it('formatTime converts 24-hour time to 12-hour format', () => {
    assert.equal(formatTime('14:30'), '2:30 PM');
    assert.equal(formatTime('00:05'), '12:05 AM');
  });

  it('formatDate returns a readable date string', () => {
    const value = formatDate('2026-07-08');
    assert.match(value, /2026/);
  });

  it('generateInvoiceNumber uses AD prefix', () => {
    const invoiceNumber = generateInvoiceNumber();
    assert.match(invoiceNumber, /^AD-\d+$/);
  });
});
