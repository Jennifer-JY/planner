import Image from "next/image";
import { DemoCard } from "./ui/components/demoCard";
export default function Home() {
  return (
    <div className="h-full flex flex-col justify-center p-4">
      <h1 className="text-2xl font-semibold mb-4">
        See your month. Plan your days.
      </h1>
      <section className="mx-auto grid max-w-6xl gap-10 px-6 pb-16 pt-4 md:grid-cols-2">
        <DemoCard caption="Month view — see your plan at a glance and switch months.">
          <Image
            alt="Monthly calendar with month picker"
            src="/demo-month-view.png"
            width={1524}
            height={768}
            className="w-full rounded-lg border border-slate-200 shadow-md"
            priority
          />
        </DemoCard>

        <DemoCard caption="Rich-text editor — edit to-dos with bold, italic, color, highlight, and fonts.">
          <Image
            alt="Todo editor with rich text"
            src="/demo-editor.png"
            width={2048}
            height={733}
            className="w-full rounded-lg border border-slate-200 shadow-md"
          />
        </DemoCard>
      </section>
    </div>
  );
}
