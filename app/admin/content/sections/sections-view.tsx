"use client";

import { useActionState, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Save, PenLine, ChevronDown, CheckCircle, AlertCircle } from "lucide-react";
import { saveConfigSection, type SaveResult } from "../../_actions/site-config";
import { ContentEditorShell, useEditorStyles } from "@/components/admin/content-editor";

type Cfg = Record<string, unknown>;

// Keys that are NOT owner-editable copy: build machinery, design tokens and
// data managed on dedicated pages (products/catalog, socials/contact in
// Settings, SEO card, media library).
const SKIP_KEYS = new Set([
  "templateId", "engine", "adminModule", "enabledIntegrations",
  "headerVariant", "footerVariant", "cartVariant", "bookingVariant",
  "motion", "scrollHero", "brand", "typography", "theme",
  "products", "socials", "contact", "seo", "__assetImages",
]);

// URL-ish or asset-ish leaves aren't copy — hide them from the text editor.
const isAssetLeaf = (path: string, value: string) =>
  /(?:^|\.)(?:src|href|url|image|imageurl|imageslot|icon|video|poster|link)$/i.test(path.split(".").pop() ?? "") ||
  /^(?:https?:)?\//.test(value.trim());

type Leaf = { path: string; value: string };

function collectLeaves(node: unknown, prefix: string, out: Leaf[]): void {
  if (typeof node === "string") {
    if (!isAssetLeaf(prefix, node)) out.push({ path: prefix, value: node });
    return;
  }
  if (Array.isArray(node)) {
    node.forEach((child, i) => collectLeaves(child, prefix ? `${prefix}.${i}` : String(i), out));
    return;
  }
  if (node && typeof node === "object") {
    for (const [k, v] of Object.entries(node as Cfg)) {
      collectLeaves(v, prefix ? `${prefix}.${k}` : k, out);
    }
  }
}

const titleCase = (s: string) =>
  s.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/[-_.]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

function SectionCard({ sectionKey, node }: { sectionKey: string; node: unknown }) {
  const { s, input: inputCls } = useEditorStyles();
  const [open, setOpen] = useState(false);
  const [state, action, pending] = useActionState<SaveResult | null, FormData>(saveConfigSection, null);

  const leaves = useMemo(() => {
    const out: Leaf[] = [];
    collectLeaves(node, "", out);
    return out;
  }, [node]);
  if (leaves.length === 0 && typeof node !== "string") return null;

  return (
    <form action={action} className={`${s.cardBg} rounded-2xl border ${s.cardBorder}`}>
      <input type="hidden" name="__section" value={sectionKey} />
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-3 px-5 py-4 text-left"
      >
        <div className="flex items-center gap-2 min-w-0">
          <PenLine className="w-4 h-4 text-[var(--color-accent)] shrink-0" />
          <span className={`text-sm font-bold truncate ${s.textPrimary}`}>{titleCase(sectionKey)}</span>
          <span className={`text-[11px] ${s.textMuted}`}>
            {typeof node === "string" ? "1 field" : `${leaves.length} fields`}
          </span>
        </div>
        <span className="flex items-center gap-2">
          {state && (state.ok
            ? <CheckCircle className="w-4 h-4 text-green-500" />
            : <AlertCircle className="w-4 h-4 text-red-500" />)}
          <ChevronDown className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""} ${s.textMuted}`} />
        </span>
      </button>
      {open && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="px-5 pb-5 space-y-3">
          {typeof node === "string" ? (
            <input name="__value" defaultValue={node} className={inputCls} />
          ) : (
            leaves.map(({ path, value }) => (
              <div key={path}>
                <label className={`block text-[10px] font-semibold uppercase tracking-wider mb-1.5 ${s.textLabel}`}>
                  {titleCase(path)}
                </label>
                {value.length > 90 ? (
                  <textarea name={path} defaultValue={value} rows={Math.min(6, Math.ceil(value.length / 80))} className={inputCls} />
                ) : (
                  <input name={path} defaultValue={value} className={inputCls} />
                )}
              </div>
            ))
          )}
          {state?.ok === false && <p className="text-[11px] font-semibold text-red-500">{state.error}</p>}
          <button type="submit" disabled={pending}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-white font-bold text-xs transition hover:scale-[1.02] disabled:opacity-60"
            style={{ background: `linear-gradient(135deg, var(--color-accent), var(--color-primary))` }}>
            <Save className="w-3.5 h-3.5" /> {pending ? "Saving…" : `Save ${titleCase(sectionKey)}`}
          </button>
        </motion.div>
      )}
    </form>
  );
}

export default function SectionsView({ config }: { config: Cfg }) {
  const { s } = useEditorStyles();

  const sections = Object.entries(config).filter(([key, value]) => {
    if (SKIP_KEYS.has(key) || key.startsWith("__")) return false;
    if (typeof value === "string") return value.trim().length > 0;
    if (value === null || typeof value !== "object") return false;
    const leaves: Leaf[] = [];
    collectLeaves(value, "", leaves);
    return leaves.length > 0;
  });

  return (
    <ContentEditorShell
      active="sections"
      title="Page Sections"
      description="Every heading, paragraph and label on your site, grouped by section — including legal pages. Save a section, then Publish to push it live."
    >
      <div className="space-y-3">
        {sections.map(([key, value]) => (
          <SectionCard key={key} sectionKey={key} node={value} />
        ))}
        {sections.length === 0 && (
          <p className={`text-sm ${s.textMuted}`}>No editable sections found — this site hasn&apos;t stored its content yet.</p>
        )}
      </div>
    </ContentEditorShell>
  );
}
