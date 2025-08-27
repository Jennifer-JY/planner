import { ReactNode } from "react";

export function DemoCard({
  caption,
  children,
}: {
  caption: string;
  children: ReactNode;
}) {
  return (
    <figure className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl ring-1 ring-black/5">
      <div className="flex items-center gap-2 border-b border-slate-200 bg-slate-50 px-4 py-2">
        <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
        <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
        <span className="h-3 w-3 rounded-full bg-[#28c840]" />
      </div>
      <div className="p-2">{children}</div>
      <figcaption className="px-4 pb-4 pt-1 text-sm text-slate-600">
        {caption}
      </figcaption>
    </figure>
  );
}
