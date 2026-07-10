import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { createPostHandler as createContactPostHandler } from '@/app/api/contact/route';
import { createPostHandler as createPaymentIntentPostHandler } from '@/app/api/stripe/create-payment-intent/route';
import { createPostHandler as createStripeReconcilePostHandler } from '@/app/api/admin/stripe/reconcile/route';
import { requireAdmin } from '@/app/api/admin/_lib/auth';

type CreatePaymentIntentDeps = NonNullable<Parameters<typeof createPaymentIntentPostHandler>[0]>;

describe('contact route', () => {
  it('returns 429 when hourly rate limit is exceeded', async () => {
    const handler = createContactPostHandler({
      getSupabaseAdminFn: () => ({
        from: (table: string) => ({
          select: () => ({
            eq: () => ({
              gte: async () => ({
                count: table === 'contact_rate_limits' ? 8 : 0,
                error: null,
              }),
            }),
          }),
          insert: async () => ({ error: null }),
        }),
      }),
      getIpAddressFn: () => '203.0.113.10',
      hashIpFn: () => 'hashed-ip',
    });

    const req = new Request('http://localhost/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        first_name: 'Test',
        last_name: 'User',
        email: 'test@example.com',
        phone: '6025550101',
        service_type: 'diagnostics',
        vehicle: '2018 Toyota Camry',
        message: 'Need a diagnostic visit this week.',
      }),
    }) as NextRequest;

    const res = await handler(req);
    assert.equal(res.status, 429);
  });

  it('inserts rate-limit record and contact submission for valid request', async () => {
    const rateLimitInserts: Array<Record<string, unknown>> = [];
    const submissionInserts: Array<Record<string, unknown>> = [];

    const handler = createContactPostHandler({
      getSupabaseAdminFn: () => ({
        from: (table: string) => ({
          select: () => ({
            eq: () => ({
              gte: async () => ({ count: 0, error: null }),
            }),
          }),
          insert: async (payload: Record<string, unknown>) => {
            if (table === 'contact_rate_limits') {
              rateLimitInserts.push(payload);
            }
            if (table === 'contact_submissions') {
              submissionInserts.push(payload);
            }
            return { error: null };
          },
        }),
      }),
      getIpAddressFn: () => '203.0.113.11',
      hashIpFn: () => 'hashed-ip-2',
    });

    const req = new Request('http://localhost/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'route-test-agent',
      },
      body: JSON.stringify({
        first_name: 'Casey',
        last_name: 'Smith',
        email: 'casey@example.com',
        phone: '6025550112',
        service_type: 'oil change',
        vehicle: '2020 Honda Civic',
        message: 'Please contact me about mobile service availability.',
      }),
    }) as NextRequest;

    const res = await handler(req);
    assert.equal(res.status, 200);
    assert.equal(rateLimitInserts.length, 1);
    assert.equal(submissionInserts.length, 1);
    assert.equal(rateLimitInserts[0].ip_hash, 'hashed-ip-2');
    assert.equal(submissionInserts[0].ip_hash, 'hashed-ip-2');
    assert.equal(submissionInserts[0].user_agent, 'route-test-agent');
  });

  it('returns 500 when rate-limit count query fails', async () => {
    const handler = createContactPostHandler({
      getSupabaseAdminFn: () => ({
        from: () => ({
          select: () => ({
            eq: () => ({
              gte: async () => ({ count: null, error: { message: 'db failure' } }),
            }),
          }),
          insert: async () => ({ error: null }),
        }),
      }),
      getIpAddressFn: () => '203.0.113.12',
      hashIpFn: () => 'hashed-ip-3',
    });

    const req = new Request('http://localhost/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        first_name: 'Failure',
        last_name: 'Case',
        email: 'failure@example.com',
        phone: '6025550113',
        service_type: 'brakes',
        vehicle: '2017 Ford Focus',
        message: 'Testing failure path handling for contact endpoint.',
      }),
    }) as NextRequest;

    const res = await handler(req);
    assert.equal(res.status, 500);
  });
});

