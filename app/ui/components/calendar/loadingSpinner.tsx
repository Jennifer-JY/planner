export default function FullScreenSpinner({
  label = "Loading…",
}: {
  label?: string;
}) {
  return (
    <div
      className="fixed inset-0 grid place-items-center bg-white/60 backdrop-blur-sm z-50"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="flex flex-row items-center gap-3">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-[#1574E9]" />
        <span className="text-sm text-gray-700">{label}</span>
      </div>
    </div>
  );
}
