import type { Metadata } from "next";

import ArticleCard from "@/components/contoprix/ArticleCard";
import AwardCard from "@/components/contoprix/AwardCard";
import CaseStudyCard from "@/components/contoprix/CaseStudyCard";
import CourseCard from "@/components/contoprix/CourseCard";
import DocArticleCard from "@/components/contoprix/DocArticleCard";
import DoctorCard from "@/components/contoprix/DoctorCard";
import HelpArticleCard from "@/components/contoprix/HelpArticleCard";
import ListingCard from "@/components/contoprix/ListingCard";
import NeighborhoodCard from "@/components/contoprix/NeighborhoodCard";
import OfferCard from "@/components/contoprix/OfferCard";
import ResourceCard from "@/components/contoprix/ResourceCard";
import ServiceCard from "@/components/contoprix/ServiceCard";
import WebinarCard from "@/components/contoprix/WebinarCard";
import type {
  ArticleCardComponentSettings,
  AwardCardComponentSettings,
  CaseStudyCardComponentSettings,
  CourseCardComponentSettings,
  DocArticleCardComponentSettings,
  DoctorCardComponentSettings,
  HelpArticleCardComponentSettings,
  ListingCardComponentSettings,
  NeighborhoodCardComponentSettings,
  OfferCardComponentSettings,
  ResourceCardComponentSettings,
  ServiceCardComponentSettings,
  WebinarCardComponentSettings,
} from "@/contoprix/generated";
import { CodeBlock } from "../CodeBlock";

export const metadata: Metadata = {
  title: "Card components",
  description: "Every catalog card gap filled in contoprix-schema-store, rendered as SDK components.",
};

// Sample fixtures, not live delivery data -- these 12 components were just added to
// contoprix-schema-store/components/*.json and aren't in this tenant's schema yet. Import the
// matching pack through Admin > Contents > Types > Import schema JSON, author some entries, then
// swap a section for a real client.content.list() call -- same as BlogPostList on the home page.
export default function CardsExamplePage() {
  return (
    <div className="space-y-14">
      <header>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-600">
          @contoprix/react
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">Card components</h1>
        <p className="mt-4 max-w-2xl leading-7 text-slate-600">
          12 registered components in <code>src/contoprix/components.ts</code>, one per catalog
          gap filled in <code>contoprix-schema-store</code> -- domains that had content types but
          no matching summary-card component (or, for Education, none at all). Each is typed
          against its own <code>*ComponentSettings</code> shape and renders through{" "}
          <code>ContoprixRenderer</code> exactly like <code>Button</code> or{" "}
          <code>HeroBanner</code> once a real page serves that block.
        </p>
      </header>

      <CardSection
        title="Education"
        description="course_card -- packs/education-starter.json"
      >
        <CourseCard settings={COURSE as unknown as Record<string, unknown>} />
        <CourseCard settings={COURSE_FREE as unknown as Record<string, unknown>} />
        <CourseCard settings={COURSE_ADVANCED as unknown as Record<string, unknown>} />
      </CardSection>

      <CardSection
        title="Publishing"
        description="article_card, case_study_card -- packs/content-marketing-starter.json"
      >
        <ArticleCard settings={ARTICLE as unknown as Record<string, unknown>} />
        <CaseStudyCard settings={CASE_STUDY as unknown as Record<string, unknown>} />
      </CardSection>

      <CardSection title="Core Content" description="resource_card -- packs/core-website-starter.json">
        <ResourceCard settings={RESOURCE_GUIDE as unknown as Record<string, unknown>} />
        <ResourceCard settings={RESOURCE_WHITEPAPER as unknown as Record<string, unknown>} />
      </CardSection>

      <CardSection title="Healthcare" description="doctor_card, service_card -- packs/healthcare-starter.json">
        <DoctorCard settings={DOCTOR as unknown as Record<string, unknown>} />
        <ServiceCard settings={SERVICE as unknown as Record<string, unknown>} />
      </CardSection>

      <CardSection title="Directory" description="listing_card -- packs/directory-starter.json">
        <ListingCard settings={LISTING as unknown as Record<string, unknown>} />
      </CardSection>

      <CardSection title="Events" description="webinar_card -- packs/events-starter.json">
        <WebinarCard settings={WEBINAR_UPCOMING as unknown as Record<string, unknown>} />
        <WebinarCard settings={WEBINAR_ON_DEMAND as unknown as Record<string, unknown>} />
      </CardSection>

      <CardSection title="Real Estate" description="neighborhood_card -- packs/real-estate-starter.json">
        <NeighborhoodCard settings={NEIGHBORHOOD as unknown as Record<string, unknown>} />
      </CardSection>

      <CardSection title="Commerce" description="offer_card -- packs/ecommerce-catalog-starter.json">
        <OfferCard settings={OFFER as unknown as Record<string, unknown>} />
      </CardSection>

      <CardSection title="Marketing" description="award_card -- packs/marketing-website-starter.json">
        <AwardCard settings={AWARD as unknown as Record<string, unknown>} />
      </CardSection>

      <CardSection title="Documentation" description="doc_article_card -- packs/documentation-starter.json">
        <DocArticleCard settings={DOC_ARTICLE as unknown as Record<string, unknown>} />
      </CardSection>

      <CardSection title="Support" description="help_article_card -- packs/help-center-starter.json">
        <HelpArticleCard settings={HELP_ARTICLE as unknown as Record<string, unknown>} />
      </CardSection>

      <section className="space-y-3 border-t border-slate-200 pt-10">
        <h2 className="text-lg font-semibold text-slate-950">Wiring one up</h2>
        <p className="max-w-2xl text-sm leading-6 text-slate-600">
          Every card follows the same shape: a typed component keyed on the schema&apos;s
          <code> component code</code> in <code>components.ts</code>, reading a generated{" "}
          <code>*ComponentSettings</code> interface.
        </p>
        <CodeBlock
          label="src/contoprix/components.ts"
          code={`export const components: ComponentRegistry = {\n  ...\n  "webinar_card": WebinarCard,\n  ...\n};`}
        />
      </section>
    </div>
  );
}

