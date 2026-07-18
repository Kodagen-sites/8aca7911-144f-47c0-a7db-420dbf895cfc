"use client";
// The publish control — appears on Settings and the Content hub. Saving
// writes to the DB; PUBLISHING regenerates the site's config file so the
// live pages actually change. Kept as one shared component so every surface
// gets the same behavior and messaging.
import { useState, useTransition } from "react";
import { motion } from "framer-motion";
import { UploadCloud, CheckCircle, AlertCircle } from "lucide-react";
import { publishToSite, type PublishResult } from "@/app/admin/_actions/publish";
import { useAdminTheme } from "@/lib/admin-theme";
import { getAdminStyles } from "@/lib/admin-styles";

export default function PublishButton({ compact }: { compact?: boolean }) {
  const { theme } = useAdminTheme();
  const dark = theme === "dark";
  const s = getAdminStyles(dark);
  const [pending, start] = useTransition();
  const [result, setResult] = useState<PublishResult | null>(null);

  return (
    <div className={compact ? "flex items-center gap-3" : "space-y-2"}>
      <button
        type="button"
        disabled={pending}
        onClick={() => start(async () => setResult(await publishToSite()))}
        className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition disabled:opacity-60 ${
          dark ? "bg-white text-gray-900 hover:bg-gray-200" : "bg-gray-900 text-white hover:bg-gray-700"
        }`}
      >
        <UploadCloud className="w-4 h-4" />
        {pending ? "Publishing…" : "Publish to site"}
      </button>
      {result && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className={`flex items-center gap-1.5 text-[11px] font-semibold ${
            result.ok ? "text-green-600" : "text-red-500"
          }`}
        >
          {result.ok
            ? <><CheckCircle className="w-3.5 h-3.5 shrink-0" /> {result.message}</>
            : <><AlertCircle className="w-3.5 h-3.5 shrink-0" /> {result.error}</>}
        </motion.p>
      )}
      {!result && !compact && (
        <p className={`text-[11px] ${s.textMuted}`}>
          Saving stores your edits — publishing pushes them onto the live site.
        </p>
      )}
    </div>
  );
}
