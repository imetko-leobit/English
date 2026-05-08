"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/flashcards", label: "Картки" },
  { href: "/dictionary", label: "Словник" },
  { href: "/statistics", label: "Статистика" },
  { href: "/grammar", label: "Граматика" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-52 shrink-0 border-r border-gray-800 bg-gray-900 flex flex-col min-h-screen">
      <div className="px-5 py-6 border-b border-gray-800">
        <span className="text-sm font-semibold tracking-wide text-gray-100 uppercase">
          English
        </span>
      </div>
      <nav className="flex flex-col pt-2 flex-1">
        {NAV.map(({ href, label }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={[
                "flex items-center px-5 py-3 text-sm font-medium transition-colors border-l-2",
                active
                  ? "border-gray-100 text-gray-100 bg-gray-800"
                  : "border-transparent text-gray-400 hover:text-gray-100 hover:bg-gray-800",
              ].join(" ")}
            >
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
