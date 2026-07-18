"use client";

import Link from "next/link";
import { Clock } from "lucide-react";
import { ContentEditorShell, useEditorStyles } from "@/components/admin/content-editor";
import HoursEditor from "./hours-editor";

type Hour = {
  day_of_week: number;
  open_time: string | null;
  close_time: string | null;
  is_closed: boolean;
  notes: string | null;
};

export type HoursLocation = {
  id: string;
  display_name: string;
  hours: Hour[];
};

export default function HoursView({ locations, siteId }: { locations: HoursLocation[]; siteId: string }) {
  const { s, emptyBox } = useEditorStyles();

  return (
    <ContentEditorShell
      active="hours"
      title="Hours of Operation"
      description="When you're open. Shown on your contact page, footer, and any location detail pages."
    >
      {locations.length === 0 ? (
        <div className={emptyBox}>
          <Clock className={`w-8 h-8 mx-auto mb-3 ${s.textMuted}`} />
          <p className={`font-medium ${s.textPrimary}`}>Add a location first to set hours</p>
          <Link href="/admin/content/locations/new" className="inline-block mt-2 text-xs font-medium text-blue-500 hover:underline">
            Add location →
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {locations.map((loc) => (
            <HoursEditor
              key={loc.id}
              locationId={loc.id}
              displayName={loc.display_name}
              tenantId={siteId}
              initialHours={loc.hours ?? []}
            />
          ))}
        </div>
      )}
    </ContentEditorShell>
  );
}
