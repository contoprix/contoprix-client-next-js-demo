import { resolveComponentSettings } from "@contoprix/react";
import type { ContoprixComponentProps } from "@contoprix/react";
import type { HeaderComponentSettings } from "@/contoprix/generated";
import Button from "./Button";
import NavigationMenu from "./NavigationMenu";
import { mediaUrl } from "./media";

export default function Header(props: ContoprixComponentProps) {
  const { data, previewAttributes } = resolveComponentSettings<HeaderComponentSettings>(props);
  if (!data) return null;

  const logo = mediaUrl(data.logo);

  return (
    <header
      className={`border-b border-slate-200 bg-white ${data.sticky ? "sticky top-0 z-20" : ""}`}
      {...previewAttributes}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-5 py-4 sm:px-8">
        {logo ? (
          // eslint-disable-next-line @next/next/no-img-element -- media host isn't a configured next/image remote pattern in this demo
          <img src={logo} alt="" className="h-8 w-auto" />
        ) : (
          <span className="text-lg font-semibold text-slate-950">Site</span>
        )}

        {data.navigation ? <NavigationMenu settings={data.navigation as unknown as Record<string, unknown>} /> : null}

        {data.cta ? <Button settings={data.cta as unknown as Record<string, unknown>} /> : null}
      </div>
    </header>
  );
}
