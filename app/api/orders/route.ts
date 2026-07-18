/**
 * /api/orders — Next.js 16 App Router route handler.
 *
 * Drop this into app/api/orders/route.ts.
 *
 * POST  /api/orders            place an order
 * GET   /api/orders?id=...     fetch an order by id (used by the
 *                              order-confirmation page to show the summary)
 *
 * Persistence (three tiers — graceful degradation, no broken UX):
 *   1. SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY set → row written to
 *      `customer_orders` table (see the SQL migration that ships next to
 *      this file). Production path. Persists across deploys, surfaces in
 *      tenant-admin, retrievable by deep-link.
 *   2. Keys absent → in-memory Map on this server instance. Good for
 *      local dev. On Vercel/serverless this can split across function
 *      instances (POST writes to instance A, GET hits instance B and
 *      404s), which is why the client also caches in localStorage.
 *   3. Client-side localStorage cache (set in Checkout.tsx after POST,
 *      read first in OrderConfirmation.tsx) — guarantees the confirmation
 *      page works in mock mode regardless of where the GET lands.
 *
 * Result: the order flow works end-to-end on a fresh deploy with zero
 * backend wiring (landing-page demo). Connect Supabase later → the same
 * code path lights up persistence + admin visibility without any change.
 *
 * Restyle / rename nothing in the response shape — Checkout.tsx and
 * OrderConfirmation.tsx read these exact fields.
 */

import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";

type OrderItem = {
  product_id: string;
  name: string;
  price_cents: number;
  quantity: number;
  variant?: string;
  image_url?: string;
};

type OrderPayload = {
  slug: string;
  currency: string;
  items: OrderItem[];
  customer: {
    full_name: string;
    email: string;
    phone?: string;
    address?: {
      line1?: string;
      city?: string;
      postcode?: string;
      country?: string;
    };
  };
  subtotal_cents: number;
};

type StoredOrder = OrderPayload & {
  id: string;
  status: "placed" | "paid" | "pending";
  created_at: string;
};

// In-memory fallback when Supabase isn't configured. Scoped to the server
// instance — fine for previews; production should always have Supabase.
const memoryStore = new Map<string, StoredOrder>();

function getSupabaseAdmin(): { url: string; key: string } | null {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return { url, key };
}

async function insertOrder(order: StoredOrder): Promise<void> {
  const supa = getSupabaseAdmin();
  if (!supa) {
    memoryStore.set(order.id, order);
    return;
  }
  const res = await fetch(`${supa.url}/rest/v1/customer_orders`, {
    method: "POST",
    headers: {
      apikey: supa.key,
      Authorization: `Bearer ${supa.key}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify({
      id: order.id,
      slug: order.slug,
      status: order.status,
      currency: order.currency,
      items: order.items,
      customer: order.customer,
      subtotal_cents: order.subtotal_cents,
      created_at: order.created_at,
    }),
  });
  if (!res.ok) {
    // Fall back to memory so the customer still sees a confirmation page.
    memoryStore.set(order.id, order);
  }
}

async function fetchOrder(id: string): Promise<StoredOrder | null> {
  const supa = getSupabaseAdmin();
  if (!supa) return memoryStore.get(id) ?? null;
  const res = await fetch(
    `${supa.url}/rest/v1/customer_orders?id=eq.${encodeURIComponent(id)}&select=*`,
    {
      headers: {
        apikey: supa.key,
        Authorization: `Bearer ${supa.key}`,
      },
    },
  );
  if (!res.ok) return memoryStore.get(id) ?? null;
  const rows = (await res.json()) as StoredOrder[];
  return rows[0] ?? memoryStore.get(id) ?? null;
}

export async function POST(req: Request) {
  let body: OrderPayload;
  try {
    body = (await req.json()) as OrderPayload;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  if (!body?.items?.length) {
    return NextResponse.json({ ok: false, error: "Cart is empty" }, { status: 400 });
  }
  if (!body?.customer?.email) {
    return NextResponse.json({ ok: false, error: "Customer email required" }, { status: 400 });
  }

  const order: StoredOrder = {
    id: randomUUID(),
    status: "placed",
    created_at: new Date().toISOString(),
    ...body,
  };

  await insertOrder(order);

  return NextResponse.json({ ok: true, orderId: order.id });
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  if (!id) {
    return NextResponse.json({ ok: false, error: "Missing id" }, { status: 400 });
  }
  const order = await fetchOrder(id);
  if (!order) {
    return NextResponse.json({ ok: false, error: "Order not found" }, { status: 404 });
  }
  return NextResponse.json({ ok: true, order });
}
