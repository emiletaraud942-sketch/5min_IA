export function StreakBadge({ days, size = "md" }: { days: number; size?: "sm" | "md" | "lg" }) {
  const sizes = {
    sm: { wrap: "px-2.5 py-1 text-sm gap-1", icon: 16, num: "text-sm" },
    md: { wrap: "px-3.5 py-1.5 text-base gap-1.5", icon: 20, num: "text-base" },
    lg: { wrap: "px-5 py-2.5 gap-2", icon: 28, num: "text-2xl" },
  }[size];

  const active = days > 0;

  return (
    <span
      className={`inline-flex items-center rounded-full font-semibold ${sizes.wrap} ${
        active ? "bg-amber-100 text-amber-800" : "bg-sand-100 text-sand-500"
      }`}
      title={`${days} jour${days > 1 ? "s" : ""} d'affilée`}
    >
      <svg
        width={sizes.icon}
        height={sizes.icon}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M12 2c1 3-2 4.5-2 7.5A3.5 3.5 0 0 0 13.5 13c0-1-.5-1.5-.5-1.5 2 1 3 3 3 5a5 5 0 0 1-10 0c0-3.5 2.5-5 3-8 .3 1 1 1.8 1 1.8S9 7 12 2Z"
          fill={active ? "#d97706" : "#c3b9a4"}
        />
      </svg>
      <span className={sizes.num}>{days}</span>
    </span>
  );
}
