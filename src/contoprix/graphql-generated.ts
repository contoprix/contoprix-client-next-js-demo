// GENERATED FILE — produced by @contoprix/codegen from a live tenant GraphQL schema.
// Do not hand-edit. Regenerate with `contoprix graphql generate` (after `contoprix graphql pull`)
// whenever the schema's revision/fingerprint changes.
// Schema revision: 1 (fingerprint d3f998da0b342babfeefb5fbf124661827df1473627c0e270397706b9e1b67b9)
/* eslint-disable */

export interface BlogPost {
  __typename: "BlogPost";
  id: string;
  author: string | null;
  category: string | null;
  content: string;
  cta: Button | null;
  excerpt: string | null;
  featuredImage: Media | null;
  isFeatured: boolean | null;
  publishedAt: DateTime | null;
  readingMinutes: number | null;
  relatedPosts: Array<BlogPost> | null;
  seo: Seo | null;
  slug: string;
  title: string;
}

export interface BlogPostConnection {
  __typename: "BlogPostConnection";
  nodes: Array<BlogPost>;
  totalCount: number;
  pageInfo: PageInfo;
}

export type BlogPostSortField = "PUBLISHED_AT";

export interface BlogPostSortInput {
  field?: BlogPostSortField;
  direction?: SortDirection;
}

export interface BlogPostWhereInput {
  id?: string;
  slug?: string;
}

export interface Button {
  __typename: "Button";
  id: string | null;
  label: string;
  openInNewTab: boolean | null;
  style: string | null;
  url: string;
}

export interface ContentReference {
  __typename: "ContentReference";
  id: string;
}

export type DateTime = unknown;

export interface GeoLocation {
  __typename: "GeoLocation";
  latitude: number | null;
  longitude: number | null;
  address: string | null;
}

export interface Media {
  __typename: "Media";
  id: string;
  url: string;
  mimeType: string | null;
  width: number | null;
  height: number | null;
  altText: string | null;
  caption: string | null;
}

export interface NavigationItem {
  __typename: "NavigationItem";
  id: string;
  name: string;
  slug: string;
  url: string;
  openInNewTab: boolean;
  sortOrder: number;
  children: Array<NavigationItem>;
}

export interface Page {
  __typename: "Page";
  id: string;
  name: string;
  slug: string;
  locale: string;
  blocks: Array<PageBlock>;
}

export interface PageBlock {
  __typename: "PageBlock";
  id: string;
  kind: string;
  regionCode: string;
  content: PageBlockContent | null;
  contents: Array<PageBlockContent | null>;
}

export type PageBlockContent = BlogPost | Button | Seo;

export interface PageInfo {
  __typename: "PageInfo";
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string | null;
  endCursor: string | null;
}

export interface Query {
  __typename: "Query";
  site: Site;
  navigation: Array<NavigationItem>;
  page: Page | null;
  pageById: Page | null;
  blogPost: BlogPostConnection;
}

export interface Seo {
  __typename: "Seo";
  id: string | null;
  metaDescription: string | null;
  metaTitle: string | null;
  socialImage: Media | null;
}

export interface Site {
  __typename: "Site";
  id: string;
  name: string;
  code: string;
  domain: string;
  defaultLanguageCode: string;
}

export type SortDirection = "ASC" | "DESC";

export interface BlogPostQueryVariables {
  after?: string;
  first?: number;
  locale?: string;
  sort?: BlogPostSortInput;
  where?: BlogPostWhereInput;
}

export interface BlogPostQueryResult {
  blogPost: BlogPostConnection;
}

export interface NavigationQueryVariables {
  locale?: string;
}

export interface NavigationQueryResult {
  navigation: Array<NavigationItem>;
}

export interface PageQueryVariables {
  locale?: string;
  path?: string;
}

export interface PageQueryResult {
  page: Page | null;
}

export interface PageByIdQueryVariables {
  id: string;
  locale?: string;
}

export interface PageByIdQueryResult {
  pageById: Page | null;
}

export interface SiteQueryVariables {

}

export interface SiteQueryResult {
  site: Site;
}

