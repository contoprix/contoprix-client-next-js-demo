import type { ComponentRegistry } from "@contoprix/react";

import Accordion from "@/components/contoprix/Accordion";
import AccordionItem from "@/components/contoprix/AccordionItem";
import AddressComponent from "@/components/contoprix/AddressComponent";
import ApiEndpoint from "@/components/contoprix/ApiEndpoint";
import ArticleCard from "@/components/contoprix/ArticleCard";
import AwardCard from "@/components/contoprix/AwardCard";
import BlogPostDetail from "@/components/contoprix/BlogPostDetail";
import BlogPostList from "@/components/contoprix/BlogPostList";
import Button from "@/components/contoprix/Button";
import Callout from "@/components/contoprix/Callout";
import Canonical from "@/components/contoprix/Canonical";
import CapabilitiesSection from "@/components/contoprix/CapabilitiesSection";
import Card from "@/components/contoprix/Card";
import CardGrid from "@/components/contoprix/CardGrid";
import CaseStudyCard from "@/components/contoprix/CaseStudyCard";
import CodeBlock from "@/components/contoprix/CodeBlock";
import ContactInfo from "@/components/contoprix/ContactInfo";
import ContentBlock from "@/components/contoprix/ContentBlock";
import ContentList from "@/components/contoprix/ContentList";
import CourseCard from "@/components/contoprix/CourseCard";
import CtaBanner from "@/components/contoprix/CtaBanner";
import DocArticleCard from "@/components/contoprix/DocArticleCard";
import DoctorCard from "@/components/contoprix/DoctorCard";
import DocumentationNavigation from "@/components/contoprix/DocumentationNavigation";
import DocumentationPageList from "@/components/contoprix/DocumentationPageList";
import Email from "@/components/contoprix/Email";
import FaqItem from "@/components/contoprix/FaqItem";
import FaqList from "@/components/contoprix/FaqList";
import FeatureCard from "@/components/contoprix/FeatureCard";
import FeatureGrid from "@/components/contoprix/FeatureGrid";
import Footer from "@/components/contoprix/Footer";
import Header from "@/components/contoprix/Header";
import HelpArticleCard from "@/components/contoprix/HelpArticleCard";
import HeroBanner from "@/components/contoprix/HeroBanner";
import HeroCallout from "@/components/contoprix/HeroCallout";
import ImageTextBlock from "@/components/contoprix/ImageTextBlock";
import LinkBlock from "@/components/contoprix/LinkBlock";
import ListingCard from "@/components/contoprix/ListingCard";
import MenuItem from "@/components/contoprix/MenuItem";
import NavigationMenu from "@/components/contoprix/NavigationMenu";
import NeighborhoodCard from "@/components/contoprix/NeighborhoodCard";
import Note from "@/components/contoprix/Note";
import OfferCard from "@/components/contoprix/OfferCard";
import OpenGraph from "@/components/contoprix/OpenGraph";
import ParameterTable from "@/components/contoprix/ParameterTable";
import Phone from "@/components/contoprix/Phone";
import ResourceCard from "@/components/contoprix/ResourceCard";
import Seo from "@/components/contoprix/Seo";
import ServiceCard from "@/components/contoprix/ServiceCard";
import SocialLink from "@/components/contoprix/SocialLink";
import SocialLinks from "@/components/contoprix/SocialLinks";
import Stat from "@/components/contoprix/Stat";
import StatsGrid from "@/components/contoprix/StatsGrid";
import Step from "@/components/contoprix/Step";
import Steps from "@/components/contoprix/Steps";
import StructuredData from "@/components/contoprix/StructuredData";
import TestimonialCard from "@/components/contoprix/TestimonialCard";
import TestimonialGrid from "@/components/contoprix/TestimonialGrid";
import Tip from "@/components/contoprix/Tip";
import TwitterCard from "@/components/contoprix/TwitterCard";
import Warning from "@/components/contoprix/Warning";
import WebinarCard from "@/components/contoprix/WebinarCard";

// Custom overrides for every renderable type in the current schema (`npx contoprix validate`
// reports coverage). Anything NOT in this registry -- a brand-new component type added after
// the last `contoprix pull`, or a form/content-entry block -- still falls through to the
// SDK's schema-driven GenericBlockRenderer or the MissingComponent placeholder. See
// "How rendering works" in the README for the exact resolution order.
//
// "*_card" entries below (course_card, article_card, etc.) are pending a real schema import --
// see the "Manually added ahead of a real import" block in generated.ts.
export const components: ComponentRegistry = {
  "accordion": Accordion,
  "accordion_item": AccordionItem,
  "address_component": AddressComponent,
  "api_endpoint": ApiEndpoint,
  "article_card": ArticleCard,
  "award_card": AwardCard,
  "blog_post-detail": BlogPostDetail,
  "blog_post-list": BlogPostList,
  "button": Button,
  "callout": Callout,
  "canonical": Canonical,
  "capabilities_section": CapabilitiesSection,
  "card": Card,
  "card_grid": CardGrid,
  "case_study_card": CaseStudyCard,
  "code_block": CodeBlock,
  "contact_info": ContactInfo,
  "content_block": ContentBlock,
  "content-list": ContentList,
  "course_card": CourseCard,
  "cta_banner": CtaBanner,
  "doc_article_card": DocArticleCard,
  "doctor_card": DoctorCard,
  "documentation_navigation": DocumentationNavigation,
  "documentation_page-list": DocumentationPageList,
  "email": Email,
  "faq_item": FaqItem,
  "faq_list": FaqList,
  "feature_card": FeatureCard,
  "feature_grid": FeatureGrid,
  "footer": Footer,
  "header": Header,
  "help_article_card": HelpArticleCard,
  "hero_banner": HeroBanner,
  "hero_callout": HeroCallout,
  "image_text": ImageTextBlock,
  "link": LinkBlock,
  "listing_card": ListingCard,
  "menu_item_component": MenuItem,
  "navigation_menu": NavigationMenu,
  "neighborhood_card": NeighborhoodCard,
  "note": Note,
  "offer_card": OfferCard,
  "open_graph": OpenGraph,
  "parameter_table": ParameterTable,
  "phone": Phone,
  "resource_card": ResourceCard,
  "seo": Seo,
  "service_card": ServiceCard,
  "social_link": SocialLink,
  "social_links": SocialLinks,
  "stat": Stat,
  "stats_grid": StatsGrid,
  "step": Step,
  "steps": Steps,
  "structured_data": StructuredData,
  "testimonial_card": TestimonialCard,
  "testimonial_grid": TestimonialGrid,
  "tip": Tip,
  "twitter_card": TwitterCard,
  "warning": Warning,
  "webinar_card": WebinarCard,
};

export default components;
