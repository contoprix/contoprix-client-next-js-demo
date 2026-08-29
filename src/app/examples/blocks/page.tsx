import type { Metadata } from "next";

import Accordion from "@/components/contoprix/Accordion";
import AddressComponent from "@/components/contoprix/AddressComponent";
import ApiEndpoint from "@/components/contoprix/ApiEndpoint";
import Callout from "@/components/contoprix/Callout";
import Card from "@/components/contoprix/Card";
import CardGrid from "@/components/contoprix/CardGrid";
import CodeBlock from "@/components/contoprix/CodeBlock";
import ContactInfo from "@/components/contoprix/ContactInfo";
import ContentBlock from "@/components/contoprix/ContentBlock";
import CtaBanner from "@/components/contoprix/CtaBanner";
import DocumentationNavigation from "@/components/contoprix/DocumentationNavigation";
import Email from "@/components/contoprix/Email";
import FaqList from "@/components/contoprix/FaqList";
import FeatureGrid from "@/components/contoprix/FeatureGrid";
import Footer from "@/components/contoprix/Footer";
import Header from "@/components/contoprix/Header";
import HeroCallout from "@/components/contoprix/HeroCallout";
import ImageTextBlock from "@/components/contoprix/ImageTextBlock";
import LinkBlock from "@/components/contoprix/LinkBlock";
import Note from "@/components/contoprix/Note";
import ParameterTable from "@/components/contoprix/ParameterTable";
import Phone from "@/components/contoprix/Phone";
import SocialLinks from "@/components/contoprix/SocialLinks";
import Stat from "@/components/contoprix/Stat";
import StatsGrid from "@/components/contoprix/StatsGrid";
import Step from "@/components/contoprix/Step";
import Steps from "@/components/contoprix/Steps";
import TestimonialCard from "@/components/contoprix/TestimonialCard";
import TestimonialGrid from "@/components/contoprix/TestimonialGrid";
import Tip from "@/components/contoprix/Tip";
import Warning from "@/components/contoprix/Warning";
import type {
  AccordionComponentSettings,
  AddressComponentComponentSettings,
  ApiEndpointComponentSettings,
  CalloutComponentSettings,
  CardComponentSettings,
  CardGridComponentSettings,
  CodeBlockComponentSettings,
  ContactInfoComponentSettings,
  ContentBlockComponentSettings,
  CtaBannerComponentSettings,
  DocumentationNavigationComponentSettings,
  EmailComponentSettings,
  FaqListComponentSettings,
  FeatureGridComponentSettings,
  FooterComponentSettings,
  HeaderComponentSettings,
  HeroCalloutComponentSettings,
  ImageTextComponentSettings,
  LinkComponentSettings,
  NoteComponentSettings,
  ParameterTableComponentSettings,
  PhoneComponentSettings,
  SocialLinksComponentSettings,
  StatComponentSettings,
  StatsGridComponentSettings,
  StepComponentSettings,
  StepsComponentSettings,
  TestimonialCardComponentSettings,
  TestimonialGridComponentSettings,
  TipComponentSettings,
  WarningComponentSettings,
} from "@/contoprix/generated";

export const metadata: Metadata = {
  title: "Block components",
  description: "Every component discovered from the real pulled schema, rendered with sample data.",
};

