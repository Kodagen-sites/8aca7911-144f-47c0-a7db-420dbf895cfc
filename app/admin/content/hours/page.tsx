import { FK_COL } from '@/lib/db-scope';
import { createClient } from '@/lib/supabase/server';
import { getCurrentSite } from '@/lib/site-scope';
import { redirect } from 'next/navigation';
import HoursView, { type HoursLocation } from './hours-view';

/**
 * /admin/content/hours — hours of operation per location per day
 *
 * For each location: 7 rows (Sun-Sat) with open/close times or "closed" toggle.
 * Bulk actions: "Same hours all weekdays", "Closed all weekend".
 */

export default async function HoursPage() {
  const ctx = await getCurrentSite();
  if (!ctx) redirect('/admin/login');

  const supabase = await createClient();

  const { data: locations } = await supabase
    .from('site_locations')
    .select('id, slug, display_name, hours:site_hours(*)')
    .eq(FK_COL, ctx.siteId)
    .eq('is_active', true)
    .order('display_order');

  return <HoursView locations={(locations ?? []) as unknown as HoursLocation[]} siteId={ctx.siteId} />;
}
