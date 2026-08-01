import type { Metadata } from "next";

import { ContactForm } from "./ContactForm";
import { getFormsClient } from "@/lib/contoprix/forms.server";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Contact us | Contoprix Demo",
  description: "Send a message using a form delivered by Contoprix.",
};

export default async function ContactUsPage() {
  const formCode = process.env.CONTOPRIX_DEMO_FORM_CODE?.trim() || "contact-us";
  const form = await loadForm(formCode);

  if (form) {
    return <ContactForm form={form} />;
  }

  return (
    <section className="bg-slate-50 px-5 py-20 sm:px-8 lg:py-28">
      <div className="mx-auto max-w-3xl border border-slate-200 bg-white p-8 text-center sm:p-12">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-600">
          Contact us
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
          The contact form is temporarily unavailable
        </h1>
        <p className="mx-auto mt-4 max-w-xl leading-7 text-slate-600">
          Please try again shortly. If the problem continues, verify that the
          published form code is <strong>{formCode}</strong> and that the
          delivery key belongs to this website.
        </p>
      </div>
    </section>
  );
}

async function loadForm(formCode: string) {
  try {
    return await getFormsClient().forms.get(formCode);
  } catch (error) {
    console.error(`Contoprix form "${formCode}" could not be loaded.`, error);
    return null;
  }
}
