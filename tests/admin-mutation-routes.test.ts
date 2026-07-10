import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import type { NextRequest } from 'next/server';
import { createPatchHandler as createJobPatchHandler } from '@/app/api/admin/jobs/[id]/route';
import { createPatchHandler as createInvoicePatchHandler } from '@/app/api/admin/invoices/[id]/route';
import { requireAdmin } from '@/app/api/admin/_lib/auth';

describe('admin mutation route handlers', () => {
  it('job status PATCH returns 400 for invalid payload', async () => {
    const handler = createJobPatchHandler({
      requireAdminFn: (async () => ({
        error: null,
        supabase: {
          from: () => ({
            update: () => ({
              eq: async () => ({ error: null }),
            }),
          }),
        },
        user: { id: 'user-1' },
      })) as unknown as typeof requireAdmin,
      logAdminAuditActionFn: async () => {},
    });

    const req = new Request('http://localhost/api/admin/jobs/job-1', {
      method: 'PATCH',
      body: JSON.stringify({ status: 'not-valid' }),
      headers: { 'Content-Type': 'application/json' },
    }) as NextRequest;

    const res = await handler(req, { params: Promise.resolve({ id: 'job-1' }) });
    assert.equal(res.status, 400);
  });

  it('job status PATCH updates booking and writes audit log', async () => {
    const updates: Array<{ status: string; id?: string }> = [];
    const audits: Array<{ action: string; entityId: string }> = [];

    const handler = createJobPatchHandler({
      requireAdminFn: (async () => ({
        error: null,
        supabase: {
          from: () => ({
            update: (payload: { status: string }) => ({
              eq: async (_field: string, id: string) => {
                updates.push({ status: payload.status, id });
                return { error: null };
              },
            }),
          }),
        },
        user: { id: 'admin-1' },
      })) as unknown as typeof requireAdmin,
      logAdminAuditActionFn: async (_supabase, _userId, payload) => {
        audits.push({ action: payload.action, entityId: payload.entityId });
      },
    });

    const req = new Request('http://localhost/api/admin/jobs/job-2', {
      method: 'PATCH',
      body: JSON.stringify({ status: 'completed' }),
      headers: { 'Content-Type': 'application/json' },
    }) as NextRequest;

    const res = await handler(req, { params: Promise.resolve({ id: 'job-2' }) });
    assert.equal(res.status, 200);
    assert.equal(updates.length, 1);
    assert.equal(updates[0].status, 'completed');
    assert.equal(updates[0].id, 'job-2');
    assert.equal(audits.length, 1);
    assert.equal(audits[0].action, 'booking.status.updated');
    assert.equal(audits[0].entityId, 'job-2');
  });

  it('invoice status PATCH sets paid status and writes audit log', async () => {
    const updates: Array<{ status: string; paid_at?: string | null; id?: string }> = [];
    const audits: Array<{ action: string; entityId: string }> = [];

    const handler = createInvoicePatchHandler({
      requireAdminFn: (async () => ({
        error: null,
        supabase: {
          from: () => ({
            update: (payload: { status: string; paid_at?: string | null }) => ({
              eq: async (_field: string, id: string) => {
                updates.push({ ...payload, id });
                return { error: null };
              },
            }),
          }),
        },
        user: { id: 'admin-2' },
      })) as unknown as typeof requireAdmin,
      logAdminAuditActionFn: async (_supabase, _userId, payload) => {
        audits.push({ action: payload.action, entityId: payload.entityId });
      },
    });

    const req = new Request('http://localhost/api/admin/invoices/inv-1', {
      method: 'PATCH',
      body: JSON.stringify({ status: 'paid' }),
      headers: { 'Content-Type': 'application/json' },
    }) as NextRequest;

    const res = await handler(req, { params: Promise.resolve({ id: 'inv-1' }) });
    assert.equal(res.status, 200);
    assert.equal(updates.length, 1);
    assert.equal(updates[0].status, 'paid');
    assert.ok(typeof updates[0].paid_at === 'string');
    assert.equal(updates[0].id, 'inv-1');
    assert.equal(audits.length, 1);
    assert.equal(audits[0].action, 'invoice.status.updated');
    assert.equal(audits[0].entityId, 'inv-1');
  });
});