describe('create-payment-intent route', () => {
  it('returns 401 when no authenticated user is present', async () => {
    const handler = createPaymentIntentPostHandler({
      createSupabaseServerFn: (async () => ({
        auth: {
          getUser: async () => ({ data: { user: null } }),
        },
      })) as unknown as CreatePaymentIntentDeps['createSupabaseServerFn'],
      createPaymentIntentFn: async () => ({ id: 'pi_ignore', client_secret: 'secret_ignore' }),
    });

    const req = new Request('http://localhost/api/stripe/create-payment-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: 1000,
        invoice_id: 'inv_1',
        customer_email: 'payer@example.com',
        description: 'Invoice payment',
      }),
    }) as NextRequest;

    const res = await handler(req);
    assert.equal(res.status, 401);
  });

  it('returns 400 when payment amount does not match invoice total', async () => {
    const handler = createPaymentIntentPostHandler({
      createSupabaseServerFn: (async () => ({
        auth: {
          getUser: async () => ({ data: { user: { id: 'user-123' } } }),
        },
        from: (table: string) => {
          if (table === 'admins') {
            return {
              select: () => ({
                eq: () => ({
                  maybeSingle: async () => ({ data: null }),
                }),
              }),
            };
          }

          if (table === 'customers') {
            return {
              select: () => ({
                eq: () => ({
                  single: async () => ({ data: { id: 'cust-1' } }),
                }),
              }),
            };
          }

          if (table === 'invoices') {
            return {
              select: () => ({
                eq: (_field: string, value: string) => ({
                  eq: (_field2: string, value2: string) => ({
                    single: async () => {
                      if (value !== 'inv_1' || value2 !== 'cust-1') {
                        return { data: null, error: { message: 'not found' } };
                      }
                      return {
                        data: { id: 'inv_1', total: 99.99, customer_id: 'cust-1', status: 'sent' },
                        error: null,
                      };
                    },
                  }),
                  single: async () => ({
                    data: { id: 'inv_1', total: 99.99, customer_id: 'cust-1', status: 'sent' },
                    error: null,
                  }),
                }),
                update: () => ({
                  eq: async () => ({ error: null }),
                }),
              }),
              update: () => ({
                eq: async () => ({ error: null }),
              }),
            };
          }

          return {
            select: () => ({
              eq: () => ({
                single: async () => ({ data: null, error: { message: 'not found' } }),
              }),
            }),
          };
        },
      })) as unknown as CreatePaymentIntentDeps['createSupabaseServerFn'],
      createPaymentIntentFn: async () => ({ id: 'pi_should_not_create', client_secret: 'secret' }),
    });

    const req = new Request('http://localhost/api/stripe/create-payment-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: 1000,
        invoice_id: 'inv_1',
        customer_email: 'payer@example.com',
        description: 'Invoice payment',
      }),
    }) as NextRequest;

    const res = await handler(req);
    assert.equal(res.status, 400);
  });

  it('returns 403 when non-admin user has no customer profile', async () => {
    const handler = createPaymentIntentPostHandler({
      createSupabaseServerFn: (async () => ({
        auth: {
          getUser: async () => ({ data: { user: { id: 'user-no-customer' } } }),
        },
        from: (table: string) => {
          if (table === 'admins') {
            return {
              select: () => ({
                eq: () => ({
                  maybeSingle: async () => ({ data: null }),
                }),
              }),
            };
          }

          if (table === 'customers') {
            return {
              select: () => ({
                eq: () => ({
                  single: async () => ({ data: null }),
                }),
              }),
            };
          }

          return {
            select: () => ({
              eq: () => ({
                single: async () => ({ data: null, error: { message: 'not found' } }),
              }),
            }),
          };
        },
      })) as unknown as CreatePaymentIntentDeps['createSupabaseServerFn'],
      createPaymentIntentFn: async () => ({ id: 'pi_should_not_create', client_secret: 'secret' }),
    });

    const req = new Request('http://localhost/api/stripe/create-payment-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: 1000,
        invoice_id: 'inv_1',
        customer_email: 'payer@example.com',
        description: 'Invoice payment',
      }),
    }) as NextRequest;

    const res = await handler(req);
    assert.equal(res.status, 403);
  });
});

