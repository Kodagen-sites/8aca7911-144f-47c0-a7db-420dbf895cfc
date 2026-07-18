import { KODAGEN_SCHEMA, withSchema } from "@/lib/db-scope";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCurrentSite } from "@/lib/site-scope";
import SectionsView from "./sections-view";

/**
 * /admin/content/sections — the whole-site text editor.
 *
 * Renders an editable field for EVERY string in every section of the site's
 * config (hero, story, about, legal, footer… whatever shape this build
 * invented), grouped by section. Save stores to the DB; Publish (header
 * button) regenerates the live site's config file.
 *
 * The admin chrome (sidebar/header) comes from ../layout.tsx — never wrap
 * views in AdminShell here or the sidebar renders twice.
 */
export default async function SectionsPage() {
  const ctx = await getCurrentSite();
  if (!ctx) redirect("/admin/login");

  const supabase = await createClient();
  const { data } = await withSchema(supabase, KODAGEN_SCHEMA)
    .from("sites").select("config").eq("id", ctx.siteId).single();

  return <SectionsView config={(data?.config ?? {}) as Record<string, unknown>} />;
}
