"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Check, X } from "lucide-react";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { duration, ease } from "@/lib/motion";

type Mode = "consultation" | "engineering";

const SYSTEMS = [
  "Access control",
  "Surveillance",
  "Automation",
  "Networking",
  "EV charging",
  "Monitoring",
] as const;

const PROPERTY_TYPES = ["Residential", "Commercial", "Multi-unit"] as const;
const FORMATS = ["On site", "Video"] as const;

const COPY: Record<Mode, { title: string; intro: string }> = {
  consultation: {
    title: "Book a consultation",
    intro:
      "45 minutes, on site or by video. We map the property, scope the system, and send a written proposal within a week — no quote on the spot.",
  },
  engineering: {
    title: "Talk to engineering",
    intro:
      "A technical intake for commercial and multi-site work. Tell us what you're running and we'll route you to the right engineer, not a sales desk.",
  },
};

interface FormState {
  name: string;
  email: string;
  phone: string;
  propertyType: string;
  format: string;
  notes: string;
  systems: string[];
}

const EMPTY: FormState = {
  name: "",
  email: "",
  phone: "",
  propertyType: "Residential",
  format: "On site",
  notes: "",
  systems: [],
};

/**
 * Consultation / contact modal. Opened by any element carrying a `data-book`
 * attribute (document-level click delegation), so server-rendered triggers need
 * no client handlers. `data-book="engineering"` opens the technical-intake
 * variant; anything else opens the default consultation flow.
 *
 * No backend — submit validates client-side and resolves to a confirmation
 * state (the demo behaves like a real intake without sending anything).
 *
 * A11y: role="dialog" + aria-modal, focus moves in on open and returns to the
 * trigger on close, Tab is trapped, Escape and backdrop click close, body
 * scroll is locked. Reduced motion drops the panel transform.
 */
