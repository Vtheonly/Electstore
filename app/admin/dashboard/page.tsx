// /app/admin/dashboard/page.tsx

import { redirect } from 'next/navigation';
import { isAdminServer } from '@/lib/auth/server';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Package, ShoppingCart, Users, TrendingUp, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { AdminNav } from '@/components/admin/AdminNav';
import { getAdminStats } from '@/lib/supabase/queries-server';
import { formatCurrency } from '@/lib/currency';

export default async function AdminDashboard() {
  const isAdmin = await isAdminServer();

  if (!isAdmin) {
    redirect('/admin/login');
  }

  const stats = await getAdminStats();

  return (
    <>
      <AdminNav />
      <main className="container mx-auto px-4 py-10 max-w-7xl">
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
          <div>
            <div className="flex items-center gap-2 text-brand-blue font-bold text-sm uppercase tracking-wider mb-1">
              <Sparkles className="h-4 w-4" />
              Espace d'administration
            </div>
            <h1 className="text-3xl md:text-4xl font-heading font-black text-brand-blue-dark">
              Ravi de vous revoir !
            </h1>
          </div>
          <div className="flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-xl text-sm font-semibold border border-green-100 self-start">
            <ShieldCheck className="h-5 w-5" />
            Mode Admin Activé
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <Card className="p-6 border-none bg-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-brand-blue/5 rounded-bl-full transition-all group-hover:scale-110 duration-300"></div>
            <div className="flex items-center justify-between relative z-10">
              <div>
                <p className="text-xs uppercase tracking-wider text-gray-400 font-bold mb-1">Produits en Ligne</p>
                <p className="text-3xl font-black text-brand-blue-dark">{stats.products}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-brand-blue/10 flex items-center justify-center text-brand-blue">
                <Package className="h-6 w-6" />
              </div>
            </div>
          </Card>

          <Card className="p-6 border-none bg-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-brand-orange/5 rounded-bl-full transition-all group-hover:scale-110 duration-300"></div>
            <div className="flex items-center justify-between relative z-10">
              <div>
                <p className="text-xs uppercase tracking-wider text-gray-400 font-bold mb-1">Commandes</p>
                <p className="text-3xl font-black text-brand-blue-dark">{stats.orders || '-'}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-brand-orange/10 flex items-center justify-center text-brand-orange">
                <ShoppingCart className="h-6 w-6" />
              </div>
            </div>
          </Card>

          <Card className="p-6 border-none bg-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-brand-blue/5 rounded-bl-full transition-all group-hover:scale-110 duration-300"></div>
            <div className="flex items-center justify-between relative z-10">
              <div>
                <p className="text-xs uppercase tracking-wider text-gray-400 font-bold mb-1">Clients Profilés</p>
                <p className="text-3xl font-black text-brand-blue-dark">{stats.clients}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-brand-blue/10 flex items-center justify-center text-brand-blue">
                <Users className="h-6 w-6" />
              </div>
            </div>
          </Card>

          <Card className="p-6 border-none bg-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-green-500/5 rounded-bl-full transition-all group-hover:scale-110 duration-300"></div>
            <div className="flex items-center justify-between relative z-10">
              <div>
                <p className="text-xs uppercase tracking-wider text-gray-400 font-bold mb-1">Estimation Revenus</p>
                <p className="text-3xl font-black text-brand-blue-dark">
                  {stats.revenue > 0 ? formatCurrency(stats.revenue) : '-'}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center text-green-600">
                <TrendingUp className="h-6 w-6" />
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <Card className="lg:col-span-2 p-8 border-none bg-white flex flex-col justify-between">
            <div>
              <h2 className="text-2xl font-heading font-bold mb-6 text-brand-blue-dark">Raccourcis de gestion</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Link href="/admin/products" className="group">
                  <div className="p-5 rounded-2xl border border-gray-100 hover:border-brand-blue/20 bg-white hover:bg-brand-blue/5 transition-all duration-300 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-brand-blue/10 flex items-center justify-center text-brand-blue">
                        <Package className="h-5 w-5" />
                      </div>
                      <div className="text-left">
                        <p className="font-bold text-brand-blue-dark">Gérer le catalogue</p>
                        <p className="text-xs text-gray-400">Modifier, ajouter ou supprimer</p>
                      </div>
                    </div>
                    <ArrowRight className="h-5 w-5 text-gray-300 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>

                <div className="p-5 rounded-2xl border border-gray-100 opacity-60 bg-gray-50 flex items-center justify-between cursor-not-allowed">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-gray-200 flex items-center justify-center text-gray-400">
                      <ShoppingCart className="h-5 w-5" />
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-gray-500">Suivre les commandes</p>
                      <p className="text-xs text-gray-400">Fonctionnalité à venir</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-5 bg-brand-blue/5 rounded-2xl border border-brand-blue/10 mt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h4 className="font-bold text-brand-blue-dark mb-1">Besoin d'ajouter de nouveaux produits ?</h4>
                <p className="text-xs text-gray-500">Créez une fiche produit avec images directement en ligne.</p>
              </div>
              <Link href="/admin/products/new">
                <Button className="rounded-xl px-6 font-bold shadow-md">
                  Nouveau Produit
                </Button>
              </Link>
            </div>
          </Card>

          {/* Info Box / Documentation */}
          <Card className="p-8 border-none bg-[#0a2540] text-white flex flex-col justify-between relative overflow-hidden">
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-brand-blue/5 rounded-full blur-2xl"></div>
            <div>
              <span className="text-[10px] uppercase font-black tracking-widest text-brand-blue/60">Documentation</span>
              <h3 className="text-2xl font-heading font-black mt-2 mb-4 leading-tight">Mise en place de votre boutique</h3>
              <p className="text-sm text-blue-100/70 leading-relaxed mb-6">
                Vos fiches produits, catégories et galeries d'images sont synchronisées en temps réel avec votre bucket de stockage. Pour modifier les visuels, utilisez l'éditeur de produit.
              </p>
            </div>
            <div className="border-t border-white/10 pt-6">
              <Link href="/" className="text-sm text-brand-blue hover:underline inline-flex items-center gap-2 font-bold">
                Voir la boutique en ligne
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </Card>
        </div>
      </main>
    </>
  );
}