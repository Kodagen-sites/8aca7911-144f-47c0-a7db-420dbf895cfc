import { FK_COL } from '@/lib/db-scope';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getCurrentSite } from '@/lib/site-scope';
import SocialView, { type SocialLink } from './social-view';

/**
 * /admin/content/social — social profile links shown on the public site
 * (footer / contact). Reads and writes site_social_links, which
 * lib/site-content.ts serves to the public pages.
 */

export const revalidate = 0;

export default async function SocialPage() {
  const ctx = await getCurrentSite();
  if (!ctx) redirect('/admin/login');

  const supabase = await createClient();
  const { data } = await supabase
    .from('site_social_links')
    .select('id, platform, url, display_label, display_order, is_active')
    .eq(FK_COL, ctx.siteId)
    .order('display_order');

  type Row = {
    id: string;
    platform: string;
    url: string;
    display_label: string | null;
    display_order: number | null;
    is_active: boolean | null;
  };
  const links: SocialLink[] = ((data ?? []) as Row[]).map((r) => ({
    id: r.id as string,
    platform: r.platform as string,
    url: r.url as string,
    displayLabel: (r.display_label as string | null) ?? "",
    active: Boolean(r.is_active),
  }));

  return <SocialView links={links} />;
}
