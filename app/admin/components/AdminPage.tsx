export default function AdminPage({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>

      <div className="rounded-xl border bg-white shadow-sm p-6">
        {children}
      </div>
    </div>
  );
}
