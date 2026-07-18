"use server";
// Publish: the missing link between the admin CMS and the live site.
//
// The public site renders from the static content/site-config.ts baked at
// build time, while every admin edit (settings, content hub, catalog) lands
// in the DB — so saves "worked" but the site never changed (owner report
// 2026-07-15). Publishing regenerates content/site-config.ts from the DB
// state; on preview machines `next dev` hot-reloads it within seconds. On a
// read-only filesystem (Vercel) we fail with a clear "redeploy" message —
// the deployed site picks the file up on the next deploy.
import { KODAGEN_SCHEMA, withSchema } from "@/lib/db-scope";
// updateTag (Next 16): server-action tag expiry with read-your-own-writes —
// the 1-arg revalidateTag of Next 15 is gone (16 needs a profile 2nd arg).
import { revalidatePath, updateTag } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getCurrentSite } from "@/lib/site-scope";
import { hasPermission } from "@/lib/audit";
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";

// Plain shape (not a discriminated union): generated apps compile with
// strictNullChecks:false, where TS won't narrow `ok ? ... : ...` branches.
export type PublishResult = { ok: boolean; message?: string; error?: string };

const CONFIG_PATH = "content/site-config.ts";

// Slice one `export type X = …;` / `export interface X { … }` declaration out
// of the source, starting at `start`. Walks brace/bracket/paren depth while
// skipping strings, template literals and comments; returns null when the
// scan runs off the end of the file (malformed or a shape we don't understand
// — the caller then refuses the publish rather than emit a broken file).
function sliceTypeDeclaration(src: string, start: number, kind: string): string | null {
  let i: number = start;
  let depth: number = 0;
  let started: boolean = kind === "type"; // type aliases end at `;` depth 0; interfaces need their `{` first
  while (i < src.length) {
    const ch: string = src[i];
    const two: string = src.slice(i, i + 2);
    if (two === "//") { const nl: number = src.indexOf("\n", i); if (nl === -1) return null; i = nl + 1; continue; }
    if (two === "/*") { const end: number = src.indexOf("*/", i + 2); if (end === -1) return null; i = end + 2; continue; }
    if (ch === '"' || ch === "'" || ch === "`") {
      const quote: string = ch;
      i++;
      while (i < src.length && src[i] !== quote) { if (src[i] === "\\") i++; i++; }
      if (i >= src.length) return null;
      i++; continue;
    }
    if (ch === "{" || ch === "[" || ch === "(") { depth++; started = true; i++; continue; }
    if (ch === "}" || ch === "]" || ch === ")") {
      depth--;
      if (kind === "interface" && started && depth === 0) return src.slice(start, i + 1);
      i++; continue;
    }
    if (ch === ";" && depth === 0 && started) return src.slice(start, i + 1);
    i++;
  }
  return null;
}

// Classify the current file's exports. Type-level exports are safe to carry
// into the regenerated file verbatim (they're compile-time only, and aliases
// like `type SiteConfig = typeof siteConfig` re-bind to the new const);
// runtime exports other than the config itself we refuse to clobber.
function scanExports(src: string): { typeBlocks: string[]; runtimeForeign: string[] } | null {
  const typeBlocks: string[] = [];
  const runtimeForeign: string[] = [];
  const re = /^export\s+(const|default|function|class|let|var|type|interface|async|enum)\s+(\w*)/gm;
  let m: RegExpExecArray | null = null;
  while ((m = re.exec(src))) {
    const kind: string = m[1];
    const name: string = m[2] || "(unnamed)";
    if (kind === "type" || kind === "interface") {
      const block: string | null = sliceTypeDeclaration(src, m.index, kind);
      if (!block) return null;
      typeBlocks.push(block);
    } else if (kind === "default") {
      continue; // the config's own default export — regenerated below
    } else if ((kind === "const" || kind === "let" || kind === "var") && name === "siteConfig") {
      continue; // the config itself — regenerated below
    } else {
      runtimeForeign.push(name === "(unnamed)" ? kind : name);
    }
  }
  return { typeBlocks, runtimeForeign };
}

