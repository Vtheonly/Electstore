// /app/admin/dashboard/page.tsx

import { redirect } from 'next/navigation';
import { isAdminServer } from '@/lib/auth/server';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Package, ShoppingCart, Users, TrendingUp } from 'lucide-react';
import { AdminNav } from '@/components/admin/AdminNav';

export default async function AdminDashboard() {
  const isAdmin = await isAdminServer();

  if (!isAdmin) {
    redirect('/admin/login');
  }

  return (
    <>
      <AdminNav />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Tableau de bord</h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Produits</p>
                <p className="text-2xl font-bold">-</p>
              </div>
              <Package className="h-10 w-10 text-brand-blue opacity-50" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Commandes</p>
                <p className="text-2xl font-bold">-</p>
              </div>
              <ShoppingCart className="h-10 w-10 text-brand-blue opacity-50" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Clients</p>
                <p className="text-2xl font-bold">-</p>
              </div>
              <Users className="h-10 w-10 text-brand-blue opacity-50" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Revenus</p>
                <p className="text-2xl font-bold">-</p>
              </div>
              <TrendingUp className="h-10 w-10 text-brand-blue opacity-50" />
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">Actions rapides</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/admin/products">
              <Button className="w-full" variant="outline">
                <Package className="h-5 w-5 mr-2" />
                Gérer les produits
              </Button>
            </Link>
            <Button className="w-full" variant="outline" disabled>
              <ShoppingCart className="h-5 w-5 mr-2" />
              Voir les commandes
            </Button>
            <Button className="w-full" variant="outline" disabled>
              <Users className="h-5 w-5 mr-2" />
              Gérer les utilisateurs
            </Button>
          </div>
        </Card>

        {/* Info Box */}
        <Card className="p-6 mt-6 bg-blue-50 border-blue-200">
          <h3 className="font-bold text-brand-blue mb-2">Configuration requise</h3>
          <p className="text-sm text-gray-700">
            Avant de commencer, assurez-vous d'avoir exécuté le script de migration de la base de données.
            Consultez le fichier <code className="bg-white px-2 py-1 rounded">supabase/DATABASE_SETUP.md</code> pour les instructions.
          </p>
        </Card>
      </main>
    </>
  );
}
