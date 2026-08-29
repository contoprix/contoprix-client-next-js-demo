import { resolveComponentSettings } from "@contoprix/react";
import type { ContoprixComponentProps } from "@contoprix/react";
import type { ContactInfoComponentSettings } from "@/contoprix/generated";
import AddressComponent from "./AddressComponent";
import Email from "./Email";
import Phone from "./Phone";

export default function ContactInfo(props: ContoprixComponentProps) {
  const { data, previewAttributes } = resolveComponentSettings<ContactInfoComponentSettings>(props);
  if (!data) return null;

  const phones = data.phones ?? [];
  const emails = data.emails ?? [];
  if (!data.address && phones.length === 0 && emails.length === 0 && !data.hours) return null;

  return (
    <div className="space-y-3" {...previewAttributes}>
      {data.address ? <AddressComponent settings={data.address as unknown as Record<string, unknown>} /> : null}
      {phones.length > 0 ? (
        <div className="flex flex-col gap-1">
          {phones.map((phone, index) => (
            <Phone key={`${phone.number}-${index}`} settings={phone as unknown as Record<string, unknown>} />
          ))}
        </div>
      ) : null}
      {emails.length > 0 ? (
        <div className="flex flex-col gap-1">
          {emails.map((email, index) => (
            <Email key={`${email.address}-${index}`} settings={email as unknown as Record<string, unknown>} />
          ))}
        </div>
      ) : null}
      {data.hours ? <p className="text-sm text-slate-600">{data.hours}</p> : null}
    </div>
  );
}
