import type {
  Audience,
  ColorMood,
  Engine,
  Industry,
  MotionLevel,
  Section,
  Style,
  TemplateMeta,
} from "@/lib/templates/meta-types";

// Template catalog imports are stripped on tenant builds — the platform
// pre-selects a single template at scaffold time. Registry helpers return
// empty at runtime; add entries here if a future feature needs discovery.

/**
 * Single source of truth for template discovery.
 *
 * Add a new template:
 * 1. Create `src/components/templates/<id>/meta.ts` exporting `meta: TemplateMeta`
 * 2. Add the import + entry below
 * 3. Add the id to `SiteConfig["templateId"]` in `src/lib/types.ts`
 */
export const TEMPLATE_REGISTRY: readonly TemplateMeta[] = [] as const;

// ─── Indexes ──────────────────────────────────────────────

export const TEMPLATE_BY_ID: ReadonlyMap<string, TemplateMeta> = new Map(
  TEMPLATE_REGISTRY.map((t) => [t.id, t]),
);

export const TEMPLATES_BY_INDUSTRY: ReadonlyMap<Industry, readonly TemplateMeta[]> = (() => {
  const map = new Map<Industry, TemplateMeta[]>();
  for (const t of TEMPLATE_REGISTRY) {
    const list = map.get(t.industry) ?? [];
    list.push(t);
    map.set(t.industry, list);
  }
  return map;
})();

export const TEMPLATES_BY_ENGINE: ReadonlyMap<Engine, readonly TemplateMeta[]> = (() => {
  const map = new Map<Engine, TemplateMeta[]>();
  for (const t of TEMPLATE_REGISTRY) {
    const list = map.get(t.engine) ?? [];
    list.push(t);
    map.set(t.engine, list);
  }
  return map;
})();

// ─── Lookups ─────────────────────────────────────────────

export function getTemplate(id: string): TemplateMeta | undefined {
  return TEMPLATE_BY_ID.get(id);
}

export function getTemplateOrThrow(id: string): TemplateMeta {
  const t = TEMPLATE_BY_ID.get(id);
  if (!t) throw new Error(`Unknown templateId: ${id}`);
  return t;
}

// ─── Query API (used by Design Director + Planning Agent) ───

export type TemplateQuery = {
  industry?: Industry | Industry[];
  engine?: Engine | Engine[];
  style?: Style | Style[];
  colorMood?: ColorMood | ColorMood[];
  motionLevel?: MotionLevel | MotionLevel[];
  audience?: Audience | Audience[];
  /** Any of these vibe tokens (OR match, case-insensitive substring). */
  vibeAny?: string[];
  /** All of these vibe tokens must match. */
  vibeAll?: string[];
  /** Sections the template MUST include. */
  requiresSections?: Section[];
  /** Business type keywords to match against bestFor (OR, substring). */
  bestForAny?: string[];
};

function toArray<T>(v: T | T[] | undefined): T[] {
  if (v === undefined) return [];
  return Array.isArray(v) ? v : [v];
}

function vibeIncludes(vibe: readonly string[], needle: string): boolean {
  const n = needle.toLowerCase();
  return vibe.some((v) => v.toLowerCase().includes(n));
}

export function queryTemplates(q: TemplateQuery = {}): TemplateMeta[] {
  const industries = toArray(q.industry);
  const engines = toArray(q.engine);
  const styles = toArray(q.style);
  const moods = toArray(q.colorMood);
  const motions = toArray(q.motionLevel);
  const audiences = toArray(q.audience);

  return TEMPLATE_REGISTRY.filter((t) => {
    if (industries.length && !industries.includes(t.industry)) return false;
    if (engines.length && !engines.includes(t.engine)) return false;
    if (styles.length && !styles.includes(t.style)) return false;
    if (moods.length && !moods.includes(t.colorMood)) return false;
    if (motions.length && !motions.includes(t.motionLevel)) return false;

    if (audiences.length) {
      const tAudience = t.audience ?? [];
      if (!audiences.some((a) => tAudience.includes(a))) return false;
    }

    if (q.vibeAny?.length) {
      if (!q.vibeAny.some((needle) => vibeIncludes(t.vibe, needle))) return false;
    }

    if (q.vibeAll?.length) {
      if (!q.vibeAll.every((needle) => vibeIncludes(t.vibe, needle))) return false;
    }

    if (q.requiresSections?.length) {
      if (!q.requiresSections.every((s) => t.sections.includes(s))) return false;
    }

    if (q.bestForAny?.length) {
      const hay = t.bestFor.map((b) => b.toLowerCase());
      const hit = q.bestForAny.some((kw) =>
        hay.some((b) => b.includes(kw.toLowerCase())),
      );
      if (!hit) return false;
    }

    return true;
  });
}

// ─── Compact catalog for LLM prompts ──────────────────────

/**
 * Minimal catalog rows suitable for inclusion in an LLM prompt.
 * Strips verbose fields; keeps what the Design Director needs to pick.
 */
export type CatalogRow = {
  id: string;
  name: string;
  industry: Industry;
  engine: Engine;
  style: Style;
  colorMood: ColorMood;
  motionLevel: MotionLevel;
  vibe: string[];
  sections: Section[];
  bestFor: string[];
};

export function getCatalog(templates: readonly TemplateMeta[] = TEMPLATE_REGISTRY): CatalogRow[] {
  return templates.map((t) => ({
    id: t.id,
    name: t.name,
    industry: t.industry,
    engine: t.engine,
    style: t.style,
    colorMood: t.colorMood,
    motionLevel: t.motionLevel,
    vibe: [...t.vibe],
    sections: [...t.sections],
    bestFor: [...t.bestFor],
  }));
}
