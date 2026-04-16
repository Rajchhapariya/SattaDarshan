import Link from "next/link";
import { ReactNode } from "react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";

type AdminLayoutProps = {
  children: ReactNode;
};

export default async function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-100 px-4 sm:px-6 h-12 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin" className="font-bold text-sm text-gray-900">SattaDarshan Admin</Link>
          <nav className="hidden sm:flex gap-3 text-sm text-gray-500">
            <Link href="/admin/politicians" className="hover:text-gray-900">Politicians</Link>
            <Link href="/admin/parties" className="hover:text-gray-900">Parties</Link>
            <Link href="/admin/states" className="hover:text-gray-900">States</Link>
            <Link href="/admin/elections" className="hover:text-gray-900">Elections</Link>
            <Link href="/admin/users" className="hover:text-gray-900">Users</Link>
            <Link href="/admin/settings" className="hover:text-gray-900">Settings</Link>
          </nav>
        </div>
        <Link href="/" className="text-xs text-gray-400 hover:text-gray-600">← View Site</Link>
      </div>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">{children}</main>
    </div>
  );
}
