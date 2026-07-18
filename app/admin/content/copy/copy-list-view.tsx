"use client";

import Link from "next/link";
import { ContentEditorShell, useEditorStyles } from "@/components/admin/content-editor";

export type CopyFieldItem = {
  key: string;
  label: string;
  description: string;
  location: string;
  currentValue: string | null;
  updatedAt: string | null;
  isOverridden: boolean;
};

function formatRelativeTime(isoString: string): string {
  const diffMs = Date.now() - new Date(isoString).getTime();
  const diffHr = Math.floor(diffMs / 3600000);
  const diffDay = Math.floor(diffMs / 86400000);
  if (diffHr < 1) return "just now";
  if (diffHr < 24) return `${diffHr}h ago`;
  if (diffDay < 7) return `${diffDay}d ago`;
  return new Date(isoString).toLocaleDateString();
}

export default function CopyListView({ items, voiceFamily }: { items: CopyFieldItem[]; voiceFamily: string }) {
  const { s, dark, card } = useEditorStyles();

  return (
    <ContentEditorShell
      active="copy"
      title="Voice & Copy"
      description="The voice-sensitive parts of your site. Edit them with AI to keep your tone consistent — the AI knows your voice rules and will refuse copy that breaks them."
    >
      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs mb-5 ${dark ? "bg-white/[0.06]" : "bg-gray-100"} ${s.textSecondary}`}>
        <span className="w-2 h-2 rounded-full" style={{ background: "var(--color-accent)" }}></span>
        <span>Voice: <strong className={s.textPrimary}>{voiceFamily}</strong></span>
      </div>

      <div className="space-y-3">
        {items.map((field) => (
          <Link
            key={field.key}
            href={`/admin/content/copy/${encodeURIComponent(field.key)}`}
            className={`block p-5 rounded-2xl border transition hover:shadow-md group ${card} ${dark ? "hover:border-white/20" : "hover:border-gray-300"}`}
          >
            <div className="flex items-start justify-between gap-6">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className={`text-sm font-bold ${s.textPrimary}`}>{field.label}</h3>
                  {field.isOverridden && (
                    <span className="text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20">
                      Edited
                    </span>
                  )}
                </div>
                <p className={`text-xs mb-3 ${s.textMuted}`}>{field.description}</p>

                {field.currentValue ? (
                  <div className={`text-sm italic border-l-2 pl-3 py-0.5 ${s.textSecondary}`} style={{ borderColor: "var(--color-accent)" }}>
                    &ldquo;{field.currentValue}&rdquo;
                  </div>
                ) : (
                  <div className={`text-xs italic ${s.textMuted}`}>Not set yet</div>
                )}

                <div className={`mt-3 text-[11px] ${s.textMuted}`}>
                  Shows on: {field.location}
                  {field.updatedAt && ` · Updated ${formatRelativeTime(field.updatedAt)}`}
                </div>
              </div>

              <div className="text-xs font-medium text-blue-500 shrink-0 group-hover:translate-x-1 transition-transform">
                Edit with AI →
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className={`mt-8 p-5 rounded-2xl border ${card}`}>
        <h3 className={`text-sm font-bold mb-1 ${s.textPrimary}`}>Why we use AI for these</h3>
        <p className={`text-xs leading-relaxed ${s.textSecondary}`}>
          Voice-sensitive copy is hard to write well. It&apos;s easy to accidentally use words that feel
          generic (&ldquo;luxury,&rdquo; &ldquo;world-class,&rdquo; &ldquo;experience the difference&rdquo;) or too corporate. The AI
          knows the voice rules for your brand and will only suggest copy that follows them. You can
          always edit manually if you prefer.
        </p>
      </div>
    </ContentEditorShell>
  );
}