export function ConsultationModal() {
  const prefersReducedMotion = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<Mode>("consultation");
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});

  const dialogRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  const ids = useId();
  const fieldId = (name: string) => `${ids}-${name}`;
  const titleId = `${ids}-title`;
  const descId = `${ids}-desc`;

  const close = useCallback(() => setOpen(false), []);

  // Open on any [data-book] click. Capture phase + stopPropagation so it runs
  // before React's <Link> onClick — otherwise a trigger that is also a link
  // (href="#contact" fallback) would navigate as well as open the modal.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const trigger = (e.target as Element | null)?.closest<HTMLElement>("[data-book]");
      if (!trigger) return;
      e.preventDefault();
      e.stopPropagation();
      triggerRef.current = trigger;
      const m: Mode = trigger.getAttribute("data-book") === "engineering" ? "engineering" : "consultation";
      setMode(m);
      setSubmitted(false);
      setErrors({});
      setForm({ ...EMPTY, propertyType: m === "engineering" ? "Commercial" : "Residential" });
      setOpen(true);
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  // Escape, focus trap, scroll lock, focus restore.
  useEffect(() => {
    if (!open) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        close();
        return;
      }
      if (e.key !== "Tab") return;
      const dialog = dialogRef.current;
      if (!dialog) return;
      const focusables = dialog.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);

    const focusTimer = window.setTimeout(() => {
      dialogRef.current
        ?.querySelector<HTMLElement>("input, select, textarea, button")
        ?.focus();
    }, 60);

    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKey);
      window.clearTimeout(focusTimer);
      triggerRef.current?.focus?.();
    };
  }, [open, close]);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const toggleSystem = (s: string) =>
    setForm((f) => ({
      ...f,
      systems: f.systems.includes(s)
        ? f.systems.filter((x) => x !== s)
        : [...f.systems, s],
    }));

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const next: { name?: string; email?: string } = {};
    if (!form.name.trim()) next.name = "Let us know who you are.";
    if (!/.+@.+\..+/.test(form.email)) next.email = "Add an email we can reach you at.";
    setErrors(next);
    if (Object.keys(next).length > 0) {
      dialogRef.current
        ?.querySelector<HTMLElement>(next.name ? `#${fieldId("name")}` : `#${fieldId("email")}`)
        ?.focus();
      return;
    }
    setSubmitted(true);
  };

  const copy = COPY[mode];
  const inputClass =
    "mt-1.5 w-full rounded-lg border border-border bg-bg-1/60 px-3.5 py-2.5 text-sm text-text-hi placeholder:text-text-low focus-visible:border-accent/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40";
  const labelClass = "block text-sm font-medium text-text-mid";

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[60] overflow-y-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: duration.fast / 1000, ease: ease.out }}
            onClick={close}
            className="fixed inset-0 bg-ink-0/75 backdrop-blur-md"
          />

          <div className="relative z-10 flex min-h-full items-start justify-center p-4 sm:items-center sm:p-8">
            <motion.div
              ref={dialogRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby={titleId}
              aria-describedby={descId}
              initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.99 }}
              transition={{ duration: duration.normal / 1000, ease: ease.out }}
              className="relative my-auto w-full max-w-lg overflow-hidden rounded-[1.75rem] border border-border-soft bg-surface shadow-[var(--shadow-2)]"
            >
              <button
                type="button"
                onClick={close}
                aria-label="Close"
                className="absolute right-4 top-4 z-10 grid size-9 place-items-center rounded-full border border-border-soft bg-bg-1/70 text-text-mid backdrop-blur-sm transition-colors hover:border-border hover:text-text-hi focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
              >
                <X size={16} strokeWidth={2} aria-hidden />
              </button>

              {submitted ? (
                <div className="px-7 py-12 text-center sm:px-10">
                  <span className="mx-auto grid size-12 place-items-center rounded-full bg-accent/15 text-accent-bright">
                    <Check size={22} strokeWidth={2.5} aria-hidden />
                  </span>
                  <h2 id={titleId} className="mt-5 font-display text-3xl text-text-hi">
                    Request received.
                  </h2>
                  <p id={descId} className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-text-mid">
                    We&apos;ll be in touch within one business day to set up your
                    walkthrough, on site or by video. You&apos;ll have a written
                    proposal within a week.
                  </p>
                  <button
                    type="button"
                    onClick={close}
                    className="mt-7 inline-flex h-11 items-center justify-center rounded-full bg-text-hi px-6 text-sm font-medium text-ink-0 transition-colors hover:bg-accent-bright focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
                  >
                    Done
                  </button>
                </div>
              ) : (
                <div className="max-h-[88vh] overflow-y-auto px-7 py-8 sm:px-9">
                  <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-accent-bright">
                    Start a project
                  </p>
                  <h2 id={titleId} className="mt-2 font-display text-3xl text-text-hi">
                    {copy.title}
                  </h2>
                  <p id={descId} className="mt-3 text-sm leading-relaxed text-text-mid">
                    {copy.intro}
                  </p>

                  <form noValidate onSubmit={onSubmit} className="mt-7 space-y-5">
                    <div className="grid gap-5 sm:grid-cols-2">
                      <div>
                        <label htmlFor={fieldId("name")} className={labelClass}>
                          Name
                        </label>
                        <input
                          id={fieldId("name")}
                          name="name"
                          type="text"
                          autoComplete="name"
                          value={form.name}
                          onChange={(e) => set("name", e.target.value)}
                          aria-invalid={errors.name ? true : undefined}
                          aria-describedby={errors.name ? fieldId("name-err") : undefined}
                          className={cn(inputClass, errors.name && "border-signal-warm/60")}
                        />
                        {errors.name && (
                          <p id={fieldId("name-err")} className="mt-1.5 text-xs text-signal-warm">
                            {errors.name}
                          </p>
                        )}
                      </div>
                      <div>
                        <label htmlFor={fieldId("email")} className={labelClass}>
                          Email
                        </label>
                        <input
                          id={fieldId("email")}
                          name="email"
                          type="email"
                          autoComplete="email"
                          value={form.email}
                          onChange={(e) => set("email", e.target.value)}
                          aria-invalid={errors.email ? true : undefined}
                          aria-describedby={errors.email ? fieldId("email-err") : undefined}
                          className={cn(inputClass, errors.email && "border-signal-warm/60")}
                        />
                        {errors.email && (
                          <p id={fieldId("email-err")} className="mt-1.5 text-xs text-signal-warm">
                            {errors.email}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2">
                      <div>
                        <label htmlFor={fieldId("phone")} className={labelClass}>
                          Phone <span className="text-text-low">(optional)</span>
                        </label>
                        <input
                          id={fieldId("phone")}
                          name="phone"
                          type="tel"
                          autoComplete="tel"
                          value={form.phone}
                          onChange={(e) => set("phone", e.target.value)}
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label htmlFor={fieldId("property")} className={labelClass}>
                          Property type
                        </label>
                        <select
                          id={fieldId("property")}
                          name="propertyType"
                          value={form.propertyType}
                          onChange={(e) => set("propertyType", e.target.value)}
                          className={inputClass}
                        >
                          {PROPERTY_TYPES.map((t) => (
                            <option key={t} value={t}>
                              {t}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <fieldset>
                      <legend className={labelClass}>
                        What you&apos;re looking to do{" "}
                        <span className="text-text-low">(optional)</span>
                      </legend>
                      <div className="mt-2.5 flex flex-wrap gap-2">
                        {SYSTEMS.map((s) => {
                          const active = form.systems.includes(s);
                          return (
                            <button
                              key={s}
                              type="button"
                              aria-pressed={active}
                              onClick={() => toggleSystem(s)}
                              className={cn(
                                "rounded-full border px-3 py-1.5 text-[13px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60",
                                active
                                  ? "border-accent/40 bg-accent/15 text-text-hi"
                                  : "border-border-soft text-text-mid hover:border-border hover:text-text-hi",
                              )}
                            >
                              {s}
                            </button>
                          );
                        })}
                      </div>
                    </fieldset>

                    <div
                      role="radiogroup"
                      aria-label="Preferred format"
                      className="flex items-center gap-3"
                    >
                      <span className={labelClass}>Preferred format</span>
                      <div className="inline-flex rounded-full border border-border-soft bg-bg-1/60 p-0.5">
                        {FORMATS.map((f) => (
                          <button
                            key={f}
                            type="button"
                            role="radio"
                            aria-checked={form.format === f}
                            onClick={() => set("format", f)}
                            className={cn(
                              "rounded-full px-3.5 py-1.5 text-[13px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60",
                              form.format === f
                                ? "bg-accent/15 text-text-hi"
                                : "text-text-low hover:text-text-mid",
                            )}
                          >
                            {f}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label htmlFor={fieldId("notes")} className={labelClass}>
                        Anything we should know?{" "}
                        <span className="text-text-low">(optional)</span>
                      </label>
                      <textarea
                        id={fieldId("notes")}
                        name="notes"
                        rows={3}
                        value={form.notes}
                        onChange={(e) => set("notes", e.target.value)}
                        className={cn(inputClass, "resize-none")}
                      />
                    </div>

                    <button
                      type="submit"
                      className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-text-hi px-7 text-sm font-medium text-ink-0 transition-colors hover:bg-accent-bright focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
                    >
                      {mode === "engineering" ? "Send to engineering" : "Request consultation"}
                      <ArrowRight size={16} strokeWidth={2} aria-hidden />
                    </button>

                    <p className="text-center text-xs leading-relaxed text-text-low">
                      We use your details only to plan the consultation — no spam,
                      no sales calls, no obligation.
                    </p>
                  </form>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
