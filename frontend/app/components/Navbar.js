import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-black text-white p-4">
      <div className="max-w-6xl mx-auto flex gap-6">
        <Link href="/">Calculator</Link>
        <Link href="/leads">Leads</Link>
        <Link href="/followups">Follow-ups</Link>
      </div>
    </nav>
  );
}