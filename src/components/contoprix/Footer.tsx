import { resolveComponentSettings } from "@contoprix/react";
import type { ContoprixComponentProps } from "@contoprix/react";
import type { FooterComponentSettings } from "@/contoprix/generated";
import SocialLinks from "./SocialLinks";
import { mediaUrl } from "./media";

export default function Footer(props: ContoprixComponentProps) {
  const { data, previewAttributes } = resolveComponentSettings<FooterComponentSettings>(props);
  if (!data) return null;

  const logo = mediaUrl(data.logo);
  const columns = data.navigation_columns ?? [];

  return (
    <footer className="border-t border-slate-200 bg-slate-50" {...previewAttributes}>
      <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8">
        <div className="grid gap-10 sm:grid-cols-[1fr_auto] sm:gap-16">
          <div className="max-w-sm space-y-4">
            {logo ? (
              // eslint-disable-next-line @next/next/no-img-element -- media host isn't a configured next/image remote pattern in this demo
              <img src={logo} alt="" className="h-8 w-auto" />
            ) : null}
            {data.description ? <p className="text-sm leading-6 text-slate-600">{data.description}</p> : null}
            {data.social_links ? <SocialLinks settings={data.social_links as unknown as Record<string, unknown>} /> : null}
          </div>

          {columns.length > 0 ? (
            <div className="flex flex-wrap gap-10">
              {columns.map((column, index) => (
                <div key={`${column.name}-${index}`} className="space-y-2">
                  {column.name ? (
                    <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">{column.name}</p>
                  ) : null}
                  <ul className="space-y-2">
                    {(column.items ?? []).map((item, itemIndex) => (
                      <li key={`${item.label}-${itemIndex}`}>
                        <a href={item.url ?? "#"} className="text-sm text-slate-600 hover:text-orange-600">
                          {item.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ) : null}
        </div>

        {data.copyright_text ? (
          <p className="mt-10 border-t border-slate-200 pt-6 text-xs text-slate-500">{data.copyright_text}</p>
        ) : null}
      </div>
    </footer>
  );
}
