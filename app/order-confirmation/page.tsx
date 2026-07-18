"use client";

/**
 * OrderConfirmation
 * Post-checkout thank-you page. Reads `?id={orderId}` from the URL, fetches
 * the order from /api/orders?id=..., and shows the customer a summary
 * with their reference number.
 *
 * Restyle Tailwind classes to match the brand voice.
 *
 * Drop this into app/order-confirmation/page.tsx.
 */

import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Check, Mail } from 'lucide-react';

export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={null}>
      <OrderConfirmation />
    </Suspense>
  );
}

type OrderSummary = {
  id: string;
  status: 'placed' | 'paid' | 'pending';
  customer: { full_name: string; email: string };
  items: { name: string; quantity: number; variant?: string }[];
  subtotal_cents: number;
  currency: string;
};

function OrderConfirmation() {
  const params = useSearchParams();
  const orderId = params?.get('id') ?? '';

  const [order, setOrder] = useState<OrderSummary | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!orderId) {
      setError('No order reference provided.');
      return;
    }
    let cancelled = false;

    // localStorage cache first — survives serverless cold-starts when the
    // backend isn't wired to Supabase yet. Falls through to the server
    // fetch when the cache miss (e.g. deep-link from an email).
    try {
      const cached = window.localStorage.getItem(`kodagen-order:${orderId}`);
      if (cached) {
        setOrder(JSON.parse(cached));
        return;
      }
    } catch { /* private mode — fall through to fetch */ }

    (async () => {
      try {
        const res = await fetch(`/api/orders?id=${encodeURIComponent(orderId)}`);
        if (!res.ok) throw new Error('Order not found');
        const data = await res.json();
        if (!cancelled) setOrder(data.order ?? null);
      } catch (err: any) {
        if (!cancelled) setError(err?.message ?? 'Could not load the order.');
      }
    })();
    return () => { cancelled = true; };
  }, [orderId]);

  const isPending = order?.status === 'pending';

  return (
    <main className="min-h-screen bg-[var(--color-bg,#141416)] flex items-center justify-center py-16">
      <div className="container mx-auto px-6 lg:px-12 max-w-xl text-center">
        <div className="w-16 h-16 mx-auto rounded-full bg-[color-mix(in_srgb,var(--color-primary,#c9a876)_10%,transparent)] flex items-center justify-center mb-8">
          {isPending ? (
            <Mail size={24} className="text-[var(--color-primary,#c9a876)]" />
          ) : (
            <Check size={24} className="text-[var(--color-primary,#c9a876)]" />
          )}
        </div>

        <h1 className="font-display font-light text-[var(--color-text,#f4f4f5)] text-3xl lg:text-4xl mb-4">
          {isPending ? 'We received your order.' : 'Thank you.'}
        </h1>

        <p className="text-[var(--color-text-secondary,rgba(244,244,245,0.65))] leading-relaxed mb-8">
          {isPending
            ? "We have your details and will be in touch shortly to arrange payment and delivery."
            : "Your order is on the way. A confirmation has been sent to your email."}
        </p>

        {orderId && (
          <p className="text-xs uppercase tracking-widest text-[var(--color-text-secondary,rgba(244,244,245,0.65))] mb-6">
            Reference: <span className="text-[var(--color-text,#f4f4f5)] tabular-nums">{orderId.slice(0, 8).toUpperCase()}</span>
          </p>
        )}

        {error && (
          <p className="text-sm text-red-700 bg-red-50 border border-red-100 px-4 py-3 rounded-sm mb-6">
            {error}
          </p>
        )}

        {order && order.items.length > 0 && (
          <div className="bg-[rgba(255,255,255,0.06)] rounded-sm px-6 py-5 text-left mb-8">
            <p className="text-xs uppercase tracking-widest text-[var(--color-text-secondary,rgba(244,244,245,0.65))] mb-3">Your order</p>
            <ul className="space-y-2">
              {order.items.map((i, idx) => (
                <li key={idx} className="flex justify-between text-sm">
                  <span className="text-[var(--color-text,#f4f4f5)]">
                    {i.name}{i.variant ? <span className="text-[var(--color-text-secondary,rgba(244,244,245,0.65))]"> · {i.variant}</span> : null}
                  </span>
                  <span className="text-[var(--color-text-secondary,rgba(244,244,245,0.65))]">×{i.quantity}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/shop"
            className="inline-block bg-[var(--color-primary,#c9a876)] text-[var(--color-bg,#141416)] px-8 py-3.5 rounded-sm text-sm font-medium tracking-wide hover:brightness-110 transition-colors"
          >
            Continue browsing
          </Link>
          <Link
            href="/"
            className="inline-block text-sm text-[var(--color-text-secondary,rgba(244,244,245,0.65))] hover:text-[var(--color-text,#f4f4f5)] py-3.5 px-2 transition-colors"
          >
            Back to home
          </Link>
        </div>
      </div>
    </main>
  );
}
