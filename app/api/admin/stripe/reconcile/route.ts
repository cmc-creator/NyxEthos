import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { requireAdmin } from '@/app/api/admin/_lib/auth';
import { logAdminAuditAction } from '@/app/api/admin/_lib/audit';

function getStripe() {
	return new Stripe(process.env.STRIPE_SECRET_KEY!, {
		apiVersion: '2026-04-22.dahlia',
	});
}

type ReconcileDeps = {
	requireAdminFn: typeof requireAdmin;
	logAdminAuditActionFn: typeof logAdminAuditAction;
	retrievePaymentIntentFn: (id: string) => Promise<{ id: string; status: string; amount: number; currency: string }>;
};

export function createPostHandler(
	deps: ReconcileDeps = {
		requireAdminFn: requireAdmin,
		logAdminAuditActionFn: logAdminAuditAction,
		retrievePaymentIntentFn: async (id: string) => {
			const stripe = getStripe();
			const intent = await stripe.paymentIntents.retrieve(id);
			return {
				id: intent.id,
				status: intent.status,
				amount: intent.amount,
				currency: intent.currency,
			};
		},
	}
) {
	return async function POST() {
		const { error, supabase, user } = await deps.requireAdminFn();
		if (error) {
			return error;
		}

		const { data: invoices, error: invoicesError } = await supabase
			.from('invoices')
			.select('id, status, stripe_payment_id')
			.in('status', ['draft', 'sent', 'overdue'])
			.not('stripe_payment_id', 'is', null)
			.limit(200);

		if (invoicesError) {
			return NextResponse.json({ error: 'Failed to load invoices for reconciliation' }, { status: 500 });
		}

		let inspected = 0;
		let updated = 0;
		let skipped = 0;
		const errors: Array<{ invoice_id: string; error: string }> = [];

		for (const inv of invoices || []) {
			inspected += 1;

			try {
				const paymentIntent = await deps.retrievePaymentIntentFn(inv.stripe_payment_id as string);
				if (paymentIntent.status !== 'succeeded') {
					skipped += 1;
					continue;
				}

				const { error: invoiceUpdateError } = await supabase
					.from('invoices')
					.update({
						status: 'paid',
						paid_at: new Date().toISOString(),
					})
					.eq('id', inv.id)
					.neq('status', 'paid');

				if (invoiceUpdateError) {
					errors.push({ invoice_id: inv.id, error: 'Failed to update invoice status' });
					continue;
				}

				const { data: existingPayment } = await supabase
					.from('payments')
					.select('id')
					.eq('stripe_payment_id', paymentIntent.id)
					.maybeSingle();

				if (!existingPayment) {
					await supabase.from('payments').insert({
						invoice_id: inv.id,
						amount: paymentIntent.amount / 100,
						currency: paymentIntent.currency,
						stripe_payment_id: paymentIntent.id,
						status: 'succeeded',
					});
				}

				updated += 1;
			} catch (err) {
				errors.push({
					invoice_id: inv.id,
					error: err instanceof Error ? err.message : 'Unknown reconciliation error',
				});
			}
		}

		if (user?.id) {
			await deps.logAdminAuditActionFn(supabase as unknown as Parameters<typeof logAdminAuditAction>[0], user.id, {
				action: 'stripe.reconcile.executed',
				entityType: 'stripe',
				entityId: 'reconcile',
				metadata: {
					inspected,
					updated,
					skipped,
					errors: errors.length,
				},
			});
		}

		return NextResponse.json({
			success: true,
			inspected,
			updated,
			skipped,
			errors,
		});
	};
}

export const POST = createPostHandler();
