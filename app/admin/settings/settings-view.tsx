"use client";

import { useActionState } from "react";
import { motion } from "framer-motion";
import AdminShell from "@/components/admin/admin-shell";
import { useAdminTheme } from "@/lib/admin-theme";
import { getAdminStyles } from "@/lib/admin-styles";
import type { SiteConfig } from "@/lib/types";
import { Save, Palette, Globe, AlertCircle, CheckCircle, Phone, Share2 } from "lucide-react";
import { saveTheme, saveSiteBasics, saveContact, saveSocials, type SaveResult } from "../_actions/site-config";
import PublishButton from "@/components/admin/publish-button";

type Cfg = Record<string, unknown>;
const get = (o: Cfg, k: string): string => (typeof o[k] === "string" ? (o[k] as string) : "");

// Display-side heal for legacy 8-digit #RRGGBBAA values stored at provision.
const displayHex = (v: string): string => {
  const m = v.trim().match(/^#([0-9a-fA-F]{3,8})/);
  if (!m) return v;
  const hex = m[1];
  if (hex.length >= 8) return `#${hex.slice(0, 6)}`;
  if (hex.length === 4) return `#${hex.slice(0, 3)}`;
  return `#${hex}`;
};

function Banner({ result }: { result: SaveResult | null }) {
  if (!result) return null;
  return result.ok ? (
    <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-2 px-3 py-2 rounded-lg bg-green-50 border border-green-200 text-xs font-semibold text-green-700">
      <CheckCircle className="w-3.5 h-3.5" /> Saved.
    </motion.div>
  ) : (
    <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-50 border border-red-200 text-xs font-semibold text-red-700">
      <AlertCircle className="w-3.5 h-3.5" /> {result.error}
    </motion.div>
  );
}

function SettingsForm({ site, theme, config }: { site: { name: string; slug: string; domain: string; industry: string }; theme: Cfg; config: Cfg }) {
  const { theme: appearance } = useAdminTheme();
  const dark = appearance === "dark";
  const s = getAdminStyles(dark);
  const inputCls = `w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-1 transition ${s.inputBg} ${s.inputRing}`;

  const [themeState, themeAction, themePending] = useActionState<SaveResult | null, FormData>(saveTheme, null);
  const [basicsState, basicsAction, basicsPending] = useActionState<SaveResult | null, FormData>(saveSiteBasics, null);
  const [contactState, contactAction, contactPending] = useActionState<SaveResult | null, FormData>(saveContact, null);
  const [socialState, socialAction, socialPending] = useActionState<SaveResult | null, FormData>(saveSocials, null);

  const contact = (config.contact ?? {}) as Record<string, unknown>;
  const socials = (config.socials ?? {}) as Record<string, unknown>;
  const cget = (o: Record<string, unknown>, k: string): string => (typeof o[k] === "string" ? (o[k] as string) : "");

  return (
    <div className="p-5 sm:p-6 lg:p-8 space-y-8 max-w-3xl">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className={`text-2xl font-bold ${s.textPrimary}`}>Settings</h1>
          <p className={`text-sm mt-1 ${s.textSecondary}`}>Brand, contact details, social links and site basics. Save stores your edits — Publish pushes them onto the live site.</p>
        </div>
        <PublishButton />
      </div>

      {/* Site basics */}
      <form action={basicsAction} className={`${s.cardBg} rounded-2xl border ${s.cardBorder} p-6 space-y-4`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-[var(--color-accent)]" />
            <h2 className={`text-base font-bold ${s.textPrimary}`}>Site basics</h2>
          </div>
          <Banner result={basicsState} />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${s.textLabel}`}>Site name</label>
            <input name="siteName" defaultValue={site.name} className={inputCls} />
          </div>
          <div>
            <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${s.textLabel}`}>Slug</label>
            <input value={site.slug} disabled className={`${inputCls} opacity-70`} />
          </div>
          <div>
            <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${s.textLabel}`}>Industry</label>
            <input value={site.industry} disabled className={`${inputCls} opacity-70`} />
          </div>
          <div>
            <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${s.textLabel}`}>Domain</label>
            <input value={site.domain || "—"} disabled className={`${inputCls} opacity-70`} />
          </div>
        </div>
        <div className="flex items-center justify-between gap-4">
          <p className={`text-[11px] ${s.textMuted}`}>Slug, industry and domain changes require admin support — open a ticket from the dashboard.</p>
          <button type="submit" disabled={basicsPending}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-white font-bold text-sm transition hover:scale-[1.02] disabled:opacity-60 flex-shrink-0"
            style={{ background: `linear-gradient(135deg, var(--color-accent), var(--color-primary))` }}>
            <Save className="w-4 h-4" /> {basicsPending ? "Saving…" : "Save basics"}
          </button>
        </div>
      </form>

      {/* Theme */}
      <form action={themeAction} className={`${s.cardBg} rounded-2xl border ${s.cardBorder} p-6 space-y-4`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Palette className="w-4 h-4 text-[var(--color-accent)]" />
            <h2 className={`text-base font-bold ${s.textPrimary}`}>Brand palette & typography</h2>
          </div>
          <Banner result={themeState} />
        </div>
        <div className="grid sm:grid-cols-3 gap-4">
          {(
            [
              { key: "primaryColor",   label: "Primary"   },
              { key: "secondaryColor", label: "Secondary" },
              { key: "accentColor",    label: "Accent"    },
            ] as const
          ).map(({ key, label }) => (
            <div key={key}>
              <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${s.textLabel}`}>{label}</label>
              <div className="relative">
                <input
                  name={key}
                  type="text"
                  defaultValue={displayHex(get(theme, key)) || "#000000"}
                  className={`${inputCls} pl-12`}
                />
                <span
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-md border border-black/10"
                  style={{ background: displayHex(get(theme, key)) || "#000" }}
                />
              </div>
            </div>
          ))}
        </div>
        <div className="grid sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2">
            <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${s.textLabel}`}>Heading font (CSS)</label>
            <input name="fontHeading" defaultValue={get(theme, "fontHeading")} className={inputCls} placeholder="'Bricolage Grotesque', system-ui" />
          </div>
          <div>
            <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${s.textLabel}`}>Style</label>
            <select name="style" defaultValue={get(theme, "style") || "elegant"} className={inputCls}>
              <option value="modern">Modern</option>
              <option value="classic">Classic</option>
              <option value="bold">Bold</option>
              <option value="elegant">Elegant</option>
            </select>
          </div>
        </div>
        <div>
          <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${s.textLabel}`}>Body font (CSS)</label>
          <input name="fontBody" defaultValue={get(theme, "fontBody")} className={inputCls} placeholder="'Inter', system-ui" />
        </div>
        <button type="submit" disabled={themePending}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-white font-bold text-sm transition hover:scale-[1.02] disabled:opacity-60"
          style={{ background: `linear-gradient(135deg, var(--color-accent), var(--color-primary))` }}>
          <Save className="w-4 h-4" /> {themePending ? "Saving…" : "Save palette"}
        </button>
      </form>

      {/* Contact details */}
      <form action={contactAction} className={`${s.cardBg} rounded-2xl border ${s.cardBorder} p-6 space-y-4`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-[var(--color-accent)]" />
            <h2 className={`text-base font-bold ${s.textPrimary}`}>Contact details</h2>
          </div>
          <Banner result={contactState} />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${s.textLabel}`}>Email</label>
            <input name="email" type="email" defaultValue={cget(contact, "email")} className={inputCls} placeholder="hello@yourbusiness.com" />
          </div>
          <div>
            <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${s.textLabel}`}>Phone</label>
            <input name="phone" defaultValue={cget(contact, "phone")} className={inputCls} placeholder="+234 …" />
          </div>
          <div className="sm:col-span-2">
            <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${s.textLabel}`}>Address / location</label>
            <input name="address" defaultValue={cget(contact, "address")} className={inputCls} placeholder="Street, city" />
          </div>
          <div>
            <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${s.textLabel}`}>Opening hours (short)</label>
            <input name="hours" defaultValue={cget(contact, "hours")} className={inputCls} placeholder="Mon–Sat 9:00–18:00" />
          </div>
          <div>
            <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${s.textLabel}`}>Contact page title</label>
            <input name="title" defaultValue={cget(contact, "title")} className={inputCls} placeholder="Get in touch" />
          </div>
          <div className="sm:col-span-2">
            <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${s.textLabel}`}>Contact page subtitle</label>
            <input name="subtitle" defaultValue={cget(contact, "subtitle")} className={inputCls} placeholder="We usually reply within a day." />
          </div>
        </div>
        <button type="submit" disabled={contactPending}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-white font-bold text-sm transition hover:scale-[1.02] disabled:opacity-60"
          style={{ background: `linear-gradient(135deg, var(--color-accent), var(--color-primary))` }}>
          <Save className="w-4 h-4" /> {contactPending ? "Saving…" : "Save contact"}
        </button>
      </form>

      {/* Social links */}
      <form action={socialAction} className={`${s.cardBg} rounded-2xl border ${s.cardBorder} p-6 space-y-4`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Share2 className="w-4 h-4 text-[var(--color-accent)]" />
            <h2 className={`text-base font-bold ${s.textPrimary}`}>Social links</h2>
          </div>
          <Banner result={socialState} />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          {([
            ["instagram", "Instagram"], ["facebook", "Facebook"], ["twitter", "X / Twitter"],
            ["tiktok", "TikTok"], ["linkedin", "LinkedIn"], ["youtube", "YouTube"], ["whatsapp", "WhatsApp link"],
          ] as const).map(([key, label]) => (
            <div key={key}>
              <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${s.textLabel}`}>{label}</label>
              <input name={key} defaultValue={cget(socials, key)} className={inputCls} placeholder={`https://…`} />
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between gap-4">
          <p className={`text-[11px] ${s.textMuted}`}>Leave a field empty to remove that link. Publish to update the site&apos;s header/footer.</p>
          <button type="submit" disabled={socialPending}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-white font-bold text-sm transition hover:scale-[1.02] disabled:opacity-60 flex-shrink-0"
            style={{ background: `linear-gradient(135deg, var(--color-accent), var(--color-primary))` }}>
            <Save className="w-4 h-4" /> {socialPending ? "Saving…" : "Save socials"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default function SettingsView({
  site, theme, config, siteConfig, counts,
}: {
  site: { name: string; slug: string; domain: string; industry: string };
  theme: Cfg;
  config: Cfg;
  siteConfig: SiteConfig;
  counts?: { bookings: number; inquiries: number };
}) {
  return (
    <AdminShell config={siteConfig} counts={counts}>
      <SettingsForm site={site} theme={theme} config={config} />
    </AdminShell>
  );
}
