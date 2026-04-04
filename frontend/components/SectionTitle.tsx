export default function SectionTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-6">
      <h1 className="text-3xl font-bold">{title}</h1>
      {subtitle ? <p className="mt-2 max-w-2xl text-slate-400">{subtitle}</p> : null}
    </div>
  );
}