function CardSection({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-slate-950">{title}</h2>
        <p className="mt-1 text-sm text-slate-500">{description}</p>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{children}</div>
    </section>
  );
}

const LINK = { label: "Learn more", url: "#", target: "_self" as const };

const COURSE: CourseCardComponentSettings = {
  title: "Design Systems Fundamentals",
  instructor_name: "Priya Nair",
  level: "beginner",
  duration: "4 hours",
  lesson_count: 18,
  rating: 4.8,
  price: 0,
  link: { label: "Start course", url: "#", target: "_self" },
};
const COURSE_FREE: CourseCardComponentSettings = {
  title: "Content Modeling for Headless CMS",
  instructor_name: "Elena Torres",
  level: "intermediate",
  duration: "6.5 hours",
  lesson_count: 24,
  rating: 4.9,
  price: 49,
  link: { label: "Enroll now", url: "#", target: "_self" },
};
const COURSE_ADVANCED: CourseCardComponentSettings = {
  title: "Advanced React Server Components",
  instructor_name: "Marcus Webb",
  level: "advanced",
  duration: "9 hours",
  lesson_count: 32,
  rating: 4.6,
  price: 79,
  link: { label: "Enroll now", url: "#", target: "_self" },
};

const ARTICLE: ArticleCardComponentSettings = {
  title: "Shipping a schema-driven design system in six weeks",
  summary: "How the platform team modeled components once and reused them across five marketing sites.",
  category: "Engineering",
  author_name: "Jordan Blake",
  published_at: "2026-07-14",
  link: LINK,
};

const CASE_STUDY: CaseStudyCardComponentSettings = {
  title: "Cutting time-to-publish by 70% for a global retailer",
  client_name: "Northwind Retail",
  industry: "Retail",
  summary: "A phased content-model migration that let regional teams launch pages without engineering.",
  link: { label: "Read case study", url: "#", target: "_self" },
};

const RESOURCE_GUIDE: ResourceCardComponentSettings = {
  title: "The Content Modeling Playbook",
  description: "A step-by-step guide to structuring reusable content types and components.",
  resource_type: "guide",
  gated: false,
  link: { label: "Download", url: "#", target: "_self" },
};
const RESOURCE_WHITEPAPER: ResourceCardComponentSettings = {
  title: "Headless CMS Buyer's Guide 2026",
  description: "What to evaluate before migrating off a monolithic CMS.",
  resource_type: "whitepaper",
  gated: true,
  link: { label: "Download", url: "#", target: "_self" },
};

const DOCTOR: DoctorCardComponentSettings = {
  name: "Dr. Amara Chen",
  specialty: "Cardiology",
  credentials: "MD, FACC",
  location: "Downtown Clinic",
  accepting_new_patients: true,
  link: { label: "View profile", url: "#", target: "_self" },
};

const SERVICE: ServiceCardComponentSettings = {
  name: "Preventive Care",
  category: "Primary Care",
  description: "Annual checkups, screenings, and vaccinations for the whole family.",
  icon: "heart-pulse",
  link: { label: "Book a visit", url: "#", target: "_self" },
};

const LISTING: ListingCardComponentSettings = {
  name: "Riverside Coffee Roasters",
  category: "Cafe",
  rating: 4.7,
  location: "12 Harbor St, Portland",
  link: { label: "View listing", url: "#", target: "_self" },
};

const WEBINAR_UPCOMING: WebinarCardComponentSettings = {
  title: "Scaling Content Operations with a Schema Store",
  presenter_name: "Priya Nair",
  scheduled_at: "2026-09-18T17:00:00.000Z",
  duration_minutes: 45,
  status: "upcoming",
  link: { label: "Register", url: "#", target: "_self" },
};
const WEBINAR_ON_DEMAND: WebinarCardComponentSettings = {
  title: "Migrating to Headless: Lessons from 20 Teams",
  presenter_name: "Marcus Webb",
  duration_minutes: 38,
  status: "on_demand",
  link: { label: "Watch now", url: "#", target: "_self" },
};

const NEIGHBORHOOD: NeighborhoodCardComponentSettings = {
  name: "Pearl District",
  description: "Walkable, art-gallery-lined blocks with converted warehouse lofts.",
  property_count: 42,
  price_range: "$400K - $1.2M",
  link: { label: "Browse homes", url: "#", target: "_self" },
};

const OFFER: OfferCardComponentSettings = {
  title: "End of Season Sale",
  description: "Take 20% off all outdoor furniture through the end of the month.",
  discount_percent: 20,
  code: "OUTDOOR20",
  valid_to: "2026-09-30",
  link: { label: "Shop the sale", url: "#", target: "_self" },
};

const AWARD: AwardCardComponentSettings = {
  title: "Best Developer Tool",
  issuer: "DevTools Weekly",
  year: 2026,
  description: "Recognized for the schema-driven component workflow.",
};

const DOC_ARTICLE: DocArticleCardComponentSettings = {
  title: "Registering a custom SDK component",
  summary: "Map a schema component code to a typed React component in five minutes.",
  category: "Guides",
  difficulty: "beginner",
  estimated_time: "5 min",
  link: LINK,
};

const HELP_ARTICLE: HelpArticleCardComponentSettings = {
  title: "Why isn't my new component rendering?",
  excerpt: "Check that the component code in components.ts matches the schema exactly.",
  category: "Troubleshooting",
  icon: "life-buoy",
  link: LINK,
};