// Sample fixtures, pulled schema shapes -- these 40 components were just registered in
// src/contoprix/components.ts against the codes returned by a real `contoprix pull` against
// the local dev backend (a documentation-starter + core-website-starter tenant). No page is
// published on that tenant yet, so there's no real block content to render through
// ContoprixRenderer -- this page exercises the same components directly instead.
export default function BlocksExamplePage() {
  return (
    <div className="space-y-14">
      <header>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-600">
          @contoprix/react
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">Block components</h1>
        <p className="mt-4 max-w-2xl leading-7 text-slate-600">
          40 components registered in <code>src/contoprix/components.ts</code>, one per code
          found in the real schema pulled from the local dev backend (documentation + core
          site content types and components). Site chrome, content blocks, marketing, support,
          the documentation toolkit, and info atoms.
        </p>
      </header>

      <Section title="Site chrome">
        <div className="border border-slate-200">
          <Header settings={HEADER as unknown as Record<string, unknown>} />
        </div>
        <div className="border border-slate-200">
          <Footer settings={FOOTER as unknown as Record<string, unknown>} />
        </div>
        <div className="flex gap-8 border border-slate-200 p-6">
          <DocumentationNavigation settings={DOC_NAV as unknown as Record<string, unknown>} />
          <p className="text-sm text-slate-500">← DocumentationNavigation sidebar</p>
        </div>
      </Section>

      <Section title="Content blocks">
        <CardGrid settings={CARD_GRID as unknown as Record<string, unknown>} />
        <div className="max-w-xs">
          <Card settings={CARD as unknown as Record<string, unknown>} />
        </div>
        <FeatureGrid settings={FEATURE_GRID as unknown as Record<string, unknown>} />
        <ContentBlock settings={CONTENT_BLOCK as unknown as Record<string, unknown>} />
        <ImageTextBlock settings={IMAGE_TEXT as unknown as Record<string, unknown>} />
      </Section>

      <Section title="Marketing">
        <HeroCallout settings={HERO_CALLOUT as unknown as Record<string, unknown>} />
        <CtaBanner settings={CTA_BANNER as unknown as Record<string, unknown>} />
        <StatsGrid settings={STATS_GRID as unknown as Record<string, unknown>} />
        <div className="grid max-w-xs gap-4">
          <Stat settings={STAT as unknown as Record<string, unknown>} />
        </div>
      </Section>

      <Section title="Support & social proof">
        <Accordion settings={ACCORDION as unknown as Record<string, unknown>} />
        <FaqList settings={FAQ_LIST as unknown as Record<string, unknown>} />
        <TestimonialGrid settings={TESTIMONIAL_GRID as unknown as Record<string, unknown>} />
        <div className="max-w-sm">
          <TestimonialCard settings={TESTIMONIAL_CARD as unknown as Record<string, unknown>} />
        </div>
      </Section>

      <Section title="Documentation toolkit">
        <div className="space-y-3">
          <Callout settings={CALLOUT_INFO as unknown as Record<string, unknown>} />
          <Callout settings={CALLOUT_DANGER as unknown as Record<string, unknown>} />
          <Note settings={NOTE as unknown as Record<string, unknown>} />
          <Tip settings={TIP as unknown as Record<string, unknown>} />
          <Warning settings={WARNING as unknown as Record<string, unknown>} />
        </div>
        <CodeBlock settings={CODE_BLOCK as unknown as Record<string, unknown>} />
        <Steps settings={STEPS as unknown as Record<string, unknown>} />
        <div className="max-w-md">
          <Step settings={STEP as unknown as Record<string, unknown>} />
        </div>
        <ApiEndpoint settings={API_ENDPOINT as unknown as Record<string, unknown>} />
        <ParameterTable settings={PARAMETER_TABLE_ARRAY as unknown as Record<string, unknown>} />
        <ParameterTable settings={PARAMETER_TABLE_MAP as unknown as Record<string, unknown>} />
      </Section>

      <Section title="Info atoms">
        <div className="flex flex-wrap items-center gap-6">
          <AddressComponent settings={ADDRESS as unknown as Record<string, unknown>} />
          <Email settings={EMAIL as unknown as Record<string, unknown>} />
          <Phone settings={PHONE as unknown as Record<string, unknown>} />
          <LinkBlock settings={LINK as unknown as Record<string, unknown>} />
        </div>
        <ContactInfo settings={CONTACT_INFO as unknown as Record<string, unknown>} />
        <SocialLinks settings={SOCIAL_LINKS as unknown as Record<string, unknown>} />
      </Section>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-6 border-t border-slate-200 pt-10 first:border-t-0 first:pt-0">
      <h2 className="text-lg font-semibold text-slate-950">{title}</h2>
      {children}
    </section>
  );
}

const LINK: LinkComponentSettings = { label: "Learn more", url: "#", target: "_self" };

const HEADER: HeaderComponentSettings = {
  logo: null,
  navigation: {
    name: "Primary",
    items: [
      { label: "Docs", url: "#", icon: null, children: [] },
      { label: "Guides", url: "#", icon: null, children: [{ label: "Getting started", url: "#", icon: null, children: [] }] },
      { label: "API", url: "#", icon: null, children: [] },
    ],
  },
  cta: { label: "Sign in", url: "#", style: "primary", open_in_new_tab: false },
  sticky: false,
};

const FOOTER: FooterComponentSettings = {
  logo: null,
  description: "Documentation and guides for building on the Contoprix platform.",
  navigation_columns: [
    { name: "Product", items: [{ label: "Docs", url: "#", icon: null, children: [] }, { label: "Pricing", url: "#", icon: null, children: [] }] },
    { name: "Company", items: [{ label: "About", url: "#", icon: null, children: [] }, { label: "Blog", url: "#", icon: null, children: [] }] },
  ],
  social_links: { links: [{ platform: "github", url: "#" }, { platform: "x", url: "#" }] },
  copyright_text: "© 2026 Contoprix Technologies Private Limited.",
};

const DOC_NAV: DocumentationNavigationComponentSettings = {
  items: [
    { label: "Getting Started", url: "#", icon: "rocket", children: [] },
    {
      label: "Guides",
      url: "#",
      icon: "book-open",
      children: [
        { label: "Content Modeling", url: "#", icon: null, children: [] },
        { label: "Schema Store", url: "#", icon: null, children: [] },
      ],
    },
    { label: "API Reference", url: "#", icon: "code", children: [] },
  ],
};

