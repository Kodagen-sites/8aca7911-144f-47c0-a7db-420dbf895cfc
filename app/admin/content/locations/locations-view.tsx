"use client";

import Link from "next/link";
import { MapPin, Plus } from "lucide-react";
import { ContentEditorShell, useEditorStyles } from "@/components/admin/content-editor";

export type LocationRow = {
  id: string;
  display_name: string;
  address_line_1: string | null;
  address_line_2: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  primary_phone: string | null;
  is_active: boolean;
};

export default function LocationsView({ locations }: { locations: LocationRow[] }) {
  const { s, dark, card, divide, emptyBox } = useEditorStyles();

  return (
    <ContentEditorShell
      active="locations"
      title="Locations"
      description="Your physical locations. Each has its own address, contact details, and hours."
      actions={
        <Link href="/admin/content/locations/new"
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 transition">
          <Plus className="w-4 h-4" /> Add location
        </Link>
      }
    >
      {locations.length === 0 ? (
        <div className={emptyBox}>
          <MapPin className={`w-8 h-8 mx-auto mb-3 ${s.textMuted}`} />
          <p className={`font-medium ${s.textPrimary}`}>No locations yet</p>
          <p className={`text-sm mt-1 ${s.textSecondary}`}>Add your first location so customers know where to find you.</p>
        </div>
      ) : (
        <div className={`${card} ${divide}`}>
          {locations.map((loc) => (
            <Link
              key={loc.id}
              href={`/admin/content/locations/${loc.id}`}
              className={`flex items-start justify-between gap-6 p-4 transition ${dark ? "hover:bg-white/[0.04]" : "hover:bg-gray-50"}`}
            >
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-semibold ${s.textPrimary}`}>{loc.display_name}</p>
                <p className={`text-xs mt-0.5 ${s.textSecondary}`}>
                  {[loc.address_line_1, loc.address_line_2, loc.city, loc.state, loc.country].filter(Boolean).join(", ")}
                </p>
                {loc.primary_phone && <p className={`text-xs mt-0.5 ${s.textMuted}`}>{loc.primary_phone}</p>}
              </div>
              <span className="flex items-center gap-2 shrink-0">
                {!loc.is_active && (
                  <span className="text-[10px] font-bold uppercase tracking-wide text-amber-500">Inactive</span>
                )}
                <span className="text-xs font-medium text-blue-500">Edit →</span>
              </span>
            </Link>
          ))}
        </div>
      )}
    </ContentEditorShell>
  );
}
