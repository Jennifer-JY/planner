import Image from "next/image";
export default function Home() {
  return (
    <div className="h-full flex flex-col justify-center p-4">
      <h1 className="text-2xl font-semibold mb-4">
        See your month. Plan your days.
      </h1>
      <Image
        alt="Student calendar app interface showing tasks for May 2025"
        src="/demo.png"
        height={1010}
        width={2048}
        priority
      />
    </div>
  );
}