const CARD: CardComponentSettings = {
  title: "Schema Store",
  description: "A catalog of importable content types, components, and packs.",
  image: null,
  link: LINK,
};

const CARD_GRID: CardGridComponentSettings = {
  heading: "Explore the platform",
  columns: 3,
  cards: [
    CARD,
    { title: "Delivery API", description: "REST and GraphQL content delivery.", image: null, link: LINK },
    { title: "Visual Editing", description: "Live preview while editors work.", image: null, link: LINK },
  ],
};

const FEATURE_GRID: FeatureGridComponentSettings = {
  heading: "Built for teams",
  subheading: "Everything you need to ship a content-driven site.",
  columns: 3,
  features: [
    { title: "Schema-driven", description: "Content types and components, versioned.", icon: "layout-template", image: null, link: null },
    { title: "Typed SDKs", description: "React, Next.js, Vue, and Nuxt clients.", icon: "code-2", image: null, link: null },
    { title: "Fast delivery", description: "Cached, CDN-backed content API.", icon: "zap", image: null, link: null },
  ],
};

const CONTENT_BLOCK: ContentBlockComponentSettings = {
  heading: "Why a schema store?",
  body: JSON.stringify({
    type: "doc",
    content: [{ type: "paragraph", content: [{ type: "text", text: "A shared catalog means every new site starts from proven, well-designed content types instead of a blank schema." }] }],
  }),
  image: null,
  layout: "stacked",
};

const IMAGE_TEXT: ImageTextComponentSettings = {
  // `image` generates as `string` in generated.ts, but the delivery API actually resolves it
  // to a media object -- see mediaUrl() in media.tsx. Matching that real runtime shape here.
  image: { Url: "https://picsum.photos/seed/contoprix/800/600" } as unknown as string,
  heading: "Visual editing, live",
  body: JSON.stringify({
    type: "doc",
    content: [{ type: "paragraph", content: [{ type: "text", text: "Editors see their changes rendered in the real app, not a preview approximation." }] }],
  }),
  cta: { label: "See it in action", url: "#", style: "outline", open_in_new_tab: false },
};

const HERO_CALLOUT: HeroCalloutComponentSettings = {
  callout_icon: "sparkles",
  description: "Every component on this page was generated straight from a real `contoprix pull`.",
};

const CTA_BANNER: CtaBannerComponentSettings = {
  heading: "Ready to import the schema store?",
  subheading: "Bring content types, components, and packs into your own tenant.",
  button: { label: "Browse the catalog", url: "#", style: "primary", open_in_new_tab: false },
  background_color: "#fff7ed",
};

const STAT: StatComponentSettings = { value: "165", suffix: "+", label: "Catalog components", icon: "layers" };

const STATS_GRID: StatsGridComponentSettings = {
  heading: "The catalog in numbers",
  columns: 4,
  stats: [
    STAT,
    { value: "135", suffix: "", label: "Content types", icon: "database" },
    { value: "16", suffix: "", label: "Starter packs", icon: "package" },
    { value: "43", suffix: "", label: "Field types", icon: "list-checks" },
  ],
};

const ACCORDION: AccordionComponentSettings = {
  heading: "Frequently asked",
  allow_multiple_open: false,
  items: [
    { title: "Is this schema pulled from a real backend?", content: JSON.stringify({ type: "doc", content: [{ type: "paragraph", content: [{ type: "text", text: "Yes -- via `contoprix pull` against the local dev API." }] }] }) },
    { title: "Can I add my own components?", content: JSON.stringify({ type: "doc", content: [{ type: "paragraph", content: [{ type: "text", text: "Import a schema-transfer document through Admin, then pull again." }] }] }) },
  ],
};

const FAQ_LIST: FaqListComponentSettings = {
  heading: "Support FAQ",
  items: [
    { question: "Where do I import a schema?", answer: JSON.stringify({ type: "doc", content: [{ type: "paragraph", content: [{ type: "text", text: "Admin > Contents > Types > Import schema JSON." }] }] }) },
    { question: "Does deleting content free up my quota?", answer: JSON.stringify({ type: "doc", content: [{ type: "paragraph", content: [{ type: "text", text: "Only if your plan has a metered entitlement configured for that resource." }] }] }) },
  ],
};

const TESTIMONIAL_CARD: TestimonialCardComponentSettings = {
  quote: "The schema store cut our project setup time from days to an afternoon.",
  author_name: "Priya Nair",
  author_title: "Head of Platform",
  avatar: null,
  company_logo: null,
  rating: 5,
};

