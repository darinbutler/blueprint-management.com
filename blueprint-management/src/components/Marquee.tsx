export default function Marquee({ items }: { items: string[] }) {
  const row = [...items, ...items]; // duplicate for seamless loop
  return (
    <div className="relative overflow-hidden border-y border-ink/10 bg-canvas-paper py-5">
      <div className="flex animate-ticker whitespace-nowrap">
        {row.map((text, i) => (
          <span
            key={i}
            className="mx-10 text-sm uppercase tracking-wider2 text-ink/70"
          >
            {text}
            <span className="ml-10 text-brand-600">◆</span>
          </span>
        ))}
      </div>
    </div>
  );
}
