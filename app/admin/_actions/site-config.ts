"use server";
import { FK_COL, KODAGEN_SCHEMA, BOOKING_SCHEMA, withSchema } from '@/lib/db-scope';
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getCurrentSite } from "@/lib/site-scope";
import { hasPermission } from "@/lib/audit";

// Plain shape (not a discriminated union): generated apps compile with
// strictNullChecks:false, where TS won't narrow `ok ? ... : ...` branches.
export type SaveResult = { ok: boolean; error?: string };

/**
 * Generic deep-merge save into kodagen.sites.config (or .theme).
 * Caller passes a partial object that gets merged into the existing JSON.
 */
async function patch(field: "config" | "theme", patch: Record<string, unknown>): Promise<SaveResult> {
  const ctx = await getCurrentSite();
  if (!ctx) return { ok: false, error: "Not signed in." };
  if (!hasPermission(ctx.role, "content.edit", ctx.permissions)) {
    return { ok: false, error: "You don't have permission to edit this site." };
  }

  // Authenticated client — writes to kodagen.sites go through the "admins update
  // own site" policy (migration 010). NOTE: this restricts config/theme edits to
  // owner/admin; a non-admin `content.edit` role would be blocked by RLS. If
  // editor-level content editing is needed, add a DEFINER RPC that writes only
  // config/theme after a permission check (RLS can't scope to columns).
  const supabase = await createClient();
  const { data: current, error: readErr } = await withSchema(supabase, KODAGEN_SCHEMA)
    .from("sites")
    .select(field)
    .eq("id", ctx.siteId)
    .single();
  if (readErr) return { ok: false, error: readErr.message };

  const existing = (current as Record<string, unknown> | null)?.[field] as Record<string, unknown> | undefined;
  const merged = { ...(existing ?? {}), ...patch };
  const { error: writeErr } = await withSchema(supabase, KODAGEN_SCHEMA)
    .from("sites")
    .update({ [field]: merged })
    .eq("id", ctx.siteId);
  if (writeErr) return { ok: false, error: writeErr.message };

  // Revalidate every admin route + the whole public site (public routes live
  // at "/", not "/site/<slug>") so getSiteContent()-rendered pages pick up the
  // edit on their next request.
  revalidatePath("/admin", "layout");
  revalidatePath("/", "layout");
  return { ok: true };
}

// ─── Section-specific savers ────────────────────────────────────────────

export async function saveBusinessIdentity(_: SaveResult | null, fd: FormData): Promise<SaveResult> {
  const businessName = String(fd.get("businessName") ?? "").trim();
  const logoUrl = String(fd.get("logoUrl") ?? "").trim();
  const logoAlt = String(fd.get("logoAlt") ?? "").trim();
  const favicon = String(fd.get("favicon") ?? "").trim();

  return patch("config", {
    businessName,
    tagline: String(fd.get("tagline") ?? "").trim(),
    // Empty string → clear back to null. Otherwise persist as { path, alt }.
    logo: logoUrl ? { path: logoUrl, alt: logoAlt || businessName } : null,
    favicon: favicon || undefined,
  });
}

export async function saveHero(_: SaveResult | null, fd: FormData): Promise<SaveResult> {
  return patch("config", {
    hero: {
      headline:        String(fd.get("headline")        ?? "").trim(),
      subheadline:     String(fd.get("subheadline")     ?? "").trim(),
      ctaText:         String(fd.get("ctaText")         ?? "").trim(),
      ctaLink:         String(fd.get("ctaLink")         ?? "").trim(),
      backgroundImage: String(fd.get("backgroundImage") ?? "").trim(),
    },
  });
}

export async function saveAbout(_: SaveResult | null, fd: FormData): Promise<SaveResult> {
  return patch("config", {
    about: {
      title:      String(fd.get("title")      ?? "").trim(),
      mission:    String(fd.get("mission")    ?? "").trim(),
      vision:     String(fd.get("vision")     ?? "").trim(),
      paragraphs: String(fd.get("paragraphs") ?? "")
        .split("\n").map((p) => p.trim()).filter(Boolean),
    },
  });
}

