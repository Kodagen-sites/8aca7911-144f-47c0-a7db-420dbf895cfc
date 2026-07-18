'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { updateSiteSettings } from '@/app/admin/_actions/update-settings';
import { ContentEditorShell, useEditorStyles } from '@/components/admin/content-editor';

type Settings = {
  business_name: string;
  legal_name: string | null;
  tagline_short: string | null;
  founded_year: number | null;
  industry_classification: string | null;
  voice_family: string | null;
  primary_phone: string | null;
  whatsapp_phone: string | null;
  primary_email: string | null;
  support_email: string | null;
  default_currency: string;
  default_locale: string;
  default_timezone: string;
  default_meta_title: string | null;
  default_meta_description: string | null;
  default_og_image_url: string | null;
};

type Props = {
  initialSettings: Settings;
  tenantId: string;
};

export default function SettingsForm({ initialSettings, tenantId }: Props) {
  const router = useRouter();
  const { s, dark, card, input, label: labelCls, hint: hintCls, secondaryBtn, primaryBtn, primaryBtnStyle } = useEditorStyles();
  const [settings, setSettings] = useState<Settings>(initialSettings);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);

  function update<K extends keyof Settings>(key: K, value: Settings[K]) {
    setSettings(st => ({ ...st, [key]: value }));
  }

  async function handleSave() {
    setSaving(true);
    setError(null);
    try {
      const result = await updateSiteSettings(tenantId, settings);
      if (result.success) {
        setSavedAt(new Date());
        router.refresh();
      } else {
        setError(result.error ?? 'Could not save. Try again.');
      }
    } catch {
      setError('Something went wrong. Try again.');
    } finally {
      setSaving(false);
    }
  }

  function Field({ label, hint, required, children }: {
    label: string;
    hint?: string;
    required?: boolean;
    children: React.ReactNode;
  }) {
    return (
      <div>
        <label className="block">
          <span className={labelCls}>
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </span>
          {hint && <span className={hintCls}>{hint}</span>}
          {children}
        </label>
      </div>
    );
  }

  function Section({ title, blurb, children }: { title: string; blurb: string; children: React.ReactNode }) {
    return (
      <section className={`${card} p-5`}>
        <h2 className={`text-sm font-bold ${s.textPrimary}`}>{title}</h2>
        <p className={`text-xs mt-0.5 mb-5 ${s.textMuted}`}>{blurb}</p>
        <div className="space-y-4">{children}</div>
      </section>
    );
  }

  return (
    <ContentEditorShell
      active="settings"
      title="Site Settings"
      description="Your business name, contact details, and operational defaults."
    >
      <div className="space-y-5">
        <Section title="Business identity" blurb="How your business is named and described.">
          <Field label="Business name" required>
            <input
              type="text"
              value={settings.business_name}
              onChange={e => update('business_name', e.target.value)}
              className={input}
              placeholder="e.g. Eko Heritage Hotels"
            />
          </Field>

          <Field label="Legal name (optional)" hint="Used for invoices and legal documents.">
            <input
              type="text"
              value={settings.legal_name ?? ''}
              onChange={e => update('legal_name', e.target.value || null)}
              className={input}
              placeholder="e.g. Eko Heritage Hotels Limited"
            />
          </Field>

          <Field label="Short tagline (optional)" hint="One line. Plain language. Shown in the meta title.">
            <input
              type="text"
              value={settings.tagline_short ?? ''}
              onChange={e => update('tagline_short', e.target.value || null)}
              className={input}
              placeholder="What your business does, in one line"
              maxLength={120}
            />
          </Field>

          <Field label="Founded year (optional)">
            <input
              type="number"
              value={settings.founded_year ?? ''}
              onChange={e => update('founded_year', e.target.value ? parseInt(e.target.value) : null)}
              className={`${input} !w-32`}
              placeholder="2024"
              min={1800}
              max={new Date().getFullYear()}
            />
          </Field>
        </Section>

        <Section title="Contact" blurb="How customers can reach you. Shown across the site.">
          <Field label="Primary phone">
            <input
              type="tel"
              value={settings.primary_phone ?? ''}
              onChange={e => update('primary_phone', e.target.value || null)}
              className={input}
              placeholder="+234 000 000 0000"
            />
          </Field>

          <Field label="WhatsApp number" hint="Used for the WhatsApp button. Often the same as primary phone.">
            <div className="flex gap-2 items-start">
              <input
                type="tel"
                value={settings.whatsapp_phone ?? ''}
                onChange={e => update('whatsapp_phone', e.target.value || null)}
                className={`${input} flex-1`}
                placeholder="+234 000 000 0000"
              />
              {settings.whatsapp_phone && (
                <a
                  href={`https://wa.me/${settings.whatsapp_phone.replace(/[^\d]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={secondaryBtn}
                >
                  Test ↗
                </a>
              )}
            </div>
          </Field>

          <Field label="Primary email">
            <input
              type="email"
              value={settings.primary_email ?? ''}
              onChange={e => update('primary_email', e.target.value || null)}
              className={input}
              placeholder="hello@yourbusiness.com"
            />
          </Field>

          <Field label="Support email (optional)" hint="If different from primary email. Used for help and support inquiries.">
            <input
              type="email"
              value={settings.support_email ?? ''}
              onChange={e => update('support_email', e.target.value || null)}
              className={input}
              placeholder="support@yourbusiness.com"
            />
          </Field>
        </Section>

        <Section title="Operational" blurb="How your site handles money and time.">
          <Field label="Currency">
            <select
              value={settings.default_currency}
              onChange={e => update('default_currency', e.target.value)}
              className={`${input} !w-48`}
            >
              <option value="NGN">Naira (₦)</option>
              <option value="USD">US Dollar ($)</option>
              <option value="EUR">Euro (€)</option>
              <option value="GBP">British Pound (£)</option>
              <option value="GHS">Ghanaian Cedi (₵)</option>
              <option value="KES">Kenyan Shilling (KSh)</option>
              <option value="ZAR">South African Rand (R)</option>
            </select>
          </Field>

          <Field label="Language / locale">
            <select
              value={settings.default_locale}
              onChange={e => update('default_locale', e.target.value)}
              className={`${input} !w-48`}
            >
              <option value="en-NG">English (Nigeria)</option>
              <option value="en-US">English (US)</option>
              <option value="en-GB">English (UK)</option>
              <option value="fr-FR">Français</option>
            </select>
          </Field>

          <Field label="Timezone">
            <select
              value={settings.default_timezone}
              onChange={e => update('default_timezone', e.target.value)}
              className={`${input} !w-64`}
            >
              <option value="Africa/Lagos">Africa/Lagos</option>
              <option value="Africa/Accra">Africa/Accra</option>
              <option value="Africa/Nairobi">Africa/Nairobi</option>
              <option value="Africa/Johannesburg">Africa/Johannesburg</option>
              <option value="Europe/London">Europe/London</option>
              <option value="America/New_York">America/New_York</option>
              <option value="America/Los_Angeles">America/Los_Angeles</option>
            </select>
          </Field>
        </Section>

        <Section title="SEO defaults" blurb="How your site appears in search results and when shared. Individual pages can override these.">
          <Field label="Default meta title" hint="Shown in browser tabs and search results. Around 60 characters.">
            <input
              type="text"
              value={settings.default_meta_title ?? ''}
              onChange={e => update('default_meta_title', e.target.value || null)}
              className={input}
              maxLength={70}
              placeholder="e.g. Eko Heritage Hotels | Boutique stays in Lagos and Abuja"
            />
            <div className={`text-[11px] mt-1 ${s.textMuted}`}>
              {(settings.default_meta_title?.length ?? 0)}/70 characters
            </div>
          </Field>

          <Field label="Default meta description" hint="Shown under the title in search results. 1-2 sentences. Around 155 characters.">
            <textarea
              value={settings.default_meta_description ?? ''}
              onChange={e => update('default_meta_description', e.target.value || null)}
              className={`${input} min-h-[80px]`}
              maxLength={170}
              placeholder="A short description of what you do."
            />
            <div className={`text-[11px] mt-1 ${s.textMuted}`}>
              {(settings.default_meta_description?.length ?? 0)}/170 characters
            </div>
          </Field>

          <Field label="Default share image (OG image)" hint="Shown when your site is shared on social media. 1200×630 pixels recommended.">
            <div className="flex items-start gap-3">
              {settings.default_og_image_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={settings.default_og_image_url}
                  alt=""
                  className={`w-32 h-20 object-cover rounded-md border ${dark ? "border-white/10" : "border-gray-300"}`}
                />
              ) : (
                <div className={`w-32 h-20 rounded-md border border-dashed flex items-center justify-center text-xs ${dark ? "bg-white/[0.04] border-white/10" : "bg-gray-100 border-gray-300"} ${s.textMuted}`}>
                  No image
                </div>
              )}
              <button
                type="button"
                onClick={() => {
                  // Open media picker — implemented separately
                  alert('Open image picker — connect to /admin/media library');
                }}
                className={secondaryBtn}
              >
                Choose image
              </button>
              {settings.default_og_image_url && (
                <button
                  type="button"
                  onClick={() => update('default_og_image_url', null)}
                  className="px-3 py-2 text-xs font-semibold text-red-500 hover:bg-red-500/10 rounded-lg transition"
                >
                  Remove
                </button>
              )}
            </div>
          </Field>
        </Section>
      </div>

      {/* Save bar */}
      <div className={`sticky bottom-0 mt-6 py-3 px-4 rounded-2xl border flex items-center justify-between backdrop-blur ${s.cardBorder} ${dark ? "bg-black/60" : "bg-white/80"}`}>
        <div className="text-xs font-medium">
          {error && <span className="text-red-500">{error}</span>}
          {savedAt && !error && (
            <span className="text-green-500">Saved at {savedAt.toLocaleTimeString()}</span>
          )}
        </div>
        <button type="button" onClick={handleSave} disabled={saving} className={primaryBtn} style={primaryBtnStyle}>
          {saving ? 'Saving…' : 'Save changes'}
        </button>
      </div>
    </ContentEditorShell>
  );
}
