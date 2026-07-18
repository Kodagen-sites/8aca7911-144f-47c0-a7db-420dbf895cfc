"use client";

import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { CONTENT_AREAS, ContentEditorShell, useEditorStyles } from "@/components/admin/content-editor";

function formatRelativeTime(isoString: string): string {
  const diffMs = Date.now() - new Date(isoString).getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHr = Math.floor(diffMs / 3600000);
  const diffDay = Math.floor(diffMs / 86400000);
  if (diffMin < 1) return "just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHr < 24) return `${diffHr}h ago`;
  if (diffDay < 7) return `${diffDay}d ago`;
  return new Date(isoString).toLocaleDateString();
}

export default function ContentHubView({ stamps }: { stamps: Record<string, string | undefined> }) {
  const { s, dark } = useEditorStyles();

  return (
    <ContentEditorShell
      title="Content"
      description="Edit your site's text, images, and settings — then hit Publish to push everything onto the live site."
      wide
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {CONTENT_AREAS.map((area) => {
          const Icon = area.icon;
          const lastUpdated = stamps[area.key];
          return (
            <Link
              key={area.key}
              href={area.href}
              className={`group block p-5 rounded-2xl border transition hover:shadow-md ${s.cardBg} ${s.cardBorder} ${dark ? "hover:border-white/20" : "hover:border-gray-300"}`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`p-2 rounded-lg ${dark ? "bg-white/[0.06]" : "bg-gray-100"}`}>
                  <Icon className={`w-5 h-5 ${s.textSecondary}`} />
                </div>
                {lastUpdated && (
                  <span className={`text-[11px] ${s.textMuted}`}>Updated {formatRelativeTime(lastUpdated)}</span>
                )}
              </div>
              <h2 className={`font-semibold ${s.textPrimary}`}>{area.title}</h2>
              <p className={`text-xs mt-1 leading-relaxed ${s.textSecondary}`}>{area.blurb}</p>
              <div className="mt-3 flex items-center gap-1 text-xs font-medium text-blue-500">
                Edit <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
              </div>
            </Link>
          );
        })}
      </div>

      <div className={`mt-8 p-5 rounded-2xl border ${s.cardBg} ${s.cardBorder}`}>
        <div className="flex items-start gap-3">
          <Sparkles className={`w-5 h-5 mt-0.5 shrink-0 ${s.textSecondary}`} />
          <div>
            <h3 className={`font-semibold ${s.textPrimary}`}>Need a structural change?</h3>
            <p className={`text-xs mt-1 ${s.textSecondary}`}>
              Adding a new section, changing the layout, restyling — use the AI editor in your Kodagen
              dashboard. It regenerates parts of the site while keeping your voice and brand consistent.
            </p>
          </div>
        </div>
      </div>
    </ContentEditorShell>
  );
}
