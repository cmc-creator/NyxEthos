import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

function validateDashboardShape(payload: unknown) {
  assert.equal(typeof payload, 'object');
  assert.ok(payload !== null);

  const typed = payload as {
    stats?: Record<string, unknown>;
    revenueData?: unknown[];
    recentJobs?: unknown[];
    todayJobs?: unknown[];
  };

  assert.ok(typed.stats);
  assert.equal(typeof typed.stats?.thisMonthRevenue, 'number');
  assert.equal(typeof typed.stats?.activeJobs, 'number');
  assert.equal(typeof typed.stats?.totalCustomers, 'number');
  assert.equal(typeof typed.stats?.completedJobs, 'number');
  assert.ok(Array.isArray(typed.revenueData));
  assert.ok(Array.isArray(typed.recentJobs));
  assert.ok(Array.isArray(typed.todayJobs));
}

describe('admin dashboard payload contract', () => {
  it('accepts valid dashboard response shape', () => {
    validateDashboardShape({
      stats: {
        thisMonthRevenue: 1200,
        activeJobs: 3,
        totalCustomers: 10,
        completedJobs: 25,
      },
      revenueData: [{ month: 'Jul', revenue: 1200 }],
      recentJobs: [{ id: '1' }],
      todayJobs: [{ id: '2' }],
    });
  });
});
