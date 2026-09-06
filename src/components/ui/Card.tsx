export function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-xl2 border border-sand-200 bg-white p-6 shadow-card ${className}`}
    >
      {children}
    </div>
  );
}