describe('admin stripe reconcile route', () => {
  it('returns admin auth error response when requireAdmin fails', async () => {
    const handler = createStripeReconcilePostHandler({
      requireAdminFn: (async () => ({
        error: NextResponse.json({ error: 'Forbidden' }, { status: 403 }),
        supabase: null,
        user: null,
      })) as unknown as typeof requireAdmin,
      logAdminAuditActionFn: async () => {},
      retrievePaymentIntentFn: async () => ({ id: 'pi_x', status: 'succeeded', amount: 1000, currency: 'usd' }),
    });

    const res = await handler();
    assert.equal(res.status, 403);
  });

  it('marks unpaid invoice as paid and logs audit on successful reconciliation', async () => {
    const paymentInserts: Array<Record<string, unknown>> = [];
    const invoiceUpdates: Array<Record<string, unknown>> = [];
    const audits: string[] = [];

    const handler = createStripeReconcilePostHandler({
      requireAdminFn: (async () => ({
        error: null,
        supabase: {
          from: (table: string) => {
            if (table === 'invoices') {
              return {
                select: () => ({
                  in: () => ({
                    not: () => ({
                      limit: async () => ({
                        data: [{ id: 'inv-10', status: 'sent', stripe_payment_id: 'pi_10' }],
                        error: null,
                      }),
                    }),
                  }),
                }),
                update: (payload: Record<string, unknown>) => ({
                  eq: () => ({
                    neq: async () => {
                      invoiceUpdates.push(payload);
                      return { error: null };
                    },
                  }),
                }),
              };
            }

            if (table === 'payments') {
              return {
                select: () => ({
                  eq: () => ({
                    maybeSingle: async () => ({ data: null }),
                  }),
                }),
                insert: async (payload: Record<string, unknown>) => {
                  paymentInserts.push(payload);
                  return { error: null };
                },
              };
            }

            return {
              select: () => ({
                in: () => ({
                  not: () => ({
                    limit: async () => ({ data: [], error: null }),
                  }),
                }),
              }),
            };
          },
        },
        user: { id: 'admin-1' },
      })) as unknown as typeof requireAdmin,
      logAdminAuditActionFn: async (_supabase, _userId, payload) => {
        audits.push(payload.action);
      },
      retrievePaymentIntentFn: async () => ({
        id: 'pi_10',
        status: 'succeeded',
        amount: 2599,
        currency: 'usd',
      }),
    });

    const res = await handler();
    assert.equal(res.status, 200);
    assert.equal(invoiceUpdates.length, 1);
    assert.equal(paymentInserts.length, 1);
    assert.equal(paymentInserts[0].stripe_payment_id, 'pi_10');
    assert.equal(paymentInserts[0].status, 'succeeded');
    assert.equal(audits.length, 1);
    assert.equal(audits[0], 'stripe.reconcile.executed');

    const body = (await res.json()) as { inspected: number; updated: number; skipped: number };
    assert.equal(body.inspected, 1);
    assert.equal(body.updated, 1);
    assert.equal(body.skipped, 0);
  });

  it('captures stripe retrieval failures as reconciliation errors', async () => {
    const handler = createStripeReconcilePostHandler({
      requireAdminFn: (async () => ({
        error: null,
        supabase: {
          from: (table: string) => {
            if (table === 'invoices') {
              return {
                select: () => ({
                  in: () => ({
                    not: () => ({
                      limit: async () => ({
                        data: [{ id: 'inv-20', status: 'sent', stripe_payment_id: 'pi_fail' }],
                        error: null,
                      }),
                    }),
                  }),
                }),
                update: () => ({
                  eq: () => ({
                    neq: async () => ({ error: null }),
                  }),
                }),
              };
            }

            if (table === 'payments') {
              return {
                select: () => ({
                  eq: () => ({
                    maybeSingle: async () => ({ data: null }),
                  }),
                }),
                insert: async () => ({ error: null }),
              };
            }

            return {
              select: () => ({
                in: () => ({
                  not: () => ({
                    limit: async () => ({ data: [], error: null }),
                  }),
                }),
              }),
            };
          },
        },
        user: { id: 'admin-2' },
      })) as unknown as typeof requireAdmin,
      logAdminAuditActionFn: async () => {},
      retrievePaymentIntentFn: async () => {
        throw new Error('Stripe request failed');
      },
    });

    const res = await handler();
    assert.equal(res.status, 200);

    const body = (await res.json()) as {
      inspected: number;
      updated: number;
      skipped: number;
      errors: Array<{ invoice_id: string; error: string }>;
    };

    assert.equal(body.inspected, 1);
    assert.equal(body.updated, 0);
    assert.equal(body.skipped, 0);
    assert.equal(body.errors.length, 1);
    assert.equal(body.errors[0].invoice_id, 'inv-20');
    assert.equal(body.errors[0].error, 'Stripe request failed');
  });
});