export async function saveContact(_: SaveResult | null, fd: FormData): Promise<SaveResult> {
  return patch("config", {
    contact: {
      title:    String(fd.get("title")    ?? "").trim(),
      subtitle: String(fd.get("subtitle") ?? "").trim(),
      address:  String(fd.get("address")  ?? "").trim(),
      phone:    String(fd.get("phone")    ?? "").trim(),
      email:    String(fd.get("email")    ?? "").trim(),
      hours:    String(fd.get("hours")    ?? "").trim(),
    },
  });
}

export async function saveServices(_: SaveResult | null, fd: FormData): Promise<SaveResult> {
  // Title/subtitle live in config.services. Bookable rooms come from
  // booking.resources (managed in /admin/rooms). Non-bookable amenities
  // (pool, restaurant, conference) live in config.servicesExtras as an array.
  const extrasJSON = String(fd.get("servicesExtras") ?? "[]");
  let extras: unknown[];
  try {
    const parsed = JSON.parse(extrasJSON);
    extras = Array.isArray(parsed) ? parsed : [];
  } catch {
    return { ok: false, error: "Invalid services JSON." };
  }

  return patch("config", {
    services: {
      title:    String(fd.get("title")    ?? "").trim(),
      subtitle: String(fd.get("subtitle") ?? "").trim(),
    },
    servicesExtras: extras,
  });
}

export async function saveGallery(_: SaveResult | null, fd: FormData): Promise<SaveResult> {
  return patch("config", {
    gallery: {
      title:    String(fd.get("title")    ?? "").trim(),
      subtitle: String(fd.get("subtitle") ?? "").trim(),
    },
  });
}

export async function saveFooter(_: SaveResult | null, fd: FormData): Promise<SaveResult> {
  return patch("config", {
    footer: {
      copyrightText: String(fd.get("copyrightText") ?? "").trim(),
    },
  });
}

export async function saveWifi(_: SaveResult | null, fd: FormData): Promise<SaveResult> {
  return patch("config", {
    wifi: {
      name: String(fd.get("wifiName") ?? "").trim(),
      password: String(fd.get("wifiPassword") ?? "").trim(),
    },
    roomServiceMenu: String(fd.get("roomServiceMenu") ?? "").trim(),
  });
}

export async function saveSEO(_: SaveResult | null, fd: FormData): Promise<SaveResult> {
  return patch("config", {
    seo: {
      metaTitle:       String(fd.get("metaTitle")       ?? "").trim(),
      metaDescription: String(fd.get("metaDescription") ?? "").trim(),
      keywords:        String(fd.get("keywords")        ?? "")
        .split(",").map((k) => k.trim()).filter(Boolean),
    },
  });
}