const TESTIMONIAL_GRID: TestimonialGridComponentSettings = {
  heading: "What teams say",
  columns: 3,
  testimonials: [
    TESTIMONIAL_CARD,
    { quote: "Typed SDKs meant zero guesswork integrating content.", author_name: "Marcus Webb", author_title: "Engineering Lead", avatar: null, company_logo: null, rating: 4 },
  ],
};

const CALLOUT_INFO: CalloutComponentSettings = {
  type: "info",
  title: "Heads up",
  content: JSON.stringify({ type: "doc", content: [{ type: "paragraph", content: [{ type: "text", text: "This callout renders rich text through the same ProseMirror renderer as blog content." }] }] }),
};

const CALLOUT_DANGER: CalloutComponentSettings = {
  type: "danger",
  title: "Breaking change",
  content: JSON.stringify({ type: "doc", content: [{ type: "paragraph", content: [{ type: "text", text: "Removing a field from a live content type is destructive -- export first." }] }] }),
};

const NOTE: NoteComponentSettings = {
  content: JSON.stringify({ type: "doc", content: [{ type: "paragraph", content: [{ type: "text", text: "note, tip, and warning all share this same compact single-content shape." }] }] }),
};

const TIP: TipComponentSettings = {
  content: JSON.stringify({ type: "doc", content: [{ type: "paragraph", content: [{ type: "text", text: "Run `contoprix generate` after every pull to keep types in sync." }] }] }),
};

const WARNING: WarningComponentSettings = {
  content: JSON.stringify({ type: "doc", content: [{ type: "paragraph", content: [{ type: "text", text: "Client secrets belong in .env.local, never committed." }] }] }),
};

const CODE_BLOCK: CodeBlockComponentSettings = {
  filename: "components.ts",
  language: "typescript",
  show_line_numbers: true,
  code: `export const components: ComponentRegistry = {\n  "header": Header,\n  "footer": Footer,\n  "card_grid": CardGrid,\n};`,
};

const STEPS: StepsComponentSettings = {
  heading: "Getting your schema live",
  steps: [
    { number: 1, title: "Author the schema", content: JSON.stringify({ type: "doc", content: [{ type: "paragraph", content: [{ type: "text", text: "Write a schema-transfer JSON document." }] }] }), image: null },
    { number: 2, title: "Import it", content: JSON.stringify({ type: "doc", content: [{ type: "paragraph", content: [{ type: "text", text: "Admin > Contents > Types > Import schema JSON." }] }] }), image: null },
    { number: 3, title: "Pull + generate", content: JSON.stringify({ type: "doc", content: [{ type: "paragraph", content: [{ type: "text", text: "`contoprix pull && contoprix generate`." }] }] }), image: null },
  ],
};

const STEP: StepComponentSettings = {
  number: 1,
  title: "Install the CLI",
  content: JSON.stringify({ type: "doc", content: [{ type: "paragraph", content: [{ type: "text", text: "`npm install -D @contoprix/cli`" }] }] }),
  image: null,
};

const API_ENDPOINT: ApiEndpointComponentSettings = {
  method: "POST",
  path: "/api/delivery/content/{contentType}",
  description: "List a content collection with pagination and filters.",
};

const PARAMETER_TABLE_ARRAY: ParameterTableComponentSettings = {
  // `parameters` generates as `Record<string, unknown>` (the JSON field's TS type is a rough
  // approximation), but ParameterTable.tsx also handles the array-of-rows shape editors would
  // plausibly enter -- see the component for both shapes it renders.
  parameters: [
    { name: "contentType", type: "string", required: "yes", description: "The content type code." },
    { name: "take", type: "number", required: "no", description: "Page size, default 20." },
  ] as unknown as Record<string, unknown>,
};

const PARAMETER_TABLE_MAP: ParameterTableComponentSettings = {
  parameters: { baseUrl: "https://your-tenant.contoprix.site", deliveryKey: "dpk_..." },
};

const ADDRESS: AddressComponentComponentSettings = {
  street_1: "221B Baker Street",
  street_2: null,
  city: "London",
  region: null,
  postal_code: "NW1 6XE",
  country: "United Kingdom",
};

const EMAIL: EmailComponentSettings = { label: "Support", address: "support@contoprix.com" };
const PHONE: PhoneComponentSettings = { label: "Sales", number: "+1 (555) 010-1234" };

const CONTACT_INFO: ContactInfoComponentSettings = {
  address: ADDRESS,
  phones: [PHONE],
  emails: [EMAIL],
  hours: "Mon–Fri, 9am–6pm GMT",
};

const SOCIAL_LINKS: SocialLinksComponentSettings = {
  links: [
    { platform: "github", url: "#" },
    { platform: "linkedin", url: "#" },
    { platform: "x", url: "#" },
    { platform: "youtube", url: "#" },
  ],
};
