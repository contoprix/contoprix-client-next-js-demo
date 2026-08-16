export function CodeBlock({ code, label }: { code: string; label?: string }) {
  return (
    <div className="overflow-hidden border border-slate-200 bg-slate-950">
      {label ? (
        <div className="border-b border-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.15em] text-slate-400">
          {label}
        </div>
      ) : null}
      <pre className="overflow-x-auto px-4 py-4 text-xs leading-6 text-slate-100">
        <code>{code}</code>
      </pre>
    </div>
  );
}

export function JsonBlock({ value, label }: { value: unknown; label?: string }) {
  return <CodeBlock label={label ?? "Response"} code={JSON.stringify(value, null, 2)} />;
}
