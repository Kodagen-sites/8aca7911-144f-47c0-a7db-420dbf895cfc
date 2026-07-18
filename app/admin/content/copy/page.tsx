import { FK_COL, KODAGEN_SCHEMA, withSchema } from '@/lib/db-scope';
import { createClient } from '@/lib/supabase/server';
import { getCurrentSite } from '@/lib/site-scope';
import { redirect } from 'next/navigation';
import CopyListView, { type CopyFieldItem } from './copy-list-view';

/**
 * /admin/content/copy — Voice & Copy Editor List
 * 
 * Lists all voice-sensitive copy fields with their current values.
 * Each field has "Edit with AI" button → opens AI chat panel.
 * 
 * The AI chat enforces voice-banks rules so owner can't accidentally
 * write claim-word copy that breaks voice discipline.
 */

const COPY_FIELDS = [
  {
    key: 'hero.headline',
    label: 'Hero headline',
    description: 'The main headline on your homepage. Should embody your voice.',
    location: 'Homepage hero',
  },
  {
    key: 'hero.subhead',
    label: 'Hero subhead',
    description: 'The supporting line under your hero headline.',
    location: 'Homepage hero',
  },
  {
    key: 'about.narrative',
    label: 'About narrative',
    description: 'Your brand story. 3-5 sentences in your voice.',
    location: 'About page',
  },
  {
    key: 'footer.statement',
    label: 'Footer brand statement',
    description: 'The closing line at the bottom of every page.',
    location: 'Footer',
  },
  {
    key: 'cta.primary',
    label: 'Primary CTA copy',
    description: 'The call-to-action that closes your homepage.',
    location: 'Homepage CTA section',
  },
];

export default async function CopyEditorListPage() {
  const ctx = await getCurrentSite();
  if (!ctx) redirect('/admin/login');
  
  const supabase = await createClient();
  
  const [{ data: settings }, { data: overrides }] = await Promise.all([
    withSchema(supabase, KODAGEN_SCHEMA).from('site_settings').select('voice_family,hero_headline,hero_subhead,brand_narrative,footer_statement').eq(FK_COL, ctx.siteId).single(),
    withSchema(supabase, KODAGEN_SCHEMA).from('site_copy_overrides').select('copy_key,copy_value,updated_at').eq(FK_COL, ctx.siteId),
  ]);
  
  // Explicit param type: older generated scaffolds leave these rows untyped
  // and compile with noImplicitAny — an inferred `o` breaks their build.
  const overridesMap = new Map<string, { value: string | null; updated: string | null }>(
    (overrides ?? []).map((o: Record<string, unknown>) => [
      String(o.copy_key),
      { value: (o.copy_value ?? null) as string | null, updated: (o.updated_at ?? null) as string | null },
    ])
  );
  
  // Resolve current values: overrides → settings cache → null
  const resolved = COPY_FIELDS.map(field => {
    const override = overridesMap.get(field.key);
    let currentValue: string | null = null;
    let updatedAt: string | null = null;
    
    if (override) {
      currentValue = override.value;
      updatedAt = override.updated;
    } else {
      // Fall back to cached value in site_settings
      if (field.key === 'hero.headline') currentValue = settings?.hero_headline ?? null;
      else if (field.key === 'hero.subhead') currentValue = settings?.hero_subhead ?? null;
      else if (field.key === 'about.narrative') currentValue = settings?.brand_narrative ?? null;
      else if (field.key === 'footer.statement') currentValue = settings?.footer_statement ?? null;
    }
    
    return {
      ...field,
      currentValue,
      updatedAt,
      isOverridden: !!override,
    };
  });

  return (
    <CopyListView
      items={resolved as CopyFieldItem[]}
      voiceFamily={settings?.voice_family ?? 'V1 Heritage Understated'}
    />
  );
}
