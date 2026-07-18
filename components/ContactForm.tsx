"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sent">("idle");
  const [subject, setSubject] = useState("Next-drop list");

  const subjects = [
    "Next-drop list",
    "Product enquiry",
    "Custom fit",
    "Wholesale / press",
    "Something else",
  ];

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("sent");
  };

  return (
    <AnimatePresence mode="wait">
      {status === "idle" ? (
        <motion.form
          key="form"
          onSubmit={onSubmit}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Field label="Your name" name="name" required />
            <Field label="Email" name="email" type="email" required />
          </div>

          <div>
            <label className="eyebrow block mb-3">Reason</label>
            <div className="flex flex-wrap gap-2">
              {subjects.map((s) => (
                <button
                  type="button"
                  key={s}
                  onClick={() => setSubject(s)}
                  className={`px-4 py-2 rounded-full text-sm border transition-all ${
                    subject === s
                      ? "bg-ink text-card border-ink"
                      : "border-border-strong text-ink-soft hover:text-ink hover:border-ink"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
            <input type="hidden" name="subject" value={subject} />
          </div>

          <div>
            <label htmlFor="message" className="eyebrow block mb-3">
              Tell us more
            </label>
            <textarea
              id="message"
              name="message"
              rows={5}
              required
              className="w-full bg-card border border-border rounded-sm p-4 text-ink placeholder:text-ink-muted focus:border-accent focus:outline-none transition-colors font-body"
              placeholder="What are you thinking about?"
            />
          </div>

          <button
            type="submit"
            className="btn-primary"
          >
            Send note
            <span aria-hidden>→</span>
          </button>
        </motion.form>
      ) : (
        <motion.div
          key="sent"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-border rounded-sm p-10 text-center"
        >
          <div className="eyebrow mb-3">Note received</div>
          <h3 className="h-display text-ink mb-3" style={{ fontSize: "clamp(28px, 4vw, 42px)" }}>
            Thank you.
          </h3>
          <p className="text-ink-soft">
            We&rsquo;ll write back within one working day.
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Field({
  label,
  name,
  type = "text",
  required = false,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label htmlFor={name} className="eyebrow block mb-2">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        className="w-full bg-card border border-border rounded-sm px-4 py-3 text-ink placeholder:text-ink-muted focus:border-accent focus:outline-none transition-colors"
      />
    </div>
  );
}
