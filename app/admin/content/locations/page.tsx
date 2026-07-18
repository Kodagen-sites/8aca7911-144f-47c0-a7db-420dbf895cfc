import { FK_COL } from '@/lib/db-scope';
import { createClient } from '@/lib/supabase/server';
import { getCurrentSite } from '@/lib/site-scope';
import { redirect } from 'next/navigation';
import LocationsView, { type LocationRow } from './locations-view';

/**
 * /admin/content/locations — list + manage locations
 *
 * Lists all site_locations rows. Click a location to edit.
 * Add new location → /admin/content/locations/new
 * Edit existing → /admin/content/locations/[location_id]
 */

export default async function LocationsListPage() {
  const ctx = await getCurrentSite();
  if (!ctx) redirect('/admin/login');

  const supabase = await createClient();

  const { data: locations } = await supabase
    .from('site_locations')
    .select('*')
    .eq(FK_COL, ctx.siteId)
    .order('display_order');

  return <LocationsView locations={(locations ?? []) as LocationRow[]} />;
}
