import { FK_COL, KODAGEN_SCHEMA, withSchema } from '@/lib/db-scope';
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCurrentSite } from "@/lib/site-scope";
import { loadSiteConfigFromDB } from "@/lib/load-site-config";
import { getSidebarCounts } from "@/lib/admin-counts";
import DashboardView, { type DashboardData, type OrderLite } from "./dashboard-view";
import type { SiteConfig } from "@/lib/types";

const PAID_ORDER_STATES = new Set(["paid", "preparing", "ready", "processing", "shipped", "delivered", "completed"]);

function startOfDay(d = new Date()) { const x = new Date(d); x.setHours(0, 0, 0, 0); return x; }
function addDays(d: Date, n: number) { const x = new Date(d); x.setDate(x.getDate() + n); return x; }

function timeAgo(d: Date): string {
  const sec = Math.max(1, Math.round((Date.now() - d.getTime()) / 1000));
  if (sec < 60) return `${sec}s ago`;
  const min = Math.round(sec / 60);
  if (min < 60) return `${min} min ago`;
  const hr = Math.round(min / 60);
  if (hr < 24) return `${hr} hour${hr === 1 ? "" : "s"} ago`;
  const day = Math.round(hr / 24);
  if (day === 1) return "Yesterday";
  if (day < 7) return `${day} days ago`;
  const wk = Math.round(day / 7);
  return `${wk} week${wk === 1 ? "" : "s"} ago`;
}

export default async function DashboardPage() {
  const ctx = await getCurrentSite();
  if (!ctx) redirect("/admin/login");

  const supabase = await createClient();

  const today = startOfDay();
  const weekAgo = addDays(today, -7);
  const tomorrow = addDays(today, 1);

  const [
    config, counts,
    { data: inquiryRows },
    { data: orderRows }, { data: productRows }, { data: orderTxRows },
  ] = await Promise.all([
    loadSiteConfigFromDB(ctx.site?.slug ?? ""),
    getSidebarCounts(ctx.siteId),
    withSchema(supabase, KODAGEN_SCHEMA).from("inquiries")
      .select("id, name, status, created_at")
      .eq(FK_COL, ctx.siteId)
      .eq("status", "new")
      .order("created_at", { ascending: false })
      .limit(50),
    supabase.from("orders")
      .select("id, guest_name, items, total, notes, status, paid_at, created_at")
      .eq(FK_COL, ctx.siteId)
      .order("created_at", { ascending: false })
      .limit(200),
    supabase.from("products")
      .select("id, stock_quantity, in_stock, is_published")
      .eq(FK_COL, ctx.siteId)
      .limit(1000),
    supabase.from("transactions")
      .select("amount_cents, status, created_at")
      .eq(FK_COL, ctx.siteId)
      .eq("status", "succeeded")
      .order("created_at", { ascending: false })
      .limit(500),
  ]);

  type OrderRow = { id: string; guest_name: string | null; items: unknown; total: number | string; notes: string | null; status: string | null; paid_at: string | null; created_at: string };
  const orders = (orderRows ?? []) as OrderRow[];
  const mapOrder = (o: OrderRow): OrderLite => ({
    id: String(o.id),
    reference: String(o.id).slice(0, 8).toUpperCase(),
    customerName: o.guest_name || "Guest",
    totalCents: Number(o.total) || 0,
    status: o.status || "pending",
    itemCount: Array.isArray(o.items) ? o.items.length : 0,
    paid: Boolean(o.paid_at) || PAID_ORDER_STATES.has(o.status ?? ""),
    createdAt: o.created_at,
  });
  const recentOrders = orders.slice(0, 8).map(mapOrder);
  const ordersToday = orders.filter((o) => {
    const s = new Date(o.created_at);
    return s >= today && s < tomorrow;
  }).length;
  const paidOrders = orders.filter((o) => Boolean(o.paid_at) || PAID_ORDER_STATES.has(o.status ?? ""));
  const products = (productRows ?? []) as { id: string; stock_quantity: number | null; in_stock: boolean | null; is_published: boolean | null }[];
  const lowStock = products.filter((p) => p.in_stock === false || (typeof p.stock_quantity === "number" && p.stock_quantity <= 3)).length;

  type RevenueTx = { amount_cents: number | string; status: string | null; created_at: string };
  const revenueTx = ((orderTxRows ?? []) as RevenueTx[]);
  let totalRevenue = revenueTx.reduce((sum: number, t: RevenueTx) => sum + Math.round((t.amount_cents as number) / 100), 0);
  let revenueToday = revenueTx
    .filter((t: RevenueTx) => new Date(t.created_at as string) >= today && new Date(t.created_at as string) < tomorrow)
    .reduce((sum: number, t: RevenueTx) => sum + Math.round((t.amount_cents as number) / 100), 0);
  if (revenueTx.length === 0 && paidOrders.length > 0) {
    totalRevenue = paidOrders.reduce((sum, o) => sum + Math.round((Number(o.total) || 0) / 100), 0);
    revenueToday = paidOrders
      .filter((o) => { const s = new Date(o.paid_at ?? o.created_at); return s >= today && s < tomorrow; })
      .reduce((sum, o) => sum + Math.round((Number(o.total) || 0) / 100), 0);
  }

  const bookings7d: number[] = new Array(7).fill(0);
  const revenue7d: number[] = new Array(7).fill(0);
  for (const b of orders) {
    const s = new Date(b.created_at);
    const dayIndex = Math.floor((s.getTime() - weekAgo.getTime()) / 86_400_000);
    if (dayIndex >= 0 && dayIndex < 7) {
      bookings7d[dayIndex] += 1;
    }
  }
  for (const t of revenueTx) {
    const s = new Date(t.created_at as string);
    const dayIndex = Math.floor((s.getTime() - weekAgo.getTime()) / 86_400_000);
    if (dayIndex >= 0 && dayIndex < 7) {
      revenue7d[dayIndex] += Math.round((t.amount_cents as number) / 100);
    }
  }

  const newInquiryCount = (inquiryRows ?? []).length;

  const activityFeed = recentOrders.slice(0, 10).map((o) => {
    const colorByStatus: Record<string, string> = {
      pending: "#f59e0b", paid: "#22c55e", preparing: "#3b82f6", processing: "#3b82f6",
      ready: "#a855f7", shipped: "#a855f7", delivered: "#64748b", completed: "#64748b", cancelled: "#ef4444",
    };
    const verb = o.status === "cancelled" ? "cancelled order"
      : o.paid ? "paid for order" : "placed order";
    return {
      text: `${o.customerName} ${verb} ${o.reference} (${o.itemCount} item${o.itemCount === 1 ? "" : "s"})`,
      time: timeAgo(new Date(o.createdAt)),
      color: colorByStatus[o.status] ?? "#64748b",
    };
  });

  const data: DashboardData = {
    mode: "catalog",
    recentBookings: [],
    currentGuests: [],
    recentOrders,
    newInquiries: [],
    stats: {
      totalRevenue,
      revenueToday,
      bookingsToday: ordersToday,
      pageViews: 0,
      newInquiries: newInquiryCount,
      conversionRate: 0,
      paidOrders: paidOrders.length,
      productCount: products.length,
      lowStock,
    },
    charts: {
      revenue7d,
      bookings7d,
      pageViews7d: new Array(7).fill(0),
      inquiries7d: new Array(7).fill(0),
    },
    activityFeed,
  };

  return <DashboardView data={data} config={config as SiteConfig} counts={counts} />;
}
