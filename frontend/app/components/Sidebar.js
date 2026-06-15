"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  const menu = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Calculator", path: "/" },
    { name: "Leads", path: "/leads" },
    { name: "Follow Ups", path: "/followups" },
  ];

  return (
    <div className="w-64 h-screen fixed left-0 top-0 bg-slate-900 text-white p-6" >
      <h1 className="text-2xl font-bold mb-8">
        Solar Sales OS
      </h1>

      <div className="space-y-2">
        {menu.map((item) => (
          <Link
            key={item.path}
            href={item.path}
            className={`block p-3 rounded-lg ${
              pathname === item.path
                ? "bg-blue-600"
                : "hover:bg-slate-800"
            }`}
          >
            {item.name}
          </Link>
        ))}
      </div>
    </div>
  );
}