// Normalize any hex-ish input to #RRGGBB — provisioning has historically
// stored 8-digit #RRGGBBAA values, and a save must heal them, not re-store.
function normHex(v: string): string {
  const m = v.trim().match(/^#?([0-9a-fA-F]{3,8})/);
  if (!m) return v.trim();
  let hex = m[1];
  if (hex.length === 4) hex = hex.slice(0, 3);
  if (hex.length >= 8) hex = hex.slice(0, 6);
  if (hex.length === 3) hex = hex.split("").map((c) => c + c).join("");
  return hex.length === 6 ? `#${hex.toLowerCase()}` : v.trim();
}

export async function saveTheme(_: SaveResult | null, fd: FormData): Promise<SaveResult> {
  return patch("theme", {
    primaryColor:   normHex(String(fd.get("primaryColor")   ?? "")),
    secondaryColor: normHex(String(fd.get("secondaryColor") ?? "")),
    accentColor:    normHex(String(fd.get("accentColor")    ?? "")),
    fontHeading:    String(fd.get("fontHeading")    ?? "").trim(),
    fontBody:       String(fd.get("fontBody")       ?? "").trim(),
    style:          String(fd.get("style")          ?? "elegant").trim(),
  });
}

// ─── Generic section editor ─────────────────────────────────────────────
// The Content → Page sections editor renders an input for EVERY string leaf
// of a config section (whatever shape the build invented) and posts them
// back as dot-paths ("items.0.title"). Deep-set them onto the existing
// section so non-string fields (images, flags, numbers) survive untouched.
function deepSet(target: unknown, path: string[], value: string): void {
  let node = target as Record<string, unknown> | unknown[];
  for (let i = 0; i < path.length - 1; i++) {
    const key = path[i];
    const next = Array.isArray(node) ? (node as unknown[])[Number(key)] : (node as Record<string, unknown>)[key];
    if (next === null || typeof next !== "object") return; // shape changed since render — skip
    node = next as Record<string, unknown> | unknown[];
  }
  const last = path[path.length - 1];
  if (Array.isArray(node)) node[Number(last)] = value;
  else (node as Record<string, unknown>)[last] = value;
}

export async function saveConfigSection(_: SaveResult | null, fd: FormData): Promise<SaveResult> {
  const section = String(fd.get("__section") ?? "").trim();
  if (!section || section.startsWith("__")) return { ok: false, error: "Missing section." };

  const ctx = await getCurrentSite();
  if (!ctx) return { ok: false, error: "Not signed in." };
  if (!hasPermission(ctx.role, "content.edit", ctx.permissions)) {
    return { ok: false, error: "You don't have permission to edit this site." };
  }

  const supabase = await createClient();
  const { data: current, error: readErr } = await withSchema(supabase, KODAGEN_SCHEMA)
    .from("sites").select("config").eq("id", ctx.siteId).single();
  if (readErr) return { ok: false, error: readErr.message };

  const config = ((current as { config?: Record<string, unknown> } | null)?.config ?? {}) as Record<string, unknown>;
  const existing = config[section];
  // Top-level strings ("tagline") post a single field named "__value".
  if (typeof existing === "string" || fd.has("__value")) {
    return patch("config", { [section]: String(fd.get("__value") ?? "").trim() });
  }
  if (existing === null || typeof existing !== "object") {
    return { ok: false, error: "This section no longer exists — reload the page." };
  }
  const updated = JSON.parse(JSON.stringify(existing)) as Record<string, unknown>;
  for (const [name, value] of fd.entries()) {
    if (name.startsWith("__") || typeof value !== "string") continue;
    deepSet(updated, name.split("."), value);
  }
  return patch("config", { [section]: updated });
}

const SOCIAL_KEYS = ["instagram", "facebook", "twitter", "tiktok", "linkedin", "youtube", "whatsapp"] as const;

export async function saveSocials(_: SaveResult | null, fd: FormData): Promise<SaveResult> {
  const socials: Record<string, string> = {};
  for (const key of SOCIAL_KEYS) {
    const v = String(fd.get(key) ?? "").trim();
    if (v) socials[key] = v;
  }
  return patch("config", { socials });
}

export async function saveSiteBasics(_: SaveResult | null, fd: FormData): Promise<SaveResult> {
  const name = String(fd.get("siteName") ?? "").trim();
  if (!name) return { ok: false, error: "Site name can't be empty." };

  const ctx = await getCurrentSite();
  if (!ctx) return { ok: false, error: "Not signed in." };
  if (!hasPermission(ctx.role, "content.edit", ctx.permissions)) {
    return { ok: false, error: "You don't have permission to edit this site." };
  }

  const supabase = await createClient();
  const { error } = await withSchema(supabase, KODAGEN_SCHEMA)
    .from("sites")
    .update({ name })
    .eq("id", ctx.siteId);
  if (error) return { ok: false, error: error.message };

  // Keep the public site's brand + email sender name in sync (best-effort).
  const res = await patch("config", { businessName: name });
  if (!res.ok) return res;
  await withSchema(supabase, KODAGEN_SCHEMA)
    .from("site_settings")
    .update({ business_name: name })
    .eq(FK_COL, ctx.siteId);

  revalidatePath("/admin", "layout");
  revalidatePath("/", "layout");
  return { ok: true };
}
