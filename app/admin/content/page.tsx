import { FK_COL, KODAGEN_SCHEMA, withSchema } from '@/lib/db-scope';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getCurrentSite } from '@/lib/site-scope';
import ContentHubView from './content-hub-view';

/**
 * /admin/content — Content Hub
 *
 * Entry point for content management. Cards link to each editable area with
 * a last-updated stamp, computed server-side (no client API round-trip).
 * Everything here writes to the site_* tables that lib/site-content.ts reads,
 * so edits show up on the public site.
 */

export const revalidate = 0;

async function latest(q: PromiseLike<{ data: Array<{ updated_at?: string | null }> | null }>): Promise<string | undefined> {
  try {
    const { data } = await q;
    return data?.[0]?.updated_at ?? undefined;
  } catch {
    return undefined;
  }
}

export default async function ContentHubPage() {
  const ctx = await getCurrentSite();
  if (!ctx) redirect('/admin/login');

  const supabase = await createClient();
  // site_pages / site_social_links / site_copy_overrides live in the kodagen
  // schema on shared DB2 — a bare public-schema read errors and the stamp
  // silently drops.
  const pick = (table: string) =>
    latest(withSchema(supabase, KODAGEN_SCHEMA).from(table).select('updated_at').eq(FK_COL, ctx.siteId).order('updated_at', { ascending: false }).limit(1));

  const [settingsAt, pagesAt, locationsAt, socialAt, copyAt] = await Promise.all([
    latest(withSchema(supabase, KODAGEN_SCHEMA).from('site_settings').select('updated_at').eq(FK_COL, ctx.siteId).limit(1)),
    pick('site_pages'),
    pick('site_locations'),
    pick('site_social_links'),
    pick('site_copy_overrides'),
  ]);

  // Area titles/blurbs/links live in components/admin/content-editor.tsx
  // (CONTENT_AREAS) — the hub only supplies the last-updated stamps, keyed
  // by area key.
  return (
    <ContentHubView
      stamps={{
        settings: settingsAt,
        pages: pagesAt,
        locations: locationsAt,
        social: socialAt,
        copy: copyAt,
      }}
    />
  );
}