export async function publishToSite(): Promise<PublishResult> {
  const ctx = await getCurrentSite();
  if (!ctx) return { ok: false, error: "Not signed in." };
  if (!hasPermission(ctx.role, "content.edit", ctx.permissions)) {
    return { ok: false, error: "You don't have permission to publish." };
  }

  // Dynamic-content lane (KODAGEN_CONTENT_MODE=dynamic, stamped at provision
  // for new builds): public pages render through the tag-cached getSiteContent
  // loader, so publishing is just a cache invalidation — no file regeneration,
  // no bundle rebuild, identical on preview machines and Vercel. Runtime env
  // lookup on purpose: NODE_ENV/NEXT_PUBLIC_* get inlined at build time
  // (see the --debug-prerender lesson below).
  if (process.env.KODAGEN_CONTENT_MODE === "dynamic") {
    updateTag("site-config");
    revalidatePath("/", "layout");
    revalidatePath("/admin", "layout");
    return { ok: true, message: "Published — the live site refreshes in a few seconds." };
  }

  const supabase = await createClient();
  const { data: site, error } = await withSchema(supabase, KODAGEN_SCHEMA)
    .from("sites")
    .select("name, config")
    .eq("id", ctx.siteId)
    .single();
  if (error) return { ok: false, error: error.message };

  const config = { ...((site?.config ?? {}) as Record<string, unknown>) };
  if (Object.keys(config).length === 0) {
    return { ok: false, error: "No site content to publish yet." };
  }

  // Overlay live catalog text onto config.products (matched by slug) so
  // product edits in the admin publish too. Unknown/bespoke keys on each
  // product are preserved; only the universal fields are overlaid. Products
  // added in the admin that the built design has never seen are appended
  // with the universal shape.
  try {
    const { data: rows } = await supabase
      .from("products")
      .select("slug, name, description, price_cents, currency, image_url, is_published")
      .eq("site_id", ctx.siteId)
      .order("sort_order");
    if (Array.isArray(rows) && rows.length > 0) {
      const bySlug = new Map(rows.map((r) => [String(r.slug), r]));
      const existing = Array.isArray(config.products)
        ? (config.products as Array<Record<string, unknown>>)
        : [];
      const seen = new Set<string>();
      const merged = existing
        .map((p) => {
          const slug = String(p.slug ?? "");
          const row = bySlug.get(slug);
          if (!row) return p; // not managed in the admin — leave untouched
          seen.add(slug);
          if (row.is_published === false) return null; // unpublished → off the site
          return {
            ...p,
            name: row.name ?? p.name,
            description: row.description ?? p.description,
            price: typeof row.price_cents === "number" ? row.price_cents / 100 : p.price,
            ...(row.currency ? { currency: row.currency } : {}),
            ...(row.image_url ? { imageUrl: row.image_url } : {}),
          };
        })
        .filter(Boolean) as Array<Record<string, unknown>>;
      for (const [slug, row] of bySlug) {
        if (seen.has(slug) || row.is_published === false) continue;
        merged.push({
          slug,
          name: row.name,
          description: row.description ?? "",
          price: typeof row.price_cents === "number" ? row.price_cents / 100 : 0,
          currency: row.currency ?? undefined,
          imageUrl: row.image_url ?? "",
        });
      }
      config.products = merged;
    }
  } catch { /* catalog overlay is best-effort — publish the config as-is */ }

  // Brand-name overlay: the admin's rename writes sites.name (+ the flat
  // universal config.businessName), but each generated design keeps its
  // display name wherever ITS schema put it (company.name, brand.name, …) —
  // without this, a rename publishes cleanly yet never reaches the key the
  // site actually reads (owner report 2026-07-16). Overwrite only string
  // paths that already exist — never invent keys a design won't read.
  if (typeof site?.name === "string" && site.name.trim()) {
    const newName = site.name.trim();
    const namePaths = [
      ["businessName"],
      ["siteName"],
      ["company", "name"],
      ["brand", "name"],
      ["business", "name"],
    ];
    for (const path of namePaths) {
      let parent: Record<string, unknown> | null = config;
      for (let i = 0; i < path.length - 1 && parent; i++) {
        // Explicit annotation: without it older TS versions flag `next` as
        // circularly inferred through the loop-carried `parent` (Eko build).
        const next: unknown = parent[path[i]];
        parent = next && typeof next === "object" && !Array.isArray(next)
          ? (next as Record<string, unknown>)
          : null;
      }
      const leaf = path[path.length - 1];
      if (parent && typeof parent[leaf] === "string") parent[leaf] = newName;
    }
  }

  const filePath = join(process.cwd(), CONFIG_PATH);
  if (!existsSync(filePath)) {
    return { ok: false, error: `Site config file not found (${CONFIG_PATH}) — this design doesn't support publishing yet.` };
  }

  // Safety: only replace a file whose runtime exports are the config itself.
  // Type-level exports (e.g. `export type SiteConfig = typeof siteConfig` —
  // every locked design has one) are preserved verbatim in the regenerated
  // file; a config exporting runtime helpers would break its importers if we
  // clobbered it wholesale, so those still refuse (owner report 2026-07-16:
  // the old guard treated the type export as foreign and blocked every
  // publish on locked designs).
  const current = readFileSync(filePath, "utf8");
  const scanned = scanExports(current);
  if (!scanned) {
    return { ok: false, error: "This design's config couldn't be parsed safely — publishing needs a rebuild instead." };
  }
  if (scanned.runtimeForeign.length > 0) {
    return { ok: false, error: `This design's config exports extra code (${scanned.runtimeForeign.join(", ")}) — publishing needs a rebuild instead.` };
  }

  const banner =
    `// AUTO-GENERATED by the admin Publish action — do not hand-edit.\n` +
    `// Source of truth: the admin CMS (sites.config). Publish again to update.\n`;
  // `as const` matters: locked designs derive narrow literal types from the
  // config (`typeof siteConfig` lookups, variant-key indexing) — a wide
  // string/number object would fail their compile. Original imports ride
  // along when types are preserved — a type block may reference them.
  const imports: string[] = scanned.typeBlocks.length > 0
    ? (current.match(/^import\b[^;]*;/gm) ?? [])
    : [];
  const body =
    (imports.length > 0 ? imports.join("\n") + "\n\n" : "") +
    `export const siteConfig = ${JSON.stringify(config, null, 2)} as const;\n\n` +
    (scanned.typeBlocks.length > 0 ? scanned.typeBlocks.join("\n\n") + "\n\n" : "") +
    `export default siteConfig;\n`;

  // Stub-config guard: older builds carry only a skeletal sites.config (the
  // design's real config was never captured into the DB). Publishing that
  // stub would blank out most of the site and wedge rebuilds — refuse when
  // the regenerated file is dramatically smaller than the design's current
  // config (proven case: Eko, 705B stub vs a ~13KB design config).
  if (banner.length + body.length < current.length * 0.3) {
    return { ok: false, error: "This site's saved content covers only a fraction of its design — publishing would remove sections. This design needs a one-time content sync first." };
  }

  try {
    writeFileSync(filePath, banner + body, "utf8");
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    if (/EROFS|read-only/i.test(msg)) {
      return { ok: false, error: "This deployment's files are read-only — your edits are saved and will go live on the next deploy." };
    }
    return { ok: false, error: `Publish failed: ${msg}` };
  }

  updateTag("site-config");
  revalidatePath("/", "layout");
  revalidatePath("/admin", "layout");

  // Preview machines serve a prebuilt `next start` bundle, so the regenerated
  // config is inert until the bundle is rebuilt — ask the platform to rebuild
  // this site's machine (site-scoped token, coalesced server-side).
  // NEVER key this on NODE_ENV: machine builds run `next build
  // --debug-prerender`, which inlines NODE_ENV=development into server chunks
  // and Turbopack dead-code-eliminates the whole production branch (proven on
  // Kessa 2026-07-16 — the compiled chunk read `if ("TURBOPACK compile-time
  // falsy", 0)`). The platform-provisioned proxy env is the reliable signal:
  // it exists only on platform-managed sites and is read at runtime.
  const proxyUrl = process.env.KODAGEN_PROXY_URL;
  const token = process.env.KODAGEN_SITE_TOKEN;
  if (proxyUrl && token) {
    try {
      const r = await fetch(`${proxyUrl.replace(/\/$/, "")}/publish-rebuild`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: "{}",
      });
      const j = (await r.json().catch(() => ({}))) as { ok?: boolean; started?: boolean };
      if (r.ok && j.ok) {
        return {
          ok: true,
          message: j.started === false
            ? "Published — a site rebuild is already running; your changes ride along and go live in about a minute."
            : "Published — rebuilding the site now. Your changes go live in about a minute.",
        };
      }
    } catch { /* platform unreachable — fall through to the saved-only message */ }
    // Platform reachable but no machine to rebuild (e.g. a deployed site),
    // or unreachable: the edits are saved and ride the next deploy/rebuild.
    return { ok: true, message: "Published — your edits are saved and go live on the site's next deploy." };
  }
  // No platform env at all: a local `next dev` — the write hot-reloads.
  return { ok: true, message: "Published — the site updates within a few seconds." };
}
