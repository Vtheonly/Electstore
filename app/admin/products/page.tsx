'use client';

// /app/admin/products/page.tsx

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Product } from '@/types';
import { getProducts, deleteProduct } from '@/lib/supabase/queries-client';
import { formatCurrency } from '@/lib/currency';
import { Plus, Edit, Trash2 } from 'lucide-react';

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

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Gestion des produits</h1>
        <Link href="/admin/products/new">
          <Button>
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
        <Card className="p-12 text-center">
          <p className="text-gray-600 mb-4">Aucun produit disponible</p>
          <Link href="/admin/products/new">
            <Button>Créer le premier produit</Button>
          </Link>
        </Card>
      ) : (
        <div className="grid gap-4">
          {products.map((product) => (
            <Card key={product.id} className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">{product.name}</h3>
                  <p className="text-sm text-gray-600">{product.category}</p>
                  <div className="flex items-center gap-4 mt-2">
                    <p className="text-brand-blue font-bold">{formatCurrency(product.price)}</p>
                    <p className="text-sm text-gray-500">Stock: {product.stock}</p>
                    {product.featured && (
                      <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                        En vedette
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link href={`/admin/products/${product.id}/edit`}>
                    <Button variant="outline" size="icon">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleDelete(product.id, product.name)}
                  >
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
