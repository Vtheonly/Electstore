// /app/admin/layout.tsx

import { redirect } from 'next/navigation';
import { isAdminServer } from '@/lib/auth/server';
import Link from 'next/link';
import { LogOut, Package, Home } from 'lucide-react';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isAdmin = await isAdminServer();

  if (!isAdmin) {
    redirect('/admin/login');
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Admin Navigation */}
      <nav className="bg-brand-blue text-white shadow-lg">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-6">
            <h1 className="text-xl font-bold">Admin - ElectroMaison</h1>
            <div className="hidden md:flex space-x-4">
              <Link href="/admin/dashboard" className="hover:text-gray-200 transition-colors">
                Dashboard
              </Link>
              <Link href="/admin/products" className="hover:text-gray-200 transition-colors">
                Produits
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/" className="hover:text-gray-200 transition-colors">
              <Home className="h-5 w-5" />
            </Link>
            <form action="/api/auth/signout" method="post">
              <button type="submit" className="hover:text-gray-200 transition-colors">
                <LogOut className="h-5 w-5" />
              </button>
            </form>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}
