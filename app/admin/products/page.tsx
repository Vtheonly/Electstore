"use client";

// /app/admin/products/page.tsx

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Product } from '@/types';
import { getProducts, deleteProduct } from '@/lib/supabase/queries-client';
import { formatCurrency } from '@/lib/currency';
import { Plus, Edit, Trash2, Package, AlertTriangle, CheckCircle, Archive } from 'lucide-react';
import { AdminNav } from '@/components/admin/AdminNav';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    setLoading(true);
    const data = await getProducts();
    setProducts(data);
    setLoading(false);
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer "${name}" ?`)) {
      return;
    }

    try {
      await deleteProduct(id);
      setProducts(products.filter(p => p.id !== id));
    } catch (error) {
      alert('Erreur lors de la suppression du produit');
    }
  }

  // Stock statistics calculations
  const outOfStockCount = products.filter(p => p.stock === 0).length;
  const lowStockCount = products.filter(p => p.stock > 0 && p.stock <= 5).length;
  const totalStockUnits = products.reduce((acc, p) => acc + p.stock, 0);

  function getStockStatus(stock: number) {
    if (stock === 0) {
      return { label: 'Rupture', color: 'bg-red-50 text-red-700 border-red-100', icon: AlertTriangle };
    } else if (stock <= 5) {
      return { label: 'Stock faible', color: 'bg-amber-50 text-amber-700 border-amber-100', icon: AlertTriangle };
    }
    return { label: 'Disponible', color: 'bg-green-50 text-green-700 border-green-100', icon: CheckCircle };
  }

  return (
    <>
      <AdminNav />
      <main className="container mx-auto px-4 py-10 max-w-7xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-heading font-black text-brand-blue-dark">Gestion de Stock</h1>
            <p className="text-gray-500 mt-1">{products.length} référence(s) enregistrée(s)</p>
          </div>
          <Link href="/admin/products/new">
            <Button className="shadow-lg shadow-brand-blue/15 px-6 rounded-xl font-bold h-12">
              <Plus className="h-5 w-5 mr-2" />
              Nouveau produit
            </Button>
          </Link>
        </div>

        {/* Stock Overview Dashboard */}
        {!loading && products.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
            <div className="bg-white p-5 rounded-2xl border border-gray-100 flex items-center gap-4 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-brand-blue/10 flex items-center justify-center text-brand-blue">
                <Archive className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Unités en Stock</p>
                <p className="text-2xl font-black text-brand-blue-dark">{totalStockUnits}</p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-gray-100 flex items-center gap-4 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Stocks Faibles (≤ 5)</p>
                <p className="text-2xl font-black text-brand-blue-dark">{lowStockCount}</p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-gray-100 flex items-center gap-4 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">En Rupture</p>
                <p className="text-2xl font-black text-brand-blue-dark">{outOfStockCount}</p>
              </div>
            </div>
          </div>
        )}

        {/* Products Table/List */}
        {loading ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-blue mx-auto"></div>
            <p className="mt-4 text-gray-500 font-medium">Chargement du catalogue...</p>
          </div>
        ) : products.length === 0 ? (
          <Card className="p-16 text-center border-dashed border-2 border-gray-200 shadow-none">
            <Package className="h-16 w-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-bold text-gray-700 mb-2">Aucun produit en stock</h3>
            <p className="text-gray-500 mb-6 max-w-sm mx-auto">Commencez par ajouter votre premier produit d'électroménager pour l'afficher en magasin.</p>
            <Link href="/admin/products/new">
              <Button className="rounded-xl px-6">Créer un produit</Button>
            </Link>
          </Card>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50/50 border-b border-gray-100 text-left">
                    <th className="py-4 px-6 font-bold text-xs uppercase tracking-wider text-gray-400">Produit</th>
                    <th className="py-4 px-4 font-bold text-xs uppercase tracking-wider text-gray-400">Catégorie</th>
                    <th className="py-4 px-4 font-bold text-xs uppercase tracking-wider text-gray-400">Prix</th>
                    <th className="py-4 px-4 font-bold text-xs uppercase tracking-wider text-gray-400 text-center">Stock</th>
                    <th className="py-4 px-4 font-bold text-xs uppercase tracking-wider text-gray-400">Statut</th>
                    <th className="py-4 px-6 font-bold text-xs uppercase tracking-wider text-gray-400 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {products.map((product) => {
                    const stockStatus = getStockStatus(product.stock);
                    const StockIcon = stockStatus.icon;
                    
                    return (
                      <tr key={product.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-xl overflow-hidden bg-gray-50 border border-gray-100 flex-shrink-0 relative">
                              {product.image_url ? (
                                <Image
                                  src={product.image_url}
                                  alt={product.name}
                                  fill
                                  className="object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gray-50">
                                  <Package className="h-6 w-6 text-gray-300" />
                                </div>
                              )}
                            </div>
                            <div className="min-w-0">
                              <p className="font-bold text-brand-blue-dark truncate max-w-[240px]">{product.name}</p>
                              {product.featured && (
                                <span className="inline-flex mt-1 text-[10px] font-black uppercase tracking-wider bg-yellow-50 text-yellow-800 border border-yellow-100 px-2 py-0.5 rounded-full">
                                  ★ Vedette
                                </span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className="text-sm font-semibold text-gray-500">{product.category}</span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex flex-col">
                            <span className="font-black text-brand-blue">{formatCurrency(product.price)}</span>
                            {product.original_price && product.original_price > product.price && (
                              <span className="text-xs text-gray-400 line-through">
                                {formatCurrency(product.original_price)}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <span className="font-black text-brand-blue-dark text-base">{product.stock}</span>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 border rounded-full text-xs font-bold ${stockStatus.color}`}>
                            <StockIcon className="h-3.5 w-3.5" />
                            {stockStatus.label}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex justify-end gap-2">
                            <Link href={`/admin/products/${product.id}/edit`}>
                              <Button variant="outline" size="sm" className="h-9 px-3 rounded-lg border-gray-200 hover:border-brand-blue/20 hover:bg-brand-blue/5">
                                <Edit className="h-4 w-4 mr-1.5" />
                                Modifier
                              </Button>
                            </Link>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-9 w-9 p-0 rounded-lg text-red-500 border-gray-200 hover:bg-red-50 hover:border-red-200"
                              onClick={() => handleDelete(product.id, product.name)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </>
  );
}