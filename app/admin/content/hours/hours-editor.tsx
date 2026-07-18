'use client';

import { useState } from 'react';
import { updateLocationHours } from '@/app/admin/_actions/update-hours';
import { useEditorStyles } from '@/components/admin/content-editor';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

type Hour = {
  day_of_week: number;
  open_time: string | null;
  close_time: string | null;
  is_closed: boolean;
  notes: string | null;
};

export default function HoursEditor({
  locationId,
  displayName,
  tenantId,
  initialHours,
}: {
  locationId: string;
  displayName: string;
  tenantId: string;
  initialHours: Hour[];
}) {
  // Build complete 7-day array (fill any missing days)
  const fullHours: Hour[] = Array.from({ length: 7 }, (_, day) => {
    const existing = initialHours.find(h => h.day_of_week === day);
    return existing ?? { day_of_week: day, open_time: null, close_time: null, is_closed: true, notes: null };
  }).sort((a, b) => a.day_of_week - b.day_of_week);
  
  const [hours, setHours] = useState<Hour[]>(fullHours);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<Date | null>(null);
  
  function updateHour(day: number, field: keyof Hour, value: any) {
    setHours(hs => hs.map(h => h.day_of_week === day ? { ...h, [field]: value } : h));
  }
  
  function applyToWeekdays() {
    const monday = hours[1];
    setHours(hs => hs.map(h => 
      h.day_of_week >= 1 && h.day_of_week <= 5 
        ? { ...h, open_time: monday.open_time, close_time: monday.close_time, is_closed: monday.is_closed }
        : h
    ));
  }
  
  function closeWeekend() {
    setHours(hs => hs.map(h => 
      h.day_of_week === 0 || h.day_of_week === 6
        ? { ...h, is_closed: true, open_time: null, close_time: null }
        : h
    ));
  }
  
  async function handleSave() {
    setSaving(true);
    try {
      const result = await updateLocationHours(tenantId, locationId, hours);
      if (result.success) {
        setSavedAt(new Date());
      }
    } finally {
      setSaving(false);
    }
  }
  
  const { s, dark, card, input, secondaryBtn, primaryBtn, primaryBtnStyle } = useEditorStyles();

  return (
    <div className={`${card} p-5`}>
      <div className="flex flex-wrap items-start justify-between gap-3 mb-5">
        <h2 className={`text-sm font-bold ${s.textPrimary}`}>{displayName}</h2>
        <div className="flex gap-2">
          <button type="button" onClick={applyToWeekdays} className={secondaryBtn}>
            Apply Mon to all weekdays
          </button>
          <button type="button" onClick={closeWeekend} className={secondaryBtn}>
            Close weekend
          </button>
        </div>
      </div>

      <div className="space-y-1">
        {hours.map(h => (
          <div key={h.day_of_week} className="flex flex-wrap items-center gap-3 py-1.5">
            <div className={`w-24 text-sm font-medium ${s.textPrimary}`}>{DAYS[h.day_of_week]}</div>

            <label className={`flex items-center gap-2 text-sm ${s.textSecondary}`}>
              <input
                type="checkbox"
                checked={h.is_closed}
                onChange={e => updateHour(h.day_of_week, 'is_closed', e.target.checked)}
                className="rounded accent-blue-600"
              />
              Closed
            </label>

            {!h.is_closed && (
              <>
                <input
                  type="time"
                  value={h.open_time?.slice(0, 5) ?? ''}
                  onChange={e => updateHour(h.day_of_week, 'open_time', e.target.value ? `${e.target.value}:00` : null)}
                  className={`${input} !w-28`}
                />
                <span className={s.textMuted}>to</span>
                <input
                  type="time"
                  value={h.close_time?.slice(0, 5) ?? ''}
                  onChange={e => updateHour(h.day_of_week, 'close_time', e.target.value ? `${e.target.value}:00` : null)}
                  className={`${input} !w-28`}
                />
                <input
                  type="text"
                  value={h.notes ?? ''}
                  onChange={e => updateHour(h.day_of_week, 'notes', e.target.value || null)}
                  placeholder="Notes (optional)"
                  className={`${input} !w-auto flex-1`}
                />
              </>
            )}
          </div>
        ))}
      </div>

      <div className={`mt-5 flex items-center justify-between pt-4 border-t ${dark ? "border-white/[0.06]" : "border-gray-100"}`}>
        <div className={`text-xs ${s.textMuted}`}>
          {savedAt && `Saved at ${savedAt.toLocaleTimeString()}`}
        </div>
        <button type="button" onClick={handleSave} disabled={saving} className={primaryBtn} style={primaryBtnStyle}>
          {saving ? 'Saving…' : 'Save hours'}
        </button>
      </div>
    </div>
  );
}
