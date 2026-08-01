"use client";

import type {
  ContoprixForm,
  ContoprixFormField,
} from "@contoprix/types";
import { ArrowRight, CheckCircle2, LoaderCircle, Mail, MapPin, Phone } from "lucide-react";
import { FormEvent, useState } from "react";

type ContactFormProps = {
  form: ContoprixForm;
};

type SubmissionState =
  | { status: "idle" }
  | { status: "submitting" }
  | { status: "success"; message: string }
  | { status: "error"; message: string };

export function ContactForm({ form }: ContactFormProps) {
  const [submission, setSubmission] = useState<SubmissionState>({ status: "idle" });

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmission({ status: "submitting" });

    const element = event.currentTarget;
    const values = new FormData(element);
    const data = Object.fromEntries(
      form.fields
        .filter((field) => !field.isHidden && !isPresentationField(field))
        .map((field) => [field.code, readFieldValue(field, values)]),
    );

    try {
      const response = await fetch(`/api/forms/${encodeURIComponent(form.code)}`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          submissionToken: form.submissionToken,
          data,
          honeypot: values.get("company_website") || "",
        }),
      });

      const result = (await response.json().catch(() => null)) as
        | { message?: string }
        | null;

      if (!response.ok) {
        throw new Error(result?.message || "Your message could not be sent.");
      }

      element.reset();
      setSubmission({
        status: "success",
        message: "Thank you. Your message has been sent successfully.",
      });
    } catch (error) {
      setSubmission({
        status: "error",
        message:
          error instanceof Error
            ? error.message
            : "Your message could not be sent. Please try again.",
      });
    }
  }

  return (
    <section className="relative overflow-hidden bg-slate-50 px-5 py-16 sm:px-8 lg:py-24">
      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-slate-200" />
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.78fr_1.22fr] lg:gap-16">
        <aside className="bg-slate-950 p-8 text-white sm:p-10 lg:p-12">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-orange-500">
            Let&apos;s talk
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
            {form.name}
          </h1>
          <p className="mt-5 max-w-md text-base leading-7 text-slate-300">
            {form.description ||
              "Tell us what you are working on. Our team will review your message and get back to you shortly."}
          </p>

          <div className="mt-10 space-y-6 border-t border-white/10 pt-8">
            <ContactItem icon={Mail} label="Email" value="hello@contoprix.com" />
            <ContactItem icon={Phone} label="Phone" value="Talk with our product team" />
            <ContactItem icon={MapPin} label="Availability" value="Remote, worldwide" />
          </div>
        </aside>

        <div className="border border-slate-200 bg-white p-6 sm:p-10 lg:p-12">
          <div className="mb-8">
            <p className="text-sm font-semibold text-orange-600">Send a message</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
              How can we help?
            </h2>
            <p className="mt-3 text-slate-600">
              Fields marked with an asterisk are required.
            </p>
          </div>

          {submission.status === "success" ? (
            <div className="border border-emerald-200 bg-emerald-50 p-6" role="status">
              <CheckCircle2 aria-hidden="true" className="size-8 text-emerald-600" />
              <h3 className="mt-4 text-xl font-semibold text-emerald-950">Message received</h3>
              <p className="mt-2 text-emerald-800">{submission.message}</p>
              <button
                type="button"
                onClick={() => setSubmission({ status: "idle" })}
                className="mt-6 text-sm font-semibold text-emerald-900 underline underline-offset-4"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="grid gap-x-5 gap-y-6 md:grid-cols-2">
              <div className="absolute -left-[10000px]" aria-hidden="true">
                <label htmlFor="company_website">Company website</label>
                <input id="company_website" name="company_website" tabIndex={-1} autoComplete="off" />
              </div>

              {form.fields.map((field) => (
                <FormField key={field.id} field={field} />
              ))}

              <div className="md:col-span-2">
                {submission.status === "error" ? (
                  <p className="mb-4 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800" role="alert">
                    {submission.message}
                  </p>
                ) : null}

                <button
                  type="submit"
                  disabled={submission.status === "submitting"}
                  className="inline-flex min-h-12 items-center justify-center gap-2 bg-orange-600 px-6 font-semibold text-white transition-colors hover:bg-orange-700 disabled:cursor-wait disabled:opacity-65"
                >
                  {submission.status === "submitting" ? (
                    <LoaderCircle aria-hidden="true" className="size-5 animate-spin" />
                  ) : (
                    <ArrowRight aria-hidden="true" className="size-5" />
                  )}
                  {submission.status === "submitting" ? "Sending…" : "Send message"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

function FormField({ field }: { field: ContoprixFormField }) {
  if (field.isHidden) {
    return <input type="hidden" name={field.code} defaultValue={stringDefault(field)} />;
  }

  const type = normalizeType(field.fieldTypeCode);

  if (type === "heading") {
    return <h3 className="text-xl font-semibold text-slate-950 md:col-span-2">{field.label}</h3>;
  }

  if (type === "paragraph" || type === "html" || type === "divider") {
    return (
      <div className="border-t border-slate-200 pt-4 text-sm leading-6 text-slate-600 md:col-span-2">
        {field.description || field.label}
      </div>
    );
  }

  const helpText = field.settings?.helpText || field.description;
  const fullWidth = field.widthPercentage > 50 || isLongField(type);
  const fieldClass = fullWidth ? "md:col-span-2" : "md:col-span-1";
  const inputClass =
    "mt-2 min-h-12 w-full border border-slate-300 bg-white px-4 text-slate-950 outline-none transition focus:border-orange-600 focus:ring-2 focus:ring-orange-100 disabled:bg-slate-100";
  const common = {
    id: field.id,
    name: field.code,
    required: field.isRequired,
    readOnly: field.isReadOnly,
    disabled: field.isReadOnly,
    "aria-describedby": helpText ? `${field.id}-help` : undefined,
  };

  return (
    <div className={fieldClass}>
      <label htmlFor={field.id} className="text-sm font-semibold text-slate-800">
        {field.label}
        {field.isRequired ? <span className="ml-1 text-orange-600">*</span> : null}
      </label>

      {type === "textarea" || type === "richtext" || type === "markdown" ? (
        <textarea
          {...common}
          rows={field.settings?.rows || 5}
          minLength={minimumLength(field)}
          maxLength={maximumLength(field)}
          placeholder={field.settings?.placeholder || undefined}
          defaultValue={stringDefault(field)}
          className={`${inputClass} resize-y py-3`}
        />
      ) : type === "select" || type === "dropdown" || type === "multiselect" ? (
        <select
          {...common}
          multiple={type === "multiselect" || field.settings?.multiple === true}
          defaultValue={multipleDefaults(field)}
          className={inputClass}
        >
          {!field.isRequired ? <option value="">Select an option</option> : null}
          {field.options.filter((option) => !option.isDisabled).map((option) => (
            <option key={option.id} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : type === "radio" ? (
        <div className="mt-3 flex flex-wrap gap-4">
          {field.options.filter((option) => !option.isDisabled).map((option) => (
            <label key={option.id} className="inline-flex items-center gap-2 text-sm text-slate-700">
              <input type="radio" name={field.code} value={option.value} required={field.isRequired} />
              {option.label}
            </label>
          ))}
        </div>
      ) : type === "checkbox" || type === "boolean" || type === "switch" ? (
        <label className="mt-3 inline-flex items-center gap-3 text-sm text-slate-700">
          <input
            id={field.id}
            name={field.code}
            type="checkbox"
            required={field.isRequired}
            disabled={field.isReadOnly}
            defaultChecked={booleanDefault(field)}
            className="size-4 accent-orange-600"
          />
          {field.description || `Yes, ${field.label.toLowerCase()}`}
        </label>
      ) : type === "file" || type === "fileupload" ? (
        <p className="mt-2 border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          File uploads are not enabled in this JSON delivery example.
        </p>
      ) : (
        <input
          {...common}
          type={htmlInputType(type)}
          min={field.validation?.min ?? undefined}
          max={field.validation?.max ?? undefined}
          minLength={minimumLength(field)}
          maxLength={maximumLength(field)}
          pattern={field.validation?.regex || undefined}
          placeholder={field.settings?.placeholder || undefined}
          defaultValue={stringDefault(field)}
          className={inputClass}
        />
      )}

      {helpText ? (
        <p id={`${field.id}-help`} className="mt-2 text-xs leading-5 text-slate-500">
          {helpText}
        </p>
      ) : null}
    </div>
  );
}

function ContactItem({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Mail;
  label: string;
  value: string;
}) {
  return (
    <div className="flex gap-4">
      <div className="flex size-10 shrink-0 items-center justify-center border border-white/15 text-orange-500">
        <Icon aria-hidden="true" className="size-5" />
      </div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{label}</p>
        <p className="mt-1 text-sm text-white">{value}</p>
      </div>
    </div>
  );
}

function normalizeType(value: string) {
  return value.toLowerCase().replace(/[\s_-]/g, "");
}

function isLongField(type: string) {
  return ["textarea", "richtext", "markdown", "html", "paragraph", "heading", "divider", "file", "fileupload"].includes(type);
}

function isPresentationField(field: ContoprixFormField) {
  return ["heading", "paragraph", "html", "divider"].includes(normalizeType(field.fieldTypeCode));
}

function htmlInputType(type: string) {
  if (type === "email") return "email";
  if (type === "url") return "url";
  if (type === "phone" || type === "tel") return "tel";
  if (["number", "integer", "decimal"].includes(type)) return "number";
  if (type === "date") return "date";
  if (type === "datetime" || type === "datetimepicker") return "datetime-local";
  return "text";
}

function minimumLength(field: ContoprixFormField) {
  return field.validation?.minLength ?? field.settings?.minLength ?? undefined;
}

function maximumLength(field: ContoprixFormField) {
  return field.validation?.maxLength ?? field.settings?.maxLength ?? undefined;
}

function parsedDefault(field: ContoprixFormField): unknown {
  if (!field.defaultValueJson) return "";
  try {
    return JSON.parse(field.defaultValueJson);
  } catch {
    return field.defaultValueJson;
  }
}

function stringDefault(field: ContoprixFormField) {
  const value = parsedDefault(field);
  return typeof value === "string" || typeof value === "number" ? String(value) : "";
}

function booleanDefault(field: ContoprixFormField) {
  const value = parsedDefault(field);
  return value === true || value === "true";
}

function multipleDefaults(field: ContoprixFormField): string | string[] {
  const value = parsedDefault(field);
  return Array.isArray(value) ? value.map(String) : String(value || "");
}

function readFieldValue(field: ContoprixFormField, values: FormData): unknown {
  const type = normalizeType(field.fieldTypeCode);

  if (type === "checkbox" || type === "boolean" || type === "switch") {
    return values.has(field.code);
  }

  if (type === "multiselect" || field.settings?.multiple === true) {
    return values.getAll(field.code).map(String);
  }

  const value = values.get(field.code);

  if (["number", "integer", "decimal"].includes(type) && value !== null && String(value) !== "") {
    return Number(value);
  }

  return value === null ? "" : String(value);
}
