"use client";

// Shared chrome for every /admin/content editor — WordPress-style: a
// persistent left submenu of all content areas, one title bar with the
// Publish button always present, and one set of form styles. Every editor
// page renders inside ContentEditorShell so they all look and navigate the
// same; the per-page differences are only the form in the middle.
//
// NOTE for template authors: generated apps compile with
// strictNullChecks:false — keep result types plain shapes, never
// discriminated unions (see _actions/site-config.ts).

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAdminTheme } from "@/lib/admin-theme";
import { getAdminStyles } from "@/lib/admin-styles";
import PublishButton from "@/components/admin/publish-button";
import {
  Settings, FileText, MapPin, Clock, Share2, ImageIcon, PenLine, BookOpen, Star, Sparkles,
} from "lucide-react";

export type ContentAreaDef = {
  key: string;
  href: string;
  title: string;
  blurb: string;
  icon: React.ComponentType<{ className?: string }>;
};

// Single source of truth — the hub cards AND the editor submenu render from
// this list, so adding an area updates both.
export const CONTENT_AREAS: ContentAreaDef[] = [
  { key: "sections",     href: "/admin/content/sections",  title: "Page Sections",  icon: PenLine,   blurb: "Every heading, paragraph and label on the site — hero, story, about, legal pages, footer." },
  { key: "settings",     href: "/admin/content/settings",  title: "Site Settings",  icon: Settings,  blurb: "Business name, contact details, currency, locale, default SEO." },
  { key: "pages",        href: "/admin/content/pages",     title: "Pages",          icon: FileText,  blurb: "Per-page SEO titles and descriptions, publish status, nav visibility." },
  { key: "locations",    href: "/admin/content/locations", title: "Locations",      icon: MapPin,    blurb: "Addresses, coordinates, per-location contact details." },
  { key: "hours",        href: "/admin/content/hours",     title: "Hours",          icon: Clock,     blurb: "Opening hours per location per day. Holiday closures." },
  { key: "social",       href: "/admin/content/social",    title: "Social Links",   icon: Share2,    blurb: "Instagram, Facebook, WhatsApp, and other social URLs shown on your site." },
  { key: "media",        href: "/admin/media",             title: "Media Library",  icon: ImageIcon, blurb: "Upload and organize photos and videos for your site." },
  { key: "copy",         href: "/admin/content/copy",      title: "Voice & Copy",   icon: Sparkles,  blurb: "Edit hero text, brand story, and other voice-sensitive copy with AI help." },
  { key: "journal",      href: "/admin/journal",           title: "Journal",        icon: BookOpen,  blurb: "Write and publish blog posts — they appear on the public journal page and in the sitemap." },
  { key: "testimonials", href: "/admin/testimonials",      title: "Testimonials",   icon: Star,      blurb: "Manage customer reviews shown on your site." },
];

// One place for the editor form vocabulary — every editor uses these so the
// fields look identical across pages (and stay correct in dark mode).
export function useEditorStyles() {
  const { theme } = useAdminTheme();
  const dark = theme === "dark";
  const s = getAdminStyles(dark);
  return {
    dark,
    s,
    input: `w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-1 transition ${s.inputBg} ${s.inputRing}`,
    label: `block text-xs font-semibold mb-1.5 ${s.textSecondary}`,
    hint: `block text-[11px] mb-2 ${s.textMuted}`,
    card: `rounded-2xl border ${s.cardBg} ${s.cardBorder}`,
    divide: `divide-y ${dark ? "divide-white/[0.06]" : "divide-gray-100"}`,
    primaryBtn: "inline-flex items-center gap-2 px-4 py-2 rounded-xl text-white font-bold text-xs transition hover:scale-[1.02] disabled:opacity-60",
    primaryBtnStyle: { background: "linear-gradient(135deg, var(--color-accent), var(--color-primary))" } as React.CSSProperties,
    secondaryBtn: `px-3 py-2 text-xs font-semibold rounded-lg border transition ${s.cardBorder} ${dark ? "hover:bg-white/[0.06] text-gray-200" : "hover:bg-gray-50 text-gray-700"}`,
    emptyBox: `rounded-2xl border p-10 text-center ${s.cardBg} ${s.cardBorder}`,
  };
}

export function ContentEditorShell({
  active, title, description, actions, wide, children,
}: {
  active?: string;
  title: string;
  description?: string;
  actions?: React.ReactNode;
  wide?: boolean;
  children: React.ReactNode;
}) {
  const { s, dark } = useEditorStyles();
  const pathname = usePathname();

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-10">
        {/* WP-style content submenu — persistent across every editor */}
        <nav className="lg:w-52 shrink-0">
          <Link href="/admin/content" className={`hidden lg:block text-[11px] font-bold uppercase tracking-wider mb-3 ${s.textMuted} hover:underline`}>
            Content
          </Link>
          <ul className="flex lg:flex-col gap-1 overflow-x-auto pb-2 lg:pb-0 -mx-1 px-1">
            {CONTENT_AREAS.map((a) => {
              const isActive = active === a.key || pathname === a.href;
              const Icon = a.icon;
              return (
                <li key={a.key} className="shrink-0">
                  <Link
                    href={a.href}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-semibold whitespace-nowrap transition ${
                      isActive
                        ? "text-white"
                        : `${s.textSecondary} ${dark ? "hover:bg-white/[0.06]" : "hover:bg-gray-100"}`
                    }`}
                    style={isActive ? { background: "linear-gradient(135deg, var(--color-accent), var(--color-primary))" } : undefined}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    {a.title}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Editor column — same title bar + Publish on every page */}
        <div className={`flex-1 min-w-0 ${wide ? "max-w-5xl" : "max-w-3xl"}`}>
          <header className="flex flex-wrap items-start justify-between gap-4 mb-6">
            <div className="min-w-0">
              <h1 className={`text-2xl font-bold ${s.textPrimary}`}>{title}</h1>
              {description ? <p className={`text-sm mt-1 ${s.textSecondary}`}>{description}</p> : null}
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {actions}
              <PublishButton compact />
            </div>
          </header>
          {children}
        </div>
      </div>
    </div>
  );
}
