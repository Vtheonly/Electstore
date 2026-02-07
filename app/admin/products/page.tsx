'use client';

// /app/admin/products/page.tsx

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Product } from '@/types';
import { getProducts, deleteProduct } from '@/lib/supabase/queries-client';
import { formatCurrency } from '@/lib/currency';
import { Plus, Edit, Trash2, Package, AlertTriangle, CheckCircle } from 'lucide-react';
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

  function getStockStatus(stock: number) {
    if (stock === 0) {
      return { label: 'Rupture', color: 'bg-red-100 text-red-700', icon: AlertTriangle };
    } else if (stock <= 5) {
      return { label: 'Stock faible', color: 'bg-orange-100 text-orange-700', icon: AlertTriangle };
    }
    return { label: 'En stock', color: 'bg-green-100 text-green-700', icon: CheckCircle };
  }

  return (
    <>
      <AdminNav />
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestion des produits</h1>
            <p className="text-gray-600 mt-1">{products.length} produit(s) au total</p>
          </div>
          <Link href="/admin/products/new">
            <Button className="shadow-lg">
              <Plus className="h-5 w-5 mr-2" />
              Nouveau produit
            </Button>
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-blue mx-auto"></div>
            <p className="mt-4 text-gray-600">Chargement...</p>
          </div>
        ) : products.length === 0 ? (
          <Card className="p-12 text-center border-dashed border-2">
            <Package className="h-16 w-16 mx-auto text-gray-300 mb-4" />
            <p className="text-gray-600 mb-4">Aucun produit disponible</p>
            <Link href="/admin/products/new">
              <Button>Créer le premier produit</Button>
            </Link>
          </Card>
        ) : (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Produit</th>
                  <th className="text-left py-4 px-4 font-semibold text-gray-700">Catégorie</th>
                  <th className="text-left py-4 px-4 font-semibold text-gray-700">Prix</th>
                  <th className="text-left py-4 px-4 font-semibold text-gray-700">Stock</th>
                  <th className="text-left py-4 px-4 font-semibold text-gray-700">Statut</th>
                  <th className="text-right py-4 px-6 font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {products.map((product) => {
                  const stockStatus = getStockStatus(product.stock);
                  const StockIcon = stockStatus.icon;
                  
                  return (
                    <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                            {product.image_url ? (
                              <Image
                                src={product.image_url}
                                alt={product.name}
                                width={56}
                                height={56}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Package className="h-6 w-6 text-gray-400" />
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{product.name}</p>
                            {product.featured && (
                              <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">
                                ⭐ En vedette
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-gray-600">{product.category}</span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="font-bold text-brand-blue">{formatCurrency(product.price)}</span>
                        {product.original_price && product.original_price > product.price && (
                          <span className="text-sm text-gray-400 line-through ml-2">
                            {formatCurrency(product.original_price)}
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-4">
                        <span className="font-medium">{product.stock}</span>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${stockStatus.color}`}>
                          <StockIcon className="h-3.5 w-3.5" />
                          {stockStatus.label}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex justify-end gap-2">
                          <Link href={`/admin/products/${product.id}/edit`}>
                            <Button variant="outline" size="sm" className="h-9">
                              <Edit className="h-4 w-4 mr-1" />
                              Modifier
                            </Button>
                          </Link>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-9 text-red-600 hover:bg-red-50 hover:border-red-300"
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
        )}
      </main>
    </>
  );
}
